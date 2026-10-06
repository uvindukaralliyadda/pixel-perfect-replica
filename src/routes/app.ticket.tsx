import { createFileRoute } from "@tanstack/react-router";
import { StageTab } from "@/components/erp/StageTab";

export const Route = createFileRoute("/app/ticket")({
  head: () => ({
    meta: [
      { title: "Ticket — Recruit ERP" },
      { name: "description", content: "Candidates in the Ticket stage of the pipeline." },
      { property: "og:title", content: "Ticket — Recruit ERP" },
      { property: "og:description", content: "Candidates in the Ticket stage of the pipeline." },
    ],
  }),
  component: () => <StageTab stage="ticket" />,
});
