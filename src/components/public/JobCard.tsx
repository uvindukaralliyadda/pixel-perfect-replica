import { Banknote, CalendarDays, MapPin, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/data/mock";

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function JobMeta({ job }: { job: Job }) {
  return (
    <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
      <li className="inline-flex items-center gap-2"><MapPin className="size-5" strokeWidth={1.5} /> {job.country}</li>
      <li className="inline-flex items-center gap-2"><Tag className="size-5" strokeWidth={1.5} /> {job.category}</li>
      <li className="inline-flex items-center gap-2"><Banknote className="size-5" strokeWidth={1.5} /> {job.salaryRange}</li>
      <li className="inline-flex items-center gap-2"><Users className="size-5" strokeWidth={1.5} /> {job.openings} vacancies</li>
    </ul>
  );
}

export function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  return (
    <article className="lift flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 hover:border-foreground">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-extrabold tracking-tight">{job.title}</h3>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-4" strokeWidth={1.5} /> {fmtDate(job.postedDate)}
        </span>
      </div>
      <JobMeta job={job} />
      <Button className="mt-auto self-start" onClick={() => onApply(job)}>Apply now</Button>
    </article>
  );
}
