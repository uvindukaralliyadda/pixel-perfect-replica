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
  to: "/" | "/jobs" | "/candidates" | "/cv-lists" | "/pipeline" | "/settings";
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Jobs", to: "/jobs", icon: Briefcase },
  { title: "Candidates", to: "/candidates", icon: Users },
  { title: "CV Lists", to: "/cv-lists", icon: FileText },
  { title: "Pipeline", to: "/pipeline", icon: Kanban },
  { title: "Settings", to: "/settings", icon: Settings },
];

export const COMING_SOON: { title: string; icon: LucideIcon }[] = [
  { title: "Employers", icon: Building2 },
  { title: "Finance", icon: Wallet },
  { title: "Reports", icon: BarChart3 },
  { title: "Notifications", icon: Bell },
];

export const titleForPath = (path: string) =>
  NAV_ITEMS.find((n) => n.to === path)?.title ?? "Recruit ERP";
