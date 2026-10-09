import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  Heart,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Phone,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  registerPilotMember,
  submitPilotFeedback,
  submitQuickReport,
  trackPageView,
  unlockFounderDashboard,
} from "@/lib/pilot.functions";
import { AboutNeeshSection } from "@/components/AboutNeeshSection";
import { SampleElevatorPitchTab } from "@/components/SampleElevatorPitchTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neesh AI 2.0 — Founding Pilot" },
      {
        name: "description",
        content:
          "Experience Neesh AI 2.0 before public launch. Transform raw thoughts into self-validating ideas.",
      },
      { property: "og:title", content: "Neesh AI 2.0 — Founding Pilot" },
      {
        property: "og:description",
        content: "You are getting access before everyone else.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PilotHome,
});

const NEESH_AI_URL = "https://neesh-2-o.vercel.app";
const FOUNDER_PHONE = "9003866111";
const FOUNDER_EMAIL = "neesh.niche.ai@gmail.com";
const PDF_GUIDE_URL = "/Neesh_AI_Founder_Onboarding_Guide.pdf";

const ratingQuestions = [
  ["overall_score", "Overall experience", "How would you rate your experience?"],
  ["clarity_score", "Clarity", "How clearly did you understand what Neesh is?"],
  ["usability_score", "Ease of use", "How easy was Neesh to use?"],
  ["onboarding_score", "Getting started", "How easy was it to get started?"],
  ["spotlight_score", "Spotlight", "How useful was the Spotlight experience?"],
  ["pitch_score", "Elevator pitch", "How useful was the Elevator Pitch experience?"],
  ["ai_score", "AI interaction", "How useful was the AI interaction?"],
] as const;

const testedItems = [
  "Onboarding",
  "Project creation",
  "Spotlight",
  "Elevator Pitch",
  "AI Chatbot",
  "Discovery",
  "Feedback system",
  "Other",
];

interface GuideStep {
  num: string;
  title: string;
  badge?: string;
  overview: string;
  sectionTitle?: string;
  items?: { label: string; text: string }[];
  callouts?: {
    type: "tip" | "info" | "warning" | "strategy" | "video";
    label: string;
    text: string;
  }[];
  tiers?: {
    tier: string;
    name: string;
    desc: string;
    target?: string;
  }[];
}

const guideSections: GuideStep[] = [
  {
    num: "01",
    title: "Account Registration & Sign Up",
    badge: "/signup",
    overview:
      "New founders start by registering on the platform at /signup. This creates your dedicated founder workspace and initializes your secure Supabase authentication profile.",
    sectionTitle: "Founder Instructions",
    items: [
      {
        label: "Email Registration",
        text: "Enter your First Name, Last Name, and Work/Personal Email Address.",
      },
      {
        label: "Single Sign-On (SSO)",
        text: "Click Google or GitHub for instant, passwordless sign-up.",
      },
      {
        label: "Email Verification",
        text: "Click your verification email link to activate your workspace and begin building.",
      },
    ],
    callouts: [
      {
        type: "tip",
        label: "Founder Pro-Tip / Fast-Track Access Trick",
        text: "In case standard email authentication or verification links encounter inbox spam filters or delivery delays, use Google Sign-In to gain instant, one-click access to the platform! Google SSO bypasses link delays and directly establishes your authenticated session.",
      },
    ],
  },
  {
    num: "02",
    title: "Signing In to Your Workspace",
    badge: "/login",
    overview:
      "Existing founders log in directly via /login. Authentication tokens and user sessions are securely managed through Supabase session storage.",
    sectionTitle: "Founder Instructions",
    items: [
      {
        label: "Credentials & SSO",
        text: "Enter your registered email and password, or authenticate with Google / GitHub SSO.",
      },
      {
        label: "Persistent Sessions",
        text: "The system keeps you securely logged in across browser sessions so you can seamlessly update spotlights, manage pitch reels, and monitor incoming audience signals.",
      },
      {
        label: "Password Recovery",
        text: "If you forget your password, click Forgot password? to receive a secure password reset link.",
      },
    ],
    callouts: [
      {
        type: "info",
        label: "Seamless Session Sync",
        text: "Signing in with the same Google or email account automatically restores your projects, custom spotlight landing pages, audience leads, and live countdown sprint timers.",
      },
    ],
  },
  {
    num: "03",
    title: "Founder Command Dashboard",
    badge: "/dashboard",
    overview:
      "The dashboard (/dashboard) is your startup control tower. It displays active validation sprints, countdown timers, project status badges, and real-time audience views.",
    sectionTitle: "Dashboard Elements & Actions",
    items: [
      {
        label: "Create New Project",
        text: "Click the top-right + New Project CTA to launch a new validation workspace and explain your business, startup, or idea to the AI engine.",
      },
      {
        label: "Project Cards",
        text: "View active sprint timers (e.g. 48-Hour Validation Sprint or 5-Day Stage 3 Sprint), project titles, and status tags (Active, Draft, Locked).",
      },
      {
        label: "Audience Views Counter",
        text: "Real-time counter of unique audience members who have opened your spotlight or pitch.",
      },
      {
        label: "Cross-Promotion Engine",
        text: "Live network to cross-promote your spotlight in other founders' 'More Like This' sections.",
      },
    ],
    callouts: [
      {
        type: "strategy",
        label: "Getting Started",
        text: "Click + New Project to begin. You will explain what your startup does, who it serves, and let Neesh AI guide you through validating your venture assumptions.",
      },
    ],
  },
  {
    num: "04",
    title: "Creating a Project Workspace",
    badge: "Create Workspace Wizard",
    overview:
      "Clicking + New Project launches the interactive Create Workspace Wizard, initiating the calibrated AI validation workflow for your venture.",
    sectionTitle: "Workspace Initialization Guide",
    items: [
      {
        label: "Initialize Venture",
        text: "The wizard creates a dedicated database workspace for your startup where all validation questions, audience signals, spotlight assets, and reels are stored.",
      },
      {
        label: "Structured Progression",
        text: "You will move step-by-step from core parameters (Name, One-Liner, Sector, Stage) into the AI Copilot dialogue.",
      },
      {
        label: "Sprint Timer Activation",
        text: "Once initialized and scored, your project enters its audience validation sprint with real-time countdown tracking.",
      },
    ],
    callouts: [
      {
        type: "tip",
        label: "Multi-Project Support",
        text: "Founders can create and manage multiple ventures simultaneously. Each project maintains its own isolated spotlight page, pitch reel, feedback inbox, and validation score.",
      },
    ],
  },
  {
    num: "05",
    title: "Entering Startup Idea Details",
    badge: "Venture Parameters",
    overview:
      "Define the core parameters of your venture so Neesh AI can calibrate its reality check and format your public presentation.",
    sectionTitle: "Input Checklist & Strategic Guidelines",
    items: [
      {
        label: "Startup Name",
        text: "The working brand or product title (e.g., EcoRoute AI).",
      },
      {
        label: "One-Line Hook Slogan",
        text: "Craft a concise, high-impact one-liner about your startup.",
      },
      {
        label: "Sector / Industry",
        text: "Vertical classification (SaaS, CleanTech, E-Commerce, FinTech, AI, HealthTech).",
      },
      {
        label: "Venture Stage",
        text: "Development status (Idea, Prototype, Pre-Revenue, Early Traction).",
      },
      {
        label: "Start Copilot",
        text: "Click Start Copilot > to enter the AI interactive validation dialogue.",
      },
    ],
    callouts: [
      {
        type: "strategy",
        label: "Critical Positioning Strategy (Hook Slogan)",
        text: "This one-liner appears directly beside your Elevator Pitch video reel in the community feed! Design your one-liner in a way that hooks audience curiosity immediately—like a captivating slogan that compels anyone discovering your reel to watch your pitch and read your spotlight.",
      },
    ],
  },
  {
    num: "06",
    title: "Copilot Validation Questions",
    badge: "Neesh AI Navigator",
    overview:
      "Neesh AI Navigator runs you through 5 modules of rigorous reality checks to eliminate bias, stress-test defensibility, and calculate value multipliers.",
    sectionTitle: "The 5 Core Modules",
    items: [
      {
        label: "Module 1 (Problem Reality)",
        text: "Paint a real-world scenario where someone suffered from this problem and what went wrong.",
      },
      {
        label: "Module 2 (Customer Persona & Budget)",
        text: "Specific job title, willingness to pay, and cost of their current workaround.",
      },
      {
        label: "Module 3 (Value Multiplier)",
        text: "Measurable metrics why your approach is 10x better than existing alternatives.",
      },
      {
        label: "Module 4 (Defensibility)",
        text: "What stops a well-funded competitor from cloning your product overnight?",
      },
      {
        label: "Module 5 (Scale Math)",
        text: "Realistic transaction volumes, price points, and customer acquisition channels.",
      },
    ],
    callouts: [
      {
        type: "tip",
        label: "Founder Pro-Tip",
        text: "Use ChatGPT, Claude, or your preferred LLM loaded with your complete startup pitch or business plan to help answer questions and complete all 5 modules with deep, rigorous data.",
      },
      {
        type: "warning",
        label: "Mandatory Pre-Submission Review",
        text: "Read and verify every answer once before submitting! Your responses are synthesized into public sections that appear directly on your live Spotlight page for visitors and investors to see.",
      },
    ],
  },
  {
    num: "07",
    title: "Phase 1 Reality Check & Score",
    badge: "Diagnostics & Report",
    overview:
      "Your answers are synthesized into a holistic market-readiness score with an actionable dimensional diagnostic report.",
    sectionTitle: "Workspace Hub Features & Report Insights",
    items: [
      {
        label: "Aggregate Score",
        text: "Market-readiness gauge (e.g. 82% Validation Score) measuring overall venture viability.",
      },
      {
        label: "Key Dimension Gauges",
        text: "Core Value Proposition, Market Size & Demand, Defensibility, and Go-to-Market Readiness.",
      },
      {
        label: "Sidebar Navigation",
        text: "Instant access to Spotlight Editor, Elevator Pitch, Audience Inbox, and Audience Insights.",
      },
    ],
    callouts: [
      {
        type: "strategy",
        label: "Action Plan for Idea-Stage Ventures",
        text: "Based on your answers, you will receive a detailed analytical report. If your venture is at the Idea stage, pay close attention to the Critical Segments! Work on and strengthen any low-scoring dimensions (e.g., customer budget, defensibility, unit economics) before scaling outreach.",
      },
    ],
  },
  {
    num: "08",
    title: "Spotlight Page Editor",
    badge: "tab=spotlight",
    overview:
      "The Spotlight Editor (tab=spotlight) lets you design a high-converting public landing page to capture customer intent and build your waitlist.",
    sectionTitle: "Customization Controls & Best Practices",
    items: [
      {
        label: "Catchy Hero Cover Image",
        text: "Create a catchy cover image using ChatGPT / DALL-E based on your startup. Replace the existing default cover image first to make your spotlight visually stand out!",
      },
      {
        label: "Flexible Content Sections",
        text: "Freely add, edit, or remove content sections based on your preferences.",
      },
      {
        label: "Rich Media (Images & Videos)",
        text: "Add product screenshots, diagrams, or demo videos to help your audience understand your startup clearly.",
      },
      {
        label: "Feedback Options",
        text: "Add custom survey questions if you need to gather specific details, requirements, or contact info from prospective users.",
      },
      {
        label: "Interest Tags",
        text: "Add clear 1-to-2 word requirement tags (e.g., Co-founder, Customers, Investors). Save your tags and save the whole spotlight!",
      },
    ],
  },
  {
    num: "09",
    title: "Public Spotlight & Live Signals",
    badge: "/p/:slug",
    overview:
      "When visitors open your spotlight link (/p/:slug), they experience your verified value proposition, submit interest, and engage directly.",
    sectionTitle: "Audience Interaction Points",
    items: [
      {
        label: "Deep-Dive Problem & Solution",
        text: "Visitors read your verified value proposition, metrics, and roadmap.",
      },
      {
        label: "Glowing Intent Button (\"Neesh It\")",
        text: "One tap allows visitors to express direct buyer interest and join your early adopter list.",
      },
      {
        label: "Interactive Feedback Form",
        text: "Prospective customers can submit in-depth ratings, feature requests, and contact details.",
      },
    ],
    callouts: [
      {
        type: "warning",
        label: "Platform Notice on Chatbot",
        text: "The AI Chatbot is currently undergoing algorithmic retraining and may not work as expected. Founders and visitors should rely on the Glowing Intent Button, the Feedback Survey Form, and direct contact details on the Spotlight page for audience interactions.",
      },
    ],
  },
  {
    num: "10",
    title: "Elevator Pitch Video & Reels",
    badge: "Elevator Pitch Tab",
    overview:
      "Short-form video reels generate 5x higher engagement. Upload your 30s to 1-minute pitch in the Elevator Pitch tab and broadcast it to the global community.",
    sectionTitle: "Video Creation & Promotion Steps",
    items: [
      {
        label: "Pitch Creation (30s to 1 min)",
        text: "Go to the Elevator Pitch tab. Create a punchy 30-second to 1-minute video pitch based on your business, startup, or idea.",
      },
      {
        label: "Upload & Save",
        text: "Upload your video file (.mp4, .webm, .mov) and click Save Pitch.",
      },
      {
        label: "Push to Cross-Promotional Engine ⚡",
        text: "Click Push to Engine to publish your pitch to the global discovery space, where everyone can browse your pitch and spotlight just like Instagram Reels or TikTok!",
      },
    ],
    callouts: [
      {
        type: "video",
        label: "Video Creation Pro-Tips",
        text: "Record a natural founder selfie video pitching the problem and solution directly. Use Google Gemini to generate sharp pitch scripts and storyboards. NotebookLM (Best Suited): Upload your startup notes/deck to Google NotebookLM to generate short-form audio/video discussion summaries—ideal for high-quality, professional pitches!",
      },
    ],
  },
  {
    num: "11",
    title: "Audience Sprint Tiers (Gold/Silver/Bronze)",
    badge: "Sprint Milestones",
    overview:
      "Share your unique project link across external channels, track incoming leads in real-time, and qualify buyers into Gold, Silver, and Bronze tiers.",
    sectionTitle: "Viral Multi-Channel Sharing & Inbound Leads",
    items: [
      {
        label: "Share Button on Overview Page",
        text: "Go to the Overview page and click the Share button to copy your unique project link.",
      },
      {
        label: "Promote Everywhere",
        text: "Share your link across WhatsApp groups, Instagram bio/stories, Reddit (r/startups), X (Twitter), LinkedIn, and founder communities.",
      },
      {
        label: "Inbound Approaches",
        text: "Visitors who open the link can view your pitch reel and spotlight. If interested, they will submit interest and approach you directly!",
      },
      {
        label: "Audience Insights Dashboard",
        text: "Monitor all incoming visitor counts, intent submissions, and feedback responses in real-time on the Audience Insights page.",
      },
    ],
    tiers: [
      {
        tier: "🥉 Bronze",
        name: "Early Adopters",
        desc: "Visitors who clicked the interest button and signed up.",
        target: "15 Bronze Target",
      },
      {
        tier: "🥈 Silver",
        name: "Qualified Feedback",
        desc: "Visitors who provided detailed answers or survey input.",
        target: "10 Silver Target",
      },
      {
        tier: "🥇 Gold",
        name: "High-Intent Buyers",
        desc: "Prospects confirming pilot budgets, orders, or partner calls.",
        target: "5 Gold Target",
      },
      {
        tier: "🚀 Auto-Advance",
        name: "Stage 3 Pilot MVP Status",
        desc: "Achieve 5 Gold + 10 Silver + 15 Bronze targets to auto-qualify for Stage 3 Pilot MVP status!",
        target: "5G + 10S + 15B",
      },
    ],
  },
];

function PilotHome() {
  const navigate = useNavigate();
  const registerMember = useServerFn(registerPilotMember);
  const submitFeedback = useServerFn(submitPilotFeedback);
  const submitQuick = useServerFn(submitQuickReport);
  const unlockFounder = useServerFn(unlockFounderDashboard);
  const trackView = useServerFn(trackPageView);

  // States
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Registered Pilot User Authentication & Registration
  interface RegisteredPilotUser {
    full_name: string;
    startup_name: string;
    phone: string;
    email: string;
  }
  const [registeredPilot, setRegisteredPilot] = useState<RegisteredPilotUser | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regFullName, setRegFullName] = useState("");
  const [regStartupName, setRegStartupName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [registerBusy, setRegisterBusy] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");

  // Mission checklist tracking
  type MissionTaskKey =
    | "first_impression"
    | "onboarding"
    | "spotlight"
    | "pitch"
    | "ai_chatbot"
    | "discovery"
    | "overall";

  type RatingsKey =
    | "overall_score"
    | "clarity_score"
    | "usability_score"
    | "onboarding_score"
    | "spotlight_score"
    | "pitch_score"
    | "ai_score";

  const [checkedTasks, setCheckedTasks] = useState<Record<MissionTaskKey, boolean>>({
    first_impression: false,
    onboarding: false,
    spotlight: false,
    pitch: false,
    ai_chatbot: false,
    discovery: false,
    overall: false,
  });

  const totalTasks = 7;
  const completedTasksCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTasksCount / totalTasks) * 100);

  // Expandable guide items
  const [expandedGuide, setExpandedGuide] = useState<number | null>(0);

  // 2.0 Password Dialog Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  // Ratings state for form
  const [ratings, setRatings] = useState<Record<RatingsKey, number>>({
    overall_score: 5,
    clarity_score: 5,
    usability_score: 5,
    onboarding_score: 5,
    spotlight_score: 5,
    pitch_score: 5,
    ai_score: 5,
  });

  // Floating Bug / Quick Feedback Modal
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugCategory, setBugCategory] = useState("Bug Report");
  const [bugMessage, setBugMessage] = useState("");
  const [bugDetail, setBugDetail] = useState("");
  const [bugContact, setBugContact] = useState("");
  const [bugBusy, setBugBusy] = useState(false);
  const [bugSent, setBugSent] = useState(false);

  // Mobile nav state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Hotline quick message
  const [hotlineName, setHotlineName] = useState("");
  const [hotlineContact, setHotlineContact] = useState("");
  const [hotlineMessage, setHotlineMessage] = useState("");
  const [hotlineBusy, setHotlineBusy] = useState(false);
  const [hotlineSent, setHotlineSent] = useState(false);

  // Community Hub interactive tab & wishlist
  const [communityTab, setCommunityTab] = useState<"discussion" | "showcase" | "wishlist">("discussion");
  const [communityPosts, setCommunityPosts] = useState<
    Array<{
      author: string;
      role: string;
      text: string;
      time: string;
      likes: number;
    }>
  >([]);
  const [newCommunityPost, setNewCommunityPost] = useState("");

  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, title: "Export chatbot conversation logs to CSV / Notion", votes: 0, voted: false },
    { id: 2, title: "Custom domain mapping for public Spotlight", votes: 0, voted: false },
    { id: 3, title: "Audio voice generator for Elevator Pitch", votes: 0, voted: false },
    { id: 4, title: "Visitor analytics breakdown by geographic location", votes: 0, voted: false },
  ]);

  const toggleTask = (key: MissionTaskKey) => {
    setCheckedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVoteWishlist = (id: number) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              votes: item.voted ? item.votes - 1 : item.votes + 1,
              voted: !item.voted,
            }
          : item
      )
    );
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("neesh_pilot_registered_user");
      if (stored) {
        const parsed = JSON.parse(stored) as RegisteredPilotUser;
        if (parsed && (parsed.email || parsed.full_name)) {
          setRegisteredPilot(parsed);
          setRegFullName(parsed.full_name || "");
          setRegStartupName(parsed.startup_name || "");
          setRegPhone(parsed.phone || "");
          setRegEmail(parsed.email || "");
          setHotlineName(parsed.full_name || "");
          setHotlineContact(parsed.phone || parsed.email || "");
          setBugContact(parsed.email || parsed.phone || "");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Real-time visitor activity & page view tracking
  useEffect(() => {
    let visitorId = "";
    try {
      visitorId = localStorage.getItem("neesh_visitor_id") || "";
      if (!visitorId) {
        visitorId =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `vis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem("neesh_visitor_id", visitorId);
      }
    } catch {
      visitorId = `vis-${Date.now()}`;
    }

    const currentPath = (window.location.pathname || "/") + (window.location.hash || "");
    const sessionKey = `tracked_visit_${currentPath}`;

    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      void trackView({
        data: {
          visitor_id: visitorId,
          path: currentPath,
          referrer: document.referrer || "",
          member_email: registeredPilot?.email,
          member_name: registeredPilot?.full_name,
          member_startup: registeredPilot?.startup_name,
          member_phone: registeredPilot?.phone,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }).catch(() => {});
    }

    const onHashChange = () => {
      const newPath = (window.location.pathname || "/") + (window.location.hash || "");
      const hashKey = `tracked_visit_${newPath}`;
      if (!sessionStorage.getItem(hashKey)) {
        sessionStorage.setItem(hashKey, "1");
        void trackView({
          data: {
            visitor_id: visitorId,
            path: newPath,
            referrer: document.referrer || "",
            member_email: registeredPilot?.email,
            member_name: registeredPilot?.full_name,
            member_startup: registeredPilot?.startup_name,
            member_phone: registeredPilot?.phone,
            screen_width: window.innerWidth,
            screen_height: window.innerHeight,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }).catch(() => {});
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [registeredPilot]);

  async function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault();
    setRegisterBusy(true);
    setRegisterError("");
    try {
      const res = await registerMember({
        data: {
          full_name: regFullName.trim(),
          startup_name: regStartupName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim().toLowerCase(),
        },
      });

      const member: RegisteredPilotUser = {
        full_name: res.profile.full_name,
        startup_name: res.profile.startup_name,
        phone: res.profile.phone,
        email: res.profile.email,
      };

      setRegisteredPilot(member);
      try {
        localStorage.setItem("neesh_pilot_registered_user", JSON.stringify(member));
      } catch {
        // ignore
      }

      setHotlineName(member.full_name);
      setHotlineContact(member.phone || member.email);
      setBugContact(member.email || member.phone);

      // Attribute active session visit to newly authenticated member
      void trackView({
        data: {
          visitor_id: localStorage.getItem("neesh_visitor_id") || `vis-${Date.now()}`,
          path: window.location.pathname + window.location.hash,
          referrer: "Pilot Member Registration",
          member_email: member.email,
          member_name: member.full_name,
          member_startup: member.startup_name,
          member_phone: member.phone,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }).catch(() => {});

      setRegisterSuccessMsg("Welcome to Neesh AI! Your pilot profile is authenticated.");
      setTimeout(() => {
        setIsRegisterModalOpen(false);
        setRegisterSuccessMsg("");
        const guideEl = document.getElementById("guide");
        if (guideEl) guideEl.scrollIntoView({ behavior: "smooth" });
      }, 1200);
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setRegisterBusy(false);
    }
  }

  const handleAddCommunityPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCommunityPost.trim()) return;
    const postText = newCommunityPost.trim();
    const authorName = registeredPilot?.full_name || "Pilot Participant";
    const authorRole = registeredPilot?.startup_name
      ? `${registeredPilot.startup_name} • Founding Cohort`
      : "Founding Cohort";

    setCommunityPosts((prev) => [
      {
        author: authorName,
        role: authorRole,
        text: postText,
        time: "Just now",
        likes: 0,
      },
      ...prev,
    ]);
    setNewCommunityPost("");

    try {
      await submitQuick({
        data: {
          name: authorName,
          contact: registeredPilot?.email || registeredPilot?.phone || "community@pilot.neesh.ai",
          category: "Community Discussion",
          message: postText,
        },
      });
    } catch {
      // Non-blocking for local user action
    }
  };

  // Submit main feedback form
  async function onSubmitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFormError("");
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();

    const fullName = text("full_name") || registeredPilot?.full_name || "";
    const email = text("email") || registeredPilot?.email || "";
    const startupName = text("startup_name") || registeredPilot?.startup_name || "";
    const whatsapp = text("whatsapp") || registeredPilot?.phone || "";

    if (!fullName) {
      setFormError("Please enter your name.");
      setBusy(false);
      return;
    }
    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid email address.");
      setBusy(false);
      return;
    }

    try {
      await submitFeedback({
        data: {
          full_name: fullName,
          email: email.toLowerCase(),
          whatsapp: whatsapp,
          profession: text("profession"),
          company: text("company") || startupName,
          pilot_role: text("pilot_role"),
          startup_name: startupName,
          linkedin_url: text("linkedin_url"),
          location: text("location"),
          experience: text("experience"),
          why_joined: text("why_joined"),
          expectations: text("expectations"),
          overall_score: Number(ratings.overall_score) || 5,
          clarity_score: Number(ratings.clarity_score) || 5,
          usability_score: Number(ratings.usability_score) || 5,
          onboarding_score: Number(ratings.onboarding_score) || 5,
          spotlight_score: Number(ratings.spotlight_score) || 5,
          pitch_score: Number(ratings.pitch_score) || 5,
          ai_score: Number(ratings.ai_score) || 5,
          valuable_part: text("valuable_part") || "Founding pilot feedback submitted",
          frustrating_part: text("frustrating_part"),
          confusing_part: text("confusing_part"),
          missing_feature: text("missing_feature"),
          improvement: text("improvement"),
          brutal_feedback: text("brutal_feedback"),
          discovery_answer: (text("discovery_answer") || "Yes") as "Yes" | "Somewhat" | "No",
          discovery_detail: text("discovery_detail"),
          recommendation: text("recommendation") || "Definitely",
          reuse_intent: text("reuse_intent") || "Yes",
          what_tested: form.getAll("what_tested").map(String),
          spotlight_url: text("spotlight_url"),
          pitch_url: text("pitch_url"),
          project_url: text("project_url"),
          website_url: text("website_url"),
          project_stage: text("project_stage"),
        },
      });

      // If user wasn't registered yet, store profile locally now
      if (!registeredPilot && fullName && email) {
        const autoMember: RegisteredPilotUser = {
          full_name: fullName,
          startup_name: startupName || "Pilot Startup",
          phone: whatsapp,
          email: email.toLowerCase(),
        };
        setRegisteredPilot(autoMember);
        try {
          localStorage.setItem("neesh_pilot_registered_user", JSON.stringify(autoMember));
        } catch {
          // ignore
        }
      }

      setSubmitted(true);
      const feedbackEl = document.getElementById("feedback");
      if (feedbackEl) feedbackEl.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "We couldn't submit your feedback. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  // Handle 2.0 Password Unlock
  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordBusy(true);
    setPasswordError("");
    try {
      const res = await unlockFounder({ data: { password: passwordInput } });
      if (!res.ok) {
        setPasswordError("Incorrect password. Please enter the valid founder access key.");
        return;
      }
      setIsPasswordModalOpen(false);
      void navigate({ to: "/admin" });
    } catch {
      setPasswordError("Verification failed. Please try again.");
    } finally {
      setPasswordBusy(false);
    }
  }

  // Handle Quick Bug / Feedback submit
  async function handleBugSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bugMessage.trim()) return;
    setBugBusy(true);

    const submitContact = bugContact || registeredPilot?.email || registeredPilot?.phone || "Anonymous Tester";
    const submitName = registeredPilot
      ? `${registeredPilot.full_name} (${registeredPilot.startup_name || "Pilot Participant"})`
      : (bugContact ? `Tester (${bugContact})` : "Bug / Feedback Tester");

    try {
      await submitQuick({
        data: {
          category: bugCategory,
          message: bugMessage,
          detail: bugDetail,
          contact: submitContact,
          name: submitName,
        },
      });
      setBugSent(true);
      setTimeout(() => {
        setBugSent(false);
        setIsBugModalOpen(false);
        setBugMessage("");
        setBugDetail("");
        setBugContact(registeredPilot?.email || registeredPilot?.phone || "");
      }, 1800);
    } catch {
      // ignore
    } finally {
      setBugBusy(false);
    }
  }

  // Handle Hotline Quick Message submit
  async function handleHotlineSubmit(e: FormEvent) {
    e.preventDefault();
    if (!hotlineMessage.trim()) return;
    setHotlineBusy(true);

    const senderName = hotlineName || registeredPilot?.full_name || "Hotline User";
    const senderContact = hotlineContact || registeredPilot?.phone || registeredPilot?.email || FOUNDER_EMAIL;

    try {
      await submitQuick({
        data: {
          name: senderName,
          contact: senderContact,
          category: "Founder Hotline Direct Message",
          message: hotlineMessage,
        },
      });
      setHotlineSent(true);
      setHotlineMessage("");
      setTimeout(() => setHotlineSent(false), 4000);
    } catch {
      // ignore
    } finally {
      setHotlineBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      {/* UNIFIED WHITE APPLE HEADER */}
      <nav className="apple-sub-nav" aria-label="Main navigation">
        <div className="apple-sub-nav-inner">
          {/* Brand & Badge */}
          <div className="apple-sub-nav-title flex items-center gap-3">
            <a href="#top" className="flex items-center gap-2.5 no-underline">
              <img src="/neesh-logo.png" alt="Neesh AI" className="h-7 sm:h-8 w-auto object-contain" />
            </a>
            <span className="apple-sub-nav-badge">Founding Pilot 2.0</span>
          </div>

          {/* Navigation Links (Moved from black header) */}
          <div className="hidden xl:flex items-center gap-6 apple-sub-nav-links">
            <a href="#about">About Neesh</a>
            <a href="#guide">Platform Guide</a>
            <a href="#checklist">Testing Mission</a>
            <a href="#hotline">Founder Hotline</a>
            <a href="#community">Community</a>
            <a href="#feedback">Your Feedback</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {registeredPilot ? (
              <button
                type="button"
                onClick={() => {
                  setRegFullName(registeredPilot.full_name);
                  setRegStartupName(registeredPilot.startup_name);
                  setRegPhone(registeredPilot.phone);
                  setRegEmail(registeredPilot.email);
                  setIsRegisterModalOpen(true);
                }}
                className="apple-pill-secondary apple-pill-sm flex items-center gap-1.5"
                title={`Registered: ${registeredPilot.full_name} (${registeredPilot.startup_name})`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-xs max-w-[120px] truncate text-emerald-800">
                  {registeredPilot.full_name}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="apple-pill-secondary apple-pill-sm flex items-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5 text-[#0066cc]" />
                <span>Join Pilot</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="apple-pill-secondary apple-pill-sm flex items-center gap-1.5"
            >
              <LockKeyhole className="w-3 h-3 text-[#0066cc]" />
              <span>2.0 Access</span>
            </button>

            <a
              href={NEESH_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-pill-primary apple-pill-sm flex items-center gap-1.5"
            >
              <span>Launch Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Nav Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="xl:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors bg-transparent border-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="xl:hidden border-b border-black/5 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-lg space-y-3">
            <a
              href="#about"
              onClick={() => setIsMobileNavOpen(false)}
              className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] py-1"
            >
              About Neesh
            </a>
            <a
              href="#guide"
              onClick={() => setIsMobileNavOpen(false)}
              className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] py-1"
            >
              Platform Guide
            </a>
            <a
              href="#checklist"
              onClick={() => setIsMobileNavOpen(false)}
              className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] py-1"
            >
              Testing Mission
            </a>
            <a
              href="#hotline"
              onClick={() => setIsMobileNavOpen(false)}
              className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] py-1"
            >
              Founder Hotline
            </a>
            <a
              href="#community"
              onClick={() => setIsMobileNavOpen(false)}
              className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] py-1"
            >
              Community
            </a>
            <a
              href="#feedback"
              onClick={() => setIsMobileNavOpen(false)}
              className="block text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] py-1"
            >
              Your Feedback
            </a>
          </div>
        )}
      </nav>

      {/* 3. HERO TILE (Elevated Glass & Ambient Glow Canvas) */}
      <section className="apple-tile-light hero-enhanced-section" id="top">
        <div className="hero-glow-orb" />
        <div className="apple-container text-center relative z-10">
          <div className="hero-badge-row">
            <span className="hero-kicker-pill">
              FOUNDING PILOT • EARLY ACCESS • PRIVATE BETA
            </span>
            <span className="hero-social-pill">
              <span className="pulse-dot" /> Join the #1 Business Social Platform
            </span>
          </div>

          {submitted ? (
            <div className="apple-card max-w-xl mx-auto my-12 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h2 className="apple-display-lg">Thank you for shaping what comes next.</h2>
              <p className="text-gray-600 mb-6">
                Your feedback and work submission have been securely recorded. The Neesh AI team
                personally reviews every submission.
              </p>
              <a href="#overview" className="apple-pill-primary">
                Return to Overview
              </a>
            </div>
          ) : (
            <>
              <h1 className="hero-main-title max-w-4xl mx-auto">
                Become the World's First <br />
                <span className="hero-gradient-text">Business &amp; Startup Development Platform</span> Team.
              </h1>

              <p className="hero-tagline-elevated max-w-3xl mx-auto">
                You are getting access before everyone else. Join the #1 business social platform where founders, builders, and early-stage innovators turn raw ideas into self-validating spotlights, build with AI, and collaborate directly with our founding core team.
              </p>

              <p className="hero-subtext-refined max-w-2xl mx-auto">
                Transform your raw thoughts into self-validating ideas. Auto-generate public spotlights and context-aware chatbots, detect audience confusion points, and close your product feedback loop.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-3.5 mb-10">
                {registeredPilot ? (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Authenticated Pilot Member:</span>
                      <strong className="font-semibold">{registeredPilot.full_name}</strong>
                      <span className="text-gray-400">•</span>
                      <span>{registeredPilot.startup_name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRegFullName(registeredPilot.full_name);
                          setRegStartupName(registeredPilot.startup_name);
                          setRegPhone(registeredPilot.phone);
                          setRegEmail(registeredPilot.email);
                          setIsRegisterModalOpen(true);
                        }}
                        className="ml-1 text-[#0066cc] underline hover:text-[#004499] cursor-pointer bg-transparent border-none text-xs font-medium"
                      >
                        Edit
                      </button>
                    </div>

                    <a
                      href="#guide"
                      className="apple-pill-primary text-base font-semibold px-9 py-4 shadow-md hover:shadow-lg flex items-center gap-2.5 group transition-all"
                    >
                      <Rocket className="w-5 h-5 text-white" />
                      <span>Continue Your Pilot Mission</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="apple-pill-primary text-base font-semibold px-9 py-4 shadow-md hover:shadow-lg flex items-center gap-2.5 group transition-all border-none cursor-pointer"
                  >
                    <Rocket className="w-5 h-5 text-white" />
                    <span>Start the Pilot Program</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                <div className="flex flex-wrap justify-center items-center gap-3">
                  <a
                    href={NEESH_AI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-secondary"
                  >
                    <span>Launch Platform (neesh-2-o.vercel.app)</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </a>

                  <a
                    href={PDF_GUIDE_URL}
                    download="Neesh_AI_Founder_Onboarding_Guide.pdf"
                    className="apple-pill-secondary"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    <span>Download Founder Guide (PDF)</span>
                  </a>
                </div>
              </div>

              {/* 3-Pillar Feature Matrix */}
              <div className="hero-feature-matrix">
                <div className="hero-feature-card">
                  <div className="hero-feature-icon bg-blue-50 text-[#0066cc]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="hero-feature-title">#1 Business Social Platform</h3>
                    <p className="hero-feature-desc">
                      Connect with fellow founders and early believers. Share your traction, get validated, and build social proof.
                    </p>
                  </div>
                </div>

                <div className="hero-feature-card">
                  <div className="hero-feature-icon bg-indigo-50 text-indigo-600">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="hero-feature-title">Autonomous Startup Dev</h3>
                    <p className="hero-feature-desc">
                      Turn raw thoughts into interactive Spotlights, pitch decks, and context-aware AI chatbots in minutes.
                    </p>
                  </div>
                </div>

                <div className="hero-feature-card">
                  <div className="hero-feature-icon bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="hero-feature-title">Founding Cohort Access</h3>
                    <p className="hero-feature-desc">
                      Direct channel with the Neesh AI core team (+91 9003866111), high-priority feedback, and beta deployments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 pt-6 border-t border-gray-100 max-w-lg mx-auto">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0066cc]" /> Limited Pilot Cohort
                </span>
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#0066cc]" /> Direct Founder Support (+91 9003866111)
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0066cc]" /> Version 2.0 Beta
                </span>
              </div>

              {/* Pilot Progress Pill Tracker */}
              <div className="mt-8 max-w-md mx-auto p-4 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0]">
                <div className="flex justify-between items-center text-xs font-semibold mb-2">
                  <span className="text-gray-500 uppercase tracking-wide">Your Pilot Journey</span>
                  <span className="text-[#0066cc]">{progressPercent}% Complete ({completedTasksCount}/{totalTasks} missions)</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-[#0066cc] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(6, progressPercent)}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. ABOUT NEESH AI 2.0: HIGHLY INTERACTIVE ECOSYSTEM STORY */}
      <span id="overview" className="scroll-mt-20 block" />
      <AboutNeeshSection platformUrl={NEESH_AI_URL} />

      {/* 5. TILE 3: 6-STEP PILOT PROGRAM & MISSION CHECKLIST (Parchment #f5f5f7) */}
      <section className="apple-tile-parchment" id="checklist">
        <div className="apple-container-wide">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="apple-eyebrow">YOUR PILOT MISSION</div>
            <h2 className="apple-display-lg">What do we want you to test?</h2>
            <p className="apple-tagline">
              Don't simply browse the platform. Test these specific core areas and mark them off as you go:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mission A */}
            <div
              className={`apple-card cursor-pointer ${
                checkedTasks.first_impression ? "border-[#0066cc] ring-2 ring-[#0066cc]/20" : ""
              }`}
              onClick={() => toggleTask("first_impression")}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="apple-eyebrow">A. First Impression</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    checkedTasks.first_impression
                      ? "bg-[#0066cc] border-[#0066cc] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checkedTasks.first_impression && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Do you understand what Neesh is immediately? Is the next action clear? Can you
                explain what Neesh does in one sentence?
              </p>
              <div className="text-xs italic text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "Can you identify what to click next without thinking?"
              </div>
            </div>

            {/* Mission B */}
            <div
              className={`apple-card cursor-pointer ${
                checkedTasks.onboarding ? "border-[#0066cc] ring-2 ring-[#0066cc]/20" : ""
              }`}
              onClick={() => toggleTask("onboarding")}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="apple-eyebrow">B. Onboarding</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    checkedTasks.onboarding
                      ? "bg-[#0066cc] border-[#0066cc] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checkedTasks.onboarding && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Test account creation, project creation forms, and instructions. Did you get stuck
                anywhere?
              </p>
              <div className="text-xs italic text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "Could you complete this without someone explaining it to you?"
              </div>
            </div>

            {/* Mission C */}
            <div
              className={`apple-card cursor-pointer ${
                checkedTasks.spotlight ? "border-[#0066cc] ring-2 ring-[#0066cc]/20" : ""
              }`}
              onClick={() => toggleTask("spotlight")}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="apple-eyebrow">C. Spotlight Creation</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    checkedTasks.spotlight
                      ? "bg-[#0066cc] border-[#0066cc] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checkedTasks.spotlight && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Create a Spotlight for your startup. Review the generated copy, layout, and public
                link.
              </p>
              <div className="text-xs italic text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "Would you actually share this Spotlight with an investor or user?"
              </div>
            </div>

            {/* Mission D */}
            <div
              className={`apple-card cursor-pointer ${
                checkedTasks.pitch ? "border-[#0066cc] ring-2 ring-[#0066cc]/20" : ""
              }`}
              onClick={() => toggleTask("pitch")}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="apple-eyebrow">D. Elevator Pitch</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    checkedTasks.pitch
                      ? "bg-[#0066cc] border-[#0066cc] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checkedTasks.pitch && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Test uploading or linking video demo pitch. Verify preview playback and whether it
                creates curiosity.
              </p>
              <div className="text-xs italic text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "Does the pitch make you want to learn more?"
              </div>
            </div>

            {/* Mission E */}
            <div
              className={`apple-card cursor-pointer ${
                checkedTasks.ai_chatbot ? "border-[#0066cc] ring-2 ring-[#0066cc]/20" : ""
              }`}
              onClick={() => toggleTask("ai_chatbot")}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="apple-eyebrow">E. AI Chatbot</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    checkedTasks.ai_chatbot
                      ? "bg-[#0066cc] border-[#0066cc] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checkedTasks.ai_chatbot && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Ask tough questions to the embedded bot. Check accuracy, response tone, and if it
                provides real value beyond text.
              </p>
              <div className="text-xs italic text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "Did the AI help you understand something faster?"
              </div>
            </div>

            {/* Mission F & G */}
            <div
              className={`apple-card cursor-pointer ${
                checkedTasks.overall ? "border-[#0066cc] ring-2 ring-[#0066cc]/20" : ""
              }`}
              onClick={() => toggleTask("overall")}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="apple-eyebrow">F & G. Overall & Return Intent</span>
                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    checkedTasks.overall
                      ? "bg-[#0066cc] border-[#0066cc] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {checkedTasks.overall && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                If Neesh disappeared tomorrow, what would you miss? Would you return to use it
                for future projects?
              </p>
              <div className="text-xs italic text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                "Break it. Tell us what would make you leave or stay."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TILE 4: FOUNDER ONBOARDING & PLATFORM MANUAL (White Canvas) */}
      <section className="apple-tile-light scroll-mt-24" id="guide">
        <div className="apple-container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-gray-200">
            <div>
              <div className="apple-eyebrow">NEESH AI 2.0 · PLATFORM MANUAL</div>
              <h2 className="apple-display-lg">Founder Onboarding & Step-by-Step Guide</h2>
              <p className="text-gray-600 max-w-2xl text-base md:text-lg mt-2">
                Transform raw startup hypotheses into mathematically scored, audience-validated products
                with AI guidance, interactive spotlight pages, and video pitch reels.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href={PDF_GUIDE_URL}
                download="Neesh_AI_Founder_Onboarding_Guide.pdf"
                className="apple-pill-primary"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download PDF Guide</span>
              </a>
              <a
                href={PDF_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-pill-secondary"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Handbook Welcome Callout Banner */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-100/90 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc] text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0066cc]">Founder Operational Handbook</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 font-medium">11 Strategic Milestones</span>
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                  Welcome to <strong className="font-semibold text-gray-900">Neesh AI 2.0</strong>! This operational handbook walks founders through every milestone of validating a startup. From account initialization and AI Copilot discovery to crafting an irresistible hook slogan, publishing high-converting spotlights, broadcasting elevator pitch reels to the community, and collecting buyer intent.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Contents Directory */}
          <div className="mb-10 p-6 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0]">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>WORKFLOW CONTENTS DIRECTORY</span>
              <span className="text-gray-400 font-normal">Click any milestone to view instructions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {guideSections.map((sec, idx) => (
                <button
                  key={sec.num}
                  type="button"
                  onClick={() => setExpandedGuide(idx)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between group cursor-pointer ${
                    expandedGuide === idx
                      ? "bg-white border-[#0066cc] text-[#0066cc] shadow-sm font-semibold ring-1 ring-[#0066cc]/20"
                      : "bg-white/90 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`font-mono font-bold text-[11px] ${expandedGuide === idx ? "text-[#0066cc]" : "text-gray-400"}`}>
                      {sec.num}.
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </div>
                  {sec.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono shrink-0 ml-1.5 group-hover:bg-blue-50 group-hover:text-[#0066cc]">
                      {sec.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SAMPLE ELEVATOR PITCH LIVE SCREEN TAB (Featured Reel Demo) */}
          <div className="mb-10">
            <SampleElevatorPitchTab pitchUrl="https://neesh-2-o.vercel.app/p/neesh-ai-2ca678d8-de9c-4116-99ad-b46b3e2a76d6" />
          </div>

          {/* 11 Expandable Detailed Steps */}
          <div className="space-y-4">
            {guideSections.map((sec, idx) => (
              <div
                key={sec.num}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  expandedGuide === idx
                    ? "border-[#0066cc] bg-white shadow-md ring-1 ring-[#0066cc]/10"
                    : "border-[#e0e0e0] bg-white hover:border-gray-300 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedGuide(expandedGuide === idx ? null : idx)}
                  className="w-full text-left p-5 md:p-6 flex justify-between items-center bg-white hover:bg-gray-50/70 border-none cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 md:gap-4 flex-wrap sm:flex-nowrap">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                        expandedGuide === idx
                          ? "bg-[#0066cc] text-white"
                          : "bg-blue-50 text-[#0066cc]"
                      }`}
                    >
                      STEP {sec.num}
                    </span>
                    <span className="font-semibold text-base md:text-lg text-[#1d1d1f]">
                      {sec.title}
                    </span>
                    {sec.badge && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                        {sec.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${
                      expandedGuide === idx ? "rotate-180 text-[#0066cc]" : ""
                    }`}
                  />
                </button>
                {expandedGuide === idx && (
                  <div className="px-5 pb-6 md:px-6 pt-3 text-sm text-gray-600 border-t border-gray-100 bg-gray-50/30 space-y-5">
                    {/* Overview */}
                    <p className="text-gray-700 leading-relaxed font-normal text-sm md:text-base">
                      {sec.overview}
                    </p>

                    {/* Section items */}
                    {sec.items && sec.items.length > 0 && (
                      <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-3">
                        {sec.sectionTitle && (
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            {sec.sectionTitle}
                          </h4>
                        )}
                        <ul className="space-y-2.5 text-sm text-gray-600">
                          {sec.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] mt-2 shrink-0" />
                              <div>
                                <strong className="font-semibold text-gray-900">{item.label}: </strong>
                                <span>{item.text}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Callouts */}
                    {sec.callouts &&
                      sec.callouts.map((callout, cIdx) => (
                        <div
                          key={cIdx}
                          className={`p-4 rounded-xl border flex items-start gap-3 ${
                            callout.type === "tip"
                              ? "bg-amber-50/70 border-amber-200 text-amber-950"
                              : callout.type === "info"
                              ? "bg-sky-50/70 border-sky-200 text-sky-950"
                              : callout.type === "warning"
                              ? "bg-rose-50/70 border-rose-200 text-rose-950"
                              : callout.type === "video"
                              ? "bg-purple-50/70 border-purple-200 text-purple-950"
                              : "bg-indigo-50/70 border-indigo-200 text-indigo-950"
                          }`}
                        >
                          <span className="text-lg shrink-0 mt-0.5">
                            {callout.type === "tip" && "💡"}
                            {callout.type === "info" && "ℹ️"}
                            {callout.type === "warning" && "⚠️"}
                            {callout.type === "video" && "🎬"}
                            {callout.type === "strategy" && "⭐"}
                          </span>
                          <div className="text-xs md:text-sm leading-relaxed">
                            <strong className="font-semibold block mb-0.5">{callout.label}:</strong>
                            <span className="opacity-95">{callout.text}</span>
                          </div>
                        </div>
                      ))}

                    {/* Step 11 Tiers */}
                    {sec.tiers && sec.tiers.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                          VALIDATION SPRINT TIERS & TARGETS
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {sec.tiers.map((tier, tIdx) => (
                            <div
                              key={tIdx}
                              className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-sm text-gray-900">{tier.tier}</span>
                                  {tier.target && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#0066cc] font-semibold border border-blue-100">
                                      {tier.target}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-semibold text-gray-700 mb-1">{tier.name}</div>
                                <p className="text-xs text-gray-500 leading-normal">{tier.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TILE 5: TWO-COLUMN COMMUNICATION HUB (Dark Canvas #272729) */}
      <section className="apple-tile-dark" id="hotline">
        <div className="apple-container-wide">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="apple-eyebrow-dark">COMMUNICATION HUB</div>
            <h2 className="apple-display-lg text-white">Direct Founder Hotline & Community</h2>
            <p className="apple-tagline apple-tagline-dark">
              Talk directly with Abhishek (Founder) or exchange observations with fellow founders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column A: Founder Hotline */}
            <div className="apple-card-dark p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#2997ff]" />
                    <h3 className="text-xl font-semibold text-white">Direct Founder Hotline</h3>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Active & Online
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  Private, instant communication with Abhishek. I personally review and reply to
                  every message within 2 hours.
                </p>

                {/* Contact numbers */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone / WhatsApp:</span>
                    <a href={`tel:${FOUNDER_PHONE}`} className="text-white font-mono hover:text-[#2997ff]">
                      +91 {FOUNDER_PHONE}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <a href={`mailto:${FOUNDER_EMAIL}`} className="text-white font-mono hover:text-[#2997ff]">
                      {FOUNDER_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <a
                    href={`https://wa.me/91${FOUNDER_PHONE}?text=${encodeURIComponent(
                      "Hi Abhishek, I'm testing the Neesh AI 2.0 Pilot Program and wanted to reach out!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-primary flex-1 text-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <a
                    href={`https://wa.me/91${FOUNDER_PHONE}?text=${encodeURIComponent(
                      "Hi Abhishek, I'd like to book a 10-Minute Concierge Walkthrough of Neesh AI 2.0!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-secondary apple-pill-secondary-dark flex-1 text-center"
                  >
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>Book 10-Min Walkthrough</span>
                  </a>
                </div>
              </div>

              {/* In-page quick note */}
              <div className="pt-6 border-t border-white/10">
                <span className="text-xs font-semibold text-gray-300 block mb-3">
                  Send a Direct Note to Founder
                </span>
                {hotlineSent ? (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium">
                    ✓ Note received! I will review and reply within 2 hours.
                  </div>
                ) : (
                  <form onSubmit={handleHotlineSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Your Name"
                        value={hotlineName}
                        onChange={(e) => setHotlineName(e.target.value)}
                        className="apple-input bg-black/40 text-white border-white/20 text-xs py-2"
                      />
                      <input
                        placeholder="WhatsApp or Email"
                        value={hotlineContact}
                        onChange={(e) => setHotlineContact(e.target.value)}
                        className="apple-input bg-black/40 text-white border-white/20 text-xs py-2"
                      />
                    </div>
                    <textarea
                      placeholder="Ask a question or report a confusion moment..."
                      rows={2}
                      value={hotlineMessage}
                      onChange={(e) => setHotlineMessage(e.target.value)}
                      className="apple-textarea bg-black/40 text-white border-white/20 text-xs py-2"
                      required
                    />
                    <button
                      type="submit"
                      disabled={hotlineBusy}
                      className="apple-pill-primary w-full text-xs py-2"
                    >
                      {hotlineBusy ? "Sending…" : "Send Note to Founder"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Column B: Community Town Square */}
            <div className="apple-card-dark p-8 rounded-2xl flex flex-col justify-between" id="community">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#2997ff]" />
                    <h3 className="text-xl font-semibold text-white">Pilot Community Town Square</h3>
                  </div>
                  <a
                    href={`https://wa.me/91${FOUNDER_PHONE}?text=${encodeURIComponent(
                      "Hi Abhishek, please add me to the VIP Founders Community Group!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apple-pill-secondary apple-pill-secondary-dark apple-pill-sm"
                  >
                    Join VIP Group ↗
                  </a>
                </div>

                {/* Sub-tabs */}
                <div className="flex gap-4 border-b border-white/10 pb-2 mb-4 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setCommunityTab("discussion")}
                    className={`pb-1 border-b-2 transition ${
                      communityTab === "discussion"
                        ? "border-[#2997ff] text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Discussions
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommunityTab("showcase")}
                    className={`pb-1 border-b-2 transition ${
                      communityTab === "showcase"
                        ? "border-[#2997ff] text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Showcase Spotlights
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommunityTab("wishlist")}
                    className={`pb-1 border-b-2 transition ${
                      communityTab === "wishlist"
                        ? "border-[#2997ff] text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Feature Wishlist
                  </button>
                </div>

                {/* Tab Content */}
                {communityTab === "discussion" && (
                  <div className="space-y-3 mb-4 max-h-[260px] overflow-y-auto pr-1">
                    {communityPosts.length === 0 ? (
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-xs text-center text-gray-400">
                        <MessageSquare className="w-6 h-6 mx-auto mb-2 text-[#2997ff]" />
                        <p className="font-semibold text-white mb-1">No community discussions yet</p>
                        <p className="text-gray-400">
                          Be the first founding pilot participant to share feedback, questions, or live Spotlight links below.
                        </p>
                      </div>
                    ) : (
                      communityPosts.map((post, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-white">{post.author}</span>
                            <span className="text-[10px] text-gray-400">{post.time}</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{post.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {communityTab === "showcase" && (
                  <div className="space-y-3 mb-4 max-h-[260px] overflow-y-auto pr-1">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-xs text-center text-gray-400">
                      <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#2997ff]" />
                      <p className="font-semibold text-white mb-1">No member showcases submitted yet</p>
                      <p className="text-gray-400">
                        Submit your startup or project link in the private feedback section below to be featured in the Founding Cohort Showcase.
                      </p>
                    </div>
                  </div>
                )}

                {communityTab === "wishlist" && (
                  <div className="space-y-2 mb-4 max-h-[260px] overflow-y-auto pr-1">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <span className="text-gray-200 pr-2">{item.title}</span>
                        <button
                          type="button"
                          onClick={() => handleVoteWishlist(item.id)}
                          className={`apple-btn px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                            item.voted
                              ? "bg-[#0066cc] border-[#0066cc] text-white"
                              : "border-white/20 bg-white/10 text-gray-300"
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{item.votes}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post in community */}
              <form onSubmit={handleAddCommunityPost} className="pt-4 border-t border-white/10 flex gap-2">
                <input
                  placeholder="Share your thoughts or live Spotlight link..."
                  value={newCommunityPost}
                  onChange={(e) => setNewCommunityPost(e.target.value)}
                  className="apple-input bg-black/40 text-white border-white/20 text-xs py-2 flex-1"
                />
                <button type="submit" className="apple-pill-primary text-xs py-2 px-4">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TILE 6: WORK SUBMISSION & STRUCTURED PRIVATE FEEDBACK (Parchment #f5f5f7) */}
      <section className="apple-tile-parchment" id="feedback">
        <div className="apple-container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="apple-eyebrow">STRUCTURED FEEDBACK & WORK</div>
            <h2 className="apple-display-lg">Submit Work & Give Private Feedback</h2>
            <p className="apple-tagline">
              Your feedback is <b>private and only visible to the Neesh AI founding leadership</b>.
              Feel completely free to share negative, blunt, or raw feedback.
            </p>
          </div>

          {submitted ? (
            <div className="apple-card p-10 max-w-2xl mx-auto text-center border-emerald-300 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <span className="apple-eyebrow text-emerald-600 mb-2 block">SUBMISSION CONFIRMED</span>
              <h3 className="apple-display-lg text-2xl text-[#1d1d1f] mb-3">Feedback & Work Securely Received</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                Thank you! Your private feedback and pilot project links have been securely saved to the Neesh AI database and delivered directly to the founding leadership.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="apple-pill-secondary text-sm"
                >
                  Submit Another Response
                </button>
                <a
                  href="/admin"
                  className="apple-pill-primary text-sm"
                >
                  View in Founder Dashboard (2.0) ↗
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmitFeedback} className="apple-card p-8 sm:p-10 max-w-3xl mx-auto">
            {/* Part 1: About You */}
            <fieldset className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <legend className="text-lg font-semibold text-[#1d1d1f]">
                  1. About You & Your Project
                </legend>
                {registeredPilot ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                    <Check className="w-3.5 h-3.5" /> Authenticated Pilot Member
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="text-xs text-[#0066cc] hover:underline font-semibold text-left sm:text-right bg-transparent border-none cursor-pointer p-0"
                  >
                    Quick-register startup profile ↗
                  </button>
                )}
              </div>

              {registeredPilot && (
                <div className="registered-pilot-banner">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold text-xs shrink-0">
                      {registeredPilot.full_name ? registeredPilot.full_name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1d1d1f] text-xs">
                        {registeredPilot.full_name} • {registeredPilot.startup_name}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {registeredPilot.email} {registeredPilot.phone ? `• ${registeredPilot.phone}` : ""}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRegFullName(registeredPilot.full_name);
                      setRegStartupName(registeredPilot.startup_name);
                      setRegPhone(registeredPilot.phone);
                      setRegEmail(registeredPilot.email);
                      setIsRegisterModalOpen(true);
                    }}
                    className="apple-pill-secondary apple-pill-sm text-[11px]"
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500 mb-6">
                Contextualizes your experience based on role and stage. Feedback submitted will be registered directly under your startup.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full name *</label>
                  <input
                    name="full_name"
                    required
                    key={`name-${registeredPilot?.full_name || ""}`}
                    defaultValue={registeredPilot?.full_name || ""}
                    className="apple-input"
                    placeholder="e.g. Abhishek G."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    key={`email-${registeredPilot?.email || ""}`}
                    defaultValue={registeredPilot?.email || ""}
                    className="apple-input"
                    placeholder="e.g. founder@domain.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">WhatsApp number</label>
                  <input
                    name="whatsapp"
                    key={`phone-${registeredPilot?.phone || ""}`}
                    defaultValue={registeredPilot?.phone || ""}
                    className="apple-input"
                    placeholder="+91 9003866111"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Startup / Project Name</label>
                  <input
                    name="startup_name"
                    key={`startup-${registeredPilot?.startup_name || ""}`}
                    defaultValue={registeredPilot?.startup_name || ""}
                    className="apple-input"
                    placeholder="e.g. Neesh AI"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">LinkedIn Profile</label>
                  <input name="linkedin_url" type="text" inputMode="url" className="apple-input" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
            </fieldset>

            {/* Part 2: Ratings 1 to 5 */}
            <fieldset className="mb-8 pb-8 border-b border-gray-200">
              <legend className="text-lg font-semibold text-[#1d1d1f] mb-1">
                2. Rate Your Experience (1 - 5)
              </legend>
              <p className="text-sm text-gray-500 mb-6">
                1 is Poor / Confusing, 5 is Exceptional / Highly Intuitive.
              </p>

              <div className="space-y-4">
                {ratingQuestions.map(([key, label, q]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-semibold text-sm text-[#1d1d1f]">{label}</div>
                      <div className="text-xs text-gray-500">{q}</div>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setRatings((prev) => ({ ...prev, [key]: val }))}
                          className={`apple-rating-btn ${ratings[key] === val ? "selected" : ""}`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Part 3: What Stood Out */}
            <fieldset className="mb-8 pb-8 border-b border-gray-200">
              <legend className="text-lg font-semibold text-[#1d1d1f] mb-1">
                3. What Stood Out?
              </legend>
              <p className="text-sm text-gray-500 mb-6">
                Specific qualitative observations help us understand what to prioritize.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    What was the most valuable part of Neesh? *
                  </label>
                  <textarea
                    name="valuable_part"
                    required
                    rows={2}
                    className="apple-textarea"
                    placeholder="Which capability delivered immediate value or clarity?"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    What was the most frustrating part?
                  </label>
                  <textarea
                    name="frustrating_part"
                    rows={2}
                    className="apple-textarea"
                    placeholder="Where did you get stuck or feel slowed down?"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Where did you get confused or unsure what to do next?
                  </label>
                  <textarea
                    name="confusing_part"
                    rows={2}
                    className="apple-textarea"
                    placeholder="Any confusing terminology or unexpected screen transitions?"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-rose-600 block mb-1">
                    BRUTAL FEEDBACK: What would make you NOT use Neesh again?
                  </label>
                  <textarea
                    name="brutal_feedback"
                    rows={2}
                    className="apple-textarea border-rose-300"
                    placeholder="Be brutally honest. What dealbreaker would prevent you from returning?"
                  />
                </div>
              </div>
            </fieldset>

            {/* Part 4: The One Question We Care About Most */}
            <fieldset className="mb-8 pb-8 border-b border-gray-200 p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <legend className="text-base font-semibold text-[#0066cc] mb-1">
                4. The One Question We Care About Most
              </legend>
              <p className="text-sm font-semibold text-[#1d1d1f] mb-4">
                Did Neesh tell you, show you, or help you discover something you didn't already know?
              </p>
              <div className="flex gap-4 mb-4">
                {["Yes", "Somewhat", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="discovery_answer" value={opt} defaultChecked={opt === "Yes"} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <textarea
                name="discovery_detail"
                rows={2}
                className="apple-textarea"
                placeholder="Tell us what happened..."
              />
            </fieldset>

            {/* Part 5: Submit Work Links */}
            <fieldset className="mb-8 pb-8 border-b border-gray-200">
              <legend className="text-lg font-semibold text-[#1d1d1f] mb-1">
                5. Submit Your Work Links
              </legend>
              <p className="text-sm text-gray-500 mb-6">
                Paste the URLs you generated on Neesh AI 2.0.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Spotlight Link</label>
                  <input name="spotlight_url" type="text" inputMode="url" className="apple-input" placeholder="https://neesh-2-o.vercel.app/spotlight/..." />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Elevator Pitch Video Link</label>
                  <input name="pitch_url" type="text" inputMode="url" className="apple-input" placeholder="https://..." />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Product Demo / Project Link</label>
                  <input name="project_url" type="text" inputMode="url" className="apple-input" placeholder="https://..." />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Website / App Link</label>
                  <input name="website_url" type="text" inputMode="url" className="apple-input" placeholder="https://..." />
                </div>
              </div>

              {/* What did you test checkboxes */}
              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-3">
                  What did you test during this pilot session?
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {testedItems.map((item) => (
                    <label key={item} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
                      <input type="checkbox" name="what_tested" value={item} defaultChecked />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            {formError && (
              <div className="p-3 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {formError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <LockKeyhole className="w-4 h-4 text-[#0066cc]" />
                Private & confidential. Visible only to Neesh AI founding leadership.
              </span>
              <button
                type="submit"
                disabled={busy}
                className="apple-pill-primary w-full sm:w-auto"
              >
                {busy ? "Submitting Your Work…" : "Submit Private Pilot Work & Feedback"}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </form>
          )}
        </div>
      </section>

      {/* 9. FLOATING BUG & FEEDBACK WIDGET */}
      <div className="apple-floating-widget">
        <button
          type="button"
          onClick={() => setIsBugModalOpen(true)}
          className="apple-floating-btn group"
          aria-label="Report Bug or Feedback"
        >
          <div className="apple-floating-icon-badge">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="apple-floating-subbadge">
              <Bug className="w-2.5 h-2.5 text-white stroke-[2.5]" />
            </span>
            <span className="apple-floating-ping-dot">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759] ring-1 ring-[#1d1d1f]" />
            </span>
          </div>
          <div className="apple-floating-text-group">
            <span className="apple-floating-title">Bug & Feedback</span>
            <span className="apple-floating-subtitle">Pilot Hotline</span>
          </div>
        </button>
      </div>

      {/* BUG MODAL */}
      {isBugModalOpen && (
        <div className="apple-modal-overlay" role="dialog" aria-modal="true">
          <div className="apple-modal-panel">
            <button
              onClick={() => setIsBugModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="apple-floating-icon-badge !w-9 !h-9 shadow-sm">
                <MessageSquare className="w-4 h-4 text-white" />
                <span className="apple-floating-subbadge !w-4 !h-4">
                  <Bug className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1d1d1f] leading-tight">Quick Bug & Feedback Drawer</h3>
                <p className="text-xs text-[#86868b]">Direct channel to Neesh AI engineering</p>
              </div>
            </div>

            {bugSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs text-center font-medium">
                ✓ Thank you! Bug report received. We are investigating immediately.
              </div>
            ) : (
              <form onSubmit={handleBugSubmit} className="space-y-3">
                <div className="flex gap-2 mb-2">
                  {["Bug Report", "Usability Issue", "Feature Idea"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBugCategory(cat)}
                      className={`apple-btn px-3 py-1 rounded-full text-xs font-medium border ${
                        bugCategory === cat
                          ? "bg-[#0066cc] border-[#0066cc] text-white"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    What were you doing? / What happened? *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Clicked Spotlight create and got a timeout..."
                    value={bugMessage}
                    onChange={(e) => setBugMessage(e.target.value)}
                    className="apple-textarea text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Any suggestions or extra notes?
                  </label>
                  <input
                    placeholder="e.g. An automatic retry button would help"
                    value={bugDetail}
                    onChange={(e) => setBugDetail(e.target.value)}
                    className="apple-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Your Contact (Optional)
                  </label>
                  <input
                    placeholder="WhatsApp number or email"
                    value={bugContact}
                    onChange={(e) => setBugContact(e.target.value)}
                    className="apple-input text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bugBusy}
                  className="apple-pill-primary w-full text-xs py-2.5 mt-2"
                >
                  {bugBusy ? "Sending…" : "Send to Founder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2.0 PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="apple-modal-overlay" role="dialog" aria-modal="true">
          <div className="apple-modal-panel text-center">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img src="/neesh-logo.png" alt="Neesh AI" className="h-8 w-auto object-contain mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-[#1d1d1f] mb-1">Founder Access — 2.0 Command Center</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
              Enter the master access code to unlock the private participant database, feedback
              analytics, and CSV/Excel exports.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="apple-input h-12 text-center text-lg tracking-widest font-mono"
                autoFocus
              />

              {passwordError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                disabled={passwordBusy}
                className="apple-pill-primary w-full py-3 text-sm font-semibold"
              >
                {passwordBusy ? "Verifying…" : "Unlock 2.0 Dashboard ↗"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 11. PILOT REGISTRATION MODAL */}
      {isRegisterModalOpen && (
        <div className="apple-modal-overlay" role="dialog" aria-modal="true">
          <div className="apple-modal-panel max-w-lg">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 border-none bg-transparent cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066cc] block">
                  Founding Pilot • Early Access
                </span>
                <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight m-0">
                  {registeredPilot ? "Your Pilot Profile" : "Register for Neesh AI Pilot"}
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Join the #1 Business Social Platform and world-first startup development team. Your details authenticate your session and automatically link all your feedback, spotlight submissions, and bug reports.
            </p>

            {registerSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center my-4 animate-in fade-in duration-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <p className="text-sm font-semibold m-0">{registerSuccessMsg}</p>
                <p className="text-xs text-emerald-600 mt-1 m-0">Directing you to the platform mission...</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhishek Sharma"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="apple-input text-sm py-2.5"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>Startup / Project Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neesh AI or FinTech Studio"
                    value={regStartupName}
                    onChange={(e) => setRegStartupName(e.target.value)}
                    className="apple-input text-sm py-2.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>Phone Number (WhatsApp) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9003866111"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="apple-input text-sm py-2.5"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>Email ID *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. founder@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="apple-input text-sm py-2.5"
                  />
                </div>

                {registerError && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 m-0">
                    {registerError}
                  </p>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={registerBusy}
                    className="apple-pill-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    {registerBusy ? (
                      <span>Registering…</span>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        <span>{registeredPilot ? "Update Registration" : "Register"}</span>
                      </>
                    )}
                  </button>

                  {registeredPilot && (
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("neesh_pilot_registered_user");
                        setRegisteredPilot(null);
                        setRegFullName("");
                        setRegStartupName("");
                        setRegPhone("");
                        setRegEmail("");
                        setIsRegisterModalOpen(false);
                      }}
                      className="text-xs text-gray-400 hover:text-rose-600 py-1 transition bg-transparent border-none cursor-pointer text-center"
                    >
                      Sign out on this device
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 10. APPLE FOOTER (Parchment #f5f5f7, Relaxed Leading) */}
      <footer className="apple-footer">
        <div className="apple-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <img src="/neesh-logo.png" alt="Neesh AI" className="h-7 w-auto object-contain mb-1.5" />
            <div className="text-xs text-gray-500">
              Founding Pilot & Early Access Program • Built for founders, with founders.
            </div>
          </div>

          <div className="text-xs text-gray-600 text-center md:text-left space-y-1">
            <div>
              Support & Inquiries:{" "}
              <a href={`tel:${FOUNDER_PHONE}`}>+91 {FOUNDER_PHONE}</a> •{" "}
              <a href={`mailto:${FOUNDER_EMAIL}`}>{FOUNDER_EMAIL}</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={NEESH_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-pill-secondary apple-pill-sm"
            >
              Platform ↗
            </a>

            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="apple-pill-secondary apple-pill-sm flex items-center gap-1"
            >
              <LockKeyhole className="w-3 h-3" />
              <span>Founder 2.0</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}