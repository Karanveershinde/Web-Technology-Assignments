// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeContactAnimations();
});

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Email validation
        const email = form.querySelector('#email');
        if (email.value && !isValidEmail(email.value)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Phone validation
        const phone = form.querySelector('#phone');
        if (phone.value && !isValidPhone(phone.value)) {
            showFieldError(phone, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (field.type === 'tel' && value && !isValidPhone(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
        
        clearFieldError(field);
        return true;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function submitForm() {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showSuccessMessage();
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function showSuccessMessage() {
        const successModal = createModal(`
            <div class="success-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-check-circle"></i> Message Sent Successfully!</h2>
                </div>
                <div class="modal-body">
                    <p>Thank you for contacting us. We have received your message and will get back to you within 24 hours.</p>
                    <p><strong>Reference ID:</strong> #${generateReferenceId()}</p>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="closeModal()">OK</button>
                    </div>
                </div>
            </div>
        `);
        
        document.body.appendChild(successModal);
        setTimeout(() => successModal.classList.add('show'), 10);
    }

    function generateReferenceId() {
        return 'REF' + Date.now().toString().slice(-6);
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Contact animations
function initializeContactAnimations() {
    // Animate contact cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe contact cards
    document.querySelectorAll('.contact-card, .location-card, .faq-item').forEach(card => {
        observer.observe(card);
    });

    // Animate form fields on focus
    const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (field.value) {
            field.parentNode.classList.add('focused');
        }
    });
}

// Live chat functionality
function openLiveChat() {
    const chatModal = createModal(`
        <div class="chat-modal">
            <div class="modal-header">
                <h2><i class="fas fa-comments"></i> Live Chat Support</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="chat-container">
                    <div class="chat-messages" id="chatMessages">
                        <div class="message bot-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>Hello! I'm here to help you. How can I assist you today?</p>
                                <span class="message-time">${getCurrentTime()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="chatInput" placeholder="Type your message..." maxlength="500">
                        <button id="sendMessage"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(chatModal);
    setTimeout(() => chatModal.classList.add('show'), 10);
    
    // Initialize chat functionality
    initializeChatFeatures();
}

function initializeChatFeatures() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !sendButton || !chatMessages) return;
    
    // Auto-responses for demo
    const responses = [
        "Thank you for your message. Let me help you with that.",
        "I understand your concern. Let me connect you with the right department.",
        "That's a great question! Here's what I can tell you...",
        "I'm processing your request. Please hold on for a moment.",
        "Is there anything else I can help you with today?"
    ];
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1000 + Math.random() * 2000);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add animation
        setTimeout(() => messageDiv.classList.add('show'), 10);
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Focus on input
    chatInput.focus();
}

// Map functionality
function showMap() {
    const mapModal = createModal(`
        <div class="map-modal">
            <div class="modal-header">
                <h2><i class="fas fa-map-marker-alt"></i> Office Location</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="map-container">
                    <div class="map-placeholder">
                        <i class="fas fa-map"></i>
                        <h3>Interactive Map</h3>
                        <p>Secretariat, New Delhi - 110001</p>
                        <p>In a real implementation, this would show an interactive map with directions.</p>
                        <div class="map-actions">
                            <button class="btn-primary" onclick="getDirections()">
                                <i class="fas fa-directions"></i> Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(mapModal);
    setTimeout(() => mapModal.classList.add('show'), 10);
}

function getDirections() {
    alert('In a real implementation, this would open your default maps application with directions to our office.');
}

// Utility functions
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
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Add contact page specific styles
const contactStyles = `
    .contact-methods {
        padding: 60px 0;
        background: white;
    }
    
    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
    }
    
    .contact-card {
        background: white;
        padding: 40px 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        transition: all 0.3s;
        border: 1px solid #eee;
    }
    
    .contact-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }
    
    .contact-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #0066cc, #ff6600);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        transition: transform 0.3s;
    }
    
    .contact-card:hover .contact-icon {
        transform: scale(1.1);
    }
    
    .contact-icon i {
        font-size: 32px;
        color: white;
    }
    
    .contact-card h3 {
        color: #003366;
        margin-bottom: 15px;
        font-size: 22px;
    }
    
    .contact-card p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .contact-details {
        margin: 20px 0;
    }
    
    .contact-details strong {
        display: block;
        color: #003366;
        font-size: 18px;
        margin-bottom: 5px;
    }
    
    .contact-details span {
        color: #666;
        font-size: 14px;
    }
    
    .contact-btn {
        background: #0066cc;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 25px;
        text-decoration: none;
        font-weight: bold;
        transition: all 0.3s;
        display: inline-block;
        cursor: pointer;
    }
    
    .contact-btn:hover {
        background: #ff6600;
        transform: translateY(-2px);
    }
    
    .contact-form-section {
        padding: 60px 0;
        background: #f8f9fa;
    }
    
    .form-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    
    .form-header {
        text-align: center;
        margin-bottom: 40px;
    }
    
    .form-header h2 {
        color: #003366;
        margin-bottom: 15px;
        font-size: 32px;
    }
    
    .form-header p {
        color: #666;
        font-size: 16px;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .form-group {
        margin-bottom: 25px;
        position: relative;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 8px;
        color: #333;
        font-weight: bold;
        font-size: 14px;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s;
        background: white;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0,102,204,0.1);
    }
    
    .form-group.focused label {
        color: #0066cc;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
    }
    
    .field-error {
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        font-weight: normal !important;
        line-height: 1.5;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin-right: 10px;
        margin-top: 2px;
    }
    
    .form-actions {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 30px;
    }
    
    .faq-section {
        padding: 60px 0;
        background: white;
    }
    
    .faq-section h2 {
        text-align: center;
        color: #003366;
        margin-bottom: 40px;
        font-size: 32px;
    }
    
    .faq-container {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .faq-item {
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: all 0.3s;
    }
    
    .faq-item:hover {
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .faq-question {
        padding: 20px;
        background: #f8f9fa;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s;
    }
    
    .faq-question:hover {
        background: #e9ecef;
    }
    
    .faq-question h3 {
        margin: 0;
        color: #003366;
        font-size: 18px;
    }
    
    .faq-question i {
        color: #0066cc;
        transition: transform 0.3s;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .faq-answer p {
        padding: 20px;
        margin: 0;
        color: #666;
        line-height: 1.6;
    }
    
    .office-locations {
        padding: 60px 0;
        background: #f8f9fa;
    }
    
    .office-locations h2 {
        text-align: center;
        color: #003366;
        margin-bottom: 40px;
        font-size: 32px;
    }
    
    .locations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
    }
    
    .location-card {
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        transition: all 0.3s;
    }
    
    .location-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }
    
    .location-card h3 {
        color: #003366;
        margin-bottom: 20px;
        font-size: 20px;
    }
    
    .location-details p {
        margin: 10px 0;
        color: #666;
        display: flex;
        align-items: center;
    }
    
    .location-details i {
        width: 20px;
        color: #0066cc;
        margin-right: 10px;
    }
    
    .emergency-contacts {
        padding: 60px 0;
        background: #003366;
        color: white;
    }
    
    .emergency-contacts h2 {
        text-align: center;
        margin-bottom: 40px;
        font-size: 32px;
    }
    
    .emergency-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
    }
    
    .emergency-item {
        text-align: center;
        padding: 30px;
        background: rgba(255,255,255,0.1);
        border-radius: 15px;
        transition: all 0.3s;
    }
    
    .emergency-item:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-5px);
    }
    
    .emergency-item i {
        font-size: 48px;
        color: #ff6600;
        margin-bottom: 15px;
    }
    
    .emergency-item h3 {
        margin-bottom: 10px;
        font-size: 18px;
    }
    
    .emergency-item p {
        font-size: 24px;
        font-weight: bold;
        color: #ff6600;
    }
    
    /* Chat Modal Styles */
    .chat-modal {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        height: 600px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        background: #f8f9fa;
    }
    
    .message {
        display: flex;
        margin-bottom: 15px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s;
    }
    
    .message.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        flex-shrink: 0;
    }
    
    .bot-message .message-avatar {
        background: #0066cc;
        color: white;
    }
    
    .user-message {
        flex-direction: row-reverse;
    }
    
    .user-message .message-avatar {
        background: #ff6600;
        color: white;
        margin-right: 0;
        margin-left: 10px;
    }
    
    .message-content {
        background: white;
        padding: 12px 15px;
        border-radius: 15px;
        max-width: 70%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .user-message .message-content {
        background: #0066cc;
        color: white;
    }
    
    .message-content p {
        margin: 0;
        line-height: 1.4;
    }
    
    .message-time {
        font-size: 11px;
        opacity: 0.7;
        display: block;
        margin-top: 5px;
    }
    
    .chat-input-container {
        padding: 20px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
    }
    
    .chat-input-container input {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 25px;
        outline: none;
    }
    
    .chat-input-container button {
        width: 45px;
        height: 45px;
        border: none;
        background: #0066cc;
        color: white;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .chat-input-container button:hover {
        background: #ff6600;
    }
    
    /* Map Modal Styles */
    .map-modal {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .map-placeholder {
        padding: 60px 40px;
        text-align: center;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 20px;
    }
    
    .map-placeholder i {
        font-size: 80px;
        color: #0066cc;
        margin-bottom: 20px;
    }
    
    .map-placeholder h3 {
        color: #003366;
        margin-bottom: 15px;
    }
    
    .map-placeholder p {
        color: #666;
        margin-bottom: 10px;
    }
    
    .map-actions {
        margin-top: 30px;
    }
    
    /* Success Modal Styles */
    .success-modal {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .success-modal .modal-header {
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 20px;
        border-radius: 12px 12px 0 0;
        text-align: center;
    }
    
    .success-modal .modal-header h2 {
        margin: 0;
        font-size: 24px;
    }
    
    .success-modal .modal-header i {
        font-size: 48px;
        margin-bottom: 10px;
        display: block;
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .form-actions {
            flex-direction: column;
            align-items: center;
        }
        
        .contact-grid {
            grid-template-columns: 1fr;
        }
        
        .locations-grid {
            grid-template-columns: 1fr;
        }
        
        .emergency-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .chat-modal {
            width: 95%;
            height: 90vh;
        }
    }
    
    @media (max-width: 480px) {
        .emergency-grid {
            grid-template-columns: 1fr;
        }
        
        .form-container {
            padding: 20px;
        }
    }
`;

// Add the styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);