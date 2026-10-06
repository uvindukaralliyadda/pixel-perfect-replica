import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SearchX, Users } from "lucide-react";
import { DataTable, type Column } from "@/components/erp/DataTable";
import { EmptyState } from "@/components/erp/EmptyState";
import { StatusBadge, StatusPill } from "@/components/erp/StatusPill";
import { matchesQuery } from "@/components/erp/StageTab";
import { Input } from "@/components/ui/input";
import { jobById, type Candidate } from "@/data/mock";
import { useCandidates } from "@/data/store";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/app/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates — Recruit ERP" },
      { name: "description", content: "Browse and manage every candidate profile." },
      { property: "og:title", content: "Candidates — Recruit ERP" },
      { property: "og:description", content: "Browse and manage every candidate profile." },
    ],
  }),
  component: Page,
});

const columns: Column<Candidate>[] = [
  { key: "tid", header: "Tracking ID", cell: (c) => <span className="font-mono text-xs font-medium">{c.trackingId}</span> },
  { key: "name", header: "Candidate", cell: (c) => <span className="font-semibold">{c.fullName}</span> },
  { key: "nic", header: "NIC", cell: (c) => <span className="font-mono text-xs">{c.nic}</span> },
  { key: "job", header: "Job", cell: (c) => { const j = jobById(c.jobId); return <span>{j.title} <span className="text-muted-foreground">· {j.country}</span></span>; } },
  { key: "phone", header: "Phone", cell: (c) => c.phone },
  { key: "stage", header: "Stage", cell: (c) => <StatusPill stage={c.stage} /> },
  { key: "status", header: "Status", cell: (c) => <StatusBadge candidate={c} showActive /> },
  { key: "applied", header: "Applied", cell: (c) => <span className="text-muted-foreground">{fmtDate(c.appliedAt)}</span> },
];

function Page() {
  const all = useCandidates();
  const [q, setQ] = useState("");
  const rows = useMemo(() => all.filter((c) => matchesQuery(c, q)), [all, q]);

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Users className="size-7" strokeWidth={1.25} aria-hidden />
        </span>
        <div>
          <h2 className="page-title flex items-center gap-3">
            Candidates
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary px-2.5 text-sm font-bold text-primary-foreground" aria-label={`${all.length} candidates`}>
              {all.length}
            </span>
          </h2>
          <p className="mt-1 text-muted-foreground">Everyone in the system, across all stages</p>
        </div>
      </header>
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} aria-hidden />
        <Input type="search" aria-label="Search candidates" placeholder="Search name, NIC, phone or tracking ID" value={q} onChange={(e) => setQ(e.target.value)} className="h-12 rounded-button border-[1.5px] bg-card pl-12" />
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={SearchX} title="No matches" description="Try a different search." compact />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-2">
          <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} />
        </div>
      )}
    </div>
  );
}
