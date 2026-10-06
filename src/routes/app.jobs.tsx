import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/erp/EmptyState";

export const Route = createFileRoute("/app/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — Recruit ERP" },
      { name: "description", content: "Manage open roles, employers and countries." },
      { property: "og:title", content: "Jobs — Recruit ERP" },
      { property: "og:description", content: "Manage open roles, employers and countries." },
    ],
  }),
  component: Page,
});

function Page() {
  return <EmptyState icon={Briefcase} title="Jobs" />;
}
