import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CalendarDays, CheckCircle2, Copy, CreditCard, GraduationCap, Hash, Home, Mail, MapPin, MessageCircle, Phone, Search, SearchX, Tag, User, Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PublicLayout } from "@/components/public/PublicLayout";
import { JobCard, JobMeta } from "@/components/public/JobCard";
import { FileUpload } from "@/components/public/FileUpload";
import { FieldError, SelectField, TextField } from "@/components/public/Field";
import { EmptyState } from "@/components/erp/EmptyState";
import { CATEGORIES, JOBS, type Job } from "@/data/mock";
import { addCandidate, useMockStore } from "@/data/store";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Current jobs abroad — Recruit ERP" },
      { name: "description", content: "Browse current jobs in Qatar, UAE, Saudi Arabia and Kuwait and apply with your CV." },
      { property: "og:title", content: "Current jobs abroad — Recruit ERP" },
      { property: "og:description", content: "Browse current jobs in Qatar, UAE, Saudi Arabia and Kuwait and apply with your CV." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  useMockStore();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [job, setJob] = useState<Job | null>(null);

  const open = JOBS.filter((j) => j.status === "open");
  const countries = [...new Set(open.map((j) => j.country))];
  const list = useMemo(
    () =>
      open.filter(
        (j) =>
          (!q || j.title.toLowerCase().includes(q.toLowerCase())) &&
          (!country || j.country === country) &&
          (!category || j.category === category),
      ),
    [open, q, country, category],
  );

  return (
    <PublicLayout>
      <h1 className="text-5xl font-extrabold tracking-tight">Current jobs</h1>
      <p className="mt-3 text-lg text-muted-foreground">Real vacancies from trusted employers. Apply in a few minutes.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <TextField id="q" label="Search" icon={Search} placeholder="Job title" value={q} onChange={(e) => setQ(e.target.value)} />
        <SelectField id="country" label="Country" icon={MapPin} options={countries} placeholder="All countries" value={country} onChange={(e) => setCountry(e.target.value)} />
        <SelectField id="category" label="Category" icon={Tag} options={CATEGORIES} placeholder="All categories" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {list.map((j) => <JobCard key={j.id} job={j} onApply={setJob} />)}
      </div>
      {list.length === 0 && <div className="mt-8"><EmptyState icon={SearchX} title="No jobs match" /></div>}

      <Sheet open={!!job} onOpenChange={(o) => !o && setJob(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
          {job && <ApplyPanel key={job.id} job={job} />}
        </SheetContent>
      </Sheet>
    </PublicLayout>
  );
}

type Errors = Partial<Record<string, string>>;

function ApplyPanel({ job }: { job: Job }) {
  const [f, setF] = useState({ name: "", nic: "", dob: "", gender: "", phone: "", whatsapp: "", email: "", address: "", qualification: "", experience: "" });
  const [files, setFiles] = useState<Record<string, File | null>>({ cv: null, passport: null, photo: null, certs: null });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!f.name.trim()) er.name = "Please enter your full name";
    if (!/^(\d{9}[vVxX]|\d{12})$/.test(f.nic.trim())) er.nic = "Enter a valid NIC (e.g. 199012345V)";
    if (!f.dob) er.dob = "Please enter your date of birth";
    if (!f.gender) er.gender = "Please select your gender";
    if (!/^\+?[\d\s]{9,15}$/.test(f.phone.trim())) er.phone = "Enter a valid phone number";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email";
    if (!f.qualification) er.qualification = "Please select a qualification";
    if (!files.cv) er.cv = "Please upload your CV";
    else if (!/\.(pdf|docx?)$/i.test(files.cv.name)) er.cv = "CV must be a PDF or Word file";
    if (!files.passport) er.passport = "Please upload your passport copy";
    if (!consent) er.consent = "Please agree to continue";
    setErrors(er);
    if (Object.keys(er).length) return;
    const labels: Record<string, string> = { cv: "CV", passport: "Passport", photo: "Photo", certs: "Certificate" };
    const c = addCandidate({
      name: f.name.trim(),
      nic: f.nic.trim(),
      phone: f.phone.trim(),
      whatsapp: f.whatsapp.trim(),
      email: f.email.trim(),
      address: f.address.trim(),
      dob: f.dob,
      jobId: job.id,
      files: Object.entries(files).flatMap(([k, file]) => (file ? [{ type: labels[k]!, file }] : [])),
    });
    setDone(c.trackingId);
  };

  if (done)
    return (
      <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
        <SheetTitle className="sr-only">Application received</SheetTitle>
        <CheckCircle2 className="size-20" strokeWidth={1.25} />
        <h2 className="page-title mt-6">Application received</h2>
        <p className="mt-2 text-muted-foreground">Your tracking ID</p>
        <p className="mt-3 rounded-2xl bg-primary px-6 py-4 font-mono text-3xl font-medium text-primary-foreground">{done}</p>
        <Button variant="secondary" className="mt-5" onClick={() => { navigator.clipboard?.writeText(done); toast("Tracking ID copied"); }}>
          <Copy strokeWidth={1.75} /> Copy ID
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">Keep this ID to track your application</p>
      </div>
    );

  return (
    <div>
      <div className="bg-primary p-6 pr-12 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Apply for</p>
        <SheetTitle className="mt-1 text-3xl font-extrabold text-primary-foreground">{job.title}</SheetTitle>
        <SheetDescription className="sr-only">Application form</SheetDescription>
        <div className="mt-4 opacity-90"><JobMeta job={job} /></div>
      </div>
      <form noValidate onSubmit={submit} className="space-y-5 p-6">
        <TextField id="name" label="Full name" required icon={User} value={f.name} onChange={set("name")} error={errors.name} />
        <TextField id="nic" label="NIC number" required icon={CreditCard} value={f.nic} onChange={set("nic")} error={errors.nic} placeholder="199012345V" />
        <TextField id="dob" label="Date of birth" required type="date" icon={CalendarDays} value={f.dob} onChange={set("dob")} error={errors.dob} />
        <SelectField id="gender" label="Gender" required icon={Users} options={["Male", "Female", "Other"]} value={f.gender} onChange={set("gender")} error={errors.gender} />
        <TextField id="phone" label="Phone" required type="tel" icon={Phone} value={f.phone} onChange={set("phone")} error={errors.phone} placeholder="+94 77 123 4567" />
        <TextField id="whatsapp" label="WhatsApp number" type="tel" icon={MessageCircle} value={f.whatsapp} onChange={set("whatsapp")} />
        <TextField id="email" label="Email" type="email" icon={Mail} value={f.email} onChange={set("email")} error={errors.email} />
        <TextField id="address" label="Address" icon={Home} value={f.address} onChange={set("address")} />
        <SelectField id="qualification" label="Highest qualification" required icon={GraduationCap} options={["O/L", "A/L", "Diploma", "Degree", "Other"]} value={f.qualification} onChange={set("qualification")} error={errors.qualification} />
        <TextField id="experience" label="Years of experience" type="number" min={0} icon={Hash} value={f.experience} onChange={set("experience")} />

        <FileUpload id="cv" label="CV" required accept=".pdf,.doc,.docx" hint="PDF or Word" file={files.cv} onChange={(x) => setFiles({ ...files, cv: x })} error={errors.cv} />
        <FileUpload id="passport" label="Passport copy" required accept="image/*,.pdf" hint="Image or PDF" file={files.passport} onChange={(x) => setFiles({ ...files, passport: x })} error={errors.passport} />
        <FileUpload id="photo" label="Photo" accept="image/*" hint="JPG or PNG" file={files.photo} onChange={(x) => setFiles({ ...files, photo: x })} />
        <FileUpload id="certs" label="Certificates" accept="image/*,.pdf" file={files.certs} onChange={(x) => setFiles({ ...files, certs: x })} />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-5 accent-foreground" />
            I agree to my data being processed for recruitment
          </label>
          <FieldError message={errors.consent} />
        </div>
        <Button type="submit" className="w-full">Submit application</Button>
      </form>
    </div>
  );
}
