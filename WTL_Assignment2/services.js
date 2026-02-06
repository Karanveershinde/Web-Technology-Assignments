// Services page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeServiceFilters();
    initializeServiceSearch();
    initializeServiceAnimations();
});

// Service filtering functionality
function initializeServiceFilters() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const serviceItems = document.querySelectorAll('.service-item');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter services
            filterServices(category);
        });
    });

    function filterServices(category) {
        serviceItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in');
            }
        });
        
        // Update service count
        updateServiceCount(category);
    }

    function updateServiceCount(category) {
        const visibleServices = document.querySelectorAll(
            category === 'all' ? '.service-item' : `.service-item[data-category="${category}"]`
        );
        
        // Create or update service count display
        let countDisplay = document.querySelector('.service-count');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.className = 'service-count';
            countDisplay.style.cssText = `
                text-align: center;
                margin: 20px 0;
                font-size: 16px;
                color: #666;
            `;
            document.querySelector('.category-tabs').after(countDisplay);
        }
        
        const categoryName = category === 'all' ? 'All Services' : 
                           category === 'citizen' ? 'Citizen Services' :
                           category === 'business' ? 'Business Services' : 'Digital Services';
        
        countDisplay.textContent = `Showing ${visibleServices.length} ${categoryName}`;
    }
}

// Service search functionality
function initializeServiceSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performServiceSearch(e.target.value);
        }, 300);
    });

    function performServiceSearch(query) {
        const serviceItems = document.querySelectorAll('.service-item');
        const searchQuery = query.toLowerCase().trim();
        
        if (searchQuery === '') {
            // Show all services if search is empty
            serviceItems.forEach(item => {
                item.style.display = 'block';
                item.classList.remove('search-highlight');
            });
            return;
        }

        let visibleCount = 0;
        
        serviceItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const features = Array.from(item.querySelectorAll('.service-features li'))
                .map(li => li.textContent.toLowerCase()).join(' ');
            
            const searchContent = `${title} ${description} ${features}`;
            
            if (searchContent.includes(searchQuery)) {
                item.style.display = 'block';
                item.classList.add('search-highlight');
                visibleCount++;
                
                // Highlight matching text
                highlightSearchTerm(item, searchQuery);
            } else {
                item.style.display = 'none';
                item.classList.remove('search-highlight');
            }
        });
        
        // Update search results count
        updateSearchResults(visibleCount, searchQuery);
    }

    function highlightSearchTerm(item, term) {
        const title = item.querySelector('h3');
        const description = item.querySelector('p');
        
        [title, description].forEach(element => {
            const originalText = element.textContent;
            const regex = new RegExp(`(${term})`, 'gi');
            const highlightedText = originalText.replace(regex, '<mark>$1</mark>');
            
            if (highlightedText !== originalText) {
                element.innerHTML = highlightedText;
            }
        });
    }

    function updateSearchResults(count, query) {
        let resultsDisplay = document.querySelector('.search-results');
        if (!resultsDisplay) {
            resultsDisplay = document.createElement('div');
            resultsDisplay.className = 'search-results';
            resultsDisplay.style.cssText = `
                text-align: center;
                margin: 20px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                font-size: 16px;
                color: #333;
            `;
            document.querySelector('.services-container').before(resultsDisplay);
        }
        
        if (query) {
            resultsDisplay.innerHTML = `
                <i class="fas fa-search"></i>
                Found <strong>${count}</strong> service${count !== 1 ? 's' : ''} matching "<strong>${query}</strong>"
                ${count === 0 ? '<br><small>Try different keywords or browse all services</small>' : ''}
            `;
            resultsDisplay.style.display = 'block';
        } else {
            resultsDisplay.style.display = 'none';
        }
    }
}

// Service animations
function initializeServiceAnimations() {
    // Animate service items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('slide-up');
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-item').forEach(item => {
        observer.observe(item);
    });

    // Animate statistics counters
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (suffix.includes('M')) {
                displayValue = (displayValue / 1000000).toFixed(1) + 'M';
            } else if (suffix.includes('K')) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            } else {
                displayValue = displayValue + suffix;
            }
            
            element.textContent = displayValue;
        }, 16);
    }
}

// Service item interactions
document.addEventListener('click', function(e) {
    // Handle service action buttons
    if (e.target.classList.contains('btn-primary')) {
        e.preventDefault();
        const serviceName = e.target.closest('.service-item').querySelector('h3').textContent;
        showServiceModal(serviceName);
    }
    
    if (e.target.classList.contains('btn-secondary')) {
        e.preventDefault();
        const serviceName = e.target.closest('.service-item').querySelector('h3').textContent;
        showServiceInfo(serviceName);
    }
});

// Service modal functionality
function showServiceModal(serviceName) {
    const modal = createModal(`
        <div class="service-modal">
            <div class="modal-header">
                <h2><i class="fas fa-external-link-alt"></i> ${serviceName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>You are being redirected to the official ${serviceName} portal.</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="proceedToService('${serviceName}')">
                        <i class="fas fa-arrow-right"></i> Proceed
                    </button>
                    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function showServiceInfo(serviceName) {
    const serviceInfo = getServiceInfo(serviceName);
    const modal = createModal(`
        <div class="service-modal">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> ${serviceName} - Information</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="service-details">
                    <h3>About this Service</h3>
                    <p>${serviceInfo.description}</p>
                    
                    <h3>Required Documents</h3>
                    <ul>
                        ${serviceInfo.documents.map(doc => `<li>${doc}</li>`).join('')}
                    </ul>
                    
                    <h3>Processing Time</h3>
                    <p>${serviceInfo.processingTime}</p>
                    
                    <h3>Fees</h3>
                    <p>${serviceInfo.fees}</p>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="proceedToService('${serviceName}')">
                        <i class="fas fa-arrow-right"></i> Apply Now
                    </button>
                    <button class="btn-secondary" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = content;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal on close button click
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function proceedToService(serviceName) {
    // In a real implementation, this would redirect to the actual service
    alert(`Redirecting to ${serviceName} portal...\n\nThis is a demo - in a real implementation, you would be redirected to the official service portal.`);
    closeModal();
}

function getServiceInfo(serviceName) {
    const serviceData = {
        'Aadhaar Services': {
            description: 'Aadhaar is a 12-digit unique identity number that can be obtained by residents of India, based on their biometric and demographic data.',
            documents: ['Proof of Identity', 'Proof of Address', 'Proof of Date of Birth'],
            processingTime: '90 days from enrollment',
            fees: 'Free for first time enrollment'
        },
        'Passport Services': {
            description: 'Indian passport is issued by the Ministry of External Affairs and serves as an official travel document.',
            documents: ['Birth Certificate', 'Address Proof', 'Identity Proof', 'Photographs'],
            processingTime: '30-45 days for normal processing',
            fees: '₹1,500 for 36 pages, ₹2,000 for 60 pages'
        },
        'Driving License': {
            description: 'A driving license is an official document permitting a specific individual to operate motorized vehicles.',
            documents: ['Age Proof', 'Address Proof', 'Medical Certificate', 'Photographs'],
            processingTime: '7-15 days after test',
            fees: '₹200 for Learning License, ₹500 for Permanent License'
        },
        'Income Tax Services': {
            description: 'Online platform for filing income tax returns and managing tax-related services.',
            documents: ['PAN Card', 'Form 16', 'Bank Statements', 'Investment Proofs'],
            processingTime: 'Immediate for e-filing',
            fees: 'Free for income up to ₹5 lakhs'
        }
    };
    
    return serviceData[serviceName] || {
        description: 'Service information not available.',
        documents: ['Contact service provider for details'],
        processingTime: 'Varies',
        fees: 'Contact service provider'
    };
}

// Add CSS for modal and animations
const additionalStyles = `
    .service-modal {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #003366, #0055a5);
        color: white;
        border-radius: 12px 12px 0 0;
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        color: white;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.3s;
    }
    
    .modal-close:hover {
        background: rgba(255,255,255,0.2);
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .service-details h3 {
        color: #003366;
        margin: 20px 0 10px 0;
        font-size: 16px;
    }
    
    .service-details ul {
        margin: 10px 0;
        padding-left: 20px;
    }
    
    .service-details li {
        margin: 5px 0;
    }
    
    .modal-actions {
        margin-top: 30px;
        display: flex;
        gap: 15px;
        justify-content: flex-end;
    }
    
    .modal-overlay.show {
        opacity: 1;
    }
    
    .search-highlight {
        border: 2px solid #ff6600 !important;
        box-shadow: 0 0 20px rgba(255,102,0,0.2) !important;
    }
    
    .search-highlight mark {
        background: #fff3cd;
        color: #856404;
        padding: 2px 4px;
        border-radius: 3px;
    }
    
    .breadcrumb {
        background: #f8f9fa;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }
    
    .breadcrumb ol {
        list-style: none;
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
    }
    
    .breadcrumb li {
        display: flex;
        align-items: center;
    }
    
    .breadcrumb li:not(:last-child)::after {
        content: '/';
        margin: 0 10px;
        color: #666;
    }
    
    .breadcrumb a {
        color: #0066cc;
        text-decoration: none;
    }
    
    .breadcrumb a:hover {
        text-decoration: underline;
    }
    
    .page-header {
        background: linear-gradient(135deg, #003366, #0055a5);
        color: white;
        padding: 40px 0;
        text-align: center;
    }
    
    .page-header h1 {
        font-size: 36px;
        margin-bottom: 10px;
    }
    
    .page-header p {
        font-size: 18px;
        opacity: 0.9;
    }
    
    .category-tabs {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .tab-btn {
        background: white;
        border: 2px solid #0066cc;
        color: #0066cc;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: bold;
    }
    
    .tab-btn.active,
    .tab-btn:hover {
        background: #0066cc;
        color: white;
    }
    
    .service-categories {
        padding: 60px 0;
    }
    
    .service-item {
        background: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        transition: all 0.3s;
        border: 1px solid #eee;
        display: flex;
        gap: 20px;
    }
    
    .service-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }
    
    .service-icon {
        flex-shrink: 0;
    }
    
    .service-icon i {
        font-size: 48px;
        color: #0066cc;
        transition: color 0.3s;
    }
    
    .service-item:hover .service-icon i {
        color: #ff6600;
    }
    
    .service-content h3 {
        color: #003366;
        margin-bottom: 15px;
        font-size: 22px;
    }
    
    .service-features {
        list-style: none;
        margin: 20px 0;
        padding: 0;
    }
    
    .service-features li {
        padding: 5px 0;
        position: relative;
        padding-left: 20px;
    }
    
    .service-features li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #28a745;
        font-weight: bold;
    }
    
    .service-actions {
        margin-top: 20px;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }
    
    .btn-secondary {
        background: transparent;
        color: #0066cc;
        border: 2px solid #0066cc;
        padding: 10px 20px;
        border-radius: 25px;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.3s;
        display: inline-block;
    }
    
    .btn-secondary:hover {
        background: #0066cc;
        color: white;
    }
    
    .service-stats {
        background: #f8f9fa;
        padding: 60px 0;
    }
    
    .service-stats h2 {
        text-align: center;
        margin-bottom: 40px;
        color: #003366;
        font-size: 32px;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
    }
    
    .stat-item {
        text-align: center;
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    
    .stat-number {
        font-size: 36px;
        font-weight: bold;
        color: #ff6600;
        margin-bottom: 10px;
    }
    
    .stat-label {
        color: #666;
        font-size: 16px;
    }
    
    .help-section {
        padding: 60px 0;
        background: white;
    }
    
    .help-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
        align-items: center;
    }
    
    .help-text h2 {
        color: #003366;
        margin-bottom: 20px;
        font-size: 32px;
    }
    
    .help-text p {
        color: #666;
        margin-bottom: 30px;
        font-size: 18px;
    }
    
    .help-options {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .help-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 25px;
        background: #0066cc;
        color: white;
        text-decoration: none;
        border-radius: 25px;
        transition: all 0.3s;
    }
    
    .help-option:hover {
        background: #ff6600;
        transform: translateY(-2px);
    }
    
    .help-image {
        text-align: center;
    }
    
    .help-image i {
        font-size: 120px;
        color: #0066cc;
        opacity: 0.3;
    }
    
    @media (max-width: 768px) {
        .service-item {
            flex-direction: column;
            text-align: center;
        }
        
        .help-content {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .service-actions {
            justify-content: center;
        }
        
        .help-options {
            justify-content: center;
        }
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);