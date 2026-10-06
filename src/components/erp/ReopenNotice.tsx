import { toast } from "sonner";
import { Lock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/data/mock";
import { setStatus, useCurrentUser } from "@/data/store";

/** Shown on rejected candidates: inputs are locked and only Admin can reopen. */
export function ReopenNotice({ candidate }: { candidate: Candidate }) {
  const user = useCurrentUser();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted p-3 text-sm">
      <Lock className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className="flex-1">Rejected. Reopen this candidate to add more.</span>
      {user.role === "Admin" && (
        <Button
          size="sm"
          className="h-9"
          onClick={() => {
            setStatus(candidate.id, "active");
            toast.success(`${candidate.fullName} reopened`);
          }}
        >
          <RotateCcw strokeWidth={1.75} /> Reopen
        </Button>
      )}
    </div>
  );
}
