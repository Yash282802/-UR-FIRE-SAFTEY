# UR Fire Safety Solution — Backend API

Backend API for lead capture, email notifications, and admin management.

## Tech Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL (via Prisma ORM)
- **Email:** Nodemailer (Gmail SMTP)
- **Auth:** JWT + bcrypt

## Setup

```bash
npm install
cp .env .env.local   # edit with real credentials
npx prisma migrate dev --name init
npm run db:seed      # creates admin user
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contact` | Submit contact form |
| POST | `/api/v1/admin/login` | Admin login |
| GET | `/api/v1/admin/leads` | List leads (Auth) |
| GET | `/api/v1/admin/leads/:id` | Lead detail (Auth) |
| PATCH | `/api/v1/admin/leads/:id` | Update lead status (Auth) |

## Environment Variables

See `.env` for all required variables.
