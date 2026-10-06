import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/sorted")({
  head: () => ({
    meta: [
      { title: "Sorted — Recruit ERP" },
      { name: "description", content: "Candidates in the Sorted stage of the pipeline." },
      { property: "og:title", content: "Sorted — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Sorted stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="sorted" />,
});
