// ============================================================================
// Chordy WEBSITE - MAIN JAVASCRIPT FILE (COMPLETE VERSION)
// ============================================================================

// ============================================================================
// 1. DOM ELEMENTS
// ============================================================================

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const faqHeaders = document.querySelectorAll('.faq-header');
const scrollToTopBtn = document.getElementById('scroll-to-top');

// ============================================================================
// 2. MOBILE MENU FUNCTIONALITY (ENHANCED)
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // New menu toggle system
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            menuToggle.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinksContainer.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav')) {
                navLinksContainer.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
});

// ============================================================================
// 3. NAVBAR SCROLL EFFECT
// ============================================================================

let lastScrollTop = 0;
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add background blur to navbar on scroll
    if (scrollTop > scrollThreshold) {
        if (navbar) {
            navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }
    } else {
        if (navbar) {
            navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ============================================================================
// 4. ACTIVE NAVIGATION LINK TRACKING
// ============================================================================

function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ============================================================================
// 5. SMOOTH SCROLL BEHAVIOR (ENHANCED)
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, null, href);
        }
    });
});

// Additional smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================================================
// 6. FAQ ACCORDION FUNCTIONALITY
// ============================================================================

if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            
            // Close other items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active');
        });
    });
}

// ============================================================================
// 7. SCROLL TO TOP BUTTON
// ============================================================================

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        if (scrollToTopBtn) scrollToTopBtn.classList.add('show');
    } else {
        if (scrollToTopBtn) scrollToTopBtn.classList.remove('show');
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================================================
// 8. INTERSECTION OBSERVER FOR ANIMATIONS (ENHANCED)
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add fade-in animation class
            entry.target.classList.add('fade-in-visible');
            
            // For older cards, set opacity and transform
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Observe all cards
document.querySelectorAll('.feature-card, .stat-card, .step, .tip-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ============================================================================
// 9. FORM VALIDATION (ENHANCED)
// ============================================================================

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                input.style.borderColor = '#32B8C6';
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                    this.classList.remove('error');
                }
            }
        });
    });
});

// ============================================================================
// 10. STATISTICS COUNTER ANIMATION
// ============================================================================

let countStarted = false;

const startCounters = () => {
    if (countStarted) return;
    countStarted = true;

    const counters = [
        { element: document.getElementById('server-count'), target: 1250, suffix: '+' },
        { element: document.getElementById('user-count'), target: 50000, suffix: '+' },
        { element: document.getElementById('command-count'), target: 20, suffix: '+' }
    ];

    counters.forEach(counter => {
        if (!counter.element) return;

        const increment = counter.target / 100;
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < counter.target) {
                counter.element.textContent = Math.floor(current).toLocaleString() + counter.suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.element.textContent = counter.target.toLocaleString() + counter.suffix;
            }
        };

        updateCounter();
    });
};

// Start counters when stats section is visible
if (document.querySelector('.stats')) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(document.querySelector('.stats'));
}

// ============================================================================
// 11. COPY TO CLIPBOARD FUNCTIONALITY
// ============================================================================

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Copied to clipboard!');
}

// ============================================================================
// 12. NOTIFICATION SYSTEM
// ============================================================================

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ============================================================================
// 13. KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Alt + H: Go to Home
    if (e.altKey && e.key === 'h') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Alt + C: Go to Commands
    if (e.altKey && e.key === 'c') {
        const commandsLink = document.querySelector('a[href="commands.html"]');
        if (commandsLink) window.location.href = commandsLink.href;
    }

    // Esc: Close mobile menu
    if (e.key === 'Escape' && hamburger) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================================================
// 14. LOADING ANIMATION
// ============================================================================

window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0.5';
});

// ============================================================================
// 15. LAZY LOADING IMAGES
// ============================================================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================================================
// 16. ERROR HANDLING & LOGGING
// ============================================================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================================================
// 17. LOCAL STORAGE UTILITIES
// ============================================================================

const StorageUtil = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Failed to read from localStorage:', error);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    }
};

// ============================================================================
// 18. PAGE LOAD OPTIMIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.animation = el.dataset.animate;
    });

    // Load theme preference
    const theme = StorageUtil.get('theme') || 'dark';
    document.documentElement.style.colorScheme = theme;

    // Log initialization
    console.log('Chordy website loaded successfully');
});

// ============================================================================
// 19. UTILITY FUNCTIONS
// ============================================================================

// Debounce function for performance
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================================================
// 20. FOOTER CURRENT YEAR
// ============================================================================

const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
}

// ============================================================================
// 21. ACCESSIBILITY ENHANCEMENTS
// ============================================================================

// Keyboard navigation for cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Announce page changes
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="http"]')) {
        e.target.setAttribute('rel', 'noopener noreferrer');
    }
});

// ============================================================================
// 22. RIPPLE EFFECT ON BUTTONS
// ============================================================================

function createRipple(element, x, y) {
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';

    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('button, .btn').forEach(element => {
    element.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createRipple(this, x, y);
    });
});

// ============================================================================
// 23. PERFORMANCE MONITORING
// ============================================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page Load Time: ${pageLoadTime}ms`);
    });
}

// ============================================================================
// 24. CONSOLE GREETING
// ============================================================================

console.log(
    '%c🎵 Welcome to Chordy!',
    'color: #7C3AED; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cAdd Chordy to your Discord server for amazing music features!',
    'color: #A78BFA; font-size: 14px;'
);
console.log(
    '%cVisit: https://your-chordy.com for more information',
    'color: #CBD5E1; font-size: 12px;'
);

// ============================================================================
// END OF JAVASCRIPT
// ============================================================================