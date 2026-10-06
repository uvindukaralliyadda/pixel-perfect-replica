import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "./Field";

interface Props {
  id: string;
  label: string;
  required?: boolean;
  accept?: string;
  hint?: string;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
}

const size = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export function FileUpload({ id, label, required, accept, hint, file, onChange, error }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div>
      <p className="mb-1.5 text-sm font-semibold">
        {label}
        {required ? <span aria-hidden> *</span> : <span className="font-normal text-muted-foreground"> (optional)</span>}
      </p>
      {file ? (
        <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-foreground p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FileText className="size-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-muted-foreground">{size(file.size)}</p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${label}`}
            onClick={() => onChange(null)}
            className="flex size-9 items-center justify-center rounded-button hover:bg-accent"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files[0];
            if (f) onChange(f);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-[1.5px] border-dashed p-6 text-center transition-colors duration-150 hover:border-foreground hover:bg-muted focus-within:border-foreground",
            drag ? "border-foreground bg-muted" : error ? "border-foreground" : "border-border",
          )}
        >
          <Upload className="size-6" strokeWidth={1.5} />
          <span className="text-sm font-semibold">Drop file here or click to upload</span>
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
          <input
            ref={ref}
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
      <FieldError message={error} />
    </div>
  );
}
