import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Cake,
  Check,
  CheckCircle2,
  Copy,
  Ellipsis,
  IdCard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  CirclePause,
  CircleX,
  X,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, StatusPill } from "@/components/erp/StatusPill";
import { StageStepper } from "@/components/erp/StageStepper";
import { DocumentUploader } from "@/components/erp/DocumentUploader";
import { DocumentList } from "@/components/erp/DocumentList";
import { ReopenNotice } from "@/components/erp/ReopenNotice";
import type { SheetTab } from "@/components/erp/RowActions";
import { CommentThread } from "@/components/erp/CommentThread";
import { StageFieldsForm } from "@/components/erp/StageFieldsForm";
import { useShortlist } from "@/components/erp/ConfirmMoveDialog";
import { jobById, stageById, type Candidate, type CandidateStatus, type StageId } from "@/data/mock";
import { setStatus, useCandidates, useCurrentUser } from "@/data/store";
import { fmtDate, initials } from "@/lib/format";

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="break-words text-sm font-medium">{value || "—"}</dd>
      </div>
    </div>
  );
}

const pillTab =
  "h-9 rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none";

function ReasonDialog({
  kind,
  candidate,
  onClose,
}: {
  kind: Exclude<CandidateStatus, "active"> | null;
  candidate: Candidate;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const title = kind === "rejected" ? "Reject" : "Put on hold";
  const close = () => {
    setReason("");
    onClose();
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kind || !reason.trim()) return;
    setStatus(candidate.id, kind, reason.trim());
    toast(`${candidate.fullName} ${kind === "rejected" ? "rejected" : "put on hold"}`);
    close();
  };
  return (
    <Dialog open={!!kind} onOpenChange={(o) => !o && close()}>
      <DialogContent className="rounded-2xl">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title} {candidate.fullName}?</DialogTitle>
            <DialogDescription>A reason is required. It is saved as a comment on this candidate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="status-reason">Reason</Label>
            <Textarea id="status-reason" required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-xl border-[1.5px]" />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" disabled={!reason.trim()}>{title}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PanelBody({ candidate: c, tab, onClose }: { candidate: Candidate; tab: SheetTab; onClose: () => void }) {
  const user = useCurrentUser();
  const uploadInput = useRef<HTMLInputElement>(null);
  const rejected = c.status === "rejected";
  const job = jobById(c.jobId);
  const completed = c.stage === "completed";
  const fieldStage: StageId = c.stage === "completed" ? "departure" : c.stage;
  const { requestMove, dialog } = useShortlist();
  const [reasonFor, setReasonFor] = useState<Exclude<CandidateStatus, "active"> | null>(null);

  const copy = () => {
    navigator.clipboard?.writeText(c.trackingId);
    toast("Tracking ID copied");
  };

  const final = c.stage === "departure";
  const canMove = c.status === "active" && !completed;

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-5 border-b border-border p-6 pr-14">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground" aria-hidden>
            {initials(c.fullName)}
          </span>
          <div className="min-w-0">
            <SheetTitle className="truncate text-xl font-bold tracking-tight">{c.fullName}</SheetTitle>
            <SheetDescription className="flex items-center gap-1 text-sm">
              <span className="font-mono text-xs font-medium text-foreground">{c.trackingId}</span>
              <button type="button" onClick={copy} aria-label="Copy tracking ID" className="inline-flex size-6 items-center justify-center rounded-md hover:bg-accent">
                <Copy className="size-3.5" strokeWidth={1.75} />
              </button>
            </SheetDescription>
            <p className="truncate text-sm text-muted-foreground">{job.title} · {job.country}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill stage={c.stage} solid />
          <StatusBadge candidate={c} />
        </div>
        <StageStepper stage={c.stage} />
      </div>

      <Tabs defaultValue={tab} className="flex min-h-0 flex-1 flex-col">
        <div className="px-6 pt-4">
          <TabsList className="h-11 rounded-full bg-muted p-1">
            <TabsTrigger value="details" className={pillTab}>Details</TabsTrigger>
            <TabsTrigger value="documents" className={pillTab}>Documents <span className="ml-1.5 text-xs opacity-70">{c.documents.length}</span></TabsTrigger>
            <TabsTrigger value="comments" className={pillTab}>Comments <span className="ml-1.5 text-xs opacity-70">{c.comments.length}</span></TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <TabsContent value="details" className="mt-0 space-y-6">
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={IdCard} label="NIC" value={c.nic} />
              <InfoRow icon={Phone} label="Phone" value={c.phone} />
              <InfoRow icon={MessageCircle} label="WhatsApp" value={c.whatsapp} />
              <InfoRow icon={Mail} label="Email" value={c.email} />
              <InfoRow icon={MapPin} label="Address" value={c.address} />
              <InfoRow icon={Cake} label="Date of birth" value={c.dob ? fmtDate(c.dob) : ""} />
            </dl>
            <section aria-label="Stage details" className="space-y-3 border-t border-border pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stageById(fieldStage).name} details
              </h4>
              <StageFieldsForm key={`${c.id}-${fieldStage}`} candidateId={c.id} stage={fieldStage} values={c.stageFields[fieldStage]} />
            </section>
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            <div className="space-y-5">
              {rejected && <ReopenNotice candidate={c} />}
              <DocumentUploader key={c.id} candidate={c} disabled={rejected} inputRef={uploadInput} />
              <DocumentList key={`l-${c.id}`} candidate={c} disabled={rejected} inputRef={uploadInput} />
            </div>
          </TabsContent>
          <TabsContent value="comments" className="mt-0">
            <div className="space-y-5">
              {rejected && <ReopenNotice candidate={c} />}
              <CommentThread key={c.id} candidate={c} disabled={rejected} />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="sticky bottom-0 flex items-center gap-2 border-t border-border bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button variant="secondary" onClick={onClose}>
          <X strokeWidth={1.75} /> Close
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" aria-label="More actions" disabled={completed}>
              <Ellipsis strokeWidth={1.75} /> More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            {c.status !== "on_hold" && (
              <DropdownMenuItem onSelect={() => setReasonFor("on_hold")}>
                <CirclePause className="mr-2 size-4" strokeWidth={1.75} /> On hold
              </DropdownMenuItem>
            )}
            {c.status !== "rejected" && (
              <DropdownMenuItem onSelect={() => setReasonFor("rejected")}>
                <CircleX className="mr-2 size-4" strokeWidth={1.75} /> Reject
              </DropdownMenuItem>
            )}
            {c.status !== "active" && (c.status === "on_hold" || user.role === "Admin") && (
              <DropdownMenuItem onSelect={() => { setStatus(c.id, "active"); toast(`${c.fullName} is active again`); }}>
                <PlayCircle className="mr-2 size-4" strokeWidth={1.75} /> Back to active
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="ml-auto" disabled={!canMove} onClick={() => requestMove(c)}>
          {completed ? <CheckCircle2 strokeWidth={1.75} /> : final ? <Check strokeWidth={1.75} /> : <ArrowRight strokeWidth={1.75} />}
          {completed ? "Completed" : final ? "Complete" : "Shortlist"}
        </Button>
      </div>
      <ReasonDialog kind={reasonFor} candidate={c} onClose={() => setReasonFor(null)} />
      {dialog}
    </div>
  );
}

export function CandidateSheet({ candidateId, tab = "details", onClose }: { candidateId: string | null; tab?: SheetTab | undefined; onClose: () => void }) {
  const candidates = useCandidates();
  const candidate = candidates.find((c) => c.id === candidateId) ?? null;
  return (
    <Sheet open={!!candidate} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 sm:max-w-[560px]"
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement | null)?.closest("[data-sonner-toaster]")) e.preventDefault();
        }}
      >
        {candidate && <PanelBody key={`${candidate.id}-${tab}`} candidate={candidate} tab={tab} onClose={onClose} />}
      </SheetContent>
    </Sheet>
  );
}
