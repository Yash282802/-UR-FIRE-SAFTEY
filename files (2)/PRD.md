# PRD — UR Fire Safety Solution: Website + Owner CRM

**Repo:** github.com/Yash282802/-UR-FIRE-SAFTEY
**Live:** ur-fire-safety.vercel.app
**Client:** Ritesh Tiwari, Owner, UR Fire Safety Solution — Vadodara, Gujarat
**Built by:** Scalix Systems

---

## 1. Product Summary

UR Fire Safety Solution sells and services fire safety equipment (extinguishers,
alarm systems, hydrant systems, AMC contracts, refilling) to industrial,
commercial, and residential clients across Gujarat. The public website exists
to generate trust and capture leads/quote requests. Behind it sits a private,
owner-only CRM to manage those leads through to signed AMC contracts and
ongoing service scheduling — replacing the notebook/WhatsApp-based tracking
the business runs on today.

This is a life-safety business. Every design and product decision should
reinforce credibility — real numbers, real people, real certifications — never
placeholder content or generic templated patterns that read as thrown
together.

## 2. Goals

- Convert website visitors (industrial facility managers, housing societies,
  commercial property owners) into quote requests.
- Give the owner a single private dashboard to see every lead, quote, client,
  and AMC contract without opening WhatsApp/email/a notebook separately.
- Never let the public site show fake or stale data — stats block (clients,
  years, installations, 24/7 support) must be pulled from real records, not
  hardcoded placeholders.
- Ship a CRM the owner can actually use solo — no multi-seat complexity, no
  unnecessary configuration screens.

## 3. Non-Goals (out of scope for v1)

- Multi-admin / staff accounts or role permissions beyond the single owner.
- Online payments or invoicing.
- Customer-facing login/portal (client portal footer link is informational
  only for now, not a real authenticated area).
- Native mobile app (CRM is a responsive web dashboard only).
- Multi-language site.

## 4. Users

| User | Access | Primary need |
|---|---|---|
| Site visitor (facility manager, housing society secretary, homeowner) | Public, no login | Understand services, trust the company, request a quote or call |
| Owner (Ritesh Tiwari) | Authenticated, owner-only | Track every lead to close, manage clients, track AMC renewals, keep the site's public stats accurate |

There is exactly one privileged account. The CRM is not built for a team —
it's built for one person running the business.

## 5. Public Website — Functional Requirements

Pages already exist (Home, Services, Products, About, Contact) with the
existing frontend design; this PRD covers what powers them, plus fixes:

- **Contact / Quote form** → writes to `leads` table via API, triggers an
  email notification to the owner (EmailJS for MVP; see Backendschema.md).
- **"Get A Quote" flow** (`contact.html?inquiry=quote`) tags the lead with
  `source = quote_request` so it's distinguishable from general enquiries in
  the CRM.
- **WhatsApp click-to-chat** button — keep, no backend dependency.
- **Stats block (Active Clients / Years Exp. / 24/7 Support / Installations)**
  — currently static and rendering "0+". Must be replaced with real values
  computed from CRM data (client count, install count) or, at minimum,
  manually-set real numbers the owner enters once in the CRM settings — never
  a hardcoded "0+" placeholder shipped to production.
- **Testimonials** — must render with a working name/role/company and a
  proper quote glyph (current build shows a stray "99" above each name from a
  broken icon/quote-mark render — fix as part of this build). Testimonials
  should be manageable from the CRM (add/edit/hide) rather than hardcoded in
  the HTML.
- **Certifications** (ISO 9001:2015 etc.) shown as real badge graphics, not
  text-only.

## 6. Admin CRM — Functional Requirements

Accessible only at a non-linked, non-indexed route (e.g. `/admin`), never
linked from public navigation. Requires authentication — see Section 7.

### 6.1 Dashboard (home screen after login)
- New leads this week / this month.
- Leads awaiting response (no status update in >48h) — flagged.
- AMC contracts expiring in next 30 days.
- Real counts feeding the public site's stats block: total active clients,
  total installations, years in business, AMC contracts active.

### 6.2 Leads
- List of all inbound enquiries (contact form + quote requests), newest first.
- Fields: name, phone, email, message, service interested, source, status,
  created date.
- Status pipeline: `New → Contacted → Quoted → Won → Lost`.
- Owner can add private notes per lead.
- One-click call (`tel:`) and WhatsApp (`wa.me`) links per lead.
- Convert a lead to a Client record when won.

### 6.3 Clients
- List of converted clients: name, company, type (industrial / commercial /
  residential), phone, email, address.
- Client detail view shows linked quotes, AMC contracts, and service history.

### 6.4 Quotes
- Create/edit a quote against a lead or client: service type, line-item
  details, quoted amount, validity date, status (`Draft / Sent / Accepted /
  Rejected`).
- Simple printable/shareable quote view (PDF export can be a fast-follow, not
  required for v1 — a clean print-friendly HTML view is sufficient for launch).

### 6.5 AMC Contracts (core recurring revenue — priority feature)
- Contract record per client: contract number, start/end date, equipment
  covered, contract value, status (`Active / Expiring / Expired / Lapsed`).
- Next service/visit due date, with the dashboard surfacing anything due in
  30 days.
- Log of past service visits per contract (date, technician notes, next due
  date) — this is what the "Quarterly Equipment Checks" service promise on
  the public site should be backed by operationally.

### 6.6 Testimonials manager
- Add/edit/hide testimonials shown on the public site (name, role, company,
  quote text, rating, optional photo).

### 6.7 Site settings
- Editable fields for the public stats block (active clients, years
  experience, installations, support hours) so the owner updates real numbers
  without a code deploy.

## 7. Authentication (owner-only access)

- Single owner account, no public sign-up route exists anywhere in the app.
- Credential-based login (email + password) against a seeded admin user —
  password stored hashed (bcrypt), never plaintext, never in a public repo.
- On successful login, issue a JWT, stored as an **httpOnly, secure,
  SameSite=strict cookie** (not localStorage — avoids XSS token theft).
- Every `/admin/*` page and every `/api/admin/*` endpoint verifies the JWT
  server-side before responding; expired/missing/invalid token → redirect to
  login, no data returned.
- Rate-limit the login endpoint (e.g. 5 attempts / 15 min per IP) to blunt
  brute-force attempts against the one account that controls everything.
- Session expiry (e.g. 7 days) with re-login required after — no infinite
  sessions.
- Full schema and endpoint detail in **Backendschema.md**.

## 8. Design Principle — "Must not look AI-generated"

This governs both the public site and the CRM UI:

- No gradient-blob heroes, no glassmorphism, no generic rounded-pill buttons
  with heavy drop shadows, no stock "Undraw" illustrations, no bouncy
  micro-animations.
- Real numbers, real names, real certifications — never placeholder "0+",
  "Lorem ipsum", or generic stock testimonials.
- Palette: grounded, desaturated, industrial — deep charcoal/graphite + a
  single confident red/safety-orange accent, off-white (not pure white).
- The CRM itself should look like a serious internal tool (dense, functional,
  data-table-driven) — not a flashy dashboard template with vanity charts the
  owner will never look at twice.

## 9. Success Metrics

- 100% of contact/quote form submissions land in the CRM leads list (zero
  lost enquiries via broken EmailJS delivery).
- Owner can find the status of any lead or AMC contract in under 10 seconds.
- Public stats block always reflects real, current numbers — zero instances
  of "0+" or stale data in production.
- Zero unauthenticated access to any `/admin` route or `/api/admin` endpoint.

## 10. Rollout Phases

1. **Phase 1 (MVP):** Public site fixes (stats, testimonials) + leads capture
   via EmailJS + basic auth-gated CRM (Leads, Clients, Dashboard).
2. **Phase 2:** Quotes module, AMC contracts + service visit log, site
   settings (owner-editable stats), move email delivery to
   Nodemailer/SMTP for reliability.
3. **Phase 3:** Testimonials manager, expiring-AMC alerts, print-friendly
   quote view.

## 11. Open Questions for Owner

- Preferred login: email + password only, or add optional 2FA (e.g. OTP over
  WhatsApp/SMS) given this account controls all client data?
- Should expiring-AMC alerts also notify by WhatsApp/email, or is the
  dashboard flag enough for v1?
