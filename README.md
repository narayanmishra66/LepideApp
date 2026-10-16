# Lepidus workspace

Responsive home, login, and signup pages built with **Node.js, Express, EJS, and Bootstrap 5’s grid**, following the supplied Lepidus design contract. Plain HTML, no React, no third-party component replacements.

## Run

Requires Node.js 22.19+ or 24.4+ (the asset downloader uses the system certificate store).

1. Install dependencies with `npm install`.
2. Download official design-system assets with `npm run assets`.
3. Configure the environment variables described below.
4. Start with `npm start`, then open http://localhost:3001.

Use `npm run dev` for Node’s watch mode. `PORT` defaults to 3001 to avoid a local Windows service using port 3000. No test scripts have been added or run for this integration.

## Direct PostgreSQL setup (no Supabase Auth)

Supabase is used only to host PostgreSQL. New registrations go to **Table Editor → public → app_users**, not Authentication → Users. Existing Supabase Auth accounts are not copied or deleted; register again to create a custom database account.

- `DATABASE_URL`: private **Session pooler** PostgreSQL connection string from the project's **Connect** dialog. Include the actual project username, password, and pooler host on port 5432. Do not use a hostname such as `hidden`, a placeholder, or the HTTPS project API URL. URL-encode reserved characters in the password; remove placeholder brackets unless they genuinely form part of the password.
- `SESSION_SECRET`: strong server-only secret, required in production. Development generates and retains one in the ignored .sessions directory.
- Former `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SITE_URL` values are no longer used by authentication.

Keep credentials in the ignored local .env file, never in browser JavaScript or version control. Use .env.example as a template. PostgreSQL connections require TLS with certificate verification enabled.

Startup creates the users table using database/schema.sql before listening. `npm run db:init` can also initialize it explicitly. The connected role must be permitted to create the table and manage grants. RLS is enabled, no public policies are granted, and browser/API roles have no table privileges. The trusted server database owner performs parameterized queries. For production, provision the schema separately and use a dedicated least-privilege server role with only the necessary SELECT and INSERT permissions and an appropriate server-only RLS policy.

No email confirmation, Supabase callback URLs, or Supabase Auth configuration is required. Email recovery is intentionally unavailable until a separate secure reset-token flow and mail provider are configured.

## Pages and behavior

- `/`: responsive security-product homepage; product preview explicitly uses sample data.
- `/signup`: validates details, hashes the password, inserts into app_users, and signs in immediately.
- `/login`: looks up the email and verifies the stored scrypt hash; includes password visibility and remember-me.
- `/forgot-password` and `/reset-password`: explain that email recovery is not configured; never claim to send email.
- `/workspace`: protected confirmation page and sample overview.
- `POST /logout`: terminates the session.

The header theme control cycles **light → dark → high contrast**, persists the choice in local storage, and uses only Lepidus’s `data-theme`. Layout uses logical CSS properties and supports `dir="rtl"` on the document. Modal semantics, focus trapping, Escape, backdrop dismissal, and focus restoration are provided by the official Lepidus JavaScript.

## Design fidelity

- Canonical assets: https://lepidus-design-system-button.vercel.app/v1/lepidus.css and the matching lepidus.js. The documented `@ramsarjal-404/css` npm package returned 404, so the official distributions are downloaded into public/vendor without modification.
- Bootstrap **grid only**, not Bootstrap Reboot, buttons, inputs, modals, or component styles.
- Official `lp-*` Button, Input, Checkbox, Link, Badge, Card, Avatar, Tag, Message, and Modal anatomy.
- Open Sans is self-hosted from `@fontsource/open-sans`.
- Application CSS is composition-only: published tokens supply colors, spacing, borders, radii, and typography. Bootstrap grid breakpoints are the documented responsive breakpoints. No per-theme CSS overrides.
- No fabricated certifications, customer endorsements, live metrics, OAuth, or email delivery. Node.js provides database-backed authentication; product metrics remain sample data.

### System gap note

**Required patterns:** marketing hero, wordmark, conceptual identity/data illustration, and authentication page composition.

**Closest available Lepidus components:** Card, Badge, Input, Checkbox, Link, Button, and Message.

**Risk if invented locally:** visual drift or accidental duplication of component internals.

**Implementation:** layout wrappers and decorative currentColor SVGs only, with token-driven composition. No invented `lp-*` classes or custom chart/sidebar components. The score preview uses a plain summary and canonical Card/Badge, not a replacement for a chart.

**Recommended action:** add approved marketing/authentication patterns and brand assets to Storybook and the component manifest before production release. Figma service access was unavailable during implementation; no Figma file was created.

## Security and deployment limitations

Node.js hashes passwords with scrypt (N=16384, r=8, p=1), random 16-byte salts, and constant-time comparisons. Credentials are stored only in app_users. SQL uses parameterized queries and a unique normalized-email constraint. Missing accounts still perform a dummy hash check. Sessions store only the database user ID, rotate on signup/login, and are checked against the database on authenticated requests. Old Supabase Auth sessions are not accepted. Cookies are HttpOnly and SameSite=Lax, and Secure in production. Forms retain CSRF protection, validation, rate limiting, escaped output, and same-origin CSP. Hashes and connection strings are never sent to the browser.

Sessions persist in the private PostgreSQL app_sessions table, shared across server instances. Only the local development secret remains in the ignored .sessions directory. Production requires a stable SESSION_SECRET, HTTPS, centralized rate limiting, audit logging, and a dedicated least-privilege database role. Production trusts one reverse-proxy hop: adjust for the actual deployment. Email ownership is not verified; company names do not grant permissions. Add account recovery and email verification before uses that require them.

## GitHub and Vercel deployment

1. Rotate any database password previously shared in chat and update the ignored .env locally. Never commit credentials.
2. Run `npm run db:init` once to provision app_users and app_sessions before deploying. Vercel functions do not run migrations.
3. Push the main branch to your GitHub repository, then import that repository into Vercel. The included vercel.json routes requests to api/index.js and bundles EJS views, public assets, fonts, and the database certificate. Leave build and output-directory overrides unset.
4. Set private Vercel project environment variables: `DATABASE_URL` (the complete encoded Session pooler URI), `SESSION_SECRET` (a strong random value, stable across deployments), and `NODE_ENV=production`. Set them for Production and any Preview deployments you intend to use; prefer a separate database for previews. Do not prefix secrets with PUBLIC or NEXT_PUBLIC.
5. Deploy, then open the HTTPS deployment URL and register/login. Accounts appear in Table Editor → app_users; sessions appear in app_sessions. No Supabase Auth callback URL is required.

Use Node.js 24.x in Vercel project settings. The function verifies database TLS certificates and uses a small PostgreSQL connection pool. Expired sessions are rejected by the store; schedule trusted database cleanup of expired app_sessions records in production. Current rate limiting is per function instance, so add shared rate limiting or Vercel firewall rules before public launch.

## Browser checks

Automated browser checks are in scripts/browser-check.js. With the app running, run `node scripts/browser-check.js`; install Chromium first with `npx playwright install chromium` if necessary. These checks cover responsive overflow, light/dark/high-contrast accessibility, RTL, signup/login/logout, form errors, theme persistence, and modal keyboard behavior.