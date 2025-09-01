/**
 * Portfolio Website - Main JavaScript File
 * Author: Nathaniel Arcega
 * Description: Handles all interactive functionality for the portfolio website
 */

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.initScrollAnimations();
    this.initModalHandlers();
    this.initCertificateHandlers();
    this.initScrollHandlers();
    this.initKeyboardAccessibility();
    this.initPortfolioTabs(); // <-- Add this line
    this.initShopifyModal(); // <-- Add this line
  }

  // Intersection Observer for scroll animations
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate, [data-animate-stagger]').forEach(el => {
      observer.observe(el);
    });
  }

  // Modal functionality for project images
  initModalHandlers() {
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.getElementById('closeImgModal');

    if (!modal || !modalImg || !closeBtn) return;

    // Handle modal trigger buttons
    document.querySelectorAll('[data-modal-trigger]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = button.getAttribute('data-modal-img');
        this.openModal(modal, modalImg, imgSrc);
      });
    });

    // Close modal handlers
    closeBtn.addEventListener('click', () => this.closeModal(modal, modalImg));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal(modal, modalImg);
    });
  }

  // Certificate modal functionality
  initCertificateHandlers() {
    const certModal = document.getElementById('certificateModal');
    const certModalImg = document.getElementById('certificateImg');
    const certCloseBtn = document.getElementById('closeCertificateModal');

    if (!certModal || !certModalImg || !certCloseBtn) return;

    // Handle certificate buttons
    document.querySelectorAll('[data-certificate-btn]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = `assets/${button.getAttribute('data-certificate-btn')}`;
        this.openModal(certModal, certModalImg, imgSrc);
      });
    });

    // Close certificate modal handlers
    certCloseBtn.addEventListener('click', () => this.closeModal(certModal, certModalImg));
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) this.closeModal(certModal, certModalImg);
    });
  }

  // Scroll to section handlers
  initScrollHandlers() {
    document.querySelectorAll('[data-scroll-to]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = button.getAttribute('data-scroll-to');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Keyboard accessibility
  initKeyboardAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  // Portfolio tab filtering
  initPortfolioTabs() {
    const tabBtns = document.querySelectorAll('.portfolio-tabs .tab-btn');
    const projects = document.querySelectorAll('.projects-grid .project-card');
    if (!tabBtns.length || !projects.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        projects.forEach(card => {
          if (tab === 'all' || card.getAttribute('data-category') === tab) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Shopify modal functionality
  initShopifyModal() {
    const shopifyModal = document.getElementById('shopifyModal');
    const closeBtn = document.getElementById('closeShopifyModal');
    const title = document.getElementById('shopifyModalTitle');
    const desc = document.getElementById('shopifyModalDesc');
    const beforeImg = document.getElementById('shopifyModalBefore');
    const afterImg = document.getElementById('shopifyModalAfter');
    const linkBtn = document.getElementById('shopifyModalLink');

    if (!shopifyModal || !closeBtn || !title || !desc || !beforeImg || !afterImg || !linkBtn) return;

    document.querySelectorAll('[data-shopify-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        title.textContent = btn.getAttribute('data-title') || '';
        desc.textContent = btn.getAttribute('data-description') || '';
        beforeImg.src = btn.getAttribute('data-before') || '';
        afterImg.src = btn.getAttribute('data-after') || '';
        linkBtn.href = btn.getAttribute('data-link') || '#';
        shopifyModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          shopifyModal.classList.add('show');
          shopifyModal.focus();
        });
      });
    });

    closeBtn.addEventListener('click', () => {
      shopifyModal.classList.remove('show');
      document.body.style.overflow = '';
      setTimeout(() => {
        shopifyModal.style.display = 'none';
        beforeImg.src = '';
        afterImg.src = '';
      }, 350);
    });

    shopifyModal.addEventListener('click', (e) => {
      if (e.target === shopifyModal) {
        shopifyModal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
          shopifyModal.style.display = 'none';
          beforeImg.src = '';
          afterImg.src = '';
        }, 350);
      }
    });
  }

  // Modal utility methods
  openModal(modal, img, imgSrc) {
    if (!modal || !img) return;
    
    img.src = imgSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add show class after a small delay for smooth transition
    requestAnimationFrame(() => {
      modal.classList.add('show');
      modal.focus();
      
      // Scroll to top of modal for long images
      modal.scrollTop = 0;
      
      // Add scroll indicator for long images
      this.addScrollIndicator(modal, img);
    });
  }

  addScrollIndicator(modal, img) {
    // Wait for image to load to check if scrolling is needed
    img.onload = () => {
      const modalHeight = modal.clientHeight;
      const imgHeight = img.clientHeight;
      
      if (imgHeight > modalHeight * 0.8) {
        this.showScrollIndicator(modal);
      }
    };
  }

  showScrollIndicator(modal) {
    // Remove existing indicator
    const existingIndicator = modal.querySelector('.scroll-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    // Create scroll indicator
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.textContent = '↓ Scroll to explore the full design ↓';
    modal.appendChild(indicator);

    // Remove indicator after animation or on scroll
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, 4000);

    // Remove on scroll
    modal.addEventListener('scroll', () => {
      if (indicator.parentNode) {
        indicator.remove();
      }
    }, { once: true });
  }

  closeModal(modal, img) {
    if (!modal || !img) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Remove scroll indicator if exists
    const indicator = modal.querySelector('.scroll-indicator');
    if (indicator) {
      indicator.remove();
    }
    
    setTimeout(() => {
      modal.style.display = 'none';
      img.src = '';
    }, 350);
  }

  closeAllModals() {
    const modals = [
      { modal: document.getElementById('imgModal'), img: document.getElementById('modalImg') },
      { modal: document.getElementById('certificateModal'), img: document.getElementById('certificateImg') }
    ];

    modals.forEach(({ modal, img }) => {
      if (modal && modal.style.display === 'flex') {
        this.closeModal(modal, img);
      }
    });
  }
}

// Mobile navigation functionality
class MobileNavigation {
  constructor() {
    this.hamburger = document.getElementById('hamburger-btn');
    this.sidebar = document.getElementById('sidebar-nav');
    this.overlay = this.createOverlay();
    this.init();
  }

  init() {
    if (!this.hamburger || !this.sidebar) return;
    
    this.hamburger.addEventListener('click', () => this.openSidebar());
    this.overlay.addEventListener('click', () => this.closeSidebar());
    
    // Close sidebar on nav link click
    this.sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.closeSidebar());
    });
  }

  createOverlay() {
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  openSidebar() {
    this.sidebar?.classList.add('open');
    this.overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.sidebar?.classList.remove('open');
    this.overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
  new MobileNavigation();
});
