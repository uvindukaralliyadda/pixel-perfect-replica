import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Inbox, MapPin, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CandidateTable } from "@/components/erp/CandidateTable";
import { CandidateSheet } from "@/components/erp/CandidateSheet";
import type { SheetTab } from "@/components/erp/RowActions";
import { useShortlist } from "@/components/erp/ConfirmMoveDialog";
import { EmptyState } from "@/components/erp/EmptyState";
import { matchesQuery } from "@/components/erp/StageTab";
import { JOBS, stageById, type Candidate } from "@/data/mock";
import { useCandidates } from "@/data/store";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/app/applied")({
  head: () => ({
    meta: [
      { title: "Applied — Recruit ERP" },
      { name: "description", content: "Pick a job to see the CVs that applied." },
      { property: "og:title", content: "Applied — Recruit ERP" },
      { property: "og:description", content: "Pick a job to see the CVs that applied." },
    ],
  }),
  component: AppliedPage,
});

function SearchBox({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  return (
    <div className="relative max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} aria-hidden />
      <Input type="search" aria-label={label} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 rounded-button border-[1.5px] bg-card pl-12" />
    </div>
  );
}

function AppliedPage() {
  const cfg = stageById("applied");
  const all = useCandidates();
  const [jobId, setJobId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState<{ id: string; tab: SheetTab } | null>(null);
  const { requestMove, dialog } = useShortlist();

  const applied = useMemo(() => all.filter((c) => c.stage === "applied"), [all]);
  const job = jobId ? JOBS.find((j) => j.id === jobId) ?? null : null;

  const cards = useMemo(
    () =>
      JOBS.filter((j) => j.status !== "pending")
        .map((j) => {
          const rows = applied.filter((c) => c.jobId === j.id);
          const newest = rows.reduce((m, c) => (c.appliedAt > m ? c.appliedAt : m), "");
          return { job: j, count: rows.length, newest };
        })
        .filter(({ job: j }) => !q.trim() || `${j.title} ${j.country}`.toLowerCase().includes(q.trim().toLowerCase())),
    [applied, q],
  );

  const rows = useMemo(
    () =>
      job
        ? applied
            .filter((c) => c.jobId === job.id && matchesQuery(c, q))
            .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
        : [],
    [applied, job, q],
  );

  const open = (id: string | null) => {
    setJobId(id);
    setQ("");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <cfg.icon className="size-7" strokeWidth={1.25} aria-hidden />
        </span>
        <div>
          <h2 className="page-title flex items-center gap-3">
            Applied
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2.5 text-sm font-bold text-primary-foreground" aria-label={`${applied.length} candidates`}>
              {applied.length}
            </span>
          </h2>
          <p className="mt-1 text-muted-foreground">{cfg.subtitle}</p>
        </div>
      </header>

      {!job ? (
        <>
          <SearchBox value={q} onChange={setQ} label="Search jobs" placeholder="Search job title or country" />
          {cards.length === 0 ? (
            <EmptyState icon={SearchX} title="No jobs match" description="Try a different search." compact />
          ) : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {cards.map(({ job: j, count, newest }) => (
                <li key={j.id}>
                  <button
                    type="button"
                    onClick={() => open(j.id)}
                    aria-label={`${j.title}, ${j.country}: ${count} applied CVs`}
                    className="lift group flex w-full items-center gap-5 rounded-2xl border border-border bg-card p-6 text-left hover:border-primary"
                  >
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
                      <Inbox className="size-7" strokeWidth={1.25} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xl font-bold tracking-tight">{j.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="size-4" strokeWidth={1.5} aria-hidden /> {j.country}</span>
                        <span>{j.openings} vacancies</span>
                        <span>{newest ? `Newest ${fmtDate(newest)}` : "No applications yet"}</span>
                      </span>
                    </span>
                    <span className="flex flex-col items-center">
                      <span className="text-3xl font-extrabold leading-none">{count}</span>
                      <span className="mt-1 text-xs text-muted-foreground">CVs</span>
                    </span>
                    <ChevronRight className="size-6 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" onClick={() => open(null)}>
              <ArrowLeft strokeWidth={1.75} /> Back
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <button type="button" onClick={() => open(null)}>Applied</button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{job.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <SearchBox value={q} onChange={setQ} label="Search applicants" placeholder="Search name, NIC, phone or tracking ID" />
          {rows.length === 0 ? (
            <EmptyState icon={q ? SearchX : Inbox} title={q ? "No matches" : "No candidates here yet"} description={q ? "Try a different search." : "New applications for this job will show up here."} compact />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-2">
              <CandidateTable rows={rows} variant="applied" onView={(c: Candidate, tab: SheetTab = "details") => setSheet({ id: c.id, tab })} onShortlist={requestMove} />
            </div>
          )}
        </>
      )}

      <CandidateSheet candidateId={sheet?.id ?? null} tab={sheet?.tab} onClose={() => setSheet(null)} />
      {dialog}
    </div>
  );
}
