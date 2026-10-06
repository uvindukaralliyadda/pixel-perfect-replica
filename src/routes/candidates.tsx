import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/erp/EmptyState";

export const Route = createFileRoute("/candidates")({
  head: () => ({
    meta: [
      { title: "Candidates — Recruit ERP" },
      { name: "description", content: "Browse and manage every candidate profile." },
      { property: "og:title", content: "Candidates — Recruit ERP" },
      { property: "og:description", content: "Browse and manage every candidate profile." },
    ],
  }),
  component: Page,
});

function Page() {
  return <EmptyState icon={Users} title="Candidates" />;
}
