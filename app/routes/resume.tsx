import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import JobMatch from "~/components/JobMatch";
import Improvements from "~/components/Improvements";
import { extractAIText, parseAIJson } from "~/lib/ai-utils";

export const meta = () => ([
    { title: "Resumind | Review" },
    { name: "description", content: "Detailed overview of your resume" },
]);

const statusLabels: Record<ApplicationStatus, string> = {
    saved: "Saved",
    applied: "Applied",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
};

type GeneratedTool = "coverLetter" | "interviewPrep" | null;

const Resume = () => {
    const { auth, isLoading, fs, kv, ai } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [resumeData, setResumeData] = useState<Resume | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<"loading" | "processing" | "done" | "error">("loading");
    const [pollRef] = useState(useRef<ReturnType<typeof setInterval> | null>(null));
    const [generatedTool, setGeneratedTool] = useState<GeneratedTool>(null);
    const [toolError, setToolError] = useState("");
    const [saveState, setSaveState] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [auth.isAuthenticated, id, isLoading, navigate]);

    const loadResume = async () => {
        if (!id) return;
        const resume = await kv.get(`resume:${id}`);
        if (!resume) {
            setAnalysisStatus("error");
            return;
        }

        try {
            const data = JSON.parse(resume) as Resume;
            setResumeData(data);

            if (!resumeUrl) {
                const resumeBlob = await fs.read(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                    setResumeUrl(URL.createObjectURL(pdfBlob));
                }
            }

            if (!imageUrl) {
                const imageBlob = await fs.read(data.imagePath);
                if (imageBlob) setImageUrl(URL.createObjectURL(imageBlob));
            }

            if (data.feedback && typeof data.feedback === "object" && Object.keys(data.feedback).length > 0) {
                setFeedback(data.feedback);
                setAnalysisStatus("done");
                if (pollRef.current) {
                    clearInterval(pollRef.current);
                    pollRef.current = null;
                }
            } else {
                setAnalysisStatus("processing");
            }
        } catch {
            setAnalysisStatus("error");
        }
    };

    useEffect(() => {
        loadResume();
        pollRef.current = setInterval(loadResume, 5000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [id]);

    const updateResume = async (changes: Partial<Resume>) => {
        if (!resumeData || !id) return;
        const updated = { ...resumeData, ...changes };
        setResumeData(updated);
        setSaveState("Saving...");
        await kv.set(`resume:${id}`, JSON.stringify(updated));
        setSaveState("Saved");
        window.setTimeout(() => setSaveState(""), 1800);
    };

    const generateTool = async (tool: Exclude<GeneratedTool, null>) => {
        if (!resumeData) return;

        setGeneratedTool(tool);
        setToolError("");
        setSaveState("");

        const prompt = tool === "coverLetter"
            ? `Write a tailored, professional cover letter for the ${resumeData.jobTitle || "role"} position at ${resumeData.companyName || "the company"}.
Use the attached resume and job description below. Keep it between 250 and 400 words, avoid inventing experience, and return only JSON in this format:
{"coverLetter":"..."}

Job description:
${resumeData.jobDescription || "Not provided"}`
            : `Create interview preparation for the ${resumeData.jobTitle || "role"} position at ${resumeData.companyName || "the company"}.
Use the attached resume and job description. Return 6 high-value questions with concise answer guidance grounded in the candidate's real experience. Return only JSON in this format:
{"questions":[{"question":"...","answerGuide":"..."}]}

Job description:
${resumeData.jobDescription || "Not provided"}`;

        try {
            const response = await ai.chat(
                [{
                    role: "user",
                    content: [
                        { type: "file", puter_path: resumeData.resumePath },
                        { type: "text", text: prompt },
                    ],
                }],
                { model: "gpt-4o-mini" },
            );
            const text = extractAIText(response);
            if (!text) throw new Error("The AI returned an empty response.");

            if (tool === "coverLetter") {
                let coverLetter = text;
                try {
                    coverLetter = parseAIJson<{ coverLetter: string }>(text).coverLetter || text;
                } catch {
                    // Keep the plain response if the model did not wrap it in JSON.
                }
                await updateResume({ coverLetter });
            } else {
                let interviewPrep: InterviewQuestion[];
                try {
                    interviewPrep = parseAIJson<{ questions: InterviewQuestion[] }>(text).questions;
                } catch {
                    interviewPrep = [{ question: "Interview preparation", answerGuide: text }];
                }
                await updateResume({ interviewPrep });
            }
        } catch (error) {
            setToolError(error instanceof Error ? error.message : "Unable to generate this tool right now.");
        } finally {
            setGeneratedTool(null);
        }
    };

    const copyText = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setSaveState("Copied to clipboard");
        window.setTimeout(() => setSaveState(""), 1800);
    };

    const downloadReport = () => {
        if (!resumeData || !feedback) return;
        const report = [
            `RESUMIND REVIEW`,
            `${resumeData.companyName || "Company"} — ${resumeData.jobTitle || "Role"}`,
            `Overall score: ${feedback.overallScore}/100`,
            `ATS score: ${feedback.ATS.score}/100`,
            feedback.jobMatch ? `Job match: ${feedback.jobMatch.score}/100` : "",
            "",
            "SUMMARY",
            feedback.jobMatch?.summary || "Review the score breakdown in the app.",
            "",
            "QUICK WINS",
            ...(feedback.improvements?.quickWins || []),
            "",
            "COVER LETTER",
            resumeData.coverLetter || "Generate a cover letter in the app.",
        ].filter(Boolean).join("\n");

        const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `resumind-review-${resumeData.jobTitle || "resume"}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
                {feedback && (
                    <button type="button" onClick={downloadReport} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                        Download review
                    </button>
                )}
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img src={imageUrl} className="w-full h-full object-contain rounded-2xl" title="Resume preview" alt="Uploaded resume preview" />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                        {saveState && <span className="text-sm text-gray-500">{saveState}</span>}
                    </div>

                    {resumeData && (
                        <section className="rounded-2xl bg-white p-5 shadow-md">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Application tracker</p>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {resumeData.companyName || "Your application"}{resumeData.jobTitle ? ` · ${resumeData.jobTitle}` : ""}
                                    </h3>
                                </div>
                                <select
                                    value={resumeData.status || "saved"}
                                    onChange={(event) => updateResume({ status: event.target.value as ApplicationStatus })}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-semibold text-gray-700"
                                    aria-label="Application status"
                                >
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                className="mt-4 min-h-20 w-full rounded-xl border border-gray-200 p-3 text-sm"
                                placeholder="Add a note about this application, recruiter, interview, or next step..."
                                value={resumeData.notes || ""}
                                onChange={(event) => setResumeData({ ...resumeData, notes: event.target.value })}
                                onBlur={() => updateResume({ notes: resumeData.notes || "" })}
                                aria-label="Application notes"
                            />
                        </section>
                    )}

                    {analysisStatus === "done" && feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            {feedback.jobMatch && <JobMatch match={feedback.jobMatch} />}
                            {feedback.improvements && <Improvements improvements={feedback.improvements} />}
                            <Details feedback={feedback} />

                            <section className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-md">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Application toolkit</p>
                                    <h2 className="text-2xl font-bold text-gray-900">Prepare for the next step</h2>
                                    <p className="mt-1 text-gray-600">Generate tailored materials from this resume and role.</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <button type="button" onClick={() => generateTool("coverLetter")} className="primary-button">
                                        {generatedTool === "coverLetter" ? "Generating..." : "Generate cover letter"}
                                    </button>
                                    <button type="button" onClick={() => generateTool("interviewPrep")} className="rounded-full border border-indigo-200 px-4 py-2 font-semibold text-indigo-700">
                                        {generatedTool === "interviewPrep" ? "Preparing..." : "Prepare for interview"}
                                    </button>
                                </div>
                                {toolError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{toolError}</p>}

                                {resumeData?.coverLetter && (
                                    <div className="rounded-xl border border-gray-200 p-4">
                                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="font-semibold text-gray-900">Cover letter</h3>
                                            <button type="button" onClick={() => copyText(resumeData.coverLetter || "")} className="text-sm font-semibold text-indigo-600">Copy</button>
                                        </div>
                                        <p className="whitespace-pre-line leading-7 text-gray-700">{resumeData.coverLetter}</p>
                                    </div>
                                )}

                                {resumeData?.interviewPrep && (
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-semibold text-gray-900">Interview preparation</h3>
                                        {resumeData.interviewPrep.map((item, index) => (
                                            <div key={`${item.question}-${index}`} className="rounded-xl bg-gray-50 p-4">
                                                <p className="font-semibold text-gray-900">{index + 1}. {item.question}</p>
                                                <p className="mt-2 text-gray-600">{item.answerGuide}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : analysisStatus === "processing" ? (
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Analysis in progress" />
                            <p className="text-gray-500 text-center">
                                AI analysis is still running — this can take 1–2 minutes.<br />
                                This page will update automatically when it&apos;s ready.
                            </p>
                        </div>
                    ) : analysisStatus === "error" ? (
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <p className="text-red-500 text-center">Could not load this resume. It may have been deleted.</p>
                            <Link to="/upload" className="primary-button w-fit">Upload a new resume</Link>
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" alt="Loading resume review" />
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;