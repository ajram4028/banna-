/* ============================================================
   BANNA CONSTRUCTION — IMPROVED JAVASCRIPT
   Complete refactor with proper navbar, animations, and interactions
   ============================================================ */

'use strict';

/* ============================================================
   1. LOADER & PAGE INITIALIZATION
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const loaderPercent = document.querySelector('.loader-percent');

  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      if (loaderPercent) loaderPercent.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealOnLoad();
      }, 300);
    }
    if (loaderPercent) loaderPercent.textContent = Math.floor(progress) + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Cursor scale on hover
  const hoverTargets = document.querySelectorAll('a, button, .service-card, .project-card, .gallery-item, .filter-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
      follower.style.borderColor = 'var(--primary-green)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'var(--primary-blue)';
    });
  });

  // Hide on touch
  document.addEventListener('touchstart', () => {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }, { once: true });
})();

/* ============================================================
   3. NAVBAR — FIXED & IMPROVED
   ============================================================ */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Scroll effect
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });

  // Hamburger menu toggle - IMPROVED
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });

    // Close on nav link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.classList.remove('nav-open');
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 960) {
          navMenu.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.classList.remove('nav-open');
        }
      }, 250);
    });
  }
})();

/* ============================================================
   4. SCROLL TO TOP BUTTON
   ============================================================ */
(function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initRevealOnLoad() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve - let it stay visible
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================================
   6. ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function - ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // Target counter elements
  const counters = document.querySelectorAll('.stat-number, .hero-stat-num');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    if (counter.getAttribute('data-target')) {
      counterObserver.observe(counter);
    }
  });
})();

/* ============================================================
   7. GALLERY FILTER & DISPLAY
   ============================================================ */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          item.style.display = 'block';
          // Trigger reflow
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();

/* ============================================================
   8. LIGHTBOX — IMPROVED
   ============================================================ */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => 
      item.style.display !== 'none' && window.getComputedStyle(item).display !== 'none'
    );
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    
    if (visibleItems[currentIndex]) {
      const img = visibleItems[currentIndex].querySelector('.gallery-img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
    }
    
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentIndex]?.querySelector('.gallery-img');
    
    if (img) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.opacity = '1';
      }, 150);
    }
  }

  function showNext() {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    const img = visibleItems[currentIndex]?.querySelector('.gallery-img');
    
    if (img) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.opacity = '1';
      }, 150);
    }
  }

  lightboxImg.style.transition = 'opacity 0.2s ease';

  // Click gallery items to open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
    });
  });

  // Close lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Navigation
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else showPrev();
    }
  }, { passive: true });
})();

/* ============================================================
   9. CONTACT FORM — WHATSAPP SUBMISSION
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '916385554182';

  const PROJECT_TYPE_LABELS = {
    residential: 'Residential Construction',
    commercial: 'Commercial Construction',
    interior: 'Interior Design',
    renovation: 'Renovation & Remodeling'
  };

  const BUDGET_LABELS = {
    'under-25': 'Under ₹25 Lakhs',
    '25-50': '₹25 - 50 Lakhs',
    '50-100': '₹50 - 100 Lakhs',
    '100-250': '₹100 - 250 Lakhs'
  };

  const TIMELINE_LABELS = {
    immediate: 'Immediate (Next 3 months)',
    '3-6': '3 - 6 Months',
    '6-12': '6 - 12 Months',
    planning: 'Still in Planning'
  };

  function buildWhatsAppMessage(data) {
    const lines = [];
    lines.push('Hello BANNA Construction! I would like to enquire about a project.');
    lines.push('');
    lines.push('*Name:* ' + data.name);
    lines.push('*Email:* ' + data.email);
    lines.push('*Phone:* ' + data.phone);

    if (data.projectType) {
      lines.push('*Project Type:* ' + (PROJECT_TYPE_LABELS[data.projectType] || data.projectType));
    }
    if (data.budget) {
      lines.push('*Estimated Budget:* ' + (BUDGET_LABELS[data.budget] || data.budget));
    }
    if (data.timeline) {
      lines.push('*Timeline:* ' + (TIMELINE_LABELS[data.timeline] || data.timeline));
    }

    lines.push('');
    lines.push('*Project Details:*');
    lines.push(data.message);

    return lines.join('\n');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let firstInvalid = null;
    
    requiredFields.forEach(field => {
      if (field.value.trim() === '') {
        field.style.borderColor = '#ff6b6b';
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const formData = new FormData(form);
    const data = {
      name: (formData.get('name') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim(),
      phone: (formData.get('phone') || '').toString().trim(),
      projectType: (formData.get('projectType') || '').toString().trim(),
      budget: (formData.get('budget') || '').toString().trim(),
      timeline: (formData.get('timeline') || '').toString().trim(),
      message: (formData.get('message') || '').toString().trim()
    };

    // Update button state
    submitBtn.innerHTML = '<span>Opening WhatsApp...</span> <i class="fa fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';

    const message = buildWhatsAppMessage(data);
    const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');

      submitBtn.innerHTML = '<span>Redirected to WhatsApp!</span> <i class="fa fa-check"></i>';
      submitBtn.style.background = 'linear-gradient(135deg, var(--secondary-lime), var(--secondary-lime-dark))';
      submitBtn.style.color = 'var(--text-dark)';

      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        margin-top: 20px;
        padding: 16px 20px;
        background: rgba(166, 206, 0, 0.1);
        border: 1px solid var(--secondary-lime);
        border-radius: 6px;
        color: var(--secondary-lime);
        font-size: 0.85rem;
        text-align: center;
      `;
      successMsg.innerHTML = '<i class="fa fa-check-circle" style="margin-right:8px;"></i> Your enquiry was sent to WhatsApp. Continue the chat to finish.';
      form.appendChild(successMsg);

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        if (successMsg.parentNode) successMsg.parentNode.removeChild(successMsg);
      }, 5000);
    }, 600);
  });

  // Input validation feedback
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        input.style.borderColor = '#ff6b6b';
      } else {
        input.style.borderColor = 'var(--primary-blue)';
      }
    });

    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.style.borderColor = 'var(--primary-blue)';
      }
    });
  });
})();

/* ============================================================
   10. MOBILE BOTTOM NAVIGATION
   ============================================================ */
(function initMobileBottomNav() {
  if (window.innerWidth > 960) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const bottomNavHTML = `
    <nav class="mobile-bottom-nav">
      <a href="index.html" class="mobile-nav-item ${currentPage === '' || currentPage === 'index.html' ? 'active' : ''}">
        <i class="fa fa-home mobile-nav-icon"></i>
      </a>
      <a href="services.html" class="mobile-nav-item ${currentPage === 'services.html' ? 'active' : ''}">
        <i class="fa fa-briefcase mobile-nav-icon"></i>
      </a>
      <a href="construction-gallery.html" class="mobile-nav-item ${currentPage === 'construction-gallery.html' ? 'active' : ''}">
        <i class="fa fa-building mobile-nav-icon"></i>
      </a>
      <a href="interior-gallery.html" class="mobile-nav-item ${currentPage === 'interior-gallery.html' ? 'active' : ''}">
        <i class="fa fa-couch mobile-nav-icon"></i>
      </a>
      <a href="about.html" class="mobile-nav-item ${currentPage === 'about.html' ? 'active' : ''}">
        <i class="fa fa-info-circle mobile-nav-icon"></i>
      </a>
      <a href="contact.html" class="mobile-nav-item ${currentPage === 'contact.html' ? 'active' : ''}">
        <i class="fa fa-envelope mobile-nav-icon"></i>
      </a>
    </nav>
  `;

  document.body.insertAdjacentHTML('beforeend', bottomNavHTML);

  const navItems = document.querySelectorAll('.mobile-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Close navbar if open
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        document.querySelector('.nav-hamburger').classList.remove('open');
        document.body.classList.remove('nav-open');
      }

      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });

  // Update on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 960) {
        const mobileNav = document.querySelector('.mobile-bottom-nav');
        if (mobileNav) mobileNav.remove();
      }
    }, 250);
  });
})();

/* ============================================================
   11. INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initRevealOnLoad, 100);
});

/* ============================================================
   END OF JAVASCRIPT
   ============================================================ */