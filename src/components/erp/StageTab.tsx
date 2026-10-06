import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { EmptyState } from "@/components/erp/EmptyState";
import { CandidateTable } from "@/components/erp/CandidateTable";
import { JobGroupList } from "@/components/erp/JobGroupList";
import { CandidateSheet } from "@/components/erp/CandidateSheet";
import type { OpenSheet, SheetTab } from "@/components/erp/RowActions";
import { useShortlist } from "@/components/erp/ConfirmMoveDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JOBS, stageById, type Candidate, type StageId } from "@/data/mock";
import { useCandidates } from "@/data/store";
import { enteredStageAt } from "@/lib/format";

type Sort = "newest" | "oldest" | "name";

export function matchesQuery(c: Candidate, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  const digits = s.replace(/\s+/g, "");
  return (
    c.fullName.toLowerCase().includes(s) ||
    c.nic.toLowerCase().includes(s) ||
    c.trackingId.toLowerCase().includes(s) ||
    c.phone.replace(/\s+/g, "").includes(digits)
  );
}

export function StageTab({ stage }: { stage: Exclude<StageId, "applied"> }) {
  const cfg = stageById(stage);
  const all = useCandidates();
  const [q, setQ] = useState("");
  const [jobId, setJobId] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [sheet, setSheet] = useState<{ id: string; tab: SheetTab } | null>(null);
  const { requestMove, dialog } = useShortlist();

  const inStage = useMemo(() => all.filter((c) => c.stage === stage), [all, stage]);
  const jobsHere = useMemo(() => JOBS.filter((j) => inStage.some((c) => c.jobId === j.id)), [inStage]);

  const activeJob = jobsHere.some((j) => j.id === jobId) ? jobId : "all";

  const rows = useMemo(() => {
    const list = inStage.filter((c) => (activeJob === "all" || c.jobId === activeJob) && matchesQuery(c, q));
    return list.sort((a, b) =>
      sort === "name"
        ? a.fullName.localeCompare(b.fullName)
        : sort === "oldest"
          ? enteredStageAt(a).localeCompare(enteredStageAt(b))
          : enteredStageAt(b).localeCompare(enteredStageAt(a)),
    );
  }, [inStage, activeJob, q, sort]);

  const groups = useMemo(
    () =>
      JOBS.map((job) => ({ job, rows: rows.filter((c) => c.jobId === job.id) })).filter((g) => g.rows.length > 0),
    [rows],
  );

  const view: OpenSheet = (c, tab = "details") => setSheet({ id: c.id, tab });

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <cfg.icon className="size-7" strokeWidth={1.25} aria-hidden />
        </span>
        <div>
          <h2 className="page-title flex items-center gap-3">
            {cfg.name}
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2.5 text-sm font-bold text-primary-foreground" aria-label={`${inStage.length} candidates`}>
              {inStage.length}
            </span>
          </h2>
          <p className="mt-1 text-muted-foreground">{cfg.subtitle}</p>
        </div>
      </header>

      {inStage.length === 0 ? (
        <EmptyState icon={cfg.icon} title="No candidates here yet" description="Move candidates in from the previous stage and they will show up here." compact />
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} aria-hidden />
              <Input
                type="search"
                aria-label="Search candidates"
                placeholder="Search name, NIC, phone or tracking ID"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-12 rounded-button border-[1.5px] bg-card pl-12"
              />
            </div>
            <Select value={activeJob} onValueChange={setJobId}>
              <SelectTrigger aria-label="Filter by job" className="h-12 rounded-button border-[1.5px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All jobs</SelectItem>
                {jobsHere.map((j) => (
                  <SelectItem key={j.id} value={j.id}>{j.title} · {j.country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger aria-label="Sort by" className="h-12 rounded-button border-[1.5px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {rows.length === 0 ? (
            <EmptyState icon={SearchX} title="No matches" description="Try a different search or job filter." compact />
          ) : stage === "sorted" ? (
            <JobGroupList groups={groups} variant={stage} onView={view} onShortlist={requestMove} />
          ) : (
            <div className="rounded-2xl border border-border bg-card p-2">
              <CandidateTable rows={rows} variant={stage} onView={view} onShortlist={requestMove} />
            </div>
          )}
        </>
      )}

      <CandidateSheet candidateId={sheet?.id ?? null} tab={sheet?.tab} onClose={() => setSheet(null)} />
      {dialog}
    </div>
  );
}
