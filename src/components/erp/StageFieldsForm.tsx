import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { stageById, type FieldValues, type StageId } from "@/data/mock";
import { STAGE_FIELDS } from "@/data/stageFields";
import { saveStageFields } from "@/data/store";
import { cn } from "@/lib/utils";

interface Props {
  candidateId: string;
  stage: StageId;
  values: FieldValues | undefined;
}

export function StageFieldsForm({ candidateId, stage, values }: Props) {
  const defs = STAGE_FIELDS[stage];
  const [draft, setDraft] = useState<FieldValues>(() => ({ ...(values ?? {}) }));
  const set = (k: string, v: string | boolean) => setDraft((d) => ({ ...d, [k]: v }));

  if (defs.length === 0) {
    return <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">No extra details are tracked in the {stageById(stage).name} stage.</p>;
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const out: FieldValues = { ...draft };
    defs.forEach((d) => {
      if (d.type === "number") out[d.key] = draft[d.key] === "" || draft[d.key] == null ? null : Number(draft[d.key]);
    });
    saveStageFields(candidateId, stage, out);
    toast.success(`${stageById(stage).name} details saved`);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {defs.map((d) => {
          const id = `sf-${stage}-${d.key}`;
          const v = draft[d.key];
          return (
            <div key={d.key} className={cn("space-y-1.5", (d.wide || d.type === "textarea") && "sm:col-span-2")}>
              {d.type === "switch" ? (
                <div className="flex h-11 items-center justify-between gap-3 rounded-button border-[1.5px] border-border bg-card px-4">
                  <Label htmlFor={id}>{d.label}</Label>
                  <Switch id={id} checked={v === true} onCheckedChange={(c) => set(d.key, c)} />
                </div>
              ) : (
                <>
                  <Label htmlFor={id} className="text-sm font-medium">{d.label}</Label>
                  {d.type === "textarea" ? (
                    <Textarea id={id} rows={3} value={String(v ?? "")} onChange={(e) => set(d.key, e.target.value)} className="rounded-xl border-[1.5px] bg-card" />
                  ) : d.type === "select" ? (
                    <Select value={String(v || d.options![0]!.value)} onValueChange={(x) => set(d.key, x)}>
                      <SelectTrigger id={id} className="h-11 rounded-button border-[1.5px] bg-card">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {d.options!.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id={id} type={d.type} min={d.type === "number" ? 1 : undefined} value={String(v ?? "")} onChange={(e) => set(d.key, e.target.value)} className="h-11 rounded-button border-[1.5px] bg-card" />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      <Button type="submit">
        <Save strokeWidth={1.75} /> Save
      </Button>
    </form>
  );
}
