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

    // Page-specific initialization
    const page = window.location.pathname.split('/').pop() || 'index.html';

    if (page === 'index.html' || page === '') {
        initCounterAnimations();
    }

    if (page === 'work.html') {
        initProjectModal();
        initOrbitalSkills();
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
