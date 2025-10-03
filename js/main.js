/**
 * Modern Portfolio Website - Enhanced JavaScript
 * Author: Nathaniel Arcega
 * Description: Modern ES6+ JavaScript with performance optimization and accessibility
 */

class ModernPortfolio {
  constructor() {
    this.init();
    this.bindEvents();
  }

  init() {
    this.initProgressBar();
    this.initSmoothScroll();
    this.initModalSystem();
    this.initPortfolioFilters();
    this.initTabSystem();
    this.initBackToTop();
    this.initContactForm();
    this.initSideNavigation();
    this.initMobileMenu();
    this.initKeyboardNavigation();
    this.initAnimations();
    this.initLazyLoading();
  }

  bindEvents() {
    // Throttled scroll events for performance
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  // ===== UTILITY FUNCTIONS =====
  throttle(func, delay) {
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

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // ===== PROGRESS BAR =====
  initProgressBar() {
    this.progressBar = document.querySelector('.progress-fill');
    this.updateProgressBar();
  }

  updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.max(0, Math.min((scrollTop / docHeight) * 100, 100));
    
    if (this.progressBar) {
      this.progressBar.style.width = `${scrollPercent}%`;
    }
  }

  // ===== SIDE NAVIGATION (FIXED) =====
  initSideNavigation() {
    const sideNavLinks = document.querySelectorAll('.side-nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (!sideNavLinks.length || !sections.length) return;
    
    // Handle clicks
    sideNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          // Update active state immediately
          sideNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          
          // Smooth scroll
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Handle scroll updates
    this.initScrollNavigation(sideNavLinks, sections);
  }

  initScrollNavigation(sideNavLinks, sections) {
    let ticking = false;
    
    const updateActiveNav = () => {
      const scrollY = window.scrollY + 100; // Buffer for better detection
      
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop - 50 && scrollY < sectionTop + sectionHeight - 50) {
          current = section.getAttribute('id');
        }
      });
      
      // Update active states
      sideNavLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll);
    updateActiveNav(); // Initial call
  }

  // ===== MOBILE MENU =====
  initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!mobileToggle || !nav) return;
    
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    
    // Close mobile menu when clicking nav links
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });
    
    // Close on overlay click (not the menu itself)
    nav.addEventListener('click', (e) => {
      if (e.target === nav) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== MODAL SYSTEM =====
  initModalSystem() {
    this.modals = new Map();
    
    document.querySelectorAll('.modal').forEach(modal => {
      this.modals.set(modal.id, { element: modal, isOpen: false });
    });

    this.bindModalTriggers();
    this.bindModalClosers();
  }

  bindModalTriggers() {
    // Design modal triggers
    document.querySelectorAll('[data-modal="design-modal"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const imageSrc = trigger.getAttribute('data-image');
        this.openDesignModal(imageSrc);
      });
    });

    // Certificate modal triggers
    document.querySelectorAll('[data-modal="cert-modal"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const certImage = trigger.getAttribute('data-cert-image');
        const certTitle = trigger.getAttribute('data-cert-title');
        this.openCertificateModal(certImage, certTitle);
      });
    });

    // Other modal triggers
    document.querySelectorAll('[data-modal="shopify-modal"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal('shopify-modal');
      });
    });

    document.querySelectorAll('[data-modal="lilo-modal"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal('lilo-modal');
      });
    });
  }

  bindModalClosers() {
    document.querySelectorAll('[data-modal-close]').forEach(closer => {
      closer.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeModal(closer.closest('.modal'));
      });
    });
  }

  openDesignModal(imageSrc) {
    const modal = document.getElementById('design-modal');
    const image = modal.querySelector('.modal-image');
    
    if (modal && image) {
      image.src = imageSrc;
      this.showModal(modal);
    }
  }

  openCertificateModal(certImage, certTitle) {
    const modal = document.getElementById('cert-modal');
    const image = modal.querySelector('.cert-modal-image');
    const title = modal.querySelector('.cert-modal-title');
    
    if (modal && image && title) {
      image.src = certImage;
      image.alt = certTitle;
      title.textContent = certTitle;
      this.showModal(modal);
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) this.showModal(modal);
  }

  showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    this.modals.get(modal.id).isOpen = true;
  }

  closeModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    this.modals.get(modal.id).isOpen = false;
  }

  // ===== PORTFOLIO FILTERS =====
  initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;
          
          if (shouldShow) {
            item.style.display = 'block';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
          }
        });
      });
    });
  }

  // ===== TAB SYSTEM =====
  initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.getAttribute('data-content') === targetTab) {
            content.classList.add('active');
          }
        });
      });
    });
  }

  // ===== BACK TO TOP =====
  initBackToTop() {
    this.backToTopButton = document.getElementById('backToTop');
    if (!this.backToTopButton) return;
    
    this.backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  updateBackToTop() {
    if (!this.backToTopButton) return;
    
    const scrolled = window.pageYOffset > 500;
    this.backToTopButton.classList.toggle('visible', scrolled);
  }

  // ===== CONTACT FORM =====
  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      setTimeout(() => {
        this.showToast('Message sent successfully! I\'ll get back to you soon.');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 2000);
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== KEYBOARD NAVIGATION =====
  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.modals.forEach(modal => {
          if (modal.isOpen) this.closeModal(modal.element);
        });
      }
    });
  }

  // ===== ANIMATIONS =====
  initAnimations() {
    // Simple fade-in animation for elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });

    document.querySelectorAll('.animate').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
    
    // RESTORE TYPING ANIMATION
    this.initTypingAnimation();
  }
  
  // ===== TYPING ANIMATION (RESTORED) =====
  initTypingAnimation() {
    const roleElement = document.querySelector('.hero-title .role');
    if (!roleElement) return;

    const roles = ['Web Designer', 'UI/UX Designer', 'WordPress Developer', 'Shopify Developer'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    const typeRole = () => {
      const currentRole = roles[currentRoleIndex];
      
      if (isDeleting) {
        currentCharIndex--;
        const displayText = currentRole.substring(0, currentCharIndex);
        // Use invisible character when empty to maintain space
        roleElement.textContent = displayText || '\u00A0'; // Non-breaking space
      } else {
        currentCharIndex++;
        roleElement.textContent = currentRole.substring(0, currentCharIndex);
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && currentCharIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next role
      }
      
      setTimeout(typeRole, typeSpeed);
    };
    
    // Start typing animation after a delay
    setTimeout(typeRole, 1000);
  }

  // ===== LAZY LOADING =====
  initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ===== EVENT HANDLERS =====
  handleScroll() {
    this.updateProgressBar();
    this.updateBackToTop();
  }

  handleResize() {
    this.updateProgressBar();
  }

  handleKeyboard(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      console.log('Quick navigation coming soon!');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernPortfolio();
});
