# Product Requirements Document (PRD)
## UR Fire Safety Solution — Business Website

**Version:** 1.0  
**Date:** May 2026  
**Prepared for:** Ritesh Tiwari, UR Fire Safety Solution

---

## 1. Overview

### 1.1 Business Summary
UR Fire Safety Solution is a fire safety equipment and services company based in Vadodara, Gujarat. The business provides fire extinguishers, alarm systems, hydrant systems, refilling & maintenance, and personal protective equipment (PPE) to residential, commercial, and industrial clients.

### 1.2 Purpose of the Website
To establish a professional online presence that builds trust, generates leads, showcases services, and makes it easy for potential customers to contact the business.

### 1.3 Target Audience
- Residential building owners and housing societies
- Commercial establishments (offices, malls, factories)
- Industrial facilities and warehouses
- Construction companies
- Government and institutional buyers

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Generate leads/inquiries | Number of contact form submissions per month |
| Build credibility | Bounce rate < 50%, avg. session > 1.5 min |
| Increase calls | Click-to-call events tracked |
| Local SEO visibility | Rank on Google for "fire safety Vadodara" |

---

## 3. Site Structure & Pages

### 3.1 Pages

| Page | Purpose |
|------|---------|
| **Home** | Hero section, USPs, services overview, CTA |
| **About Us** | Company story, mission, certifications |
| **Services** | Detailed service pages (one per service) |
| **Products** | Fire extinguishers, PPE, alarm systems catalog |
| **Why Us** | Differentiators, certifications, client stats |
| **Contact** | Contact form, map, phone, email, address |

### 3.2 Navigation
- Sticky top navigation bar with logo on the left
- Nav links: Home | Services | Products | About | Contact
- Prominent "Get a Free Quote" CTA button in the nav (red)
- Mobile: Hamburger menu with slide-in drawer

---

## 4. Page-by-Page Requirements

### 4.1 Home Page

**Hero Section**
- Full-width banner with fire-safety themed background (dark/industrial)
- Headline: "Protecting Lives. Securing Futures."
- Sub-headline: "Complete Fire Safety Equipment & Services in Vadodara"
- Two CTAs: [Get a Free Quote] [Call Now: 9274733827]
- Animated flame or safety icon element

**Services Strip**
- Icon-based horizontal strip of 5 services:
  - 🔥 Fire Extinguishers
  - 🚨 Fire Alarm Systems
  - 💧 Hydrant Systems
  - 🔧 Refilling & Maintenance
  - 🪖 Personal Protective Equipment

**Why Choose Us Section**
- 3–4 stat counters (e.g., "500+ Happy Clients", "10+ Years Experience", "24/7 Support")
- Brief trust message

**Testimonials**
- 3 customer review cards (placeholder content)

**Call-to-Action Banner**
- Full-width red/dark banner: "Need Emergency Fire Safety Service?" + phone number

**Footer**
- Logo, tagline, quick links, contact details, social media icons, copyright

---

### 4.2 Services Page

One detailed section per service:

1. **Fire Extinguishers**
   - Types offered: CO2, ABC Dry Powder, Water, Foam
   - Use cases
   - CTA: Get Quote

2. **Fire Alarm Systems**
   - Addressable & conventional systems
   - Installation + AMC

3. **Hydrant Systems**
   - Design, supply, installation
   - Compliance with NBC/IS codes

4. **Refilling & Maintenance**
   - Annual Maintenance Contracts (AMC)
   - On-site refilling
   - Inspection & certification

5. **Personal Protective Equipment (PPE)**
   - Helmets, gloves, fire-resistant suits
   - Compliant with safety standards

---

### 4.3 About Us Page

- Company founding story
- Mission: "Making every building fire-safe"
- Owner: Ritesh Tiwari — background, expertise
- Certifications (if any — placeholder)
- Photo/team section placeholder

---

### 4.4 Contact Page

**Contact Form Fields:**
- Name (required)
- Phone Number (required)
- Email
- Service Interested In (dropdown: all 5 services)
- Message
- [Submit] button

**Contact Details Card:**
- 📞 9274733827
- 📧 urfiresafetysolution@gmail.com
- 📍 B-20 Shivam Tenament, Channi Jakatnaka, Vadodara 390024

**Embedded Google Map** showing location

---

## 5. Design Requirements

### 5.1 Brand Identity
| Element | Specification |
|---------|--------------|
| Primary Color | Red (#D72323) |
| Secondary Color | Black (#1A1A1A) |
| Accent | Amber/Yellow (#F5A623) — from helmet in logo |
| Background | White (#FFFFFF) |
| Logo | As provided — must appear in header and footer |
| Tagline | "Fire Safety Equipment & Services" |

### 5.2 Typography
- Headings: Bold, strong sans-serif (e.g., Oswald, Barlow Condensed)
- Body: Clean readable sans-serif (e.g., Nunito, Source Sans Pro)
- Avoid: Arial, Times New Roman

### 5.3 Visual Style
- Industrial/professional tone
- Use fire-safety imagery (extinguishers, flames, equipment)
- Red + black dominant palette
- Subtle flame or hazard graphic textures in hero/banners

### 5.4 Responsiveness
- Fully responsive: Desktop, Tablet, Mobile
- Mobile-first CSS approach
- Click-to-call enabled on mobile for phone numbers

---

## 6. Functional Requirements

| Feature | Priority | Details |
|---------|----------|---------|
| Contact Form | P0 | Submit to email (urfiresafetysolution@gmail.com) |
| Click-to-Call | P0 | `tel:` link on phone number |
| Google Maps Embed | P1 | Show business location |
| WhatsApp Float Button | P1 | "Chat on WhatsApp" floating button |
| SEO Meta Tags | P1 | Title, description, keywords per page |
| Google Analytics | P2 | Track visits and conversions |
| Social Media Links | P2 | WhatsApp, Facebook (if applicable) |

---

## 7. SEO Requirements

- Page titles: "Fire Safety Equipment Vadodara | UR Fire Safety Solution"
- Meta descriptions per page
- Schema markup: LocalBusiness, Service
- Keywords to target:
  - "fire extinguisher Vadodara"
  - "fire safety company Vadodara"
  - "fire alarm system Vadodara"
  - "AMC fire extinguisher Gujarat"
  - "fire hydrant system supplier Vadodara"

---

## 8. Technical Requirements

| Requirement | Detail |
|-------------|--------|
| Platform | Static HTML/CSS/JS or WordPress (client choice) |
| Hosting | Any Indian hosting provider (e.g., Hostinger, Bluehost India) |
| Domain | urfiresafetysolution.com (recommended) |
| SSL | Required (HTTPS) |
| Page Load Speed | < 3 seconds on mobile |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Form Backend | EmailJS / Formspree for static sites |

---

## 9. Content Requirements

### Content to be Provided by Client
- [ ] High-resolution logo (PNG with transparent background)
- [ ] Photos of products/team/office
- [ ] List of certifications/licenses (if any)
- [ ] Customer testimonials (name + review)
- [ ] Any existing brochure or catalog

### Placeholder Content (to be replaced)
- Testimonials will use placeholder names until provided
- Product photos will use stock imagery until client provides actual photos

---

## 10. Development Phases

| Phase | Scope | Estimated Timeline |
|-------|-------|--------------------|
| **Phase 1** | Home + Contact page (MVP) | Week 1–2 |
| **Phase 2** | Services + About pages | Week 3 |
| **Phase 3** | Products catalog, SEO setup | Week 4 |
| **Phase 4** | Testing, launch, analytics | Week 5 |

---

## 11. Out of Scope (v1.0)
- E-commerce / online payment
- Customer login portal
- Live chat integration
- Blog/news section (can be added in v2)

---

## 12. Stakeholders

| Role | Person |
|------|--------|
| Business Owner / Client | Ritesh Tiwari |
| Phone | 9274733827 |
| Email | urfiresafetysolution@gmail.com |

---

*End of PRD — UR Fire Safety Solution Website v1.0*
