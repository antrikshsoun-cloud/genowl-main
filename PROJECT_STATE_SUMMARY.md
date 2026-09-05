# Genowl Studio — Project State & Conversation Checkpoint

**Date:** September 6, 2026  
**Repository:** [github.com/antrikshsoun-cloud/genowl-main.git](https://github.com/antrikshsoun-cloud/genowl-main.git)  
**Latest Git Commit:** `93c9e2c` (pushed to `origin/main`)  
**Production Staging:** `springgreen-horse-473302.hostingersite.com`  
**Master PDF Blueprint:** `c:\Users\Antriksh\Downloads\Genowl_Studio_Architectural_Blueprint.pdf`

---

## 1. Accomplished Features & System Architecture

### Outbound Transactional Mailer (Google Apps Script — 100% Free Forever)
- **Primary Sender:** All verification OTP security codes, official welcome letters, and inquiry tickets are dispatched directly from `genowlai@gmail.com`.
- **Google Cloud Webhook:** `https://script.google.com/macros/s/AKfycbwY6ycQQx1qV2C0dhNR686LeKWjGezYQ7kgSmUR2babI6dTIdmpK19etUdkBsSoqT-AfQ/exec`.
- **Zero Cost & No Subscriptions:** 500 free emails per day handled directly by Google's infrastructure with 100% genuine Gmail DKIM/SPF deliverability.
- **Admin Email Panel:** Added real-time Google Cloud status indicator, editable webhook URL field, and 1-click **"Send Test Email"** button.

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

### Redundant Delivery Pipeline
1. **Google Apps Script Dispatch:** Instant transactional delivery from `genowlai@gmail.com`.
2. **Primary Hostinger Corporate Mail:** Dispatches to `support@genowl.tech` with CC to `genowlai@gmail.com`.
3. **Operations Backup Gmail:** Parallel dispatch to `genowlai@gmail.com` with CC to `support@genowl.tech`.
4. **Supabase Cloud PostgreSQL Database:** Real-time persistence to `genowl_inquiries` before email dispatch, ensuring zero lost leads.
5. **Pre-Filled `mailto:` Backup:** Client-side 1-click fallback directly launches the user's native email software.

---

## 2. Where We Paused & Next Steps

When you're ready to resume work, here is the exact roadmap:

1. **Hostinger 1-Click Redeploy:**
   - In Hostinger hPanel -> Websites -> `springgreen-horse-473302.hostingersite.com`, click **"Redeploy"** to push commit `93c9e2c` live to production.
2. **Live Sign-Up Verification Test:**
   - Register a new client account on the live website and watch the 6-digit OTP and Welcome message land directly in the client inbox from `genowlai@gmail.com`.
3. **Razorpay Live Activation:**
   - Add your live Razorpay Key ID and Secret Key in the Admin Portal under the **"Razorpay & Supabase"** tab.
4. **International Checkout (Stripe / PayPal):**
   - Connect international payment processors for global clients.
5. **Automated PDF Invoices:**
   - Connect automated client invoice downloads upon transaction completion.

---

*All files, documentation, and source code are safely saved, built, committed, and pushed to GitHub main (`93c9e2c`). Everything is secured!*

