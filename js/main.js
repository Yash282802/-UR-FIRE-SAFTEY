/**
 * UR Fire Safety Solution - Core JavaScript
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initStatsCounter();
  initContactForm();
  initProductInquiryPreFill();
});

/**
 * 1. Sticky Header Functionality
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const toggleHeaderState = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial run
  toggleHeaderState();
  
  // Scroll event
  window.addEventListener('scroll', toggleHeaderState);
}

/**
 * 2. Mobile Hamburger Menu Interaction
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll to prevent scrolling while menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * 3. Animated Statistics Counters
 */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num');
  if (stats.length === 0) return;

  const speed = 200; // Counter speed (lower is faster)

  const startCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    let count = 0;
    
    // Determine step value
    const step = Math.ceil(target / speed);
    
    const updateCount = () => {
      count += step;
      if (count < target) {
        counter.innerText = count + '+';
        setTimeout(updateCount, 5);
      } else {
        counter.innerText = target + '+';
      }
    };
    
    updateCount();
  };

  // Intersection Observer to trigger animation when scrolled into view
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

/**
 * 4. Contact Form Validation and Submission Integration
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccessMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset status styling
    let isValid = true;
    const inputs = form.querySelectorAll('.contact-input');
    
    inputs.forEach(input => {
      // Basic empty field validation
      if (input.hasAttribute('required') && !input.value.trim()) {
        highlightError(input);
        isValid = false;
      } else {
        clearError(input);
      }

      // Email formatting validation
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          highlightError(input);
          isValid = false;
        }
      }

      // Phone formatting validation (minimum 10 digits)
      if (input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^[0-9\s\-+\(\)]{10,15}$/;
        if (!phoneRegex.test(input.value.trim().replace(/\s/g, ''))) {
          highlightError(input);
          isValid = false;
        }
      }
    });

    if (isValid) {
      const formData = new FormData(form);
      const dataObj = {};
      formData.forEach((value, key) => { dataObj[key] = value; });

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      
      submitBtn.disabled = true;
      submitBtn.innerText = 'SENDING...';

      const API_BASE = 'https://api.urfiresafety.com/v1';

      fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataObj),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (successMsg) {
              successMsg.style.display = 'block';
              form.reset();
              successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => { successMsg.style.display = 'none'; }, 8000);
            }
          } else {
            alert(data.message || 'Submission failed. Please try again.');
          }
        })
        .catch(() => {
          alert('Network error. Please check your connection and try again.');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        });
    }
  });

  function highlightError(input) {
    input.style.borderColor = 'var(--color-error)';
    input.style.backgroundColor = 'var(--color-error-container)';
  }

  function clearError(input) {
    input.style.borderColor = 'var(--color-on-surface)';
    input.style.backgroundColor = '#ffffff';
  }
}

/**
 * 5. Pre-Fill Contact Page dropdown if navigated from Products catalog
 * Example URL: contact.html?inquiry=fire-extinguishers
 */
function initProductInquiryPreFill() {
  const serviceDropdown = document.getElementById('serviceSelect');
  if (!serviceDropdown) return;

  const urlParams = new URLSearchParams(window.location.search);
  const inquiryParam = urlParams.get('inquiry');

  if (inquiryParam) {
    // Map URL parameter to dropdown select value
    for (let i = 0; i < serviceDropdown.options.length; i++) {
      if (serviceDropdown.options[i].value === inquiryParam) {
        serviceDropdown.selectedIndex = i;
        break;
      }
    }
  }
}
