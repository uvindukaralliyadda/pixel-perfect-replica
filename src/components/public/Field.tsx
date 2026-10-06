import { AlertCircle, type LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-button border-[1.5px] border-border bg-card text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-foreground aria-[invalid=true]:border-foreground";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold">
      <AlertCircle className="size-4" strokeWidth={2} /> {message}
    </p>
  );
}

interface WrapProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FieldWrap({ id, label, required, error, children }: WrapProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: LucideIcon;
  error?: string;
  id: string;
};

export function TextField({ label, icon: Icon, error, id, required, className, ...rest }: InputProps) {
  return (
    <FieldWrap id={id} label={label} required={required} error={error}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        )}
        <input
          id={id}
          aria-invalid={!!error}
          className={cn(control, "h-12", Icon ? "pl-11 pr-4" : "px-4", className)}
          {...rest}
        />
      </div>
    </FieldWrap>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon?: LucideIcon;
  error?: string;
  id: string;
  options: string[];
  placeholder?: string;
};

export function SelectField({ label, icon: Icon, error, id, required, options, placeholder = "Select…", ...rest }: SelectProps) {
  return (
    <FieldWrap id={id} label={label} required={required} error={error}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
        )}
        <select id={id} aria-invalid={!!error} className={cn(control, "h-12 appearance-none pr-4", Icon ? "pl-11" : "pl-4")} {...rest}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    </FieldWrap>
  );
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; id: string };

export function TextAreaField({ label, error, id, required, ...rest }: AreaProps) {
  return (
    <FieldWrap id={id} label={label} required={required} error={error}>
      <textarea id={id} aria-invalid={!!error} rows={4} className={cn(control, "px-4 py-3")} {...rest} />
    </FieldWrap>
  );
}
