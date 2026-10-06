import {
  Inbox,
  FileText,
  FileSignature,
  Stethoscope,
  Stamp,
  Landmark,
  Ticket,
  PlaneTakeoff,
  type LucideIcon,
} from "lucide-react";

export type StageId =
  | "applied"
  | "cv-list"
  | "create-offer"
  | "medical"
  | "visa"
  | "bureau"
  | "ticketing"
  | "departure";

export interface Stage {
  id: StageId;
  name: string;
  icon: LucideIcon;
}

export const STAGES: Stage[] = [
  { id: "applied", name: "Applied", icon: Inbox },
  { id: "cv-list", name: "CV List", icon: FileText },
  { id: "create-offer", name: "Create Offer", icon: FileSignature },
  { id: "medical", name: "Medical", icon: Stethoscope },
  { id: "visa", name: "Visa", icon: Stamp },
  { id: "bureau", name: "Bureau", icon: Landmark },
  { id: "ticketing", name: "Ticketing", icon: Ticket },
  { id: "departure", name: "Departure", icon: PlaneTakeoff },
];

export const stageById = (id: StageId) => STAGES.find((s) => s.id === id)!;

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

export interface Candidate {
  id: string;
  trackingId: string;
  name: string;
  nic: string;
  phone: string;
  jobId: string;
  stage: StageId;
  appliedDate: string; // ISO
  daysInStage: number;
}

const FIRST = ["Nimal", "Kasun", "Amali", "Dilani", "Saman", "Ruwan", "Chathura", "Ishara", "Tharindu", "Nadeesha", "Pradeep", "Sanduni", "Mahesh", "Kavindi", "Lahiru", "Hasini", "Dinesh", "Malsha", "Gayan", "Sachini"];
const LAST = ["Perera", "Silva", "Fernando", "Jayasinghe", "Bandara", "Wickramasinghe", "Dissanayake", "Herath"];
const STAGE_SPREAD: StageId[] = [
  ...Array(9).fill("applied"),
  ...Array(7).fill("cv-list"),
  ...Array(5).fill("create-offer"),
  ...Array(5).fill("medical"),
  ...Array(4).fill("visa"),
  ...Array(4).fill("bureau"),
  ...Array(3).fill("ticketing"),
  ...Array(3).fill("departure"),
];

export const CANDIDATES: Candidate[] = STAGE_SPREAD.map((stage, i) => {
  const d = new Date(2026, 9, 6 - (i % 21));
  return {
    id: `C-${i + 1}`,
    trackingId: `AG-26-${String(123 + i * 7).padStart(6, "0")}`,
    name: `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`,
    nic: `${199000000 + i * 3137}V`,
    phone: `+94 77 ${String(1000000 + i * 4321).slice(0, 7)}`,
    jobId: JOBS[i % JOBS.length]!.id,
    stage,
    appliedDate: d.toISOString(),
    daysInStage: [2, 7, 9, 3, 7, 1, 12, 4][i % 8] ?? 0,
  };
});


export const stageCounts = () =>
  STAGES.map((s) => ({ ...s, count: CANDIDATES.filter((c) => c.stage === s.id).length }));

export const recentApplications = () =>
  [...CANDIDATES].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).slice(0, 8);

export const needsAttention = () => CANDIDATES.filter((c) => c.daysInStage >= 7).slice(0, 4);

export const dashboardStats = () => ({
  newApplications: { value: CANDIDATES.filter((c) => c.stage === "applied").length, trend: "+12 today" },
  activeCandidates: { value: CANDIDATES.filter((c) => c.stage !== "departure").length, trend: "+5 this week" },
  openJobs: { value: JOBS.filter((j) => j.status === "open").length, trend: "+2 this month" },
  departures: { value: CANDIDATES.filter((c) => c.stage === "departure").length, trend: "+1 today" },
});

export const CURRENT_USER = { name: "Staff User", role: "Admin", initials: "SU" };

export const jobById = (id: string) => JOBS.find((j) => j.id === id)!;
