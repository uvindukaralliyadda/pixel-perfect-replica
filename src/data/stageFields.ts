import type { StageId } from "@/data/mock";

export type FieldType = "text" | "number" | "date" | "datetime-local" | "select" | "textarea" | "switch";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  wide?: boolean;
}

const opts = (...labels: string[]) => labels.map((l) => ({ value: l.toLowerCase(), label: l }));

export const STAGE_FIELDS: Record<StageId, FieldDef[]> = {
  applied: [],
  sorted: [
    { key: "rank", label: "Rank", type: "number" },
    { key: "notes", label: "Notes", type: "textarea", wide: true },
  ],
  offer: [
    { key: "employer", label: "Employer", type: "text" },
    { key: "salary", label: "Salary", type: "text" },
    { key: "contractPeriod", label: "Contract period", type: "text" },
    { key: "interviewResult", label: "Interview result", type: "select", options: opts("Pending", "Passed", "Failed") },
    { key: "offerDate", label: "Offer date", type: "date" },
    { key: "acceptedDate", label: "Accepted date", type: "date" },
  ],
  medical: [
    { key: "clinic", label: "Clinic", type: "text" },
    { key: "appointmentDate", label: "Appointment date", type: "date" },
    { key: "result", label: "Result", type: "select", options: opts("Pending", "Fit", "Unfit") },
  ],
  visa: [
    { key: "visaNumber", label: "Visa number", type: "text" },
    { key: "submissionDate", label: "Submission date", type: "date" },
    { key: "issueDate", label: "Issue date", type: "date" },
    { key: "expiryDate", label: "Expiry date", type: "date" },
  ],
  bureau: [
    { key: "registrationNumber", label: "Registration number", type: "text" },
    { key: "clearanceDate", label: "Clearance date", type: "date" },
    { key: "insuranceReference", label: "Insurance reference", type: "text" },
  ],
  ticket: [
    { key: "airline", label: "Airline", type: "text" },
    { key: "flightNumber", label: "Flight number", type: "text" },
    { key: "departureDateTime", label: "Departure date and time", type: "datetime-local", wide: true },
    { key: "ticketReference", label: "Ticket reference", type: "text" },
  ],
  departure: [
    { key: "actualDepartureDate", label: "Actual departure date", type: "date" },
    { key: "arrivalConfirmed", label: "Arrival confirmed", type: "switch" },
  ],
};

export const DEFAULT_DOC_TYPE: Record<StageId, string> = {
  applied: "Other",
  sorted: "Other",
  offer: "Offer letter",
  medical: "Medical report",
  visa: "Visa copy",
  bureau: "Other",
  ticket: "E-ticket",
  departure: "Other",
};
