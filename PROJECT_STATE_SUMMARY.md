# Genowl Studio — Project State & Conversation Checkpoint

**Date:** September 5, 2026  
**Repository:** [github.com/antrikshsoun-cloud/genowl-main.git](https://github.com/antrikshsoun-cloud/genowl-main.git)  
**Latest Git Commit:** `be779c0` (pushed to `origin/main`)  
**Production Staging:** `springgreen-horse-473302.hostingersite.com`  
**Master PDF Blueprint:** `c:\Users\Antriksh\Downloads\Genowl_Studio_Architectural_Blueprint.pdf`

---

## 1. Accomplished Features & System Architecture

### Core Philosophy & Brand Identity
- **Motto:** *"In today's world everybody knows that for almost every service possible there is an AI tool. But people don't have time to master every tool. All you have to do is buy our service and tell us what to build — the rest is on us."*
- **Visuals:** Golden Owl insignia, obsidian dark palette (`#060a07`, `#0d140f`, `#f7cc46`, `#c6f554`).
- **Pricing Tiers:**
  - 2D Website: **$500** Flat
  - 3D Interactive WebGL: **$2,500** Flat
  - Rapid Creative Sprints: **$99** Flat (AI Video, Personalized AI, Content Creation)
  - 100% Client Intellectual Property (IP) transfer within 48 - 72 hours.

### Security & Navigation Ergonomics
- **Master Admin Password:** Permanently locked to `CristianoMessi@2005`.
- **Navbar Clean-Up:** Admin button **completely removed from top Navbar** (both desktop header and mobile navigation drawer).
- **Admin Access Exclusively in Footer:** Protected by password modal with 7-day authentication sessions.
- **Hostinger Webmail Quick Access:** Direct link to [mail.hostinger.com](https://mail.hostinger.com) inside Admin Portal for quick inbox triage.
- **Mandatory User Login:** Both Orders and Reports strictly require a logged-in account to bind tickets directly to verified client accounts.

### Official Report & Inquiry Desk (`ContactPage.tsx`)
- **Official Report Issuance System:**
  - 📋 **Project Scope & Brief Report**: 2D, 3D WebGL, AI Video, Personalized AI, or Full Custom Architecture.
  - ⚠️ **Issue & Bug Report**: Website bugs, UI glitches, revision requests, account assistance, or urgent blockers.
  - 💬 **Studio Consultation & Inquiry**: Enterprise IP inquiries, consultations, partnerships, or custom quotations.
- **Validated Contact Capture:** Phone / WhatsApp input with country code formatting validation.
- **Priority SLAs:** Select between *Standard (24h)*, *High Priority (2-4h)*, and *Blocker / Urgent*.
- **Tracking Ticket Generation:** Automatically issues `#PRJ-XXXXXX`, `#PRB-XXXXXX`, or `#INQ-XXXXXX`.
- **Pre-Filled Email App Backup:** Confirmation receipt features a 1-click button to open Gmail/Hostinger/Outlook with the pre-composed report.

### 4-Tier Redundant Email Delivery Pipeline
1. **Primary Hostinger Corporate Mail:** Dispatches to `support@genowl.tech` with CC to `genowlai@gmail.com`.
2. **Operations Backup Gmail:** Parallel dispatch to `genowlai@gmail.com` with CC to `support@genowl.tech`.
3. **Supabase Cloud PostgreSQL Database:** Real-time persistence to `genowl_inquiries` before email dispatch, ensuring zero lost leads.
4. **Pre-Filled `mailto:` Backup:** Client-side 1-click fallback directly launches the user's native email software.

### Automated Hostinger Deployment
- **`package.json` Postinstall Hook:** Added `"postinstall": "vite build"` so Hostinger builds fresh `dist/` bundles automatically upon redeployment.
- **Vite Build Verification:** Production build passes with 0 errors (`dist/` generated).

---

## 2. Where We Paused & Next Steps

When you're ready to resume work, here is the exact roadmap:

1. **Hostinger 1-Click Redeploy:**
   - In Hostinger hPanel -> Websites -> `springgreen-horse-473302.hostingersite.com`, click **"Redeploy"** to push commit `be779c0` live to production.
2. **FormSubmit One-Time Activation:**
   - Open `support@genowl.tech` (via Hostinger Webmail at [mail.hostinger.com](https://mail.hostinger.com)) and `genowlai@gmail.com` to click "Activate Form" once.
3. **Razorpay Live Activation:**
   - Add your live Razorpay Key ID and Secret Key in the Admin Portal under the **"Razorpay & Supabase"** tab.
4. **International Checkout (Stripe / PayPal):**
   - Connect international payment processors for global clients.
5. **Automated PDF Invoices:**
   - Connect automated client invoice downloads upon transaction completion.

---

*All files, documentation, and source code are safely saved, built, committed, and pushed to GitHub main (`be779c0`). Everything is secured!*
