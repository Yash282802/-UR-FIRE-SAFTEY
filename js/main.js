/**
 * UR FIRE SAFETY SOLUTION - Main Client JavaScript
 * Industrial Safety Protocol & Interactivity System
 */

document.addEventListener('DOMContentLoaded', () => {
  initIndustrialLoader();
  initMobileDrawer();
  initScrollHeader();
  initStatsCounters();
  initIntroAnimations();
  initLeadForms();
  initQuoteModals();
  initProductFilters();
  initTestimonialsSync();
});

/* ==========================================================================
   1. Smooth Industrial Loading & Intro Controller
   ========================================================================== */
function initIndustrialLoader() {
  const loader = document.getElementById('industrial-loader');
  if (!loader) return;

  const progressBar = loader.querySelector('.loader-progress-bar');
  const statusText = loader.querySelector('.loader-status');
  const percentText = loader.querySelector('.loader-percent');

  const statusMessages = [
    "INITIALIZING LIFE-SAFETY PROTOCOL...",
    "CHECKING NBC & IS 13039 COMPLIANCE...",
    "VERIFYING CERTIFIED LAB TELEMETRY...",
    "UR FIRE SAFETY SOLUTION - OPERATIONAL"
  ];

  let progress = 0;
  let messageIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress > 100) progress = 100;

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (percentText) percentText.textContent = `${progress}%`;

    if (progress > (messageIndex + 1) * 25 && messageIndex < statusMessages.length - 1) {
      messageIndex++;
      if (statusText) statusText.textContent = statusMessages[messageIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loader-hidden');
        triggerIntroAnimations();
      }, 300);
    }
  }, 75);
}

function initIntroAnimations() {
  // Add intro-fade class to key hero and section elements
  const animatableElements = document.querySelectorAll('h1, h2, .technical-spec-card, .hero-content, .stats-container');
  animatableElements.forEach((el, index) => {
    if (!el.classList.contains('intro-fade')) {
      el.classList.add('intro-fade');
      const delayClass = `delay-${((index % 5) + 1) * 100}`;
      el.classList.add(delayClass);
    }
  });
}

function triggerIntroAnimations() {
  const elements = document.querySelectorAll('.intro-fade');
  elements.forEach((el) => {
    el.classList.add('intro-visible');
  });
}

/* ==========================================================================
   2. Mobile Navigation Drawer Controller
   ========================================================================== */
function initMobileDrawer() {
  const menuButtons = document.querySelectorAll('.mobile-menu-trigger, button[aria-label="Toggle Navigation"]');
  let drawer = document.getElementById('mobile-nav-drawer');

  // Create drawer if not existing in DOM
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'mobile-nav-drawer';
    drawer.innerHTML = `
      <div class="drawer-panel">
        <div class="flex items-center justify-between pb-6 mb-6 border-b border-outline-variant">
          <div class="font-headline-md text-headline-md font-bold text-primary">UR FIRE SAFETY</div>
          <button id="close-drawer-btn" class="text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav class="flex flex-col gap-4 font-label-sm text-label-sm">
          <a class="py-2 border-b border-outline-variant text-primary font-bold" href="index.html">HOME</a>
          <a class="py-2 border-b border-outline-variant text-secondary hover:text-primary" href="services.html">SERVICES</a>
          <a class="py-2 border-b border-outline-variant text-secondary hover:text-primary" href="products.html">PRODUCTS</a>
          <a class="py-2 border-b border-outline-variant text-secondary hover:text-primary" href="about.html">ABOUT US</a>
          <a class="py-2 border-b border-outline-variant text-secondary hover:text-primary" href="contact.html">CONTACT</a>
          <a class="py-2 border-b border-outline-variant text-secondary hover:text-primary" href="admin.html">OWNER CRM LOGIN</a>
        </nav>
        <div class="mt-auto pt-6 border-t border-outline-variant">
          <div class="bg-primary text-on-primary p-4 text-center font-label-sm font-bold">
            EMERGENCY: +91 9274733827
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer || e.target.closest('#close-drawer-btn')) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   3. Sticky Header Scroll Effect
   ========================================================================== */
function initScrollHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }
  });
}

/* ==========================================================================
   4. Dynamic Site Stats Sync
   ========================================================================== */
function getSiteSettings() {
  const defaultSettings = {
    active_clients: 500,
    years_experience: 12,
    installations: 5000,
    support_hours_label: "24/7"
  };

  try {
    const stored = localStorage.getItem('ur_fire_site_settings');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error reading site settings:", e);
  }
  return defaultSettings;
}

function initStatsCounters() {
  const settings = getSiteSettings();

  // Update elements by data attribute or class
  const yearsEl = document.querySelector('[data-stat="years"]');
  const installsEl = document.querySelector('[data-stat="installations"]');
  const clientsEl = document.querySelector('[data-stat="clients"]');
  const supportEl = document.querySelector('[data-stat="support"]');

  if (yearsEl) yearsEl.textContent = `${settings.years_experience}+`;
  if (installsEl) installsEl.textContent = `${Number(settings.installations).toLocaleString()}+`;
  if (clientsEl) clientsEl.textContent = `${Number(settings.active_clients).toLocaleString()}+`;
  if (supportEl) supportEl.textContent = settings.support_hours_label;
}

/* ==========================================================================
   5. Lead Form Submission to CRM Persistence
   ========================================================================== */
function initLeadForms() {
  const forms = document.querySelectorAll('form#contactForm, form.lead-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const leadData = {
        id: 'lead_' + Date.now(),
        name: formData.get('name') || form.querySelector('[name="name"]')?.value || 'Inquirer',
        phone: formData.get('phone') || form.querySelector('[name="phone"]')?.value || 'N/A',
        email: formData.get('email') || form.querySelector('[name="email"]')?.value || '',
        service_interested: formData.get('service') || form.querySelector('[name="service"]')?.value || 'General Quote',
        message: formData.get('message') || form.querySelector('[name="message"]')?.value || '',
        source: window.location.search.includes('inquiry=quote') ? 'quote_request' : 'contact_form',
        status: 'new',
        created_at: new Date().toISOString()
      };

      // Save to localStorage leads
      try {
        const existingLeads = JSON.parse(localStorage.getItem('ur_fire_leads') || '[]');
        existingLeads.unshift(leadData);
        localStorage.setItem('ur_fire_leads', JSON.stringify(existingLeads));
      } catch (err) {
        console.error("Error storing lead:", err);
      }

      // Display Success Message
      showSuccessToast("✔ Quote Inquiry Submitted! Our engineering team will contact you within 2 hours.");
      form.reset();

      // Close modal if inside one
      const modal = form.closest('.modal-overlay');
      if (modal) modal.remove();
    });
  });
}

function showSuccessToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    z-index: 10000;
    background-color: #1a1c1c;
    color: #ffffff;
    border-left: 4px solid #b22222;
    padding: 16px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

/* ==========================================================================
   6. Quote Request Modal
   ========================================================================== */
function initQuoteModals() {
  const quoteButtons = document.querySelectorAll('button:contains("Technical Consultation"), .open-quote-modal, a[href*="inquiry=quote"]');

  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a');
    if (!target) return;

    const text = target.textContent.toUpperCase();
    if (text.includes('TECHNICAL CONSULTATION') || text.includes('REQUEST QUOTE') || target.classList.contains('open-quote-modal')) {
      if (target.tagName === 'A' && target.getAttribute('href').startsWith('contact.html')) {
        return; // Allow navigation to contact page if intended
      }
      e.preventDefault();
      openQuoteModal();
    }
  });
}

function openQuoteModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: rgba(26, 28, 28, 0.85);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  `;

  modal.innerHTML = `
    <div style="background-color: #f9f9f9; border: 2px solid #1a1c1c; max-width: 500px; width: 100%; padding: 32px; position: relative;">
      <button class="close-modal-btn" style="position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; font-size: 20px;">
        <span class="material-symbols-outlined">close</span>
      </button>
      <div style="background-color: #8f000d; color: #ffffff; display: inline-block; padding: 4px 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-bottom: 12px;">TECHNICAL CONSULTATION</div>
      <h3 style="font-family: 'IBM Plex Sans Condensed', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #1a1c1c;">Request Safety Audit or Quote</h3>
      <form class="lead-form" style="display: flex; flex-direction: column; gap: 12px;">
        <input type="text" name="name" placeholder="Full Name / Company Name *" required style="padding: 10px; border: 1px solid #8e706d; font-family: 'IBM Plex Sans', sans-serif;" />
        <input type="tel" name="phone" placeholder="Phone Number *" required style="padding: 10px; border: 1px solid #8e706d; font-family: 'IBM Plex Sans', sans-serif;" />
        <input type="email" name="email" placeholder="Email Address" style="padding: 10px; border: 1px solid #8e706d; font-family: 'IBM Plex Sans', sans-serif;" />
        <select name="service" style="padding: 10px; border: 1px solid #8e706d; font-family: 'IBM Plex Sans', sans-serif; background: #fff;">
          <option value="Hydrant & Sprinkler Systems">Hydrant & Sprinkler Systems</option>
          <option value="Fire Alarm & Detection">Fire Alarm & Detection Systems</option>
          <option value="Refilling & Hydrotesting">Refilling & Hydrotesting</option>
          <option value="Annual Maintenance (AMC)">Annual Maintenance (AMC)</option>
          <option value="Personal Protective Equipment (PPE)">Personal Protective Equipment (PPE)</option>
        </select>
        <textarea name="message" placeholder="Project / Requirement details..." rows="3" style="padding: 10px; border: 1px solid #8e706d; font-family: 'IBM Plex Sans', sans-serif;"></textarea>
        <button type="submit" style="background-color: #8f000d; color: #ffffff; padding: 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; text-transform: uppercase; border: none; cursor: pointer; margin-top: 8px;">SUBMIT REQUEST</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('.close-modal-btn')) {
      modal.remove();
    }
  });

  initLeadForms();
}

/* ==========================================================================
   7. Product Category Filtering (for products.html)
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface', 'text-secondary');
      });
      btn.classList.remove('bg-surface', 'text-secondary');
      btn.classList.add('bg-primary', 'text-on-primary');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Testimonials Sync from CRM
   ========================================================================== */
function initTestimonialsSync() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  try {
    const storedTestimonials = JSON.parse(localStorage.getItem('ur_fire_testimonials') || '[]');
    const published = storedTestimonials.filter(t => t.published);

    if (published.length > 0) {
      container.innerHTML = published.map(t => `
        <div class="technical-spec-card flat-architecture p-8 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1 text-primary mb-4">
              ${'★'.repeat(t.rating || 5)}
            </div>
            <p class="text-on-surface mb-6 italic font-body-lg">"${escapeHtml(t.quote_text)}"</p>
          </div>
          <div class="pt-4 border-t border-outline-variant flex items-center gap-4">
            <div class="w-10 h-10 bg-primary text-white font-headline-md flex items-center justify-center font-bold">
              ${escapeHtml(t.name.slice(0, 2).toUpperCase())}
            </div>
            <div>
              <div class="font-headline-md text-headline-md text-on-surface">${escapeHtml(t.name)}</div>
              <div class="font-label-sm text-label-sm text-secondary">${escapeHtml(t.role)} ${t.company ? '• ' + escapeHtml(t.company) : ''}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error("Error syncing testimonials:", err);
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
