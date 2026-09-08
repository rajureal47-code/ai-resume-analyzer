const KeywordList = ({
    title,
    keywords,
    tone,
}: {
    title: string;
    keywords: string[];
    tone: "green" | "amber" | "blue";
}) => {
    const toneClasses = {
        green: "bg-green-50 text-green-700 border-green-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
    };

    return (
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {keywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                        <span
                            key={keyword}
                            className={`rounded-full border px-3 py-1 text-sm ${toneClasses[tone]}`}
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">None identified</p>
            )}
        </div>
    );
};

const JobMatch = ({ match }: { match: NonNullable<Feedback["jobMatch"]> }) => {
    const scoreTone = match.score >= 70 ? "text-green-600" : match.score >= 50 ? "text-amber-600" : "text-red-600";

    return (
        <section className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Job match</p>
                    <h2 className="text-2xl font-bold text-gray-900">How well your resume fits this role</h2>
                </div>
                <div className={`text-4xl font-bold ${scoreTone}`}>{match.score}/100</div>
            </div>
            <p className="rounded-xl bg-gray-50 p-4 text-gray-700">{match.summary}</p>
            <div className="grid gap-6 md:grid-cols-3">
                <KeywordList title="Matched keywords" keywords={match.matchedKeywords || []} tone="green" />
                <KeywordList title="Missing keywords" keywords={match.missingKeywords || []} tone="amber" />
                <KeywordList title="Use where truthful" keywords={match.recommendedKeywords || []} tone="blue" />
            </div>
        </section>
    );
};

export default JobMatch;