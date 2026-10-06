import { useRef, useState } from "react";
import { toast } from "sonner";
import { Check, FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOC_TYPES, type CandidateDocument } from "@/data/mock";
import { updateDocument } from "@/data/store";
import { fmtSize } from "@/lib/format";
import { ACCEPT, validateFile } from "@/components/erp/DocumentUploader";

/** Inline editor for a document: rename, change type, edit note, or replace the file. */
export function DocumentEditor({ candidateId, doc, onDone }: { candidateId: string; doc: CandidateDocument; onDone: () => void }) {
  const [name, setName] = useState(doc.name);
  const [type, setType] = useState(DOC_TYPES.includes(doc.type) ? doc.type : "Other");
  const [note, setNote] = useState(doc.note ?? "");
  const [file, setFile] = useState<File | null>(null);
  const picker = useRef<HTMLInputElement>(null);

  const choose = (f: File | undefined) => {
    if (!f) return;
    const err = validateFile(f);
    if (err) return void toast.error(err);
    setFile(f);
    if (name === doc.name) setName(f.name);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateDocument(candidateId, doc.id, { name, type, note }, file ?? undefined);
    toast.success(file ? `${name.trim()} replaced` : `${name.trim()} updated`);
    onDone();
  };

  return (
    <form onSubmit={save} className="space-y-3 bg-muted/50 p-3" aria-label={`Edit ${doc.name}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`dn-${doc.id}`} className="text-xs">File name</Label>
          <Input id={`dn-${doc.id}`} value={name} required onChange={(e) => setName(e.target.value)} className="h-10 rounded-button border-[1.5px] bg-card" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`dt-${doc.id}`} className="text-xs">Document type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id={`dt-${doc.id}`} className="h-10 rounded-button border-[1.5px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`do-${doc.id}`} className="text-xs">Note</Label>
        <Input id={`do-${doc.id}`} value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} className="h-10 rounded-button border-[1.5px] bg-card" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input ref={picker} type="file" hidden accept={ACCEPT} aria-label="Choose a replacement file" onChange={(e) => { choose(e.target.files?.[0]); e.target.value = ""; }} />
        <Button type="button" variant="secondary" size="sm" className="h-9" onClick={() => picker.current?.click()}>
          <FileUp strokeWidth={1.75} /> Replace file
        </Button>
        {file && <span className="truncate text-xs text-muted-foreground">New: {file.name} · {fmtSize(file.size)}</span>}
        <span className="ml-auto flex gap-2">
          <Button type="button" variant="secondary" size="sm" className="h-9" onClick={onDone}>
            <X strokeWidth={1.75} /> Cancel
          </Button>
          <Button type="submit" size="sm" className="h-9" disabled={!name.trim()}>
            <Check strokeWidth={1.75} /> Save
          </Button>
        </span>
      </div>
    </form>
  );
}
