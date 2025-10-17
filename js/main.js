/**
 * Merged JavaScript for Portfolio
 * Combines main behavior + lightweight performance helpers into a single file
 * Suitable for static hosting (GitHub Pages)
 */

/* Utility: throttle and debounce */
function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay - (currentTime - lastExecTime));
    }
  };
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/* Progress bar */
function updateProgressBar() {
  const progressBar = document.querySelector('.progress-fill');
  if (!progressBar) return;
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = Math.max(0, Math.min((scrollTop / docHeight) * 100, 100));
  progressBar.style.width = `${scrollPercent}%`;
}

/* Back to top */
function updateBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.classList.toggle('visible', window.pageYOffset > 500);
}

/* Smooth scroll for on-page links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href.startsWith('#')) return;
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });
}

/* Mobile menu */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  if (!mobileToggle || !nav) return;
  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', (!isExpanded).toString());
    nav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });
  nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('active');
    document.body.classList.remove('nav-open');
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      mobileToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
      document.body.classList.remove('nav-open');
    }
  });
}

/* Side nav highlighting */
function initSideNavHighlight() {
  const sideNavLinks = document.querySelectorAll('.side-nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!sideNavLinks.length || !sections.length) return;

  const updateActive = () => {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const h = section.offsetHeight;
      if (scrollY >= top - 50 && scrollY < top + h - 50) current = section.id;
    });
    sideNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', throttle(updateActive, 100));
  updateActive();
}

/* Portfolio filters */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (!filterButtons.length) return;
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  });
}

/* About section tabs */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  if (!tabButtons.length) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding content
      const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/* Simple modal system (handles design, cert, shopify, lilo modals) */
function initModals() {
  const modals = document.querySelectorAll('.modal');
  function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-modal="design-modal"]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-image');
      const modal = document.getElementById('design-modal');
      if (modal) {
        const img = modal.querySelector('.modal-image');
        if (img) img.src = src;
        showModal(modal);
      }
    });
  });
  document.querySelectorAll('[data-modal="cert-modal"]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-cert-image');
      const title = trigger.getAttribute('data-cert-title');
      const modal = document.getElementById('cert-modal');
      if (modal) {
        const img = modal.querySelector('.cert-modal-image');
        const h = modal.querySelector('.cert-modal-title');
        if (img) img.src = imgSrc;
        if (h) h.textContent = title || '';
        showModal(modal);
      }
    });
  });
  ['shopify-modal','lilo-modal','va-modal'].forEach(id => {
    document.querySelectorAll(`[data-modal="${id}"]`).forEach(trigger => {
      trigger.addEventListener('click', (e) => { e.preventDefault(); const modal = document.getElementById(id); if (modal) showModal(modal); });
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); const modal = btn.closest('.modal'); if (modal) closeModal(modal); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modals.forEach(m => closeModal(m)); });
}

/* Simple lazy loading for images using IntersectionObserver */
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px 0px' });
    images.forEach(img => obs.observe(img));
  }
}

/* Contact form (placeholder behavior) */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submit = form.querySelector('button[type=submit]');
    const orig = submit.textContent;
    submit.textContent = 'Sending...'; submit.disabled = true;
    setTimeout(() => { alert('Message sent (demo).'); form.reset(); submit.textContent = orig; submit.disabled = false; }, 1000);
  });
}

/* Typing animation for hero roles */
function initTyping() {
  const roleElement = document.querySelector('.hero-title .role');
  if (!roleElement) return;
  const roles = ['Web Designer', 'WordPress Developer', 'Shopify Developer'];
  let i = 0, char = 0, deleting = false;
  const tick = () => {
    const current = roles[i];
    if (deleting) { char--; roleElement.textContent = current.substring(0, char) || '\u00A0'; }
    else { char++; roleElement.textContent = current.substring(0, char); }
    let timeout = deleting ? 50 : 100;
    if (!deleting && char === current.length) { timeout = 2000; deleting = true; }
    else if (deleting && char === 0) { deleting = false; i = (i+1) % roles.length; timeout = 500; }
    setTimeout(tick, timeout);
  };
  setTimeout(tick, 800);
}

/* Initialize everything */
function init() {
  initSmoothScroll();
  initMobileMenu();
  initSideNavHighlight();
  initPortfolioFilters();
  initTabs();
  initModals();
  initLazyLoading();
  initContactForm();
  initTyping();
  updateProgressBar();
  updateBackToTop();
  window.addEventListener('scroll', throttle(() => { updateProgressBar(); updateBackToTop(); }, 16), { passive: true });
  window.addEventListener('resize', debounce(() => { updateProgressBar(); }, 250));
}

document.addEventListener('DOMContentLoaded', init);
