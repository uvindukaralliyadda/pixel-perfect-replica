import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Building2,
  Wallet,
  BarChart3,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { STAGES, type StageId } from "@/data/mock";

export type NavTo =
  | "/app"
  | "/app/jobs"
  | "/app/candidates"
  | "/app/settings"
  | `/app/${StageId}`;

export interface NavItem {
  title: string;
  to: NavTo;
  icon: LucideIcon;
  stage?: StageId;
}

export const NAV_TOP: NavItem[] = [
  { title: "Dashboard", to: "/app", icon: LayoutDashboard },
  { title: "Jobs", to: "/app/jobs", icon: Briefcase },
  { title: "Candidates", to: "/app/candidates", icon: Users },
];

export const NAV_PIPELINE: NavItem[] = STAGES.map((s) => ({ title: s.name, to: s.to, icon: s.icon, stage: s.id }));

export const NAV_BOTTOM: NavItem[] = [{ title: "Settings", to: "/app/settings", icon: Settings }];

export const COMING_SOON: { title: string; icon: LucideIcon }[] = [
  { title: "Employers", icon: Building2 },
  { title: "Finance", icon: Wallet },
  { title: "Reports", icon: BarChart3 },
  { title: "Notifications", icon: Bell },
];

export const titleForPath = (path: string) =>
  [...NAV_TOP, ...NAV_PIPELINE, ...NAV_BOTTOM].find((n) => n.to === path.replace(/\/$/, ""))?.title ?? "Recruit ERP";
