# Pre-Launch Quality & Testing Checklist

Use this comprehensive checklist before launching **Get Knowledge** to ensure every student journey, link, payment instruction, and mobile interaction functions flawlessly.

---

## 1. Student Application & Google Forms Flow

- [ ] **Google Form Link Verification:**
  - Verify that clicking "Apply Now" on `index.html` and `courses.html` opens your active Google Application Form.
- [ ] **Course Auto-Prefill Verification:**
  - Verify that `AI Development` is correctly prefilled in the Google Form field.
- [ ] **Submission & Google Sheets Record:**
  - Submit a test response through the application Google Form.
  - Open your linked Google Sheet and verify that a new row appears with the student's name, email, phone, and course.
- [ ] **Email Notifications:**
  - Verify that you receive an instant email notification in your Gmail inbox when a test form is submitted.

---

## 2. Payment Instructions & Manual Verification Flow

- [ ] **Course & Fee Display:**
  - Visit `payment.html`.
  - Verify that **AI Development** is selected and the displayed fee is **₹199**.
- [ ] **Copy-to-Clipboard Buttons:**
  - Click "Copy UPI ID" &rarr; Verify the floating toast message appears ("UPI ID copied to clipboard!") and paste it into a text editor to confirm accuracy.
  - Click "Copy" next to Account Number &rarr; Verify correct account number copied.
  - Click "Copy" next to IFSC Code &rarr; Verify correct IFSC copied.
- [ ] **UPI QR Code Image:**
  - Verify that the QR code renders crisply and clearly on both desktop and mobile screens.
  - Check that the recipient name displays **Get Knowledge**.
- [ ] **Payment Proof Form Submission:**
  - Click "Submit Payment Reference (Google Form)" on `payment.html`.
  - Verify that your payment proof Google Form opens with the course and amount (₹199) prefilled.
  - Submit a test entry with a mock 12-digit UTR (`123456789012`).
  - Confirm the mock entry arrives in your Payment Responses Google Sheet.
- [ ] **Security Advisory Inspection:**
  - Verify that the warning stating **"We will NEVER ask for your UPI PIN, ATM PIN, or banking passwords"** is clearly visible.
  - Verify that the note stating **"Enrollment is confirmed only after manual payment verification"** is present and visible.

---

## 3. Navigation & Links Integrity

- [ ] **Header Navigation:**
  - Test all links: *Home*, *Course*, *About Us*, *Payment & Fees*, *Contact Us*.
  - Verify that the active page displays the active indicator bar underneath the link.
- [ ] **Course Details:**
  - Visit `course-details.html` &rarr; Verify the 20-day syllabus modules, outcomes, daily schedule, and fee (₹199) are displayed.
  - Test the collapsible syllabus accordions: clicking a module header expands its topics, clicking another closes the previous one.
- [ ] **WhatsApp & Email Support Links:**
  - Click the "WhatsApp Admissions" buttons &rarr; Verify WhatsApp Web or app opens with the pre-formatted greeting message for Get Knowledge.
  - Click the email links &rarr; Verify your mail client opens with the correct recipient address.

---

## 4. Mobile & Responsive Layout Testing

- [ ] **Mobile Drawer Navigation:**
  - Open on a mobile device or responsive mode in DevTools.
  - Tap the hamburger menu button &rarr; Verify drawer slides in smoothly.
  - Tap a navigation link or close (×) button &rarr; Verify drawer closes cleanly.
- [ ] **Mobile Course Card & Payment Card:**
  - Verify that the AI Development course card, fee badge (₹199), UPI QR code, and bank details scale smoothly without overflow.
