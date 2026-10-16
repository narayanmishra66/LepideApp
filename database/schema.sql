BEGIN;

CREATE TABLE IF NOT EXISTS public.app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  company text NOT NULL CHECK (char_length(company) BETWEEN 1 AND 100),
  email text NOT NULL UNIQUE CHECK (char_length(email) <= 254 AND email = lower(email)),
  password_hash text NOT NULL,
  terms_accepted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Only the trusted database connection on the Node server accesses credentials.
-- No browser/API role can read or write this table, including password hashes.
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.app_users FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.app_sessions (
  sid varchar PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS app_sessions_expire_idx ON public.app_sessions (expire);
ALTER TABLE public.app_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.app_sessions FROM PUBLIC, anon, authenticated, service_role;

COMMIT;