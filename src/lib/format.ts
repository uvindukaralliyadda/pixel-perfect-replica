import type { Candidate, CandidateStage } from "@/data/mock";

export const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/** When the candidate entered their current stage. */
export const enteredStageAt = (c: Candidate) =>
  [...c.stageHistory].reverse().find((h) => h.stage === c.stage)?.enteredAt ?? c.appliedAt;

export const daysInStage = (c: Candidate, now = Date.now()) =>
  Math.max(0, Math.floor((now - new Date(enteredStageAt(c)).getTime()) / 86_400_000));

export function fmtRelative(iso: string, now = Date.now()) {
  const s = Math.round((now - new Date(iso).getTime()) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ${h === 1 ? "hour" : "hours"} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} ${d === 1 ? "day" : "days"} ago`;
  return fmtDate(iso);
}

/** Documents that belong to the candidate's current stage (application files count for Applied). */
export const stageDocuments = (c: Candidate) =>
  c.documents.filter((d) => d.stage === (c.stage === "completed" ? "departure" : c.stage) || (c.stage === "applied" && d.stage === "application"));

export const stageComments = (c: Candidate) => c.comments.filter((m) => m.stage === c.stage);

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const stageLabel = (s: CandidateStage) => (s === "completed" ? "Completed" : s.charAt(0).toUpperCase() + s.slice(1));
