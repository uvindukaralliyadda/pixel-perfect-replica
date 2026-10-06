import {
  Inbox,
  ListChecks,
  FileSignature,
  Stethoscope,
  Stamp,
  Landmark,
  TicketsPlane,
  PlaneTakeoff,
  type LucideIcon,
} from "lucide-react";

export type StageId =
  | "applied"
  | "sorted"
  | "offer"
  | "medical"
  | "visa"
  | "bureau"
  | "ticket"
  | "departure";
export type CandidateStage = StageId | "completed";
export type CandidateStatus = "active" | "on_hold" | "rejected";
export type DocStage = StageId | "application";

export interface Stage {
  id: StageId;
  name: string;
  icon: LucideIcon;
  to: `/app/${StageId}`;
  subtitle: string;
}

export const STAGES: Stage[] = [
  { id: "applied", name: "Applied", icon: Inbox, to: "/app/applied", subtitle: "Pick a job to see the CVs that applied" },
  { id: "sorted", name: "Sorted", icon: ListChecks, to: "/app/sorted", subtitle: "Shortlisted CVs, grouped by job" },
  { id: "offer", name: "Offer", icon: FileSignature, to: "/app/offer", subtitle: "Candidates with an employer offer in progress" },
  { id: "medical", name: "Medical", icon: Stethoscope, to: "/app/medical", subtitle: "Medical appointments and results" },
  { id: "visa", name: "Visa", icon: Stamp, to: "/app/visa", subtitle: "Visa applications and approvals" },
  { id: "bureau", name: "Bureau", icon: Landmark, to: "/app/bureau", subtitle: "Bureau registration and clearance" },
  { id: "ticket", name: "Ticket", icon: TicketsPlane, to: "/app/ticket", subtitle: "Flight tickets and travel dates" },
  { id: "departure", name: "Departure", icon: PlaneTakeoff, to: "/app/departure", subtitle: "Ready to fly. Mark them complete once they leave" },
];

export const stageById = (id: StageId) => STAGES.find((s) => s.id === id)!;

/** The stage that follows `id`; departure is followed by "completed". */
export const nextStageOf = (id: StageId): CandidateStage => {
  const i = STAGES.findIndex((s) => s.id === id);
  return STAGES[i + 1]?.id ?? "completed";
};

export interface Job {
  id: string;
  title: string;
  country: string;
  employer: string;
  openings: number;
  status: "open" | "closed" | "pending";
  category: string;
  salaryRange: string;
  postedDate: string; // ISO
}

export const CATEGORIES = ["Transport", "Security", "Facilities", "Healthcare", "Construction", "Hospitality"];

export const JOBS: Job[] = [
  { id: "J-01", title: "Driver", country: "Qatar", employer: "Doha Transport Co.", openings: 12, status: "open", category: "Transport", salaryRange: "QAR 2,200 – 2,800", postedDate: "2026-10-04" },
  { id: "J-02", title: "Security Guard", country: "UAE", employer: "Emirates Secure", openings: 20, status: "open", category: "Security", salaryRange: "AED 2,000 – 2,500", postedDate: "2026-10-07" },
  { id: "J-03", title: "Cleaner", country: "Saudi Arabia", employer: "Riyadh Facilities", openings: 15, status: "open", category: "Facilities", salaryRange: "SAR 1,500 – 1,800", postedDate: "2026-10-10" },
  { id: "J-04", title: "Nurse", country: "Kuwait", employer: "Al Salam Hospital", openings: 6, status: "open", category: "Healthcare", salaryRange: "KWD 450 – 600", postedDate: "2026-10-13" },
  { id: "J-05", title: "Welder", country: "Qatar", employer: "Gulf Steelworks", openings: 8, status: "open", category: "Construction", salaryRange: "QAR 2,500 – 3,200", postedDate: "2026-10-16" },
  { id: "J-06", title: "Electrician", country: "UAE", employer: "Dubai Power Build", openings: 10, status: "open", category: "Construction", salaryRange: "AED 2,800 – 3,500", postedDate: "2026-09-19" },
  { id: "J-07", title: "Housekeeper", country: "Kuwait", employer: "Kuwait Hospitality", openings: 9, status: "open", category: "Hospitality", salaryRange: "KWD 150 – 200", postedDate: "2026-09-22" },
  { id: "J-08", title: "Cook", country: "Saudi Arabia", employer: "Jeddah Catering", openings: 5, status: "open", category: "Hospitality", salaryRange: "SAR 2,000 – 2,600", postedDate: "2026-09-25" },
  { id: "J-09", title: "Plumber", country: "Qatar", employer: "Lusail Services", openings: 4, status: "closed", category: "Construction", salaryRange: "QAR 2,200 – 2,700", postedDate: "2026-09-28" },
  { id: "J-10", title: "Forklift Operator", country: "UAE", employer: "Jebel Ali Logistics", openings: 7, status: "open", category: "Transport", salaryRange: "AED 2,300 – 2,900", postedDate: "2026-09-03" },
];

export const jobById = (id: string) => JOBS.find((j) => j.id === id)!;

export type FieldValues = Record<string, string | number | boolean | null>;
export type StageFields = Partial<Record<StageId, FieldValues>>;

export interface StageHistoryEntry {
  stage: CandidateStage;
  enteredAt: string; // ISO
  movedBy: string;
}

export interface CandidateDocument {
  id: string;
  stage: DocStage;
  name: string;
  type: string;
  size: number; // bytes
  uploadedBy: string;
  uploadedAt: string; // ISO
  note?: string | undefined;
  updatedAt?: string | undefined;
}

export interface CandidateComment {
  id: string;
  stage: CandidateStage;
  author: string;
  text: string;
  createdAt: string; // ISO
  authorRole?: UserRole | undefined;
  important?: boolean | undefined;
  /** Written by the system (hold/reject reasons); locked from edit and delete. */
  system?: boolean | undefined;
  editedAt?: string | undefined;
}

export type UserRole = "Admin" | "Staff";

export interface AuditEntry {
  id: string;
  at: string; // ISO
  actor: string;
  role: UserRole;
  action: string;
  candidateId: string;
  targetId: string;
  detail: string;
}

export interface Candidate {
  id: string;
  trackingId: string;
  fullName: string;
  nic: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  dob: string; // ISO date
  jobId: string;
  stage: CandidateStage;
  status: CandidateStatus;
  appliedAt: string; // ISO
  stageHistory: StageHistoryEntry[];
  documents: CandidateDocument[];
  comments: CandidateComment[];
  stageFields: StageFields;
}

export const DOC_TYPES = [
  "Medical report",
  "Visa copy",
  "Offer letter",
  "E-ticket",
  "Contract",
  "Police clearance",
  "Bureau registration",
  "Insurance",
  "Other",
];

export const CURRENT_USER: { name: string; role: UserRole; initials: string } = { name: "Staff User", role: "Admin", initials: "SU" };

// ---------------------------------------------------------------------------
// Seed data (deterministic, so server and client render the same markup)
// ---------------------------------------------------------------------------

const BASE = Date.UTC(2026, 9, 6, 8, 30);
const daysAgo = (d: number, h = 0) => new Date(BASE - d * 86_400_000 + h * 3_600_000).toISOString();
const dateOnly = (d: number) => daysAgo(d).slice(0, 10);

const FIRST = ["Nimal", "Kasun", "Amali", "Dilani", "Saman", "Ruwan", "Chathura", "Ishara", "Tharindu", "Nadeesha", "Pradeep", "Sanduni", "Mahesh", "Kavindi", "Lahiru", "Hasini", "Dinesh", "Malsha", "Gayan", "Sachini"];
const LAST = ["Perera", "Silva", "Fernando", "Jayasinghe", "Bandara", "Wickramasinghe", "Dissanayake", "Herath"];
const TOWNS = ["Colombo", "Kandy", "Galle", "Matara", "Kurunegala", "Negombo", "Gampaha", "Anuradhapura"];
const STAFF = ["Staff User", "Nimali Fernando", "Kamal Perera"];
const roleOf = (n: string): UserRole => (n === "Staff User" ? "Admin" : "Staff");
const SPREAD: [StageId, number][] = [
  ["applied", 10],
  ["sorted", 6],
  ["offer", 5],
  ["medical", 5],
  ["visa", 4],
  ["bureau", 3],
  ["ticket", 4],
  ["departure", 3],
];
// Job index per applied candidate, so some jobs have several CVs and others none.
const APPLIED_JOBS = [1, 0, 1, 3, 1, 5, 0, 1, 9, 3];
const DAYS_IN_STAGE = [2, 7, 9, 3, 7, 1, 12, 4];

const STAGE_DOCS: Record<Exclude<StageId, "applied">, { name: string; type: string }> = {
  sorted: { name: "Interview notes.pdf", type: "Other" },
  offer: { name: "Offer letter.pdf", type: "Offer letter" },
  medical: { name: "Medical report.pdf", type: "Medical report" },
  visa: { name: "Visa copy.pdf", type: "Visa copy" },
  bureau: { name: "Bureau clearance.pdf", type: "Bureau registration" },
  ticket: { name: "E-ticket.pdf", type: "E-ticket" },
  departure: { name: "Boarding pass.pdf", type: "Other" },
};

function seedFields(stage: StageId, i: number, jobId: string, entered: number): FieldValues | undefined {
  const job = jobById(jobId);
  const d = (n: number) => dateOnly(entered - n);
  switch (stage) {
    case "sorted":
      return { rank: (i % 9) + 1, notes: i % 2 ? "Good experience, passport valid." : "" };
    case "offer":
      return {
        employer: job.employer,
        salary: job.salaryRange,
        contractPeriod: "2 years",
        interviewResult: i % 3 === 0 ? "pending" : "passed",
        offerDate: i % 3 === 0 ? "" : d(-1),
        acceptedDate: i % 2 === 0 ? d(-2) : "",
      };
    case "medical":
      return {
        clinic: ["City Medical Centre", "Gulf Health Lab", "Lanka Diagnostics"][i % 3]!,
        appointmentDate: d(-2),
        result: (["pending", "fit", "fit", "unfit"] as const)[i % 4]!,
      };
    case "visa":
      return {
        visaNumber: i % 4 === 0 ? "" : `VS-${700000 + i * 37}`,
        submissionDate: d(0),
        issueDate: i % 4 === 0 ? "" : d(-5),
        expiryDate: i % 4 === 0 ? "" : dateOnly(entered - 365),
      };
    case "bureau":
      return { registrationNumber: i % 3 === 0 ? "" : `SLBFE-${450000 + i * 11}`, clearanceDate: i % 3 === 0 ? "" : d(-2), insuranceReference: i % 2 ? `INS-${9000 + i}` : "" };
    case "ticket":
      return {
        airline: ["Qatar Airways", "Emirates", "SriLankan Airlines", "Saudia"][i % 4]!,
        flightNumber: `${["QR", "EK", "UL", "SV"][i % 4]}${600 + i}`,
        departureDateTime: `${dateOnly(entered - 14)}T${["02:15", "09:40", "21:05"][i % 3]}`,
        ticketReference: i % 2 ? `TKT-${30000 + i * 13}` : "",
      };
    case "departure":
      return { actualDepartureDate: i % 2 ? dateOnly(entered - 3) : "", arrivalConfirmed: i % 3 === 0 };
    default:
      return undefined;
  }
}

function buildSeed(): Candidate[] {
  const order: StageId[] = SPREAD.flatMap(([s, n]) => Array<StageId>(n).fill(s));
  return order.map((stage, i) => {
    const k = SPREAD.findIndex(([s]) => s === stage);
    const jobId = JOBS[i < APPLIED_JOBS.length ? APPLIED_JOBS[i]! : (i * 7) % JOBS.length]!.id;
    const inStage = DAYS_IN_STAGE[i % 8]!;
    const enteredAtStage = (j: number) => inStage + (k - j) * 3; // days ago
    const history: StageHistoryEntry[] = SPREAD.slice(0, k + 1).map(([s], j) => ({
      stage: s,
      enteredAt: daysAgo(enteredAtStage(j), j % 5),
      movedBy: j === 0 ? "Public application form" : STAFF[(i + j) % STAFF.length]!,
    }));
    const appliedAt = history[0]!.enteredAt;
    const name = `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`;
    const trackingId = `AG-26-${String(123 + i * 7).padStart(6, "0")}`;

    const documents: CandidateDocument[] = [
      { id: `D-${i}-cv`, stage: "application", name: "CV.pdf", type: "CV", size: 184_000 + i * 1300, uploadedBy: "Applicant", uploadedAt: appliedAt },
      { id: `D-${i}-pp`, stage: "application", name: "Passport.pdf", type: "Passport", size: 920_000 + i * 900, uploadedBy: "Applicant", uploadedAt: appliedAt },
      { id: `D-${i}-ph`, stage: "application", name: "Photo.jpg", type: "Photo", size: 240_000 + i * 700, uploadedBy: "Applicant", uploadedAt: appliedAt },
    ];
    SPREAD.slice(1, k + 1).forEach(([s], idx) => {
      const j = idx + 1;
      if ((i + j) % 3 === 0) return; // some stages intentionally have no documents
      const d = STAGE_DOCS[s as Exclude<StageId, "applied">];
      documents.push({ id: `D-${i}-${s}`, stage: s, name: d.name, type: d.type, size: 120_000 + ((i * 53 + j * 17) % 90) * 1000, uploadedBy: STAFF[(i + j) % STAFF.length]!, uploadedAt: daysAgo(enteredAtStage(j) - 1, 2) });
    });

    const comments: CandidateComment[] = [];
    if (k >= 1 && i % 2 === 0) comments.push({ id: `M-${i}-1`, stage: SPREAD[k]![0], author: STAFF[i % STAFF.length]!, authorRole: roleOf(STAFF[i % STAFF.length]!), text: "Called the candidate, all documents confirmed.", createdAt: daysAgo(inStage - 0.5 > 0 ? inStage - 0.5 : 0) });
    if (i % 5 === 0) comments.push({ id: `M-${i}-0`, stage: "applied", author: STAFF[(i + 1) % STAFF.length]!, authorRole: roleOf(STAFF[(i + 1) % STAFF.length]!), important: i % 10 === 0, text: "CV looks complete. Passport has 2+ years validity.", createdAt: daysAgo(enteredAtStage(0) - 0.2) });

    const stageFields: StageFields = {};
    SPREAD.slice(1, k + 1).forEach(([s]) => {
      const f = seedFields(s, i, jobId, enteredAtStage(SPREAD.findIndex(([x]) => x === s)));
      if (f) stageFields[s] = f;
    });

    const status: CandidateStatus = i % 13 === 5 ? "on_hold" : i % 17 === 9 ? "rejected" : "active";
    if (status !== "active") {
      comments.push({ id: `M-${i}-s`, stage, author: "Nimali Fernando", authorRole: "Staff", system: true, text: status === "rejected" ? "Rejected: Documents did not meet the employer requirements." : "Put on hold: Waiting for the candidate to confirm availability.", createdAt: daysAgo(1) });
    }
    const nic = `${199000000 + i * 3137}V`;
    return {
      id: `C-${i + 1}`,
      trackingId,
      fullName: name,
      nic,
      phone: `+94 77 ${String(1000000 + i * 4321).slice(0, 7)}`,
      whatsapp: `+94 77 ${String(1000000 + i * 4321).slice(0, 7)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      address: `${10 + i} Temple Road, ${TOWNS[i % TOWNS.length]}`,
      dob: `${1985 + (i % 15)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
      jobId,
      stage,
      status,
      appliedAt,
      stageHistory: history,
      documents,
      comments,
      stageFields,
    };
  });
}

export const SEED_CANDIDATES: Candidate[] = buildSeed();
