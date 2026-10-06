import { MapPin } from "lucide-react";
import { CandidateTable, type TableVariant } from "@/components/erp/CandidateTable";
import type { OpenSheet } from "@/components/erp/RowActions";
import type { Candidate, Job } from "@/data/mock";

export interface JobGroup {
  job: Job;
  rows: Candidate[];
}

interface Props {
  groups: JobGroup[];
  variant: TableVariant;
  onView: OpenSheet;
  onShortlist: (c: Candidate) => void;
}

/** Candidates grouped under sticky job headings. */
export function JobGroupList({ groups, variant, onView, onShortlist }: Props) {
  return (
    <div className="space-y-6">
      {groups.map(({ job, rows }) => (
        <section key={job.id} aria-label={job.title} className="rounded-2xl border border-border bg-card">
          <h3 className="sticky top-20 z-10 flex items-center gap-3 rounded-t-2xl border-b border-border bg-card px-6 py-4 text-lg font-bold tracking-tight">
            {job.title}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <MapPin className="size-4" strokeWidth={1.5} aria-hidden /> {job.country}
            </span>
            <span className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground" aria-label={`${rows.length} candidates`}>
              {rows.length}
            </span>
          </h3>
          <div className="px-2 pb-2">
            <CandidateTable rows={rows} variant={variant} onView={onView} onShortlist={onShortlist} />
          </div>
        </section>
      ))}
    </div>
  );
}
