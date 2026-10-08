import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpDown,
  Bug,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Lightbulb,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getFounderDashboard,
  lockFounderDashboard,
  unlockFounderDashboard,
} from "@/lib/pilot.functions";

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

function isBugOrQuickReport(record: FeedbackRecord): boolean {
  const role = record.pilot_profiles.pilot_role?.toLowerCase() || "";
  const company = record.pilot_profiles.company?.toLowerCase() || "";
  const startup = record.pilot_profiles.startup_name?.toLowerCase() || "";
  const val = record.valuable_part?.toLowerCase() || "";
  const stage = record.project_stage?.toLowerCase() || "";
  const tested = (record.what_tested || []).map((t) => t.toLowerCase());

  return (
    role.includes("bug") ||
    role.includes("reporter") ||
    company.includes("bug") ||
    company.includes("hotline") ||
    company.includes("confusion") ||
    company.includes("feature request") ||
    startup.includes("bug") ||
    stage.includes("bug") ||
    stage.includes("quick") ||
    val.startsWith("[bug") ||
    val.startsWith("[ux") ||
    val.startsWith("[feature") ||
    val.startsWith("[general") ||
    val.startsWith("[founder hotline") ||
    val.startsWith("[community") ||
    tested.includes("bug report") ||
    tested.includes("quick feedback")
  );
}

function getReportCategory(record: FeedbackRecord): string {
  const val = record.valuable_part || "";
  const match = val.match(/^\[(.*?)\]/);
  if (match && match[1]) return match[1];
  if (record.pilot_profiles.company && record.pilot_profiles.company.toLowerCase().includes("bug")) {
    return record.pilot_profiles.company;
  }
  if (record.what_tested && record.what_tested[0]) return record.what_tested[0];
  return "Quick Note";
}

function getDisplayMessage(record: FeedbackRecord): string {
  const val = record.valuable_part || "";
  const cleaned = val.replace(/^\[.*?\]\s*/, "").trim();
  return (
    cleaned ||
    record.frustrating_part ||
    record.confusing_part ||
    record.missing_feature ||
    "Feedback submission"
  );
}

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
  const [viewTab, setViewTab] = useState<"all" | "bugs" | "pilot">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

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

  useEffect(() => {
    void refresh();
  }, []);

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

  const bugRecords = useMemo(() => records.filter(isBugOrQuickReport), [records]);
  const pilotRecords = useMemo(() => records.filter((r) => !isBugOrQuickReport(r)), [records]);

  const filtered = useMemo(() => {
    let source = records;
    if (viewTab === "bugs") source = bugRecords;
    if (viewTab === "pilot") source = pilotRecords;

    const normalized = query.trim().toLowerCase();
    if (!normalized) return source;

    return source.filter((record) => {
      const fields = [
        record.pilot_profiles.full_name,
        record.pilot_profiles.email,
        record.pilot_profiles.whatsapp,
        record.pilot_profiles.company,
        record.pilot_profiles.startup_name,
        record.valuable_part,
        record.frustrating_part,
        record.confusing_part,
        record.missing_feature,
        getReportCategory(record),
        getDisplayMessage(record),
      ];
      return fields.some((field) => field && field.toLowerCase().includes(normalized));
    });
  }, [query, records, viewTab, bugRecords, pilotRecords]);

  const allRatings = pilotRecords.flatMap((record) => [
    record.overall_score,
    record.clarity_score,
    record.usability_score,
    record.onboarding_score,
    record.spotlight_score,
    record.pitch_score,
    record.ai_score,
  ]);
  const averageRating = allRatings.length
    ? (allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length).toFixed(1)
    : "—";
  const selected = selectedId ? records.find((record) => record.id === selectedId) : undefined;

  function copyText(text: string, id: string) {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Robust, reliable CSV Export using Blob download
  async function exportCsv() {
    try {
      if (records.length === 0) {
        setExportNotice("No records to export.");
        setTimeout(() => setExportNotice(null), 4000);
        return;
      }
      const rows = records.map((record) => {
        const isBug = isBugOrQuickReport(record);
        return {
          Type: isBug ? `[${getReportCategory(record)}]` : "Comprehensive Pilot",
          "Full Name": record.pilot_profiles?.full_name || "—",
          Email: record.pilot_profiles?.email || "—",
          WhatsApp: record.pilot_profiles?.whatsapp || "",
          Startup: record.pilot_profiles?.startup_name || record.pilot_profiles?.company || "",
          Message: getDisplayMessage(record),
          "Additional Details": record.confusing_part || record.brutal_feedback || "",
          "Overall Score": isBug ? "" : (record.overall_score != null ? String(record.overall_score) : ""),
          "Clarity Score": isBug ? "" : (record.clarity_score != null ? String(record.clarity_score) : ""),
          "Spotlight Score": isBug ? "" : (record.spotlight_score != null ? String(record.spotlight_score) : ""),
          "Pitch Score": isBug ? "" : (record.pitch_score != null ? String(record.pitch_score) : ""),
          "Spotlight Link": record.spotlight_url || "",
          "Pitch Link": record.pitch_url || "",
          "Project Link": record.project_url || "",
          "Submitted At": new Date(record.submitted_at).toLocaleString(),
        };
      });
      const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
      const saved = await saveFile(blob, "neesh-pilot-feedback.csv", "text/csv", "CSV Spreadsheet (*.csv)");

      if (saved) {
        setExportNotice("Exported neesh-pilot-feedback.csv successfully!");
        setTimeout(() => setExportNotice(null), 6000);
      }
    } catch (err) {
      console.error("CSV export error:", err);
      setExportNotice("CSV export failed. Check console for details.");
      setTimeout(() => setExportNotice(null), 6000);
    }
  }

  // Robust, reliable Excel Export that creates authentic binary XLSX (.xlsx format)
  async function exportExcel() {
    try {
      if (records.length === 0) {
        setExportNotice("No records to export.");
        setTimeout(() => setExportNotice(null), 4000);
        return;
      }

      const workbook = XLSX.utils.book_new();

      // Sheet 1: All Submissions Overview
      const allOverview = records.map((record) => {
        const isBug = isBugOrQuickReport(record);
        return {
          Type: isBug ? `[${getReportCategory(record)}]` : "Full Pilot Submission",
          "Full Name": record.pilot_profiles?.full_name || "—",
          Email: record.pilot_profiles?.email || "—",
          WhatsApp: record.pilot_profiles?.whatsapp || "",
          "Startup / Company":
            record.pilot_profiles?.startup_name || record.pilot_profiles?.company || "",
          Role: record.pilot_profiles?.pilot_role || "",
          "Message / Core Feedback": getDisplayMessage(record),
          "Additional Notes / Suggestions":
            record.confusing_part || record.brutal_feedback || "",
          "Overall Score": isBug ? "" : (record.overall_score != null ? String(record.overall_score) : ""),
          "Clarity Score": isBug ? "" : (record.clarity_score != null ? String(record.clarity_score) : ""),
          "AI Score": isBug ? "" : (record.ai_score != null ? String(record.ai_score) : ""),
          "Spotlight URL": record.spotlight_url || "",
          "Pitch URL": record.pitch_url || "",
          "Project URL": record.project_url || "",
          "Submitted At": new Date(record.submitted_at).toLocaleString(),
        };
      });
      const wsAll = XLSX.utils.json_to_sheet(allOverview);
      autoFitColumns(wsAll, allOverview);
      XLSX.utils.book_append_sheet(
        workbook,
        wsAll,
        "All Submissions"
      );

      // Sheet 2: Bug Reports & Quick Feedback (Dedicated tab)
      if (bugRecords.length > 0) {
        const bugRows = bugRecords.map((record) => ({
          Category: getReportCategory(record),
          "Reporter Name": record.pilot_profiles?.full_name || "—",
          Email: record.pilot_profiles?.email || "—",
          WhatsApp: record.pilot_profiles?.whatsapp || "",
          "Issue / Message": getDisplayMessage(record),
          "Extra Details / Notes": record.confusing_part || record.brutal_feedback || "",
          "Submitted At": new Date(record.submitted_at).toLocaleString(),
        }));
        const wsBugs = XLSX.utils.json_to_sheet(bugRows);
        autoFitColumns(wsBugs, bugRows);
        XLSX.utils.book_append_sheet(
          workbook,
          wsBugs,
          "Bug Reports & Notes"
        );
      }

      // Sheet 3: Pilot Feedback & Profiles
      if (pilotRecords.length > 0) {
        const feedbackData = feedbackRows(pilotRecords);
        const wsFeedback = XLSX.utils.json_to_sheet(feedbackData);
        autoFitColumns(wsFeedback, feedbackData);
        XLSX.utils.book_append_sheet(
          workbook,
          wsFeedback,
          "Pilot Feedback"
        );

        const profileData = profileRows(pilotRecords);
        const wsProfiles = XLSX.utils.json_to_sheet(profileData);
        autoFitColumns(wsProfiles, profileData);
        XLSX.utils.book_append_sheet(
          workbook,
          wsProfiles,
          "Pilot Profiles"
        );
      }

      // Generate binary XLSX buffer (Uint8Array)
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([new Uint8Array(excelBuffer)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const saved = await saveFile(
        blob,
        "neesh-pilot-feedback.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Excel Spreadsheet (*.xlsx)"
      );

      if (saved) {
        setExportNotice("Exported neesh-pilot-feedback.xlsx successfully!");
        setTimeout(() => setExportNotice(null), 6000);
      }
    } catch (err) {
      console.error("Excel export error:", err);
      setExportNotice("Export failed. Check console for details.");
      setTimeout(() => setExportNotice(null), 6000);
    }
  }

  if (loading) {
    return (
      <main className="admin-loading" aria-live="polite">
        Loading private pilot workspace…
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="admin-lock-page">
        <div className="admin-lock-panel">
          <a className="brand" href="/">
            <img
              src="/neesh-logo.png"
              alt="Neesh AI"
              className="h-8 w-auto object-contain mb-2 mx-auto"
            />
          </a>
          <div className="lock-emblem">
            <LockKeyhole />
          </div>
          <span className="section-kicker">FOUNDING PILOT · PRIVATE</span>
          <h1>Founder access</h1>
          <p>Enter the shared password to view pilot participant details and feedback.</p>
          <form onSubmit={onUnlock} className="unlock-form">
            <label htmlFor="founder-password">Password</label>
            <Input
              id="founder-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              maxLength={128}
              autoFocus
            />
            <Button size="lg" type="submit">
              Open 2.0 <ArrowDownToLine />
            </Button>
          </form>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <a className="back-link" href="/">
            <ArrowLeft /> Back to pilot overview
          </a>
          <div className="lock-assurance">
            <ShieldCheck /> Private, founder-only workspace
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="brand" href="/">
          <img src="/neesh-logo.png" alt="Neesh AI" className="h-7 w-auto object-contain" />
        </a>
        <div className="admin-label">
          <span className="admin-live-dot" /> FOUNDER WORKSPACE
        </div>
        <Button variant="outline" size="sm" onClick={() => void onLock()}>
          <LockKeyhole /> Lock dashboard
        </Button>
      </header>

      <div className="admin-content">
        <div className="admin-title-row">
          <div>
            <a className="back-link" href="/">
              <ArrowLeft /> Pilot overview
            </a>
            <span className="section-kicker">PRIVATE BETA · RESPONSE LIBRARY</span>
            <h1>Pilot feedback & bugs</h1>
            <p>Every response, reported bug, and product signal—together in one place.</p>
          </div>
          <div className="export-actions">
            <Button variant="outline" onClick={exportCsv} className="cursor-pointer">
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <Button onClick={exportExcel} className="cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 mr-1" /> Export Excel
            </Button>
          </div>
        </div>

        {/* Export Notification Banner */}
        {exportNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{exportNotice}</span>
            </span>
            <button
              onClick={() => setExportNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 border-none bg-transparent cursor-pointer font-bold px-2 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="stat-grid">
          <Stat
            label="Total entries"
            value={records.length.toString()}
            detail="All submissions"
            icon={<ArrowUpDown />}
          />
          <Stat
            label="Bugs & Quick Notes"
            value={bugRecords.length.toString()}
            detail="Direct issues & friction"
            icon={<Bug className="text-rose-500" />}
          />
          <Stat
            label="Full Pilot Reviews"
            value={pilotRecords.length.toString()}
            detail="Comprehensive onboarding"
            icon={<Rocket className="text-blue-500" />}
          />
          <Stat
            label="Average rating"
            value={averageRating}
            detail="Across full reviews"
            icon={<span className="stat-star">★</span>}
          />
        </div>

        {/* Toolbar with Filter Tabs and Search */}
        <div className="admin-list-toolbar flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Submissions Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewTab === "all"
                  ? "bg-[#0066cc] text-white shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              All Responses ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab("bugs")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === "bugs"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-rose-700 bg-rose-50 hover:bg-rose-100"
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Bugs & Quick Notes ({bugRecords.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab("pilot")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === "pilot"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-blue-700 bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Full Reviews ({pilotRecords.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <label className="search-box">
            <Search />
            <Input
              aria-label="Search pilot responses"
              placeholder="Search by name, bug message, email..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        {/* Table of Submissions */}
        <div className="response-table-wrap">
          <table className="response-table">
            <thead>
              <tr>
                <th className="w-32">Type</th>
                <th>Participant / Contact</th>
                <th className="w-2/5">Message / Feedback Summary</th>
                <th>Startup / Stage</th>
                <th>Score</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const isBug = isBugOrQuickReport(record);
                const category = getReportCategory(record);
                const msg = getDisplayMessage(record);

                return (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedId(record.id)}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") setSelectedId(record.id);
                    }}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    {/* Type Badge Column */}
                    <td>
                      {isBug ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Bug className="w-3 h-3 text-rose-600" />
                          <span>{category}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Rocket className="w-3 h-3 text-blue-600" />
                          <span>Pilot Cohort</span>
                        </span>
                      )}
                    </td>

                    {/* Participant / Contact */}
                    <td>
                      <b>{record.pilot_profiles.full_name}</b>
                      <small className="text-gray-500">
                        {record.pilot_profiles.whatsapp
                          ? `WA: ${record.pilot_profiles.whatsapp}`
                          : record.pilot_profiles.email}
                      </small>
                    </td>

                    {/* Message Preview */}
                    <td>
                      <p className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-relaxed">
                        {msg}
                      </p>
                      {record.confusing_part && !isBug && (
                        <small className="text-rose-600 line-clamp-1 mt-0.5">
                          Confusion: {record.confusing_part}
                        </small>
                      )}
                    </td>

                    {/* Startup / Stage */}
                    <td>
                      <span className="text-xs font-medium text-gray-700">
                        {record.pilot_profiles.startup_name ||
                          record.pilot_profiles.company ||
                          "—"}
                      </span>
                      {record.project_stage && (
                        <small className="text-gray-400 block">{record.project_stage}</small>
                      )}
                    </td>

                    {/* Rating */}
                    <td>
                      {isBug ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <RatingValue value={record.overall_score} />
                      )}
                    </td>

                    {/* Submitted Date */}
                    <td>
                      <span className="text-xs text-gray-500">
                        {new Date(record.submitted_at).toLocaleDateString()}
                      </span>
                      <small className="text-gray-400 block">
                        {new Date(record.submitted_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-table text-center py-12">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600">No submissions found</p>
                    <p className="text-xs text-gray-400">
                      {records.length
                        ? "Try searching for another term or selecting a different filter tab above."
                        : "No feedback or bug reports submitted yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-footnote mt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            All participant details are private to the Neesh AI team. Click any row to view full
            notes, contacts, and links.
          </span>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div
          className="detail-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
        >
          <section
            className="detail-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
          >
            <div className="detail-header">
              <div>
                <span className="section-kicker">
                  {isBugOrQuickReport(selected)
                    ? `[${getReportCategory(selected).toUpperCase()}]`
                    : "PILOT PARTICIPANT"}
                </span>
                <h2 id="detail-title">{selected.pilot_profiles.full_name}</h2>
                <p className="text-xs text-gray-500">
                  {selected.pilot_profiles.email}
                  {selected.pilot_profiles.whatsapp && ` • WA: ${selected.pilot_profiles.whatsapp}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Close details"
                onClick={() => setSelectedId(null)}
              >
                ×
              </Button>
            </div>

            <div className="detail-content space-y-6">
              {/* Specialized View for Bug Reports / Quick Notes */}
              {isBugOrQuickReport(selected) ? (
                <>
                  <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="w-5 h-5 text-rose-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                        {getReportCategory(selected)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-rose-950 mb-2">Reported Message:</h3>
                    <p className="text-sm text-rose-900 leading-relaxed font-medium bg-white/70 p-4 rounded-xl border border-rose-200/60 whitespace-pre-wrap">
                      {getDisplayMessage(selected)}
                    </p>
                  </div>

                  {selected.confusing_part && (
                    <DetailSection title="Additional Suggestions / Details">
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {selected.confusing_part}
                      </p>
                    </DetailSection>
                  )}

                  <DetailSection title="Reporter Contact Information">
                    <Detail label="Full name" value={selected.pilot_profiles.full_name} />
                    <Detail label="Email" value={selected.pilot_profiles.email} />
                    <Detail label="WhatsApp / Phone" value={selected.pilot_profiles.whatsapp} />
                    {selected.pilot_profiles.whatsapp && (
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/${selected.pilot_profiles.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Reply via WhatsApp ↗</span>
                        </a>
                      </div>
                    )}
                  </DetailSection>

                  <DetailSection title="Timestamp">
                    <Detail
                      label="Reported at"
                      value={new Date(selected.submitted_at).toLocaleString()}
                    />
                  </DetailSection>
                </>
              ) : (
                /* Full Comprehensive Pilot Participant View */
                <>
                  <DetailSection title="Profile">
                    <Detail label="WhatsApp" value={selected.pilot_profiles.whatsapp} />
                    <Detail label="Role" value={selected.pilot_profiles.pilot_role} />
                    <Detail label="Profession" value={selected.pilot_profiles.profession} />
                    <Detail label="Company" value={selected.pilot_profiles.company} />
                    <Detail label="Startup" value={selected.pilot_profiles.startup_name} />
                    <Detail label="Location" value={selected.pilot_profiles.location} />
                    <Detail label="Experience" value={selected.pilot_profiles.experience} />
                    <Detail
                      label="LinkedIn"
                      value={selected.pilot_profiles.linkedin_url}
                      link
                    />
                    <Detail
                      label="Joined"
                      value={new Date(selected.pilot_profiles.created_at).toLocaleDateString()}
                    />
                    <Detail label="Why they joined" value={selected.pilot_profiles.why_joined} />
                    <Detail
                      label="What they want from Neesh"
                      value={selected.pilot_profiles.expectations}
                    />
                  </DetailSection>

                  <DetailSection title="Ratings">
                    <div className="detail-rating-grid">
                      {[
                        ["Overall", selected.overall_score],
                        ["Clarity", selected.clarity_score],
                        ["Usability", selected.usability_score],
                        ["Onboarding", selected.onboarding_score],
                        ["Spotlight", selected.spotlight_score],
                        ["Elevator Pitch", selected.pitch_score],
                        ["AI", selected.ai_score],
                      ].map(([label, score]) => (
                        <div key={String(label)}>
                          <small>{label}</small>
                          <b>
                            {score}
                            <i> / 5</i>
                          </b>
                        </div>
                      ))}
                    </div>
                  </DetailSection>

                  <DetailSection title="Written feedback">
                    <Detail label="Most valuable" value={selected.valuable_part} />
                    <Detail label="Most frustrating" value={selected.frustrating_part} />
                    <Detail label="Confusing moments" value={selected.confusing_part} />
                    <Detail label="Missing feature" value={selected.missing_feature} />
                    <Detail label="One change" value={selected.improvement} />
                    <Detail
                      label="What would make them leave"
                      value={selected.brutal_feedback}
                    />
                    <Detail
                      label="Discovered something new?"
                      value={`${selected.discovery_answer}${
                        selected.discovery_detail ? ` — ${selected.discovery_detail}` : ""
                      }`}
                    />
                    <Detail label="Recommend Neesh?" value={selected.recommendation} />
                    <Detail label="Would use again?" value={selected.reuse_intent} />
                    <Detail label="Tested" value={selected.what_tested.join(", ")} />
                  </DetailSection>

                  <DetailSection title="Submitted work">
                    <Detail label="Spotlight" value={selected.spotlight_url} link />
                    <Detail label="Elevator Pitch" value={selected.pitch_url} link />
                    <Detail label="Project / demo" value={selected.project_url} link />
                    <Detail label="Website / app" value={selected.website_url} link />
                    <Detail label="Project stage" value={selected.project_stage} />
                    <Detail
                      label="Feedback sent"
                      value={new Date(selected.submitted_at).toLocaleString()}
                    />
                  </DetailSection>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function profileRows(records: FeedbackRecord[]) {
  return records.map((record) => {
    const profile = record.pilot_profiles || ({} as Partial<FeedbackRecord["pilot_profiles"]>);
    return {
      "Full name": profile.full_name || "—",
      Email: profile.email || "—",
      WhatsApp: profile.whatsapp || "—",
      "Profession / role": profile.profession || "—",
      Company: profile.company || "—",
      "Pilot role": profile.pilot_role || "—",
      "Startup / project": profile.startup_name || "—",
      LinkedIn: profile.linkedin_url || "—",
      Location: profile.location || "—",
      Experience: profile.experience || "—",
      "Why joined": profile.why_joined || "—",
      Expectations: profile.expectations || "—",
      "Participant since": profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—",
    };
  });
}

function feedbackRows(records: FeedbackRecord[]) {
  return records.map((record) => ({
    "Full name": record.pilot_profiles?.full_name || "—",
    Email: record.pilot_profiles?.email || "—",
    "Overall rating": record.overall_score ?? "—",
    "Clarity rating": record.clarity_score ?? "—",
    "Usability rating": record.usability_score ?? "—",
    "Onboarding rating": record.onboarding_score ?? "—",
    "Spotlight rating": record.spotlight_score ?? "—",
    "Elevator Pitch rating": record.pitch_score ?? "—",
    "AI rating": record.ai_score ?? "—",
    "Most valuable": record.valuable_part || "—",
    "Most frustrating": record.frustrating_part || "—",
    "Confusing moments": record.confusing_part || "—",
    "Missing feature": record.missing_feature || "—",
    "One change": record.improvement || "—",
    "Would not use again if": record.brutal_feedback || "—",
    "Discovered something new?": record.discovery_answer || "—",
    "Discovery detail": record.discovery_detail || "—",
    Recommendation: record.recommendation || "—",
    "Would use again": record.reuse_intent || "—",
    "What they tested": (record.what_tested || []).join(", ") || "—",
    "Spotlight link": record.spotlight_url || "—",
    "Pitch link": record.pitch_url || "—",
    "Project / demo link": record.project_url || "—",
    "Website / app link": record.website_url || "—",
    "Project stage": record.project_stage || "—",
    "Feedback submitted": new Date(record.submitted_at).toLocaleString(),
  }));
}

function autoFitColumns(worksheet: XLSX.WorkSheet, rows: Array<Record<string, unknown>>) {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0] || {});
  worksheet["!cols"] = keys.map((key) => {
    let maxLen = key.length;
    for (const row of rows) {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const len = String(val).length;
        if (len > maxLen) maxLen = len;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 12), 55) };
  });
}

async function saveFile(
  blob: Blob,
  filename: string,
  mimeType: string,
  description: string
): Promise<boolean> {
  // 1. If supported in modern desktop Chromium (Chrome/Edge on Windows), use the native Save File Picker
  if (typeof window !== "undefined" && "showSaveFilePicker" in window) {
    try {
      const picker = (
        window as unknown as {
          showSaveFilePicker: (options: unknown) => Promise<{
            createWritable: () => Promise<{
              write: (data: unknown) => Promise<void>;
              close: () => Promise<void>;
            }>;
          }>;
        }
      ).showSaveFilePicker;

      const ext = filename.slice(filename.lastIndexOf("."));
      const handle = await picker({
        suggestedName: filename,
        types: [
          {
            description,
            accept: {
              [mimeType]: [ext],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return false;
      }
      console.warn("showSaveFilePicker failed or unpermitted, using anchor download:", err);
    }
  }

  // 2. Standard browser download fallback via File + ObjectURL + <a>
  const fileObj =
    typeof File !== "undefined"
      ? new File([blob], filename, { type: mimeType })
      : blob;
  const url = window.URL.createObjectURL(fileObj);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.setAttribute("download", filename);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }, 4000);
  return true;
}

function Stat({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="stat-item">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function RatingValue({ value }: { value: number }) {
  return (
    <span className="table-rating">
      {value}
      <i> / 5</i>
    </span>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="detail-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Detail({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string | null | undefined;
  link?: boolean;
}) {
  return (
    <div className="detail-pair">
      <small>{label}</small>
      {link && value ? (
        <a href={value.startsWith("http") ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-[#0066cc] underline">
          {value}
        </a>
      ) : (
        <p>{value || "—"}</p>
      )}
    </div>
  );
}