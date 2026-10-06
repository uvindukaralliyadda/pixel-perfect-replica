import { Link } from "@tanstack/react-router";
import { Briefcase, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-card">
      <header className="border-b border-border">
        <div className="mx-auto flex h-20 max-w-[1100px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-3 rounded-button">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Briefcase className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">Recruit ERP</span>
          </Link>
          <Link
            to="/"
            className="rounded-button px-4 py-2 text-sm font-semibold transition-colors duration-150 hover:bg-accent"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent" }}
          >
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-5 py-12 md:py-16">{children}</div>
      </main>

      <footer className="border-t border-border bg-muted">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-extrabold">Recruit Agency (Pvt) Ltd</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" strokeWidth={1.5} /> Licensed foreign employment agency
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-5" strokeWidth={1.5} /> +94 11 000 0000
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-5" strokeWidth={1.5} /> WhatsApp +94 77 000 0000
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
