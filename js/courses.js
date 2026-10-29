/**
 * ==============================================================================
 * Get Knowledge - Courses Catalog & Filtering Engine (js/courses.js)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCoursesPage();
  initFeaturedCoursesHome();
});

/**
 * Renders all courses on courses.html with search & category filtering
 */
function initCoursesPage() {
  const container = document.getElementById('coursesGridContainer');
  if (!container || typeof SITE_CONFIG === 'undefined') return;

  const searchInput = document.getElementById('courseSearchInput');
  const categoryPillsContainer = document.getElementById('categoryPills');
  const countBadge = document.getElementById('coursesCountBadge');

  let currentCategory = 'all';
  let searchQuery = '';

  // Render category buttons dynamically
  if (categoryPillsContainer && SITE_CONFIG.categories) {
    categoryPillsContainer.innerHTML = SITE_CONFIG.categories.map(cat => `
      <button type="button" class="category-pill ${cat.id === 'all' ? 'active' : ''}" data-cat-id="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    categoryPillsContainer.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        categoryPillsContainer.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-cat-id');
        filterAndRender();
      });
    });
  }

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterAndRender();
    });
  }

  function filterAndRender() {
    const filtered = SITE_CONFIG.courses.filter(course => {
      const matchesCategory = (currentCategory === 'all' || course.category === currentCategory);
      const matchesSearch = !searchQuery || (
        course.title.toLowerCase().includes(searchQuery) ||
        course.shortDescription.toLowerCase().includes(searchQuery) ||
        course.categoryName.toLowerCase().includes(searchQuery) ||
        (course.instructor && course.instructor.name.toLowerCase().includes(searchQuery))
      );
      return matchesCategory && matchesSearch;
    });

    if (countBadge) {
      countBadge.textContent = `Showing ${filtered.length} of ${SITE_CONFIG.courses.length} courses`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <svg style="margin: 0 auto 1rem auto; color: var(--slate-400);" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-800); margin-bottom: 0.5rem;">No courses found</h3>
          <p style="color: var(--slate-500); max-width: 450px; margin: 0 auto 1.5rem auto;">We couldn't find any courses matching your criteria. Try adjusting your search keywords or category filter.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="resetFiltersBtn">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          currentCategory = 'all';
          if (categoryPillsContainer) {
            categoryPillsContainer.querySelectorAll('.category-pill').forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-cat-id') === 'all');
            });
          }
          filterAndRender();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(course => renderCourseCard(course)).join('');
  }

  // Initial render
  filterAndRender();
}

/**
 * Renders featured courses on the home page (index.html)
 */
function initFeaturedCoursesHome() {
  const container = document.getElementById('featuredCoursesContainer');
  if (!container || typeof SITE_CONFIG === 'undefined') return;

  const featured = SITE_CONFIG.courses.filter(c => c.featured);
  container.innerHTML = featured.map(course => renderCourseCard(course)).join('');
}

/**
 * Builds the HTML markup for an individual course card
 */
function renderCourseCard(course) {
  const formattedFee = SITE_CONFIG.formatINR(course.fee);
  const formattedOriginalFee = course.originalFee ? SITE_CONFIG.formatINR(course.originalFee) : null;
  const applyUrl = SITE_CONFIG.getApplicationUrl(course.title);

  return `
    <article class="course-card" id="course-${course.id}">
      <div class="course-card-banner">
        <span class="course-card-category">${escapeHtml(course.categoryName)}</span>
        ${course.badge ? `<span class="course-card-badge">${escapeHtml(course.badge)}</span>` : ''}
      </div>

      <div class="course-card-body">
        <h3 class="course-card-title">
          <a href="course-details.html?id=${encodeURIComponent(course.id)}">
            ${escapeHtml(course.title)}
          </a>
        </h3>

        <p class="course-card-desc">
          ${escapeHtml(course.shortDescription)}
        </p>

        <div class="course-meta-tags">
          <div class="course-meta-item" title="Duration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${escapeHtml(course.duration)}</span>
          </div>

          <div class="course-meta-item" title="Class Format">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <span>${escapeHtml(course.classFormat.replace('Live Online on ', 'Live '))}</span>
          </div>

          <div class="course-meta-item" title="Level">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>${escapeHtml(course.level)}</span>
          </div>

        <div class="course-card-footer">
          <div class="course-card-price">
            <span class="price-val">${formattedFee}</span>
            <span class="price-subtext">Live Google Meet &bull; All inclusive</span>
          </div>

          <div class="course-card-actions">
            <a href="course-details.html?id=${encodeURIComponent(course.id)}" class="btn btn-secondary btn-sm" title="View complete syllabus and schedule">
              View Details
            </a>
            <a href="${applyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" title="Apply via Google Form">
              Apply Now &rarr;
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
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
