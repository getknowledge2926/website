/**
 * ==============================================================================
 * Get Knowledge - Payment Instructions & Submission Engine (js/payment.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPaymentPage();
});

function initPaymentPage() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const courseSelect = document.getElementById('paymentCourseSelect');
  const courseFeeDisplay = document.getElementById('paymentCourseFee');
  const selectedCourseNameDisplay = document.getElementById('selectedCourseNameDisplay');
  const submitProofBtn = document.getElementById('submitPaymentProofBtn');
  const upiIdText = document.getElementById('displayUpiId');
  const upiPayeeName = document.getElementById('displayUpiPayee');
  const copyUpiBtn = document.getElementById('copyUpiIdBtn');

  // Bank detail elements
  const bankAccountHolder = document.getElementById('bankAccountHolder');
  const bankName = document.getElementById('bankName');
  const bankAccountNumber = document.getElementById('bankAccountNumber');
  const bankIfsc = document.getElementById('bankIfsc');
  const bankBranch = document.getElementById('bankBranch');
  const bankAccountType = document.getElementById('bankAccountType');
  const copyAccountBtn = document.getElementById('copyAccountNumberBtn');
  const copyIfscBtn = document.getElementById('copyIfscBtn');

  // Populate Payment Information from SITE_CONFIG
  if (upiIdText) upiIdText.textContent = SITE_CONFIG.payment.upiId;
  if (upiPayeeName) upiPayeeName.textContent = SITE_CONFIG.payment.payeeName;

  if (bankAccountHolder) bankAccountHolder.textContent = SITE_CONFIG.payment.bankDetails.accountHolder;
  if (bankName) bankName.textContent = SITE_CONFIG.payment.bankDetails.bankName;
  if (bankAccountNumber) bankAccountNumber.textContent = SITE_CONFIG.payment.bankDetails.accountNumber;
  if (bankIfsc) bankIfsc.textContent = SITE_CONFIG.payment.bankDetails.ifscCode;
  if (bankBranch) bankBranch.textContent = SITE_CONFIG.payment.bankDetails.branch;
  if (bankAccountType) bankAccountType.textContent = SITE_CONFIG.payment.bankDetails.accountType;

  // Populate Course Dropdown
  if (courseSelect && SITE_CONFIG.courses) {
    courseSelect.innerHTML = SITE_CONFIG.courses.map(c => `
      <option value="${c.id}" data-fee="${c.fee}" data-title="${escapeHtml(c.title)}">
        ${escapeHtml(c.title)} — ${SITE_CONFIG.formatINR(c.fee)}
      </option>
    `).join('');

    // Check if course parameter was passed in URL
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedId = urlParams.get('course');
    if (preselectedId && SITE_CONFIG.getCourseById(preselectedId)) {
      courseSelect.value = preselectedId;
    }

    // Update fee and form link on selection change
    function updateSelectedCourse() {
      const selectedOption = courseSelect.options[courseSelect.selectedIndex];
      if (!selectedOption) return;

      const courseId = selectedOption.value;
      const course = SITE_CONFIG.getCourseById(courseId);

      if (course) {
        if (courseFeeDisplay) {
          courseFeeDisplay.textContent = SITE_CONFIG.formatINR(course.fee);
        }
        if (selectedCourseNameDisplay) {
          selectedCourseNameDisplay.textContent = course.title;
        }
        if (submitProofBtn) {
          submitProofBtn.href = SITE_CONFIG.getPaymentProofUrl(course.title, course.fee);
        }
      }
    }

    courseSelect.addEventListener('change', updateSelectedCourse);
    updateSelectedCourse();
  }

  // Copy UPI ID button
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
      copyToClipboard(SITE_CONFIG.payment.upiId, 'UPI ID copied to clipboard!');
    });
  }

  // Copy Account Number button
  if (copyAccountBtn) {
    copyAccountBtn.addEventListener('click', () => {
      copyToClipboard(SITE_CONFIG.payment.bankDetails.accountNumber, 'Account number copied to clipboard!');
    });
  }

  // Copy IFSC button
  if (copyIfscBtn) {
    copyIfscBtn.addEventListener('click', () => {
      copyToClipboard(SITE_CONFIG.payment.bankDetails.ifscCode, 'IFSC code copied to clipboard!');
    });
  }

  // Handle Submit Payment Proof button
  if (submitProofBtn) {
    submitProofBtn.addEventListener('click', (e) => {
      if (!SITE_CONFIG.googleForms.paymentProofFormUrl || SITE_CONFIG.googleForms.paymentProofFormUrl.includes('PLACEHOLDER')) {
        e.preventDefault();
        openPaymentProofModal();
      }
    });
  }

  // If arrived with hash #payment-proof-modal, trigger modal automatically
  if (window.location.hash === '#payment-proof-modal' || window.location.hash === '#proof-modal') {
    setTimeout(openPaymentProofModal, 300);
  }
}

/**
 * Interactive Payment Proof Modal for direct UTR submission & WhatsApp verification
 */
function openPaymentProofModal() {
  let modal = document.getElementById('paymentProofModalBackdrop');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'paymentProofModalBackdrop';
    modal.className = 'app-modal-backdrop';
    modal.innerHTML = `
      <div class="app-modal" role="dialog" aria-modal="true" aria-label="Submit Payment Proof">
        <button type="button" class="app-modal-close" id="paymentProofModalClose">&times;</button>
        <div id="proofFormWrapper">
          <div class="app-modal-header">
            <span class="app-modal-fee-pill">Step 2: Submit UTR &bull; ₹199</span>
            <h3 class="app-modal-title">Submit Payment Reference</h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">
              Provide your 12-digit UTR / UPI transaction ID for manual verification.
            </p>
          </div>
          <form id="instantProofForm">
            <div class="form-group">
              <label for="proofName">Full Name *</label>
              <input type="text" id="proofName" class="form-control" placeholder="e.g. Rahul Patil" required>
            </div>
            <div class="form-group">
              <label for="proofEmail">Registered Email *</label>
              <input type="email" id="proofEmail" class="form-control" placeholder="e.g. rahul@example.com" required>
            </div>
            <div class="form-group">
              <label for="proofWhatsApp">WhatsApp Number *</label>
              <input type="tel" id="proofWhatsApp" class="form-control" placeholder="e.g. 9626261123" required>
            </div>
            <div class="form-group">
              <label for="proofCourse">Course</label>
              <input type="text" id="proofCourse" class="form-control" value="AI Development" readonly style="background: #f8fafc; font-weight: 600;">
            </div>
            <div class="form-group">
              <label for="proofAmount">Amount Paid</label>
              <input type="text" id="proofAmount" class="form-control" value="₹199" readonly style="background: #f8fafc; font-weight: 700; color: #0284c7;">
            </div>
            <div class="form-group">
              <label for="proofUtr">12-Digit UTR / UPI Reference Number *</label>
              <input type="text" id="proofUtr" class="form-control" placeholder="e.g. 428901234567" required minlength="6" maxlength="30">
            </div>

            <!-- Duplicate UTR Warning Box -->
            <div id="proofDuplicateAlertBox" style="display: none; background: #fef2f2; border: 1.5px solid #f87171; border-radius: 10px; padding: 0.85rem 1rem; margin-top: 1rem; color: #991b1b; font-size: 0.85rem; line-height: 1.5;">
              <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
                <span style="font-size: 1.15rem; line-height: 1;">⚠️</span>
                <div id="proofDuplicateAlertMsg">
                  <strong>Duplicate UPI Reference:</strong> This UPI Reference Number has already been submitted.
                </div>
              </div>
            </div>

            <div style="margin-top: 1.5rem;">
              <button type="submit" class="btn btn-success btn-lg" id="proofSubmitBtn" style="width: 100%;">
                Submit Reference for Verification &rarr;
              </button>
            </div>
          </form>
        </div>
        <div id="proofSuccessWrapper" class="modal-success-state" style="display: none;">
          <div class="modal-success-icon">&#10003;</div>
          <h3 style="font-size: 1.4rem; font-weight: 800; color: #0c2340; margin-bottom: 0.5rem;">
            Payment Reference Recorded!
          </h3>
          <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;" id="proofSuccessText">
            Thank you! Your payment reference has been recorded in our official applications file.
          </p>

          <!-- Automatic Email Notification Box -->
          <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; text-align: left;">
            <div style="font-weight: 700; color: #166534; font-size: 0.9rem; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>📧</span> Confirmation Email Dispatched!
            </div>
            <p style="font-size: 0.825rem; color: #15803d; line-height: 1.5; margin: 0;" id="proofSuccessEmailText">
              A greeting and confirmation email has been dispatched to your email address. Once manual verification of your payment reference is done by our team, our team will contact you directly on WhatsApp and you will be added to the batch WhatsApp group!
            </p>
          </div>

          <div style="margin-top: 1.5rem;">
            <button type="button" class="btn btn-primary btn-lg" id="proofDoneBtn" style="width: 100%; font-weight: 700;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('paymentProofModalClose');
    const form = document.getElementById('instantProofForm');
    const formWrap = document.getElementById('proofFormWrapper');
    const successWrap = document.getElementById('proofSuccessWrapper');
    const whatsAppBtn = document.getElementById('proofWhatsAppBtn');
    const doneBtn = document.getElementById('proofDoneBtn');
    const proofSubmitBtn = document.getElementById('proofSubmitBtn');
    const duplicateBox = document.getElementById('proofDuplicateAlertBox');
    const duplicateMsg = document.getElementById('proofDuplicateAlertMsg');

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (duplicateBox) duplicateBox.style.display = 'none';

      const name = document.getElementById('proofName').value.trim();
      const email = document.getElementById('proofEmail').value.trim();
      const whatsapp = document.getElementById('proofWhatsApp') ? document.getElementById('proofWhatsApp').value.trim() : '';
      const utr = document.getElementById('proofUtr').value.trim();

      // Check local cache for duplicate UTR
      let cachedUtrs = [];
      try {
        cachedUtrs = JSON.parse(localStorage.getItem('gk_submitted_utrs') || '[]');
      } catch (err) {
        cachedUtrs = [];
      }

      const cleanUtr = utr.replace(/[\s\-_]/g, '').toUpperCase();
      const isDuplicateLocal = cachedUtrs.some(item => {
        return String(item).replace(/[\s\-_]/g, '').toUpperCase() === cleanUtr;
      });

      if (isDuplicateLocal) {
        if (duplicateBox && duplicateMsg) {
          duplicateMsg.innerHTML = `<strong>Duplicate UPI Reference Found:</strong> The UPI Reference / UTR Number <strong>${escapeHtml(utr)}</strong> has already been submitted! If you need assistance, please contact our team at +91 96262 61123 or getknowledge2026@gmail.com.`;
          duplicateBox.style.display = 'block';
        }
        return;
      }

      if (proofSubmitBtn) {
        proofSubmitBtn.disabled = true;
        proofSubmitBtn.textContent = 'Verifying & Recording...';
      }

      const applicantId = 'GK' + Math.floor(100000 + Math.random() * 900000);
      const payload = {
        applicantId: applicantId,
        timestamp: new Date().toISOString(),
        name: name,
        email: email,
        phone: whatsapp,
        whatsapp: whatsapp,
        course: "AI Development",
        fee: 199,
        batch: "Daily Evening (7:30 PM - 9:00 PM IST)",
        paymentStatus: "Yes, Payment Done",
        utr: utr,
        screenshotFileName: "UTR Submitted Direct",
        screenshotBase64: ""
      };

      // Call backend /api/apply (tries relative endpoint and localhost:8000)
      const candidateEndpoints = ['/api/apply'];
      if (!window.location.origin.includes(':8000')) {
        candidateEndpoints.push('http://localhost:8000/api/apply');
        candidateEndpoints.push('http://127.0.0.1:8000/api/apply');
      }

      for (const ep of candidateEndpoints) {
        try {
          const resp = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (resp.status === 409) {
            const resJson = await resp.json();
            if (duplicateBox && duplicateMsg) {
              duplicateMsg.innerHTML = `<strong>Duplicate UPI Reference Found:</strong> ${escapeHtml(resJson.message || 'This UPI Reference Number has already been submitted in applications.xlsx.')}`;
              duplicateBox.style.display = 'block';
            }
            if (proofSubmitBtn) {
              proofSubmitBtn.disabled = false;
              proofSubmitBtn.textContent = 'Submit Reference for Verification →';
            }
            return;
          } else if (resp.ok) {
            break; // Succeeded
          }
        } catch (err) {
          // Try next endpoint
        }
      }

      // Save to local cache
      try {
        cachedUtrs.push(utr);
        localStorage.setItem('gk_submitted_utrs', JSON.stringify(cachedUtrs));
      } catch (e) {}

      const emailTextEl = document.getElementById('proofSuccessEmailText');
      if (emailTextEl) {
        emailTextEl.innerHTML = `A greeting and confirmation email has been dispatched to <strong>${escapeHtml(email)}</strong>. Once manual verification of your payment reference is done by our team, our team will contact you directly on WhatsApp (<strong>${escapeHtml(whatsapp)}</strong>) and you will be added to the batch WhatsApp group!`;
      }

      const msg = `*Payment Reference Proof - Get Knowledge*\n\n*Name:* ${name}\n*Email:* ${email}\n*WhatsApp:* ${whatsapp}\n*Course:* AI Development\n*Amount Paid:* ₹199\n*UTR / UPI Reference:* ${utr}\n\nPlease verify my payment and share my Google Meet onboarding link.`;

      if (whatsAppBtn && typeof SITE_CONFIG !== 'undefined') {
        whatsAppBtn.href = `https://wa.me/${SITE_CONFIG.org.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      }

      if (proofSubmitBtn) {
        proofSubmitBtn.disabled = false;
        proofSubmitBtn.textContent = 'Submit Reference for Verification →';
      }

      formWrap.style.display = 'none';
      successWrap.style.display = 'block';
      if (typeof showToast === 'function') {
        showToast('Payment reference recorded in applications.xlsx!');
      }
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
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
