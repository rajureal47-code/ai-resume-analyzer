import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<'loading' | 'processing' | 'done' | 'error'>('loading');
    const navigate = useNavigate();
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    const loadResume = async () => {
        const resume = await kv.get(`resume:${id}`);
        if(!resume) {
            setAnalysisStatus('error');
            return;
        }

        const data = JSON.parse(resume);

        // Load files only once (imageUrl/resumeUrl won't change)
        if (!resumeUrl) {
            const resumeBlob = await fs.read(data.resumePath);
            if(resumeBlob) {
                const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                setResumeUrl(URL.createObjectURL(pdfBlob));
            }
        }

        if (!imageUrl) {
            const imageBlob = await fs.read(data.imagePath);
            if(imageBlob) {
                setImageUrl(URL.createObjectURL(imageBlob));
            }
        }

        // feedback is saved as '' initially, then replaced with the object
        if (data.feedback && typeof data.feedback === 'object' && Object.keys(data.feedback).length > 0) {
            setFeedback(data.feedback);
            setAnalysisStatus('done');
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        } else {
            // Still processing — start polling if not already
            setAnalysisStatus('processing');
        }
    }

    useEffect(() => {
        loadResume();

        // Poll every 5 seconds in case analysis finishes while we're on this page
        pollRef.current = setInterval(() => {
            loadResume();
        }, 5000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {analysisStatus === 'done' && feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : analysisStatus === 'processing' ? (
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
                            <p className="text-gray-500 text-center">
                                AI analysis is still running — this can take 1–2 minutes.<br />
                                This page will update automatically when it's ready.
                            </p>
                        </div>
                    ) : analysisStatus === 'error' ? (
                        <div className="flex flex-col items-center gap-4 mt-8">
                            <p className="text-red-500 text-center">Could not load this resume. It may have been deleted.</p>
                            <Link to="/upload" className="primary-button w-fit">Upload a new resume</Link>
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
