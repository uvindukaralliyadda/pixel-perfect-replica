import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/erp/EmptyState";

export const Route = createFileRoute("/app/cv-lists")({
  head: () => ({
    meta: [
      { title: "CV Lists — Recruit ERP" },
      { name: "description", content: "Build and share candidate CV lists with employers." },
      { property: "og:title", content: "CV Lists — Recruit ERP" },
      { property: "og:description", content: "Build and share candidate CV lists with employers." },
    ],
  }),
  component: Page,
});

function Page() {
  return <EmptyState icon={FileText} title="CV Lists" />;
}
