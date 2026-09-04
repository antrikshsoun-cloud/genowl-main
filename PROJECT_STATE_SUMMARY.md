# Genowl Studio — Project State & Conversation Checkpoint

**Date:** September 4, 2026  
**Repository:** [github.com/antrikshsoun-cloud/genowl-main.git](https://github.com/antrikshsoun-cloud/genowl-main.git)  
**Production Staging:** `springgreen-horse-473302.hostingersite.com`  
**Master PDF Blueprint:** `c:\Users\Antriksh\Downloads\Genowl_Studio_Architectural_Blueprint.pdf`

---

## 1. Accomplished Features & Architecture

### Core Philosophy & Brand
- **Motto:** *"In today's world everybody knows that for almost every service possible there is an AI tool. But people don't have time to master every tool. All you have to do is buy our service and tell us what to build — the rest is on us."*
- **Brand Identity:** Golden Owl insignia, dark luxury obsidian palette (`#060a07`, `#0d140f`, `#f7cc46`, `#c6f554`).
- **Pricing Tiers:**
  - 2D Website: **$500** Flat
  - 3D Interactive WebGL: **$2,500** Flat
  - Rapid Sprints: **$99** Flat (Video Generation, Personalized AI, Content Creation)
  - 100% Client Intellectual Property (IP) transfer within 48 - 72 hours.

### Security & Access Control
- **Master Admin Password:** Permanently locked to `CristianoMessi@2005`.
- **Zero Setup Vulnerability:** The initial setup screen has been permanently removed; all domains, devices, and sessions immediately require the master password.
- **Web Password Alteration Disabled:** Password editing forms removed from UI to guarantee zero browser-side overwriting.
- **Admin Access:** Available symmetrically on Desktop Header (`[Lock] Admin`), Mobile Navigation Drawer, and Footers.
- **Mandatory User Login:** Both Orders and Contact inquiries strictly require a logged-in user account. Anonymous submissions are blocked to prevent spam and bind tickets directly to verified client accounts.

### Lead & Inquiry Capture
- **Validated Phone / WhatsApp Capture:** Added format-validated phone input with country code support (`+91 98765 43210`) that runs glitch-free.
- **Dual-Channel Lead Forwarding:**
  - FormSubmit direct zero-config webhook delivers every inquiry and problem report directly to `genowlai@gmail.com`.
  - Resend REST API integration fallback.
  - Branded client confirmation receipts featuring the official Golden Owl logo.

### Cloud Backend (Supabase PostgreSQL)
- **Tables Configured:**
  - `genowl_inquiries`: Captures Ticket ID, Name, Email, **Phone Number**, Service Category, Message, and Timestamp.
  - `genowl_orders`: Captures Order ID, Service, Name, Email, Project Brief, Reference URLs, Turnaround Speed, Amount, and Payment Status.
  - `genowl_users`: Registered customer directory with email verification state.
- **Supabase Credentials Connected:**
  - Project URL: `https://bxkvumylvmyehktrhant.supabase.co`
  - Anon Public Key active.

### Mobile Phone Ergonomics
- Responsive thumb navigation dock (`MobileBottomNav.tsx`).
- Natural vertical fluid section flows (`py-6 sm:py-10 md:py-16 md:min-h-screen`) eliminating awkward gaps.
- 2D/3D selector buttons optimized for narrow smartphone screens.

---

## 2. Where We Paused: Next Steps for Payment Methods

When you return to continue work on the payment integration, here is the exact roadmap:

1. **Razorpay Live Activation:**
   - Add your live Razorpay Key ID and Secret Key in the Admin Portal under the **"Razorpay & Supabase"** tab.
   - Switch from test sandbox to live payments for UPI (GPay, PhonePe), Indian Debit/Credit Cards, and Net Banking.
2. **International Checkout (Optional / Next Phase):**
   - Connect Stripe or PayPal if international credit card checkout without Indian phone numbers is required.
3. **Automated Invoice Receipts:**
   - Connect automated PDF invoice generation upon successful transaction completion.

---

*All files, documentation, and the PDF blueprint are safely saved and pushed to GitHub main (`f9da5c7`). Have a great break!*
