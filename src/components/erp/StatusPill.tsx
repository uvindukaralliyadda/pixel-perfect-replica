import { stageById, type StageId } from "@/data/mock";

export function StatusPill({ stage }: { stage: StageId }) {
  const s = stageById(stage);
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-foreground px-2.5 py-1 text-xs font-semibold">
      <s.icon className="size-3.5" strokeWidth={1.75} aria-hidden />
      {s.name}
    </span>
  );
}
