import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Download, LockKeyhole, Sparkles } from "lucide-react";
import founderPhoto from "@/assets/neesh-pilot-founder.jpg";
import guideAsset from "@/assets/neesh-guide.pdf.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitPilotFeedback } from "@/lib/pilot.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neesh AI 2.0 — Founding Pilot" },
      { name: "description", content: "Share honest feedback and help shape Neesh AI 2.0 before launch." },
      { property: "og:title", content: "Neesh AI 2.0 — Founding Pilot" },
      { property: "og:description", content: "You are getting access before everyone else." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PilotHome,
});

const ratingLabels = ["Not at all", "A little", "Somewhat", "Very", "Extremely"];
const ratingQuestions = [
  ["overall_score", "Overall experience", "How would you rate your experience?"],
  ["clarity_score", "Clarity", "How clearly did you understand what Neesh is?"],
  ["usability_score", "Ease of use", "How easy was Neesh to use?"],
  ["onboarding_score", "Getting started", "How easy was it to get started?"],
  ["spotlight_score", "Spotlight", "How useful was the Spotlight experience?"],
  ["pitch_score", "Elevator pitch", "How useful was the Elevator Pitch experience?"],
  ["ai_score", "AI interaction", "How useful was the AI interaction?"],
] as const;

const testedItems = ["Onboarding", "Project creation", "Spotlight", "Elevator Pitch", "AI Chatbot", "Discovery", "Feedback system", "Other"];

function PilotHome() {
  const submit = useServerFn(submitPilotFeedback);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "");
    const score = (key: string) => Number(text(key));
    try {
      await submit({
        data: {
          full_name: text("full_name"), email: text("email"), whatsapp: text("whatsapp"),
          profession: text("profession"), company: text("company"), pilot_role: text("pilot_role"),
          startup_name: text("startup_name"), linkedin_url: text("linkedin_url"), location: text("location"),
          experience: text("experience"), why_joined: text("why_joined"), expectations: text("expectations"),
          overall_score: score("overall_score"), clarity_score: score("clarity_score"),
          usability_score: score("usability_score"), onboarding_score: score("onboarding_score"),
          spotlight_score: score("spotlight_score"), pitch_score: score("pitch_score"), ai_score: score("ai_score"),
          valuable_part: text("valuable_part"), frustrating_part: text("frustrating_part"),
          confusing_part: text("confusing_part"), missing_feature: text("missing_feature"),
          improvement: text("improvement"), brutal_feedback: text("brutal_feedback"),
          discovery_answer: text("discovery_answer") as "Yes" | "Somewhat" | "No",
          discovery_detail: text("discovery_detail"),
          recommendation: text("recommendation") as "Definitely" | "Probably" | "Maybe" | "Probably not" | "Definitely not",
          reuse_intent: text("reuse_intent") as "Yes" | "Maybe" | "No",
          what_tested: form.getAll("what_tested").map(String),
          spotlight_url: text("spotlight_url"), pitch_url: text("pitch_url"),
          project_url: text("project_url"), website_url: text("website_url"), project_stage: text("project_stage"),
        },
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We couldn't send your feedback. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Neesh AI 2.0 home"><span className="brand-mark">N</span><span>neesh <b>AI</b></span></a>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="#overview">Overview</a><a href="#guide">Platform guide</a><a href="#feedback">Your feedback</a>
        </nav>
        <Button asChild variant="outline" size="sm" className="nav-2-button"><a href="/admin"><LockKeyhole /> 2.0</a></Button>
      </header>

      <section className="intro-band" id="top">
        <div className="intro-inner">
          <div className="intro-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> FOUNDING PILOT • EARLY ACCESS • PRIVATE BETA</div>
            {submitted ? (
              <div className="success-intro" role="status"><div className="success-icon"><Check /></div><h1>Thank you for shaping what comes next.</h1><p>Your feedback is safely with the Neesh AI team. We’ll use it to decide what to improve next.</p><Button asChild variant="outline"><a href="#overview">Back to overview <ArrowRight /></a></Button></div>
            ) : <><h1>You are getting access<br />before everyone else.</h1><p className="intro-description">You've been selected to experience Neesh AI 2.0 before public launch. Your job isn't to tell us that the product is good. Your job is to tell us what actually works, what doesn't, what is confusing, and what would make Neesh genuinely useful.</p><div className="intro-actions"><Button asChild size="lg"><a href="#feedback">Share your feedback <ArrowDown /></a></Button><a className="text-link" href="#guide">Read the platform guide <ArrowUpRight /></a></div></>}
            <div className="pilot-notes"><span><i /> Private to the Neesh AI team</span><span><Sparkles /> Your input shapes what we build</span></div>
          </div>
          <div className="intro-visual"><img src={founderPhoto} alt="Founder thinking through a startup idea at a laptop" width={1536} height={1024} fetchPriority="high" /><div className="visual-caption"><span className="caption-line" /><div><b>Built with founders, not assumptions.</b><small>Every honest answer moves the product forward.</small></div></div></div>
        </div>
      </section>

      <section className="overview-section" id="overview">
        <div className="content-wrap overview-grid">
          <div className="section-heading"><span className="section-kicker">A NOTE FROM THE TEAM</span><h2>Your perspective matters more than praise.</h2></div>
          <div className="overview-body"><p>We’re still building Neesh AI 2.0. This is your space to tell us what works, what gets in the way, and where the product feels unclear—without polishing your answers.</p><p>Share the rough edges. Tell us what you expected. If something felt useful, tell us why. Your feedback is private and can only be viewed by the Neesh AI team.</p><div className="steps-line"><div><span>01</span><b>Explore</b><small>Use the real product</small></div><div><span>02</span><b>Notice</b><small>Capture what happens</small></div><div><span>03</span><b>Shape</b><small>Tell us what to change</small></div></div></div>
        </div>
      </section>

      <section className="guide-strip" id="guide"><div className="content-wrap guide-inner"><div><span className="section-kicker">YOUR FIELD GUIDE</span><h2>Neesh AI 2.0, step by step.</h2><p>See the founder onboarding manual, from creating a workspace to sharing your Spotlight.</p></div><div className="guide-actions"><Button asChild variant="outline"><a href={guideAsset.url} target="_blank" rel="noreferrer"><Download /> Download founder guide</a></Button><a className="text-link" href="https://neesh-2-o.vercel.app" target="_blank" rel="noreferrer">Open Neesh AI 2.0 <ArrowUpRight /></a></div></div></section>

      <section className="feedback-section" id="feedback">
        <div className="content-wrap feedback-layout"><aside className="feedback-aside"><span className="section-kicker">PRIVATE PILOT RESPONSE</span><h2>Tell us what really happened.</h2><p>Specific details help us improve. You don’t need to make your answers sound positive.</p><div className="privacy-note"><LockKeyhole /><span><b>Your feedback stays private.</b><small>Only the Neesh AI team can see your responses and contact details.</small></span></div><div className="response-count"><span>01</span><p>One thoughtful response can change what gets built next.</p></div></aside>
          <form className="feedback-form" onSubmit={onSubmit}>
            <div className="form-topline"><span>FOUNDING PILOT</span><span>ALL FIELDS ARE OPTIONAL EXCEPT *</span></div>
            <fieldset className="form-block"><legend><span>01</span> About you</legend><p className="block-hint">A little context helps us understand different experiences.</p><div className="field-grid"><Field label="Full name *" name="full_name" required maxLength={120} /><Field label="Email address *" name="email" type="email" required maxLength={255} /><Field label="WhatsApp number" name="whatsapp" maxLength={40} /><Field label="Profession / role" name="profession" maxLength={120} /><Field label="Company or institution" name="company" maxLength={160} /><SelectField label="I am a…" name="pilot_role" options={["Founder", "Student", "Professional", "Investor", "Mentor", "Other"]} /><Field label="Startup / project" name="startup_name" maxLength={160} /><Field label="Location" name="location" maxLength={160} /><Field label="LinkedIn profile" name="linkedin_url" type="url" /><SelectField label="Experience" name="experience" options={["First-time founder", "Experienced founder", "Early career", "Mid-career", "Investor / advisor", "Other"]} /><TextField label="Why did you join the pilot?" name="why_joined" /><TextField label="What are you hoping Neesh can help you do?" name="expectations" /></div></fieldset>

            <fieldset className="form-block"><legend><span>02</span> Your experience</legend><p className="block-hint">Choose one answer for each. Your honest rating is what matters.</p><div className="ratings">{ratingQuestions.map(([name, label, question]) => <Rating key={name} name={name} label={label} question={question} />)}</div></fieldset>

            <fieldset className="form-block"><legend><span>03</span> What stood out?</legend><p className="block-hint">The details behind your ratings are the most useful part.</p><TextField label="What was the most valuable part of Neesh? *" name="valuable_part" required /><TextField label="What was the most frustrating part?" name="frustrating_part" /><TextField label="Where did you get stuck, confused, or unsure what to do next?" name="confusing_part" /><TextField label="What did you expect to find but couldn't?" name="missing_feature" /><TextField label="If you could change one thing, what would it be?" name="improvement" /><TextField label="What would make you NOT use Neesh again?" name="brutal_feedback" /></fieldset>

            <fieldset className="form-block"><legend><span>04</span> The question we care about most</legend><p className="featured-question">Did Neesh tell you, show you, or help you discover something you didn't already know?</p><div className="choice-row">{["Yes", "Somewhat", "No"].map((value) => <label className="choice-chip" key={value}><input type="radio" name="discovery_answer" value={value} required /><span>{value}</span></label>)}</div><TextField label="Tell us what happened" name="discovery_detail" /></fieldset>

            <fieldset className="form-block"><legend><span>05</span> Where you got to</legend><p className="block-hint">Select what you tried and add any links you’d like us to see.</p><div className="check-grid">{testedItems.map((item) => <label className="check-item" key={item}><input type="checkbox" name="what_tested" value={item} /><span>{item}</span></label>)}</div><div className="field-grid link-fields"><Field label="Spotlight link" name="spotlight_url" type="url" /><Field label="Elevator Pitch link" name="pitch_url" type="url" /><Field label="Project / demo link" name="project_url" type="url" /><Field label="Website / app link" name="website_url" type="url" /><SelectField label="Project stage" name="project_stage" options={["Idea", "Concept", "Prototype", "MVP", "Early users", "Existing business"]} /><SelectField label="Would you recommend Neesh to another founder?" name="recommendation" options={["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"]} /><SelectField label="Would you use Neesh again?" name="reuse_intent" options={["Yes", "Maybe", "No"]} /></div></fieldset>

            {error && <p className="form-error" role="alert">{error}</p>}
            <div className="form-submit"><p><LockKeyhole /> Your response is private and only visible to the Neesh AI team.</p><Button type="submit" size="lg" disabled={busy}>{busy ? "Sending your feedback…" : "Send private feedback"}<ArrowRight /></Button></div>
          </form>
        </div>
      </section>

      <footer className="site-footer"><div className="content-wrap footer-inner"><a className="brand" href="#top"><span className="brand-mark">N</span><span>neesh <b>AI</b></span></a><span>Built for founders, with founders.</span><a className="text-link" href="/admin"><LockKeyhole /> Founder access</a></div></footer>
    </main>
  );
}

function Field({ label, name, type = "text", required = false, maxLength = 500 }: { label: string; name: string; type?: string; required?: boolean; maxLength?: number }) {
  return <label className="field"><span>{label}</span><Input name={name} type={type} required={required} maxLength={maxLength} /></label>;
}

function TextField({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return <label className="field field-wide"><span>{label}</span><Textarea name={name} required={required} maxLength={3000} rows={3} /></label>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label className="field"><span>{label}</span><select name={name} defaultValue=""><option value="">Select…</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function Rating({ name, label, question }: { name: string; label: string; question: string }) {
  return <fieldset className="rating-row"><legend><b>{label}</b><small>{question}</small></legend><div className="rating-options">{ratingLabels.map((rating, index) => <label key={index} title={rating}><input type="radio" name={name} value={index + 1} required /><span>{index + 1}</span></label>)}</div></fieldset>;
}