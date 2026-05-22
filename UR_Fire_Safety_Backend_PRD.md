# Backend PRD — UR Fire Safety Solution Website
**Version:** 1.0  
**Date:** May 2026  
**Prepared for:** Ritesh Tiwari, UR Fire Safety Solution  
**Companion to:** Frontend PRD v1.0

---

## 1. Overview

### 1.1 Purpose
This document defines the backend architecture, data schema, API design, and workflows for the UR Fire Safety Solution website. The backend is responsible for handling contact form submissions, delivering email notifications, storing leads, and supporting future admin capabilities.

### 1.2 Scope
Since the frontend PRD specifies a **static HTML/CSS/JS site**, the backend is a **lightweight serverless/API-first backend** — not a full-stack monolith. It handles only what is needed for the business: lead capture, email delivery, and optional CRM-style lead management.

### 1.3 Architecture Overview

```
[Browser / Static Site]
        |
        | HTTPS API Calls
        ↓
[Backend API Layer]  ←→  [Email Service (SMTP / SendGrid)]
        |
        ↓
[Database: Leads Table]
        |
        ↓
[Admin Dashboard (Phase 3)]
```

---

## 2. Technology Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | Node.js (Express) or Python (FastAPI) | Lightweight, fast, widely supported |
| Hosting | Vercel / Railway / Render (free tier) | Zero-devops for small business |
| Database | PostgreSQL (via Supabase) or SQLite | Simple schema, free tier available |
| Email Delivery | EmailJS (client-side) or Nodemailer (server-side) | Contact form notifications |
| ORM | Prisma (Node) / SQLAlchemy (Python) | Schema management, migrations |
| Auth (Admin) | JWT tokens (Phase 3) | Secure admin panel login |
| Environment | `.env` for secrets | API keys, DB URLs, SMTP credentials |

> **Recommended stack:** Node.js + Express + Supabase (PostgreSQL) + Nodemailer  
> Can be replaced with **Formspree / EmailJS** for Phase 1 MVP with zero backend code.

---

## 3. Data Schema

### 3.1 Entity: `leads`

Stores every inquiry submitted via the Contact Form.

```sql
CREATE TABLE leads (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100)  NOT NULL,
  phone           VARCHAR(15)   NOT NULL,
  email           VARCHAR(150),
  service         VARCHAR(100),       -- selected from dropdown
  message         TEXT,
  source          VARCHAR(50)   DEFAULT 'contact_form',
  status          VARCHAR(30)   DEFAULT 'new',   -- new | contacted | closed
  created_at      TIMESTAMP     DEFAULT NOW(),
  updated_at      TIMESTAMP     DEFAULT NOW()
);
```

**Field Details:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | Integer | Auto | Primary key |
| name | String (100) | Yes | Full name of inquirer |
| phone | String (15) | Yes | Primary contact, validated format |
| email | String (150) | No | Optional per PRD |
| service | String (100) | No | One of 5 services or "General" |
| message | Text | No | Free-form message from user |
| source | String (50) | Auto | "contact_form", "whatsapp", "call" |
| status | Enum | Auto | Lead lifecycle tracking |
| created_at | Timestamp | Auto | Submission time |
| updated_at | Timestamp | Auto | Last modification |

---

### 3.2 Entity: `admin_users` (Phase 3)

```sql
CREATE TABLE admin_users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(50)   UNIQUE NOT NULL,
  password_hash   VARCHAR(255)  NOT NULL,
  role            VARCHAR(20)   DEFAULT 'admin',
  created_at      TIMESTAMP     DEFAULT NOW()
);
```

---

### 3.3 Entity: `email_logs` (Phase 2)

Tracks all outbound emails for debugging and audit.

```sql
CREATE TABLE email_logs (
  id              SERIAL PRIMARY KEY,
  lead_id         INTEGER REFERENCES leads(id),
  recipient       VARCHAR(150)  NOT NULL,
  subject         VARCHAR(255),
  status          VARCHAR(20),   -- sent | failed
  sent_at         TIMESTAMP     DEFAULT NOW()
);
```

---

## 4. API Design

### Base URL
```
https://api.urfiresafety.com/v1
```
(or `/api/v1` on the same server if not using a subdomain)

---

### 4.1 Submit Contact Form

**Endpoint:** `POST /contact`

**Request Body:**
```json
{
  "name": "Ramesh Shah",
  "phone": "9876543210",
  "email": "ramesh@example.com",
  "service": "Fire Extinguishers",
  "message": "Need 10 ABC extinguishers for our office."
}
```

**Validation Rules:**
- `name`: required, 2–100 characters
- `phone`: required, 10-digit Indian mobile number (regex: `/^[6-9]\d{9}$/`)
- `email`: optional, valid email format if provided
- `service`: optional, must match allowed values if provided
- `message`: optional, max 1000 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your inquiry has been received. We will contact you shortly.",
  "lead_id": 42
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": {
    "phone": "Must be a valid 10-digit Indian mobile number.",
    "name": "Name is required."
  }
}
```

---

### 4.2 Get All Leads (Admin)

**Endpoint:** `GET /admin/leads`  
**Auth:** Bearer JWT Token required

**Query Params:**
- `status` — filter by `new | contacted | closed`
- `page` — pagination (default: 1)
- `limit` — results per page (default: 20)

**Response:**
```json
{
  "total": 85,
  "page": 1,
  "data": [
    {
      "id": 42,
      "name": "Ramesh Shah",
      "phone": "9876543210",
      "service": "Fire Extinguishers",
      "status": "new",
      "created_at": "2026-05-20T10:30:00Z"
    }
  ]
}
```

---

### 4.3 Update Lead Status (Admin)

**Endpoint:** `PATCH /admin/leads/:id`  
**Auth:** Bearer JWT Token required

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Response:**
```json
{
  "success": true,
  "lead": { "id": 42, "status": "contacted", "updated_at": "2026-05-21T09:00:00Z" }
}
```

---

### 4.4 Admin Login

**Endpoint:** `POST /admin/login`

**Request Body:**
```json
{
  "username": "ritesh",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```

---

## 5. Workflow Diagrams

### 5.1 Contact Form Submission Workflow

```
User fills form on website
        |
        ↓
Frontend validates (client-side JS)
        |
        ↓
POST /api/v1/contact  →  Backend validates server-side
        |                        |
        |               [Validation fails]
        |                        ↓
        |               Return 400 + error messages
        |                        |
        |               [Displayed to user]
        |
[Validation passes]
        |
        ↓
Save lead to DB (leads table)
        |
        ↓
Trigger Email Notification
    ├── To: urfiresafetysolution@gmail.com  ← Owner alert
    └── To: user's email (if provided)     ← Confirmation email
        |
        ↓
Log email to email_logs table
        |
        ↓
Return 200 success response to frontend
        |
        ↓
Frontend shows "Thank you" message
```

---

### 5.2 Email Notification Workflow

**Owner Notification Email (triggered on every form submit):**

```
Subject: New Inquiry — [Service] from [Name]

Body:
  Name:    Ramesh Shah
  Phone:   9876543210
  Email:   ramesh@example.com
  Service: Fire Extinguishers
  Message: Need 10 ABC extinguishers for our office.
  
  Received at: 20 May 2026, 10:30 AM
```

**User Confirmation Email (if email provided):**

```
Subject: We received your inquiry — UR Fire Safety Solution

Body:
  Dear Ramesh,
  Thank you for reaching out to UR Fire Safety Solution.
  We will contact you within 24 hours on 9876543210.
  
  For urgent needs, call us directly: 9274733827
  
  — Team UR Fire Safety
```

---

### 5.3 Admin Lead Management Workflow (Phase 3)

```
Admin logs in → JWT issued
        |
        ↓
Admin views leads list (filtered by status)
        |
        ↓
Admin clicks on "new" lead
        |
        ↓
Admin calls/WhatsApps the customer
        |
        ↓
Admin marks lead as "contacted" or "closed"
        |
        ↓
DB updated, timestamp recorded
```

---

## 6. Email Service Configuration

### Option A — EmailJS (No backend needed, Phase 1 MVP)

Configure directly in frontend JavaScript. Free tier: 200 emails/month.

```javascript
emailjs.send("service_id", "template_id", {
  from_name: formData.name,
  phone: formData.phone,
  service: formData.service,
  message: formData.message,
  to_email: "urfiresafetysolution@gmail.com"
});
```

**Pros:** Zero server needed  
**Cons:** API key exposed in frontend, no lead storage

---

### Option B — Nodemailer (Server-side, Phase 2+)

```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,        // urfiresafetysolution@gmail.com
    pass: process.env.SMTP_APP_PASSWORD // Gmail App Password (not main password)
  }
});

await transporter.sendMail({
  from: '"UR Fire Safety" <urfiresafetysolution@gmail.com>',
  to: "urfiresafetysolution@gmail.com",
  subject: `New Inquiry — ${service} from ${name}`,
  html: emailTemplate
});
```

**Gmail Setup Required:** Enable 2FA → Generate App Password in Google Account settings.

---

## 7. Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/urfiresafety

# Email (Gmail SMTP)
SMTP_USER=urfiresafetysolution@gmail.com
SMTP_APP_PASSWORD=your_app_password_here

# JWT (Admin Auth)
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=86400

# CORS (allowed frontend origin)
CORS_ORIGIN=https://urfiresafetysolution.com
```

---

## 8. Security Requirements

| Requirement | Implementation |
|-------------|---------------|
| Input validation | Server-side validation on all fields before DB write |
| SQL Injection prevention | Use parameterized queries / ORM (never raw string SQL) |
| Rate limiting | Max 5 form submissions per IP per hour (express-rate-limit) |
| CORS | Allow only the production frontend domain |
| HTTPS | Enforced via hosting platform (Vercel/Railway) |
| Admin auth | JWT with expiry; bcrypt for password hashing |
| Spam protection | Honeypot field (hidden input) + rate limiting |
| Secrets | Never hardcode; always use `.env` |

### Honeypot Spam Field

Add a hidden field to the form. If it's filled, the submission is bot-generated — silently reject:

```html
<!-- Hidden from humans via CSS, bots fill it -->
<input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off">
```

```javascript
// Backend check
if (req.body._honeypot) {
  return res.status(200).json({ success: true }); // Silent reject
}
```

---

## 9. Development Phases (Backend)

| Phase | Scope | Stack | Estimated Time |
|-------|-------|-------|----------------|
| **Phase 1 — MVP** | EmailJS only, no DB, no server | Frontend-only (EmailJS) | Day 1 |
| **Phase 2 — Server + DB** | Express API, PostgreSQL, Nodemailer, lead storage | Node.js + Supabase | Week 2–3 |
| **Phase 3 — Admin Panel** | JWT auth, lead management dashboard, status tracking | + JWT + Admin UI | Week 4–5 |

---

## 10. Folder Structure (Node.js Backend)

```
ur-firesafety-backend/
├── src/
│   ├── routes/
│   │   ├── contact.js        ← POST /contact
│   │   └── admin.js          ← Admin routes (leads, auth)
│   ├── controllers/
│   │   ├── contactController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── emailService.js   ← Nodemailer logic
│   │   └── leadService.js    ← DB operations
│   ├── middleware/
│   │   ├── validate.js       ← Input validation
│   │   ├── authMiddleware.js ← JWT verification
│   │   └── rateLimiter.js    ← Rate limiting
│   ├── models/
│   │   └── schema.prisma     ← Prisma DB schema
│   └── app.js                ← Express app setup
├── .env
├── package.json
└── README.md
```

---

## 11. Out of Scope (v1.0 Backend)

- Payment gateway / invoicing
- Product inventory management
- Customer portal / login
- SMS notifications
- WhatsApp API automation (WhatsApp float button is frontend-only in v1)
- Analytics data pipeline

---

## 12. Future Enhancements (v2.0)

| Feature | Description |
|---------|-------------|
| WhatsApp Business API | Auto-send confirmation message via WhatsApp |
| SMS Alert | Notify owner via SMS (Twilio/MSG91) on new lead |
| Lead Analytics | Dashboard: leads per month, service breakdown, conversion rate |
| Quote Generator | Auto-generate PDF quote and email to customer |
| CRM Integration | Export leads to Google Sheets or HubSpot |

---

## 13. Stakeholders

| Role | Person | Contact |
|------|--------|---------|
| Business Owner / Client | Ritesh Tiwari | 9274733827 |
| Email | — | urfiresafetysolution@gmail.com |

---

*End of Backend PRD — UR Fire Safety Solution Website v1.0*
