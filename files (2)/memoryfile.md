# memoryfile.md — Project Memory: UR Fire Safety Solution

Living context file for this project. Any AI assistant (or human) picking
this repo up should read this first — it's the "what's true right now" doc,
kept short and current rather than a full history log.

## Project Identity

- **Client:** Ritesh Tiwari, Owner, UR Fire Safety Solution — Vadodara,
  Gujarat, India.
- **Business:** Fire safety equipment + services — extinguishers, alarm
  systems, hydrant systems, AMC (annual maintenance contracts), refilling —
  for industrial, commercial, and residential clients.
- **Built by:** Yash / Scalix Systems.
- **Repo:** github.com/Yash282802/-UR-FIRE-SAFTEY
- **Live:** ur-fire-safety.vercel.app

## Current Phase

Frontend design for the public site exists already. This memory file was
created alongside the first full PRD pass covering:
- `PRD.md` — product requirements (public site + owner-only CRM)
- `Backendschema.md` — Supabase Postgres schema, API endpoints, auth flow
- `rule.md` — engineering rules (security, design, data-integrity)

Backend/CRM build has not started yet as of this file's creation — these four
docs are the spec to build against.

## Locked-In Decisions (don't re-litigate without owner sign-off)

- Single owner account only — no multi-user CRM, no staff roles in v1.
- Auth: custom JWT + httpOnly cookie, NOT Supabase Auth, NOT localStorage
  tokens.
- Database: Supabase Postgres with RLS on every table.
- Email: EmailJS for MVP → Nodemailer/SMTP in Phase 2.
- No online payments, no customer-facing login portal in v1.
- Design must never look "AI-generated" — see the design rule in `rule.md`;
  this constraint applies to both the public site and the CRM UI.

## Known Bugs to Fix (found on the live site during PRD review)

- Homepage stats block ("Active Clients", "Years Exp.", "24/7 Support",
  "Installations") renders as "0+" — counters aren't populated. Fix by wiring
  to the `site_settings` table (see Backendschema.md) rather than hardcoding.
- Testimonial cards show a stray "99" above each name — broken quote-icon
  glyph rendering. Fix during the testimonials-manager build.

## Open Questions (waiting on owner)

- 2FA on admin login, given the account controls all client/lead data — yes
  or no for v1?
- Should AMC-expiry alerts also go out via WhatsApp/email, or is a dashboard
  flag enough for launch?

## Rollout Order

1. Fix public-site bugs + wire real stats/testimonials + basic auth-gated
   CRM (Leads, Clients, Dashboard).
2. Quotes + AMC contracts + service visit log + owner-editable site settings;
   move email to Nodemailer/SMTP.
3. Testimonials manager + expiring-AMC alerts + printable quote view.

## Update This File When

- A locked-in decision above changes (record the change, don't just delete
  the old line silently).
- A phase completes — move it out of "Current Phase" into a short "Done"
  note.
- A new bug or open question surfaces that the next session needs to know
  about.
