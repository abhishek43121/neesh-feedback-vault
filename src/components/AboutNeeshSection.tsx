import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Rocket,
  Building2,
  Compass,
  TrendingUp,
  Code2,
  Users,
  Handshake,
  CheckCircle2,
  MessageSquare,
  Play,
  Share2,
  Zap,
  Target,
  RefreshCw,
  Cpu,
  Layers,
  ChevronRight,
  Globe2,
  ShieldCheck,
} from "lucide-react";

interface AboutNeeshSectionProps {
  platformUrl?: string;
}

export function AboutNeeshSection({
  platformUrl = "https://neesh-2-o.vercel.app",
}: AboutNeeshSectionProps) {
  // 1. Audience Grid state
  const [activeAudience, setActiveAudience] = useState<number>(0);

  // 2. How Neesh Works Flow state
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);

  // 3. Spotlight Mockup Tabs
  const [activeSpotlightTab, setActiveSpotlightTab] = useState<
    "overview" | "pitch" | "agent" | "signals"
  >("overview");

  // 4. Spotlight Interactive AI Chat state
  const [chatAnswer, setChatAnswer] = useState<string>(
    "Neesh AI operates as a discovery & validation ecosystem. Startups create interactive Spotlights, and audience questions are indexed to reveal where users get confused, excited, or ready to join."
  );
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // 5. Opportunity Constellation state
  const [activeNode, setActiveNode] = useState<string>("Pilot User");

  const audiences = [
    {
      id: "founders",
      role: "FOUNDERS",
      tagline: "Turn ideas into interactive Spotlights",
      desc: "Turn ideas into interactive Spotlights and discover customers, pilots, investors and people to build with.",
      action: "Create Spotlights • Recruit Builders • Attract Capital",
      icon: Rocket,
    },
    {
      id: "businesses",
      role: "BUSINESSES",
      tagline: "Test new markets with real people",
      desc: "Test new products, services, markets and opportunities with real people.",
      action: "Market Testing • Pilot Cohorts • Product Validation",
      icon: Building2,
    },
    {
      id: "product_teams",
      role: "PRODUCT TEAMS",
      tagline: "Understand user friction & excitement",
      desc: "Put products in front of potential users and understand what attracts, confuses or interests them.",
      action: "Friction Detection • User Signals • Feature Conviction",
      icon: Compass,
    },
    {
      id: "investors",
      role: "INVESTORS",
      tagline: "Observe organic audience traction",
      desc: "Discover emerging startups and observe real audience interest and opportunity signals.",
      action: "Early Dealflow • Conviction Data • Public Pull",
      icon: TrendingUp,
    },
    {
      id: "builders",
      role: "BUILDERS",
      tagline: "Find startups looking for talent",
      desc: "Find startups looking for cofounders, developers, designers, marketers and other talent.",
      action: "Join Founding Teams • Equity Roles • Build Portfolios",
      icon: Code2,
    },
    {
      id: "customers",
      role: "CUSTOMERS",
      tagline: "Discover products before mainstream",
      desc: "Discover products and services before they become mainstream. Explore, question, test and participate.",
      action: "Early Access • Shape Products • Exclusive VIP Pilots",
      icon: Users,
    },
    {
      id: "mentors",
      role: "MENTORS & PARTNERS",
      tagline: "Create high-leverage strategic value",
      desc: "Find founders and businesses where your expertise, network or resources can create value.",
      action: "Advisory Roles • Strategic Partnerships • Ecosystem Synergy",
      icon: Handshake,
    },
  ];

  const flowSteps = [
    {
      step: "01",
      name: "IDEA",
      headline: "Build it.",
      detail: "Bring raw thoughts, slide decks, prototypes, or notes. Neesh structures them into an actionable value proposition.",
    },
    {
      step: "02",
      name: "SPOTLIGHT",
      headline: "Put it out there.",
      detail: "Instantly generate an interactive public Spotlight page with your vision, 45-second elevator pitch, and knowledge base.",
    },
    {
      step: "03",
      name: "DISCOVERY",
      headline: "Let people discover it.",
      detail: "Early adopters, investors, and talent explore your concept through high-signal curated feeds and live search.",
    },
    {
      step: "04",
      name: "INTERACTION",
      headline: "See what they do.",
      detail: "Visitors test your demo, ask your 24/7 AI chatbot unvarnished questions, and probe your actual capabilities.",
    },
    {
      step: "05",
      name: "INTEREST",
      headline: "Capture real pull.",
      detail: "Collect structured intent: pilot applications, cofounder inquiries, and early customer commitments.",
    },
    {
      step: "06",
      name: "OPPORTUNITY",
      headline: "Find the people who want to be part of it.",
      detail: "Transform abstract validation into tangible relationships that fund, build, and accelerate your startup.",
    },
  ];

  const sampleQuestions = [
    {
      q: "What is your business model?",
      a: "Freemium public Spotlights for early discovery, with premium verification analytics, cohort management, and private investor signal matching.",
    },
    {
      q: "Who is your ideal customer right now?",
      a: "Early-stage founders, product leaders launching new initiatives, and angel investors looking for organic pre-seed pull signals.",
    },
    {
      q: "How do I join the pilot cohort?",
      a: "Submit your work link in the Feedback section below, or click 'Launch Platform' to spin up your first interactive Spotlight in under 3 minutes.",
    },
  ];

  const opportunityNodes = [
    {
      name: "Customer",
      role: "Validates willingness-to-pay and adopts the solution first.",
      color: "from-blue-500 to-indigo-600",
      type: "Commercial",
    },
    {
      name: "Pilot User",
      role: "Stress-tests edge cases and provides raw, brutal product feedback.",
      color: "from-cyan-500 to-blue-600",
      type: "Testing",
    },
    {
      name: "Investor",
      role: "Spots organic traction and conviction signals before the crowds.",
      color: "from-emerald-500 to-teal-600",
      type: "Capital",
    },
    {
      name: "Cofounder",
      role: "Brings technical or commercial superpowers to execute side-by-side.",
      color: "from-violet-500 to-purple-600",
      type: "Founding",
    },
    {
      name: "Employee",
      role: "First core operators, engineers, and designers inspired by the mission.",
      color: "from-amber-500 to-orange-600",
      type: "Talent",
    },
    {
      name: "Mentor",
      role: "Opens enterprise doors, guides positioning, and accelerates milestones.",
      color: "from-rose-500 to-pink-600",
      type: "Guidance",
    },
    {
      name: "Partner",
      role: "Enables distribution, integration pipelines, and joint go-to-market.",
      color: "from-sky-500 to-blue-700",
      type: "Distribution",
    },
    {
      name: "Early Adopter",
      role: "Champions the product on social media and provides first testimonials.",
      color: "from-teal-500 to-emerald-700",
      type: "Advocacy",
    },
  ];

  const activeNodeData =
    opportunityNodes.find((n) => n.name === activeNode) ?? opportunityNodes[1]!;
  const currentAudience = audiences[activeAudience] ?? audiences[0]!;
  const currentFlowStep = flowSteps[activeFlowStep] ?? flowSteps[0]!;

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#fafafc] border-y border-[#e5e5ea] text-[#1d1d1f] relative overflow-hidden">
      {/* Background Subtle Tech Lattice Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#0066cc 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="apple-container relative z-10">
        {/* ========================================================================= */}
        {/* 1. HERO STATEMENT */}
        {/* ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-20 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d2d2d7] shadow-xs mb-6 text-xs font-semibold text-[#0066cc] tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
            <span>About Neesh AI 2.0 • Ecosystem Architecture</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1d1d1f] leading-[1.08] mb-6">
            IDEAS ARE EVERYWHERE. <br />
            <span className="text-[#0066cc]">THE RIGHT PEOPLE AREN’T.</span>
          </h2>

          <p className="text-lg sm:text-2xl text-[#6e6e73] font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Neesh AI connects emerging ideas with the people who can help make them real.
          </p>

          {/* Positioning Highlight Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e5ea] shadow-sm max-w-3xl mx-auto text-center transform transition-all duration-300 hover:shadow-md">
            <span className="text-xs font-mono font-semibold tracking-wider text-[#0066cc] uppercase block mb-2">
              Core Positioning
            </span>
            <div className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mb-3">
              “Where Ideas Meet the People They Need.”
            </div>
            <p className="text-sm sm:text-base text-[#424245] leading-relaxed max-w-2xl mx-auto">
              Neesh AI is a <strong className="text-[#1d1d1f] font-semibold">startup discovery, validation, and opportunity ecosystem</strong> that helps ideas, products, services, and early-stage businesses become discoverable, understandable, and actionable.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FOR EVERYONE BUILDING WHAT’S NEXT */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0066cc] block mb-2">
              Who Neesh Is For
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              For Everyone Building What’s Next.
            </h3>
            <p className="text-sm sm:text-base text-[#6e6e73]">
              Whether you are creating, evaluating, testing, or funding — Neesh creates a shared space for active participation.
            </p>
          </div>

          {/* Compact Interactive Audience Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
            {audiences.map((aud, index) => {
              const IconComp = aud.icon;
              const isSelected = activeAudience === index;
              return (
                <div
                  key={aud.id}
                  onClick={() => setActiveAudience(index)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#0066cc] shadow-md ring-2 ring-[#0066cc]/15 -translate-y-1"
                      : "bg-white/80 hover:bg-white border-[#e5e5ea] hover:border-[#c7c7cc] shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-bold tracking-wider px-2 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-[#0066cc] text-white"
                            : "bg-[#f5f5f7] text-[#1d1d1f]"
                        }`}
                      >
                        {aud.role}
                      </span>
                      <IconComp
                        className={`w-4 h-4 ${
                          isSelected ? "text-[#0066cc]" : "text-[#86868b]"
                        }`}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-[#3a3a3c] font-normal leading-relaxed line-clamp-3">
                      {aud.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#0066cc]">
                      {isSelected ? "Active Perspective" : "Click to view role"}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isSelected ? "text-[#0066cc] translate-x-0.5" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Audience Focus Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e5e5ea] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold text-sm shrink-0">
                {currentAudience.role.slice(0, 2)}
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Persona: {currentAudience.role}
                </div>
                <div className="text-sm font-semibold text-[#1d1d1f]">
                  {currentAudience.action}
                </div>
              </div>
            </div>

            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#0066cc] hover:text-[#0071e3] inline-flex items-center gap-1 group whitespace-nowrap"
            >
              <span>Explore {currentAudience.role} Workflows</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. HOW NEESH WORKS (HORIZONTAL FLOW) */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0066cc] block mb-2">
              The Journey
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              How Neesh Works.
            </h3>
            <p className="text-sm sm:text-base text-[#6e6e73]">
              A continuous, frictionless pathway from raw spark to real commitment.
            </p>
          </div>

          {/* Interactive Pipeline Bar */}
          <div className="p-3 sm:p-4 rounded-3xl bg-white border border-[#e5e5ea] shadow-xs mb-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[680px] gap-2">
              {flowSteps.map((step, idx) => {
                const isActive = activeFlowStep === idx;
                return (
                  <div key={step.name} className="flex items-center flex-1">
                    <button
                      type="button"
                      onClick={() => setActiveFlowStep(idx)}
                      className={`flex-1 text-center py-3 px-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#0066cc] text-white shadow-sm font-semibold scale-102"
                          : "hover:bg-[#f5f5f7] text-[#1d1d1f]"
                      }`}
                    >
                      <div
                        className={`text-[10px] font-mono tracking-widest block mb-0.5 ${
                          isActive ? "text-blue-100" : "text-[#86868b]"
                        }`}
                      >
                        STEP {step.step}
                      </div>
                      <div className="text-xs sm:text-sm font-bold tracking-tight">
                        {step.name}
                      </div>
                    </button>
                    {idx < flowSteps.length - 1 && (
                      <span className="text-gray-300 px-1 font-mono text-sm select-none">
                        →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Detail Card with The 5 Commandments Underneath */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Step Detail */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e5ea] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0066cc]/10 text-[#0066cc]">
                    STEP {currentFlowStep.step}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                    {currentFlowStep.name}
                  </span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] mb-3">
                  {currentFlowStep.headline}
                </h4>
                <p className="text-base text-[#424245] leading-relaxed mb-6">
                  {currentFlowStep.detail}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Step {activeFlowStep + 1} of {flowSteps.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFlowStep((prev) =>
                        prev > 0 ? prev - 1 : flowSteps.length - 1
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFlowStep((prev) =>
                        prev < flowSteps.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#0066cc] text-white text-xs font-medium hover:bg-[#0071e3] cursor-pointer"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>

            {/* The 5 Sentences Visual Manifest */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#1d1d1f] text-white flex flex-col justify-center">
              <span className="text-xs font-mono tracking-widest text-[#2997ff] uppercase block mb-4">
                The Core Loop
              </span>
              <div className="space-y-3.5 text-lg sm:text-xl font-medium">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                  <span>Build it.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                  <span>Put it out there.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                  <span>Let people discover it.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                  <span>See what they do.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white font-bold">
                    Find the people who want to be part of it.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. SPOTLIGHT EXPLANATION & INTERACTIVE MOCKUP */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0066cc] block mb-2">
              The Product Primitive
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              One idea. One place. Real possibilities.
            </h3>
            <p className="text-sm sm:text-base text-[#6e6e73]">
              A Spotlight brings together the{" "}
              <strong className="text-[#1d1d1f] font-semibold">
                problem, solution, market, business, vision, elevator pitch, AI knowledge and opportunities
              </strong>{" "}
              around an idea or startup.
            </p>
          </div>

          {/* Interactive Spotlight Window Mockup */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-[#d2d2d7] shadow-lg overflow-hidden">
            {/* Window Top Bar (macOS aesthetic) */}
            <div className="px-5 py-3.5 bg-[#f5f5f7] border-b border-[#e5e5ea] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-xs font-mono text-[#86868b] hidden sm:inline">
                  neesh.ai/spotlight/neesh-2-0
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Spotlight • Interactive Verification
                </span>
              </div>
            </div>

            {/* Spotlight Tab Bar */}
            <div className="px-5 py-2.5 bg-white border-b border-[#f0f0f2] flex items-center gap-2 overflow-x-auto text-xs font-medium">
              {[
                { id: "overview", label: "Problem & Solution", icon: Target },
                { id: "pitch", label: "Elevator Pitch (45s)", icon: Play },
                { id: "agent", label: "24/7 AI Knowledge Agent", icon: Cpu },
                { id: "signals", label: "Opportunity Radar", icon: Zap },
              ].map((tab) => {
                const Icon = tab.icon;
                const isTabActive = activeSpotlightTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSpotlightTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      isTabActive
                        ? "bg-[#0066cc] text-white font-semibold shadow-xs"
                        : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Tab Body */}
            <div className="p-6 sm:p-8 min-h-[320px] bg-white">
              {activeSpotlightTab === "overview" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-semibold text-[#0066cc] uppercase tracking-wide">
                        Venture Archetype
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
                        Neesh AI 2.0 • Startup Discovery & Validation
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066cc] text-xs font-semibold self-start sm:self-auto border border-blue-100">
                      Private Beta • Pilot Cohort
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-gray-100">
                      <div className="text-xs font-semibold text-rose-600 mb-1 uppercase tracking-wide">
                        The Core Problem
                      </div>
                      <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                        Startups fail not from inability to build code, but from building in silence. Founders pitch to walls, while prospective users and investors struggle to evaluate unproven concepts.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-gray-100">
                      <div className="text-xs font-semibold text-emerald-600 mb-1 uppercase tracking-wide">
                        The Neesh Solution
                      </div>
                      <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                        An interactive Spotlight that brings together the pitch, AI assistant, and intent capture in one living entry point where early adopters question, test, and commit.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSpotlightTab === "pitch" && (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-[#1d1d1f] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#0066cc] flex items-center justify-center text-white shrink-0 shadow-md">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-[#2997ff]">0:45 FOUNDER PITCH</div>
                        <div className="text-sm sm:text-base font-semibold">
                          “Why we built the ecosystem where ideas meet people”
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">1.0x</span>
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-[#2997ff]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                      Key Pitch Takeaway
                    </span>
                    <p className="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed">
                      "Instead of sending static PDFs or dead pitch decks, your Spotlight stays alive 24/7, fielding questions and detecting market signals continuously."
                    </p>
                  </div>
                </div>
              )}

              {activeSpotlightTab === "agent" && (
                <div className="space-y-4">
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>Try asking the Spotlight AI Agent (click any prompt):</span>
                    <span className="text-[#0066cc] font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Indexed Knowledge Base
                    </span>
                  </div>

                  {/* Preset prompt buttons */}
                  <div className="flex flex-wrap gap-2">
                    {sampleQuestions.map((item, idx) => (
                      <button
                        key={item.q}
                        type="button"
                        onClick={() => {
                          setActiveQuestionIndex(idx);
                          setChatAnswer(item.a);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          activeQuestionIndex === idx
                            ? "bg-[#0066cc] border-[#0066cc] text-white font-medium shadow-xs"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>

                  {/* Simulated chat response box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0066cc] mb-2">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Spotlight Knowledge Agent Answer</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#1d1d1f] leading-relaxed">
                      {chatAnswer}
                    </p>
                  </div>
                </div>
              )}

              {activeSpotlightTab === "signals" && (
                <div className="space-y-4">
                  <div className="text-xs text-gray-500">
                    Real-time audience engagement signals observed on this Spotlight:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="text-2xl font-bold text-[#0066cc]">24</div>
                      <div className="text-[11px] text-gray-500 font-medium">Pilot Requests</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="text-2xl font-bold text-emerald-600">6</div>
                      <div className="text-[11px] text-gray-500 font-medium">Builder Inquiries</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-[11px] text-gray-500 font-medium">Investor Signals</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="text-2xl font-bold text-[#1d1d1f]">96%</div>
                      <div className="text-[11px] text-gray-500 font-medium">Clarity Rating</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      High organic conviction detected: 3 enterprise teams registered for early validation access.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Callout Banner */}
            <div className="px-6 py-4 bg-[#fbfbfd] border-t border-[#e5e5ea] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6e6e73]">
              <span className="font-semibold text-[#1d1d1f]">
                More than a profile — an interactive entry point into a startup.
              </span>
              <a
                href={platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0066cc] font-semibold hover:underline inline-flex items-center gap-1"
              >
                Create your Spotlight now <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. OPPORTUNITY LAYER (INTERACTIVE CONSTELLATION) */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0066cc] block mb-2">
              The Relationship Engine
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              The Opportunity Layer.
            </h3>
            <p className="text-sm sm:text-base text-[#6e6e73]">
              Because building a startup isn't only about having a good idea. It's about finding the people willing to use it, build it, fund it, join it and grow it.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e5e5ea] shadow-sm max-w-4xl mx-auto">
            {/* Center Node + Constellation layout */}
            <div className="text-center mb-8">
              <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#0066cc] to-[#004c99] text-white shadow-lg ring-8 ring-blue-50">
                <span className="text-[10px] tracking-widest uppercase font-mono text-blue-200 mb-1">
                  CORE HUB
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-wider">
                  OPPORTUNITY
                </span>
                <span className="text-[11px] text-blue-100 mt-1">
                  The Catalyst of Every Startup
                </span>
              </div>
            </div>

            {/* Connecting Satellite Nodes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {opportunityNodes.map((node) => {
                const isSelected = activeNode === node.name;
                return (
                  <button
                    key={node.name}
                    type="button"
                    onClick={() => setActiveNode(node.name)}
                    className={`p-3.5 rounded-2xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#0066cc] text-white border-[#0066cc] shadow-md scale-102 font-semibold"
                        : "bg-[#fbfbfd] hover:bg-gray-100 text-[#1d1d1f] border-gray-200"
                    }`}
                  >
                    <div
                      className={`text-[10px] uppercase font-mono tracking-wider mb-0.5 ${
                        isSelected ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {node.type}
                    </div>
                    <div className="text-sm font-bold">{node.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Node Synergy Explanation */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#f5f5f7] border border-gray-200 text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold text-[#0066cc] uppercase tracking-wider block mb-1">
                How {activeNodeData.name} Powers the Startup:
              </span>
              <p className="text-sm sm:text-base font-medium text-[#1d1d1f] leading-relaxed">
                {activeNodeData.role}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. THE NEESH DIFFERENCE */}
        {/* ========================================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0066cc] block mb-2">
              Fundamental Paradigm Shift
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-3">
              The Neesh Difference.
            </h3>
            <p className="text-sm sm:text-base text-[#6e6e73]">
              From closed questions into open, public traction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-500 uppercase tracking-widest inline-block mb-4">
                  FROM
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-gray-400 mb-4 line-through decoration-rose-400/60">
                  “Should I build this?”
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-500">
                  <li>• Guessing market demand in isolated vacuum</li>
                  <li>• Pitch decks sent into silence with no feedback</li>
                  <li>• Asking friends who hesitate to be honest</li>
                  <li>• Building code for months before knowing if anyone cares</li>
                </ul>
              </div>
            </div>

            {/* The Neesh Way */}
            <div className="p-8 rounded-3xl bg-[#1d1d1f] text-white shadow-md flex flex-col justify-between border border-white/10">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0066cc] text-white uppercase tracking-widest inline-block mb-4">
                  TO
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#2997ff] mb-4">
                  “Who wants to build it with me?”
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
                  <li>• Public, interactive discovery from day one</li>
                  <li>• Live questions and friction detected automatically</li>
                  <li>• High-signal commitments from early adopters and backers</li>
                  <li>• Transparent conviction backed by real participant data</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block px-5 py-2.5 rounded-full bg-blue-50 border border-blue-200 text-sm sm:text-base font-semibold text-[#0066cc]">
              Neesh turns startup ideas into discoverable opportunities.
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. FINAL ECOSYSTEM LOOP */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#d2d2d7] shadow-sm max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#0066cc] block mb-3">
            Continuous Cycle of Innovation
          </span>

          <h3 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight mb-8">
            The Neesh Ecosystem Loop
          </h3>

          {/* Animated circular flow representation */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#f5f5f7] border border-gray-200 max-w-2xl mx-auto mb-8">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#1d1d1f]">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                IDEAS
              </span>
              <span className="text-[#0066cc] font-mono">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                DISCOVERY
              </span>
              <span className="text-[#0066cc] font-mono">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                PEOPLE
              </span>
              <span className="text-[#0066cc] font-mono">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                OPPORTUNITIES
              </span>
              <span className="text-[#0066cc] font-mono">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-xs">
                STARTUPS
              </span>
              <span className="text-[#0066cc] font-mono">→</span>
              <span className="px-3 py-1.5 rounded-xl bg-[#0066cc] text-white shadow-xs">
                NEW IDEAS
              </span>
            </div>
          </div>

          {/* Final Statement */}
          <div className="text-2xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight leading-snug mb-8">
            Discover Startups. <br />
            Find Opportunities. <br />
            <span className="text-[#0066cc]">Help Build What’s Next.</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-pill-primary px-7 py-3 text-base shadow-sm"
            >
              <span>Explore Neesh AI Platform</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>

            <a
              href="#feedback"
              className="apple-pill-secondary px-7 py-3 text-base"
            >
              <span>Submit Pilot Work & Feedback</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
