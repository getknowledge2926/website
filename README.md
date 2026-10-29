# Get Knowledge — Online Course Website

> **"Learn New Skills. Build Your Future."**  
> A complete, modern, responsive website built for the **Get Knowledge** online teaching platform. Currently featuring our flagship 20-day live cohort **AI Development** for **₹199**, mentored by **Nandha Prakash** (Software Developer at Slate AI), with manual UPI QR / Bank payment verification and Google Forms integration.

---

## 🌟 Key Highlights

- **Brand:** **Get Knowledge**
- **Available Course:** **AI Development**
- **Duration:** **20 Days** (Daily live interactive sessions on Google Meet)
- **Course Fee:** **₹199** (One-time, all-inclusive, no hidden charges)
- **Core Topics:** Backend Architecture, LLMs, Agentic AI, Search & Vector Databases, RAG Pipelines, Document Ingestion
- **Mentor:** **Nandha Prakash** (Software Developer at Slate AI)
- **Architecture:** Zero database, zero backend, 100% static hosting on GitHub Pages, Netlify, or Vercel.
- **Single Source of Truth (`js/config.js`):** Easily manage course details, fees, batch dates, UPI ID, and bank details in one clean file.

---

## 🗺️ The Complete Student Journey

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Explore Course & Apply Online                            │
│    Review the 20-day syllabus and submit basic details      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Pay ₹199 via UPI QR Code or Bank Transfer                │
│    Scan QR with GPay/PhonePe/Paytm or transfer via IMPS     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Receive Google Meet Class Link by WhatsApp & Email       │
│    Batch welcome kit & 20-day Google Meet link shared       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
.
├── index.html                  # Home page (Hero, benefits, 20-day AI course feature, 5-phase syllabus)
├── about.html                  # About Us (Mission, vision, 20-day sprint model, mentor bio)
├── courses.html                # Course Catalog (Shows AI Development for ₹199)
├── course-details.html         # Dynamic Course Details (20-day curriculum accordions, outcomes)
├── payment.html                # Payment Instructions (UPI QR, bank transfer, copy buttons, ₹199 fee)
├── contact.html                # Contact Us (WhatsApp direct chat, email, enquiry form)
├── privacy.html                # Privacy Policy
├── terms.html                  # Terms & Conditions
├── refund-policy.html          # Refund Policy
├── cancellation-policy.html    # Cancellation & Deferral Policy
├── css/
│   ├── style.css               # Core design system: Plus Jakarta Sans, variables, components
│   └── responsive.css          # Mobile drawer menu & breakpoints
├── js/
│   ├── config.js               # CENTRAL CONFIG: courses, fee ₹199, payment info, Google Forms
│   ├── main.js                 # Global utilities, mobile drawer, toast feedback, clipboard copy
│   ├── courses.js              # Course catalog renderer & search filtering
│   ├── course-details.js       # Dynamic course details renderer & syllabus accordions
│   ├── payment.js              # Payment fee calculation (₹199), course selector, copy-to-clipboard
│   └── contact.js              # Enquiry form submission via WhatsApp / Email
├── assets/
│   └── images/
│       ├── logo.svg            # Get Knowledge vector logo
│       ├── upi-qr-sample.svg   # Official UPI QR code asset (Get Knowledge)
│       └── instructor-nandha.svg # Avatar illustration for Nandha Prakash (Slate AI)
└── docs/
    ├── GOOGLE_FORMS_SETUP.md   # Step-by-step Google Form + Sheets setup & prefill guide
    ├── PAYMENT_SETUP.md        # Guide for adding actual UPI QR & Bank details
    ├── COURSE_MANAGEMENT.md    # Guide for editing/adding courses & fees in config.js
    ├── DEPLOYMENT_GUIDE.md     # How to publish on GitHub Pages, Netlify, Vercel
    └── TESTING_CHECKLIST.md    # Pre-launch quality assurance checklist
```

---

## 🚀 Quick Start (Local Preview)

Because this website uses standard web APIs, you can preview it immediately:

1. **Direct Browser Open:** Simply double-click [`index.html`](index.html) to open in your browser.
2. **Local Web Server:**
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000` in your web browser.

---

## 🛠️ Step-by-Step Setup Guides

Detailed documentation is available in the `docs/` folder:

1. **[Google Forms & Google Sheets Setup Guide](docs/GOOGLE_FORMS_SETUP.md)**  
   How to build Form 1 (Application) & Form 2 (Payment Reference), enable prefilling, connect to Google Sheets, and set up email notifications.
2. **[Payment Setup & Manual Verification Guide](docs/PAYMENT_SETUP.md)**  
   How to replace placeholder UPI ID, QR code image, and bank transfer details in `js/config.js`.
3. **[Course Management & Fee Updating Guide](docs/COURSE_MANAGEMENT.md)**  
   How to manage the 20-day course, update fees, batch dates, or add future courses.
4. **[Website Deployment & Publishing Guide](docs/DEPLOYMENT_GUIDE.md)**  
   Free 1-click deployment on **GitHub Pages**, **Netlify**, or **Vercel** with custom domain instructions.
5. **[Pre-Launch Quality & Testing Checklist](docs/TESTING_CHECKLIST.md)**  
   Quality checklist to verify links, copy buttons, Google Forms, and mobile responsiveness.

---

## 🔒 Security & Policy Principles

- **No Passwords or Financial Credentials:** We never ask for UPI PINs, ATM PINs, OTPs, or passwords.
- **Manual Verification Only:** Every payment is reconciled against official bank records before a seat is confirmed.
- **No Stored Student Data:** The website does not store sensitive student details in client-side storage or web code.

---

## 📄 License & Attribution

Handcrafted for **Get Knowledge**. Free to customize and adapt for your educational organization.
