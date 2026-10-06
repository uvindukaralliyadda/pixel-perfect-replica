import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { nextStageOf, type Candidate } from "@/data/mock";
import { advanceCandidate, undoMove, useCandidates } from "@/data/store";
import { plural, stageComments, stageDocuments, stageLabel } from "@/lib/format";

export function hasStageDocument(c: Candidate) {
  return stageDocuments(c).length > 0;
}

export function ConfirmMoveDialog({
  candidate,
  onCancel,
  onConfirm,
}: {
  candidate: Candidate | null;
  onCancel: () => void;
  onConfirm: (c: Candidate) => void;
}) {
  // Keep the last candidate so the content doesn't flicker while closing.
  const [last, setLast] = useState<Candidate | null>(null);
  if (candidate && candidate !== last) setLast(candidate);
  const c = candidate ?? last;
  const complete = c?.stage === "departure";
  const next = c && c.stage !== "completed" ? nextStageOf(c.stage) : null;

  return (
    <AlertDialog open={!!candidate} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent className="rounded-2xl">
        {c && next && (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {complete ? `Mark ${c.fullName} as completed?` : `Move ${c.fullName} to ${stageLabel(next)}?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {complete
                  ? "They will leave the active list and stay in the Candidates list as Completed."
                  : `${c.trackingId} will leave ${stageLabel(c.stage)} and appear in ${stageLabel(next)}.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <p className="text-sm font-medium" data-testid="stage-counts">
              {plural(stageDocuments(c).length, "document")}, {plural(stageComments(c).length, "comment")} in this stage
            </p>
            {!hasStageDocument(c) && (
              <p className="flex items-start gap-2 rounded-xl border border-border bg-muted p-3 text-sm">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                No documents uploaded in this stage yet. Continue anyway?
              </p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>Cancel</AlertDialogCancel>
              <AlertDialogAction className={buttonVariants()} onClick={() => onConfirm(c)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Shared move flow: confirmation dialog, store update, toast with Undo. */
export function useShortlist(): { requestMove: (c: Candidate) => void; dialog: ReactNode } {
  const [targetId, setTargetId] = useState<string | null>(null);
  const candidates = useCandidates();
  const target = candidates.find((c) => c.id === targetId && c.status === "active") ?? null;

  const confirm = (c: Candidate) => {
    const token = advanceCandidate(c.id);
    setTargetId(null);
    if (!token) return;
    const label = token.to === "completed" ? "completed" : `moved to ${stageLabel(token.to)}`;
    toast.success(`${c.fullName} ${label}`, {
      action: {
        label: "Undo",
        onClick: () =>
          toast(undoMove(token) ? `${c.fullName} moved back to ${stageLabel(token.from)}` : `${c.fullName} has moved again, can't undo`),
      },
    });
  };

  return {
    requestMove: (c) => setTargetId(c.id),
    dialog: <ConfirmMoveDialog candidate={target} onCancel={() => setTargetId(null)} onConfirm={confirm} />,
  };
}
