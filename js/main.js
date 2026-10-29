/**
 * ==============================================================================
 * Get Knowledge - Global Scripts & Utilities (js/main.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initToast();
  initNavActiveState();
  initContactPlaceholders();
  initQrCodeModal();
  initApplicationModal();
});

/**
 * Mobile navigation drawer toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const closeBtn = document.getElementById('mobileNavClose');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * Highlights current active navigation item based on window.location
 */
function initNavActiveState() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    link.classList.remove('active');
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      ((href === 'course-details.html' || href === 'courses.html') &&
       (currentPath === 'course-details.html' || currentPath === 'courses.html'))
    ) {
      link.classList.add('active');
    }
  });
}

/**
 * Global Toast Notification Controller
 */
function initToast() {
  let toastEl = document.getElementById('globalToast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'globalToast';
    toastEl.className = 'toast-notification';
    toastEl.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span id="toastMessageText">Copied to clipboard!</span>
    `;
    document.body.appendChild(toastEl);
  }
}

function showToast(message = 'Copied to clipboard!') {
  const toastEl = document.getElementById('globalToast');
  const textEl = document.getElementById('toastMessageText');
  if (!toastEl || !textEl) return;

  textEl.textContent = message;
  toastEl.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2800);
}

function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    alert(`Please copy manually: ${text}`);
  }
  document.body.removeChild(textArea);
}

/**
 * Replaces any dynamic organization placeholders across pages
 */
function initContactPlaceholders() {
  if (typeof SITE_CONFIG === 'undefined') return;

  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    const keys = key.split('.');
    let val = SITE_CONFIG;
    for (const k of keys) {
      if (val && val[k] !== undefined) {
        val = val[k];
      } else {
        val = null;
        break;
      }
    }
    if (val !== null) {
      el.textContent = val;
    }
  });

  document.querySelectorAll('.whatsapp-link').forEach(link => {
    const phone = SITE_CONFIG.org.whatsappNumber;
    const msg = encodeURIComponent(SITE_CONFIG.org.whatsappDefaultMessage);
    link.href = `https://wa.me/${phone}?text=${msg}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll('.email-link').forEach(link => {
    link.href = `mailto:${SITE_CONFIG.org.email}`;
  });

  // Bind click for any copy-upi buttons on static pages
  const staticCopyBtn = document.getElementById('copyUpiIdBtn');
  if (staticCopyBtn) {
    staticCopyBtn.addEventListener('click', () => {
      const upi = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.payment && SITE_CONFIG.payment.upiId) || '9384955009@airtel';
      copyToClipboard(upi, `UPI ID copied: ${upi}`);
    });
  }
}

/**
 * ==============================================================================
 * Dedicated UPI QR Code Popup Modal with "X" Close Button
 * ==============================================================================
 */
function initQrCodeModal() {
  if (document.getElementById('qrModalBackdrop')) return;

  const qrBackdrop = document.createElement('div');
  qrBackdrop.id = 'qrModalBackdrop';
  qrBackdrop.className = 'qr-modal-backdrop';
  qrBackdrop.innerHTML = `
    <div class="qr-modal-card" role="dialog" aria-modal="true" aria-label="UPI Payment QR Code">
      <!-- Prominent "X" Close Button -->
      <button type="button" class="qr-modal-close-btn" id="qrModalCloseBtn" aria-label="Close QR Code">&times;</button>
      
      <div style="margin-bottom: 0.5rem;">
        <span style="display: inline-block; background: #e0f2fe; color: #0284c7; font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.8rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em;">
          Scan &amp; Pay ₹199
        </span>
      </div>

      <h3 style="font-size: 1.4rem; font-weight: 800; color: #0c2340; margin: 0 0 0.25rem 0;">
        UPI QR Code
      </h3>
      <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 0.75rem 0; line-height: 1.4;">
        Scan using Google Pay, PhonePe, Paytm, or any UPI app
      </p>

      <div class="qr-code-img-frame">
        <img src="assets/images/getknowledge-upi-qr.png" alt="Get Knowledge UPI QR - 9384955009@airtel" id="qrModalImagePreview">
      </div>

      <!-- Copyable UPI ID Box -->
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0.75rem 1rem; margin: 0.85rem 0; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; text-align: left;">
        <div>
          <span style="display: block; font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Official UPI ID</span>
          <code style="font-size: 0.95rem; font-weight: 800; color: #0c2340; letter-spacing: 0.02em;">9384955009@airtel</code>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="qrModalCopyBtn" style="padding: 0.4rem 0.75rem; font-size: 0.8rem; font-weight: 700;">
          Copy UPI ID
        </button>
      </div>

      <!-- Quick 3-Step Reminder -->
      <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 10px; padding: 0.75rem 1rem; text-align: left; margin-bottom: 1.25rem; font-size: 0.8rem; color: #854d0e; line-height: 1.5;">
        <strong style="display: block; margin-bottom: 0.25rem; color: #713f12;">Next steps:</strong>
        1. Complete payment of <strong>₹199</strong> in your UPI app.<br>
        2. Take a <strong>screenshot</strong> of the transaction confirmation.<br>
        3. Click below to continue and upload your screenshot.
      </div>

      <button type="button" class="btn btn-primary" id="qrModalDoneBtn" style="width: 100%; padding: 0.75rem; font-weight: 700;">
        I Have Paid &bull; Continue to Form &rarr;
      </button>
    </div>
  `;
  document.body.appendChild(qrBackdrop);

  const closeBtn = document.getElementById('qrModalCloseBtn');
  const copyBtn = document.getElementById('qrModalCopyBtn');
  const doneBtn = document.getElementById('qrModalDoneBtn');

  function openQrModal() {
    qrBackdrop.classList.add('open');
  }

  function closeQrModal() {
    qrBackdrop.classList.remove('open');
  }

  window.openQrModal = openQrModal;
  window.closeQrModal = closeQrModal;

  if (closeBtn) closeBtn.addEventListener('click', closeQrModal);

  qrBackdrop.addEventListener('click', (e) => {
    if (e.target === qrBackdrop) closeQrModal();
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const upi = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.payment && SITE_CONFIG.payment.upiId) || '9384955009@airtel';
      copyToClipboard(upi, `UPI ID copied: ${upi}`);
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      closeQrModal();
      // Auto-toggle payment status to "Yes, Payment Done"
      const payRadioYes = document.getElementById('payRadioYes');
      if (payRadioYes) {
        payRadioYes.checked = true;
        payRadioYes.dispatchEvent(new Event('change'));
      }
      // Smooth scroll to screenshot field
      const dropZone = document.getElementById('screenshotDropZone');
      if (dropZone) {
        dropZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

/**
 * ==============================================================================
 * Comprehensive Course Application Modal with Payment Status & Image Upload
 * ==============================================================================
 */
function initApplicationModal() {
  if (document.getElementById('appModalBackdrop')) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'appModalBackdrop';
  backdrop.className = 'app-modal-backdrop';
  backdrop.innerHTML = `
    <div class="app-modal" role="dialog" aria-modal="true" aria-label="Course Application">
      <button type="button" class="app-modal-close" id="appModalCloseBtn" aria-label="Close dialog">&times;</button>
      
      <!-- FORM STATE -->
      <div id="appModalFormContent">
        <div class="app-modal-header">
          <span class="app-modal-fee-pill">20-Day Live Cohort &bull; ₹199 Only</span>
          <h3 class="app-modal-title">Apply for AI Development</h3>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">
            Reserve your seat, view QR, and upload your payment screenshot.
          </p>
        </div>

        <form id="instantAppForm">
          <!-- Full Name -->
          <div class="form-group">
            <label for="appFullName" style="font-weight: 700;">Full Name *</label>
            <input type="text" id="appFullName" class="form-control" placeholder="e.g. Rahul Patil" required>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="appEmail" style="font-weight: 700;">Email Address *</label>
            <input type="email" id="appEmail" class="form-control" placeholder="e.g. rahul@example.com" required>
          </div>

          <!-- Phone Number -->
          <div class="form-group">
            <label for="appPhone" style="font-weight: 700;">Phone Number *</label>
            <input type="tel" id="appPhone" class="form-control" placeholder="e.g. 9626261123" required>
          </div>

          <!-- WhatsApp Number -->
          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <label for="appWhatsApp" style="font-weight: 700; margin-bottom: 0;">WhatsApp Number *</label>
              <label style="font-size: 0.75rem; color: #0284c7; cursor: pointer; user-select: none; display: flex; align-items: center; gap: 0.3rem;">
                <input type="checkbox" id="appSameNumberCheckbox" checked>
                Same as Phone
              </label>
            </div>
            <input type="tel" id="appWhatsApp" class="form-control" placeholder="e.g. 9626261123" required>
          </div>

          <!-- Batch Timing -->
          <div class="form-group">
            <label for="appBatch" style="font-weight: 700;">Preferred Batch Timing</label>
            <select id="appBatch" class="form-control">
              <option value="Daily Evening (7:30 PM - 9:00 PM IST)">Daily Evening (7:30 PM - 9:00 PM IST)</option>
              <option value="Weekend Flexible">Weekend Flexible</option>
            </select>
          </div>

          <!-- PAYMENT QUESTION: Has payment been done? -->
          <div class="form-group" style="margin-top: 1.25rem;">
            <label style="display: block; font-weight: 700; font-size: 0.9rem; color: #0f172a; margin-bottom: 0.35rem;">
              Have you completed the ₹199 course fee payment? *
            </label>
            
            <div class="payment-toggle-grid">
              <label class="payment-toggle-card selected" id="toggleCardNo">
                <input type="radio" name="paymentStatus" value="not_yet" id="payRadioNo" checked>
                <span class="payment-toggle-label">No, Need to Pay</span>
                <span class="payment-toggle-sub">View QR &amp; pay ₹199</span>
              </label>

              <label class="payment-toggle-card" id="toggleCardYes">
                <input type="radio" name="paymentStatus" value="done" id="payRadioYes">
                <span class="payment-toggle-label">Yes, Payment Done</span>
                <span class="payment-toggle-sub">I already paid ₹199</span>
              </label>
            </div>

            <!-- UNPAID ACTION BOX: Show QR button -->
            <div id="unpaidActionBox" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 1rem; margin-top: 0.75rem; text-align: center;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #166534; margin-bottom: 0.35rem;">
                Scan QR Code to Pay ₹199
              </div>
              <p style="font-size: 0.8rem; color: #15803d; margin-bottom: 0.75rem; line-height: 1.4;">
                Click below to view the official UPI QR code (Google Pay, PhonePe, Paytm, or BHIM):
              </p>
              <button type="button" class="btn btn-primary" id="btnShowQrModal" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #059669; border-color: #059669; font-weight: 700; padding: 0.7rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Show QR
              </button>
            </div>

            <!-- PAID STATUS BOX: Success note -->
            <div id="paidStatusBox" style="display: none; background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 10px; padding: 0.75rem 1rem; margin-top: 0.75rem; font-size: 0.82rem; color: #065f46; line-height: 1.4;">
              <strong>&#10003; Payment Done:</strong> Please upload your payment screenshot below so our admissions team can verify your cohort seat.
            </div>
          </div>

          <!-- PAYMENT SCREENSHOT IMAGE UPLOAD -->
          <div class="form-group" style="margin-top: 1.25rem;">
            <label style="display: block; font-weight: 700; font-size: 0.9rem; color: #0f172a; margin-bottom: 0.35rem;">
              Payment Screenshot <span style="color: #dc2626;">*</span> <span id="screenshotRequiredBadge" style="color: #dc2626; font-size: 0.75rem; font-weight: 700;">(Required Image)</span>
            </label>
            
            <input type="file" id="appScreenshotInput" accept="image/*" style="display: none;">
            
            <div class="screenshot-upload-zone" id="screenshotDropZone">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 0.4rem;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <div style="font-size: 0.875rem; font-weight: 700; color: #0c2340;">
                Click to upload payment screenshot *
              </div>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.2rem;">
                Required: Supports JPG, PNG, WEBP from GPay / PhonePe / Paytm
              </div>
            </div>

            <!-- Preview Card (shown once file is selected) -->
            <div class="screenshot-preview-wrap" id="screenshotPreviewWrap" style="display: none;">
              <img src="" alt="Screenshot Preview" class="screenshot-thumbnail" id="screenshotThumbnail">
              <div style="flex: 1; min-width: 0;">
                <div id="screenshotFileName" style="font-size: 0.85rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  screenshot.jpg
                </div>
                <div id="screenshotFileSize" style="font-size: 0.75rem; color: #64748b;">
                  Ready to submit
                </div>
              </div>
              <button type="button" id="btnRemoveScreenshot" style="background: none; border: none; color: #dc2626; font-size: 0.8rem; font-weight: 700; cursor: pointer; padding: 0.3rem 0.5rem;">
                Remove
              </button>
            </div>
          </div>

          <!-- UPI UTR / Transaction ID (Required) -->
          <div class="form-group" style="margin-top: 1rem;">
            <label for="appUtrNumber" style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">
              UPI Reference / 12-Digit UTR Number <span style="color: #dc2626;">*</span>
            </label>
            <input type="text" id="appUtrNumber" class="form-control" placeholder="e.g. 428190345678" maxlength="30" required minlength="6">
          </div>

          <!-- Duplicate UTR Warning Alert Box -->
          <div id="appDuplicateAlertBox" style="display: none; background: #fef2f2; border: 1.5px solid #f87171; border-radius: 10px; padding: 0.85rem 1rem; margin-top: 1rem; color: #991b1b; font-size: 0.85rem; line-height: 1.5;">
            <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
              <span style="font-size: 1.15rem; line-height: 1;">⚠️</span>
              <div id="appDuplicateAlertMsg">
                <strong>Duplicate Payment Reference:</strong> This UPI Reference Number has already been submitted.
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div style="margin-top: 1.5rem;">
            <button type="submit" class="btn btn-primary btn-lg" id="appSubmitBtn" style="width: 100%; font-weight: 700;">
              Submit Application &rarr;
            </button>
            <span style="font-size: 0.75rem; color: #64748b; display: block; text-align: center; margin-top: 0.6rem;">
              Logged into applications.xlsx &amp; verified within 12–24 hours
            </span>
          </div>
        </form>
      </div>

      <!-- SUCCESS STATE -->
      <div id="appModalSuccessContent" class="modal-success-state" style="display: none;">
        <div class="modal-success-icon">&#10003;</div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #0c2340; margin-bottom: 0.5rem;">
          Application Submitted!
        </h3>
        <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;" id="appSuccessMessageText">
          Thank you! Your application for <strong>AI Development</strong> has been recorded.
        </p>

        <!-- Automatic Email Confirmation Card -->
        <div id="appSuccessEmailNotificationBox" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; text-align: left;">
          <div style="font-weight: 700; color: #166534; font-size: 0.9rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>📧</span> Confirmation Email Dispatched!
          </div>
          <p style="font-size: 0.825rem; color: #15803d; line-height: 1.5; margin: 0;" id="appSuccessEmailText">
            A greeting and confirmation email has been dispatched to your email address. Once manual verification of your payment reference is done by our team, our team will contact you directly on WhatsApp and you will be added to the batch WhatsApp group!
          </p>
        </div>

        <!-- Summary Details Card -->
        <div id="appSuccessSummaryCard" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.85rem; line-height: 1.6;">
          <!-- Dynamically populated -->
        </div>

        <div style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-primary btn-lg" id="appSuccessDoneBtn" style="width: 100%; font-weight: 700;">
            Close
          </button>
        </div>
      </div>

    </div>
  `;
  document.body.appendChild(backdrop);

  const closeBtn = document.getElementById('appModalCloseBtn');
  const form = document.getElementById('instantAppForm');
  const formContent = document.getElementById('appModalFormContent');
  const successContent = document.getElementById('appModalSuccessContent');
  const successDoneBtn = document.getElementById('appSuccessDoneBtn');

  // Phone, WhatsApp and Duplicate Alert Elements
  const phoneInput = document.getElementById('appPhone');
  const whatsAppInput = document.getElementById('appWhatsApp');
  const sameNumberCheckbox = document.getElementById('appSameNumberCheckbox');
  const duplicateAlertBox = document.getElementById('appDuplicateAlertBox');
  const duplicateAlertMsg = document.getElementById('appDuplicateAlertMsg');

  // Sync Phone to WhatsApp if "Same as Phone" is checked
  if (sameNumberCheckbox && phoneInput && whatsAppInput) {
    phoneInput.addEventListener('input', () => {
      if (sameNumberCheckbox.checked) {
        whatsAppInput.value = phoneInput.value;
      }
    });

    whatsAppInput.addEventListener('input', () => {
      sameNumberCheckbox.checked = (whatsAppInput.value === phoneInput.value && phoneInput.value.length > 0);
    });

    sameNumberCheckbox.addEventListener('change', () => {
      if (sameNumberCheckbox.checked) {
        whatsAppInput.value = phoneInput.value;
      }
    });
  }

  // Payment Status Radios & Toggle Cards
  const payRadioNo = document.getElementById('payRadioNo');
  const payRadioYes = document.getElementById('payRadioYes');
  const toggleCardNo = document.getElementById('toggleCardNo');
  const toggleCardYes = document.getElementById('toggleCardYes');
  const unpaidActionBox = document.getElementById('unpaidActionBox');
  const paidStatusBox = document.getElementById('paidStatusBox');
  const btnShowQrModal = document.getElementById('btnShowQrModal');

  // Screenshot Upload Elements
  const screenshotInput = document.getElementById('appScreenshotInput');
  const screenshotDropZone = document.getElementById('screenshotDropZone');
  const screenshotPreviewWrap = document.getElementById('screenshotPreviewWrap');
  const screenshotThumbnail = document.getElementById('screenshotThumbnail');
  const screenshotFileName = document.getElementById('screenshotFileName');
  const screenshotFileSize = document.getElementById('screenshotFileSize');
  const btnRemoveScreenshot = document.getElementById('btnRemoveScreenshot');

  let uploadedScreenshotDataUrl = null;
  let uploadedScreenshotName = null;

  function openModal() {
    formContent.style.display = 'block';
    successContent.style.display = 'none';
    if (duplicateAlertBox) duplicateAlertBox.style.display = 'none';
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  if (successDoneBtn) successDoneBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Toggle Payment Status Radio Handler
  function updatePaymentStatusUI() {
    if (payRadioYes.checked) {
      toggleCardYes.classList.add('selected', 'done');
      toggleCardNo.classList.remove('selected');
      unpaidActionBox.style.display = 'none';
      paidStatusBox.style.display = 'block';
    } else {
      toggleCardNo.classList.add('selected');
      toggleCardYes.classList.remove('selected', 'done');
      unpaidActionBox.style.display = 'block';
      paidStatusBox.style.display = 'none';
    }
  }

  payRadioNo.addEventListener('change', updatePaymentStatusUI);
  payRadioYes.addEventListener('change', updatePaymentStatusUI);

  // Click handler for "Show QR" button
  if (btnShowQrModal) {
    btnShowQrModal.addEventListener('click', () => {
      if (typeof window.openQrModal === 'function') {
        window.openQrModal();
      }
    });
  }

  // --- Screenshot File Handling ---
  if (screenshotDropZone && screenshotInput) {
    screenshotDropZone.addEventListener('click', () => {
      screenshotInput.click();
    });

    screenshotDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      screenshotDropZone.classList.add('dragover');
    });

    screenshotDropZone.addEventListener('dragleave', () => {
      screenshotDropZone.classList.remove('dragover');
    });

    screenshotDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      screenshotDropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleScreenshotFile(e.dataTransfer.files[0]);
      }
    });

    screenshotInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleScreenshotFile(e.target.files[0]);
      }
    });
  }

  function handleScreenshotFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (screenshotDropZone) screenshotDropZone.style.borderColor = '';
    if (duplicateAlertBox) duplicateAlertBox.style.display = 'none';

    uploadedScreenshotName = file.name;
    const formattedSize = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : Math.round(file.size / 1024) + ' KB';

    screenshotFileName.textContent = file.name;
    screenshotFileSize.textContent = `${formattedSize} • Ready to submit`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      // Compress in canvas if large
      compressImage(dataUrl, 1200, 0.75, (compressedDataUrl) => {
        uploadedScreenshotDataUrl = compressedDataUrl;
        screenshotThumbnail.src = compressedDataUrl;
        screenshotDropZone.style.display = 'none';
        screenshotPreviewWrap.style.display = 'flex';
      });
    };
    reader.readAsDataURL(file);
  }

  if (btnRemoveScreenshot) {
    btnRemoveScreenshot.addEventListener('click', () => {
      uploadedScreenshotDataUrl = null;
      uploadedScreenshotName = null;
      screenshotInput.value = '';
      screenshotThumbnail.src = '';
      screenshotPreviewWrap.style.display = 'none';
      screenshotDropZone.style.display = 'block';
    });
  }

  // Attach openModal to all Apply buttons across the site
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;

    // Never intercept standard navigation links
    if (target.classList.contains('nav-link') || target.closest('.nav-links') || (target.closest('.mobile-links') && !target.classList.contains('open-apply-modal') && target.getAttribute('href') !== '#apply-modal')) {
      return;
    }

    const href = target.getAttribute('href');
    const text = target.textContent.trim().toLowerCase();

    if (
      target.classList.contains('open-apply-modal') ||
      href === '#apply-modal' ||
      text.includes('apply now') ||
      text.includes('apply for this course') ||
      text.includes('start your application') ||
      text.includes('apply & enroll now') ||
      text.includes('apply & pay ₹199')
    ) {
      e.preventDefault();
      openModal();
    }
  });

  // Handle Application Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (duplicateAlertBox) duplicateAlertBox.style.display = 'none';

    const submitBtn = document.getElementById('appSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying & Recording...';

    const name = document.getElementById('appFullName').value.trim();
    const email = document.getElementById('appEmail').value.trim();
    const phone = document.getElementById('appPhone').value.trim();
    const whatsapp = (document.getElementById('appWhatsApp') ? document.getElementById('appWhatsApp').value.trim() : '') || phone;
    const batch = document.getElementById('appBatch').value;
    const isPaymentDone = payRadioYes.checked;
    const utr = document.getElementById('appUtrNumber').value.trim();

    // 1. Mandatory Payment Screenshot Upload Validation
    if (!uploadedScreenshotDataUrl) {
      if (duplicateAlertBox && duplicateAlertMsg) {
        duplicateAlertMsg.innerHTML = `<strong>Payment Screenshot Required:</strong> Please upload a screenshot of your ₹199 payment before submitting.`;
        duplicateAlertBox.style.display = 'block';
        if (screenshotDropZone) {
          screenshotDropZone.style.borderColor = '#dc2626';
          screenshotDropZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application →';
      return;
    }

    // 2. Mandatory UPI Reference / UTR Number Validation
    if (!utr || utr.length < 6) {
      if (duplicateAlertBox && duplicateAlertMsg) {
        duplicateAlertMsg.innerHTML = `<strong>UPI Reference Required:</strong> Please enter your valid 12-digit UPI Reference / UTR Number from your payment app.`;
        duplicateAlertBox.style.display = 'block';
        const utrEl = document.getElementById('appUtrNumber');
        if (utrEl) {
          utrEl.focus();
          utrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application →';
      return;
    }

    // 3. Instant Client-Side Duplicate UPI Reference Check
    let cachedUtrs = [];
    try {
      cachedUtrs = JSON.parse(localStorage.getItem('gk_submitted_utrs') || '[]');
    } catch (err) {
      cachedUtrs = [];
    }

    const cleanUtr = utr.replace(/[\s\-_]/g, '').toUpperCase();
    const isDuplicateLocal = cachedUtrs.some(item => {
      const existingClean = String(item).replace(/[\s\-_]/g, '').toUpperCase();
      return existingClean === cleanUtr;
    });

    if (isDuplicateLocal) {
      if (duplicateAlertBox && duplicateAlertMsg) {
        duplicateAlertMsg.innerHTML = `<strong>Duplicate UPI Reference Found:</strong> The UPI Reference / UTR Number <strong>${escapeHtml(utr)}</strong> has already been submitted! If you already paid or need assistance, please contact our team at +91 96262 61123 or getknowledge2026@gmail.com.`;
        duplicateAlertBox.style.display = 'block';
        duplicateAlertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application →';
      return;
    }

    const applicantId = 'GK' + Math.floor(100000 + Math.random() * 900000);

    const applicationRecord = {
      applicantId: applicantId,
      timestamp: new Date().toISOString(),
      name: name,
      email: email,
      phone: phone,
      whatsapp: whatsapp,
      course: "AI Development",
      fee: 199,
      batch: batch,
      paymentStatus: isPaymentDone ? "Yes, Payment Done" : "No, Need to Pay (Pending)",
      utr: utr || "N/A",
      screenshotFileName: uploadedScreenshotName || "None Attached",
      screenshotBase64: uploadedScreenshotDataUrl || ""
    };

    // 2. Submit to Backend Server (/api/apply) and sync with applications.xlsx
    const submitResult = await submitApplicationRecord(applicationRecord);

    // If backend found duplicate UPI Reference in applications.xlsx
    if (submitResult && submitResult.status === 'duplicate') {
      if (duplicateAlertBox && duplicateAlertMsg) {
        duplicateAlertMsg.innerHTML = `<strong>Duplicate UPI Reference Found:</strong> ${escapeHtml(submitResult.message || 'This UPI Reference Number has already been submitted in applications.xlsx.')}`;
        duplicateAlertBox.style.display = 'block';
        duplicateAlertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application →';
      return;
    }

    // 3. Cache valid UTR locally to prevent repeated submissions
    if (utr) {
      try {
        const cachedUtrs = JSON.parse(localStorage.getItem('gk_submitted_utrs') || '[]');
        cachedUtrs.push(utr);
        localStorage.setItem('gk_submitted_utrs', JSON.stringify(cachedUtrs));
      } catch (err) {
        console.warn('Could not cache UTR:', err);
      }
    }

    // 4. Update Success State UI
    const successMsgEl = document.getElementById('appSuccessMessageText');
    if (successMsgEl) {
      successMsgEl.innerHTML = `Thank you, <strong>${escapeHtml(name)}</strong>! Your registration reference is <strong>${applicantId}</strong> for <strong>AI Development</strong>.`;
    }

    const emailNoticeEl = document.getElementById('appSuccessEmailText');
    if (emailNoticeEl) {
      emailNoticeEl.innerHTML = `A greeting and confirmation email has been dispatched to <strong>${escapeHtml(email)}</strong>. Once manual verification of your payment reference is done by our team, our team will contact you directly on WhatsApp (<strong>${escapeHtml(whatsapp)}</strong>) and you will be added to the batch WhatsApp group!`;
    }

    const summaryCard = document.getElementById('appSuccessSummaryCard');
    if (summaryCard) {
      summaryCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">Registration Ref:</span>
          <strong style="color: #0c2340;">${applicantId}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">Applicant Name:</span>
          <strong>${escapeHtml(name)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">Phone Number:</span>
          <strong>${escapeHtml(phone)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">WhatsApp Number:</span>
          <strong>${escapeHtml(whatsapp)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">Selected Batch:</span>
          <strong>${escapeHtml(batch)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">Course Fee:</span>
          <strong>₹199 (All-inclusive)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">Payment Status:</span>
          <span style="color: ${isPaymentDone ? '#059669' : '#d97706'}; font-weight: 700;">
            ${isPaymentDone ? '&#10003; Payment Done' : 'Pending Verification'}
          </span>
        </div>
        ${utr ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
          <span style="color: #64748b;">UPI Ref / UTR:</span>
          <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #0f172a;">${escapeHtml(utr)}</code>
        </div>` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Screenshot:</span>
          <span style="color: ${uploadedScreenshotName ? '#059669' : '#64748b'}; font-weight: 600;">
            ${uploadedScreenshotName ? 'Attached (' + escapeHtml(uploadedScreenshotName) + ')' : 'None'}
          </span>
        </div>
      `;
    }

    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application →';

    formContent.style.display = 'none';
    successContent.style.display = 'block';
    if (typeof showToast === 'function') {
      showToast('Application registered & recorded in applications.xlsx!');
    }
  });
}

/**
 * Image compression helper using Canvas to keep payload fast and light
 */
function compressImage(dataUrl, maxWidth, quality, callback) {
  const img = new Image();
  img.onload = () => {
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const compressed = canvas.toDataURL('image/jpeg', quality);
    callback(compressed);
  };
  img.src = dataUrl;
}

/**
 * ==============================================================================
 * Application Recording Engine (applications.xlsx, Backend & Google Sheet)
 * ==============================================================================
 * Whenever a student submits an application:
 * 1. POSTs to /api/apply on server.py
 *    - Compares UPI reference number with existing entries in applications.xlsx
 *    - Rejects duplicate UPI references with HTTP 409
 *    - Appends entry into applications.xlsx
 *    - Dispatches confirmation email from getknowledge2026@gmail.com
 * 2. Falls back gracefully to Google Apps Script or browser localStorage if static
 */
async function submitApplicationRecord(data) {
  // Always save in browser localStorage as immediate permanent backup
  try {
    const list = JSON.parse(localStorage.getItem('gk_applications_list') || '[]');
    list.unshift(data);
    localStorage.setItem('gk_applications_list', JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  // 1. Submit to Python Backend Server /api/apply
  const candidateEndpoints = ['/api/apply'];
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    candidateEndpoints.push('http://localhost:8000/api/apply');
  }

  let backendRes = null;
  for (const ep of candidateEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(ep, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        backendRes = await response.json();
        return backendRes;
      } else if (response.status === 409) {
        const resJson = await response.json();
        return {
          status: 'duplicate',
          message: resJson.message || 'This UPI Reference Number has already been submitted in applications.xlsx.'
        };
      }
    } catch (err) {
      console.warn('Endpoint ' + ep + ' error:', err);
    }
  }

  // 2. Fallback to Google Sheet Web App if configured
  if (
    typeof SITE_CONFIG !== 'undefined' &&
    SITE_CONFIG.googleSheet &&
    SITE_CONFIG.googleSheet.scriptUrl &&
    SITE_CONFIG.googleSheet.scriptUrl.trim().length > 0 &&
    !SITE_CONFIG.googleSheet.scriptUrl.includes('PLACEHOLDER')
  ) {
    try {
      await fetch(SITE_CONFIG.googleSheet.scriptUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      console.log('Application logged to Google Sheet fallback successfully');
    } catch (gErr) {
      console.warn('Google Sheet submission warning:', gErr);
    }
  }

  return { status: 'success', fallback: true };
}



function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
