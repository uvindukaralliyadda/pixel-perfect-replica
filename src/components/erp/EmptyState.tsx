import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description = "This page is built in the next step", compact }: { icon: LucideIcon; title: string; description?: string; compact?: boolean }) {
  return (
    <div className={`flex ${compact ? "min-h-[40vh]" : "min-h-[60vh]"} flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center`}>
      <div className="flex size-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
        <Icon className="size-12" strokeWidth={1.25} />
      </div>
      <h2 className="page-title mt-8">{title}</h2>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
  );
}
