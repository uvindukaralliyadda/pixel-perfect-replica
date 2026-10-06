import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/bureau")({
  head: () => ({
    meta: [
      { title: "Bureau — Recruit ERP" },
      { name: "description", content: "Candidates in the Bureau stage of the pipeline." },
      { property: "og:title", content: "Bureau — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Bureau stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="bureau" />,
});
