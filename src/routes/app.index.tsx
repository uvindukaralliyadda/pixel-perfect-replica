import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Inbox,
  PlaneTakeoff,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/erp/StatCard";
import { StageStepper } from "@/components/erp/StageStepper";
import { DataTable, type Column } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import {
  dashboardStats,
  jobById,
  needsAttention,
  recentApplications,
  stageById,
  stageCounts,
  type Candidate,
} from "@/data/mock";
import { useMockStore } from "@/data/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Recruit ERP" },
      { name: "description", content: "Today's applications, pipeline and candidates that need attention." },
      { property: "og:title", content: "Dashboard — Recruit ERP" },
      { property: "og:description", content: "Today's applications, pipeline and candidates that need attention." },
    ],
  }),
  component: Dashboard,
});

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const columns: Column<Candidate>[] = [
  { key: "tid", header: "Tracking ID", cell: (c) => <span className="font-mono text-xs font-medium">{c.trackingId}</span> },
  { key: "name", header: "Candidate", cell: (c) => <span className="font-semibold">{c.name}</span> },
  { key: "job", header: "Job", cell: (c) => { const j = jobById(c.jobId); return <span>{j.title} <span className="text-muted-foreground">· {j.country}</span></span>; } },
  { key: "stage", header: "Current stage", cell: (c) => <StatusPill stage={c.stage} /> },
  { key: "date", header: "Applied", cell: (c) => <span className="text-muted-foreground">{fmt(c.appliedDate)}</span> },
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Dashboard() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  useMockStore();
  const DASHBOARD_STATS = dashboardStats();
  const stuck = needsAttention();

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{today}</p>
          <h2 className="page-title mt-1">{greeting()}, here is what needs you today</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button><Plus strokeWidth={1.75} /> New Job</Button>
          <Button variant="secondary"><UserPlus strokeWidth={1.75} /> Add Candidate</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard inverted icon={Inbox} label="New Applications" value={DASHBOARD_STATS.newApplications.value} trend={DASHBOARD_STATS.newApplications.trend} />
        <StatCard icon={Users} label="Active Candidates" value={DASHBOARD_STATS.activeCandidates.value} trend={DASHBOARD_STATS.activeCandidates.trend} />
        <StatCard icon={Briefcase} label="Open Jobs" value={DASHBOARD_STATS.openJobs.value} trend={DASHBOARD_STATS.openJobs.trend} />
        <StatCard icon={PlaneTakeoff} label="Departures This Month" value={DASHBOARD_STATS.departures.value} trend={DASHBOARD_STATS.departures.trend} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">Pipeline overview</h3>
          <Link to="/app/pipeline" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
            Open pipeline <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
        <StageStepper stages={stageCounts()} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 xl:col-span-2">
          <h3 className="mb-4 text-xl font-bold tracking-tight">Recent applications</h3>
          <DataTable columns={columns} rows={recentApplications()} rowKey={(c) => c.id} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-1 flex items-center gap-2">
            <AlertCircle className="size-6" strokeWidth={1.5} />
            <h3 className="text-xl font-bold tracking-tight">Needs attention</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">No movement for 7 days or more</p>
          <ul className="divide-y divide-border">
            {stuck.map((c) => {
              const s = stageById(c.stage);
              return (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <AlertCircle className="size-5" strokeWidth={1.5} aria-label="Stuck" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <s.icon className="size-3.5" strokeWidth={1.75} aria-hidden /> {s.name} · {c.daysInStage} days
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" aria-label={`Open ${c.name}`} className="h-9">
                    Open <ArrowRight strokeWidth={1.75} />
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
