import { Check } from "lucide-react";
import { STAGES, type CandidateStage } from "@/data/mock";
import { cn } from "@/lib/utils";

/** Horizontal 8-stage progress: current = solid black, done = outlined with tick, future = grey. */
export function StageStepper({ stage }: { stage: CandidateStage }) {
  const current = stage === "completed" ? STAGES.length : STAGES.findIndex((s) => s.id === stage);
  return (
    <ol aria-label="Pipeline progress" className="flex gap-1 overflow-x-auto pb-1">
      {STAGES.map((s, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <li key={s.id} aria-current={isCurrent ? "step" : undefined} className="flex min-w-[56px] flex-1 flex-col items-center gap-1.5">
            <span
              className={cn(
                "relative flex size-10 items-center justify-center rounded-full border-[1.5px]",
                isCurrent && "border-primary bg-primary text-primary-foreground",
                done && "border-foreground bg-card text-foreground",
                !isCurrent && !done && "border-border bg-muted text-muted-foreground",
              )}
            >
              <s.icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
              {done && (
                <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
                  <Check className="size-2.5" strokeWidth={3} aria-hidden />
                </span>
              )}
            </span>
            <span className={cn("text-[11px] font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>{s.name}</span>
            <span className="sr-only">{done ? "completed" : isCurrent ? "current stage" : "upcoming"}</span>
          </li>
        );
      })}
    </ol>
  );
}
