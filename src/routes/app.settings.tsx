import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/erp/EmptyState";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Recruit ERP" },
      { name: "description", content: "Configure your agency workspace." },
      { property: "og:title", content: "Settings — Recruit ERP" },
      { property: "og:description", content: "Configure your agency workspace." },
    ],
  }),
  component: Page,
});

function Page() {
  return <EmptyState icon={Settings} title="Settings" />;
}
