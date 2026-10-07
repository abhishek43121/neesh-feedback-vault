import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

function getSessionConfig() {
  return {
    password: process.env["SESSION_SECRET"] ?? "",
    name: "neesh-pilot-founder-session",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
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

const trimmedText = (max: number) => z.string().trim().max(max);
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || z.string().url().safeParse(value).success, "Enter a valid link");

const submissionSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
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
  overall_score: z.number().int().min(1).max(5),
  clarity_score: z.number().int().min(1).max(5),
  usability_score: z.number().int().min(1).max(5),
  onboarding_score: z.number().int().min(1).max(5),
  spotlight_score: z.number().int().min(1).max(5),
  pitch_score: z.number().int().min(1).max(5),
  ai_score: z.number().int().min(1).max(5),
  valuable_part: z.string().trim().min(1).max(3000),
  frustrating_part: trimmedText(3000),
  confusing_part: trimmedText(3000),
  missing_feature: trimmedText(3000),
  improvement: trimmedText(3000),
  brutal_feedback: trimmedText(3000),
  discovery_answer: z.enum(["Yes", "Somewhat", "No"]),
  discovery_detail: trimmedText(3000),
  recommendation: z.enum(["Definitely", "Probably", "Maybe", "Probably not", "Definitely not"]),
  reuse_intent: z.enum(["Yes", "Maybe", "No"]),
  what_tested: z.array(z.string().trim().min(1).max(80)).max(20),
  spotlight_url: optionalUrl,
  pitch_url: optionalUrl,
  project_url: optionalUrl,
  website_url: optionalUrl,
  project_stage: trimmedText(40),
});

export const submitPilotFeedback = createServerFn({ method: "POST" })
  .inputValidator((input) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("pilot_profiles")
      .upsert(
        {
          full_name: data.full_name,
          email: data.email.toLowerCase(),
          whatsapp: data.whatsapp,
          profession: data.profession,
          company: data.company,
          pilot_role: data.pilot_role,
          startup_name: data.startup_name,
          linkedin_url: data.linkedin_url,
          location: data.location,
          experience: data.experience,
          why_joined: data.why_joined,
          expectations: data.expectations,
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (profileError || !profile) throw new Error("We couldn't save your details. Please try again.");

    const { error: feedbackError } = await supabaseAdmin.from("pilot_feedback").insert({
      profile_id: profile.id,
      overall_score: data.overall_score,
      clarity_score: data.clarity_score,
      usability_score: data.usability_score,
      onboarding_score: data.onboarding_score,
      spotlight_score: data.spotlight_score,
      pitch_score: data.pitch_score,
      ai_score: data.ai_score,
      valuable_part: data.valuable_part,
      frustrating_part: data.frustrating_part,
      confusing_part: data.confusing_part,
      missing_feature: data.missing_feature,
      improvement: data.improvement,
      brutal_feedback: data.brutal_feedback,
      discovery_answer: data.discovery_answer,
      discovery_detail: data.discovery_detail,
      recommendation: data.recommendation,
      reuse_intent: data.reuse_intent,
      what_tested: data.what_tested,
      spotlight_url: data.spotlight_url,
      pitch_url: data.pitch_url,
      project_url: data.project_url,
      website_url: data.website_url,
      project_stage: data.project_stage,
    });

    if (feedbackError) throw new Error("Your details were saved, but we couldn't save your feedback. Please try again.");
    return { ok: true as const };
  });

export const unlockFounderDashboard = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ password: z.string().min(1).max(128) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"];
    if (!expected || !process.env["SESSION_SECRET"]) throw new Error("Founder access is not configured.");
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

export const getFounderDashboard = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await isFounderUnlocked())) return { authorized: false as const, profiles: [] };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("pilot_feedback")
    .select("*, pilot_profiles(*)")
    .order("submitted_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error("We couldn't load pilot feedback right now.");
  return { authorized: true as const, profiles: data ?? [] };
});