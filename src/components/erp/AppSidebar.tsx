import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, ChevronsUpDown, Lock, PanelLeftClose, PanelLeftOpen, ShieldCheck, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/data/mock";
import { COMING_SOON, NAV_BOTTOM, NAV_PIPELINE, NAV_TOP, type NavItem } from "./nav";
import { setRole, useCurrentUser, useStageCounts } from "@/data/store";
import type { ReactNode } from "react";

interface Props {
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}

function Tip({ show, label, children }: { show: boolean; label: string; children: ReactNode }) {
  if (!show) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}


function NavList({
  items,
  path,
  collapsed,
  onNavigate,
}: {
  items: NavItem[];
  path: string;
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const counts = useStageCounts();
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = item.to === "/app" ? path === "/app" || path === "/app/" : path.startsWith(item.to);
        const count = item.stage ? counts[item.stage] : undefined;
        return (
          <li key={item.to}>
            <Tip show={collapsed} label={count === undefined ? item.title : `${item.title} (${count})`}>
              <Link
                to={item.to}
                onClick={onNavigate}
                aria-label={collapsed ? item.title : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-12 items-center gap-3 rounded-button px-4 text-[15px] font-medium transition-colors duration-150",
                  collapsed && "justify-center px-0",
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
                )}
              >
                <item.icon className="size-[22px] shrink-0" strokeWidth={1.5} />
                {!collapsed && <span className="flex-1">{item.title}</span>}
                {count !== undefined && (
                  <span
                    aria-label={`${count} candidates`}
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none",
                      active ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
                      collapsed && "absolute right-1.5 top-1.5 h-4 min-w-4 px-1 text-[10px] ring-2 ring-sidebar",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </Tip>
          </li>
        );
      })}
    </ul>
  );
}
export function AppSidebar({ collapsed = false, onToggle, onNavigate }: Props) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const shared = { path, collapsed, onNavigate };
  const user = useCurrentUser();

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className={cn("flex h-20 items-center gap-3 px-5", collapsed && "justify-center px-0")}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Briefcase className="size-5" strokeWidth={1.75} />
        </div>
        {!collapsed && <span className="text-lg font-extrabold tracking-tight">Recruit ERP</span>}
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
        <NavList items={NAV_TOP} {...shared} />

        <div className="mt-6">
          {!collapsed ? (
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pipeline</p>
          ) : (
            <hr className="mx-3 mb-2 border-sidebar-border" />
          )}
          <NavList items={NAV_PIPELINE} {...shared} />
        </div>

        <div className="mt-6">
          <NavList items={NAV_BOTTOM} {...shared} />
        </div>
        <div className="mt-8">
          {!collapsed && (
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Coming soon
            </p>
          )}
          <ul className="space-y-1">
            {COMING_SOON.map((item) => (
              <li key={item.title}>
                <Tip show={collapsed} label={`${item.title} — coming soon`}>
                  <div
                    aria-disabled="true"
                    className={cn(
                      "flex h-11 cursor-not-allowed select-none items-center gap-3 rounded-button px-4 text-[15px] text-muted-foreground opacity-60",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <item.icon className="size-[22px] shrink-0" strokeWidth={1.5} />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        <Lock className="size-3.5" strokeWidth={1.75} aria-label="Locked" />
                      </>
                    )}
                  </div>
                </Tip>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3 rounded-button p-2", collapsed && "flex-col")}>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`User menu: ${user.name}, ${user.role}. Switch role`}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-3 rounded-button text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                collapsed && "flex-none",
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {user.initials}
              </span>
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">{user.role}</span>
                  </span>
                  <ChevronsUpDown className="mr-1 size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                </>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Demo role</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={user.role} onValueChange={(v) => setRole(v as UserRole)}>
                <DropdownMenuRadioItem value="Admin"><ShieldCheck className="mr-2 size-4" strokeWidth={1.5} /> Admin (edit all)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Staff"><UserRound className="mr-2 size-4" strokeWidth={1.5} /> Staff (own comments)</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {onToggle && (
            <button
              onClick={onToggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex size-9 items-center justify-center rounded-button transition-colors duration-150 hover:bg-accent"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-5" strokeWidth={1.5} />
              ) : (
                <PanelLeftClose className="size-5" strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
