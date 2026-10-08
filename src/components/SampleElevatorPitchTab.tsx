import { useState, useRef } from "react";
import {
  Play,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check,
  Video,
  Radio,
  RotateCcw,
  Compass,
  ArrowUpRight,
} from "lucide-react";

interface SampleElevatorPitchTabProps {
  pitchUrl?: string;
}

export function SampleElevatorPitchTab({
  pitchUrl = "https://neesh-2-o.vercel.app/p/neesh-ai-2ca678d8-de9c-4116-99ad-b46b3e2a76d6",
}: SampleElevatorPitchTabProps) {
  const [activeTab, setActiveTab] = useState<"screen" | "breakdown" | "record">("screen");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc =
    "https://qqmxnldyocsennypnbic.supabase.co/storage/v1/object/public/blog-media/pitches/2ca678d8-de9c-4116-99ad-b46b3e2a76d6/pitch-1791138502294.mp4";
  const posterSrc =
    "https://qqmxnldyocsennypnbic.supabase.co/storage/v1/object/public/blog-media/2ca678d8-de9c-4116-99ad-b46b3e2a76d6/cover/1791098612849-p17ds8.webp";

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      void videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    void videoRef.current.play();
    setIsPlaying(true);
    setHasStarted(true);
  };

  return (
    <div className="mb-14 rounded-3xl bg-white border border-[#d2d2d7] shadow-lg overflow-hidden transition-all duration-300">
      {/* Top Banner Header */}
      <div className="px-5 py-3.5 bg-[#fbfbfd] border-b border-[#e5e5ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0066cc]">
                SAMPLE ELEVATOR PITCH
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                Live Spotlight
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[#1d1d1f]">
              Watch how a Neesh AI 2.0 Spotlight presents an idea in 45 seconds
            </h3>
          </div>
        </div>

        {/* Outer Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[#f0f0f2] p-1 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("screen")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "screen"
                ? "bg-white text-[#1d1d1f] font-semibold shadow-xs"
                : "text-gray-600 hover:text-[#1d1d1f]"
            }`}
          >
            Sample Elevator Pitch
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("breakdown")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "breakdown"
                ? "bg-white text-[#1d1d1f] font-semibold shadow-xs"
                : "text-gray-600 hover:text-[#1d1d1f]"
            }`}
          >
            Pitch Blueprint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("record")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "record"
                ? "bg-white text-[#1d1d1f] font-semibold shadow-xs"
                : "text-gray-600 hover:text-[#1d1d1f]"
            }`}
          >
            How to Record Yours
          </button>
        </div>
      </div>

      {/* Tab 1: Live Interactive Screen (Side-by-Side Fit Layout) */}
      {activeTab === "screen" && (
        <div className="p-3 sm:p-5 bg-[#f5f5f7]">
          {/* Mac Browser Frame */}
          <div className="rounded-2xl bg-[#0a0f1d] border border-[#d2d2d7] shadow-md overflow-hidden">
            {/* Browser Top Chrome */}
            <div className="px-4 py-2.5 bg-[#161b26] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>

              {/* URL Bar */}
              <div className="flex-1 max-w-xl mx-auto flex items-center justify-between px-3 py-1 rounded-lg bg-black/60 border border-white/15 text-xs font-mono text-gray-200">
                <span className="truncate pr-2">{pitchUrl}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Top Chrome Direct Action */}
              <a
                href={pitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#0066cc] text-white hover:bg-[#0071e3] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <span>Open Spotlight</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Live Interactive Screen Content (Side-by-side grid: Everything fits!) */}
            <div className="p-4 sm:p-6 bg-gradient-to-br from-[#0a0f1d] via-[#101726] to-[#0d1322] text-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* Left Column: Playable 16:9 Elevator Pitch Video */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      poster={posterSrc}
                      playsInline
                      controls={hasStarted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full h-full object-cover"
                    />

                    {/* Big Play Overlay (shown before playback starts or when paused) */}
                    {!isPlaying && (
                      <div
                        onClick={togglePlay}
                        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/35"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0066cc]/95 hover:bg-[#0071e3] text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-transform mb-3">
                          <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white ml-1" />
                        </div>
                        <span className="text-sm font-semibold tracking-wide text-white drop-shadow">
                          {hasStarted ? "Resume Pitch" : "Play Sample Elevator Pitch"}
                        </span>
                        <span className="text-xs text-gray-300 mt-1">45 seconds • Neesh AI 2.0</span>
                      </div>
                    )}

                    {/* Custom Overlay Quick Controls */}
                    {hasStarted && (
                      <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
                        <button
                          type="button"
                          onClick={handleRestart}
                          className="text-white/80 hover:text-white p-1"
                          title="Replay from start"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="text-white/80 hover:text-white p-1"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Compact video info footer */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Original Video Demo • 45 Seconds
                    </span>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="text-xs text-[#2997ff] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isPlaying ? "Pause video" : "Play video"}
                    </button>
                  </div>
                </div>

                {/* Right Column: Full Elevator Pitch Details & Prominent Open Spotlight Option */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-white/[0.04] p-5 sm:p-6 rounded-2xl border border-white/10">
                  <div>
                    {/* Meta Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-[#2997ff] border border-blue-400/30 flex items-center gap-1.5">
                        <Radio className="w-2.5 h-2.5 text-[#2997ff] animate-pulse" />
                        Neesh AI Spotlight
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">ID: neesh-ai-2ca678d8</span>
                    </div>

                    {/* Headline */}
                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                      Neesh AI
                    </h4>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-400/20">
                        SaaS
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-500/20 text-gray-300 border border-gray-400/20">
                        Stage: PRE_MVP
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-400/20">
                        45s Pitch
                      </span>
                    </div>

                    {/* Core Pitch Quote */}
                    <blockquote className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed italic border-l-2 border-[#0066cc] pl-3 py-1 mb-3 bg-white/[0.02] rounded-r-lg">
                      “Neesh AI brings founders, investors, customers, talent, mentors, and opportunities into one startup ecosystem.”
                    </blockquote>

                    {/* Problem & Solution Summary */}
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      Transforms raw notes into an interactive Spotlight with a 24/7 AI chatbot that answers questions, detects visitor doubts, and validates market demand before building.
                    </p>
                  </div>

                  {/* ACTION SECTION: Prominent Open Spotlight Button */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <a
                      href={pitchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#0066cc] hover:bg-[#0071e3] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Open Spotlight on Neesh AI</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-gray-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? "Copied!" : "Copy Spotlight Link"}</span>
                      </button>

                      <a
                        href={pitchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-gray-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in New Tab</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Quick Explorer Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white font-medium flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#2997ff]" /> Explore Related:
                  </span>
                  <a
                    href="https://neesh-2-o.vercel.app/ideas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2997ff] underline"
                  >
                    Ideas Directory ↗
                  </a>
                  <span>•</span>
                  <a
                    href="https://neesh-2-o.vercel.app/space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2997ff] underline"
                  >
                    Pitch Reels Space ↗
                  </a>
                </div>

                <span className="text-[11px] text-gray-400 truncate max-w-sm">
                  {pitchUrl}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pitch Breakdown */}
      {activeTab === "breakdown" && (
        <div className="p-6 sm:p-8 bg-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-mono font-semibold text-[#0066cc] uppercase tracking-wider block mb-1">
                45-SECOND ELEVATOR PITCH BLUEPRINT
              </span>
              <h4 className="text-xl font-bold text-[#1d1d1f]">
                How to structure your pitch for maximum conviction
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-gray-100">
                <span className="text-xs font-bold text-[#0066cc] font-mono block mb-1">
                  0:00 - 0:10 • THE HOOK & PAIN
                </span>
                <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                  Start with the acute bottleneck. Why do founders fail? Because they build in isolation and pitch to empty rooms.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-gray-100">
                <span className="text-xs font-bold text-[#0066cc] font-mono block mb-1">
                  0:10 - 0:25 • THE PRODUCT SOLUTION
                </span>
                <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                  Neesh AI turns your ideas into interactive Spotlights with a 24/7 conversational agent and live signal tracking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-gray-100">
                <span className="text-xs font-bold text-[#0066cc] font-mono block mb-1">
                  0:25 - 0:35 • AUDIENCE EXCITEMENT
                </span>
                <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                  Early adopters test your demo, ask unvarnished questions, and express interest in pilot programs or investment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fbfbfd] border border-gray-100">
                <span className="text-xs font-bold text-[#0066cc] font-mono block mb-1">
                  0:35 - 0:45 • THE CALL TO ACTION
                </span>
                <p className="text-xs sm:text-sm text-[#424245] leading-relaxed">
                  Direct invitation: join the pilot cohort, explore the Spotlight, or submit private feedback to shape the product.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: How to Record Yours */}
      {activeTab === "record" && (
        <div className="p-6 sm:p-8 bg-white">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-xs font-mono font-semibold text-[#0066cc] uppercase tracking-wider block mb-1">
                PLATFORM INSTRUCTION
              </span>
              <h4 className="text-xl font-bold text-[#1d1d1f]">
                Record your Elevator Pitch on Neesh AI in 3 minutes
              </h4>
            </div>

            <ol className="space-y-3 text-sm text-[#424245]">
              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbfbfd] border border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Launch Neesh AI & create your project:</strong> Open <a href="https://neesh-2-o.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] underline">neesh-2-o.vercel.app</a> and create or select your project.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbfbfd] border border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong>Navigate to the Elevator Pitch tab:</strong> Click "Elevator Pitch" in your project sidebar.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbfbfd] border border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong>Record or paste your video link:</strong> Record directly via your browser webcam/microphone or paste an unlisted video/Loom URL.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fbfbfd] border border-gray-100">
                <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong>Copy your public pitch link:</strong> Copy the link (formatted as <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">https://neesh-2-o.vercel.app/p/...</code>) and submit it in the Feedback section below!
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
