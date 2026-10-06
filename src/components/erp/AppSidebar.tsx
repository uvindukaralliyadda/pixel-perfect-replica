import { Link, useRouterState } from "@tanstack/react-router";
import { Briefcase, Lock, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/data/mock";
import { COMING_SOON, NAV_ITEMS } from "./nav";
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

export function AppSidebar({ collapsed = false, onToggle, onNavigate }: Props) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className={cn("flex h-20 items-center gap-3 px-5", collapsed && "justify-center px-0")}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Briefcase className="size-5" strokeWidth={1.75} />
        </div>
        {!collapsed && <span className="text-lg font-extrabold tracking-tight">Recruit ERP</span>}
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.to === "/app" ? path === "/app" || path === "/app/" : path.startsWith(item.to);
            return (
              <li key={item.to}>
                <Tip show={collapsed} label={item.title}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-label={collapsed ? item.title : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-12 items-center gap-3 rounded-button px-4 text-[15px] font-medium transition-colors duration-150",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    <item.icon className="size-[22px] shrink-0" strokeWidth={1.5} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </Tip>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          {!collapsed && (
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Coming soon
            </p>
          )}
          <ul className="space-y-1">
            {COMING_SOON.map((item) => (
              <li key={item.title}>
                <Tip show={collapsed} label={`${item.title} — coming soon`}>
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {CURRENT_USER.initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{CURRENT_USER.name}</p>
              <p className="text-xs text-muted-foreground">{CURRENT_USER.role}</p>
            </div>
          )}
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
