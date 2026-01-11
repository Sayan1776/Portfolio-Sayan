// Modern Portfolio JavaScript with Smooth Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  createFloatingElements()
})

function initializeApp() {
  initNavigation()
  initScrollAnimations()
  initMobileMenu()
  initSmoothScrolling()
  initCounterAnimations()
  initSkillBars()
  initContactForm() // We will be updating this function
  initResumeDownload()
  initParallaxEffects()
  initAdvancedAnimations()
  init3DEffects()
}

// Create floating geometric elements
function createFloatingElements() {
  const floatingContainer = document.createElement("div")
  floatingContainer.className = "floating-elements"

  for (let i = 0; i < 3; i++) {
    const element = document.createElement("div")
    element.className = "floating-element"
    floatingContainer.appendChild(element)
  }

  document.body.appendChild(floatingContainer)
}

// Navigation - Simplified and more stable
function initNavigation() {
  const navbar = document.querySelector(".navbar")
  const navLinks = document.querySelectorAll(".nav-link")

  // Simple navbar scroll effect without parallax
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Active link highlighting
  const sections = document.querySelectorAll("section[id]")

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  })
}

// Smooth Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add stagger effect for multiple elements
        if (entry.target.parentElement && entry.target.parentElement.children.length > 1) {
          const siblings = Array.from(entry.target.parentElement.children)
          const index = siblings.indexOf(entry.target)

          setTimeout(() => {
            entry.target.classList.add("visible")
          }, index * 100)
        } else {
          entry.target.classList.add("visible")
        }

        // Trigger skill bar animations
        if (entry.target.classList.contains("skill-category")) {
          animateSkillBars(entry.target)
        }

        // Trigger counter animations
        if (entry.target.classList.contains("hero-stats")) {
          animateCounters()
        }
      }
    })
  }, observerOptions)

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right, .scale-in")
  animatedElements.forEach((element) => observer.observe(element))

  // Observe skill categories for progress bar animations
  const skillCategories = document.querySelectorAll(".skill-category")
  skillCategories.forEach((category) => observer.observe(category))

  // Observe hero stats for counter animation
  const heroStats = document.querySelector(".hero-stats")
  if (heroStats) observer.observe(heroStats)
}

// Mobile Menu
function initMobileMenu() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  if (!navToggle || !navMenu) return

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Add body scroll lock when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  })

  // Close menu when clicking on links
  navLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        navToggle.classList.remove("active")
        navMenu.classList.remove("active")
        document.body.style.overflow = ""
      }, index * 50)
    })
  })
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80

        // Enhanced smooth scroll with custom easing
        smoothScrollTo(offsetTop, 200)
      }
    })
  })
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime = null

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration)
    window.scrollTo(0, run)
    if (timeElapsed < duration) requestAnimationFrame(animation)
  }

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t * t + b
    t -= 2
    return (c / 2) * (t * t * t + 2) + b
  }

  requestAnimationFrame(animation)
}

// Counter Animations
function initCounterAnimations() {
  // This will be triggered by the scroll observer
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")

  counters.forEach((counter, index) => {
    const target = Number.parseInt(counter.getAttribute("data-count"))
    let current = 0
    const increment = target / 60 // 60 frames for smooth animation

    setTimeout(() => {
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        counter.textContent = Math.floor(current) + (target > 10 ? "+" : "")
      }, 16) // ~60fps
    }, index * 200)
  })
}

// Skill Bars Animation
function initSkillBars() {
  // This will be triggered by the scroll observer
}

function animateSkillBars(skillCategory) {
  const progressBars = skillCategory.querySelectorAll(".progress-fill")

  progressBars.forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.getAttribute("data-width")
      bar.style.width = width + "%"

      // Add single shimmer effect
      setTimeout(() => {
        bar.classList.add("animate-once")
      }, 500)
    }, index * 300)
  })
}

// Contact Form - UPDATED
async function initContactForm() {
  const form = document.getElementById("contact-form")
  if (!form) return

  // Add floating label animations
  const formGroups = form.querySelectorAll(".form-group")
  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea")
    const label = group.querySelector("label")

    if (input && label) {
      input.addEventListener("focus", () => {
        group.classList.add("focused")
      })

      input.addEventListener("blur", () => {
        if (!input.value) {
          group.classList.remove("focused")
        }
      })
    }
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Enhanced form validation
    const formData = new FormData(form)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!name || !email || !subject || !message) {
      showToast("Please fill in all fields", "error")
      return
    }

    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error")
      return
    }

    // Prepare UI for submission
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>'
    submitBtn.disabled = true
    submitBtn.style.transform = "scale(0.95)"

    // *** START: SEND DATA TO BACKEND ***
    try {
      // Use FormData to send the data, which avoids a CORS preflight request.
      const response = await fetch('https://script.google.com/macros/s/AKfycby7PREbqMicB4ywuhMIZdJgEKtp6RoPJ738OOH_uGo-pMvxlqvQJDToYb2ru2HoQ1DPuA/exec', {
        method: 'POST',
        body: new FormData(form),
      });

      // Check if the request was successful
      if (response.ok) {
        showToast("Message sent successfully! I'll get back to you soon.", "success")
        form.reset()
        // Reset form group states
        formGroups.forEach((group) => {
          group.classList.remove("focused")
        })
      } else {
        // Handle server errors (e.g., response.status is 400 or 500)
        showToast("Something went wrong. Please try again.", "error")
      }
    } catch (error) {
      // Handle network errors (e.g., server is down)
      console.error("Form submission error:", error)
      showToast("Could not send message. Please check your connection.", "error")
    } finally {
      // Restore the button regardless of outcome
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
      submitBtn.style.transform = "scale(1)"
    }
    // *** END: SEND DATA TO BACKEND ***
  })
}


// Resume Download
function initResumeDownload() {
  const resumeBtn = document.querySelector("a[download]")
  if (!resumeBtn) return

  resumeBtn.addEventListener("click", (e) => {
    // Add download animation
    resumeBtn.style.transform = "scale(0.95)"
    setTimeout(() => {
      resumeBtn.style.transform = "scale(1)"
    }, 150)

    showToast("Resume download started!", "success")
  })
}

// Simplified Parallax Effects
function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".floating-card")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.2 // Reduced rate for subtlety

    parallaxElements.forEach((element) => {
      element.style.transform = `translateY(${rate}px) perspective(1000px) rotateX(-5deg) rotateY(5deg)`
    })
  })
}

// Advanced animations and micro-interactions
function initAdvancedAnimations() {
  // Enhanced hover effects for cards
  const cards = document.querySelectorAll(".service-card, .project-card, .skill-category, .cert-card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty("--mouse-x", x + "px")
      card.style.setProperty("--mouse-y", y + "px")
    })
  })

  // Enhanced button interactions
  const buttons = document.querySelectorAll(".btn")

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const ripple = document.createElement("span")
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      button.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Add CSS for ripple effect
  const style = document.createElement("style")
  style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

// 3D Mouse Tracking Effects
function init3DEffects() {
  const cards = document.querySelectorAll(".service-card, .project-card, .skill-category, .cert-card")

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)"
    })
  })

  // 3D effect for hero image
  const heroImage = document.querySelector(".image-container")
  if (heroImage) {
    heroImage.addEventListener("mousemove", (e) => {
      const rect = heroImage.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      heroImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    })

    heroImage.addEventListener("mouseleave", () => {
      heroImage.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
    })
  }
}

// Toast Notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast")
  const toastMessage = toast.querySelector(".toast-message")
  const toastIcon = toast.querySelector(".toast-icon")

  // Set message
  toastMessage.textContent = message

  // Set icon and styling based on type
  if (type === "success") {
    toastIcon.className = "toast-icon fas fa-check-circle"
    toast.style.setProperty("--toast-color", "#22c55e")
  } else if (type === "error") {
    toastIcon.className = "toast-icon fas fa-exclamation-circle"
    toast.style.setProperty("--toast-color", "#ef4444")
  }

  // Enhanced show animation
  toast.classList.add("show")
  toast.style.animation = "slideInRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)"

  // Auto hide after 4 seconds with enhanced animation
  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease-in-out"
    setTimeout(() => {
      toast.classList.remove("show")
    }, 300)
  }, 4000)

  // Close button functionality
  const closeBtn = toast.querySelector(".toast-close")
  closeBtn.addEventListener("click", () => {
    toast.style.animation = "slideOutRight 0.3s ease-in-out"
    setTimeout(() => {
      toast.classList.remove("show")
    }, 300)
  })
}

// Initialize animations on page load
window.addEventListener("load", () => {
  // Add visible class to hero elements immediately
  const heroElements = document.querySelectorAll(".hero .fade-in-up")
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("visible")
    }, index * 200)
  })

  // Add entrance animation to floating elements
  const floatingElements = document.querySelectorAll(".floating-element")
  floatingElements.forEach((element, index) => {
    setTimeout(
      () => {
        element.style.opacity = "1"
        element.style.animation = `float ${25 + index * 5}s infinite linear ${index * 5}s`
      },
      100 + index * 500,
    )
  })
})

// Add CSS animations for toast
const toastStyles = document.createElement("style")
toastStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .floating-element {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
`
document.head.appendChild(toastStyles)
