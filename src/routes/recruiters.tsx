import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Building2, CalendarClock, CheckCircle2, Globe, Mail, Phone, Tag, User, Users, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/public/PublicLayout";
import { FileUpload } from "@/components/public/FileUpload";
import { SelectField, TextAreaField, TextField } from "@/components/public/Field";
import { CATEGORIES } from "@/data/mock";
import { addJobRequest } from "@/data/store";

export const Route = createFileRoute("/recruiters")({
  head: () => ({
    meta: [
      { title: "Post a job — Recruit ERP" },
      { name: "description", content: "Send us your vacancy. Our team will review and publish it." },
      { property: "og:title", content: "Post a job — Recruit ERP" },
      { property: "og:description", content: "Send us your vacancy. Our team will review and publish it." },
    ],
  }),
  component: RecruitersPage,
});

const EMPTY = { company: "", contact: "", email: "", phone: "", country: "", title: "", category: "", vacancies: "", salary: "", contract: "", description: "", requirements: "" };
type Key = keyof typeof EMPTY;
const REQUIRED: Key[] = ["company", "contact", "email", "phone", "country", "title", "category", "vacancies", "description"];

function RecruitersPage() {
  const [f, setF] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Key | "file", string>>>({});
  const [ref, setRef] = useState<string | null>(null);
  const set = (k: Key) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    REQUIRED.forEach((k) => { if (!f[k].trim()) er[k] = "This field is required"; });
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email";
    if (f.vacancies && !(Number(f.vacancies) > 0)) er.vacancies = "Enter a number above 0";
    if (file && !/\.pdf$/i.test(file.name)) er.file = "Attachment must be a PDF";
    setErrors(er);
    if (Object.keys(er).length) return;
    setRef(addJobRequest({
      title: f.title, country: f.country, employer: f.company, openings: Number(f.vacancies),
      category: f.category, salaryRange: f.salary || "To be confirmed",
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl">
        {ref ? (
          <div className="flex flex-col items-center rounded-2xl border border-border p-10 text-center">
            <CheckCircle2 className="size-20" strokeWidth={1.25} />
            <h1 className="page-title mt-6">Request received</h1>
            <p className="mt-4 rounded-2xl bg-primary px-6 py-3 font-mono text-2xl text-primary-foreground">{ref}</p>
            <p className="mt-5 text-muted-foreground">Our staff will review it and publish it on the website</p>
            <Button asChild className="mt-8"><Link to="/"><ArrowLeft strokeWidth={1.75} /> Back to home</Link></Button>
          </div>
        ) : (
          <>
            <h1 className="text-5xl font-extrabold tracking-tight">Post a job</h1>
            <p className="mt-3 text-lg text-muted-foreground">Send us your vacancy. Our team will review and publish it.</p>
            <form noValidate onSubmit={submit} className="mt-10 space-y-5 rounded-2xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold">Company</h2>
              <TextField id="company" label="Company name" required icon={Building2} value={f.company} onChange={set("company")} error={errors.company} />
              <TextField id="contact" label="Contact person" required icon={User} value={f.contact} onChange={set("contact")} error={errors.contact} />
              <TextField id="email" label="Email" required type="email" icon={Mail} value={f.email} onChange={set("email")} error={errors.email} />
              <TextField id="phone" label="Phone" required type="tel" icon={Phone} value={f.phone} onChange={set("phone")} error={errors.phone} />
              <TextField id="country" label="Country" required icon={Globe} value={f.country} onChange={set("country")} error={errors.country} />

              <h2 className="pt-4 text-xl font-bold">Job details</h2>
              <TextField id="title" label="Job title" required icon={Briefcase} value={f.title} onChange={set("title")} error={errors.title} />
              <SelectField id="category" label="Category" required icon={Tag} options={CATEGORIES} value={f.category} onChange={set("category")} error={errors.category} />
              <TextField id="vacancies" label="Number of vacancies" required type="number" min={1} icon={Users} value={f.vacancies} onChange={set("vacancies")} error={errors.vacancies} />
              <TextField id="salary" label="Salary range" icon={Banknote} placeholder="e.g. QAR 2,000 – 2,500" value={f.salary} onChange={set("salary")} />
              <TextField id="contract" label="Contract period" icon={CalendarClock} placeholder="e.g. 2 years" value={f.contract} onChange={set("contract")} />
              <TextAreaField id="description" label="Job description" required value={f.description} onChange={set("description")} error={errors.description} />
              <TextAreaField id="requirements" label="Requirements" value={f.requirements} onChange={set("requirements")} />
              <FileUpload id="demand" label="Demand letter or job order" accept=".pdf" hint="PDF" file={file} onChange={setFile} error={errors.file} />
              <Button type="submit" className="w-full">Submit job request</Button>
            </form>
          </>
        )}
      </div>
    </PublicLayout>
  );
}
