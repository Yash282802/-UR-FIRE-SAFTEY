# Backend Schema — UR Fire Safety Solution

**Stack:** Supabase (Postgres + Row Level Security), serverless functions on
Vercel, JWT-based owner authentication, EmailJS (Phase 1) → Nodemailer/SMTP
(Phase 2) for transactional email.

---

## 1. Tech Stack Decisions

- **Database:** Supabase Postgres. Use Supabase purely as managed Postgres +
  RLS; auth is custom JWT (see Section 4), not Supabase Auth, since this is a
  single hard-coded owner account, not a multi-user system.
- **API layer:** Vercel serverless functions (`/api/*`), REST, JSON in/out.
- **Hosting:** Vercel (already in use — preview deploys before production,
  per existing pipeline convention).
- **Email:** EmailJS client-side for MVP lead notifications; migrate to
  Nodemailer + SMTP server-side in Phase 2 for reliability and to stop
  exposing EmailJS public keys client-side.
- **Password hashing:** bcrypt (or argon2id if available in the runtime).
- **JWT:** signed with a server-only secret (`JWT_SECRET` env var), short
  expiry + refresh via re-login, delivered as httpOnly cookie.

## 2. Entity-Relationship Overview

```
admin_users (1 row)
     |
     | (creates/updates)
     v
leads ──────converts to──────> clients ────has many────> amc_contracts
  |                                |                            |
  | has many                      | has many                   | has many
  v                                v                            v
notes (on lead)               quotes                    service_visits

clients ──has many──> testimonials
site_settings (singleton row, owner-editable public stats)
```

## 3. Tables

### 3.1 `admin_users`
Single-row table in practice (one owner), structured to allow future
expansion without a migration.

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | default `gen_random_uuid()` |
| email | text, unique, not null | login identifier |
| password_hash | text, not null | bcrypt hash, never plaintext |
| role | text, not null, default `'owner'` | future-proofing |
| last_login_at | timestamptz | updated on successful login |
| created_at | timestamptz, default `now()` | |

RLS: no public access at all (service role only, used server-side in API
functions).

### 3.2 `leads`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text, not null | |
| phone | text, not null | |
| email | text | |
| message | text | |
| service_interested | text | e.g. `extinguishers`, `alarms`, `hydrants`, `amc` |
| source | text, not null, default `'contact_form'` | `contact_form` \| `quote_request` |
| status | text, not null, default `'new'` | `new`\|`contacted`\|`quoted`\|`won`\|`lost` |
| notes | text | owner's private notes |
| client_id | uuid, FK → clients.id, nullable | set when converted |
| created_at | timestamptz, default `now()` | |
| updated_at | timestamptz, default `now()` | |

RLS: insert allowed from the public API route (server-side, using a
constrained service call — never expose the Supabase service role key to the
browser); select/update restricted to authenticated owner requests only.

### 3.3 `clients`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text, not null | |
| company | text | |
| type | text | `industrial`\|`commercial`\|`residential` |
| phone | text | |
| email | text | |
| address | text | |
| created_at | timestamptz, default `now()` | |

RLS: owner-only, all operations.

### 3.4 `quotes`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| lead_id | uuid, FK → leads.id, nullable | |
| client_id | uuid, FK → clients.id, nullable | |
| service_type | text, not null | |
| details | text | line items / description |
| amount | numeric(10,2) | |
| status | text, default `'draft'` | `draft`\|`sent`\|`accepted`\|`rejected` |
| valid_until | date | |
| created_at | timestamptz, default `now()` | |

RLS: owner-only.

### 3.5 `amc_contracts`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| client_id | uuid, FK → clients.id, not null | |
| contract_number | text, unique | |
| equipment_covered | text | |
| start_date | date, not null | |
| end_date | date, not null | |
| amount | numeric(10,2) | |
| status | text, default `'active'` | `active`\|`expiring`\|`expired`\|`lapsed` |
| next_service_due | date | drives dashboard alerts |
| created_at | timestamptz, default `now()` | |

RLS: owner-only.

### 3.6 `service_visits`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| amc_contract_id | uuid, FK → amc_contracts.id, not null | |
| visit_date | date, not null | |
| technician | text | |
| notes | text | |
| next_due_date | date | |
| created_at | timestamptz, default `now()` | |

RLS: owner-only.

### 3.7 `testimonials`

| Column | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| client_id | uuid, FK → clients.id, nullable | |
| name | text, not null | |
| role | text | e.g. "Facility Manager" |
| company | text | |
| quote_text | text, not null | |
| rating | smallint, default 5 | 1–5 |
| photo_url | text | |
| published | boolean, default false | owner must explicitly publish |
| created_at | timestamptz, default `now()` | |

RLS: public **select** only where `published = true`; all writes owner-only.

### 3.8 `site_settings`

Singleton row (`id = 1`, enforced via check constraint) holding the public
stats block values, so the owner can update real numbers without a redeploy.

| Column | Type | Notes |
|---|---|---|
| id | int, PK, check (id = 1) | enforces single row |
| active_clients | int, default 0 | |
| years_experience | int, default 0 | |
| installations | int, default 0 | |
| support_hours_label | text, default `'24/7'` | |
| updated_at | timestamptz, default `now()` | |

RLS: public select allowed (feeds homepage); update owner-only.

## 4. Auth Flow (JWT, owner-only)

1. `POST /api/admin/login` — body `{ email, password }`.
   - Look up `admin_users` by email, compare bcrypt hash.
   - Rate-limited (5 attempts / 15 min / IP).
   - On success: sign JWT `{ sub: user.id, role: 'owner' }`, 7-day expiry.
   - Set as `Set-Cookie: session=<jwt>; HttpOnly; Secure; SameSite=Strict;
     Path=/`.
   - Update `last_login_at`.
2. Every `/api/admin/*` route runs a shared middleware: read cookie → verify
   JWT signature + expiry → 401 on failure → attach `req.owner` on success.
3. `POST /api/admin/logout` clears the cookie.
4. No registration endpoint exists anywhere. The single admin row is created
   once via a seed script run manually by the developer, not through any API
   route reachable from the internet.

## 5. API Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/leads` | public | Create lead from contact/quote form |
| POST | `/api/admin/login` | public (rate-limited) | Owner login |
| POST | `/api/admin/logout` | owner | Clear session |
| GET | `/api/admin/leads` | owner | List/filter leads |
| PATCH | `/api/admin/leads/:id` | owner | Update status/notes, convert to client |
| GET/POST | `/api/admin/clients` | owner | List/create clients |
| GET/PATCH | `/api/admin/clients/:id` | owner | Client detail + edit |
| GET/POST | `/api/admin/quotes` | owner | List/create quotes |
| PATCH | `/api/admin/quotes/:id` | owner | Update quote status |
| GET/POST | `/api/admin/amc` | owner | List/create AMC contracts |
| PATCH | `/api/admin/amc/:id` | owner | Update contract/status |
| GET/POST | `/api/admin/service-visits` | owner | Log service visits |
| GET/POST/PATCH | `/api/admin/testimonials` | owner (write) / public (read published only) | Manage + serve testimonials |
| GET/PATCH | `/api/admin/site-settings` | owner (write) / public (read) | Public stats block |
| GET | `/api/admin/dashboard` | owner | Aggregated counts for dashboard |

## 6. Environment Variables (never committed to the repo)

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=      # server-side only, never shipped to client
JWT_SECRET=
EMAILJS_SERVICE_ID=             # Phase 1
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
SMTP_HOST=                      # Phase 2
SMTP_USER=
SMTP_PASS=
```

## 7. Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is used only inside serverless functions, never
  in any client-side bundle.
- RLS enabled on every table; the service role bypasses RLS server-side, but
  every owner-only API route still independently checks the JWT before
  touching the database — RLS is a backstop, not the only gate.
- Contact form endpoint (`/api/leads`) is public but rate-limited and
  input-validated (name/phone required, basic format checks) to block spam
  and injection.
