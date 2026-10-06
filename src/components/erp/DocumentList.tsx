import { useState, type RefObject } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  Download,
  File as FileIcon,
  FileImage,
  FileText,
  Pencil,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { DocumentEditor } from "@/components/erp/DocumentEditor";
import { FilePreviewDialog } from "@/components/erp/FilePreviewDialog";
import { STAGES, type Candidate, type CandidateDocument, type DocStage } from "@/data/mock";
import { deleteDocument, downloadDocument, restoreDocument, uploadStageOf } from "@/data/store";
import { fmtDateTime, fmtSize, plural } from "@/lib/format";
import { cn } from "@/lib/utils";

function iconFor(name: string) {
  if (/\.(jpe?g|png)$/i.test(name)) return FileImage;
  if (/\.(pdf|docx?)$/i.test(name)) return FileText;
  return FileIcon;
}

const stageName = (s: DocStage) => (s === "application" ? "Application" : STAGES.find((x) => x.id === s)!.name);

function IconTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function DocRow({
  candidate,
  doc,
  onPreview,
  onDelete,
}: {
  candidate: Candidate;
  doc: CandidateDocument;
  onPreview: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const Icon = iconFor(doc.name);
  const locked = doc.stage === "application";

  if (editing) return <li><DocumentEditor candidateId={candidate.id} doc={doc} onDone={() => setEditing(false)} /></li>;

  return (
    <li className="flex items-start gap-3 p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onPreview}
          className="block max-w-full truncate rounded text-left text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Preview ${doc.name}`}
        >
          {doc.name}
        </button>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="rounded-full border border-foreground px-2 py-0.5 text-[11px] font-semibold text-foreground">{doc.type}</span>
          <span>{fmtSize(doc.size)}</span>
          <span>{doc.uploadedBy}</span>
          <time dateTime={doc.uploadedAt}>{fmtDateTime(doc.uploadedAt)}</time>
          {doc.updatedAt && <span className="italic">updated {fmtDateTime(doc.updatedAt)}</span>}
        </div>
        {doc.note && <p className="mt-1 break-words text-xs">{doc.note}</p>}
      </div>
      <div className="flex shrink-0 items-center">
        <IconTip label="Download">
          <Button variant="ghost" size="icon" className="size-9" aria-label={`Download ${doc.name}`} onClick={() => downloadDocument(doc)}>
            <Download strokeWidth={1.5} />
          </Button>
        </IconTip>
        <IconTip label="Edit">
          <Button variant="ghost" size="icon" className="size-9" aria-label={`Edit ${doc.name}`} onClick={() => setEditing(true)}>
            <Pencil strokeWidth={1.5} />
          </Button>
        </IconTip>
        {!locked && (
          <IconTip label="Delete">
            <Button variant="ghost" size="icon" className="size-9" aria-label={`Delete ${doc.name}`} onClick={onDelete}>
              <Trash2 strokeWidth={1.5} />
            </Button>
          </IconTip>
        )}
      </div>
    </li>
  );
}

interface Props {
  candidate: Candidate;
  disabled?: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function DocumentList({ candidate, disabled = false, inputRef }: Props) {
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<CandidateDocument | null>(null);
  const [toDelete, setToDelete] = useState<CandidateDocument | null>(null);
  const current = uploadStageOf(candidate);

  const match = (d: CandidateDocument) => d.name.toLowerCase().includes(q.trim().toLowerCase());
  const docs = candidate.documents.filter(match);
  const currentDocs = docs.filter((d) => d.stage === current);
  // Earlier stages (latest first), then the original application files.
  const order = [...STAGES].reverse().map((s) => s.id as DocStage).filter((s) => s !== current);
  const others = [...order, "application" as DocStage]
    .map((s) => ({ id: s, docs: docs.filter((d) => d.stage === s) }))
    .filter((g) => g.docs.length);

  const confirmDelete = () => {
    if (!toDelete) return;
    const removed = deleteDocument(candidate.id, toDelete.id);
    setToDelete(null);
    if (!removed) return;
    toast(`${removed.doc.name} deleted`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          restoreDocument(candidate.id, removed.doc, removed.index);
          toast.success(`${removed.doc.name} restored`);
        },
      },
    });
  };

  const renderRows = (list: CandidateDocument[]) => (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
      {list.map((d) => (
        <DocRow key={d.id} candidate={candidate} doc={d} onPreview={() => setPreview(d)} onDelete={() => setToDelete(d)} />
      ))}
    </ul>
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} aria-hidden />
        <Input type="search" aria-label="Search documents by name" placeholder="Search documents" value={q} onChange={(e) => setQ(e.target.value)} className="h-10 rounded-button border-[1.5px] bg-card pl-10" />
      </div>

      <section aria-label={`${stageName(current)} documents (current stage)`}>
        <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {stageName(current)}
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">Current</span>
        </h4>
        {currentDocs.length > 0 ? (
          renderRows(currentDocs)
        ) : q ? (
          <p className="rounded-2xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">No documents match your search</p>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-10 text-center">
            <Upload className="size-8 text-muted-foreground" strokeWidth={1.25} aria-hidden />
            <p className="text-sm text-muted-foreground">No documents in this stage yet</p>
            <Button size="lg" disabled={disabled} onClick={() => inputRef.current?.click()}>
              <Upload strokeWidth={1.75} /> Upload
            </Button>
          </div>
        )}
      </section>

      {others.map((g) => (
        <Collapsible key={`${g.id}${q ? "-q" : ""}`} defaultOpen={g.id === "application" || !!q} asChild>
          <section aria-label={`${stageName(g.id)} documents`}>
            <CollapsibleTrigger className="group mb-2 flex w-full items-center gap-2 rounded text-xs font-semibold uppercase tracking-widest text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ChevronDown className={cn("size-4 transition-transform group-data-[state=open]:rotate-180")} strokeWidth={1.75} aria-hidden />
              {stageName(g.id)}
              <span className="font-normal normal-case tracking-normal">{plural(g.docs.length, "file")}</span>
            </CollapsibleTrigger>
            <CollapsibleContent>{renderRows(g.docs)}</CollapsibleContent>
          </section>
        </Collapsible>
      ))}

      <FilePreviewDialog doc={preview} onClose={() => setPreview(null)} />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this document?"
        description="This cannot be undone."
        onConfirm={confirmDelete}
      />
    </div>
  );
}
