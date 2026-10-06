import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/erp/AppLayout";

export const Route = createFileRoute("/app")({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
