/* ============================================
   COMPONENTS.JS — Shared Header, Footer, Navigation
   ============================================ */

/**
 * Renders the shared header/navbar into the page.
 * Detects the current page and highlights the active nav link.
 * Adds page transition: on nav link click, fades body out before navigating.
 */
function renderHeader() {
  const headerPlaceholder = document.getElementById('header');
  if (!headerPlaceholder) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const pages = [
    { href: 'index.html', label: 'Home' },
    { href: 'work.html', label: 'Work' },
    { href: 'journey.html', label: 'Journey' },
    { href: 'contact.html', label: 'Contact' },
  ];

  const navLinks = pages.map(page => {
    const isActive = currentPage === page.href ||
      (currentPage === '' && page.href === 'index.html');
    return `<li><a href="${page.href}" class="nav-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${page.label}</a></li>`;
  }).join('\n');

  headerPlaceholder.innerHTML = `
    <nav class="navbar" id="navbar">
      <div class="nav-container">
        <a href="index.html" class="nav-brand">
          <div class="brand-logo">SP</div>
          <span class="brand-name">Sayan Paul</span>
        </a>
        <ul class="nav-menu" id="nav-menu">
          ${navLinks}
        </ul>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </nav>
  `;

  // Attach page transition to nav links
  initPageTransitions();
}

/**
 * Renders the shared footer.
 */
function renderFooter() {
  const footerPlaceholder = document.getElementById('footer');
  if (!footerPlaceholder) return;

  footerPlaceholder.innerHTML = `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-left">
          &copy; ${new Date().getFullYear()} Sayan Paul
        </div>
        <div class="footer-social">
          <a href="mailto:685sayan@gmail.com" aria-label="Email Sayan Paul"><i class="fas fa-envelope" aria-hidden="true"></i></a>
          <a href="https://github.com/Sayan1776" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a>
          <a href="https://www.linkedin.com/in/sayan-paul-96531632a" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin" aria-hidden="true"></i></a>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Page transitions: fade body out on nav link click, then navigate.
 * Uses anime.js v4 API: anime.animate(targets, params)
 */
function initPageTransitions() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Skip if it's the current page or an anchor link
      if (this.classList.contains('active') || href.startsWith('#')) return;

      e.preventDefault();

      // Fade out with anime.js then navigate
      if (typeof anime !== 'undefined') {
        anime.animate(document.body, {
          opacity: [1, 0],
          duration: 300,
          easing: 'easeInQuad',
          complete: () => { window.location.href = href; }
        });
      } else {
        window.location.href = href;
      }
    });
  });
}

/**
 * Mobile menu toggle.
 */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('active');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', !isOpen);
  });

  // Close on link click
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Smooth scrolling for in-page anchor links.
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 60;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Ambient Background Particles — subtle starfield with connecting lines.
 * Auto-injects a fixed fullscreen canvas behind all content.
 */
function initAmbientParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-bg';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth <= 768;
  const DOT_COUNT = isMobile ? 30 : 60;
  const CONNECT_DIST = 120;
  const MOUSE_DIST = 150;
  const MOUSE_PUSH = 0.3;

  let w, h;
  let mouseX = null, mouseY = null;
  let dots = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createDots() {
    dots = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      // Mouse repulsion
      if (mouseX !== null && mouseY !== null) {
        const dx = d.x - mouseX;
        const dy = d.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST && dist > 0) {
          const force = (1 - dist / MOUSE_DIST) * MOUSE_PUSH;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }
      }

      // Dampen velocity
      d.vx *= 0.99;
      d.vy *= 0.99;

      // Move
      d.x += d.vx;
      d.y += d.vy;

      // Bounce off edges
      if (d.x < 0) { d.x = 0; d.vx *= -1; }
      if (d.x > w) { d.x = w; d.vx *= -1; }
      if (d.y < 0) { d.y = 0; d.vy *= -1; }
      if (d.y > h) { d.y = h; d.vy *= -1; }

      // Draw dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();

      // Draw connecting lines to nearby dots
      for (let j = i + 1; j < dots.length; j++) {
        const d2 = dots[j];
        const dx = d.x - d2.x;
        const dy = d.y - d2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d2.x, d2.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / CONNECT_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  createDots();

  window.addEventListener('resize', () => {
    resize();
    createDots();
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
  });

  requestAnimationFrame(animate);
}

// Auto-init ambient particles on all pages
document.addEventListener('DOMContentLoaded', () => {
  initAmbientParticles();
});
