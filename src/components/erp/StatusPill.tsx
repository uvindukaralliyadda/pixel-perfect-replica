import { CheckCircle2, CircleDot, CirclePause, CircleX } from "lucide-react";
import { stageById, type Candidate, type CandidateStage } from "@/data/mock";

export function StatusPill({ stage, solid }: { stage: CandidateStage; solid?: boolean }) {
  const Icon = stage === "completed" ? CheckCircle2 : stageById(stage).icon;
  const name = stage === "completed" ? "Completed" : stageById(stage).name;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-foreground px-2.5 py-1 text-xs font-semibold ${solid ? "bg-primary text-primary-foreground" : ""}`}>
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      {name}
    </span>
  );
}

export function candidateStatus(c: Pick<Candidate, "stage" | "status">) {
  if (c.stage === "completed") return { key: "completed", label: "Completed", icon: CheckCircle2 } as const;
  if (c.status === "on_hold") return { key: "on_hold", label: "On hold", icon: CirclePause } as const;
  if (c.status === "rejected") return { key: "rejected", label: "Rejected", icon: CircleX } as const;
  return { key: "active", label: "Active", icon: CircleDot } as const;
}

/** Status is always icon + text. Hides plain "Active" unless `showActive`. */
export function StatusBadge({ candidate, showActive = false }: { candidate: Pick<Candidate, "stage" | "status">; showActive?: boolean }) {
  const s = candidateStatus(candidate);
  if (s.key === "active" && !showActive) return null;
  const strong = s.key === "on_hold" || s.key === "rejected";
  return (
    <span
      className={
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold " +
        (strong ? "bg-primary text-primary-foreground" : "border border-border bg-muted text-foreground")
      }
    >
      <s.icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      {s.label}
    </span>
  );
}
