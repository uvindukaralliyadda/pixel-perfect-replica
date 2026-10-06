import { useMemo, useSyncExternalStore } from "react";
import {
  CURRENT_USER,
  JOBS,
  SEED_CANDIDATES,
  STAGES,
  nextStageOf,
  type AuditEntry,
  type Candidate,
  type CandidateComment,
  type CandidateDocument,
  type CandidateStage,
  type CandidateStatus,
  type DocStage,
  type FieldValues,
  type Job,
  type StageHistoryEntry,
  type StageId,
  type UserRole,
} from "./mock";
import { canEdit } from "@/lib/permissions";

// Single shared client-side store. State is immutable: every action produces a
// new snapshot, so every subscribed page re-renders instantly. It is persisted
// to localStorage so uploads and comments survive a refresh.
interface State {
  candidates: Candidate[];
  /** Hidden audit trail (who, what, when). Not shown in the UI yet. */
  audit: AuditEntry[];
  role: UserRole;
  rev: number;
}

const STORAGE_KEY = "recruit-erp:store:v1";
const FILES_KEY = "recruit-erp:files:v1";
const MAX_PERSISTED_FILE = 600 * 1024;

let state: State = { candidates: SEED_CANDIDATES, audit: [], role: CURRENT_USER.role, rev: 0 };
const listeners = new Set<() => void>();
const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

// In-memory file bodies, keyed by document id. Small files are also kept as
// data URLs in localStorage so previews and downloads survive a refresh.
const blobs = new Map<string, Blob>();
const dataUrls = new Map<string, string>();

let hydrated = false;
let trackingSeq = 124;

function persist() {
  if (!hasStorage()) return;
  try {
    const { candidates, audit, role } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ candidates, audit, role }));
  } catch {
    /* quota or private mode: keep working in memory */
  }
}

function persistFiles() {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(FILES_KEY, JSON.stringify(Object.fromEntries(dataUrls)));
  } catch {
    /* quota: previews fall back to a placeholder after refresh */
  }
}

function dataUrlToBlob(url: string): Blob | undefined {
  try {
    const [head, body = ""] = url.split(",");
    const mime = /data:([^;]+)/.exec(head ?? "")?.[1] ?? "application/octet-stream";
    const bin = atob(body);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  } catch {
    return undefined;
  }
}

function rememberFile(docId: string, file: Blob) {
  blobs.set(docId, file);
  if (file.size > MAX_PERSISTED_FILE) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      dataUrls.set(docId, reader.result);
      persistFiles();
    }
  };
  reader.readAsDataURL(file);
}

/** Loads saved data once on the client (kept out of the first render to avoid hydration mismatches). */
export function hydrateStore() {
  if (hydrated || !hasStorage()) return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<State>;
      if (Array.isArray(saved.candidates)) {
        state = {
          candidates: saved.candidates,
          audit: Array.isArray(saved.audit) ? saved.audit : [],
          role: saved.role === "Staff" ? "Staff" : "Admin",
          rev: state.rev + 1,
        };
        saved.candidates.forEach((c) => {
          const n = /^AG-26-(\d+)$/.exec(c.trackingId)?.[1];
          if (n && Number(n) >= 1000) trackingSeq = Math.max(trackingSeq, Number(n) - 1000 + 1);
        });
      }
    }
    const files = window.localStorage.getItem(FILES_KEY);
    if (files) {
      Object.entries(JSON.parse(files) as Record<string, string>).forEach(([id, url]) => {
        dataUrls.set(id, url);
        const b = dataUrlToBlob(url);
        if (b) blobs.set(id, b);
      });
    }
  } catch {
    /* corrupt data: start from the seed */
  }
  listeners.forEach((l) => l());
}

function commit(next: Partial<State>) {
  state = { ...state, ...next, rev: state.rev + 1 };
  persist();
  listeners.forEach((l) => l());
}

function update(fn: (list: Candidate[]) => Candidate[]) {
  hydrateStore();
  commit({ candidates: fn(state.candidates) });
}

const patch = (id: string, fn: (c: Candidate) => Candidate) =>
  update((list) => list.map((c) => (c.id === id ? fn(c) : c)));

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getState = () => state;

export function useMockStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

export const useCandidates = () => useMockStore().candidates;

export function useCurrentUser() {
  const { role } = useMockStore();
  return useMemo(() => ({ name: CURRENT_USER.name, initials: CURRENT_USER.initials, role }), [role]);
}

export function setRole(role: UserRole) {
  hydrateStore();
  commit({ role });
}

const currentUser = () => ({ name: CURRENT_USER.name, role: state.role });

function audit(candidateId: string, action: string, targetId: string, detail: string) {
  const u = currentUser();
  const entry: AuditEntry = { id: uid("A"), at: nowIso(), actor: u.name, role: u.role, action, candidateId, targetId, detail };
  state = { ...state, audit: [...state.audit, entry] };
  persist();
}

export function useStageCounts() {
  const candidates = useCandidates();
  return useMemo(() => {
    const counts = { completed: 0 } as Record<CandidateStage, number>;
    STAGES.forEach((s) => (counts[s.id] = 0));
    candidates.forEach((c) => counts[c.stage]++);
    return counts;
  }, [candidates]);
}

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;
const nowIso = () => new Date().toISOString();

export interface NewApplication {
  name: string;
  nic: string;
  phone: string;
  jobId: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  dob?: string;
  files?: { type: string; file: File }[];
}

export function addCandidate(input: NewApplication) {
  hydrateStore();
  const now = nowIso();
  const documents: CandidateDocument[] = (input.files ?? []).map(({ type, file }) => {
    const docId = uid("D");
    rememberFile(docId, file);
    return { id: docId, stage: "application", name: file.name, type, size: file.size, uploadedBy: "Applicant", uploadedAt: now };
  });
  const c: Candidate = {
    id: uid("C"),
    trackingId: `AG-26-${String(1000 + trackingSeq++).padStart(6, "0")}`,
    fullName: input.name,
    nic: input.nic,
    phone: input.phone,
    whatsapp: input.whatsapp || input.phone,
    email: input.email ?? "",
    address: input.address ?? "",
    dob: input.dob ?? "",
    jobId: input.jobId,
    stage: "applied",
    status: "active",
    appliedAt: now,
    stageHistory: [{ stage: "applied", enteredAt: now, movedBy: "Public application form" }],
    documents,
    comments: [],
    stageFields: {},
  };
  update((list) => [c, ...list]);
  return c;
}

let jobSeq = 45;
export function addJobRequest(input: Omit<Job, "id" | "status" | "postedDate">) {
  const ref = `JR-26-${String(jobSeq++).padStart(4, "0")}`;
  JOBS.push({ ...input, id: ref, status: "pending", postedDate: nowIso() });
  update((l) => l);
  return ref;
}

export interface MoveToken {
  id: string;
  from: CandidateStage;
  to: CandidateStage;
  history: StageHistoryEntry[];
}

/** Moves a candidate to the next stage. Returns a token for undo. */
export function advanceCandidate(id: string): MoveToken | null {
  const c = state.candidates.find((x) => x.id === id);
  if (!c || c.stage === "completed" || c.status !== "active") return null;
  const to = nextStageOf(c.stage);
  patch(id, (x) => ({
    ...x,
    stage: to,
    stageHistory: [...x.stageHistory, { stage: to, enteredAt: nowIso(), movedBy: CURRENT_USER.name }],
  }));
  return { id, from: c.stage, to, history: c.stageHistory };
}

/** Reverts a move, unless the candidate has since moved elsewhere. */
export function undoMove(t: MoveToken) {
  const c = state.candidates.find((x) => x.id === t.id);
  if (!c || c.stage !== t.to) return false;
  patch(t.id, (x) => ({ ...x, stage: t.from, stageHistory: t.history }));
  return true;
}

// ---------------------------------------------------------------- comments

export const COMMENT_MAX = 1000;

export function addComment(id: string, text: string, important = false) {
  const body = text.trim().slice(0, COMMENT_MAX);
  if (!body) return;
  const u = currentUser();
  patch(id, (c) => ({
    ...c,
    comments: [
      ...c.comments,
      { id: uid("M"), stage: c.stage, author: u.name, authorRole: u.role, text: body, createdAt: nowIso(), ...(important ? { important: true } : {}) },
    ],
  }));
}

export function editComment(id: string, commentId: string, text: string, important: boolean) {
  const body = text.trim().slice(0, COMMENT_MAX);
  const c = state.candidates.find((x) => x.id === id);
  const m = c?.comments.find((x) => x.id === commentId);
  if (!m || !body || !canEdit(m, currentUser())) return false;
  patch(id, (x) => ({
    ...x,
    comments: x.comments.map((k) => {
      if (k.id !== commentId) return k;
      const { important: _drop, ...rest } = k;
      return { ...rest, text: body, ...(important ? { important: true } : {}), editedAt: nowIso() };
    }),
  }));
  audit(id, "comment.edited", commentId, "Comment edited");
  return true;
}

/** Removes a comment and writes an audit line. Returns it so the caller can offer Undo. */
export function deleteComment(id: string, commentId: string): CandidateComment | null {
  const c = state.candidates.find((x) => x.id === id);
  const m = c?.comments.find((x) => x.id === commentId);
  if (!m || !canEdit(m, currentUser())) return null;
  audit(id, "comment.deleted", commentId, `Comment by ${m.author} deleted`);
  patch(id, (x) => ({ ...x, comments: x.comments.filter((k) => k.id !== commentId) }));
  return m;
}

export function restoreComment(id: string, comment: CandidateComment) {
  audit(id, "comment.restored", comment.id, `Comment by ${comment.author} restored`);
  patch(id, (x) => (x.comments.some((k) => k.id === comment.id) ? x : { ...x, comments: [...x.comments, comment] }));
}

export function setStatus(id: string, status: CandidateStatus, reason?: string) {
  const label = { active: "Reactivated", on_hold: "Put on hold", rejected: "Rejected" }[status];
  const u = currentUser();
  patch(id, (c) => ({
    ...c,
    status,
    comments: [
      ...c.comments,
      { id: uid("M"), stage: c.stage, author: u.name, authorRole: u.role, system: true, text: reason ? `${label}: ${reason}` : label, createdAt: nowIso() },
    ],
  }));
}

export function saveStageFields(id: string, stage: StageId, values: FieldValues) {
  patch(id, (c) => ({ ...c, stageFields: { ...c.stageFields, [stage]: values } }));
}

// --------------------------------------------------------------- documents

/** Stage a new upload belongs to. */
export const uploadStageOf = (c: Candidate): StageId => (c.stage === "completed" ? "departure" : c.stage);

export function addDocuments(id: string, type: string, files: File[], note = "") {
  const c = state.candidates.find((x) => x.id === id);
  if (!c || !files.length) return 0;
  const stage = uploadStageOf(c);
  const u = currentUser();
  const docs: CandidateDocument[] = files.map((f) => {
    const docId = uid("D");
    rememberFile(docId, f);
    return { id: docId, stage, name: f.name, type, size: f.size, uploadedBy: u.name, uploadedAt: nowIso(), ...(note.trim() ? { note: note.trim() } : {}) };
  });
  patch(id, (x) => ({ ...x, documents: [...x.documents, ...docs] }));
  docs.forEach((d) => audit(id, "document.added", d.id, d.name));
  return docs.length;
}

export function updateDocument(id: string, docId: string, changes: { name: string; type: string; note: string }, file?: File) {
  if (file) rememberFile(docId, file);
  patch(id, (c) => ({
    ...c,
    documents: c.documents.map((d) => {
      if (d.id !== docId) return d;
      const { note: _n, ...rest } = d;
      return {
        ...rest,
        name: changes.name.trim() || d.name,
        type: changes.type,
        ...(changes.note.trim() ? { note: changes.note.trim() } : {}),
        ...(file ? { size: file.size } : {}),
        updatedAt: nowIso(),
      };
    }),
  }));
  audit(id, file ? "document.replaced" : "document.updated", docId, changes.name);
}

/** Removes a document (the file body is kept briefly so Undo can restore it). */
export function deleteDocument(id: string, docId: string): { doc: CandidateDocument; index: number } | null {
  const c = state.candidates.find((x) => x.id === id);
  const index = c?.documents.findIndex((d) => d.id === docId) ?? -1;
  const doc = c?.documents[index];
  if (!c || !doc || doc.stage === "application") return null;
  audit(id, "document.deleted", docId, doc.name);
  patch(id, (x) => ({ ...x, documents: x.documents.filter((d) => d.id !== docId) }));
  return { doc, index };
}

export function restoreDocument(id: string, doc: CandidateDocument, index: number) {
  patch(id, (x) => {
    if (x.documents.some((d) => d.id === doc.id)) return x;
    const docs = [...x.documents];
    docs.splice(Math.min(index, docs.length), 0, doc);
    return { ...x, documents: docs };
  });
  audit(id, "document.restored", doc.id, doc.name);
}

export function getDocumentBlob(doc: CandidateDocument): Blob | undefined {
  return blobs.get(doc.id);
}

export function downloadDocument(doc: CandidateDocument) {
  const blob = blobs.get(doc.id) ?? new Blob([`Mock file: ${doc.name}\nType: ${doc.type}\n`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type { DocStage };

export const dashboardStats = (list: Candidate[]) => ({
  newApplications: list.filter((c) => c.stage === "applied").length,
  activeCandidates: list.filter((c) => c.stage !== "completed").length,
  openJobs: JOBS.filter((j) => j.status === "open").length,
  departures: list.filter((c) => c.stage === "departure" || c.stage === "completed").length,
});

export const recentApplications = (list: Candidate[]) =>
  [...list].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt)).slice(0, 8);
