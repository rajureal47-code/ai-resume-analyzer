import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({ resume }: { resume: Resume }) => {
    const { id, companyName, jobTitle, feedback, imagePath, resumePath } = resume;
    const { fs, puterReady } = usePuterStore();
    const [preview, setPreview] = useState<{ url: string; type: 'image' | 'pdf' } | null>(null);

    useEffect(() => {
        if (!puterReady) return;
        let cancelled = false;
        let objectUrl = '';

        const loadResume = async () => {
            try {
                if (imagePath) {
                    const imageBlob = await fs.read(imagePath);
                    if (imageBlob) {
                        objectUrl = URL.createObjectURL(imageBlob);
                        if (!cancelled) setPreview({ url: objectUrl, type: 'image' });
                        return;
                    }
                }

                if (resumePath) {
                    const pdfBlob = await fs.read(resumePath);
                    if (pdfBlob) {
                        objectUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
                        if (!cancelled) setPreview({ url: objectUrl, type: 'pdf' });
                    }
                }
            } catch {
                if (!cancelled) setPreview(null);
            }
        };

        loadResume();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [fs, imagePath, puterReady, resumePath]);

    return (
        <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback?.overallScore || 0} />
                </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium capitalize text-indigo-700">
                    {(resume.status || "saved").replace("-", " ")}
                </span>
                {resume.createdAt && (
                    <span className="text-gray-400">
                        {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                )}
            </div>
            {preview && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="h-[350px] w-full overflow-hidden rounded-xl bg-gray-50 max-sm:h-[200px]">
                        {preview.type === 'image' ? (
                            <img
                                src={preview.url}
                                alt="Resume preview"
                                className="h-full w-full object-cover object-top"
                            />
                        ) : (
                            <iframe
                                src={`${preview.url}#page=1&view=FitH`}
                                title="Resume PDF preview"
                                className="h-full w-full border-0"
                            />
                        )}
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
