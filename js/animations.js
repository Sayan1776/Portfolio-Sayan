/* ============================================
   ANIMATIONS.JS — anime.js v4 powered animations
   ============================================ */

/**
 * Page load animation: fade body in, then stagger hero title words.
 * Uses anime.js v4 API: anime.animate(targets, params)
 */
function initPageLoadAnimation() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fade body in (body starts at opacity:0 from inline <style> in <head>)
    if (!prefersReduced && typeof anime !== 'undefined') {
        anime.animate(document.body, {
            opacity: 1,
            duration: 400,
            easing: 'easeOutQuad'
        });
    } else {
        document.body.style.opacity = '1';
    }

    // Stagger hero title words
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !prefersReduced && typeof anime !== 'undefined') {
        const text = heroTitle.innerHTML;
        // Wrap each word in a span, preserving HTML tags like <span>
        const words = [];
        let buffer = '';
        let inTag = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '<') { inTag = true; buffer += char; continue; }
            if (char === '>') { inTag = false; buffer += char; continue; }
            if (inTag) { buffer += char; continue; }
            if (char === ' ') {
                if (buffer.trim()) words.push(buffer);
                words.push(' ');
                buffer = '';
            } else {
                buffer += char;
            }
        }
        if (buffer.trim()) words.push(buffer);

        heroTitle.innerHTML = words.map(w => {
            if (w === ' ') return ' ';
            return `<span class="word">${w}</span>`;
        }).join('');

        const wordElements = heroTitle.querySelectorAll('.word');
        anime.animate(wordElements, {
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(120, { startdelay: 400 }),
            easing: 'easeOutCubic'
        });
    }
}

/**
 * Scroll reveals using IntersectionObserver + anime.js v4.
 */
function initScrollReveals() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                if (prefersReduced || typeof anime === 'undefined') {
                    el.classList.add('visible');
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                } else {
                    // Determine stagger index
                    const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal') || c.classList.contains('fade-in-up')) : [];
                    const index = siblings.indexOf(el);
                    const delay = index > 0 ? index * 80 : 0;

                    anime.animate(el, {
                        opacity: [0, 1],
                        translateY: [40, 0],
                        duration: 700,
                        delay: delay,
                        easing: 'easeOutCubic',
                        complete: function () {
                            el.classList.add('visible');
                        }
                    });
                }

                // Trigger counter animations when hero-stats is visible
                if (el.classList.contains('hero-stats') || el.closest('.hero-stats')) {
                    animateCounters();
                }

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .fade-in-up').forEach(el => observer.observe(el));
}

/**
 * Project modal — opens from bottom with easeOutExpo.
 * Uses anime.js v4 API.
 */
function initProjectModal() {
    const overlay = document.querySelector('.project-modal-overlay');
    if (!overlay) return;

    const modal = overlay.querySelector('.project-modal');
    const closeBtn = overlay.querySelector('.modal-close');
    const projectRows = document.querySelectorAll('.project-row');

    projectRows.forEach(row => {
        row.addEventListener('click', () => {
            const title = row.dataset.title || '';
            const category = row.dataset.category || '';
            const description = row.dataset.description || '';
            const tech = row.dataset.tech || '';
            const image = row.dataset.image || '';
            const github = row.dataset.github || '';
            const demo = row.dataset.demo || '';

            // Fill modal
            const modalTitle = overlay.querySelector('.modal-title');
            const modalBadge = overlay.querySelector('.modal-badge');
            const modalDesc = overlay.querySelector('.modal-description');
            const modalTech = overlay.querySelector('.modal-tech');
            const modalImg = overlay.querySelector('.modal-image img');
            const modalLinks = overlay.querySelector('.modal-links');

            if (modalTitle) modalTitle.textContent = title;
            if (modalBadge) modalBadge.textContent = category;
            if (modalDesc) modalDesc.textContent = description;

            if (modalImg) {
                if (image) {
                    modalImg.src = image;
                    modalImg.alt = title;
                    modalImg.parentElement.style.display = 'block';
                } else {
                    modalImg.parentElement.style.display = 'none';
                }
            }

            if (modalTech) {
                const tags = tech.split(',').filter(t => t.trim());
                modalTech.innerHTML = tags.map(t => `<span class="tech-tag">${t.trim()}</span>`).join('');
            }

            if (modalLinks) {
                let linksHTML = '';
                if (github) linksHTML += `<a href="${github}" target="_blank" rel="noopener noreferrer" class="modal-link"><i class="fab fa-github" aria-hidden="true"></i> Source Code</a>`;
                if (demo && demo !== '#') linksHTML += `<a href="${demo}" target="_blank" rel="noopener noreferrer" class="modal-link"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Live Demo</a>`;
                modalLinks.innerHTML = linksHTML;
            }

            // Open modal
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            if (typeof anime !== 'undefined') {
                anime.animate(modal, {
                    translateY: ['100%', '0%'],
                    duration: 600,
                    easing: 'easeOutExpo'
                });
            }
        });
    });

    // Close modal
    function closeModal() {
        if (typeof anime !== 'undefined') {
            anime.animate(modal, {
                translateY: ['0%', '100%'],
                duration: 400,
                easing: 'easeInQuad',
                complete: function () {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        } else {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * 3D Mouse tracking on cards and hero image — preserved from original.
 */
function init3DEffects() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverNone = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || hoverNone) return;

    function applyTilt(target, maxTiltDeg, scaleValue) {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const xRatio = ((e.clientX - rect.left) / rect.width) - 0.5;
            const yRatio = ((e.clientY - rect.top) / rect.height) - 0.5;

            // Clamp tilt to a fixed max so cards feel stable and controllable.
            const rotateX = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, yRatio * maxTiltDeg * 2));
            const rotateY = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, -xRatio * maxTiltDeg * 2));

            target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleValue})`;
        });

        target.addEventListener('mouseleave', () => {
            target.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    // Keep existing hover depth on work/index cards.
    const standardCards = document.querySelectorAll('.service-card, .skill-category');
    standardCards.forEach(card => applyTilt(card, 8, 1.01));

    // Journey cards: subtle depth only, smooth return.
    const subtleCards = document.querySelectorAll('.cert-row, .education-card');
    subtleCards.forEach(card => {
        card.style.transition = 'background var(--transition-fast), transform 0.4s ease-out';
        applyTilt(card, 5, 1.005);
    });

    // Hero image
    const heroImage = document.querySelector('.image-container');
    if (heroImage) {
        applyTilt(heroImage, 5, 1.03);
    }
}

/**
 * Skills Orbital System — HTML5 Canvas solar-system visualization.
 * "SP" center with pulsing opacity, three orbital rings, skill text nodes
 * orbiting continuously. Hover stops node, draws line to center, dims others.
 */
function initOrbitalSkills() {
    const container = document.getElementById('orbital-container');
    const canvas = document.getElementById('orbital-canvas');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Skill data grouped by level ---
    const skills = {
        expert: ['Python', 'Machine Learning', 'Data Analysis', 'Generative AI'],
        proficient: ['NumPy', 'Pandas', 'Flask', 'JavaScript', 'HTML/CSS', 'Matplotlib', 'SQL'],
        learning: ['Node.js', 'System Design', 'DevOps'],
    };

    // Ring config: radiusFraction = fraction of min(cw,ch)/2
    const ringConfig = {
        expert: { radiusFraction: 0.22, speed: 0.0004, color: 'rgba(255,255,255,0.25)' },
        proficient: { radiusFraction: 0.44, speed: 0.00025, color: 'rgba(255,255,255,0.18)' },
        learning: { radiusFraction: 0.65, speed: 0.00012, color: 'rgba(255,255,255,0.12)' },
    };

    let dpr = window.devicePixelRatio || 1;
    let cw, ch, cx, cy;
    let nodes = [];
    let hoveredIndex = -1;
    let mouseX = null, mouseY = null;
    let spCenterOpacity = 1;
    let animFrameId = null;
    let lastTime = 0;

    // Build node array
    function buildNodes() {
        nodes = [];
        for (const [level, labels] of Object.entries(skills)) {
            const cfg = ringConfig[level];
            const count = labels.length;
            labels.forEach((label, i) => {
                const angleOffset = (Math.PI * 2 / count) * i;
                nodes.push({
                    label,
                    level,
                    angle: angleOffset,
                    baseSpeed: cfg.speed,
                    speed: cfg.speed,
                    radiusFraction: cfg.radiusFraction,
                    opacity: 0.85,
                    scale: 1,
                    // computed per frame
                    x: 0, y: 0,
                });
            });
        }
    }

    function resizeCanvas() {
        dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        cw = rect.width;
        ch = rect.height;
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width = cw + 'px';
        canvas.style.height = ch + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = cw / 2;
        cy = ch / 2;
    }

    // --- "SP" center pulsing with anime.js ---
    const spPulseTarget = { opacity: 1 };
    function startSPPulse() {
        if (typeof anime !== 'undefined') {
            anime.animate(spPulseTarget, {
                opacity: [1, 0.6, 1],
                duration: 3000,
                easing: 'easeInOutSine',
                loop: Infinity,
            });
        }
    }

    // --- Drawing ---
    function draw(deltaTime) {
        ctx.clearRect(0, 0, cw, ch);

        const minDim = Math.min(cw, ch);

        // Draw "ORBITAL · SKILLS · MAP" label
        ctx.font = '11px "IBM Plex Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.letterSpacing = '0.15em';
        ctx.fillText('ORBITAL · SKILLS · MAP', 16, 16);

        // Draw orbital rings
        for (const [level, cfg] of Object.entries(ringConfig)) {
            const radius = (minDim / 2) * cfg.radiusFraction;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw "SP" center — with glow that pulses with opacity
        spCenterOpacity = spPulseTarget.opacity;
        ctx.save();
        ctx.shadowBlur = 20 * spCenterOpacity;
        ctx.shadowColor = `rgba(255,255,255,${0.35 * spCenterOpacity})`;
        ctx.font = '700 42px "Playfair Display", serif';
        ctx.fillStyle = `rgba(255,255,255,${spCenterOpacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SP', cx, cy);
        ctx.restore();

        // Update and draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const cfg = ringConfig[node.level];
            const radius = (minDim / 2) * cfg.radiusFraction;

            // Update angle (skip if hovered and stopped)
            if (i !== hoveredIndex && !prefersReduced) {
                node.angle += node.speed * deltaTime;
            }

            // Compute position
            node.x = cx + Math.cos(node.angle) * radius;
            node.y = cy + Math.sin(node.angle) * radius;

            // Determine render state
            let alpha = node.opacity;
            let scale = node.scale;
            if (hoveredIndex >= 0) {
                if (i === hoveredIndex) {
                    alpha = 1;
                    scale = 1.3;
                } else {
                    alpha = 0.3;
                    scale = 1;
                }
            }

            // Draw connector line to center if hovered
            if (i === hoveredIndex) {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(node.x, node.y);
                ctx.strokeStyle = 'rgba(255,255,255,0.5)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw dot at node position
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fill();
            }

            // Draw label text
            const fontSize = 11 * scale;
            ctx.font = `${scale > 1 ? '600' : '400'} ${fontSize}px "IBM Plex Mono", monospace`;
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);

            // Draw level indicator on hover
            if (i === hoveredIndex) {
                const levelLabel = '· ' + node.level.toUpperCase();
                ctx.font = '400 9px "IBM Plex Mono", monospace';
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fillText(levelLabel, node.x, node.y + fontSize + 4);
            }
        }
    }

    // --- Hit Detection ---
    function getNodeAt(mx, my) {
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            // Measure text width for hit area
            ctx.font = '400 11px "IBM Plex Mono", monospace';
            const tw = ctx.measureText(node.label).width;
            const hitW = tw / 2 + 12;
            const hitH = 14;
            if (Math.abs(mx - node.x) < hitW && Math.abs(my - node.y) < hitH) {
                return i;
            }
        }
        return -1;
    }

    // --- Mouse Events ---
    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        const idx = getNodeAt(mouseX, mouseY);
        if (idx !== hoveredIndex) {
            hoveredIndex = idx;
            canvas.style.cursor = idx >= 0 ? 'pointer' : 'default';
        }
    });

    canvas.addEventListener('mouseleave', function () {
        mouseX = null;
        mouseY = null;
        hoveredIndex = -1;
        canvas.style.cursor = 'default';
    });

    // --- Animation Loop ---
    function frame(now) {
        if (!lastTime) lastTime = now;
        const dt = Math.min(now - lastTime, 50); // cap at 50ms
        lastTime = now;
        draw(dt);
        animFrameId = requestAnimationFrame(frame);
    }

    // --- Init ---
    buildNodes();
    resizeCanvas();
    startSPPulse();

    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animFrameId) {
                    lastTime = 0;
                    animFrameId = requestAnimationFrame(frame);
                }
            } else {
                if (animFrameId) {
                    cancelAnimationFrame(animFrameId);
                    animFrameId = null;
                }
            }
        });
    }, { threshold: 0.1 });
    observer.observe(container);

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        if (observer) observer.disconnect();
    });
}

/**
 * Ambient Ink Bleed — Scroll-driven radial gradient spotlight.
 * Updates --scroll-offset and --spotlight-x CSS custom properties.
 * body::before in base.css reads these to position a dual-gradient spotlight.
 * --spotlight-x follows mouse position lazily at 0.1x rate for cinematic depth.
 */
function initScrollGradient() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    let targetSpotlightX = 50; // target in %
    let currentSpotlightX = 50;

    // Scroll: update vertical offset
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
                document.documentElement.style.setProperty(
                    '--scroll-offset', `${20 + pct * 0.6}%`
                );
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mouse: lazily track horizontal cursor position for spotlight-x
    // Only on pointer devices; skip on touch
    if (!window.matchMedia('(hover: hover)').matches) return;

    window.addEventListener('mousemove', (e) => {
        targetSpotlightX = (e.clientX / window.innerWidth) * 100;
    }, { passive: true });

    // Smooth lerp loop for spotlight-x
    function lerpSpotlight() {
        currentSpotlightX += (targetSpotlightX - currentSpotlightX) * 0.06;
        // Only update when meaningfully different
        if (Math.abs(targetSpotlightX - currentSpotlightX) > 0.05) {
            document.documentElement.style.setProperty(
                '--spotlight-x', `${currentSpotlightX.toFixed(2)}%`
            );
        }
        requestAnimationFrame(lerpSpotlight);
    }
    lerpSpotlight();
}

/**
 * Timeline Reveal — lights up timeline dots and grows the vertical line
 * as education timeline items scroll into view.
 * Only runs on journey.html (checks for .education-timeline).
 */
function initTimelineReveal() {
    const timelines = document.querySelectorAll('.journey-timeline');
    if (!timelines.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Grow each spine when its container enters viewport
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-active');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    timelines.forEach(t => timelineObserver.observe(t));

    if (prefersReduced) {
        timelines.forEach(t => t.classList.add('timeline-active'));
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.add('timeline-lit');
        });
        return;
    }

    // Light up marker diamonds when items scroll into view
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('timeline-lit');
                itemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        itemObserver.observe(item);
    });
}

/**
 * Cinematic Parallax — subtle translateY drift on section headings (0.05x rate).
 * Computed per element relative to viewport center, so each heading drifts
 * independently as it enters and exits the viewport.
 * Only applies to headings that are already visible (have .visible class)
 * to avoid conflicting with the scroll-reveal animation.
 * Skipped on touch devices and reduced-motion.
 */
function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const HEADING_RATE = 0.05;
    const headings = document.querySelectorAll('.section-title');
    if (headings.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const vc = window.innerHeight / 2;
        headings.forEach(el => {
            // Only shift headings that have been revealed — avoid transform conflicts
            if (!el.classList.contains('visible')) return;
            const rect = el.getBoundingClientRect();
            const ec = rect.top + rect.height / 2;
            const offset = (ec - vc) * HEADING_RATE;
            el.style.transform = `translateY(${offset.toFixed(2)}px)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Magnetic CTA Buttons — proximity-based cursor attraction.
 * Only activates on pointer/hover devices and when motion is allowed.
 * Buttons translate toward the cursor when within MAGNETIC_RANGE px;
 * the inner <span> moves at 50% rate for a parallax feel.
 * Spring easing on .btn-primary (via CSS) handles the snap-back.
 */
function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const MAGNETIC_RANGE = 80;
    const MAX_SHIFT = 10;
    const buttons = document.querySelectorAll('.btn-primary');
    if (buttons.length === 0) return;

    document.addEventListener('mousemove', (e) => {
        buttons.forEach(btn => {
            const inner = btn.querySelector('span');
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAGNETIC_RANGE) {
                const strength = 1 - dist / MAGNETIC_RANGE;
                const tx = dx * strength * (MAX_SHIFT / MAGNETIC_RANGE);
                const ty = dy * strength * (MAX_SHIFT / MAGNETIC_RANGE);
                btn.style.transform = `translate(${tx}px, ${ty}px)`;
                if (inner) inner.style.transform = `translate(${tx * 0.5}px, ${ty * 0.5}px)`;
            } else {
                btn.style.transform = '';
                if (inner) inner.style.transform = '';
            }
        });
    }, { passive: true });
}

/**
 * Cursor Spotlight — Updates --mouse-x / --mouse-y CSS vars inside .glass-card
 * elements to create a radial glow that follows the cursor.
 * Only runs on hover-capable devices; disabled for prefers-reduced-motion.
 */
function initCursorSpotlight() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll('.glass-card');
    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        }, { passive: true });
    });
}

