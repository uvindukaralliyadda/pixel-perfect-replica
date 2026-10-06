import { useRef, useState, type RefObject } from "react";
import { toast } from "sonner";
import { Lock, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DOC_TYPES, type Candidate } from "@/data/mock";
import { DEFAULT_DOC_TYPE } from "@/data/stageFields";
import { addDocuments, uploadStageOf } from "@/data/store";
import { fmtSize } from "@/lib/format";
import { cn } from "@/lib/utils";

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPT = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
const ALLOWED = /\.(pdf|jpe?g|png|docx?)$/i;

/** Returns an error message, or null when the file is acceptable. */
export function validateFile(f: File): string | null {
  if (!ALLOWED.test(f.name)) return `${f.name}: only PDF, JPG, PNG, DOC and DOCX files are accepted`;
  if (f.size > MAX_FILE_BYTES) return `${f.name}: larger than 10 MB (${fmtSize(f.size)})`;
  return null;
}

interface Pending {
  key: string;
  name: string;
  progress: number;
}

interface Props {
  candidate: Candidate;
  disabled?: boolean;
  /** Lets the parent's empty state open the file picker. */
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function DocumentUploader({ candidate, disabled = false, inputRef }: Props) {
  const stage = uploadStageOf(candidate);
  const [type, setType] = useState(DEFAULT_DOC_TYPE[stage]);
  const [note, setNote] = useState("");
  const [over, setOver] = useState(false);
  const [pending, setPending] = useState<Pending[]>([]);
  const own = useRef<HTMLInputElement>(null);
  const input = inputRef ?? own;

  const take = (list: FileList | null) => {
    if (disabled) return;
    const files = Array.from(list ?? []);
    const ok: File[] = [];
    files.forEach((f) => {
      const err = validateFile(f);
      if (err) toast.error(err);
      else ok.push(f);
    });
    if (!ok.length) return;

    const batch = ok.map((f, i) => ({ key: `${Date.now()}-${i}`, name: f.name, progress: 0 }));
    const keys = new Set(batch.map((b) => b.key));
    const speeds = new Map(batch.map((b) => [b.key, 12 + Math.random() * 18]));
    const progress = new Map(batch.map((b) => [b.key, 0]));
    const id = candidate.id;
    const chosenType = type;
    const chosenNote = note;
    setPending((p) => [...p, ...batch]);
    setNote("");

    const timer = setInterval(() => {
      progress.forEach((v, k) => progress.set(k, Math.min(100, v + speeds.get(k)!)));
      setPending((p) => p.map((x) => (keys.has(x.key) ? { ...x, progress: progress.get(x.key)! } : x)));
      if ([...progress.values()].every((v) => v >= 100)) {
        clearInterval(timer);
        const n = addDocuments(id, chosenType, ok, chosenNote);
        setPending((p) => p.filter((x) => !keys.has(x.key)));
        toast.success(`${n} ${n === 1 ? "document" : "documents"} uploaded`);
      }
    }, 140);
  };

  const zone = (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-foreground/50 bg-card p-6 text-center transition-colors",
        over && "border-foreground bg-muted",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {disabled ? <Lock className="size-8" strokeWidth={1.25} aria-hidden /> : <Upload className="size-8" strokeWidth={1.25} aria-hidden />}
      <p className="text-sm font-medium">
        Drop files here or{" "}
        <button
          type="button"
          disabled={disabled}
          onClick={() => input.current?.click()}
          className="rounded font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
        >
          browse
        </button>
      </p>
      <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC, DOCX up to 10 MB each</p>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        accept={ACCEPT}
        disabled={disabled}
        aria-label="Choose files to upload"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        {disabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{zone}</span>
            </TooltipTrigger>
            <TooltipContent>Reopen this candidate to add more</TooltipContent>
          </Tooltip>
        ) : (
          zone
        )}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="doc-type" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document type</Label>
            <Select value={type} onValueChange={setType} disabled={disabled}>
              <SelectTrigger id="doc-type" className="h-11 rounded-button border-[1.5px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="doc-note" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Note (optional)</Label>
            <Input id="doc-note" value={note} maxLength={120} disabled={disabled} onChange={(e) => setNote(e.target.value)} placeholder="Short note" className="h-11 rounded-button border-[1.5px] bg-card" />
          </div>
        </div>
      </div>

      {pending.length > 0 && (
        <ul className="space-y-2" aria-label="Uploading files">
          {pending.map((p) => (
            <li key={p.key} className="rounded-xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{Math.round(p.progress)}%</span>
              </div>
              <Progress value={p.progress} aria-label={`Uploading ${p.name}`} className="h-1.5" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
