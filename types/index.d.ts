interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback | null;
    status?: ApplicationStatus;
    notes?: string;
    createdAt?: number;
    coverLetter?: string;
    interviewPrep?: InterviewQuestion[];
}

type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

interface InterviewQuestion {
    question: string;
    answerGuide: string;
}

interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    jobMatch?: {
        score: number;
        summary: string;
        matchedKeywords: string[];
        missingKeywords: string[];
        recommendedKeywords: string[];
    };
    improvements?: {
        summaryRewrite: string;
        bulletRewrites: {
            before: string;
            after: string;
        }[];
        quickWins: string[];
    };
}
