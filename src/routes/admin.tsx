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
  Eye,
  FileSpreadsheet,
  Globe,
  Lightbulb,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Phone,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
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
      { name: "description", content: "Private Neesh AI founding pilot visitor and feedback analytics." },
      { property: "og:title", content: "Founder access — Neesh AI 2.0" },
      { property: "og:description", content: "Private Neesh AI founding pilot visitor and feedback analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FounderAccess,
});

type DashboardResult = Awaited<ReturnType<typeof getFounderDashboard>>;
type FeedbackRecord = DashboardResult["profiles"][number];
type MemberProfile = DashboardResult["registeredMembers"][number];

type ViewTab = "visitors" | "members" | "bugs" | "pilot" | "all";

function isPageView(record: FeedbackRecord): boolean {
  const val = record.valuable_part?.toLowerCase() || "";
  const tested = (record.what_tested || []).map((t) => t.toLowerCase());
  const role = record.pilot_profiles?.pilot_role?.toLowerCase() || "";
  const email = record.pilot_profiles?.email?.toLowerCase() || "";

  return (
    val.startsWith("[page_view]") ||
    val.startsWith("[page view]") ||
    tested.includes("pageview") ||
    role === "website visitor" ||
    email.startsWith("visitor-")
  );
}

function parseVisitorDetails(record: FeedbackRecord) {
  const path = record.valuable_part?.replace(/^\[PAGE_VIEW\]\s*/i, "").trim() || "/";
  const rawDetails = record.frustrating_part || "";

  const ipMatch = rawDetails.match(/IP:\s*([^|]+)/i);
  const ip = ipMatch?.[1]?.trim() || "—";

  const locMatch = rawDetails.match(/Location:\s*([^|]+)/i);
  const location = locMatch?.[1]?.trim() || (record.pilot_profiles?.location || "Unknown");

  const screenMatch = rawDetails.match(/Screen:\s*([^|]+)/i);
  const screen = screenMatch?.[1]?.trim() || "";

  const tzMatch = rawDetails.match(/TZ:\s*([^|]+)/i);
  const timezone = tzMatch?.[1]?.trim() || "";

  const device = record.improvement || record.pilot_profiles?.startup_name || "Web browser";
  const referrer = record.website_url || "Direct";

  const isMember =
    record.project_stage === "Member Visit" ||
    Boolean(
      record.pilot_profiles?.email &&
        !record.pilot_profiles.email.startsWith("visitor-") &&
        record.pilot_profiles.pilot_role !== "Website Visitor",
    );

  let pageLabel = "Home (/)";
  if (path.includes("#guide")) pageLabel = "Founder Guide (#guide)";
  else if (path.includes("#checklist")) pageLabel = "Action Checklist (#checklist)";
  else if (path.includes("#pitch")) pageLabel = "Elevator Pitch (#pitch)";
  else if (path.includes("#spotlight")) pageLabel = "Product Spotlight (#spotlight)";
  else if (path.includes("#feedback")) pageLabel = "Feedback Form (#feedback)";
  else if (path.includes("/admin")) pageLabel = "Admin Dashboard (/admin)";
  else if (path !== "/") pageLabel = path;

  return {
    path,
    pageLabel,
    ip,
    location,
    screen,
    timezone,
    device,
    referrer,
    isMember,
    userAgent: record.confusing_part || "",
    visitorId: record.missing_feature || "",
  };
}

function isBugOrQuickReport(record: FeedbackRecord): boolean {
  if (isPageView(record)) return false;

  const role = record.pilot_profiles?.pilot_role?.toLowerCase() || "";
  const company = record.pilot_profiles?.company?.toLowerCase() || "";
  const startup = record.pilot_profiles?.startup_name?.toLowerCase() || "";
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
  if (record.pilot_profiles?.company && record.pilot_profiles.company.toLowerCase().includes("bug")) {
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
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMemberEmail, setSelectedMemberEmail] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<ViewTab>("visitors");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const result = await fetchDashboard();
      setAuthorized(result.authorized);
      setRecords(result.profiles);
      setMembers(result.registeredMembers || []);
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
    setMembers([]);
    await router.invalidate();
  }

  // Filtered dataset categories
  const pageViewRecords = useMemo(() => records.filter(isPageView), [records]);
  const bugRecords = useMemo(() => records.filter(isBugOrQuickReport), [records]);
  const pilotRecords = useMemo(
    () => records.filter((r) => !isPageView(r) && !isBugOrQuickReport(r)),
    [records]
  );
  const registeredFounders = useMemo(() => {
    return members.filter(
      (m) =>
        m.email &&
        !m.email.toLowerCase().startsWith("visitor-") &&
        m.pilot_role !== "Website Visitor"
    );
  }, [members]);

  // Unique visitor count
  const uniqueVisitorsCount = useMemo(() => {
    const set = new Set<string>();
    for (const r of pageViewRecords) {
      const id = r.missing_feature || r.pilot_profiles?.email || r.id;
      if (id) set.add(id);
    }
    return set.size;
  }, [pageViewRecords]);

  // Filtered visitors
  const filteredVisitors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pageViewRecords;
    return pageViewRecords.filter((record) => {
      const details = parseVisitorDetails(record);
      const fields = [
        record.pilot_profiles?.full_name,
        record.pilot_profiles?.email,
        record.pilot_profiles?.startup_name,
        record.pilot_profiles?.company,
        details.path,
        details.pageLabel,
        details.ip,
        details.location,
        details.device,
        details.referrer,
        details.visitorId,
      ];
      return fields.some((field) => field && field.toLowerCase().includes(normalized));
    });
  }, [pageViewRecords, query]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return registeredFounders;
    return registeredFounders.filter((member) => {
      const fields = [
        member.full_name,
        member.email,
        member.whatsapp,
        member.startup_name,
        member.company,
        member.pilot_role,
        member.location,
      ];
      return fields.some((field) => field && field.toLowerCase().includes(normalized));
    });
  }, [registeredFounders, query]);

  // Filtered general submissions (bugs, pilot, all)
  const filteredSubmissions = useMemo(() => {
    let source = records;
    if (viewTab === "bugs") source = bugRecords;
    if (viewTab === "pilot") source = pilotRecords;

    const normalized = query.trim().toLowerCase();
    if (!normalized) return source;

    return source.filter((record) => {
      const fields = [
        record.pilot_profiles?.full_name,
        record.pilot_profiles?.email,
        record.pilot_profiles?.whatsapp,
        record.pilot_profiles?.company,
        record.pilot_profiles?.startup_name,
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
  const selectedMember = selectedMemberEmail
    ? registeredFounders.find((m) => m.email === selectedMemberEmail)
    : undefined;

  function copyText(text: string, id: string) {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Robust, reliable CSV Export
  async function exportCsv() {
    try {
      if (viewTab === "visitors") {
        if (pageViewRecords.length === 0) {
          setExportNotice("No visitor logs to export.");
          setTimeout(() => setExportNotice(null), 4000);
          return;
        }
        const rows = pageViewRecords.map((r) => {
          const d = parseVisitorDetails(r);
          return {
            "Visitor Type": d.isMember ? "Registered Member" : "Anonymous Visitor",
            "Full Name": d.isMember ? r.pilot_profiles?.full_name : "—",
            Email: d.isMember ? r.pilot_profiles?.email : "—",
            WhatsApp: d.isMember ? r.pilot_profiles?.whatsapp || "" : "",
            Startup: d.isMember ? r.pilot_profiles?.startup_name || "" : "",
            "Visited Page": d.path,
            "Page Label": d.pageLabel,
            "IP Address": d.ip,
            Location: d.location,
            "Device / Browser": d.device,
            "Screen Size": d.screen,
            Timezone: d.timezone,
            Referrer: d.referrer,
            "Visitor Session ID": d.visitorId,
            "Visited At": new Date(r.submitted_at).toLocaleString(),
          };
        });
        const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        const saved = await saveFile(blob, "neesh-website-visitors.csv", "text/csv", "CSV Spreadsheet (*.csv)");
        if (saved) {
          setExportNotice("Exported neesh-website-visitors.csv successfully!");
          setTimeout(() => setExportNotice(null), 6000);
        }
        return;
      }

      if (viewTab === "members") {
        if (registeredFounders.length === 0) {
          setExportNotice("No registered founders to export.");
          setTimeout(() => setExportNotice(null), 4000);
          return;
        }
        const rows = registeredFounders.map((m) => ({
          "Full Name": m.full_name || "—",
          Email: m.email || "—",
          WhatsApp: m.whatsapp || "",
          "Startup Name": m.startup_name || m.company || "",
          Role: m.pilot_role || "",
          Location: m.location || "",
          "Registered At": new Date(m.created_at).toLocaleString(),
        }));
        const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        const saved = await saveFile(blob, "neesh-registered-founders.csv", "text/csv", "CSV Spreadsheet (*.csv)");
        if (saved) {
          setExportNotice("Exported neesh-registered-founders.csv successfully!");
          setTimeout(() => setExportNotice(null), 6000);
        }
        return;
      }

      // Default CSV export for feedback & submissions
      const targetRecords = viewTab === "bugs" ? bugRecords : viewTab === "pilot" ? pilotRecords : records;
      if (targetRecords.length === 0) {
        setExportNotice("No records to export.");
        setTimeout(() => setExportNotice(null), 4000);
        return;
      }
      const rows = targetRecords.map((record) => {
        const isBug = isBugOrQuickReport(record);
        const isVisit = isPageView(record);
        return {
          Type: isVisit
            ? "[Website Visit]"
            : isBug
              ? `[${getReportCategory(record)}]`
              : "Comprehensive Pilot",
          "Full Name": record.pilot_profiles?.full_name || "—",
          Email: record.pilot_profiles?.email || "—",
          WhatsApp: record.pilot_profiles?.whatsapp || "",
          Startup: record.pilot_profiles?.startup_name || record.pilot_profiles?.company || "",
          Message: getDisplayMessage(record),
          "Additional Details": record.confusing_part || record.brutal_feedback || "",
          "Overall Score": isBug || isVisit ? "" : (record.overall_score != null ? String(record.overall_score) : ""),
          "Clarity Score": isBug || isVisit ? "" : (record.clarity_score != null ? String(record.clarity_score) : ""),
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

  // Multi-tab Excel Export
  async function exportExcel() {
    try {
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Website Visitors
      if (pageViewRecords.length > 0) {
        const visitorRows = pageViewRecords.map((r) => {
          const d = parseVisitorDetails(r);
          return {
            "Visitor Type": d.isMember ? "Registered Founder" : "Anonymous Visitor",
            "Founder / Name": d.isMember ? r.pilot_profiles?.full_name : "—",
            Email: d.isMember ? r.pilot_profiles?.email : "—",
            WhatsApp: d.isMember ? r.pilot_profiles?.whatsapp || "" : "",
            Startup: d.isMember ? r.pilot_profiles?.startup_name || "" : "",
            "Page Section": d.pageLabel,
            "Exact Path": d.path,
            "IP Address": d.ip,
            Location: d.location,
            Device: d.device,
            "Screen Resolution": d.screen,
            Timezone: d.timezone,
            Referrer: d.referrer,
            "Visitor ID": d.visitorId,
            "Visited At": new Date(r.submitted_at).toLocaleString(),
          };
        });
        const wsVisitors = XLSX.utils.json_to_sheet(visitorRows);
        autoFitColumns(wsVisitors, visitorRows);
        XLSX.utils.book_append_sheet(workbook, wsVisitors, "Website Visitors");
      }

      // Sheet 2: Registered Founders Roster
      if (registeredFounders.length > 0) {
        const memberRows = registeredFounders.map((m) => ({
          "Full Name": m.full_name || "—",
          Email: m.email || "—",
          WhatsApp: m.whatsapp || "",
          Startup: m.startup_name || m.company || "",
          Role: m.pilot_role || "",
          Location: m.location || "",
          "Registered At": new Date(m.created_at).toLocaleString(),
        }));
        const wsMembers = XLSX.utils.json_to_sheet(memberRows);
        autoFitColumns(wsMembers, memberRows);
        XLSX.utils.book_append_sheet(workbook, wsMembers, "Registered Founders");
      }

      // Sheet 3: Bug Reports & Quick Notes
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
        XLSX.utils.book_append_sheet(workbook, wsBugs, "Bug Reports & Notes");
      }

      // Sheet 4: Pilot Feedback & Reviews
      if (pilotRecords.length > 0) {
        const feedbackData = feedbackRows(pilotRecords);
        const wsFeedback = XLSX.utils.json_to_sheet(feedbackData);
        autoFitColumns(wsFeedback, feedbackData);
        XLSX.utils.book_append_sheet(workbook, wsFeedback, "Pilot Feedback");
      }

      // Sheet 5: All Submissions Overview
      if (records.length > 0) {
        const allOverview = records.map((record) => {
          const isVisit = isPageView(record);
          const isBug = isBugOrQuickReport(record);
          return {
            Type: isVisit
              ? "[Website Visit]"
              : isBug
                ? `[${getReportCategory(record)}]`
                : "Full Pilot Submission",
            "Full Name": record.pilot_profiles?.full_name || "—",
            Email: record.pilot_profiles?.email || "—",
            WhatsApp: record.pilot_profiles?.whatsapp || "",
            Startup: record.pilot_profiles?.startup_name || record.pilot_profiles?.company || "",
            "Core Message": getDisplayMessage(record),
            "Submitted At": new Date(record.submitted_at).toLocaleString(),
          };
        });
        const wsAll = XLSX.utils.json_to_sheet(allOverview);
        autoFitColumns(wsAll, allOverview);
        XLSX.utils.book_append_sheet(workbook, wsAll, "All Submissions");
      }

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([new Uint8Array(excelBuffer)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const saved = await saveFile(
        blob,
        "neesh-pilot-analytics.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Excel Spreadsheet (*.xlsx)"
      );

      if (saved) {
        setExportNotice("Exported neesh-pilot-analytics.xlsx successfully!");
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
          <p>Enter the shared password to view pilot visitor analytics and feedback.</p>
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            className="cursor-pointer"
            title="Refresh latest data"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => void onLock()}>
            <LockKeyhole /> Lock
          </Button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-title-row">
          <div>
            <a className="back-link" href="/">
              <ArrowLeft /> Pilot overview
            </a>
            <span className="section-kicker">PRIVATE FOUNDER INTELLIGENCE</span>
            <h1>Visitors, members & feedback</h1>
            <p>Real-time website visitor activity, registered founders roster, and reported feedback.</p>
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
            label="Website Views"
            value={pageViewRecords.length.toString()}
            detail={`${uniqueVisitorsCount} unique visitors`}
            icon={<Globe className="text-[#0066cc]" />}
          />
          <Stat
            label="Registered Founders"
            value={registeredFounders.length.toString()}
            detail="Pilot cohort members"
            icon={<Users className="text-emerald-600" />}
          />
          <Stat
            label="Bugs & Issues"
            value={bugRecords.length.toString()}
            detail="Friction & hotline notes"
            icon={<Bug className="text-rose-500" />}
          />
          <Stat
            label="Full Pilot Reviews"
            value={pilotRecords.length.toString()}
            detail={`Avg rating: ${averageRating} ★`}
            icon={<Rocket className="text-purple-600" />}
          />
        </div>

        {/* Toolbar with Filter Tabs and Search */}
        <div className="admin-list-toolbar flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Submissions Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
            {/* 1. Website Visitors Tab */}
            <button
              type="button"
              onClick={() => setViewTab("visitors")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === "visitors"
                  ? "bg-[#0066cc] text-white shadow-xs"
                  : "text-blue-700 bg-blue-50/70 hover:bg-blue-100"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website Visitors ({pageViewRecords.length})</span>
            </button>

            {/* 2. Registered Founders Tab */}
            <button
              type="button"
              onClick={() => setViewTab("members")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === "members"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Registered Founders ({registeredFounders.length})</span>
            </button>

            {/* 3. Bugs Tab */}
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
              <span>Bugs & Notes ({bugRecords.length})</span>
            </button>

            {/* 4. Full Reviews Tab */}
            <button
              type="button"
              onClick={() => setViewTab("pilot")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewTab === "pilot"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-purple-700 bg-purple-50 hover:bg-purple-100"
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Full Reviews ({pilotRecords.length})</span>
            </button>

            {/* 5. All Activity */}
            <button
              type="button"
              onClick={() => setViewTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewTab === "all"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              All Activity ({records.length})
            </button>
          </div>

          {/* Search Box */}
          <label className="search-box">
            <Search />
            <Input
              aria-label="Search records"
              placeholder={
                viewTab === "visitors"
                  ? "Search by location, IP, member name, page..."
                  : viewTab === "members"
                    ? "Search founder name, email, startup..."
                    : "Search responses, bugs, email..."
              }
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        {/* TAB 1: WEBSITE VISITORS TABLE */}
        {viewTab === "visitors" && (
          <div className="response-table-wrap">
            <table className="response-table">
              <thead>
                <tr>
                  <th>Visitor / Identity</th>
                  <th>Page / Section Visited</th>
                  <th>Location & IP</th>
                  <th>Device & Browser</th>
                  <th>Referrer</th>
                  <th>Visited At</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((record) => {
                  const details = parseVisitorDetails(record);
                  const isRegistered = details.isMember;
                  const memberName = record.pilot_profiles?.full_name || "";
                  const memberStartup =
                    record.pilot_profiles?.startup_name || record.pilot_profiles?.company || "";

                  return (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedId(record.id)}
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") setSelectedId(record.id);
                      }}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      {/* Visitor Identity */}
                      <td>
                        {isRegistered ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-900">
                                {memberName || "Pilot Founder"}
                              </span>
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Check className="w-2.5 h-2.5" /> Founder
                              </span>
                            </div>
                            <small className="text-gray-500 block">
                              {memberStartup ? `${memberStartup} • ` : ""}
                              {record.pilot_profiles?.email}
                            </small>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-gray-700">Visitor</span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-gray-100 text-gray-600">
                                {details.visitorId ? details.visitorId.slice(0, 8) : "web"}
                              </span>
                            </div>
                            <small className="text-gray-400 font-mono text-[11px] block">
                              {details.location !== "Unknown" ? details.location : details.device}
                            </small>
                          </div>
                        )}
                      </td>

                      {/* Page Visited */}
                      <td>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#0066cc] border border-blue-200">
                          <Globe className="w-3 h-3 text-[#0066cc]" />
                          <span>{details.pageLabel}</span>
                        </span>
                        <span className="block text-[11px] text-gray-400 font-mono mt-0.5 truncate max-w-[220px]">
                          {details.path}
                        </span>
                      </td>

                      {/* Location & IP */}
                      <td>
                        <div className="flex items-center gap-1 text-xs text-gray-800 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{details.location}</span>
                        </div>
                        <code className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {details.ip || "Direct"}
                        </code>
                      </td>

                      {/* Device & Browser */}
                      <td>
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <Monitor className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{details.device}</span>
                        </div>
                        {details.screen && (
                          <small className="text-[10px] text-gray-400 block font-mono">
                            {details.screen}
                          </small>
                        )}
                      </td>

                      {/* Referrer */}
                      <td>
                        <span
                          className="text-xs text-gray-600 truncate max-w-[150px] block"
                          title={details.referrer}
                        >
                          {details.referrer === "Direct" ? (
                            <span className="text-gray-400 italic">Direct / Bookmarked</span>
                          ) : (
                            details.referrer
                          )}
                        </span>
                      </td>

                      {/* Visited At */}
                      <td>
                        <span className="text-xs text-gray-700 font-medium">
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

                {filteredVisitors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-table text-center py-12">
                      <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-600">No website visits recorded yet</p>
                      <p className="text-xs text-gray-400">
                        Visitor activity and page views are tracked automatically as people browse.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: REGISTERED FOUNDERS ROSTER */}
        {viewTab === "members" && (
          <div className="response-table-wrap">
            <table className="response-table">
              <thead>
                <tr>
                  <th>Founder</th>
                  <th>Startup / Venture</th>
                  <th>Email Address</th>
                  <th>WhatsApp / Phone</th>
                  <th>Activity</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const memberViews = pageViewRecords.filter(
                    (r) => r.pilot_profiles?.email?.toLowerCase() === member.email?.toLowerCase()
                  ).length;
                  const memberFeedback = records.filter(
                    (r) =>
                      !isPageView(r) &&
                      r.pilot_profiles?.email?.toLowerCase() === member.email?.toLowerCase()
                  ).length;

                  return (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedMemberEmail(member.email)}
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") setSelectedMemberEmail(member.email);
                      }}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      {/* Founder */}
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0066cc] font-bold text-xs flex items-center justify-center shrink-0">
                            {(member.full_name || "F").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <b className="text-gray-900 block">{member.full_name || "Founding Member"}</b>
                            <small className="text-emerald-600 font-semibold text-[11px]">
                              {member.pilot_role || "Founding Member"}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* Startup */}
                      <td>
                        <span className="text-xs font-semibold text-gray-800">
                          {member.startup_name || member.company || "—"}
                        </span>
                      </td>

                      {/* Email */}
                      <td>
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(event) => event.stopPropagation()}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{member.email}</span>
                        </a>
                      </td>

                      {/* WhatsApp / Phone */}
                      <td>
                        {member.whatsapp ? (
                          <a
                            href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{member.whatsapp}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      {/* Activity */}
                      <td>
                        <div className="flex items-center gap-1.5">
                          {memberViews > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <Eye className="w-2.5 h-2.5" /> {memberViews} views
                            </span>
                          )}
                          {memberFeedback > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              <Sparkles className="w-2.5 h-2.5" /> {memberFeedback} reviews
                            </span>
                          )}
                          {memberViews === 0 && memberFeedback === 0 && (
                            <span className="text-[11px] text-gray-400 italic">Registered</span>
                          )}
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td>
                        <span className="text-xs text-gray-700 font-medium">
                          {new Date(member.created_at).toLocaleDateString()}
                        </span>
                        <small className="text-gray-400 block">
                          {new Date(member.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </td>
                    </tr>
                  );
                })}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-table text-center py-12">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-600">No registered founders found</p>
                      <p className="text-xs text-gray-400">
                        Founders who authenticate via the "Join Pilot" modal will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3, 4, 5: BUGS, PILOT REVIEWS, AND ALL RESPONSES TABLE */}
        {viewTab !== "visitors" && viewTab !== "members" && (
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
                {filteredSubmissions.map((record) => {
                  const isVisit = isPageView(record);
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
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      {/* Type Badge Column */}
                      <td>
                        {isVisit ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Globe className="w-3 h-3 text-blue-600" />
                            <span>Page View</span>
                          </span>
                        ) : isBug ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <Bug className="w-3 h-3 text-rose-600" />
                            <span>{category}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Rocket className="w-3 h-3 text-purple-600" />
                            <span>Pilot Cohort</span>
                          </span>
                        )}
                      </td>

                      {/* Participant / Contact */}
                      <td>
                        <b>{record.pilot_profiles?.full_name || "Visitor"}</b>
                        <small className="text-gray-500">
                          {record.pilot_profiles?.whatsapp
                            ? `WA: ${record.pilot_profiles.whatsapp}`
                            : record.pilot_profiles?.email}
                        </small>
                      </td>

                      {/* Message Preview */}
                      <td>
                        <p className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-relaxed">
                          {msg}
                        </p>
                        {record.confusing_part && !isBug && !isVisit && (
                          <small className="text-rose-600 line-clamp-1 mt-0.5">
                            Confusion: {record.confusing_part}
                          </small>
                        )}
                      </td>

                      {/* Startup / Stage */}
                      <td>
                        <span className="text-xs font-medium text-gray-700">
                          {record.pilot_profiles?.startup_name ||
                            record.pilot_profiles?.company ||
                            "—"}
                        </span>
                        {record.project_stage && (
                          <small className="text-gray-400 block">{record.project_stage}</small>
                        )}
                      </td>

                      {/* Rating */}
                      <td>
                        {isBug || isVisit ? (
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

                {filteredSubmissions.length === 0 && (
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
        )}

        <div className="admin-footnote mt-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            All participant and visitor details are private to the Neesh AI team. Click any row to view
            comprehensive telemetry, notes, contacts, and links.
          </span>
        </div>
      </div>

      {/* DETAIL DRAWER FOR REGISTERED MEMBER */}
      {selectedMember && (
        <div
          className="detail-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMemberEmail(null);
          }}
        >
          <section
            className="detail-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-detail-title"
          >
            <div className="detail-header">
              <div>
                <span className="section-kicker">FOUNDING PILOT MEMBER</span>
                <h2 id="member-detail-title">{selectedMember.full_name}</h2>
                <p className="text-xs text-gray-500">
                  {selectedMember.email}
                  {selectedMember.whatsapp && ` • WA: ${selectedMember.whatsapp}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                aria-label="Close details"
                onClick={() => setSelectedMemberEmail(null)}
              >
                ×
              </Button>
            </div>

            <div className="detail-content space-y-6">
              <DetailSection title="Founder Profile">
                <Detail label="Full name" value={selectedMember.full_name} />
                <Detail
                  label="Startup / Venture"
                  value={selectedMember.startup_name || selectedMember.company}
                />
                <Detail label="Email address" value={selectedMember.email} />
                <Detail label="WhatsApp / Phone" value={selectedMember.whatsapp} />
                <Detail label="Role" value={selectedMember.pilot_role} />
                <Detail
                  label="Registered at"
                  value={new Date(selectedMember.created_at).toLocaleString()}
                />
              </DetailSection>

              {selectedMember.whatsapp && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                    Direct Contact
                  </h4>
                  <a
                    href={`https://wa.me/${selectedMember.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Phone className="w-4 h-4" /> Message on WhatsApp ↗
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* DETAIL DRAWER FOR SUBMISSION / VISITOR / BUG */}
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
            {/* VIEW A: VISITOR ACTIVITY RECORD */}
            {isPageView(selected) ? (
              (() => {
                const details = parseVisitorDetails(selected);
                return (
                  <>
                    <div className="detail-header">
                      <div>
                        <span className="section-kicker">WEBSITE VISITATION LOG</span>
                        <h2 id="detail-title">
                          {details.isMember
                            ? selected.pilot_profiles?.full_name || "Pilot Founder"
                            : "Website Visitor"}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {details.isMember
                            ? `${selected.pilot_profiles?.email} • ${selected.pilot_profiles?.startup_name || ""}`
                            : `Visitor ID: ${details.visitorId || "Anonymous"}`}
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
                      {/* Page Visited Box */}
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
                        <div className="flex items-center gap-2 mb-1">
                          <Globe className="w-4 h-4 text-[#0066cc]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0066cc]">
                            Visited Page / Section
                          </span>
                        </div>
                        <div className="text-base font-bold text-gray-900">{details.pageLabel}</div>
                        <code className="text-xs text-blue-700 font-mono mt-1 block">
                          {details.path}
                        </code>
                      </div>

                      {/* Visitor Telemetry */}
                      <DetailSection title="Visitor Telemetry & Network">
                        <Detail label="IP Address" value={details.ip} />
                        <Detail label="Location" value={details.location} />
                        <Detail label="Timezone" value={details.timezone || "—"} />
                        <Detail label="Device / Browser" value={details.device} />
                        <Detail label="Screen Resolution" value={details.screen || "—"} />
                        <Detail label="Traffic Source / Referrer" value={details.referrer} />
                        <Detail label="Session Visitor ID" value={details.visitorId || "—"} />
                        <Detail
                          label="Visited At"
                          value={new Date(selected.submitted_at).toLocaleString()}
                        />
                      </DetailSection>

                      {/* Full User Agent Header */}
                      {details.userAgent && (
                        <DetailSection title="Browser User-Agent">
                          <p className="text-xs font-mono bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-700 break-all leading-relaxed">
                            {details.userAgent}
                          </p>
                        </DetailSection>
                      )}

                      {/* Linked Founder Account (if authenticated) */}
                      {details.isMember && selected.pilot_profiles && (
                        <DetailSection title="Linked Founder Profile">
                          <Detail label="Founder Name" value={selected.pilot_profiles.full_name} />
                          <Detail label="Startup" value={selected.pilot_profiles.startup_name} />
                          <Detail label="Email" value={selected.pilot_profiles.email} />
                          <Detail label="WhatsApp" value={selected.pilot_profiles.whatsapp} />
                          {selected.pilot_profiles.whatsapp && (
                            <div className="pt-2">
                              <a
                                href={`https://wa.me/${selected.pilot_profiles.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Chat via WhatsApp ↗</span>
                              </a>
                            </div>
                          )}
                        </DetailSection>
                      )}
                    </div>
                  </>
                );
              })()
            ) : isBugOrQuickReport(selected) ? (
              /* VIEW B: BUG REPORTS / QUICK NOTES */
              <>
                <div className="detail-header">
                  <div>
                    <span className="section-kicker">
                      [{getReportCategory(selected).toUpperCase()}]
                    </span>
                    <h2 id="detail-title">{selected.pilot_profiles?.full_name || "Anonymous Reporter"}</h2>
                    <p className="text-xs text-gray-500">
                      {selected.pilot_profiles?.email}
                      {selected.pilot_profiles?.whatsapp && ` • WA: ${selected.pilot_profiles.whatsapp}`}
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
                    <Detail label="Full name" value={selected.pilot_profiles?.full_name} />
                    <Detail label="Email" value={selected.pilot_profiles?.email} />
                    <Detail label="WhatsApp / Phone" value={selected.pilot_profiles?.whatsapp} />
                    {selected.pilot_profiles?.whatsapp && (
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
                </div>
              </>
            ) : (
              /* VIEW C: FULL PILOT PARTICIPANT REVIEW */
              <>
                <div className="detail-header">
                  <div>
                    <span className="section-kicker">PILOT PARTICIPANT</span>
                    <h2 id="detail-title">{selected.pilot_profiles?.full_name}</h2>
                    <p className="text-xs text-gray-500">
                      {selected.pilot_profiles?.email}
                      {selected.pilot_profiles?.whatsapp && ` • WA: ${selected.pilot_profiles.whatsapp}`}
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
                  <DetailSection title="Profile">
                    <Detail label="WhatsApp" value={selected.pilot_profiles?.whatsapp} />
                    <Detail label="Role" value={selected.pilot_profiles?.pilot_role} />
                    <Detail label="Profession" value={selected.pilot_profiles?.profession} />
                    <Detail label="Company" value={selected.pilot_profiles?.company} />
                    <Detail label="Startup" value={selected.pilot_profiles?.startup_name} />
                    <Detail label="Location" value={selected.pilot_profiles?.location} />
                    <Detail label="Experience" value={selected.pilot_profiles?.experience} />
                    <Detail
                      label="LinkedIn"
                      value={selected.pilot_profiles?.linkedin_url}
                      link
                    />
                    <Detail
                      label="Joined"
                      value={
                        selected.pilot_profiles?.created_at
                          ? new Date(selected.pilot_profiles.created_at).toLocaleDateString()
                          : "—"
                      }
                    />
                    <Detail label="Why they joined" value={selected.pilot_profiles?.why_joined} />
                    <Detail
                      label="What they want from Neesh"
                      value={selected.pilot_profiles?.expectations}
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
                    <Detail label="Tested" value={(selected.what_tested || []).join(", ")} />
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
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
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
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#0066cc] underline"
        >
          {value}
        </a>
      ) : (
        <p>{value || "—"}</p>
      )}
    </div>
  );
}