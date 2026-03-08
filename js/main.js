/* ============================================
   MAIN.JS — Page initialization & preserved logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Render shared components
    renderHeader();
    renderFooter();

    // Initialize shared functionality
    initMobileMenu();
    initSmoothScrolling();
    initPageLoadAnimation();
    initScrollReveals();
    init3DEffects();
    initScrollGradient();
    initMagneticButtons();
    initParallax();
    initCursorSpotlight();
    initPortfolioChatbot();

    // Page-specific initialization
    const page = window.location.pathname.split('/').pop() || 'index.html';

    if (page === 'index.html' || page === '') {
        initCounterAnimations();
    }

    if (page === 'work.html') {
        initSkillsNetwork();
        initPreviewPanel();
    }

    if (page === 'journey.html') {
        initTimelineReveal();
    }

    if (page === 'contact.html') {
        initContactForm();
    }
});

/* ============================================
   Counter Animations — preserved from original
   ============================================ */
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';

        const target = parseInt(counter.dataset.count, 10);
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(eased * target);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

/* ============================================
   Contact Form — preserved with Google Script endpoint
   ============================================ */
async function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Floating label animations
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        if (input && label) {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });

            // Handle pre-filled inputs
            if (input.value) {
                group.classList.add('focused');
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycby7PREbqMicB4ywuhMIZdJgEKtp6RoPJ738OOH_uGo-pMvxlqvQJDToYb2ru2HoQ1DPuA/exec', {
                method: 'POST',
                body: new FormData(form),
            });

            if (response.ok) {
                showToast("Message sent successfully! I'll get back to you soon.", 'success');
                form.reset();
                formGroups.forEach(group => group.classList.remove('focused'));
            } else {
                showToast('Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Could not send message. Please check your connection.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });
}

/* ============================================
   Toast Notification — preserved from original
   ============================================ */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast.show');
    if (existingToast) existingToast.classList.remove('show');

    // Create or reuse toast element
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon"><i class="fas fa-check-circle" aria-hidden="true"></i></div>
        <span class="toast-message"></span>
        <button class="toast-close" aria-label="Close notification"><i class="fas fa-times" aria-hidden="true"></i></button>
      </div>
    `;
        document.body.appendChild(toast);
    }

    // Update content
    const icon = toast.querySelector('.toast-icon i');
    const msg = toast.querySelector('.toast-message');

    toast.className = `toast ${type}`;
    if (icon) icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
    if (msg) msg.textContent = message;

    // Show
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-hide after 4 seconds
    const timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            clearTimeout(timer);
            toast.classList.remove('show');
        };
    }
}

/* ============================================
   Inject Project Thumbnails — Exp 04 Numbered Archival Projects
   Reads data-image attribute from each .project-row and appends
   a lazy-loaded <img class="project-row-thumb"> for the hover peek.
   ============================================ */
function injectProjectThumbnails() {
    document.querySelectorAll('.project-row[data-image]').forEach(row => {
        const src = row.dataset.image;
        if (!src || src === '') return;

        const img = document.createElement('img');
        img.className = 'project-row-thumb';
        img.src = src;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.loading = 'lazy';
        img.decoding = 'async';
        row.appendChild(img);
    });
}

/* ============================================
   Skills Network — SVG-based interactive skill graph.
   Builds the SVG, handles node click filtering,
   and syncs active-filter UI labels.
   ============================================ */
function initSkillsNetwork() {
    const svg = document.getElementById('skills-svg');
    if (!svg) return;

    const NS = 'http://www.w3.org/2000/svg';
    const cx = 150, cy = 150;

    const rings = { expert: 65, proficient: 108, learning: 138 };

    const skillData = [
        // Expert ring (r=65, 90° intervals starting at -90°)
        { label: 'Python',        filter: 'python',                          level: 'expert',    angle: -90  },
        { label: 'ML / AI',       filter: 'ai-ml,scikit-learn,machine',      level: 'expert',    angle: 0    },
        { label: 'Data Analysis', filter: 'pandas,numpy,data',               level: 'expert',    angle: 90   },
        { label: 'Generative AI', filter: 'ai,groq,ollama,deepseek,faiss',   level: 'expert',    angle: 180  },
        // Proficient ring (r=108, 7 nodes evenly: 360/7 ≈ 51.43°)
        { label: 'NumPy',         filter: 'numpy',                           level: 'proficient', angle: -90     },
        { label: 'Pandas',        filter: 'pandas',                          level: 'proficient', angle: -38.57  },
        { label: 'Flask',         filter: 'flask',                           level: 'proficient', angle: 12.86   },
        { label: 'JavaScript',    filter: 'javascript',                      level: 'proficient', angle: 64.29   },
        { label: 'HTML / CSS',    filter: 'html,css',                        level: 'proficient', angle: 115.71  },
        { label: 'SQL',           filter: 'sql,plpgsql',                     level: 'proficient', angle: 167.14  },
        { label: 'React',         filter: 'react,nextjs,typescript',         level: 'proficient', angle: 218.57  },
        // Learning ring (r=138, 3 nodes: 120° intervals)
        { label: 'Node.js',       filter: 'nodejs,node.js,next',             level: 'learning',  angle: -90  },
        { label: 'System Design', filter: 'system',                          level: 'learning',  angle: 30   },
        { label: 'DevOps',        filter: 'vercel,docker,devops',            level: 'learning',  angle: 150  },
    ];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Draw orbital rings
    ['expert', 'proficient', 'learning'].forEach(level => {
        const r = rings[level];
        const circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('class', 'skill-ring');
        svg.appendChild(circle);
    });

    // Draw SP center
    const spGroup = document.createElementNS(NS, 'g');
    spGroup.setAttribute('class', 'sp-center');

    const spCircle = document.createElementNS(NS, 'circle');
    spCircle.setAttribute('cx', cx);
    spCircle.setAttribute('cy', cy);
    spCircle.setAttribute('r', '22');
    spCircle.setAttribute('fill', 'rgba(255,255,255,0.05)');
    spCircle.setAttribute('stroke', 'rgba(255,255,255,0.3)');
    spCircle.setAttribute('stroke-width', '1');
    spGroup.appendChild(spCircle);

    const spText = document.createElementNS(NS, 'text');
    spText.setAttribute('x', cx);
    spText.setAttribute('y', cy);
    spText.setAttribute('text-anchor', 'middle');
    spText.setAttribute('dominant-baseline', 'central');
    spText.setAttribute('class', 'sp-label');
    spText.textContent = 'SP';
    spGroup.appendChild(spText);
    svg.appendChild(spGroup);

    // SP pulse via anime.js
    if (!prefersReduced && typeof anime !== 'undefined') {
        anime.animate(spCircle, {
            opacity: [1, 0.4, 1],
            duration: 3200,
            easing: 'easeInOutSine',
            loop: Infinity,
        });
    }

    // Draw skill nodes
    let activeFilter = null;

    skillData.forEach(skill => {
        const rad = (skill.angle * Math.PI) / 180;
        const r = rings[skill.level];
        const nx = cx + Math.cos(rad) * r;
        const ny = cy + Math.sin(rad) * r;

        const g = document.createElementNS(NS, 'g');
        g.setAttribute('class', `skill-node skill-node--${skill.level}`);
        g.setAttribute('data-filter', skill.filter);
        g.setAttribute('data-label', skill.label);
        g.setAttribute('tabindex', '0');
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `Filter projects by ${skill.label}`);
        g.setAttribute('aria-pressed', 'false');

        // Connector line
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', cx);
        line.setAttribute('y1', cy);
        line.setAttribute('x2', nx);
        line.setAttribute('y2', ny);
        line.setAttribute('class', 'skill-connector');
        g.appendChild(line);

        // Node dot
        const dot = document.createElementNS(NS, 'circle');
        const dotR = skill.level === 'expert' ? 4 : skill.level === 'proficient' ? 3 : 2.5;
        dot.setAttribute('cx', nx);
        dot.setAttribute('cy', ny);
        dot.setAttribute('r', dotR);
        dot.setAttribute('class', 'skill-dot');
        g.appendChild(dot);

        // Text label — anchor and offset based on position
        const isLeft = nx < cx - 8;
        const isRight = nx > cx + 8;
        const isTop = ny < cy - 8;
        const textAnchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
        const labelOffsetX = isLeft ? -8 : isRight ? 8 : 0;
        const labelOffsetY = !isLeft && !isRight ? (isTop ? -12 : 12) : 1;

        const label = document.createElementNS(NS, 'text');
        label.setAttribute('x', nx + labelOffsetX);
        label.setAttribute('y', ny + labelOffsetY);
        label.setAttribute('text-anchor', textAnchor);
        label.setAttribute('dominant-baseline', 'central');
        label.setAttribute('class', 'skill-label');
        label.textContent = skill.label;
        g.appendChild(label);

        svg.appendChild(g);

        function activate() {
            if (activeFilter === skill.filter) {
                clearFilter();
                return;
            }
            activeFilter = skill.filter;

            document.querySelectorAll('.skill-node').forEach(n => {
                n.classList.remove('skill-node--active');
                n.setAttribute('aria-pressed', 'false');
            });
            g.classList.add('skill-node--active');
            g.setAttribute('aria-pressed', 'true');

            applyFilter(skill.filter, skill.label);
        }

        g.addEventListener('click', (e) => {
            e.stopPropagation();
            activate();
        });

        g.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });

    // Click empty SVG area to clear
    svg.addEventListener('click', () => {
        if (activeFilter !== null) clearFilter();
    });

    function applyFilter(filterStr, label) {
        const keywords = filterStr.split(',').map(k => k.trim().toLowerCase());
        let matchCount = 0;

        document.querySelectorAll('.project-card').forEach(card => {
            const tech = (card.dataset.tech || '').toLowerCase();
            const matches = keywords.some(kw => tech.includes(kw));
            card.classList.toggle('card-filtered-out', !matches);
            card.setAttribute('aria-hidden', String(!matches));
            if (matches) matchCount++;
        });

        const display = document.getElementById('active-filter-display');
        const text = document.getElementById('active-filter-text');
        const count = document.getElementById('projects-count');

        if (display) display.removeAttribute('hidden');
        if (text) text.textContent = label;
        if (count) count.textContent = `${matchCount} match${matchCount !== 1 ? 'es' : ''}`;
    }

    function clearFilter() {
        activeFilter = null;

        document.querySelectorAll('.skill-node').forEach(n => {
            n.classList.remove('skill-node--active');
            n.setAttribute('aria-pressed', 'false');
        });
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('card-filtered-out');
            card.removeAttribute('aria-hidden');
        });

        const display = document.getElementById('active-filter-display');
        const count = document.getElementById('projects-count');
        if (display) display.setAttribute('hidden', '');
        if (count) count.textContent = '06 cases';
    }

    // Wire clear button
    const clearBtn = document.getElementById('filter-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearFilter();
    });
}

/* ============================================
   Preview Panel — Updates right panel when a
   project card is clicked. Handles open/close,
   keyboard navigation, and Escape to dismiss.
   ============================================ */
function initPreviewPanel() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    const panel   = document.getElementById('preview-panel');
    const img     = document.getElementById('preview-img');
    const badge   = document.getElementById('preview-badge');
    const title   = document.getElementById('preview-title');
    const desc    = document.getElementById('preview-desc');
    const tech    = document.getElementById('preview-tech');
    const github  = document.getElementById('preview-github');
    const demo    = document.getElementById('preview-demo');
    const closeBtn = document.getElementById('preview-close');

    let activeCard = null;

    function openPreview(card) {
        if (activeCard) activeCard.classList.remove('project-card--active');
        activeCard = card;
        card.classList.add('project-card--active');
        card.setAttribute('aria-selected', 'true');

        const d = card.dataset;

        if (img) {
            const hasSrc = d.image && d.image !== '#' && d.image !== '';
            img.src = hasSrc ? d.image : '';
            img.alt = d.title || '';
            img.parentElement.style.display = hasSrc ? 'block' : 'none';
        }

        if (badge) badge.textContent = d.category || '';
        if (title) title.textContent = d.title || '';
        if (desc)  desc.textContent  = d.description || '';

        if (tech) {
            tech.innerHTML = '';
            (d.tech || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
                const span = document.createElement('span');
                span.className = 'preview-tech-tag';
                span.textContent = t.charAt(0).toUpperCase() + t.slice(1);
                tech.appendChild(span);
            });
        }

        if (github) {
            const hasGH = d.github && d.github !== '#' && d.github !== '';
            github.href = d.github || '#';
            github.style.display = hasGH ? 'inline-flex' : 'none';
        }

        if (demo) {
            const hasDemo = d.demo && d.demo !== '#' && d.demo !== '';
            demo.href = d.demo || '#';
            demo.style.display = hasDemo ? 'inline-flex' : 'none';
        }

        // Activate panel — CSS handles placeholder/content swap
        if (panel) panel.classList.add('preview-active');

        // Scroll into view on mobile
        if (window.innerWidth <= 768 && panel) {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function closePreview() {
        if (activeCard) {
            activeCard.classList.remove('project-card--active');
            activeCard.setAttribute('aria-selected', 'false');
            activeCard = null;
        }
        if (panel) panel.classList.remove('preview-active');
    }

    cards.forEach(card => {
        card.addEventListener('click', () => openPreview(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPreview(card);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePreview);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeCard) closePreview();
    });
}


/* ============================================
   AI CHAT WIDGET — initPortfolioChatbot()
   Injects the floating assistant widget into every page.
   Structured for future API connection at POST /api/chat
   ============================================ */
function initPortfolioChatbot() {
    // Build widget HTML
    const widget = document.createElement('div');
    widget.className = 'chatbot-wrapper';
    widget.innerHTML = `
        <div class="chatbot-panel" id="chatbot-panel" role="dialog" aria-modal="true" aria-label="NOVA Portfolio Assistant" aria-hidden="true">
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <span class="chatbot-header-dot" aria-hidden="true"></span>
                    <span class="chatbot-header-title">NOVA — Portfolio Assistant</span>
                </div>
                <button class="chatbot-close" id="chatbot-close" aria-label="Close chat assistant">✕</button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>
            <div class="chatbot-input-area">
                <input
                    class="chatbot-input"
                    id="chatbot-input"
                    type="text"
                    placeholder="Ask about projects, skills..."
                    aria-label="Type your message"
                    autocomplete="off"
                    maxlength="300"
                />
                <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open AI chat assistant" aria-expanded="false" aria-controls="chatbot-panel">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M11 2C6.03 2 2 5.69 2 10.25c0 2.47 1.18 4.69 3.05 6.24L4 19l3.42-1.11C8.4 18.28 9.67 18.5 11 18.5c4.97 0 9-3.69 9-8.25S15.97 2 11 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="7.5" cy="10.25" r="1" fill="currentColor"/>
                <circle cx="11" cy="10.25" r="1" fill="currentColor"/>
                <circle cx="14.5" cy="10.25" r="1" fill="currentColor"/>
            </svg>
        </button>
    `;
    document.body.appendChild(widget);

    // Elements
    const panel = document.getElementById('chatbot-panel');
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const messages = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    let isOpen = false;
    let welcomeShown = false;

    function scrollToBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function appendMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `chatbot-msg chatbot-msg--${type}`;
        msg.textContent = text;
        messages.appendChild(msg);
        scrollToBottom();
        return msg;
    }

    function typeMessage(text, element, speed = 12) {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            scrollToBottom();
            if (i >= text.length) clearInterval(interval);
        }, speed);
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chatbot-typing';
        typing.id = 'chatbot-typing';
        typing.setAttribute('aria-label', 'Assistant is typing');
        typing.innerHTML = `
            <span class="chatbot-typing-dot" aria-hidden="true"></span>
            <span class="chatbot-typing-dot" aria-hidden="true"></span>
            <span class="chatbot-typing-dot" aria-hidden="true"></span>
        `;
        messages.appendChild(typing);
        scrollToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById('chatbot-typing');
        if (typing) typing.remove();
    }

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Enforce client-side length cap (backend enforces 500 too)
        if (text.length > 500) {
            appendMessage('Message is too long. Please keep it under 500 characters.', 'ai');
            return;
        }

        input.value = '';
        sendBtn.disabled = true;
        input.disabled = true;
        appendMessage(text, 'user');
        showTyping();

        fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((d) => { throw new Error(d.error || 'Server error'); });
                }
                return res.json();
            })
            .then((data) => {
                removeTyping();
                const reply = data.reply || "Sorry, I didn't get a response. Please try again.";
                const msg = document.createElement('div');
                msg.className = 'chatbot-msg chatbot-msg--ai';
                messages.appendChild(msg);
                scrollToBottom();
                typeMessage(reply, msg);
            })
            .catch((err) => {
                removeTyping();
                const msg = err.message && err.message.length < 120
                    ? err.message
                    : "I'm having trouble connecting right now. Please try again in a moment.";
                appendMessage(msg, 'ai');
            })
            .finally(() => {
                sendBtn.disabled = false;
                input.disabled = false;
                input.focus();
            });
    }

    function openPanel() {
        isOpen = true;
        panel.classList.add('chatbot-panel--open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('chatbot-toggle--active');

        // Show welcome message on first open
        if (!welcomeShown) {
            welcomeShown = true;
            setTimeout(() => {
                appendMessage("Hi! I'm NOVA, Sayan's portfolio assistant. Ask me about his projects, skills, or experience.", 'ai');
            }, 300);
        }

        // Focus input after panel animates in
        setTimeout(() => input.focus(), 250);
    }

    function closePanel() {
        isOpen = false;
        panel.classList.remove('chatbot-panel--open');
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('chatbot-toggle--active');
        toggle.focus();
    }

    // Event listeners
    toggle.addEventListener('click', () => {
        if (isOpen) closePanel();
        else openPanel();
    });

    closeBtn.addEventListener('click', closePanel);

    sendBtn.addEventListener('click', sendMessage);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closePanel();
    });
}
