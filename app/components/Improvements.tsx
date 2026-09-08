const Improvements = ({ improvements }: { improvements: NonNullable<Feedback["improvements"]> }) => {
    return (
        <section className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-md">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Rewrite assistant</p>
                <h2 className="text-2xl font-bold text-gray-900">Practical improvements you can apply</h2>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                <h3 className="mb-2 font-semibold text-indigo-950">Suggested professional summary</h3>
                <p className="leading-7 text-indigo-900">{improvements.summaryRewrite}</p>
            </div>

            {improvements.bulletRewrites?.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h3 className="font-semibold text-gray-900">Experience bullet rewrites</h3>
                    {improvements.bulletRewrites.map((rewrite, index) => (
                        <div key={`${rewrite.before}-${index}`} className="grid gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-2">
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Current</p>
                                <p className="text-gray-600">{rewrite.before}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Suggested</p>
                                <p className="font-medium text-gray-900">{rewrite.after}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {improvements.quickWins?.length > 0 && (
                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Quick wins</h3>
                    <ul className="flex flex-col gap-2">
                        {improvements.quickWins.map((win) => (
                            <li key={win} className="flex gap-2 text-gray-700">
                                <span className="text-indigo-500">✓</span>
                                <span>{win}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default Improvements;