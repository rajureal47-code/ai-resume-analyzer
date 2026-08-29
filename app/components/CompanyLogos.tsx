import type { ReactNode } from "react";

const companies = [
    {
        name: "Google",
        color: "#4285F4",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
        ),
    },
    {
        name: "Apple",
        color: "#000000",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
        ),
    },
    {
        name: "Amazon",
        color: "#FF9900",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <text x="3" y="17" fill="#FF9900" fontSize="17" fontWeight="700" fontFamily="Arial, sans-serif">a</text>
                <path d="M4 19c4.2 2.2 10.7 2.5 16 .1" fill="none" stroke="#FF9900" strokeWidth="1.35" strokeLinecap="round"/>
                <path d="m18.3 17.6 2.1 1.4-2.5.3" fill="#FF9900"/>
            </svg>
        ),
    },
    {
        name: "Netflix",
        color: "#E50914",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 2h4.5L16.5 17V2H21v20h-4.5l-9-15v15H3V2Z" fill="#E50914"/>
            </svg>
        ),
    },
    {
        name: "Meta",
        color: "#0866FF",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 17.5C2.6 17.5 1 15.2 1 12s1.6-5.5 3.5-5.5c2.2 0 4.2 3.2 7.5 8 3.3-4.8 5.3-8 7.5-8 1.9 0 3.5 2.3 3.5 5.5s-1.6 5.5-3.5 5.5c-2.2 0-4.2-3.2-7.5-8-3.3 4.8-5.3 8-7.5 8Zm0-8c-.5 0-1 .9-1 2.5s.5 2.5 1 2.5 1.8-1.6 3.4-4C6.3 11.1 5 9.5 4.5 9.5Zm15 0c-.5 0-1.8 1.6-3.4 4 1.6 2.4 2.9 4 3.4 4 .5 0 1-.9 1-2.5s-.5-2.5-1-2.5Z" fill="none" stroke="#0866FF" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        name: "Microsoft",
        color: "#00A4EF",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4 24H0V12.6h11.4V24z" fill="#F25022"/>
                <path d="M24 24H12.6V12.6H24V24z" fill="#00A4EF"/>
                <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#7FBA00"/>
                <path d="M24 11.4H12.6V0H24v11.4z" fill="#FFB900"/>
            </svg>
        ),
    },
    {
        name: "Uber",
        color: "#000000",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h4v8.7c0 2.2 1.4 3.5 4 3.5s4-1.3 4-3.5V4h4v8.8c0 4.5-3 7.2-8 7.2s-8-2.7-8-7.2V4Z" fill="#000000"/>
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        color: "#0A66C2",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
            </svg>
        ),
    },
    {
        name: "Spotify",
        color: "#1DB954",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="#1DB954"/>
            </svg>
        ),
    },
    {
        name: "Stripe",
        color: "#635BFF",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="#635BFF"/>
            </svg>
        ),
    },
    {
        name: "OpenAI",
        color: "#000000",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.001 14.5A4.5 4.5 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387 2.019-1.168a.076.076 0 0 1 .071 0l4.818 2.769a4.496 4.496 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.641zm2.01-3.055l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.218V6.886a.071.071 0 0 1 .028-.061l4.83-2.789a4.496 4.496 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#000"/>
            </svg>
        ),
    },
    {
        name: "Airbnb",
        color: "#FF5A5F",
        svg: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.5c-2.5 0-4.1 2.3-5.6 5.4C5 10 2.4 14.7 2.4 17.6c0 3.2 2.2 5 5 5 1.7 0 3.2-.8 4.6-2.8 1.4 2 2.9 2.8 4.6 2.8 2.8 0 5-1.8 5-5 0-2.9-2.6-7.6-4-10.7-1.5-3.1-3.1-5.4-5.6-5.4Zm-4.6 18.8c-1.5 0-2.5-1-2.5-2.7 0-1.7 1.2-4.2 2.4-6.8.8 1.2 2.2 3.3 3.4 5.5-1 2.6-2 4-3.3 4Zm9.2 0c-1.3 0-2.3-1.4-3.3-4 1.2-2.2 2.6-4.3 3.4-5.5 1.2 2.6 2.4 5.1 2.4 6.8 0 1.7-1 2.7-2.5 2.7ZM12 15c-1-1.8-2.2-3.8-3.3-5.6.9-2.1 2-4.9 3.3-4.9s2.4 2.8 3.3 4.9C14.2 11.2 13 13.2 12 15Z" fill="#FF5A5F"/>
            </svg>
        ),
    },
];

const LogoItem = ({ name, svg }: { name: string; svg: ReactNode }) => (
    <div className="flex h-12 items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm shrink-0 hover:shadow-md hover:scale-105 transition-all duration-200">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
            {svg}
        </span>
        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{name}</span>
    </div>
);

export default function CompanyLogos() {
    return (
        <div className="w-full py-10">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
                Get hired at the world's top companies
            </p>

            <div className="relative overflow-hidden">
                {/* Fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-28 z-10 bg-gradient-to-r from-white to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-28 z-10 bg-gradient-to-l from-white to-transparent" />

                <div className="flex w-max gap-3 animate-marquee">
                    <div className="flex shrink-0 gap-3" aria-hidden="true">
                        {companies.map((c) => (
                            <LogoItem key={c.name} name={c.name} svg={c.svg} />
                        ))}
                    </div>
                    <div className="flex shrink-0 gap-3">
                        {companies.map((c) => (
                            <LogoItem key={`${c.name}-duplicate`} name={c.name} svg={c.svg} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
