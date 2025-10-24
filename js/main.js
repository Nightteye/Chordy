// ============================================================================
// MUSICBOT WEBSITE - MAIN JAVASCRIPT FILE
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
// 2. HAMBURGER MENU FUNCTIONALITY
// ============================================================================

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

// ============================================================================
// 3. NAVBAR SCROLL EFFECT
// ============================================================================

let lastScrollTop = 0;
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add background blur to navbar on scroll
    if (scrollTop > scrollThreshold) {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
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
// 5. FAQ ACCORDION FUNCTIONALITY
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
// 6. SMOOTH SCROLL BEHAVIOR
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            const offsetTop = element.offsetTop - 100;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

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
// 8. INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.feature-card, .stat-card, .step, .tip-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ============================================================================
// 9. STATISTICS COUNTER ANIMATION
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
// 10. COPY TO CLIPBOARD FUNCTIONALITY
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
// 11. NOTIFICATION SYSTEM
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
// 12. KEYBOARD SHORTCUTS
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
// 13. PERFORMANCE OPTIMIZATION
// ============================================================================

// Lazy load images
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
// 14. ERROR HANDLING & LOGGING
// ============================================================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================================================
// 15. LOCAL STORAGE UTILITIES
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
// 16. PAGE LOAD OPTIMIZATION
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
    console.log('MusicBot website loaded successfully');
});

// ============================================================================
// 17. UTILITY FUNCTIONS
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
// 18. FOOTER CURRENT YEAR
// ============================================================================

const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
}

// ============================================================================
// 19. CONSOLE GREETING
// ============================================================================

console.log(
    '%c🎵 Welcome to MusicBot!',
    'color: #7C3AED; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cAdd MusicBot to your Discord server for amazing music features!',
    'color: #A78BFA; font-size: 14px;'
);
console.log(
    '%cVisit: https://your-musicbot.com for more information',
    'color: #CBD5E1; font-size: 12px;'
);