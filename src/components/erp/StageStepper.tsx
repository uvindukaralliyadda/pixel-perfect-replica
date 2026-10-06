import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Stage } from "@/data/mock";

export function StageStepper({ stages }: { stages: (Stage & { count: number })[] }) {
  const max = Math.max(...stages.map((s) => s.count), 1);
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8 xl:gap-0">
      {stages.map((s, i) => (
        <li key={s.id} className="relative flex items-center">
          <Link
            to="/pipeline"
            aria-label={`${s.name}: ${s.count} candidates`}
            className="group flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
          >
            <span className="flex size-12 items-center justify-center rounded-full border-[1.5px] border-foreground bg-card text-foreground transition-colors duration-150 group-hover:border-primary-foreground group-hover:bg-primary-foreground group-hover:text-primary">
              <s.icon className="size-5" strokeWidth={1.5} />
            </span>
            <span className="text-2xl font-extrabold leading-none">{s.count}</span>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary-foreground/80">
              {s.name}
            </span>
            <span className="mt-1 h-1 w-full max-w-20 overflow-hidden rounded-full bg-border">
              <span
                className="block h-full rounded-full bg-primary group-hover:bg-primary-foreground"
                style={{ width: `${(s.count / max) * 100}%` }}
              />
            </span>
          </Link>
          {i < stages.length - 1 && (
            <ChevronRight
              className="absolute -right-2.5 top-10 hidden size-5 text-muted-foreground xl:block"
              strokeWidth={1.5}
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}
