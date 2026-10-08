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

const guideSections = [
  {
    num: "01",
    title: "Before You Start",
    content:
      "Welcome to the Neesh AI 2.0 private pilot. Before you start testing, prepare a short summary of a project or idea you care about. You will test how easily Neesh transforms raw notes into a live interactive Spotlight with an AI-powered conversational layer.",
  },
  {
    num: "02",
    title: "How to Access Neesh AI",
    content:
      "Click the 'Launch Platform' button or visit https://neesh-2-o.vercel.app in a new tab. Keep this Pilot Portal open in background so you can cross-reference your mission steps and record observations while exploring.",
  },
  {
    num: "03",
    title: "Creating Your Account",
    content:
      "Use your preferred login option. Test the speed, instructions, and friction of the authentication workflow. Note any confusing terms, missing verification emails, or delays.",
  },
  {
    num: "04",
    title: "Creating Your Project",
    content:
      "Click 'Create Project'. You will be prompted for your startup name, stage, and primary problem statement. Pay attention to whether the instructions are intuitive or if you feel stranded at any prompt.",
  },
  {
    num: "05",
    title: "Adding Startup Information",
    content:
      "Input your raw notes, pitch outline, or documents. Neesh uses this information to establish the factual baseline for your public spotlight and chatbot context.",
  },
  {
    num: "06",
    title: "Creating Your Spotlight",
    content:
      "Generate the interactive Spotlight. Review the generated value proposition, audience hooks, and key pillars. Evaluate whether it faithfully represents your vision or hallucinated details.",
  },
  {
    num: "07",
    title: "Adding Your Elevator Pitch",
    content:
      "Link or record an Elevator Pitch video/audio demo. Test whether the preview loads crisply and invites the viewer to interact further with your startup page.",
  },
  {
    num: "08",
    title: "Understanding Your Spotlight",
    content:
      "Your Spotlight serves as an interactive public landing page for discovery. Ask yourself: Would I share this URL with prospective investors, early adopters, or co-founders today?",
  },
  {
    num: "09",
    title: "Using the AI Chatbot",
    content:
      "Interact with the embedded chatbot as a visitor. Ask tough questions about your pricing, tech stack, and roadmap. Check if the answers are accurate, fast, and helpful.",
  },
  {
    num: "10",
    title: "Publishing & Sharing",
    content:
      "Grab your public Spotlight link. Try sharing it with a peer or in the Pilot Community Hub below to gather early impressions and validate the link preview.",
  },
  {
    num: "11",
    title: "Testing Your Startup Workflow",
    content:
      "Simulate what a potential user does: read the pitch, ask the AI 2 questions, and express interest. Confirm that interest signals and analytics register properly.",
  },
  {
    num: "12",
    title: "Understanding Audience Interaction",
    content:
      "Check your founder view to see visitor queries, popular questions, and confusion drop-offs. This closes the feedback loop and reveals what your audience actually cares about.",
  },
  {
    num: "13",
    title: "What You Need to Submit",
    content:
      "Submit your Spotlight URL, elevator pitch link, project demo link, and your honest answers in the 'Submit Your Work' section on this page.",
  },
  {
    num: "14",
    title: "How to Give Feedback",
    content:
      "Be brutal and candid! Don't worry about being polite. Tell us what broke, what was slow, what felt unnecessary, and what you would change immediately.",
  },
  {
    num: "15",
    title: "Common Problems & Troubleshooting",
    content:
      "If you experience a session timeout, refresh the page. If the chatbot gives a repetitive answer, re-index your project notes. For urgent blockers, use the direct WhatsApp hotline (+91 9003866111) anytime.",
  },
];

function PilotHome() {
  const navigate = useNavigate();
  const registerMember = useServerFn(registerPilotMember);
  const submitFeedback = useServerFn(submitPilotFeedback);
  const submitQuick = useServerFn(submitQuickReport);
  const unlockFounder = useServerFn(unlockFounderDashboard);

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
      {/* 1. APPLE GLOBAL NAV (44px pure black) */}
      <nav className="apple-global-nav" aria-label="Global">
        <div className="apple-global-nav-inner">
          <a href="#top" className="apple-global-brand">
            <img src="/neesh-logo.png" alt="Neesh AI" className="h-6 w-auto object-contain brightness-0 invert" />
          </a>

          <div className="apple-global-nav-links">
            <a href="#about">About Neesh</a>
            <a href="#guide">Platform Guide</a>
            <a href="#checklist">Testing Mission</a>
            <a href="#hotline">Founder Hotline</a>
            <a href="#community">Community</a>
            <a href="#feedback">Your Feedback</a>
          </div>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="apple-btn text-white text-xs opacity-80 hover:opacity-100 flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
          >
            <LockKeyhole className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>2.0</span>
          </button>
        </div>
      </nav>

      {/* 2. SUB-NAV FROSTED (52px, frosted-glass) */}
      <nav className="apple-sub-nav" aria-label="Sub navigation">
        <div className="apple-sub-nav-inner">
          <div className="apple-sub-nav-title flex items-center gap-3">
            <img src="/neesh-logo.png" alt="Neesh AI" className="h-7 sm:h-8 w-auto object-contain" />
            <span className="apple-sub-nav-badge">Founding Pilot 2.0</span>
          </div>

          <div className="flex items-center gap-3">
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
              className="apple-pill-secondary apple-pill-sm"
            >
              <LockKeyhole className="w-3 h-3" />
              <span>2.0 Access</span>
            </button>

            <a
              href={NEESH_AI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-pill-primary apple-pill-sm"
            >
              <span>Launch Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
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
              <div className="apple-eyebrow">DOCUMENTATION & ONBOARDING</div>
              <h2 className="apple-display-lg">Founder Onboarding & Platform Manual</h2>
              <p className="text-gray-600 max-w-2xl">
                Comprehensive step-by-step instructions so you can navigate Neesh AI 2.0 without
                asking personally.
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

          {/* 3-Step Visual Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0]">
              <span className="text-xs font-semibold text-[#0066cc]">STEP 1</span>
              <h3 className="text-lg font-semibold my-1">Upload Raw Idea</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Docs, notes, thoughts. Feed raw inputs directly without manual formatting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0]">
              <span className="text-xs font-semibold text-[#0066cc]">STEP 2</span>
              <h3 className="text-lg font-semibold my-1">Auto-Generate Spotlight</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Instant public validation page with conversational AI trained on your specifics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0]">
              <span className="text-xs font-semibold text-[#0066cc]">STEP 3</span>
              <h3 className="text-lg font-semibold my-1">Detect Gaps & Refine</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Analyze visitor queries, train the chatbot, discover audience doubts, and iterate.
              </p>
            </div>
          </div>

          {/* SAMPLE ELEVATOR PITCH LIVE SCREEN TAB (Near / Before Section 01: Before You Start) */}
          <SampleElevatorPitchTab pitchUrl="https://neesh-2-o.vercel.app/p/neesh-ai-2ca678d8-de9c-4116-99ad-b46b3e2a76d6" />

          {/* 15 Expandable Sections (Section 01 is 'Before You Start') */}
          <div className="space-y-3">
            {guideSections.map((sec, idx) => (
              <div
                key={sec.num}
                className="border border-[#e0e0e0] rounded-2xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  onClick={() => setExpandedGuide(expandedGuide === idx ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center bg-white hover:bg-gray-50 border-none cursor-pointer"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-xs font-mono font-semibold text-[#0066cc] w-6">
                      {sec.num}
                    </span>
                    <span className="font-semibold text-base text-[#1d1d1f]">{sec.title}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedGuide === idx ? "rotate-180 text-[#0066cc]" : ""
                    }`}
                  />
                </button>
                {expandedGuide === idx && (
                  <div className="px-5 pb-5 pt-2 text-sm text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed">
                    {sec.content}
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

      {/* 9. FLOATING BUG WIDGET */}
      <div className="apple-floating-widget">
        <button
          type="button"
          onClick={() => setIsBugModalOpen(true)}
          className="apple-floating-btn"
        >
          <Bug className="w-4 h-4 text-[#2997ff]" />
          <span>Report Bug / Feedback</span>
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

            <div className="flex items-center gap-2 mb-2">
              <Bug className="w-5 h-5 text-[#0066cc]" />
              <h3 className="text-lg font-semibold text-[#1d1d1f]">Quick Bug & Feedback Drawer</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Encountered a problem or have an immediate suggestion while testing?
            </p>

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