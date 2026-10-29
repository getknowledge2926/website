/**
 * ==============================================================================
 * Get Knowledge - Contact & Enquiry Form Handling (js/contact.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactPage();
});

function initContactPage() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const enquiryForm = document.getElementById('enquiryForm');
  const courseSelect = document.getElementById('enquiryCourseSelect');

  // Populate course dropdown in enquiry form
  if (courseSelect && SITE_CONFIG.courses) {
    courseSelect.innerHTML = `
      <option value="">-- Select a Course of Interest (Optional) --</option>
      ${SITE_CONFIG.courses.map(c => `
        <option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>
      `).join('')}
    `;
  }

  // Populate contact details
  const emailDisplay = document.getElementById('contactEmailDisplay');
  const phoneDisplay = document.getElementById('contactPhoneDisplay');
  const hoursDisplay = document.getElementById('contactHoursDisplay');
  const addressDisplay = document.getElementById('contactAddressDisplay');

  if (emailDisplay) emailDisplay.textContent = SITE_CONFIG.org.email;
  if (phoneDisplay) phoneDisplay.textContent = SITE_CONFIG.org.phone;
  if (hoursDisplay) hoursDisplay.textContent = SITE_CONFIG.org.workingHours;
  if (addressDisplay) addressDisplay.textContent = SITE_CONFIG.org.address;

  // Handle Enquiry Form Submission
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('enquiryName').value.trim();
      const email = document.getElementById('enquiryEmail').value.trim();
      const phone = document.getElementById('enquiryPhone').value.trim();
      const whatsapp = document.getElementById('enquiryWhatsApp') ? document.getElementById('enquiryWhatsApp').value.trim() : '';
      const course = courseSelect ? courseSelect.value : '';
      const message = document.getElementById('enquiryMessage').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in your name, email, and message.');
        return;
      }

      // Format WhatsApp query message
      const formattedMsg = `*New Website Enquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n*WhatsApp:* ${whatsapp || phone || 'Not provided'}\n*Phone:* ${phone || 'Not provided'}\n*Course:* ${course || 'General Enquiry'}\n*Message:* ${message}`;

      // Show options or trigger direct mailto/WhatsApp
      const choice = confirm(`Thank you, ${name}!\n\nWould you like to send this enquiry directly to our Admissions WhatsApp for the fastest reply?\n\n(Click OK for WhatsApp, or Cancel to send via Email)`);

      if (choice) {
        const whatsappUrl = `https://wa.me/${SITE_CONFIG.org.whatsappNumber}?text=${encodeURIComponent(formattedMsg)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        const mailtoUrl = `mailto:${SITE_CONFIG.org.email}?subject=${encodeURIComponent(`Enquiry from ${name} - ${course || 'Get Knowledge'}`)}&body=${encodeURIComponent(formattedMsg.replace(/\*/g, ''))}`;
        window.location.href = mailtoUrl;
      }

      enquiryForm.reset();
      showToast('Enquiry drafted successfully!');
    });
  }
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
