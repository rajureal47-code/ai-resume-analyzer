import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import CompanyLogos from "~/components/CompanyLogos";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useMemo, useState} from "react";

const trackerStatuses: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All applications" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

       const parsedResumes = resumes?.flatMap((resume) => {
         try {
           return [JSON.parse(resume.value) as Resume];
         } catch {
           return [];
         }
       })

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  const visibleResumes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return resumes.filter((resume) => {
      const matchesStatus = statusFilter === "all" || (resume.status || "saved") === statusFilter;
      const matchesSearch = !normalizedSearch ||
        `${resume.companyName || ""} ${resume.jobTitle || ""}`.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [resumes, search, statusFilter]);

  const statusCount = (status: ApplicationStatus) =>
    resumes.filter((resume) => (resume.status || "saved") === status).length;

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      <CompanyLogos />

      <section className="grid w-full max-w-[1200px] grid-cols-2 gap-3 md:grid-cols-5">
        {(["saved", "applied", "interview", "offer", "rejected"] as ApplicationStatus[]).map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-2xl border p-4 text-left transition ${statusFilter === status ? "border-indigo-400 bg-indigo-50" : "border-gray-100 bg-white"}`}
          >
            <p className="text-2xl font-bold text-gray-900">{statusCount(status)}</p>
            <p className="text-sm capitalize text-gray-500">{status}</p>
          </button>
        ))}
      </section>

      {!loadingResumes && resumes.length > 0 && (
        <div className="flex w-full max-w-[1200px] flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company or job title..."
            className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3"
            aria-label="Search applications"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ApplicationStatus | "all")}
            className="rounded-full border border-gray-200 bg-white px-5 py-3 text-gray-700"
            aria-label="Filter applications by status"
          >
            {trackerStatuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      )}

      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

       {!loadingResumes && visibleResumes.length > 0 && (
        <div className="resumes-section">
           {visibleResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

       {!loadingResumes && resumes.length > 0 && visibleResumes.length === 0 && (
         <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
           <p className="text-gray-500">No applications match your search or filter.</p>
           <button type="button" onClick={() => { setSearch(""); setStatusFilter("all"); }} className="primary-button w-fit">
             Clear filters
           </button>
         </div>
       )}

       {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}
