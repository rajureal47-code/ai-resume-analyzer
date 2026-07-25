# AI Resume Analyzer

An AI-powered resume analyzer built with React, React Router v7, and Puter.js. Users can authenticate, upload and store resumes, and get ATS scores + AI feedback matched against job listings — all running entirely in the browser with no backend required.

## Tech Stack

- **React 19** + **React Router v7** — UI and routing
- **Puter.js** — serverless auth, cloud storage, and AI (no backend needed)
- **Tailwind CSS v4** — styling
- **TypeScript** — type safety
- **Vite** — dev server and build tool
- **Zustand** — global state management

## Running the App

```bash
npm run dev
```

The dev server starts on **port 5000**. The configured workflow (`Start application`) handles this automatically.

## Notes

- No API keys or secrets are required — Puter.js handles auth and AI at the user level
- The `tar` package is overridden to `^7.5.22` in `package.json` to satisfy Replit's security policy (transitive dep from `@tailwindcss/oxide`)
- Vite is configured with `allowedHosts: true` and `host: "0.0.0.0"` for Replit's proxied preview

## User Preferences

_No preferences recorded yet._
