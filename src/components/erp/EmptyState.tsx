import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
      <div className="flex size-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
        <Icon className="size-12" strokeWidth={1.25} />
      </div>
      <h2 className="page-title mt-8">{title}</h2>
      <p className="mt-3 text-muted-foreground">This page is built in the next step</p>
    </div>
  );
}
