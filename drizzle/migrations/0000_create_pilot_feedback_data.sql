CREATE TABLE public.pilot_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  whatsapp VARCHAR(40) NOT NULL DEFAULT '',
  profession VARCHAR(120) NOT NULL DEFAULT '',
  company VARCHAR(160) NOT NULL DEFAULT '',
  pilot_role VARCHAR(40) NOT NULL DEFAULT '',
  startup_name VARCHAR(160) NOT NULL DEFAULT '',
  linkedin_url VARCHAR(500) NOT NULL DEFAULT '',
  location VARCHAR(160) NOT NULL DEFAULT '',
  experience VARCHAR(80) NOT NULL DEFAULT '',
  why_joined VARCHAR(1200) NOT NULL DEFAULT '',
  expectations VARCHAR(1200) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON TABLE public.pilot_profiles TO service_role;
ALTER TABLE public.pilot_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.pilot_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.pilot_profiles(id) ON DELETE CASCADE,
  overall_score SMALLINT NOT NULL CHECK (overall_score BETWEEN 1 AND 5),
  clarity_score SMALLINT NOT NULL CHECK (clarity_score BETWEEN 1 AND 5),
  usability_score SMALLINT NOT NULL CHECK (usability_score BETWEEN 1 AND 5),
  onboarding_score SMALLINT NOT NULL CHECK (onboarding_score BETWEEN 1 AND 5),
  spotlight_score SMALLINT NOT NULL CHECK (spotlight_score BETWEEN 1 AND 5),
  pitch_score SMALLINT NOT NULL CHECK (pitch_score BETWEEN 1 AND 5),
  ai_score SMALLINT NOT NULL CHECK (ai_score BETWEEN 1 AND 5),
  valuable_part VARCHAR(3000) NOT NULL,
  frustrating_part VARCHAR(3000) NOT NULL DEFAULT '',
  confusing_part VARCHAR(3000) NOT NULL DEFAULT '',
  missing_feature VARCHAR(3000) NOT NULL DEFAULT '',
  improvement VARCHAR(3000) NOT NULL DEFAULT '',
  brutal_feedback VARCHAR(3000) NOT NULL DEFAULT '',
  discovery_answer VARCHAR(20) NOT NULL CHECK (discovery_answer IN ('Yes', 'Somewhat', 'No')),
  discovery_detail VARCHAR(3000) NOT NULL DEFAULT '',
  recommendation VARCHAR(30) NOT NULL DEFAULT '',
  reuse_intent VARCHAR(20) NOT NULL DEFAULT '',
  what_tested TEXT[] NOT NULL DEFAULT '{}',
  spotlight_url VARCHAR(500) NOT NULL DEFAULT '',
  pitch_url VARCHAR(500) NOT NULL DEFAULT '',
  project_url VARCHAR(500) NOT NULL DEFAULT '',
  website_url VARCHAR(500) NOT NULL DEFAULT '',
  project_stage VARCHAR(40) NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON TABLE public.pilot_feedback TO service_role;
ALTER TABLE public.pilot_feedback ENABLE ROW LEVEL SECURITY;
CREATE INDEX pilot_feedback_profile_id_idx ON public.pilot_feedback(profile_id);
CREATE INDEX pilot_feedback_submitted_at_idx ON public.pilot_feedback(submitted_at DESC);