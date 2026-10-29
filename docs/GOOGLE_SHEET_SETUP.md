# Google Sheet Real-Time Integration Guide

This guide explains how to automatically log every student application submitted on the **Get Knowledge** website directly into your own private **Google Sheet**.

---

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name the sheet: **Get Knowledge - Course Applications**.
3. (Optional) Set the first sheet tab name to `Applications`.

---

## Step 2: Open the Apps Script Editor

1. In your Google Sheet, click **Extensions** in the top menu bar.
2. Select **Apps Script**.
3. Erase any code currently inside the editor window (`myFunction()`).

---

## Step 3: Paste This Web App Script

Paste the following script into the Apps Script editor:

```javascript
/**
 * Get Knowledge — Automated Application Logger & UTR Verification Engine
 * 1. Checks for duplicate UPI Reference Numbers (UTR)
 * 2. Informs applicant if duplicate UTR is detected
 * 3. Appends new applications into this Google Sheet (downloadable as .xlsx anytime)
 * 4. Automatically sends greeting confirmation email from getknowledge2026@gmail.com
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create styled header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Applicant ID",
        "Full Name",
        "Phone Number",
        "WhatsApp Number",
        "Email Address",
        "Course",
        "Fee (INR)",
        "Batch Timing",
        "Payment Status",
        "UPI Reference / UTR",
        "Screenshot File Name",
        "Verification Status"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0c2340");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Parse incoming JSON data
    var data = JSON.parse(e.postData.contents);
    var newUtr = (data.utr || "").trim();
    var isPaymentDone = (data.paymentStatus || "").toLowerCase().indexOf("yes") !== -1 || (newUtr && newUtr.toUpperCase() !== "N/A");
    
    // 1. Compare UPI reference number with existing entries
    if (isPaymentDone && newUtr && newUtr.toUpperCase() !== "N/A") {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        // Column 11 is "UPI Reference / UTR"
        var utrRange = sheet.getRange(2, 11, lastRow - 1, 1).getValues();
        for (var i = 0; i < utrRange.length; i++) {
          var existingUtr = String(utrRange[i][0] || "").trim().toUpperCase();
          if (existingUtr === newUtr.toUpperCase()) {
            return ContentService
              .createTextOutput(JSON.stringify({
                status: "duplicate",
                message: "This UPI Reference Number (" + newUtr + ") has already been registered in our system. Please check your transaction reference or contact our admissions team on WhatsApp at +91 96262 61123."
              }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
    }
    
    // 2. If nothing matches, append new row to Sheet
    sheet.appendRow([
      new Date(),
      data.applicantId || "",
      data.name || "",
      data.phone || "",
      data.whatsapp || data.phone || "",
      data.email || "",
      data.course || "AI Development",
      data.fee || 199,
      data.batch || "",
      data.paymentStatus || "",
      data.utr || "N/A",
      data.screenshotFileName || "None Attached",
      "Pending Manual Verification"
    ]);
    
    // 3. Send automatic confirmation email to applicant
    if (data.email) {
      try {
        var emailSubject = "Welcome to Get Knowledge — AI Development Live Cohort Application Confirmation (" + (data.applicantId || "Registered") + ")";
        var emailBody = "Dear " + (data.name || "Student") + ",\n\n" +
          "Greetings from Get Knowledge!\n\n" +
          "Thank you for applying for the 20-Day Live Cohort in AI Development. We have received your application successfully.\n\n" +
          "Application Summary:\n" +
          "• Application ID: " + (data.applicantId || "N/A") + "\n" +
          "• Course: AI Development (20 Days Live Cohort)\n" +
          "• Course Fee: ₹199\n" +
          "• WhatsApp Number: " + (data.whatsapp || data.phone || "") + "\n" +
          "• Payment Status: " + (data.paymentStatus || "") + "\n" +
          "• UPI Reference / UTR: " + (data.utr || "N/A") + "\n\n" +
          "Next Steps:\n" +
          "Our accounts desk will perform manual verification of your transaction reference.\n" +
          "Once manual verification is done, our team will contact you directly on WhatsApp and you will be added to the batch WhatsApp group with your private Google Meet class links and onboarding kit.\n\n" +
          "If you have any questions, feel free to reply directly to this email or chat with us:\n" +
          "• Email: getknowledge2026@gmail.com\n" +
          "• WhatsApp / Phone: +91 96262 61123\n\n" +
          "Warm regards,\n" +
          "Admissions Team\n" +
          "Get Knowledge\n" +
          "getknowledge2026@gmail.com | +91 96262 61123";

        GmailApp.sendEmail(data.email, emailSubject, emailBody, {
          name: "Get Knowledge Admissions",
          replyTo: "getknowledge2026@gmail.com"
        });
      } catch (mailErr) {
        Logger.log("Email dispatch log: " + mailErr);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Application recorded successfully! A confirmation email has been dispatched to your email address."
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 4: Deploy as a Web App

1. In the top right corner of Apps Script, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (**Select type**) and choose **Web app**.
3. Fill in the fields:
   - **Description**: `Get Knowledge Webhook`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: allows the website form to submit without requiring student login)*
4. Click **Deploy**.
5. Grant permissions if prompted by Google (click *Advanced* > *Go to (project) (unsafe)* > *Allow*).
6. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

## Step 5: Paste Your Web App URL into `js/config.js`

Open `js/config.js` in your project and update the `googleSheet` section:

```javascript
  googleSheet: {
    scriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec",
    autoSaveLocal: true
  },
```

That's it! Every time a student fills out the Apply Form:
1. It instantly appends a new row to your Google Sheet with their name, phone, email, batch, payment status, and UTR.
2. It increases the live applicant counter.
3. It keeps a local backup copy in the student's browser storage.
