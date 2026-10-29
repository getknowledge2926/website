/**
 * ==============================================================================
 * Get Knowledge - Course Details Dynamic Renderer (js/course-details.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCourseDetails();
});

function initCourseDetails() {
  if (typeof SITE_CONFIG === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  let courseId = urlParams.get('id');

  // Fallback to first course if none specified
  if (!courseId && SITE_CONFIG.courses.length > 0) {
    courseId = SITE_CONFIG.courses[0].id;
  }

  const course = SITE_CONFIG.getCourseById(courseId);
  const container = document.getElementById('courseDetailsRoot');

  if (!course || !container) {
    if (container) {
      container.innerHTML = `
        <div class="container" style="padding: 6rem 1rem; text-align: center;">
          <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--slate-900);">Course Not Found</h2>
          <p style="color: var(--slate-500); margin-bottom: 2rem;">The course you are looking for does not exist or has been moved.</p>
          <a href="courses.html" class="btn btn-primary">Browse All Courses</a>
        </div>
      `;
    }
    return;
  }

  // Update page title
  document.title = `${course.title} | ${SITE_CONFIG.org.name}`;

  const formattedFee = SITE_CONFIG.formatINR(course.fee);
  const formattedOriginalFee = course.originalFee ? SITE_CONFIG.formatINR(course.originalFee) : null;
  const applyUrl = SITE_CONFIG.getApplicationUrl(course.title);
  const paymentUrl = `payment.html?course=${encodeURIComponent(course.id)}`;

  container.innerHTML = `
    <!-- Top Hero Header -->
    <header class="course-details-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="index.html">Home</a> &rsaquo;
          <a href="courses.html">Courses</a> &rsaquo;
          <span style="color: #cbd5e1;">${escapeHtml(course.categoryName)}</span> &rsaquo;
          <span style="color: #ffffff; font-weight: 600;">${escapeHtml(course.title)}</span>
        </nav>

        <div style="max-width: 820px;">
          <div style="display: flex; gap: 0.6rem; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <span class="badge badge-primary">${escapeHtml(course.categoryName)}</span>
            ${course.badge ? `<span class="badge badge-amber">${escapeHtml(course.badge)}</span>` : ''}
            <span class="badge badge-emerald">Live Interactive Cohort</span>
          </div>

          <h1 style="font-size: 2.5rem; font-weight: 800; line-height: 1.25; margin-bottom: 1.25rem; letter-spacing: -0.02em;">
            ${escapeHtml(course.title)}
          </h1>

          <p style="font-size: 1.15rem; color: #cbd5e1; line-height: 1.65; margin-bottom: 2rem;">
            ${escapeHtml(course.shortDescription)}
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.875rem; color: #94a3b8; border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 1.5rem;">
            <div>
              <span style="color: #ffffff; font-weight: 700; display: block;">${escapeHtml(course.duration)}</span>
              <span>Total Duration</span>
            </div>
            <div>
              <span style="color: #ffffff; font-weight: 700; display: block;">${escapeHtml(course.level)}</span>
              <span>Skill Level</span>
            </div>
            <div>
              <span style="color: #ffffff; font-weight: 700; display: block;">${escapeHtml(course.classFormat)}</span>
              <span>Mode of Delivery</span>
            </div>
            <div>
              <span style="color: #ffffff; font-weight: 700; display: block;">${escapeHtml(course.language)}</span>
              <span>Language</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Layout: Content + Sticky Sidebar -->
    <div class="container section">
      <div class="course-details-layout">
        
        <!-- Left Column: Syllabus, Outcomes, Instructor, FAQs -->
        <main class="course-content-col">
          
          <!-- Section 1: Overview -->
          <section class="content-block">
            <h2 class="content-heading">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Course Overview
            </h2>
            <p style="font-size: 1.05rem; line-height: 1.7; color: var(--slate-700);">
              ${escapeHtml(course.fullDescription)}
            </p>
          </section>

          <!-- Section 2: Learning Outcomes -->
          <section class="content-block">
            <h2 class="content-heading">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              What You Will Learn &amp; Build
            </h2>
            <div class="outcome-list">
              ${course.learningOutcomes.map(item => `
                <div class="outcome-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>${escapeHtml(item)}</span>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Section 3: Interactive Syllabus Accordion -->
          <section class="content-block">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem;">
              <h2 class="content-heading" style="margin-bottom: 0;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Detailed Syllabus
              </h2>
              <span style="font-size: 0.875rem; color: var(--slate-500); font-weight: 600;">
                ${course.syllabus.length} Modules &bull; Hands-on
              </span>
            </div>

            <div class="accordion" id="syllabusAccordion">
              ${course.syllabus.map((mod, index) => `
                <div class="accordion-item ${index === 0 ? 'active' : ''}">
                  <button type="button" class="accordion-header" aria-expanded="${index === 0}">
                    <div class="accordion-title-wrap">
                      <span class="accordion-module-pill">${escapeHtml(mod.module)}</span>
                      <span class="accordion-title">${escapeHtml(mod.title)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <span style="font-size: 0.75rem; color: var(--slate-500); font-weight: 600;">${escapeHtml(mod.duration)}</span>
                      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </button>
                  <div class="accordion-body">
                    <ul class="syllabus-topics">
                      ${mod.topics.map(t => `
                        <li class="syllabus-topic">${escapeHtml(t)}</li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Section 4: Schedule & Cohort Details -->
          <section class="content-block">
            <h2 class="content-heading">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Batch Timings &amp; Delivery Schedule
            </h2>
            <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div>
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Class Timing</span>
                <p style="font-size: 1rem; font-weight: 700; color: var(--slate-800); margin-top: 0.25rem;">${escapeHtml(course.schedule)}</p>
              </div>
              <div>
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Next Cohort Date</span>
                <p style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem;">${escapeHtml(course.nextBatchDate)}</p>
              </div>
              <div>
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Delivery Platform</span>
                <p style="font-size: 1rem; font-weight: 600; color: var(--slate-800); margin-top: 0.25rem;">${escapeHtml(course.classFormat)}</p>
              </div>
              <div>
                <span style="font-size: 0.8125rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Class Link Delivery</span>
                <p style="font-size: 0.9rem; color: var(--slate-600); margin-top: 0.25rem;">Shared manually via WhatsApp/Email after payment verification</p>
              </div>
            </div>
          </section>

          <!-- Section 5: Instructor Profile -->
          ${course.instructor ? `
            <section class="content-block">
              <h2 class="content-heading">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Your Instructor
              </h2>
              <div style="display: flex; gap: 1.5rem; background: var(--white); border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 1.75rem; align-items: center; flex-wrap: wrap;">
                <img src="${escapeHtml(course.instructor.avatar)}" alt="${escapeHtml(course.instructor.name)}" style="width: 80px; height: 80px; border-radius: 50%;" />
                <div style="flex: 1; min-width: 240px;">
                  <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.2rem;">${escapeHtml(course.instructor.name)}</h3>
                  <div style="font-size: 0.875rem; font-weight: 600; color: var(--primary); margin-bottom: 0.5rem;">${escapeHtml(course.instructor.title)} &bull; ${escapeHtml(course.instructor.experience)}</div>
                  <p style="font-size: 0.9rem; color: var(--slate-600); line-height: 1.6;">${escapeHtml(course.instructor.bio)}</p>
                </div>
              </div>
            </section>
          ` : ''}

          <!-- Section 6: Requirements -->
          <section class="content-block">
            <h2 class="content-heading">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Requirements to Join
            </h2>
            <ul style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${course.requirements.map(req => `
                <li style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.95rem; color: var(--slate-700);">
                  <span style="color: var(--primary); font-weight: 800;">&bull;</span>
                  <span>${escapeHtml(req)}</span>
                </li>
              `).join('')}
            </ul>
          </section>

          <!-- Section 7: FAQs -->
          <section class="content-block">
            <h2 class="content-heading">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Frequently Asked Questions
            </h2>
            <div class="faq-list">
              ${course.faqs.map(faq => `
                <div class="faq-card">
                  <h4>${escapeHtml(faq.q)}</h4>
                  <p>${escapeHtml(faq.a)}</p>
                </div>
              `).join('')}
            </div>
          </section>

        </main>

        <!-- Right Column: Sticky Pricing & Apply Card -->
        <aside class="course-sticky-sidebar">
          <div style="margin-bottom: 1.5rem;">
            <span style="font-size: 0.8125rem; font-weight: 700; color: var(--slate-500); text-transform: uppercase;">Total Program Fee</span>
            <div style="display: flex; align-items: baseline; gap: 0.6rem; margin-top: 0.25rem;">
              <span style="font-family: var(--font-mono); font-size: 2.25rem; font-weight: 800; color: var(--slate-900);">${formattedFee}</span>
            </div>
            <div style="font-size: 0.8125rem; color: var(--accent-emerald-dark); font-weight: 600; margin-top: 0.25rem;">
              Zero hidden taxes &bull; One-time full cohort access
            </div>
          </div>

          <!-- CTAs -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
            <a href="${applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg open-apply-modal" style="width: 100%;">
              Apply for This Course &rarr;
            </a>
            <a href="${paymentUrl}" class="btn btn-secondary" style="width: 100%;">
              View Payment Instructions (UPI / Bank)
            </a>
          </div>

          <!-- Manual Process Notice Box -->
          <div style="background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md); padding: 1.25rem; font-size: 0.8125rem; color: var(--slate-600); margin-bottom: 1.75rem; line-height: 1.6;">
            <strong style="color: var(--slate-800); display: block; margin-bottom: 0.35rem;">How Enrollment Works:</strong>
            1. Submit application details<br>
            2. Complete payment via UPI QR<br>
            3. Receive Google Meet batch link directly on WhatsApp &amp; Email
          </div>

          <!-- Features included list -->
          <div style="font-size: 0.875rem; color: var(--slate-700);">
            <div style="font-weight: 700; color: var(--slate-900); margin-bottom: 0.75rem;">This Cohort Includes:</div>
            <ul style="display: flex; flex-direction: column; gap: 0.6rem;">
              <li style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Live interactive Google Meet classes</span>
              </li>
              <li style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Class recordings shared manually</span>
              </li>
              <li style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Dedicated doubt resolution WhatsApp group</span>
              </li>
              <li style="display: flex; align-items: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Verified Certificate of Completion</span>
              </li>
            </ul>
          </div>

          <!-- Quick WhatsApp Help -->
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--slate-200); text-align: center;">
            <span style="font-size: 0.8125rem; color: var(--slate-500); display: block; margin-bottom: 0.6rem;">Have questions before enrolling?</span>
            <a href="#" class="whatsapp-link btn btn-whatsapp btn-sm" style="width: 100%;">
              Chat on WhatsApp with Admissions
            </a>
          </div>

        </aside>

      </div>
    </div>
  `;

  // Initialize syllabus accordion click behavior
  const headers = container.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('active');
      
      // Close all other items (or keep one open)
      container.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Re-run contact placeholder replacement for any newly injected links
  initContactPlaceholders();
  if (typeof renderApplicantCount === 'function') {
    renderApplicantCount(false);
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
