import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/visa")({
  head: () => ({
    meta: [
      { title: "Visa — Recruit ERP" },
      { name: "description", content: "Candidates in the Visa stage of the pipeline." },
      { property: "og:title", content: "Visa — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Visa stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="visa" />,
});
