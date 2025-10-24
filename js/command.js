// ============================================================================
// Chordy COMMANDS PAGE - JAVASCRIPT FILE
// ============================================================================

// ============================================================================
// 1. DOM ELEMENTS & VARIABLES
// ============================================================================

const filterButtons = document.querySelectorAll('.filter-btn');
const commandCards = document.querySelectorAll('.command-card');
const searchInput = document.getElementById('command-search');
const commandCategories = document.querySelectorAll('.commands-category');

// ============================================================================
// 2. FILTER FUNCTIONALITY
// ============================================================================

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter categories
        commandCategories.forEach(category => {
            const categoryData = category.dataset.category;
            
            if (filter === 'all' || categoryData === filter) {
                category.style.display = 'block';
                category.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                category.style.display = 'none';
            }
        });

        // Reset search
        if (searchInput) searchInput.value = '';
    });
});

// ============================================================================
// 3. SEARCH FUNCTIONALITY
// ============================================================================

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        if (searchTerm.length === 0) {
            // Show all commands
            commandCategories.forEach(category => {
                category.style.display = 'block';
                category.querySelectorAll('.command-card').forEach(card => {
                    card.style.display = 'block';
                });
            });
            return;
        }

        commandCategories.forEach(category => {
            let categoryHasMatch = false;
            const cards = category.querySelectorAll('.command-card');

            cards.forEach(card => {
                const header = card.querySelector('.command-header h3');
                const description = card.querySelector('.command-description');
                const details = card.querySelector('.command-details');

                const headerText = header ? header.textContent.toLowerCase() : '';
                const descriptionText = description ? description.textContent.toLowerCase() : '';
                const detailsText = details ? details.textContent.toLowerCase() : '';

                const matches = 
                    headerText.includes(searchTerm) ||
                    descriptionText.includes(searchTerm) ||
                    detailsText.includes(searchTerm);

                if (matches) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease-out';
                    categoryHasMatch = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show category if it has matches
            if (categoryHasMatch) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });

        // Show no results message if needed
        showNoResultsMessage(searchTerm);
    });
}

// ============================================================================
// 4. NO RESULTS MESSAGE
// ============================================================================

function showNoResultsMessage(searchTerm) {
    // Remove existing no results message
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) existingMessage.remove();

    // Check if any results found
    const visibleCategories = Array.from(commandCategories).filter(
        cat => cat.style.display !== 'none'
    );

    if (visibleCategories.length === 0 && searchTerm.length > 0) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
            <p>No commands found matching "<strong>${searchTerm}</strong>"</p>
            <p style="color: var(--text-tertiary); margin-top: 8px;">Try searching for different keywords or browse all commands</p>
        `;
        message.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px 20px;
            color: var(--text-secondary);
            font-size: 16px;
        `;

        const commandsSection = document.querySelector('.commands-section');
        if (commandsSection) {
            commandsSection.appendChild(message);
        }
    }
}

// ============================================================================
// 5. COMMAND CARD EXPANSION
// ============================================================================

commandCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });
});

// ============================================================================
// 6. COPY CODE BLOCKS
// ============================================================================

document.querySelectorAll('.code-block').forEach(block => {
    block.style.cursor = 'copy';
    block.title = 'Click to copy';

    block.addEventListener('click', () => {
        const code = block.textContent;
        copyToClipboard(code);
    });

    // Add visual feedback
    block.addEventListener('mouseenter', () => {
        block.style.backgroundColor = 'rgba(124, 58, 237, 0.2)';
    });

    block.addEventListener('mouseleave', () => {
        block.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    });
});

// ============================================================================
// 7. COPY TO CLIPBOARD FUNCTION
// ============================================================================

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification('Command copied!');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position: fixed; opacity: 0;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyNotification('Command copied!');
}

// ============================================================================
// 8. COPY NOTIFICATION
// ============================================================================

function showCopyNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #7C3AED, #EC4899);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================================================
// 9. KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        if (searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    }

    // Escape: Clear search
    if (e.key === 'Escape' && searchInput && searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
});

// ============================================================================
// 10. ANIMATIONS
// ============================================================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }

    .commands-category {
        animation: fadeIn 0.3s ease-out;
    }

    .command-card {
        transition: all 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// ============================================================================
// 11. INTERSECTION OBSERVER FOR LAZY LOADING
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

commandCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ============================================================================
// 12. CATEGORY HEADER STICKY BEHAVIOR
// ============================================================================

const categoryHeaders = document.querySelectorAll('.category-title');

categoryHeaders.forEach(header => {
    header.style.transition = 'all 0.3s ease-out';
});

window.addEventListener('scroll', () => {
    categoryHeaders.forEach(header => {
        const rect = header.getBoundingClientRect();
        if (rect.top <= 100) {
            header.style.opacity = '0.7';
        } else {
            header.style.opacity = '1';
        }
    });
});

// ============================================================================
// 13. FILTER BUTTONS RESPONSIVE
// ============================================================================

function adjustFilterButtons() {
    const filterContainer = document.querySelector('.filter-buttons');
    if (!filterContainer) return;

    const buttons = filterContainer.querySelectorAll('.filter-btn');
    const containerWidth = filterContainer.clientWidth;
    const totalButtonWidth = Array.from(buttons).reduce((sum, btn) => 
        sum + btn.offsetWidth + 8, 0);

    if (totalButtonWidth > containerWidth) {
        filterContainer.style.flexWrap = 'wrap';
    }
}

window.addEventListener('resize', adjustFilterButtons);
adjustFilterButtons();

// ============================================================================
// 14. TABLE OF CONTENTS GENERATION
// ============================================================================

function generateTableOfContents() {
    const toc = document.createElement('div');
    toc.className = 'commands-toc';
    toc.innerHTML = '<h3>Quick Navigation</h3><ul></ul>';

    const categories = document.querySelectorAll('.category-title');
    const tocList = toc.querySelector('ul');

    categories.forEach((category, index) => {
        const categoryName = category.textContent;
        const li = document.createElement('li');
        li.innerHTML = `<a href="#category-${index}">${categoryName}</a>`;
        tocList.appendChild(li);
        category.id = `category-${index}`;
    });

    return toc;
}

// ============================================================================
// 15. PERFORMANCE MONITORING
// ============================================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const pageLoadTime = window.performance.timing.loadEventEnd - 
                           window.performance.timing.navigationStart;
        console.log(`Commands page loaded in ${pageLoadTime}ms`);
    });
}

// ============================================================================
// 16. PAGE INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Commands page initialized successfully');

    // Initialize tooltips for permission badges
    document.querySelectorAll('.permission-badge').forEach(badge => {
        badge.title = badge.textContent + ' permission required';
    });

    // Add keyboard hint to search input
    if (searchInput) {
        searchInput.placeholder += ' (Ctrl+F to search)';
    }
});

// ============================================================================
// 17. EXPORT COMMAND LIST
// ============================================================================

function exportCommandList() {
    const commands = [];

    commandCards.forEach(card => {
        const header = card.querySelector('.command-header h3');
        const description = card.querySelector('.command-description');
        const codeBlock = card.querySelector('.code-block');

        if (header && description) {
            commands.push({
                name: header.textContent,
                description: description.textContent,
                usage: codeBlock ? codeBlock.textContent : ''
            });
        }
    });

    return commands;
}

// Make available globally for debugging
window.exportCommands = exportCommandList;
