# rule.md — Engineering Rules for UR Fire Safety Solution Build

These are binding rules for anyone (human or AI coding assistant) working on
this repo. Read this before writing code.

## 1. Design / "Doesn't Look AI-Generated" Rule

- No gradient-blob heroes, no glassmorphism, no floating 3D icon clusters, no
  generic rounded-pill CTA buttons with heavy soft shadows, no stock
  Undraw/Freepik illustrations, no emoji used as icons, no bouncy
  hover-lift-everything animations.
- Every stat, number, and testimonial rendered on the public site must come
  from real data (`site_settings`, `testimonials` tables) — never hardcode a
  placeholder number or fake name directly in HTML/JSX. If real data isn't
  available yet, show nothing or a manually-set real estimate — never "0+".
- Palette stays grounded: charcoal/graphite base, off-white (not pure white),
  single red/safety-orange accent used sparingly. No neon, no purple/blue SaaS
  gradients.
- Motion is minimal and purposeful (simple scroll fade-ins only). No particle
  effects, no animated gradients, no confetti.

## 2. Security Rules (non-negotiable)

- `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, and all SMTP/EmailJS secrets live
  only in environment variables, never in source, never in a client bundle,
  never logged.
- Every `/admin` page and every `/api/admin/*` route must verify the JWT
  server-side before returning any data. No route "assumes" the frontend
  already checked auth.
- No public registration/sign-up endpoint may ever exist. The single owner
  account is created once via a manual seed script, never through a reachable
  API route.
- Passwords are always bcrypt-hashed. Never store, log, or return plaintext
  passwords anywhere, including in error messages.
- Session token lives in an httpOnly, Secure, SameSite=Strict cookie — never
  in localStorage/sessionStorage (XSS-exposed).
- Rate-limit the login endpoint and the public lead-capture endpoint.
- Validate and sanitize all public-facing input (`/api/leads`) server-side
  before it touches the database, regardless of client-side validation.
- Row Level Security must be enabled on every Supabase table before launch —
  no table ships with RLS disabled "temporarily."

## 3. Data Integrity Rules

- Any field the public site displays as a "trust signal" (stats,
  testimonials, certifications) must be traceable to a real database row or a
  number the owner explicitly entered — flag in code review if this isn't the
  case.
- Status fields (`leads.status`, `amc_contracts.status`, `quotes.status`) use
  only the enumerated values defined in Backendschema.md — no ad hoc string
  statuses invented in the frontend.
- Deleting a client, lead, or contract is a soft-delete (status change /
  `deleted_at` flag) — never a hard DELETE, so the owner can't lose CRM
  history from a misclick.

## 4. Code Structure & Style

- Serverless functions under `/api/`, grouped by resource
  (`/api/leads`, `/api/admin/leads`, `/api/admin/clients`, etc.) matching the
  endpoint table in Backendschema.md exactly — don't invent new route shapes
  without updating that doc.
- Shared JWT-verification logic lives in one middleware/helper, imported by
  every `/api/admin/*` route — never re-implemented per-route.
- No inline styles for anything beyond one-off dynamic values; use the
  existing design system/CSS approach already established in the frontend.
- Keep the public marketing site and the admin CRM as clearly separate
  concerns (routing, layout, and — ideally — bundle) so the CRM's dashboard
  styling never leaks into public pages and vice versa.

## 5. Git / Deploy Rules

- Preview deploy on every branch/PR; production deploy only from `main` after
  the preview is checked — matches existing Vercel pipeline convention.
- No secrets in commits, ever — check `.env` is gitignored before first
  commit of backend code.
- Commit messages describe the change in plain language (what + why), not
  generic "update files."

## 6. When in Doubt

- Prefer the option that a real fire-safety company's in-house dev would
  ship, not the option that looks impressive in a demo. This product exists
  to be trusted by facility managers and housing societies — clarity and
  correctness beat cleverness every time.
