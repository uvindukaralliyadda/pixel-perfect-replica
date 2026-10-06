import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { titleForPath } from "./nav";
import { hydrateStore } from "@/data/store";

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Restore saved uploads and comments after mount (kept out of SSR output).
  useEffect(() => hydrateStore(), []);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen w-full bg-background">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden border-r border-sidebar-border transition-[width] duration-150 lg:block",
            collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]",
          )}
        >
          <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[var(--sidebar-width)] p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <AppSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col transition-[padding] duration-150",
            collapsed ? "lg:pl-[var(--sidebar-width-collapsed)]" : "lg:pl-[var(--sidebar-width)]",
          )}
        >
          <TopBar title={titleForPath(path)} onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-8 md:px-8">
            <div className="mx-auto w-full max-w-[1280px]">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
