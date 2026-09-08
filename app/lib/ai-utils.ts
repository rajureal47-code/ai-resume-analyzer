export const extractAIText = (response: AIResponse | undefined): string => {
    if (!response) return "";

    const content = response.message?.content;
    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
        return content
            .map((item) => typeof item === "string" ? item : item?.text || "")
            .join("")
            .trim();
    }

    return "";
};

export const parseAIJson = <T,>(value: string): T => {
    const cleaned = value
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    return JSON.parse(cleaned) as T;
};