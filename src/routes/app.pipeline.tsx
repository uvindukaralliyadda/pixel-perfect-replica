import { createFileRoute } from "@tanstack/react-router";
import { Kanban } from "lucide-react";
import { EmptyState } from "@/components/erp/EmptyState";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline — Recruit ERP" },
      { name: "description", content: "Track candidates through every recruitment stage." },
      { property: "og:title", content: "Pipeline — Recruit ERP" },
      { property: "og:description", content: "Track candidates through every recruitment stage." },
    ],
  }),
  component: Page,
});

function Page() {
  return <EmptyState icon={Kanban} title="Pipeline" />;
}
