# Google Forms & Google Sheets Setup Guide

This guide provides step-by-step instructions for setting up **Google Forms** and connecting them to **Google Sheets** for **Get Knowledge**. This setup allows you to collect course applications and payment reference proofs without running a backend server or database.

---

## Overview of the Two Google Forms

| Form | Purpose | Key Fields | Linked To Website |
| :--- | :--- | :--- | :--- |
| **Form 1: Student Application Form** | Captures student intent, contact info, and course | Name, Email, Phone/WhatsApp, Course: AI Development | "Apply Now" buttons across the website |
| **Form 2: Payment Reference Form** | Captures 12-digit UTR, payment screenshot, date, and fee (₹199) | Name, Email, Course, Amount (₹199), 12-Digit UTR, Screenshot | "Submit Payment Proof" on `payment.html` |

---

## Part 1: Setting Up Form 1 — Student Application Form

### Step 1.1: Create the Form
1. Go to [Google Forms](https://forms.google.com) and click **Blank form**.
2. Title the form: `Get Knowledge - Course Application Form`.
3. Add a description:
   > *"Thank you for your interest in Get Knowledge! Please fill out this form to apply for the 20-Day AI Development live cohort (Fee: ₹199). After submitting, our admissions team will verify your details and guide you through the manual payment process."*

### Step 1.2: Add Form Questions
Create the following questions (mark them as **Required**):

1. **Full Name** (Short answer) — Required
2. **Email Address** (Short answer, with Email validation enabled) — Required
3. **WhatsApp / Phone Number** (Short answer) — Required
   - *Description:* "Please provide a valid 10-digit number. We share Google Meet links via WhatsApp."
4. **Selected Course** (Short answer) — Required
   - Value: `AI Development`
   - *Tip:* Our website automatically prefills this field when the student clicks "Apply Now"!
5. **Preferred Batch Timing** (Multiple choice) — Required
   - Option A: *Daily Evening (7:30 PM - 9:00 PM IST)*
6. **Current Background / Occupation** (Multiple choice or Short answer) — Optional
   - Options: *College Student, Working Professional, Career Switcher, Entrepreneur, Other*
7. **Any questions or specific learning goals?** (Paragraph) — Optional

### Step 1.3: Enable Course Name Auto-Prefill
To allow the website to automatically fill in the course name:
1. In Google Forms editor, click the **three dots (More)** menu in the top-right corner.
2. Select **Get pre-filled link**.
3. In the page that opens, type `AI Development` into the **Selected Course** field.
4. Click **Get link** at the bottom, then click **Copy link**.
5. Inspect the copied link. It will look like this:
   ```text
   https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.123456789=AI+Development
   ```
6. Take note of two parts:
   - **Base Form URL:** `https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform`
   - **Entry ID:** `entry.123456789`
7. Open `js/config.js` in your website code and update:
   ```javascript
   googleForms: {
     applicationFormUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform",
     applicationCourseEntryId: "entry.123456789",
     ...
   }
   ```

---

## Part 2: Setting Up Form 2 — Payment Proof & Reference Form

### Step 2.1: Create the Form
1. Go to [Google Forms](https://forms.google.com) and create another **Blank form**.
2. Title the form: `Get Knowledge - Payment Reference & UTR Submission`.
3. Add a description:
   > *"Submit this form AFTER completing your fee payment of ₹199 via our official UPI QR or Bank Transfer. Our accounts desk will manually verify your 12-digit UTR number against our bank records within 12-24 hours."*

### Step 2.2: Add Questions
1. **Full Name** (Short answer) — Required
2. **Email Address** (Short answer) — Required (must match your application email)
3. **Phone / WhatsApp Number** (Short answer) — Required
4. **Selected Course** (Short answer) — Required (AI Development)
5. **Fee Amount Paid (in ₹)** (Short answer) — Required (₹199)
6. **Payment Mode Used** (Multiple choice) — Required
   - Option A: *UPI QR Code (GPay / PhonePe / Paytm / BHIM)*
   - Option B: *Bank Transfer (IMPS / NEFT / RTGS)*
7. **12-Digit UTR / UPI Transaction ID / Bank Reference Number** (Short answer) — Required
   - *Description:* "Found on your payment confirmation screen (12 digits)."
8. **Date of Payment** (Date) — Required
9. **Screenshot of Payment Confirmation** (File upload) — Required
   - *Note: File upload requires users to sign in with a Google account.*
10. **Sender Bank Name or UPI App Used** (Short answer) — Optional

### Step 2.3: Connect Entry IDs to `js/config.js`
1. Use the **Get pre-filled link** feature again to identify the entry IDs for:
   - Course name (`entry.XXXXX`)
   - Amount paid (`entry.YYYYY`)
2. Update `js/config.js`:
   ```javascript
   paymentProofFormUrl: "https://docs.google.com/forms/d/e/YOUR_PAYMENT_FORM_ID/viewform",
   paymentCourseEntryId: "entry.XXXXX",
   paymentAmountEntryId: "entry.YYYYY"
   ```

---

## Part 3: Connecting Google Forms to Google Sheets

To view and manage all student applications and payments in real-time spreadsheets:

1. Open your Google Form in the editor.
2. Click the **Responses** tab at the top.
3. Click the green **Link to Sheets** icon.
4. Select **Create a new spreadsheet** (e.g., `Get Knowledge - Applications (Responses)`).
5. Click **Create**.
6. A new Google Sheet will open immediately. Every time a student submits the form, a new row appears automatically in real time!
7. Repeat this for both **Form 1** (Applications) and **Form 2** (Payment Proofs).

---

## Part 4: Setting Up Instant Email Notifications

Never miss an application or payment submission:

1. Open the connected **Google Sheet**.
2. In the top menu, navigate to: **Tools** &rarr; **Notification rules** (or **Notification settings**).
3. Choose:
   - *Notify me at [your email] when:* **A user submits a form**.
   - *Notify me with:* **Email - right away**.
4. Click **Save** and **Done**.
