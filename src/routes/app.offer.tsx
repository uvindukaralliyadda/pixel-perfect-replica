import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/offer")({
  head: () => ({
    meta: [
      { title: "Offer — Recruit ERP" },
      { name: "description", content: "Candidates in the Offer stage of the pipeline." },
      { property: "og:title", content: "Offer — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Offer stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="offer" />,
});
