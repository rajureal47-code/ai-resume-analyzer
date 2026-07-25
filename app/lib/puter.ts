/**
 * Local mock of Puter services – no auth required, no React imports.
 *
 * usePuterStore() is a plain function (not a hook) that returns a static
 * store object. The app treats it identically to the original Zustand hook
 * because the mock store never needs to trigger re-renders.
 */

// ---------------------------------------------------------------------------
// In-memory file store (lives for the browser session)
// ---------------------------------------------------------------------------
const fileStore = new Map<string, Blob>();

function fakePath(file: File | Blob): string {
  const name = file instanceof File ? file.name : `blob-${Date.now()}`;
  return `/local/${Date.now()}-${name}`;
}

// ---------------------------------------------------------------------------
// LocalStorage KV (SSR-safe)
// ---------------------------------------------------------------------------
const PREFIX = "resumind:";
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

function kvKey(k: string) { return PREFIX + k; }

function listKeys(pattern: string): string[] {
  if (!isBrowser) return [];
  const regex = new RegExp(
    "^" + pattern.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace(/\*/g, ".*") + "$"
  );
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const raw = localStorage.key(i)!;
    if (!raw.startsWith(PREFIX)) continue;
    const k = raw.slice(PREFIX.length);
    if (regex.test(k)) keys.push(k);
  }
  return keys;
}

// ---------------------------------------------------------------------------
// Mock AI feedback
// ---------------------------------------------------------------------------
const mockFeedback = {
  overallScore: 78,
  ATS: {
    score: 82,
    tips: [
      { type: "good" as const, tip: "Clear section headings detected by ATS parsers" },
      { type: "good" as const, tip: "Contact information is in a standard, parseable location" },
      { type: "improve" as const, tip: "Add more role-specific keywords from the job description" },
      { type: "improve" as const, tip: "Avoid tables and text boxes — some ATS tools skip them" },
    ],
  },
  toneAndStyle: {
    score: 75,
    tips: [
      { type: "good" as const, tip: "Action-oriented language", explanation: "Bullet points start with strong action verbs like 'Led', 'Built', and 'Optimised', which read well to both humans and automated screeners." },
      { type: "improve" as const, tip: "Reduce passive voice", explanation: "Several sentences use passive constructions ('was responsible for'). Rewrite as 'Managed…' or 'Delivered…' to show ownership." },
      { type: "improve" as const, tip: "Consistent tense throughout", explanation: "Past roles should use past tense and current roles present tense. A few bullets mix tenses within the same position." },
    ],
  },
  content: {
    score: 80,
    tips: [
      { type: "good" as const, tip: "Quantified achievements", explanation: "Metrics like percentages and user counts make impact concrete and memorable for recruiters." },
      { type: "improve" as const, tip: "Add a concise professional summary", explanation: "A 2–3 sentence summary at the top lets recruiters quickly assess fit before reading the full resume." },
      { type: "improve" as const, tip: "Tailor experience bullets to the target role", explanation: "Several achievements are generic. Highlight work most relevant to the specific job description for a higher match rate." },
    ],
  },
  structure: {
    score: 85,
    tips: [
      { type: "good" as const, tip: "Logical, standard section order", explanation: "Experience → Education → Skills follows the format most recruiters expect, making it easy to scan." },
      { type: "improve" as const, tip: "Move Skills section higher", explanation: "For technical roles, placing Skills near the top lets screeners confirm required tools at a glance without scrolling." },
      { type: "improve" as const, tip: "Keep to a single page if under 5 years of experience", explanation: "Concise single-page resumes are preferred for junior-to-mid roles; trim older or less relevant positions." },
    ],
  },
  skills: {
    score: 70,
    tips: [
      { type: "good" as const, tip: "Relevant technical stack listed", explanation: "Core technologies expected for the role are present, which helps ATS keyword matching." },
      { type: "improve" as const, tip: "Group skills into categories", explanation: "Separating 'Languages', 'Frameworks', and 'Tools' makes the section easier to scan than a flat comma-separated list." },
      { type: "improve" as const, tip: "Remove outdated or irrelevant tools", explanation: "Listing obsolete technologies can date your resume. Focus on skills relevant to the target role." },
    ],
  },
};

// ---------------------------------------------------------------------------
// The store — plain object, zero React dependencies
// ---------------------------------------------------------------------------
const demoUser: PuterUser = { username: "demo", uuid: "local-demo" } as PuterUser;

const store = {
  isLoading: false,
  error: null as string | null,
  puterReady: true,

  auth: {
    user: demoUser,
    isAuthenticated: true,
    signIn: async () => {},
    signOut: async () => {},
    refreshUser: async () => {},
    checkAuthStatus: async () => true,
    getUser: () => demoUser,
  },

  fs: {
    write: async (path: string, data: string | File | Blob) => {
      fileStore.set(path, typeof data === "string" ? new Blob([data]) : data);
      return undefined as File | undefined;
    },
    read: async (path: string) => fileStore.get(path),
    readDir: async (_path: string) => [] as FSItem[],
    upload: async (files: File[] | Blob[]) => {
      const file = files[0];
      if (!file) return undefined;
      const path = fakePath(file);
      fileStore.set(path, file);
      return { path, name: file instanceof File ? file.name : "file" } as unknown as FSItem;
    },
    delete: async (path: string) => { fileStore.delete(path); },
  },

  ai: {
    chat: async () => undefined as AIResponse | undefined,
    feedback: async (_path: string, _message: string): Promise<AIResponse | undefined> => {
      // Brief delay so the scanning animation plays
      await new Promise((r) => setTimeout(r, 2500));
      return { message: { content: JSON.stringify(mockFeedback) } } as unknown as AIResponse;
    },
    img2txt: async () => "" as string | undefined,
  },

  kv: {
    get: async (key: string) => isBrowser ? localStorage.getItem(kvKey(key)) : null,
    set: async (key: string, value: string) => {
      if (isBrowser) localStorage.setItem(kvKey(key), value);
      return true as boolean | undefined;
    },
    delete: async (key: string) => {
      if (isBrowser) localStorage.removeItem(kvKey(key));
      return true as boolean | undefined;
    },
    list: async (pattern: string, returnValues?: boolean): Promise<string[] | KVItem[] | undefined> => {
      const keys = listKeys(pattern);
      if (!returnValues) return keys;
      return keys.map((k) => ({ key: k, value: localStorage.getItem(kvKey(k)) ?? "" }));
    },
    flush: async () => {
      listKeys("*").forEach((k) => localStorage.removeItem(kvKey(k)));
      return true as boolean | undefined;
    },
  },

  init: () => {},
  clearError: () => {},
};

/**
 * Drop-in replacement for the old Zustand usePuterStore hook.
 * Returns the same static store every call — no React involved.
 */
export function usePuterStore() {
  return store;
}
