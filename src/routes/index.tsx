import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Building2, FileText, Globe, PlaneTakeoff, Search, Settings2, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/public/PublicLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recruit ERP — Your next job abroad starts here" },
      { name: "description", content: "Find a job abroad, post a vacancy, or manage the recruitment process." },
      { property: "og:title", content: "Recruit ERP — Your next job abroad starts here" },
      { property: "og:description", content: "Find a job abroad, post a vacancy, or manage the recruitment process." },
    ],
  }),
  component: Landing,
});

interface Action {
  title: string;
  text: string;
  cta: string;
  to: "/jobs" | "/recruiters" | "/app";
  icon: LucideIcon;
  quiet?: boolean;
}

const ACTIONS: Action[] = [
  { title: "I am a candidate", text: "Browse current jobs and apply with your CV.", cta: "View jobs", to: "/jobs", icon: UserRound },
  { title: "I am a recruiter", text: "Send us your job posting and we will find candidates.", cta: "Post a job", to: "/recruiters", icon: Building2 },
  { title: "I am staff", text: "Open the internal dashboard.", cta: "Go to dashboard", to: "/app", icon: ShieldCheck, quiet: true },
];

const STEPS = [
  { title: "Apply", text: "Pick a job and send your CV.", icon: FileText },
  { title: "We process", text: "Offer, medical, visa and bureau.", icon: Settings2 },
  { title: "You travel", text: "Ticket booked, off you go.", icon: PlaneTakeoff },
];

function Landing() {
  const [tid, setTid] = useState("");
  return (
    <PublicLayout>
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
          <Globe className="size-4" strokeWidth={1.75} /> Jobs in Qatar, UAE, Saudi Arabia & Kuwait
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Your next job abroad starts here
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Find a job, post a vacancy, or sign in to manage the process
        </p>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className={cn(
              "group flex min-h-80 flex-col rounded-2xl p-8 transition-all duration-150 hover:-translate-y-1 hover:shadow-lift",
              a.quiet
                ? "border-[1.5px] border-foreground bg-card hover:bg-primary hover:text-primary-foreground"
                : "border border-border bg-muted hover:border-primary hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors duration-150 group-hover:bg-primary-foreground group-hover:text-primary">
              <a.icon className="size-8" strokeWidth={1.5} />
            </span>
            <h2 className="mt-8 text-2xl font-extrabold tracking-tight">{a.title}</h2>
            <p className="mt-2 text-muted-foreground group-hover:text-primary-foreground/80">{a.text}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold">
              {a.cta}
              <span className="flex size-10 items-center justify-center rounded-full border-[1.5px] border-current transition-transform duration-150 group-hover:translate-x-1">
                <ArrowRight className="size-5" strokeWidth={1.75} />
              </span>
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="page-title">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl border-[1.5px] border-foreground">
                  <s.icon className="size-6" strokeWidth={1.5} />
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step {i + 1}</p>
                <p className="text-lg font-bold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast("Tracking is coming soon"); }}
          className="rounded-2xl bg-primary p-6 text-primary-foreground"
        >
          <h3 className="text-xl font-bold">Track your application</h3>
          <p className="mt-1 text-sm opacity-80">Use the ID you got when you applied.</p>
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input
              value={tid}
              onChange={(e) => setTid(e.target.value)}
              aria-label="Tracking ID"
              placeholder="Enter your tracking ID"
              className="h-12 w-full rounded-button bg-card pl-11 pr-4 font-mono text-sm text-foreground outline-none placeholder:font-sans placeholder:text-muted-foreground"
            />
          </div>
          <button type="submit" className="mt-3 h-12 w-full rounded-button border-[1.5px] border-primary-foreground font-semibold transition-colors duration-150 hover:bg-primary-foreground hover:text-primary">
            Track
          </button>
        </form>
      </section>
    </PublicLayout>
  );
}
