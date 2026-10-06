import { useState } from "react";
import { toast } from "sonner";
import { Flag, Lock, MessageSquarePlus, MessageSquareText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CommentEditor } from "@/components/erp/CommentEditor";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import type { Candidate, CandidateComment } from "@/data/mock";
import { addComment, deleteComment, editComment, restoreComment, useCurrentUser } from "@/data/store";
import { fmtDateTime, fmtRelative, initials, stageLabel } from "@/lib/format";
import { canEdit } from "@/lib/permissions";
import { cn } from "@/lib/utils";

function IconTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function CommentItem({ candidate, comment: m }: { candidate: Candidate; comment: CandidateComment }) {
  const user = useCurrentUser();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const allowed = canEdit(m, user);

  const remove = () => {
    setConfirm(false);
    const removed = deleteComment(candidate.id, m.id);
    if (!removed) return;
    toast("Comment deleted", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          restoreComment(candidate.id, removed);
          toast.success("Comment restored");
        },
      },
    });
  };

  return (
    <li className="flex gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-hidden>
        {initials(m.author)}
      </span>
      <div className={cn("min-w-0 flex-1 rounded-2xl border bg-card p-3", m.important ? "border-foreground" : "border-border")}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold">{m.author}</span>
          {m.authorRole && <span className="text-xs text-muted-foreground">{m.authorRole}</span>}
          <span className="rounded-full border border-foreground px-2 py-0.5 text-[11px] font-semibold">{stageLabel(m.stage)}</span>
          {m.important && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
              <Flag className="size-3" strokeWidth={1.75} aria-hidden /> Important
            </span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <time dateTime={m.createdAt} className="text-xs text-muted-foreground">{fmtRelative(m.createdAt)}</time>
            </TooltipTrigger>
            <TooltipContent>{fmtDateTime(m.createdAt)}</TooltipContent>
          </Tooltip>
          {m.editedAt && (
            <span className="text-xs italic text-muted-foreground" title={fmtDateTime(m.editedAt)}>edited {fmtRelative(m.editedAt)}</span>
          )}
          <span className="ml-auto flex items-center">
            {m.system && (
              <IconTip label="System comment, locked">
                <span tabIndex={0} className="inline-flex size-8 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Locked system comment">
                  <Lock className="size-4" strokeWidth={1.5} />
                </span>
              </IconTip>
            )}
            {allowed && !editing && (
              <>
                <IconTip label="Edit">
                  <Button variant="ghost" size="icon" className="size-8" aria-label="Edit comment" onClick={() => setEditing(true)}>
                    <Pencil className="!size-4" strokeWidth={1.5} />
                  </Button>
                </IconTip>
                <IconTip label="Delete">
                  <Button variant="ghost" size="icon" className="size-8" aria-label="Delete comment" onClick={() => setConfirm(true)}>
                    <Trash2 className="!size-4" strokeWidth={1.5} />
                  </Button>
                </IconTip>
              </>
            )}
          </span>
        </div>
        {editing ? (
          <div className="mt-2">
            <CommentEditor
              id={`edit-${m.id}`}
              label={<span className="sr-only">Edit comment</span>}
              initialText={m.text}
              initialImportant={!!m.important}
              autoFocus
              submitLabel="Save"
              submitIcon="check"
              onCancel={() => setEditing(false)}
              onSubmit={(text, important) => {
                if (editComment(candidate.id, m.id, text, important)) toast.success("Comment updated");
                setEditing(false);
              }}
            />
          </div>
        ) : (
          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm">{m.text}</p>
        )}
      </div>
      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Delete this comment?" onConfirm={remove} />
    </li>
  );
}

export function CommentThread({ candidate, disabled = false }: { candidate: Candidate; disabled?: boolean }) {
  const [scope, setScope] = useState<"all" | "current">("all");
  const list = candidate.comments
    .filter((m) => scope === "all" || m.stage === candidate.stage)
    .sort((a, b) => Number(!!b.important) - Number(!!a.important) || b.createdAt.localeCompare(a.createdAt));

  const form = (
    <CommentEditor
      id="new-comment"
      label={
        <span className="flex items-center gap-2">
          <MessageSquarePlus className="size-4" strokeWidth={1.75} aria-hidden /> Add a comment
        </span>
      }
      placeholder="Write a note for your team. Ctrl or Cmd + Enter to post."
      disabled={disabled}
      submitLabel="Post comment"
      onSubmit={(text, important) => {
        addComment(candidate.id, text, important);
        toast.success(important ? "Important comment posted" : "Comment posted");
      }}
    />
  );

  return (
    <div className="space-y-6">
      {disabled ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div tabIndex={0} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{form}</div>
          </TooltipTrigger>
          <TooltipContent>Reopen this candidate to add more</TooltipContent>
        </Tooltip>
      ) : (
        form
      )}

      <div role="group" aria-label="Filter comments" className="flex gap-2">
        {([
          ["all", "All stages"],
          ["current", "Current stage only"],
        ] as const).map(([v, label]) => (
          <button
            key={v}
            type="button"
            aria-pressed={scope === v}
            onClick={() => setScope(v)}
            className={cn(
              "h-9 rounded-full border-[1.5px] border-foreground px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              scope === v ? "bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          <MessageSquareText className="size-8" strokeWidth={1.25} aria-hidden />
          {scope === "current" && candidate.comments.length > 0 ? "No comments in this stage yet." : "No comments yet. Add the first note for the team."}
        </p>
      ) : (
        <ul className="space-y-4" aria-label="Comments, important first, then newest first">
          {list.map((m) => (
            <CommentItem key={m.id} candidate={candidate} comment={m} />
          ))}
        </ul>
      )}
    </div>
  );
}
