(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Persist the selected theme across pages, tabs, and local-file previews.
  const themeButton = $('#theme-toggle');
  const themeGlyph = $('.theme-glyph', themeButton || document);
  const themeLabel = $('.theme-label', themeButton || document);
  const syncThemeLinks = theme => {
    $$('a[href]').forEach(anchor => {
      const url = new URL(anchor.href, location.href);
      if (url.protocol !== location.protocol || url.host !== location.host) return;
      if (url.protocol !== 'file:' && url.origin !== location.origin) return;
      url.searchParams.set('theme', theme);
      anchor.href = url.href;
    });
  };
  const applyTheme = (theme, persist = false) => {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      if (themeGlyph) themeGlyph.textContent = dark ? '☀' : '☾';
      if (themeLabel) themeLabel.textContent = dark ? 'LIGHT MODE' : 'DARK MODE';
    }
    const themeMeta = $('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#0b1118' : '#fff8ef');
    syncThemeLinks(dark ? 'dark' : 'light');
    if (persist) {
      const value = dark ? 'dark' : 'light';
      try { localStorage.setItem('sayan-theme', value); } catch (_) {}
      try {
        const rest = window.name.split('|').filter(part => !part.startsWith('sayan-theme=')).join('|');
        window.name = `${rest}${rest ? '|' : ''}sayan-theme=${value}`;
      } catch (_) {}
    }
  };
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  window.addEventListener('storage', event => {
    if (event.key === 'sayan-theme' && (event.newValue === 'dark' || event.newValue === 'light')) applyTheme(event.newValue);
  });
  if (themeButton) themeButton.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    themeButton.classList.remove('theme-pop');
    void themeButton.offsetWidth;
    themeButton.classList.add('theme-pop');
  });

  // A precise, compact cursor with a focus ring that responds to interactive elements.
  // It replaces the ink canvas and remains opt-in for fine pointers only.
  if (finePointer && !reduceMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor is-offscreen';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor-halo"><i></i></span><span class="cursor-core-ring"></span><span class="cursor-label">OPEN</span>';
    body.appendChild(cursor);
    const label = $('.cursor-label', cursor);
    body.classList.add('custom-cursor-enabled');

    const interactiveSelector = 'a,button,[role="button"],[data-cursor],.featured-project,.support-card,.hero-image-card,.skill-branch-toggle,.work-card';
    window.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      body.classList.remove('using-keyboard');
      cursor.classList.remove('is-offscreen');
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    }, { passive: true });

    window.addEventListener('pointerover', event => {
      const element = event.target instanceof Element ? event.target : null;
      const target = element?.closest(interactiveSelector);
      const inForm = element?.closest('input,textarea,select,[contenteditable="true"]');
      cursor.classList.toggle('is-interactive', Boolean(target));
      cursor.classList.toggle('is-hidden', Boolean(inForm));
      if (target && label) {
        const title = target.querySelector('.tile-title,.featured-copy h3,.support-copy h3')?.textContent?.trim();
        label.textContent = target.dataset.cursorLabel || (title ? `VIEW / ${title.split(/[\s—·]/)[0].toUpperCase()}` : target.matches('button,[role="button"]') ? 'SELECT' : 'OPEN');
      }
    });
    window.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
    const hideCursor = () => cursor.classList.add('is-offscreen');
    window.addEventListener('pointerleave', hideCursor);
    window.addEventListener('blur', hideCursor);
    document.addEventListener('keydown', event => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) body.classList.add('using-keyboard');
    });
    document.addEventListener('pointerdown', () => body.classList.remove('using-keyboard'));
  }

  // The About-page toolkit is a real hierarchy. Connect every node to its
  // parent with responsive cubic curves so the diagram reflows at every width.
  const skillTree = $('#skill-tree');
  const treeSvg = $('#skill-tree-links', skillTree || document);
  if (skillTree && treeSvg) {
    const NS = 'http://www.w3.org/2000/svg';
    let treeDrawFrame = 0;

    const drawSkillTree = () => {
      treeDrawFrame = 0;
      const treeRect = skillTree.getBoundingClientRect();
      const width = Math.max(1, skillTree.clientWidth);
      const height = Math.max(1, skillTree.scrollHeight);
      treeSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      treeSvg.setAttribute('width', String(width));
      treeSvg.setAttribute('height', String(height));
      treeSvg.innerHTML = '';

      const nodes = new Map();
      $$('[data-tree-node]', skillTree).forEach(node => {
        if (node.getClientRects().length && !node.closest('[hidden]')) {
          nodes.set(node.dataset.treeNode, node);
        }
      });

      $$('[data-tree-node][data-tree-parent]', skillTree).forEach(child => {
        const parent = nodes.get(child.dataset.treeParent);
        if (!parent || !nodes.has(child.dataset.treeNode)) return;
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        const x1 = parentRect.left + parentRect.width / 2 - treeRect.left;
        const y1 = parentRect.bottom - treeRect.top - 1;
        const x2 = childRect.left + childRect.width / 2 - treeRect.left;
        const y2 = childRect.top - treeRect.top + 1;
        const gap = Math.max(0, y2 - y1);
        const bend = Math.min(76, Math.max(12, gap * 0.46));

        const path = document.createElementNS(NS, 'path');
        const c1x = x1 + (x2 - x1) * 0.04;
        const c2x = x2 - (x2 - x1) * 0.04;
        path.setAttribute('d', `M ${x1.toFixed(2)} ${y1.toFixed(2)} C ${c1x.toFixed(2)} ${(y1 + bend).toFixed(2)}, ${c2x.toFixed(2)} ${(y2 - bend).toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}`);
        const kind = parent.dataset.treeNode === 'toolkit'
          ? 'tree-link-root'
          : child.classList.contains('skill-node-chip')
            ? 'tree-link-leaf'
            : 'tree-link-sub';
        path.setAttribute('class', `tree-link ${kind}`);
        treeSvg.appendChild(path);

        // Small endpoint terminals make the branching hierarchy read like a
        // drawn tree, while the curved strokes remain continuous (not dotted).
        if (!child.classList.contains('skill-node-chip')) {
          const dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('cx', x2.toFixed(2));
          dot.setAttribute('cy', (y2 + 1).toFixed(2));
          dot.setAttribute('r', kind === 'tree-link-root' ? '3' : '2.4');
          dot.setAttribute('class', 'tree-link-dot');
          treeSvg.appendChild(dot);
        }
      });
    };

    const scheduleSkillTreeDraw = () => {
      if (!treeDrawFrame) treeDrawFrame = requestAnimationFrame(drawSkillTree);
    };

    $$('[data-tree-toggle]', skillTree).forEach(button => {
      const target = document.getElementById(button.dataset.treeToggle);
      const item = button.closest('[data-tree-item]');
      const caret = $('.domain-caret, .subbranch-caret', button);
      if (!target) return;
      button.addEventListener('click', () => {
        const expand = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expand));
        target.hidden = !expand;
        if (item) item.classList.toggle('is-collapsed', !expand);
        if (caret) caret.textContent = expand ? '−' : '+';
        scheduleSkillTreeDraw();
      });
    });

    if ('ResizeObserver' in window) {
      const treeObserver = new ResizeObserver(scheduleSkillTreeDraw);
      treeObserver.observe(skillTree);
    }
    window.addEventListener('resize', scheduleSkillTreeDraw, { passive: true });
    window.addEventListener('load', scheduleSkillTreeDraw, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleSkillTreeDraw);
    scheduleSkillTreeDraw();
  }

  // Cinematic intro: once per tab session. Skip immediately for reduced motion.
  const intro = $('#cinematic-preloader');
  if (intro) {
    if (root.classList.contains('intro-pending') && !reduceMotion) {
      try { sessionStorage.setItem('sayan-portfolio-intro-seen', '1'); } catch (_) {}
      window.setTimeout(() => {
        intro.classList.add('is-exiting');
        window.setTimeout(() => {
          root.classList.remove('intro-pending');
          intro.remove();
        }, 700);
      }, 1850);
    } else {
      intro.remove();
      root.classList.remove('intro-pending');
    }
  }

  // Clear transition curtains when the browser restores a page from bfcache.
  window.addEventListener('pageshow', event => {
    body.classList.remove('leaving');
    if (event.persisted) {
      body.classList.remove('entering', 'menu-open');
      root.classList.remove('intro-pending');
      const stuckIntro = $('#cinematic-preloader');
      if (stuckIntro) stuckIntro.remove();
      const nav = $('#site-nav');
      const toggle = $('.menu-toggle');
      if (nav) nav.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Give the whole site a single scroll choreography system, including case studies.
  const motionTargets = [
    'main > section:not(.home-hero)',
    '.section-head', '.page-intro', '.project-tile', '.featured-project', '.support-card',
    '.desk-note', '.process-step', '.about-teaser', '.work-footnote', '.about-main-grid > *',
    '.journey-item', '.field-note', '.skills-sheet', '.principles-panel', '.contact-form-wrap',
    '.contact-bottom', '.case-hero', '.case-story', '.case-sidebar > *', '.case-bottom',
    '.hero-manifesto', '.hero-image-card', '.hero-bottomline', '.featured-art', '.featured-copy',
    '.site-footer'
  ].join(',');
  $$(motionTargets).forEach((element, index) => {
    if (!element.matches('.hero-monument,.hero-landscape')) element.setAttribute('data-scroll', '');
    // Stagger only siblings that share a grid/stack parent, not the entire document order.
    const peers = Array.from(element.parentElement?.children || []).filter(peer => peer.matches(motionTargets));
    const siblingIndex = Math.max(0, peers.indexOf(element));
    element.style.setProperty('--scroll-delay', `${Math.min(siblingIndex * 75, 300)}ms`);
  });

  const revealTargets = [...new Set($$('.reveal,.reveal-scale,[data-scroll]'))];
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(element => observer.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('visible', 'is-visible'));
  }

  // MENU curtain works on desktop and mobile; links remain normal anchors.
  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');
  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
    body.classList.remove('menu-open');
  };
  if (toggle && nav) {
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', open);
      body.classList.toggle('menu-open', open);
    });
    $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  // Progress line + gentle movement through the panoramic hero image.
  const progress = $('#progress-bar');
  const header = $('.site-header');
  const landscape = $('.hero-landscape-image');
  let queued = false;
  const updateScrollState = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${total > 0 ? Math.min(100, window.scrollY / total * 100) : 0}%`;
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (landscape && !reduceMotion) {
      const stage = landscape.closest('.hero-landscape');
      const rect = stage?.getBoundingClientRect();
      if (rect) {
        const distance = Math.max(-18, Math.min(28, (window.innerHeight * 0.55 - rect.top) * 0.035));
        landscape.style.setProperty('--parallax-y', `${distance.toFixed(1)}px`);
      }
    }
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  // Cinematic page-to-page curtain with a destination label.
  const curtain = $('.page-transition');
  if (!reduceMotion) {
    const pageLabels = {
      'index.html': 'BACK TO THE BUILD LOG',
      'about.html': 'THE PERSON BEHIND THE CODE',
      'work.html': 'THE WORK, UP CLOSE',
      'contact.html': 'START A CONVERSATION',
      'task-manager.html': 'PROJECT / TASK MANAGER',
      'banking-system.html': 'PROJECT / BANKING SYSTEM',
      'forecastml.html': 'PROJECT / FORECASTML',
      'agrochain.html': 'PROJECT / AGROCHAIN',
      'rakshak.html': 'PROJECT / RAKSHAK',
      'srms.html': 'PROJECT / STUDENT RECORDS'
    };
    $$('a[data-transition]').forEach(link => link.addEventListener('click', event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || target.pathname === location.pathname || target.hash) return;
      event.preventDefault();
      closeMenu();
      if (curtain) {
        const file = target.pathname.split('/').pop() || 'index.html';
        curtain.dataset.label = pageLabels[file] || link.textContent.trim().toUpperCase();
      }
      body.classList.remove('entering');
      body.classList.add('leaving');
      window.setTimeout(() => { location.href = target.href; }, 560);
    }));
    if (!root.classList.contains('intro-pending')) body.classList.add('entering');
    else body.classList.add('entering');
    window.setTimeout(() => body.classList.remove('entering'), 1050);
  }

  // Photo strip cycles quietly; pauses when the tab is hidden and respects reduced motion.
  const photos = $$('.hero-photo');
  const photoIndex = $('.hero-photo-index');
  if (photos.length > 1 && !reduceMotion) {
    let activePhoto = Math.max(0, photos.findIndex(photo => photo.classList.contains('is-active')));
    const rotatePhoto = () => {
      if (document.hidden) return;
      photos[activePhoto].classList.remove('is-active');
      activePhoto = (activePhoto + 1) % photos.length;
      photos[activePhoto].classList.add('is-active');
      if (photoIndex) photoIndex.innerHTML = `<b>${String(activePhoto + 1).padStart(2, '0')}</b> / ${String(photos.length).padStart(2, '0')}`;
    };
    window.setInterval(rotatePhoto, 4200);
  }

  // Create a silent live video stream from the local hero photograph. This
  // keeps the cinematic movement self-contained: no stock video request, no
  // network dependency, and a still image remains visible if captureStream
  // is unavailable or autoplay is blocked.
  const heroFilm = $('.hero-film');
  const heroPoster = $('.hero-photo.is-active');
  if (!reduceMotion && heroFilm && heroPoster && HTMLCanvasElement.prototype.captureStream) {
    const filmCanvas = document.createElement('canvas');
    filmCanvas.width = 960;
    filmCanvas.height = 540;
    const filmContext = filmCanvas.getContext('2d', { alpha: false });
    const filmImage = new Image();
    filmImage.decoding = 'async';
    filmImage.src = heroPoster.currentSrc || heroPoster.src;
    filmImage.addEventListener('load', () => {
      const startedAt = performance.now();
      const paintFilm = now => {
        if (!document.hidden && filmContext) {
          const phase = ((now - startedAt) % 12000) / 12000;
          const zoom = 1.025 + (1 - Math.cos(phase * Math.PI * 2)) * 0.016;
          const scale = Math.max(filmCanvas.width / filmImage.width, filmCanvas.height / filmImage.height) * zoom;
          const width = filmImage.width * scale;
          const height = filmImage.height * scale;
          filmContext.drawImage(filmImage, (filmCanvas.width - width) / 2, (filmCanvas.height - height) / 2, width, height);
        }
        window.requestAnimationFrame(paintFilm);
      };
      paintFilm(startedAt);
      heroFilm.srcObject = filmCanvas.captureStream(18);
      heroFilm.play().then(() => {
        heroFilm.dataset.streamReady = 'true';
        heroPoster.classList.add('film-poster');
      }).catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) heroFilm.pause();
        else heroFilm.play().catch(() => {});
      });
    }, { once: true });
  }

  // Accessible work index filtering and search.
  const filters = $$('.filter-btn');
  const cards = $$('.work-card[data-category]');
  const search = $('#work-search');
  const empty = $('.empty-results');
  let activeFilter = 'all';
  const applyFilter = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let count = 0;
    cards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      const searchable = (card.textContent + ' ' + (card.dataset.search || '')).toLowerCase();
      const show = (activeFilter === 'all' || categories.includes(activeFilter)) && (!query || searchable.includes(query));
      card.hidden = !show;
      if (show) count++;
    });
    if (empty) empty.classList.toggle('visible', count === 0);
    const countLabel = document.querySelector('[data-work-count]');
    if (countLabel) countLabel.textContent = `${count.toString().padStart(2, '0')} projects`;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    button.classList.add('filter-just-selected');
    window.setTimeout(() => button.classList.remove('filter-just-selected'), 360);
    applyFilter();
  }));
  if (search) search.addEventListener('input', applyFilter);

  // Small, restrained tilt on desktop; CSS provides the main hover/focus states.
  if (finePointer && !reduceMotion) {
    const heroFrame = $('.hero-image-shell');
    if (heroFrame) {
      heroFrame.addEventListener('pointermove', event => {
        const rect = heroFrame.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        heroFrame.style.setProperty('--hero-tilt-x', `${(x * 3.5).toFixed(2)}deg`);
        heroFrame.style.setProperty('--hero-tilt-y', `${(-y * 3.5).toFixed(2)}deg`);
      });
      heroFrame.addEventListener('pointerleave', () => {
        heroFrame.style.removeProperty('--hero-tilt-x');
        heroFrame.style.removeProperty('--hero-tilt-y');
      });
    }
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const isFeatured = card.classList.contains('featured-project');
        card.style.transform = `perspective(1250px) rotateX(${(-y * (isFeatured ? 1.1 : 1.5)).toFixed(2)}deg) rotateY(${(x * (isFeatured ? 1.35 : 1.8)).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
    // Quiet magnetic motion on the main calls to action.
    $$('.button-primary,.hero-scroll-link').forEach(link => {
      link.addEventListener('pointermove', event => {
        const rect = link.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) * 0.06;
        const dy = (event.clientY - rect.top - rect.height / 2) * 0.08;
        link.style.setProperty('--magnetic-x', `${dx.toFixed(1)}px`);
        link.style.setProperty('--magnetic-y', `${dy.toFixed(1)}px`);
        link.classList.add('is-magnetic');
      });
      link.addEventListener('pointerleave', () => link.classList.remove('is-magnetic'));
    });
  }

  // Submit directly from the browser to Web3Forms and report its response in place.
  const form = $('#contact-form');
  if (form) {
    const error = $('.form-error', form);
    const feedback = $('.form-feedback', form);
    const submitButton = $('button[type="submit"]', form);
    const accessKey = form.elements.namedItem('access_key');

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const topic = String(data.get('topic') || 'Portfolio enquiry').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (error) { error.textContent = 'Please enter your name, a valid email, and a short message.'; error.classList.add('visible'); }
        return;
      }
      if (error) error.classList.remove('visible');
      if (location.protocol === 'file:') {
        if (feedback) feedback.textContent = 'Open this page through a web server or hosted site to send the form.';
        return;
      }
      if (!accessKey || !accessKey.value || accessKey.value === 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY') {
        if (feedback) feedback.textContent = 'The form is not activated yet. Add the Web3Forms access key sent to 685sayan@gmail.com, or email me directly.';
        return;
      }

      data.set('subject', `[Portfolio] ${topic} — ${name}`);
      data.set('from_name', 'Sayan Paul Portfolio');
      if (feedback) feedback.textContent = 'Sending your message…';
      if (submitButton) { submitButton.disabled = true; submitButton.setAttribute('aria-busy', 'true'); }
      try {
        const response = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || result.body?.message || 'The form service could not accept this message.');
        form.reset();
        if (feedback) feedback.textContent = 'Message sent. Thank you — I’ll reply to your email.';
      } catch (sendError) {
        if (feedback) feedback.textContent = 'Could not send right now. Please retry or email 685sayan@gmail.com directly.';
      } finally {
        if (submitButton) { submitButton.disabled = false; submitButton.removeAttribute('aria-busy'); }
      }
    });
  }

  // Copy email and current year.
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const copy = $('[data-copy-email]');
  if (copy) {
    const label = $('.copy-label', copy);
    const initial = label?.textContent || 'Copy email';
    copy.addEventListener('click', async () => {
      const email = copy.dataset.copyEmail;
      if (!email) { if (label) label.textContent = 'Email address unavailable'; return; }
      try { await navigator.clipboard.writeText(email); if (label) label.textContent = 'Copied to clipboard'; }
      catch (_) { if (label) label.textContent = email; }
      window.setTimeout(() => { if (label) label.textContent = initial; }, 2100);
    });
  }
})();
