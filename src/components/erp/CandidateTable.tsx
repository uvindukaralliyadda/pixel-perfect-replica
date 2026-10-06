import { CheckCircle2, CircleX, Clock, type LucideIcon } from "lucide-react";
import { RowActions, type OpenSheet } from "@/components/erp/RowActions";
import { DataTable, type Column } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusPill";
import { jobById, type Candidate, type StageId } from "@/data/mock";
import { enteredStageAt, fmtDate } from "@/lib/format";

export type TableVariant = StageId;

function IconText({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
      {children}
    </span>
  );
}

const dash = <span className="text-muted-foreground">—</span>;
const val = (v: unknown) => (v ? String(v) : null);

function stageColumn(stage: StageId): Column<Candidate> | null {
  const f = (c: Candidate) => c.stageFields[stage] ?? {};
  switch (stage) {
    case "offer":
      return {
        key: "offer",
        header: "Offer status",
        cell: (c) => {
          const o = f(c);
          if (o["acceptedDate"]) return <IconText icon={CheckCircle2}>Accepted</IconText>;
          if (o["interviewResult"] === "failed") return <IconText icon={CircleX}>Interview failed</IconText>;
          if (o["offerDate"]) return <IconText icon={Clock}>Offer sent</IconText>;
          return <IconText icon={Clock}>Pending</IconText>;
        },
      };
    case "medical":
      return {
        key: "medical",
        header: "Result",
        cell: (c) => {
          const r = f(c)["result"] ?? "pending";
          if (r === "fit") return <IconText icon={CheckCircle2}>Fit</IconText>;
          if (r === "unfit") return <IconText icon={CircleX}>Unfit</IconText>;
          return <IconText icon={Clock}>Pending</IconText>;
        },
      };
    case "visa":
      return { key: "visa", header: "Visa number", cell: (c) => (val(f(c)["visaNumber"]) ? <span className="font-mono text-xs">{val(f(c)["visaNumber"])}</span> : dash) };
    case "bureau":
      return { key: "bureau", header: "Registration no.", cell: (c) => (val(f(c)["registrationNumber"]) ? <span className="font-mono text-xs">{val(f(c)["registrationNumber"])}</span> : dash) };
    case "ticket":
      return { key: "ticket", header: "Flight date", cell: (c) => { const v = val(f(c)["departureDateTime"]); return v ? fmtDate(v) : dash; } };
    case "departure":
      return {
        key: "departure",
        header: "Departure date",
        cell: (c) => {
          const v = val(f(c)["actualDepartureDate"]) ?? val(c.stageFields.ticket?.["departureDateTime"]);
          return v ? fmtDate(v) : dash;
        },
      };
    default:
      return null;
  }
}

interface Props {
  rows: Candidate[];
  variant: TableVariant;
  onView: OpenSheet;
  onShortlist: (c: Candidate) => void;
}

export function CandidateTable({ rows, variant, onView, onShortlist }: Props) {
  const isApplied = variant === "applied";

  const nameCell: Column<Candidate> = {
    key: "name",
    header: "Candidate",
    cell: (c) => (
      <span className="inline-flex items-center gap-2">
        <span className="font-semibold">{c.fullName}</span>
        <StatusBadge candidate={c} />
      </span>
    ),
  };
  const tid: Column<Candidate> = { key: "tid", header: "Tracking ID", cell: (c) => <span className="font-mono text-xs font-medium">{c.trackingId}</span> };
  const phone: Column<Candidate> = { key: "phone", header: "Phone", cell: (c) => c.phone };

  const actions: Column<Candidate> = {
    key: "actions",
    header: "Actions",
    className: "text-right",
    cell: (c) => <RowActions candidate={c} onOpen={onView} onShortlist={onShortlist} />,
  };

  const columns: Column<Candidate>[] = isApplied
    ? [
        tid,
        nameCell,
        { key: "nic", header: "NIC", cell: (c) => <span className="font-mono text-xs">{c.nic}</span> },
        phone,
        { key: "applied", header: "Applied", cell: (c) => <span className="text-muted-foreground">{fmtDate(c.appliedAt)}</span> },
        actions,
      ]
    : [
        tid,
        nameCell,
        { key: "job", header: "Job", cell: (c) => { const j = jobById(c.jobId); return <span>{j.title} <span className="text-muted-foreground">· {j.country}</span></span>; } },
        phone,
        { key: "entered", header: "Entered stage on", cell: (c) => <span className="text-muted-foreground">{fmtDate(enteredStageAt(c))}</span> },
        ...[stageColumn(variant)].filter((x): x is Column<Candidate> => !!x),
        actions,
      ];

  return <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} />;
}
