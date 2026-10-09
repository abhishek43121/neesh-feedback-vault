import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP, useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

function getSessionConfig() {
  return {
    password: process.env["SESSION_SECRET"] || "neesh-ai-2-0-founding-pilot-session-secret-at-least-32-chars-long",
    name: "neesh-pilot-founder-session",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: process.env["NODE_ENV"] === "production", sameSite: "lax" as const, path: "/" },
  };
}

type FounderSession = { unlocked?: boolean };

function passwordMatches(input: string, expected: string): boolean {
  const submitted = createHash("sha256").update(input, "utf8").digest();
  const stored = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(submitted, stored);
}

async function isFounderUnlocked() {
  const session = await useSession<FounderSession>(getSessionConfig());
  return session.data.unlocked === true;
}

const trimmedText = (max: number) =>
  z
    .string()
    .nullish()
    .transform((val) => (val ? String(val).trim().slice(0, max) : ""));

const optionalUrl = z
  .string()
  .nullish()
  .transform((val) => (val ? String(val).trim().slice(0, 500) : ""));

const submissionSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  whatsapp: trimmedText(40),
  profession: trimmedText(120),
  company: trimmedText(160),
  pilot_role: trimmedText(40),
  startup_name: trimmedText(160),
  linkedin_url: optionalUrl,
  location: trimmedText(160),
  experience: trimmedText(80),
  why_joined: trimmedText(1200),
  expectations: trimmedText(1200),
  overall_score: z.coerce.number().int().min(1).max(5).default(5),
  clarity_score: z.coerce.number().int().min(1).max(5).default(5),
  usability_score: z.coerce.number().int().min(1).max(5).default(5),
  onboarding_score: z.coerce.number().int().min(1).max(5).default(5),
  spotlight_score: z.coerce.number().int().min(1).max(5).default(5),
  pitch_score: z.coerce.number().int().min(1).max(5).default(5),
  ai_score: z.coerce.number().int().min(1).max(5).default(5),
  valuable_part: z
    .string()
    .nullish()
    .transform((val) => (val && String(val).trim() ? String(val).trim().slice(0, 3000) : "Founding pilot feedback submitted")),
  frustrating_part: trimmedText(3000),
  confusing_part: trimmedText(3000),
  missing_feature: trimmedText(3000),
  improvement: trimmedText(3000),
  brutal_feedback: trimmedText(3000),
  discovery_answer: z
    .string()
    .nullish()
    .transform((val) => (val === "Somewhat" || val === "No" ? val : "Yes")),
  discovery_detail: trimmedText(3000),
  recommendation: z
    .string()
    .nullish()
    .transform((val) => (val ? String(val).trim() : "Definitely")),
  reuse_intent: z
    .string()
    .nullish()
    .transform((val) => (val ? String(val).trim() : "Yes")),
  what_tested: z
    .array(z.string().trim())
    .nullish()
    .transform((val) => (val && val.length > 0 ? val : ["Pilot Testing"])),
  spotlight_url: optionalUrl,
  pitch_url: optionalUrl,
  project_url: optionalUrl,
  website_url: optionalUrl,
  project_stage: trimmedText(40),
});

export const submitPilotFeedback = createServerFn({ method: "POST" })
  .validator((input) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    console.log("[submitPilotFeedback] Processing feedback for:", data.email);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("pilot_profiles")
      .upsert(
        {
          full_name: data.full_name,
          email: data.email.toLowerCase(),
          whatsapp: data.whatsapp || "",
          profession: data.profession || "",
          company: data.company || "",
          pilot_role: data.pilot_role || "",
          startup_name: data.startup_name || "",
          linkedin_url: data.linkedin_url || "",
          location: data.location || "",
          experience: data.experience || "",
          why_joined: data.why_joined || "",
          expectations: data.expectations || "",
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (profileError || !profile) {
      console.error("[submitPilotFeedback profileError]", profileError);
      throw new Error(`Profile save failed: ${profileError?.message || "Unknown error"}`);
    }

    const { data: fbData, error: feedbackError } = await supabaseAdmin
      .from("pilot_feedback")
      .insert({
        profile_id: profile.id,
        overall_score: data.overall_score,
        clarity_score: data.clarity_score,
        usability_score: data.usability_score,
        onboarding_score: data.onboarding_score,
        spotlight_score: data.spotlight_score,
        pitch_score: data.pitch_score,
        ai_score: data.ai_score,
        valuable_part: data.valuable_part || "Founding pilot feedback submitted",
        frustrating_part: data.frustrating_part || "",
        confusing_part: data.confusing_part || "",
        missing_feature: data.missing_feature || "",
        improvement: data.improvement || "",
        brutal_feedback: data.brutal_feedback || "",
        discovery_answer: data.discovery_answer as "Yes" | "Somewhat" | "No",
        discovery_detail: data.discovery_detail || "",
        recommendation: data.recommendation || "Definitely",
        reuse_intent: data.reuse_intent || "Yes",
        what_tested: data.what_tested,
        spotlight_url: data.spotlight_url || "",
        pitch_url: data.pitch_url || "",
        project_url: data.project_url || "",
        website_url: data.website_url || "",
        project_stage: data.project_stage || "",
      })
      .select("id")
      .single();

    if (feedbackError) {
      console.error("[submitPilotFeedback feedbackError]", feedbackError);
      throw new Error(`Feedback save failed: ${feedbackError.message}`);
    }

    console.log("[submitPilotFeedback SUCCESS] Saved feedback record:", fbData?.id);
    return { ok: true as const, id: fbData?.id };
  });

const quickReportSchema = z.object({
  name: z.string().trim().max(120).default("Pilot Tester"),
  contact: z.string().trim().max(255).default("anonymous@pilot.neesh.ai"),
  category: z.string().trim().max(80).default("Bug / Quick Note"),
  message: z.string().trim().min(1).max(3000),
  detail: z.string().trim().max(3000).optional(),
});

export const submitQuickReport = createServerFn({ method: "POST" })
  .validator((input) => quickReportSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isEmail = data.contact.includes("@");
    const email = isEmail ? data.contact.toLowerCase() : `tester-${Date.now()}@pilot.neesh.ai`;
    const contactValue = data.contact && data.contact !== "Anonymous Tester" ? data.contact : "";

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("pilot_profiles")
      .upsert(
        {
          full_name: data.name && data.name !== "Pilot Tester" ? data.name : "Bug / Feedback Tester",
          email,
          whatsapp: !isEmail ? contactValue : "",
          profession: "Tester",
          pilot_role: "Bug Reporter",
          company: data.category,
          startup_name: data.category,
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (profileErr) {
      console.error("[submitQuickReport profileErr]", profileErr);
    }

    if (profile?.id) {
      const { error: insertErr } = await supabaseAdmin.from("pilot_feedback").insert({
        profile_id: profile.id,
        overall_score: 5,
        clarity_score: 5,
        usability_score: 5,
        onboarding_score: 5,
        spotlight_score: 5,
        pitch_score: 5,
        ai_score: 5,
        valuable_part: `[${data.category.toUpperCase()}] ${data.message}`,
        frustrating_part: data.message,
        confusing_part: data.detail || "",
        missing_feature: data.category === "Feature Request" ? data.message : "",
        brutal_feedback: data.detail || "",
        discovery_answer: "Yes",
        recommendation: "Definitely",
        reuse_intent: "Yes",
        what_tested: [data.category, "Quick Feedback"],
        project_stage: data.category,
      });

      if (insertErr) {
        console.error("[submitQuickReport insertErr]", insertErr);
      }
    }

    return { ok: true as const };
  });

export const unlockFounderDashboard = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ password: z.string().min(1).max(128) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"] || "21062001";
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<FounderSession>(getSessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockFounderDashboard = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<FounderSession>(getSessionConfig());
  await session.clear();
  return { ok: true as const };
});

function parseUserAgent(ua: string): string {
  if (!ua) return "Unknown Device";
  let os = "Desktop";
  if (/android/i.test(ua)) os = "Android";
  else if (/iphone/i.test(ua)) os = "iPhone";
  else if (/ipad/i.test(ua)) os = "iPad";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";

  return `${browser} on ${os}`;
}

export const getFounderDashboard = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await isFounderUnlocked())) {
    return { authorized: false as const, profiles: [], registeredMembers: [] };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // 1. Fetch all feedback, bugs, and visitor logs
  const { data: feedbackData, error: feedbackError } = await supabaseAdmin
    .from("pilot_feedback")
    .select("*, pilot_profiles(*)")
    .order("submitted_at", { ascending: false })
    .limit(2000);

  if (feedbackError) {
    console.error("[getFounderDashboard feedbackError]", feedbackError);
    throw new Error("We couldn't load pilot feedback right now.");
  }

  // 2. Fetch full registered pilot founders roster
  const { data: memberProfiles, error: memberError } = await supabaseAdmin
    .from("pilot_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (memberError) {
    console.error("[getFounderDashboard memberProfiles error]", memberError);
  }

  return {
    authorized: true as const,
    profiles: feedbackData ?? [],
    registeredMembers: memberProfiles ?? [],
  };
});

const pilotRegistrationSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(120),
  startup_name: z.string().trim().min(1, "Please enter your startup name").max(160),
  phone: z.string().trim().min(1, "Please enter your phone number").max(40),
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

export const registerPilotMember = createServerFn({ method: "POST" })
  .validator((input: unknown) => pilotRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    console.log("[registerPilotMember] Registering pilot member:", data.email);

    const { data: profile, error } = await supabaseAdmin
      .from("pilot_profiles")
      .upsert(
        {
          full_name: data.full_name,
          email: data.email.toLowerCase(),
          whatsapp: data.phone,
          startup_name: data.startup_name,
          company: data.startup_name,
          pilot_role: "Founding Pilot Member",
          profession: "Founder",
        },
        { onConflict: "email" },
      )
      .select("id, full_name, email, whatsapp, startup_name, created_at")
      .single();

    if (error || !profile) {
      console.error("[registerPilotMember error]", error);
      throw new Error(`Registration failed: ${error?.message || "Unknown error"}`);
    }

    return {
      ok: true as const,
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.whatsapp,
        startup_name: profile.startup_name,
      },
    };
  });

const pageViewSchema = z.object({
  visitor_id: z.string().trim().max(100),
  path: z.string().trim().max(300).default("/"),
  referrer: z.string().trim().max(500).nullish(),
  member_email: z.string().trim().email().nullish(),
  member_name: z.string().trim().max(120).nullish(),
  member_startup: z.string().trim().max(160).nullish(),
  member_phone: z.string().trim().max(40).nullish(),
  screen_width: z.number().nullish(),
  screen_height: z.number().nullish(),
  timezone: z.string().trim().max(80).nullish(),
});

export const trackPageView = createServerFn({ method: "POST" })
  .validator((input: unknown) => pageViewSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

      let ip = "";
      let country = "";
      let city = "";
      let userAgent = "";
      try {
        ip =
          getRequestIP() ||
          getRequestHeader("x-nf-client-connection-ip") ||
          getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
          "";
        country =
          getRequestHeader("x-country") ||
          getRequestHeader("cf-ipcountry") ||
          getRequestHeader("x-nf-country") ||
          "";
        city = getRequestHeader("x-city") || getRequestHeader("x-nf-subdivision") || "";
        userAgent = getRequestHeader("user-agent") || "";
      } catch {
        // ignore header retrieval errors
      }

      const deviceInfo = parseUserAgent(userAgent);
      const isRegistered = Boolean(data.member_email);

      let profileId: string | null = null;
      const memberName = data.member_name || "";
      const memberEmail = data.member_email || "";
      const memberStartup = data.member_startup || "";

      if (isRegistered && memberEmail) {
        const { data: existing } = await supabaseAdmin
          .from("pilot_profiles")
          .select("id, full_name, email, startup_name, whatsapp")
          .eq("email", memberEmail.toLowerCase())
          .maybeSingle();

        if (existing) {
          profileId = existing.id;
          await supabaseAdmin
            .from("pilot_profiles")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          const { data: created } = await supabaseAdmin
            .from("pilot_profiles")
            .upsert(
              {
                full_name: memberName || "Founding Member",
                email: memberEmail.toLowerCase(),
                whatsapp: data.member_phone || "",
                startup_name: memberStartup || "Neesh Pilot",
                company: memberStartup || "Neesh Pilot",
                pilot_role: "Founding Pilot Member",
                profession: "Founder",
                location: [city, country].filter(Boolean).join(", "),
              },
              { onConflict: "email" },
            )
            .select("id")
            .maybeSingle();
          profileId = created?.id || null;
        }
      } else {
        const anonEmail = `visitor-${data.visitor_id.slice(0, 16).toLowerCase()}@pilot.neesh.ai`;
        const anonName = `Visitor (${country || "Web"} · ${deviceInfo})`;

        const { data: anonProfile } = await supabaseAdmin
          .from("pilot_profiles")
          .upsert(
            {
              email: anonEmail,
              full_name: anonName,
              startup_name: deviceInfo,
              company: country || "Online",
              pilot_role: "Website Visitor",
              profession: "Visitor",
              location: [city, country].filter(Boolean).join(", "),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "email" },
          )
          .select("id")
          .maybeSingle();

        profileId = anonProfile?.id || null;
      }

      if (profileId) {
        await supabaseAdmin.from("pilot_feedback").insert({
          profile_id: profileId,
          overall_score: 5,
          clarity_score: 5,
          usability_score: 5,
          onboarding_score: 5,
          spotlight_score: 5,
          pitch_score: 5,
          ai_score: 5,
          valuable_part: `[PAGE_VIEW] ${data.path}`,
          frustrating_part: `IP: ${ip || "—"} | Location: ${[city, country].filter(Boolean).join(", ") || "Unknown"} | TZ: ${data.timezone || "—"} | Screen: ${data.screen_width || "—"}x${data.screen_height || "—"}`,
          confusing_part: userAgent,
          missing_feature: data.visitor_id,
          improvement: deviceInfo,
          discovery_answer: "Yes",
          recommendation: "Definitely",
          reuse_intent: "Yes",
          website_url: data.referrer || "Direct",
          what_tested: ["PageView", data.path],
          project_stage: isRegistered ? "Member Visit" : "Visitor Activity",
          submitted_at: new Date().toISOString(),
        });
      }

      return { ok: true as const };
    } catch (err) {
      console.error("[trackPageView error]", err);
      return { ok: false as const };
    }
  });