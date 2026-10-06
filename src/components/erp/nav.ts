import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Kanban,
  Settings,
  Building2,
  Wallet,
  BarChart3,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  to: "/app/app" | "/app/jobs" | "/app/candidates" | "/app/cv-lists" | "/app/pipeline" | "/app/settings";
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", to: "/app/app", icon: LayoutDashboard },
  { title: "Jobs", to: "/app/jobs", icon: Briefcase },
  { title: "Candidates", to: "/app/candidates", icon: Users },
  { title: "CV Lists", to: "/app/cv-lists", icon: FileText },
  { title: "Pipeline", to: "/app/pipeline", icon: Kanban },
  { title: "Settings", to: "/app/settings", icon: Settings },
];

export const COMING_SOON: { title: string; icon: LucideIcon }[] = [
  { title: "Employers", icon: Building2 },
  { title: "Finance", icon: Wallet },
  { title: "Reports", icon: BarChart3 },
  { title: "Notifications", icon: Bell },
];

export const titleForPath = (path: string) =>
  NAV_ITEMS.find((n) => n.to === path.replace(/\/$/, ""))?.title ?? "Recruit ERP";
