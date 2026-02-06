// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSlider();
    initializeMobileMenu();
    initializeAccessibilityTools();
    initializeScrollEffects();
    initializeSearchFunctionality();
    initializeDropdownMenus();
});

// Hero Slider Functionality
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-controls .prev');
    const nextBtn = document.querySelector('.slider-controls .next');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    // Auto-play slider
    function startSlider() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopSlider();
            nextSlide();
            startSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopSlider();
            prevSlide();
            startSlider();
        });
    }

    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlider);
        heroSection.addEventListener('mouseleave', startSlider);
    }

    // Start the slider
    startSlider();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopSlider();
            prevSlide();
            startSlider();
        } else if (e.key === 'ArrowRight') {
            stopSlider();
            nextSlide();
            startSlider();
        }
    });
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (mobileToggle.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
}

// Accessibility Tools
function initializeAccessibilityTools() {
    const fontSizeBtn = document.querySelector('.font-size');
    const contrastBtn = document.querySelector('.contrast');
    let fontSize = 100;
    let highContrast = false;

    // Font size adjustment
    if (fontSizeBtn) {
        fontSizeBtn.addEventListener('click', () => {
            fontSize = fontSize >= 120 ? 100 : fontSize + 10;
            document.documentElement.style.fontSize = fontSize + '%';
            
            // Update button text
            fontSizeBtn.textContent = fontSize === 100 ? 'A+' : 
                                     fontSize === 110 ? 'A++' : 'A+++';
            
            // Store preference
            localStorage.setItem('fontSize', fontSize);
        });
    }

    // High contrast toggle
    if (contrastBtn) {
        contrastBtn.addEventListener('click', () => {
            highContrast = !highContrast;
            document.body.classList.toggle('high-contrast', highContrast);
            
            // Store preference
            localStorage.setItem('highContrast', highContrast);
        });
    }

    // Load saved preferences
    const savedFontSize = localStorage.getItem('fontSize');
    const savedContrast = localStorage.getItem('highContrast');
    
    if (savedFontSize) {
        fontSize = parseInt(savedFontSize);
        document.documentElement.style.fontSize = fontSize + '%';
        if (fontSizeBtn) {
            fontSizeBtn.textContent = fontSize === 100 ? 'A+' : 
                                     fontSize === 110 ? 'A++' : 'A+++';
        }
    }
    
    if (savedContrast === 'true') {
        highContrast = true;
        document.body.classList.add('high-contrast');
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .initiative-card, .news-item, .update-item').forEach(el => {
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.main-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'linear-gradient(135deg, #003366, #0055a5)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
            } else {
                navbar.style.background = 'linear-gradient(135deg, #0055a5, #0066cc)';
                navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
        });
    }
}

// Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');

    if (!searchInput || !searchBtn) return;

    // Search suggestions (mock data)
    const searchSuggestions = [
        'Aadhaar Card',
        'Passport Application',
        'Income Tax',
        'Driving License',
        'PAN Card',
        'Voter ID',
        'Birth Certificate',
        'Marriage Certificate',
        'Property Registration',
        'Business License'
    ];

    // Create suggestions dropdown
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions';
    suggestionsDiv.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
    `;

    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(suggestionsDiv);

    // Show suggestions on input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        const matches = searchSuggestions.filter(item => 
            item.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            suggestionsDiv.innerHTML = matches.map(match => 
                `<div class="suggestion-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">${match}</div>`
            ).join('');
            suggestionsDiv.style.display = 'block';

            // Add click handlers to suggestions
            suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    suggestionsDiv.style.display = 'none';
                    performSearch(item.textContent);
                });
            });
        } else {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.parentNode.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Search button click
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Enter key search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
            suggestionsDiv.style.display = 'none';
        }
    });

    function performSearch(query) {
        if (query.trim()) {
            // Mock search functionality
            alert(`Searching for: "${query}"\n\nThis would redirect to search results page in a real implementation.`);
            // In a real implementation, you would redirect to a search results page
            // window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }
}

// Dropdown Menu Functionality
function initializeDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeoutId;

        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        });

        dropdown.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }, 150);
        });

        // Keyboard navigation
        dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isVisible = menu.style.visibility === 'visible';
                menu.style.opacity = isVisible ? '0' : '1';
                menu.style.visibility = isVisible ? 'hidden' : 'visible';
                menu.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
            }
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling for missing elements
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}

// Initialize tooltips (if needed)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = e.target.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            // Remove title to prevent default tooltip
            e.target.setAttribute('data-title', e.target.getAttribute('title'));
            e.target.removeAttribute('title');
        });
        
        element.addEventListener('mouseleave', (e) => {
            const tooltip = document.querySelector('.custom-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
            
            // Restore title
            if (e.target.getAttribute('data-title')) {
                e.target.setAttribute('title', e.target.getAttribute('data-title'));
                e.target.removeAttribute('data-title');
            }
        });
    });
}

// Initialize tooltips
initializeTooltips();

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function shareContent(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #ff6600;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Console welcome message
console.log('%c🇮🇳 Welcome to the National Portal of India! 🇮🇳', 'color: #ff6600; font-size: 16px; font-weight: bold;');
console.log('%cThis is a demo website created for educational purposes.', 'color: #0066cc; font-size: 12px;');