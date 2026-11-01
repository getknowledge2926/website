# 📊 Google Sheet Database & Real-Time Sync Guide

This guide connects your **Get Knowledge Admin Portal** and **Website Registration Forms** directly to a live **Google Sheet** stored permanently in your Google Drive.

### 🌟 What this enables:
1. **Permanent Cloud Storage:** Applications and changes are never lost when Render restarts or redeploys.
2. **Full Admin Control:** You can view, add, update, and **permanently delete** applicants directly from `https://getknowledge.onrender.com/admin` — it automatically deletes them from your Google Sheet in real time!
3. **Automated Welcome Emails:** Automatically sends the official application confirmation email from `getknowledge2026@gmail.com` to every applicant.
4. **Download .XLSX:** Download the latest up-to-the-second Excel file from the admin dashboard anytime.

---

## 🛠️ 3-Minute Setup Instructions

### Step 1: Create Your Google Sheet
1. In your browser (logged in as `getknowledge2026@gmail.com`), open:  
   👉 **[https://sheets.new](https://sheets.new)**
2. Name your spreadsheet at the top left:  
   **`Get Knowledge - Course Applications`**

---

### Step 2: Open Apps Script Inside the Sheet
1. In the Google Sheet top menu, click **Extensions &rarr; Apps Script**.
2. Erase whatever default code is inside the editor (`function myFunction() {...}`).

---

### Step 3: Paste This All-in-One Database & Email Engine Script

Paste this exact script:

```javascript
/**
 * ==============================================================================
 * Get Knowledge — Google Sheet Full Database & Email Engine
 * ==============================================================================
 * 1. doGet: Returns all student applications as JSON for the Admin Portal
 * 2. doPost 'apply': Appends student row, checks duplicate UTR, sends confirmation email
 * 3. doPost 'add': Appends a new applicant row from Admin Portal
 * 4. doPost 'update': Updates applicant status and details in Google Sheet
 * 5. doPost 'delete': Permanently deletes an applicant row by Applicant ID
 * 6. doPost 'sendEmail': Dispatches emails directly from getknowledge2026@gmail.com
 */

var HEADERS = [
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
  "Screenshot File",
  "Verification Status"
];

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#0c2340");
    headerRange.setFontColor("#ffffff");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return jsonResponse({ count: 0, headers: HEADERS, applications: [] });
    }
    
    var values = sheet.getRange(1, 1, lastRow, HEADERS.length).getValues();
    var headers = values[0];
    var apps = [];
    
    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      var record = { _rowIndex: r + 1 };
      for (var c = 0; c < headers.length; c++) {
        var h = String(headers[c] || "");
        var val = row[c];
        if (val instanceof Date) {
          val = val.toISOString();
        } else if (val === null || val === undefined) {
          val = "";
        }
        record[h] = String(val);
      }
      var sVal = (record["Screenshot File"] || "").trim();
      record["_hasScreenshot"] = sVal !== "" && sVal.toLowerCase() !== "none" && sVal.toLowerCase() !== "none attached";
      record["_screenshotUrl"] = sVal;
      apps.push(record);
    }
    
    return jsonResponse({ count: apps.length, headers: headers, applications: apps });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = JSON.parse(e.postData.contents);
    var action = data.action || "";

    // 1. Standalone email dispatch fallback
    if (action === "sendEmail" || (data.to && data.subject && !data.applicantId && !action)) {
      MailApp.sendEmail({
        to: data.to,
        subject: data.subject,
        body: data.body || "",
        htmlBody: data.html || data.body || "",
        name: "Get Knowledge Admissions",
        replyTo: "getknowledge2026@gmail.com"
      });
      return jsonResponse({ status: "success", message: "Email sent" });
    }

    // 2. Fetch all rows
    if (action === "getAll") {
      return doGet(e);
    }

    // 3. Delete an applicant permanently by applicantId
    if (action === "delete") {
      var targetId = String(data.applicantId || "").trim();
      if (!targetId) {
        return jsonResponse({ status: "error", message: "applicantId is required for deletion" });
      }
      var lastRow = sheet.getLastRow();
      var foundRow = null;
      if (lastRow > 1) {
        var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < idValues.length; i++) {
          if (String(idValues[i][0]).trim() === targetId) {
            foundRow = i + 2;
            break;
          }
        }
      }
      if (foundRow) {
        sheet.deleteRow(foundRow);
        return jsonResponse({ status: "success", message: "Deleted applicant " + targetId + " from Google Sheet" });
      } else {
        return jsonResponse({ status: "error", message: "Applicant " + targetId + " not found in Google Sheet" });
      }
    }

    // 4. Update an applicant's fields by applicantId
    if (action === "update") {
      var targetId = String(data.applicantId || "").trim();
      var fields = data.fields || {};
      if (!targetId) {
        return jsonResponse({ status: "error", message: "applicantId is required for update" });
      }
      var lastRow = sheet.getLastRow();
      var foundRow = null;
      if (lastRow > 1) {
        var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < idValues.length; i++) {
          if (String(idValues[i][0]).trim() === targetId) {
            foundRow = i + 2;
            break;
          }
        }
      }
      if (foundRow) {
        if (fields["Verification Status"] || fields.verificationStatus) {
          sheet.getRange(foundRow, 13).setValue(fields["Verification Status"] || fields.verificationStatus);
        }
        if (fields["Payment Status"] || fields.paymentStatus) {
          sheet.getRange(foundRow, 10).setValue(fields["Payment Status"] || fields.paymentStatus);
        }
        if (fields["Batch Timing"] || fields.batch) {
          sheet.getRange(foundRow, 9).setValue(fields["Batch Timing"] || fields.batch);
        }
        if (fields["Full Name"] || fields.name) {
          sheet.getRange(foundRow, 3).setValue(fields["Full Name"] || fields.name);
        }
        if (fields["Phone Number"] || fields.phone) {
          sheet.getRange(foundRow, 4).setValue(fields["Phone Number"] || fields.phone);
        }
        if (fields["WhatsApp Number"] || fields.whatsapp) {
          sheet.getRange(foundRow, 5).setValue(fields["WhatsApp Number"] || fields.whatsapp);
        }
        if (fields["Email Address"] || fields.email) {
          sheet.getRange(foundRow, 6).setValue(fields["Email Address"] || fields.email);
        }
        if (fields["UPI Reference / UTR"] || fields.utr) {
          sheet.getRange(foundRow, 11).setValue(fields["UPI Reference / UTR"] || fields.utr);
        }
        if (fields["Screenshot File"] || fields.screenshotFileName) {
          sheet.getRange(foundRow, 12).setValue(fields["Screenshot File"] || fields.screenshotFileName);
        }
        return jsonResponse({ status: "success", message: "Updated applicant " + targetId + " in Google Sheet" });
      } else {
        return jsonResponse({ status: "error", message: "Applicant " + targetId + " not found" });
      }
    }

    // 5. Add or Apply (New Application)
    var applicantId = data.applicantId || ("GK" + Math.floor(100000 + Math.random() * 900000));
    var newUtr = String(data.utr || "").trim();

    // Check duplicate UTR if paying
    if (newUtr && newUtr.toUpperCase() !== "N/A" && newUtr.toUpperCase() !== "NONE") {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var utrValues = sheet.getRange(2, 11, lastRow - 1, 1).getValues();
        var idValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (var i = 0; i < utrValues.length; i++) {
          if (String(utrValues[i][0]).trim().toUpperCase() === newUtr.toUpperCase()) {
            return jsonResponse({
              status: "duplicate",
              message: "This UPI Reference Number (" + newUtr + ") has already been registered for applicant " + idValues[i][0] + "."
            });
          }
        }
      }
    }

    // Append new row to Google Sheet
    sheet.appendRow([
      new Date().toISOString(),
      applicantId,
      data.name || "",
      data.phone || "",
      data.whatsapp || data.phone || "",
      data.email || "",
      data.course || "AI Development",
      data.fee || 199,
      data.batch || "Daily Evening (7:30 PM - 9:00 PM IST)",
      data.paymentStatus || "Yes, Payment Done",
      newUtr || "N/A",
      data.screenshotFileName || "None Attached",
      data.verificationStatus || "Pending Manual Verification"
    ]);

    // Send confirmation email to applicant
    if (data.email) {
      try {
        var subject = "Welcome to Get Knowledge — AI Development Live Cohort Application Confirmation (" + applicantId + ")";
        var body = "Dear " + (data.name || "Student") + ",\n\n" +
          "Greetings from Get Knowledge!\n\n" +
          "Thank you for applying for the 20-Day Live Cohort in AI Development. We have received your application successfully.\n\n" +
          "Application Summary:\n" +
          "• Application ID: " + applicantId + "\n" +
          "• Course: AI Development (20 Days Live Cohort)\n" +
          "• Course Fee: ₹199\n" +
          "• WhatsApp Number: " + (data.whatsapp || data.phone || "") + "\n" +
          "• Payment Status: " + (data.paymentStatus || "Yes, Payment Done") + "\n" +
          "• UPI Reference / UTR: " + (newUtr || "N/A") + "\n\n" +
          "Next Steps:\n" +
          "Our accounts desk will perform manual verification of your transaction reference.\n" +
          "Once manual verification is done, our team will contact you directly on WhatsApp (+91 " + (data.whatsapp || data.phone || "") + ") and you will be added to the batch WhatsApp group with your private Google Meet class links and onboarding kit.\n\n" +
          "Admissions Helpline: +91 96262 61123 | getknowledge2026@gmail.com\n\n" +
          "Warm regards,\nAdmissions Team\nGet Knowledge";

        MailApp.sendEmail({
          to: data.email,
          subject: subject,
          body: body,
          name: "Get Knowledge Admissions",
          replyTo: "getknowledge2026@gmail.com"
        });
      } catch (mailErr) {
        Logger.log("Email dispatch error: " + mailErr);
      }
    }

    return jsonResponse({
      status: "success",
      applicantId: applicantId,
      message: "Application recorded in Google Sheet and confirmation email sent!"
    });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### Step 4: Deploy as a Web App

1. Click the blue **Deploy** button (top right) &rarr; select **New deployment**.
2. Click the ⚙️ gear icon &rarr; select **Web app**.
3. Set the fields:
   - **Description:** `Get Knowledge Sheet Database & Email`
   - **Execute as:** `Me (getknowledge2026@gmail.com)`
   - **Who has access:** **`Anyone`** *(Important: allows Render to connect)*
4. Click **Deploy**.
5. Click **Authorize access**, choose `getknowledge2026@gmail.com` &rarr; click **Advanced** &rarr; click **Go to Untitled project (unsafe)** &rarr; click **Allow**.
6. Copy the generated **Web app URL** (ends in `/exec`).

---

### Step 5: Add the URL to Render

1. Go to your **[Render Dashboard](https://dashboard.render.com/)** &rarr; **getknowledge** &rarr; **Environment**.
2. Update or Add this Environment Variable:
   - **Key:** `GOOGLE_SHEET_URL` (or update `EMAIL_WEBHOOK_URL`)
   - **Value:** *(Paste your Web app URL ending in `/exec`)*
3. Click **Save Changes**.

---

### 🎉 How It Works Now:
- Whenever you open `https://getknowledge.onrender.com/admin`, it displays live rows from your Google Sheet.
- When you click **Delete**, it removes the row from your Google Sheet.
- When an applicant registers, they appear in your Google Sheet and receive their confirmation email automatically.
- Even if Render restarts or redeploys, your data is 100% safe in Google Drive!
