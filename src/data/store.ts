import { useSyncExternalStore } from "react";
import { CANDIDATES, JOBS, type Candidate, type Job } from "./mock";

// Session-only mock state: mutates the mock arrays and notifies subscribers.
let version = 0;
const listeners = new Set<() => void>();
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};

export function useMockStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => version,
    () => 0,
  );
}

let trackingSeq = 124;
export function addCandidate(input: Omit<Candidate, "id" | "trackingId" | "stage" | "appliedDate" | "daysInStage">) {
  const trackingId = `AG-26-${String(1000 + trackingSeq++).padStart(6, "0")}`;
  const c: Candidate = {
    ...input,
    id: `C-new-${trackingSeq}`,
    trackingId,
    stage: "applied",
    appliedDate: new Date().toISOString(),
    daysInStage: 0,
  };
  CANDIDATES.unshift(c);
  emit();
  return c;
}

let jobSeq = 45;
export function addJobRequest(input: Omit<Job, "id" | "status" | "postedDate">) {
  const ref = `JR-26-${String(jobSeq++).padStart(4, "0")}`;
  JOBS.push({ ...input, id: ref, status: "pending", postedDate: new Date().toISOString() });
  emit();
  return ref;
}
