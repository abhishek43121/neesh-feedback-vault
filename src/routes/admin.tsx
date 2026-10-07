import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDownToLine, ArrowLeft, ArrowUpDown, Download, FileSpreadsheet, LockKeyhole, Search, ShieldCheck, Users } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFounderDashboard, lockFounderDashboard, unlockFounderDashboard } from "@/lib/pilot.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Founder access — Neesh AI 2.0" },
      { name: "description", content: "Private Neesh AI founding pilot feedback review." },
      { property: "og:title", content: "Founder access — Neesh AI 2.0" },
      { property: "og:description", content: "Private Neesh AI founding pilot feedback review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FounderAccess,
});

type FeedbackRecord = Awaited<ReturnType<typeof getFounderDashboard>>["profiles"][number];

function FounderAccess() {
  const router = useRouter();
  const unlock = useServerFn(unlockFounderDashboard);
  const lock = useServerFn(lockFounderDashboard);
  const fetchDashboard = useServerFn(getFounderDashboard);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [records, setRecords] = useState<FeedbackRecord[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const result = await fetchDashboard();
      setAuthorized(result.authorized);
      setRecords(result.profiles);
    } catch {
      setError("We couldn't open the private feedback list. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function onUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const result = await unlock({ data: { password } });
      if (!result.ok) {
        setError("That password didn’t match. Please try again.");
        setPassword("");
        return;
      }
      setPassword("");
      await refresh();
    } catch {
      setError("Founder access is not available right now. Please try again shortly.");
    }
  }

  async function onLock() {
    await lock();
    setAuthorized(false);
    setRecords([]);
    await router.invalidate();
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => [record.pilot_profiles.full_name, record.pilot_profiles.email, record.pilot_profiles.company, record.pilot_profiles.startup_name]
      .some((field) => field.toLowerCase().includes(normalized)));
  }, [query, records]);

  const allRatings = records.flatMap((record) => [record.overall_score, record.clarity_score, record.usability_score, record.onboarding_score, record.spotlight_score, record.pitch_score, record.ai_score]);
  const averageRating = allRatings.length ? (allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length).toFixed(1) : "—";
  const selected = selectedId ? records.find((record) => record.id === selectedId) : undefined;

  function exportCsv() {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportRows(records)));
    downloadFile(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }), "neesh-pilot-feedback.csv");
  }

  function exportExcel() {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(profileRows(records)), "Pilot users");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(feedbackRows(records)), "Feedback");
    XLSX.writeFile(workbook, "neesh-pilot-feedback.xlsx");
  }

  if (loading) return <main className="admin-loading" aria-live="polite">Loading private pilot workspace…</main>;

  if (!authorized) return <main className="admin-lock-page"><div className="admin-lock-panel"><a className="brand" href="/"><span className="brand-mark">N</span><span>neesh <b>AI</b></span></a><div className="lock-emblem"><LockKeyhole /></div><span className="section-kicker">FOUNDING PILOT · PRIVATE</span><h1>Founder access</h1><p>Enter the shared password to view pilot participant details and feedback.</p><form onSubmit={onUnlock} className="unlock-form"><label htmlFor="founder-password">Password</label><Input id="founder-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required maxLength={128} autoFocus /><Button size="lg" type="submit">Open 2.0 <ArrowDownToLine /></Button></form>{error && <p className="form-error" role="alert">{error}</p>}<a className="back-link" href="/"><ArrowLeft /> Back to pilot overview</a><div className="lock-assurance"><ShieldCheck /> Private, founder-only workspace</div></div></main>;

  return <main className="admin-shell"><header className="admin-header"><a className="brand" href="/"><span className="brand-mark">N</span><span>neesh <b>AI</b></span></a><div className="admin-label"><span className="admin-live-dot" /> FOUNDER WORKSPACE</div><Button variant="outline" size="sm" onClick={() => void onLock()}><LockKeyhole /> Lock dashboard</Button></header>
    <div className="admin-content"><div className="admin-title-row"><div><a className="back-link" href="/"><ArrowLeft /> Pilot overview</a><span className="section-kicker">PRIVATE BETA · RESPONSE LIBRARY</span><h1>Pilot feedback</h1><p>Every response, detail, and product signal—together in one place.</p></div><div className="export-actions"><Button variant="outline" onClick={exportCsv}><Download /> Export CSV</Button><Button onClick={exportExcel}><FileSpreadsheet /> Export Excel</Button></div></div>
      <div className="stat-grid"><Stat label="Pilot participants" value={new Set(records.map((record) => record.profile_id)).size.toString()} detail="Unique profiles" icon={<Users />} /><Stat label="Feedback entries" value={records.length.toString()} detail="Private responses" icon={<ArrowUpDown />} /><Stat label="Average rating" value={averageRating} detail="Across all ratings" icon={<span className="stat-star">★</span>} /></div>
      <div className="admin-list-toolbar"><div><h2>All responses</h2><p>Search participants by name, email, company, or startup.</p></div><label className="search-box"><Search /><Input aria-label="Search pilot responses" placeholder="Search people or projects" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
      <div className="response-table-wrap"><table className="response-table"><thead><tr><th>Participant</th><th>Startup / company</th><th>Overall</th><th>Clarity</th><th>AI</th><th>Would return</th><th>Submitted</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id} onClick={() => setSelectedId(record.id)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setSelectedId(record.id); }}><td><b>{record.pilot_profiles.full_name}</b><small>{record.pilot_profiles.email}</small></td><td>{record.pilot_profiles.startup_name || record.pilot_profiles.company || "—"}</td><td><RatingValue value={record.overall_score} /></td><td>{record.clarity_score} / 5</td><td>{record.ai_score} / 5</td><td>{record.reuse_intent || "—"}</td><td>{new Date(record.submitted_at).toLocaleDateString()}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={7} className="empty-table">{records.length ? "No responses match that search." : "No feedback has been submitted yet."}</td></tr>}</tbody></table></div>
      <div className="admin-footnote"><ShieldCheck /> All participant details are private to the Neesh AI team. Use the export buttons for a spreadsheet copy.</div>
    </div>
    {selected && <div className="detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}><section className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="detail-header"><div><span className="section-kicker">PILOT PARTICIPANT</span><h2 id="detail-title">{selected.pilot_profiles.full_name}</h2><p>{selected.pilot_profiles.email}</p></div><Button variant="outline" size="icon" aria-label="Close details" onClick={() => setSelectedId(null)}>×</Button></div><div className="detail-content"><DetailSection title="Profile"><Detail label="WhatsApp" value={selected.pilot_profiles.whatsapp} /><Detail label="Role" value={selected.pilot_profiles.pilot_role} /><Detail label="Profession" value={selected.pilot_profiles.profession} /><Detail label="Company" value={selected.pilot_profiles.company} /><Detail label="Startup" value={selected.pilot_profiles.startup_name} /><Detail label="Location" value={selected.pilot_profiles.location} /><Detail label="Experience" value={selected.pilot_profiles.experience} /><Detail label="LinkedIn" value={selected.pilot_profiles.linkedin_url} /><Detail label="Joined" value={new Date(selected.pilot_profiles.created_at).toLocaleDateString()} /><Detail label="Why they joined" value={selected.pilot_profiles.why_joined} /><Detail label="What they want from Neesh" value={selected.pilot_profiles.expectations} /></DetailSection><DetailSection title="Ratings"><div className="detail-rating-grid">{[["Overall", selected.overall_score], ["Clarity", selected.clarity_score], ["Usability", selected.usability_score], ["Onboarding", selected.onboarding_score], ["Spotlight", selected.spotlight_score], ["Elevator Pitch", selected.pitch_score], ["AI", selected.ai_score]].map(([label, score]) => <div key={String(label)}><small>{label}</small><b>{score}<i> / 5</i></b></div>)}</div></DetailSection><DetailSection title="Written feedback"><Detail label="Most valuable" value={selected.valuable_part} /><Detail label="Most frustrating" value={selected.frustrating_part} /><Detail label="Confusing moments" value={selected.confusing_part} /><Detail label="Missing feature" value={selected.missing_feature} /><Detail label="One change" value={selected.improvement} /><Detail label="What would make them leave" value={selected.brutal_feedback} /><Detail label="Discovered something new?" value={`${selected.discovery_answer}${selected.discovery_detail ? ` — ${selected.discovery_detail}` : ""}`} /><Detail label="Recommend Neesh?" value={selected.recommendation} /><Detail label="Would use again?" value={selected.reuse_intent} /><Detail label="Tested" value={selected.what_tested.join(", ")} /></DetailSection><DetailSection title="Submitted work"><Detail label="Spotlight" value={selected.spotlight_url} link /><Detail label="Elevator Pitch" value={selected.pitch_url} link /><Detail label="Project / demo" value={selected.project_url} link /><Detail label="Website / app" value={selected.website_url} link /><Detail label="Project stage" value={selected.project_stage} /><Detail label="Feedback sent" value={new Date(selected.submitted_at).toLocaleString()} /></DetailSection></div></section></div>}
  </main>;
}

function exportRows(records: FeedbackRecord[]) {
  return records.map((record) => ({ ...profileRows([record])[0], ...feedbackRows([record])[0] }));
}

function profileRows(records: FeedbackRecord[]) {
  return records.map(({ pilot_profiles: profile }) => ({
    "Full name": profile.full_name, "Email": profile.email, "WhatsApp": profile.whatsapp,
    "Profession / role": profile.profession, "Company": profile.company, "Pilot role": profile.pilot_role,
    "Startup / project": profile.startup_name, "LinkedIn": profile.linkedin_url, "Location": profile.location,
    "Experience": profile.experience, "Why joined": profile.why_joined, "Expectations": profile.expectations,
    "Participant since": profile.created_at,
  }));
}

function feedbackRows(records: FeedbackRecord[]) {
  return records.map((record) => ({
    "Full name": record.pilot_profiles.full_name, "Email": record.pilot_profiles.email,
    "Overall rating": record.overall_score, "Clarity rating": record.clarity_score,
    "Usability rating": record.usability_score, "Onboarding rating": record.onboarding_score,
    "Spotlight rating": record.spotlight_score, "Elevator Pitch rating": record.pitch_score,
    "AI rating": record.ai_score, "Most valuable": record.valuable_part, "Most frustrating": record.frustrating_part,
    "Confusing moments": record.confusing_part, "Missing feature": record.missing_feature,
    "One change": record.improvement, "Would not use again if": record.brutal_feedback,
    "Discovered something new?": record.discovery_answer, "Discovery detail": record.discovery_detail,
    "Recommendation": record.recommendation, "Would use again": record.reuse_intent,
    "What they tested": record.what_tested.join(", "), "Spotlight link": record.spotlight_url,
    "Pitch link": record.pitch_url, "Project / demo link": record.project_url,
    "Website / app link": record.website_url, "Project stage": record.project_stage,
    "Feedback submitted": record.submitted_at,
  }));
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Stat({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return <div className="stat-item"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function RatingValue({ value }: { value: number }) { return <span className="table-rating">{value}<i> / 5</i></span>; }
function DetailSection({ title, children }: { title: string; children: ReactNode }) { return <section className="detail-section"><h3>{title}</h3>{children}</section>; }
function Detail({ label, value, link = false }: { label: string; value: string | null | undefined; link?: boolean }) {
  return <div className="detail-pair"><small>{label}</small>{link && value ? <a href={value} target="_blank" rel="noreferrer">{value}</a> : <p>{value || "—"}</p>}</div>;
}