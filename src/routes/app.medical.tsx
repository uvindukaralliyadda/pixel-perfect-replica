import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/medical")({
  head: () => ({
    meta: [
      { title: "Medical — Recruit ERP" },
      { name: "description", content: "Candidates in the Medical stage of the pipeline." },
      { property: "og:title", content: "Medical — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Medical stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="medical" />,
});
