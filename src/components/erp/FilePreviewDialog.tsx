import { useEffect, useState } from "react";
import { Download, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CandidateDocument } from "@/data/mock";
import { downloadDocument, getDocumentBlob } from "@/data/store";
import { fmtSize } from "@/lib/format";

const isImage = (name: string) => /\.(jpe?g|png)$/i.test(name);

export function FilePreviewDialog({ doc, onClose }: { doc: CandidateDocument | null; onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [last, setLast] = useState<CandidateDocument | null>(null);
  if (doc && doc !== last) setLast(doc);
  const d = doc ?? last;

  useEffect(() => {
    if (!doc || !isImage(doc.name)) {
      setUrl(null);
      return;
    }
    const blob = getDocumentBlob(doc);
    if (!blob) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [doc]);

  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl rounded-2xl">
        {d && (
          <>
            <DialogHeader>
              <DialogTitle className="break-all pr-6">{d.name}</DialogTitle>
              <DialogDescription>{d.type} · {fmtSize(d.size)}</DialogDescription>
            </DialogHeader>
            {url ? (
              <img src={url} alt={d.name} className="max-h-[60vh] w-full rounded-xl border border-border object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted py-14 text-center">
                <FileIcon className="size-10" strokeWidth={1.25} aria-hidden />
                <p className="text-sm text-muted-foreground">
                  {isImage(d.name) ? "This image is not stored in this browser." : "No preview for this file type."}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => downloadDocument(d)}>
                <Download strokeWidth={1.75} /> Download
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
