import { ArrowRight, Check, Ellipsis, Eye, MessageSquare, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Candidate } from "@/data/mock";
import { stageComments, stageDocuments } from "@/lib/format";

export type SheetTab = "details" | "documents" | "comments";
export type OpenSheet = (c: Candidate, tab?: SheetTab) => void;

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span aria-hidden className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-card">
      {n}
    </span>
  );
}

function IconButton({ label, count, onClick, children }: { label: string; count: number; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary" size="icon" className="relative size-9" aria-label={`${label}, ${count} in this stage`} onClick={onClick}>
          {children}
          <CountBadge n={count} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

interface Props {
  candidate: Candidate;
  onOpen: OpenSheet;
  onShortlist: (c: Candidate) => void;
}

/** Quick actions for a table row: Documents, Comments, View and Shortlist. */
export function RowActions({ candidate: c, onOpen, onShortlist }: Props) {
  const docs = stageDocuments(c).length;
  const notes = stageComments(c).length;
  const final = c.stage === "departure";

  return (
    <span className="inline-flex items-center gap-2">
      <span className="hidden items-center gap-2 xl:inline-flex">
        <IconButton label={`Documents for ${c.fullName}`} count={docs} onClick={() => onOpen(c, "documents")}>
          <Paperclip className="!size-4" strokeWidth={1.75} />
        </IconButton>
        <IconButton label={`Comments for ${c.fullName}`} count={notes} onClick={() => onOpen(c, "comments")}>
          <MessageSquare className="!size-4" strokeWidth={1.75} />
        </IconButton>
        <Button variant="secondary" className="h-9 px-3" onClick={() => onOpen(c)} aria-label={`View ${c.fullName}`}>
          <Eye className="!size-4" strokeWidth={1.75} /> View
        </Button>
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="size-9 xl:hidden" aria-label={`More actions for ${c.fullName}`}>
            <Ellipsis className="!size-4" strokeWidth={1.75} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onOpen(c, "documents")}>
            <Paperclip className="mr-2 size-4" strokeWidth={1.75} /> Documents ({docs})
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onOpen(c, "comments")}>
            <MessageSquare className="mr-2 size-4" strokeWidth={1.75} /> Comments ({notes})
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onOpen(c)}>
            <Eye className="mr-2 size-4" strokeWidth={1.75} /> View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        className="h-9 px-3"
        disabled={c.status !== "active"}
        onClick={() => onShortlist(c)}
        aria-label={`${final ? "Complete" : "Shortlist"} ${c.fullName}`}
      >
        {final ? <Check className="!size-4" strokeWidth={1.75} /> : <ArrowRight className="!size-4" strokeWidth={1.75} />}
        {final ? "Complete" : "Shortlist"}
      </Button>
    </span>
  );
}
