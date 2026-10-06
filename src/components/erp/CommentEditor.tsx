import { useState, type ReactNode } from "react";
import { Check, Flag, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COMMENT_MAX } from "@/data/store";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: ReactNode;
  initialText?: string;
  initialImportant?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  submitLabel: string;
  submitIcon?: "send" | "check";
  onSubmit: (text: string, important: boolean) => void;
  onCancel?: () => void;
}

/** Textarea with counter, Important toggle and Ctrl/Cmd+Enter to submit. Used to post and to edit. */
export function CommentEditor({
  id,
  label,
  initialText = "",
  initialImportant = false,
  placeholder,
  disabled = false,
  autoFocus = false,
  submitLabel,
  submitIcon = "send",
  onSubmit,
  onCancel,
}: Props) {
  const [text, setText] = useState(initialText);
  const [important, setImportant] = useState(initialImportant);
  const ready = !disabled && text.trim().length > 0;
  const Icon = submitIcon === "send" ? Send : Check;

  const submit = () => {
    if (!ready) return;
    onSubmit(text.trim(), important);
    if (!onCancel) {
      setText("");
      setImportant(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-semibold">{label}</div>
      <Textarea
        id={id}
        aria-label="Add a comment"
        value={text}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={COMMENT_MAX}
        rows={3}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape" && onCancel) onCancel();
        }}
        className="rounded-xl border-[1.5px] bg-card"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={important}
          disabled={disabled}
          onClick={() => setImportant((v) => !v)}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-foreground px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
            important ? "bg-primary text-primary-foreground" : "bg-card",
          )}
        >
          <Flag className="size-4" strokeWidth={1.75} aria-hidden /> Important
        </button>
        <span className={cn("ml-auto text-xs tabular-nums text-muted-foreground", text.length >= COMMENT_MAX && "font-semibold text-foreground")} aria-live="polite">
          {text.length} / {COMMENT_MAX}
        </span>
        {onCancel && (
          <Button type="button" variant="secondary" size="sm" className="h-9" onClick={onCancel}>
            <X strokeWidth={1.75} /> Cancel
          </Button>
        )}
        <Button type="button" size={onCancel ? "sm" : "default"} className={onCancel ? "h-9" : undefined} disabled={!ready} onClick={submit}>
          <Icon strokeWidth={1.75} /> {submitLabel}
        </Button>
      </div>
    </div>
  );
}
