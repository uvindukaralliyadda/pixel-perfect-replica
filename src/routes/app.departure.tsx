import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/departure")({
  head: () => ({
    meta: [
      { title: "Departure — Recruit ERP" },
      { name: "description", content: "Candidates in the Departure stage of the pipeline." },
      { property: "og:title", content: "Departure — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Departure stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="departure" />,
});
