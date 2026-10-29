# Payment Setup & Manual Verification Guide

This guide explains how to configure your real **UPI ID, UPI QR Code, and Bank Account details** for **Get Knowledge**, and how to operate the manual verification workflow for the **₹199** course fee.

---

## 1. Where to Update Payment Details

All payment information is centralized in a single configuration file:
👉 **[`js/config.js`](../js/config.js)**

Open `js/config.js` and locate the `payment` section:

```javascript
payment: {
  // 1. UPI QR & ID Details
  upiId: "YOUR_ACTUAL_UPI_ID@bank", // e.g., getknowledge@okhdfcbank or business@upi
  payeeName: "Get Knowledge (Verified Account)", // The exact name displayed in UPI apps
  qrImagePath: "assets/images/upi-qr-sample.svg", // Path to your QR code image file

  // 2. Bank Transfer (IMPS / NEFT / RTGS) Details
  bankDetails: {
    accountHolder: "Get Knowledge",
    bankName: "HDFC Bank / ICICI / SBI / Axis",
    accountNumber: "YOUR_ACTUAL_ACCOUNT_NUMBER",
    accountType: "Current Account" or "Savings Account",
    ifscCode: "YOUR_BANK_IFSC_CODE",
    branch: "Branch Name, City"
  },

  // 3. Verification timelines
  verificationTurnaround: "12 to 24 hours",
  securityNotice: "We will NEVER ask for your UPI PIN, ATM PIN, OTP, net banking password, or card CVV. If anyone asks for your PIN to receive funds, it is a scam.",
  manualNotice: "Enrollment is not automated. Our team manually verifies every transaction reference with our bank before sending your batch invite."
}
```

---

## 2. Adding Your Official UPI QR Code Image

### Step 2.1: Download or Export Your QR Code
You can obtain your official UPI QR code from:
- **Google Pay for Business** app &rarr; Profile &rarr; QR Code &rarr; Save/Share Image
- **PhonePe Business** app &rarr; Manage QR Codes &rarr; Download QR
- **Paytm for Business** app &rarr; All-in-one QR Code &rarr; Download
- **Your Bank's Mobile Banking App** &rarr; UPI / BHIM section &rarr; Receive Money / View QR

### Step 2.2: Replace the Placeholder Image
1. Name your exported QR image file `upi-qr-sample.svg` (or `.png` / `.jpg`).
2. Move the image file into the directory:
   ```text
   assets/images/
   ```
3. If using `.png` or `.jpg`, update in `js/config.js`:
   ```javascript
   qrImagePath: "assets/images/my-official-qr.png",
   ```
4. Refresh `payment.html` in your browser to verify that your QR code displays crisply.

---

## 3. Strict Security Rules & Compliance

1. **NEVER Request UPI PINs or Passwords:**
   - UPI PIN is ONLY entered by a user when SENDING money, never when receiving money.
   - We have placed clear security warnings on `payment.html` and the footer to protect your students from common phishing scams.
2. **Never Claim Automatic Verification:**
   - Do not claim that course access is instant or automated. Students appreciate knowing that a real human reviews their application and verifies payments.
3. **Double Verification Check:**
   - Always verify the 12-digit UTR in your bank statement/UPI merchant app for ₹199 before sending the Google Meet link.

---

## 4. The 6-Step Manual Enrollment Workflow

```
[Student Visits Website]
         │
         ▼
[Explores 20-Day AI Development Course]
         │
         ▼
[Applies via Google Form] ──────────► [Record in Application Google Sheet]
         │
         ▼
[Pays ₹199 via UPI QR or Bank]
         │
         ▼
[Submits 12-digit UTR on Payment Google Form] ──► [Record in Payment Google Sheet]
         │
         ▼
[Accounts Team checks Bank Statement] ──► [Matches UTR & ₹199 Amount]
         │
         ▼
[Status updated to "Verified" in Sheet]
         │
         ▼
[Admissions sends Google Meet link via WhatsApp & Email]
```

---

## 5. How to Reconcile Payments in 30 Seconds

1. Open your **Payment Responses Google Sheet**.
2. Note the student's **Name**, **AI Development**, **₹199**, and **12-digit UTR**.
3. Open your mobile banking app or UPI merchant statement (e.g. PhonePe Business, GPay).
4. Search for the **12-digit UTR**.
5. Once you confirm the amount was credited to your account:
   - Mark the row status as `VERIFIED`.
   - Send the batch welcome WhatsApp message and email containing the Google Meet class link and schedule.
