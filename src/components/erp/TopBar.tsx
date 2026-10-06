import { useEffect, useRef } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { CURRENT_USER } from "@/data/mock";

export function TopBar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-4 border-b border-border bg-card px-4 md:px-8">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="flex size-11 items-center justify-center rounded-button hover:bg-accent lg:hidden"
      >
        <Menu className="size-6" strokeWidth={1.5} />
      </button>
      <h1 className="hidden text-xl font-bold tracking-tight sm:block lg:w-48">{title}</h1>

      <div className="relative mx-auto w-full max-w-xl flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.5}
        />
        <input
          ref={ref}
          type="search"
          aria-label="Global search"
          placeholder="Search name, NIC, phone or tracking ID"
          className="h-12 w-full rounded-button border-[1.5px] border-border bg-muted pl-12 pr-16 text-sm outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-foreground focus:bg-card"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-card px-2 py-0.5 font-mono text-xs text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative flex size-11 items-center justify-center rounded-button border-[1.5px] border-border transition-colors duration-150 hover:border-foreground"
        >
          <Bell className="size-5" strokeWidth={1.5} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary" />
        </button>
        <div
          aria-label={CURRENT_USER.name}
          className="hidden size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground sm:flex"
        >
          {CURRENT_USER.initials}
        </div>
      </div>
    </header>
  );
}
