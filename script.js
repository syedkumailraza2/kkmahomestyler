// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.createElement('button');
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('success-message');
const successOverlay = document.getElementById('success-overlay');
const closeSuccessBtn = document.querySelector('.close-success');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Rating system elements
const ratingStars = document.querySelectorAll('.user-rating-stars i');
const submitRatingBtn = document.getElementById('submit-rating');
const ratingComment = document.getElementById('rating-comment');
const ratingSuccessMessage = document.getElementById('rating-success-message');
const reviewerNameInput = document.getElementById('reviewer-name');
const reviewerEmailInput = document.getElementById('reviewer-email');
const ratingErrorMessage = document.getElementById('rating-error');
const errorMessage = document.getElementById('error-message');
const reviewsContainer = document.getElementById('reviews-container');

// Toast notification elements
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Reviews display elements
const reviewsSummary = document.getElementById('reviews-summary');
const sortReviewsSelect = document.getElementById('sort-reviews');
const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');
const reviewsNavigation = document.getElementById('reviews-navigation');
const scrollIndicator = document.getElementById('scroll-indicator');
const scrollPosition = document.getElementById('scroll-position');

// Reviews state
let allReviews = [];
let currentScrollPosition = 0;
let reviewsPerView = 3; // Show 3 reviews at a time

// Carousel state
let carouselInterval = null;

// Initialize EmailJS
(function() {
    emailjs.init("SRUGN4DszRyHgNxsW"); // This will be replaced with actual public key
})();

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializePortfolio();
    initializeContactForm();
    initializeModal();
    initializeSuccessPopup();
    initializeRatingSystem();
    createScrollToTopButton();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Keep navbar consistently black on scroll - no color changes
    window.addEventListener('scroll', function() {
        // Navbar maintains consistent black theme - no color changes

        // Show/hide scroll to top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Check if user has scrolled to footer
        const footer = document.querySelector('.footer');
        if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // When footer is visible (within viewport)
            if (footerTop < windowHeight) {
                scrollTopBtn.classList.add('in-footer');
            } else {
                scrollTopBtn.classList.remove('in-footer');
            }
        }
    });

    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.expertise-item, .portfolio-item, .contact-item');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
}

// Portfolio filtering
function initializePortfolio() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // View project buttons
    const viewProjectBtns = document.querySelectorAll('.view-project');
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            showProjectDetails(projectId);
        });
    });
}

// Project details data
const projectDetails = {
    'living-room': {
        title: 'Modern Living Room Design',
        description: 'This contemporary living room features clean lines, neutral color palette, and optimal space utilization. The design includes custom-built entertainment center, recessed lighting, and premium flooring materials. AutoCAD 3D modeling allowed for precise planning of furniture placement and traffic flow.',
        details: [
            'Area: 350 sq. ft.',
            'Style: Contemporary Modern',
            'Materials: Hardwood flooring, custom cabinetry',
            'Timeline: 3 weeks for design completion',
            'Features: Smart home integration, ambient lighting'
        ]
    },
    'office': {
        title: 'Corporate Office Space',
        description: 'A professional commercial interior designed for productivity and collaboration. The space includes private offices, open work areas, meeting rooms, and a reception area. 3D visualization helped optimize natural lighting and create an efficient workflow.',
        details: [
            'Area: 2,500 sq. ft.',
            'Style: Corporate Professional',
            'Materials: Commercial grade flooring, acoustic panels',
            'Timeline: 6 weeks for design completion',
            'Features: Ergonomic workstations, conference facilities'
        ]
    },
    'kitchen': {
        title: 'Modern Luxury Kitchen',
        description: 'A state-of-the-art kitchen combining functionality with aesthetics. Features include custom cabinetry, premium appliances, island with seating, and smart storage solutions. The 3D model ensured perfect integration of all elements.',
        details: [
            'Area: 200 sq. ft.',
            'Style: Modern Luxury',
            'Materials: Quartz countertops, custom cabinetry',
            'Timeline: 4 weeks for design completion',
            'Features: Smart appliances, custom lighting solutions'
        ]
    },
    'bedroom-3d': {
        title: '3D Bedroom Visualization',
        description: 'Detailed AutoCAD 3D model showcasing a master bedroom suite with realistic materials, lighting, and textures. The visualization helped clients make informed decisions about furniture placement and color schemes.',
        details: [
            'Area: 180 sq. ft.',
            'Style: Transitional',
            'Materials: Premium flooring, custom furniture',
            'Timeline: 2 weeks for 3D modeling',
            'Features: Custom walk-in closet, en-suite bathroom'
        ]
    },
    'restaurant': {
        title: 'Restaurant Interior Design',
        description: 'An inviting dining space designed for optimal customer experience. The layout maximizes seating capacity while maintaining comfort and ambiance. 3D modeling was crucial for lighting design and customer flow optimization.',
        details: [
            'Area: 1,200 sq. ft.',
            'Style: Modern Industrial',
            'Materials: Commercial flooring, custom lighting',
            'Timeline: 5 weeks for design completion',
            'Features: Open kitchen concept, bar area, outdoor seating'
        ]
    },
    'master-bedroom': {
        title: 'Master Bedroom Suite',
        description: 'A luxurious master bedroom retreat featuring custom furniture, ambient lighting, and premium finishes. The design emphasizes comfort and relaxation while maintaining sophisticated aesthetics.',
        details: [
            'Area: 250 sq. ft.',
            'Style: Luxury Contemporary',
            'Materials: Hardwood flooring, custom furniture',
            'Timeline: 3 weeks for design completion',
            'Features: Walk-in closet, sitting area, custom lighting'
        ]
    }
};

// Modal functionality
function initializeModal() {
    // Close modal when clicking the X button
    closeModal.addEventListener('click', function() {
        closeModalFunction();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalFunction();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModalFunction();
        }
    });
}

function closeModalFunction() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Clear carousel interval when modal is closed
    if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
    }
}

function initializeSuccessPopup() {
    // Close popup when clicking the X button
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', hideSuccessMessage);
    }

    // Close popup when clicking overlay
    if (successOverlay) {
        successOverlay.addEventListener('click', hideSuccessMessage);
    }

    // Close popup with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && successMessage.classList.contains('show')) {
            hideSuccessMessage();
        }
    });

    // Auto-close after 6 seconds
    let autoCloseTimer;
    function startAutoClose() {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = setTimeout(() => {
            hideSuccessMessage();
        }, 6000);
    }

    // Start auto-close timer when popup shows
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (successMessage.classList.contains('show')) {
                    startAutoClose();
                } else {
                    clearTimeout(autoCloseTimer);
                }
            }
        });
    });

    observer.observe(successMessage, { attributes: true });
}

function showProjectDetails(projectId) {
    // Clone the template content
    const template = document.getElementById('project-template');
    const templateContent = template.querySelector('.project-details').cloneNode(true);

    // Clear and populate modal
    modalBody.innerHTML = '';
    modalBody.appendChild(templateContent);

    // Initialize carousel functionality
    initializeCarousel();

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function initializeCarousel() {
    // Clear any existing carousel interval
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }

    // Get carousel elements from current modal
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    console.log('Found slides:', slides.length); // Debug log

    let currentSlide = 0;

    function showSlide(index) {
        // Ensure index is within bounds
        if (index < 0 || index >= slides.length) return;

        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Show current slide
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Remove existing event listeners to prevent duplicates
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    // Event listeners
    newNextBtn.addEventListener('click', nextSlide);
    newPrevBtn.addEventListener('click', prevSlide);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Auto-advance carousel
    carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds

    // Initialize first slide
    showSlide(0);
}

// Contact form functionality
function initializeContactForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        // Prepare email parameters
        const emailParams = {
            from_name: formDataObj.name,
            from_email: formDataObj.email,
            from_phone: formDataObj.phone || 'Not provided',
            project_type: formDataObj['project-type'],
            message: formDataObj.message,
            to_email: 'vasihaidar7272@gmail.com',
            reply_to: formDataObj.email
        };

        // Send email using EmailJS
        emailjs.send('service_m14kp9u', 'template_1zw9q8g', emailParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);

                // Reset form
                contactForm.reset();

                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                showSuccessMessage();
            })
            .catch(function(error) {
                console.log('FAILED...', error);

                // Show error message
                showError('Failed to send message. Please try again later.');

                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });

    // Form validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    // Remove existing error styling
    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';

    // Validation rules
    if (field.hasAttribute('required') && !value) {
        field.style.borderColor = '#e74c3c';
        return false;
    }

    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }

    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            field.style.borderColor = '#e74c3c';
            return false;
        }
    }

    return true;
}

function showSuccessMessage() {
    // Show overlay and popup
    successOverlay.classList.add('show');
    successMessage.classList.add('show');

    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
}

function hideSuccessMessage() {
    // Hide overlay and popup
    successOverlay.classList.remove('show');
    successMessage.classList.remove('show');

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
    `;

    // Add error styles
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
        z-index: 3000;
        font-weight: 500;
    `;

    document.body.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Scroll to top button
function createScrollToTopButton() {
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.expertise-item, .portfolio-item, .contact-item');
    animateElements.forEach(el => observer.observe(el));
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Add CSS for fade-in animation and loading states
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.6s ease forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .reviews-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: var(--text-light);
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top: 4px solid var(--accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .no-reviews-message {
        text-align: center;
        padding: 3rem;
        color: var(--text-light);
    }

    .no-reviews-message i {
        font-size: 3rem;
        color: var(--accent);
        margin-bottom: 1rem;
    }

    .no-reviews-message h3 {
        margin-bottom: 0.5rem;
        color: var(--text);
    }

    .no-reviews-message p {
        margin-bottom: 1.5rem;
    }

    .toast.show {
        animation: slideInRight 0.3s ease forwards;
    }

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
`;
document.head.appendChild(style);

// Performance optimization: Debounce function
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

// Apply debounce to scroll event
const optimizedScroll = debounce(function() {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Analytics placeholder (replace with actual analytics code)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // Replace with actual analytics implementation
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('btn-secondary')) {
        trackEvent('button_click', {
            button_text: e.target.textContent,
            button_type: e.target.className
        });
    }

    if (e.target.classList.contains('view-project')) {
        trackEvent('project_view', {
            project_id: e.target.getAttribute('data-project')
        });
    }
});

// Rating System
function initializeRatingSystem() {
    let selectedRating = 0;

    // Handle star hover effects
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });

        star.addEventListener('mouseleave', function() {
            highlightStars(selectedRating);
        });

        star.addEventListener('click', function() {
            selectedRating = index + 1;
            setSelectedRating(selectedRating);
        });
    });

    // Handle submit rating
    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', function() {
            submitRating(selectedRating);
        });
    }

    // Handle sort change
    if (sortReviewsSelect) {
        sortReviewsSelect.addEventListener('change', function() {
            sortAndDisplayReviews();
        });
    }

    // Handle navigation buttons
    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', function() {
            scrollReviews('left');
        });
    }

    if (scrollRightBtn) {
        scrollRightBtn.addEventListener('click', function() {
            scrollReviews('right');
        });
    }

    // Handle scroll events
    if (reviewsContainer) {
        reviewsContainer.addEventListener('scroll', handleScrollEvent);
    }
}

function highlightStars(rating) {
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('hovered');
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('hovered');
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

function setSelectedRating(rating) {
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('selected');
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Add request interceptor for better error handling
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle server errors
            if (data.error) {
                throw new Error(data.error);
            } else if (data.message) {
                throw new Error(data.message);
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }

        return data;
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
        }
        throw error;
    }
}

async function submitRating(rating) {
    // Validate form
    const name = reviewerNameInput ? reviewerNameInput.value.trim() : '';
    const email = reviewerEmailInput ? reviewerEmailInput.value.trim() : '';
    const comment = ratingComment ? ratingComment.value.trim() : '';

    // Check required fields
    if (!name) {
        showRatingError('Please enter your name.');
        return;
    }

    if (!email) {
        showRatingError('Please enter your email address.');
        return;
    }

    if (!validateEmail(email)) {
        showRatingError('Please enter a valid email address.');
        return;
    }

    if (rating === 0) {
        showRatingError('Please select a rating before submitting.');
        return;
    }

    // Show loading state
    if (submitRatingBtn) {
        submitRatingBtn.disabled = true;
        submitRatingBtn.innerHTML = '<span class="loading"></span> Submitting...';
    }

    try {
        const result = await apiRequest('/reviews', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email.toLowerCase(),
                rating: rating,
                comment: comment
            })
        });

        console.log('Review submitted successfully:', result);

        // Send email notification to vasihaider about the new review
        await sendReviewNotificationEmail(name, email, rating, comment);

        // Refresh the reviews display
        await loadReviewsFromAPI();

        // Show success message with backend message
        showRatingSuccess(result.message || 'Review submitted successfully! Thank you for your feedback.');

        // Reset form after delay
        setTimeout(() => {
            resetRatingForm();
        }, 2000);

    } catch (error) {
        console.error('Error submitting review:', error);
        showRatingError(error.message || 'Failed to submit review. Please try again later.');
    } finally {
        // Reset button state
        if (submitRatingBtn) {
            submitRatingBtn.disabled = false;
            submitRatingBtn.innerHTML = 'Submit Review';
        }
    }
}

// Send email notification to vasihaider about new review
async function sendReviewNotificationEmail(customerName, customerEmail, rating, comment) {
    try {
        // Create star rating display
        const starDisplay = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

        // Format the review comment
        const reviewComment = comment || 'No comment provided';

        // Prepare email parameters for review notification
        const reviewEmailParams = {
            from_name: 'KKMA Website',
            from_email: 'noreply@kkmahomestyler.com',
            to_email: 'vasihaidar7272@gmail.com',
            reply_to: customerEmail,
            customer_name: customerName,
            customer_email: customerEmail,
            rating_stars: starDisplay,
            rating_number: `${rating}/5`,
            review_comment: reviewComment,
            notification_type: 'new_review',
            subject: `🌟 New Review: ${customerName} gave ${rating}/5 stars`
        };

        // Send email using EmailJS
        const response = await emailjs.send('service_m14kp9u', 'template_1zw9q8g', reviewEmailParams);
        console.log('Review notification email sent successfully:', response);

        return response;
    } catch (error) {
        console.error('Error sending review notification email:', error);
        // Don't throw error to prevent breaking the review submission process
        // Just log the error for debugging
        return null;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showRatingError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    if (ratingErrorMessage) {
        ratingErrorMessage.classList.add('show');

        // Hide error message after 5 seconds
        setTimeout(() => {
            ratingErrorMessage.classList.remove('show');
        }, 5000);
    }
}

function showRatingSuccess(message = 'Review submitted successfully! Thank you for your feedback.') {
    showToast(message);
}

function showToast(message) {
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        // Hide toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

function resetRatingForm() {
    // Reset stars
    setSelectedRating(0);

    // Clear all form fields
    if (reviewerNameInput) {
        reviewerNameInput.value = '';
    }
    if (reviewerEmailInput) {
        reviewerEmailInput.value = '';
    }
    if (ratingComment) {
        ratingComment.value = '';
    }
}

// Load reviews from API on page load
async function loadRatings() {
    try {
        // Load both reviews and statistics in parallel for better performance
        const [reviewsResult, statsResult] = await Promise.allSettled([
            loadReviewsFromAPI(),
            loadStatisticsFromAPI()
        ]);

        // Handle individual failures
        if (reviewsResult.status === 'rejected') {
            console.error('Error loading reviews:', reviewsResult.reason);
            // Fallback to empty state if reviews fail to load
            updateRatingDisplay([]);
            displayReviews([]);
        }

        if (statsResult.status === 'rejected') {
            console.error('Error loading statistics:', statsResult.reason);
            // Statistics will be calculated from reviews if stats fail
        }

    } catch (error) {
        console.error('Error loading reviews:', error);
        // Fallback to empty state if API fails
        updateRatingDisplay([]);
        displayReviews([]);
    }
}

async function loadReviewsFromAPI() {
    try {
        // Load reviews from simple backend
        const reviewsResult = await apiRequest('/reviews');

        const reviews = reviewsResult.map(review => ({
            id: review.id,
            name: review.name,
            email: review.email,
            rating: review.rating,
            comment: review.comment,
            date: review.date
        }));

        updateRatingDisplay(reviews);
        displayReviews(reviews);

    } catch (error) {
        console.error('Error loading reviews from API:', error);
        throw error;
    }
}

async function loadStatisticsFromAPI() {
    try {
        const result = await apiRequest('/rating');
        const stats = result;
        updateRatingDisplay([], stats); // Use stats to update display
        return stats;
    } catch (error) {
        console.error('Error loading statistics:', error);
        throw error;
    }
}

function updateRatingDisplay(ratings, stats = null) {
    // If stats are provided (from API), use them directly
    if (stats && typeof stats === 'object') {
        updateOverallRating(stats.averageRating, stats.totalReviews);
        if (stats.ratingDistribution) {
            const ratingCounts = [
                stats.ratingDistribution[1],
                stats.ratingDistribution[2],
                stats.ratingDistribution[3],
                stats.ratingDistribution[4],
                stats.ratingDistribution[5]
            ];
            updateRatingBreakdown(ratingCounts);
        }
        return;
    }

    // Fallback: calculate from reviews if no stats provided
    if (ratings.length === 0) {
        // Reset to empty state
        updateOverallRating(0, 0);
        updateRatingBreakdown([0, 0, 0, 0, 0]);
        return;
    }

    // Calculate rating statistics
    const ratingCounts = [0, 0, 0, 0, 0]; // 1-star, 2-star, 3-star, 4-star, 5-star
    let totalRating = 0;

    ratings.forEach(rating => {
        const ratingValue = Math.min(5, Math.max(1, rating.rating)); // Ensure rating is between 1-5
        ratingCounts[ratingValue - 1]++;
        totalRating += ratingValue;
    });

    const averageRating = totalRating / ratings.length;

    // Update displays
    updateOverallRating(averageRating, ratings.length);
    updateRatingBreakdown(ratingCounts);

    console.log('Average rating:', averageRating.toFixed(1));
    console.log('Total ratings:', ratings.length);
    console.log('Rating distribution:', ratingCounts);
}

function updateOverallRating(averageRating, totalCount) {
    const ratingNumber = document.getElementById('overall-rating-number');
    const ratingCount = document.getElementById('rating-count');
    const ratingStars = document.getElementById('overall-rating-stars');

    if (ratingNumber) {
        ratingNumber.textContent = averageRating.toFixed(1);
    }

    if (ratingCount) {
        const reviewText = totalCount === 1 ? 'review' : 'reviews';
        ratingCount.textContent = `Based on ${totalCount} ${reviewText}`;
    }

    if (ratingStars) {
        updateStarDisplay(ratingStars, averageRating);
    }
}

function updateStarDisplay(container, rating) {
    const stars = container.querySelectorAll('i');
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    stars.forEach((star, index) => {
        star.classList.remove('fas', 'fa-star', 'fa-star-half-alt', 'far');

        if (index < fullStars) {
            star.classList.add('fas', 'fa-star');
        } else if (index === fullStars && hasHalfStar) {
            star.classList.add('fas', 'fa-star-half-alt');
        } else {
            star.classList.add('far', 'fa-star');
        }
    });
}

function updateRatingBreakdown(ratingCounts) {
    const totalCount = ratingCounts.reduce((sum, count) => sum + count, 0);

    if (totalCount === 0) {
        // Reset all to 0%
        for (let i = 1; i <= 5; i++) {
            updateRatingBar(i, 0, 0);
        }
        return;
    }

    // Update each rating bar (from 5-star down to 1-star)
    for (let i = 5; i >= 1; i--) {
        const count = ratingCounts[i - 1];
        const percentage = Math.round((count / totalCount) * 100);
        updateRatingBar(i, count, percentage);
    }
}

function updateRatingBar(starNumber, count, percentage) {
    const bar = document.getElementById(`bar-${starNumber}`);
    const percentageText = document.getElementById(`percentage-${starNumber}`);

    if (bar) {
        bar.style.width = `${percentage}%`;
    }

    if (percentageText) {
        percentageText.textContent = `${percentage}%`;
    }
}

function displayReviews(ratings) {
    if (!reviewsContainer) return;

    allReviews = ratings;
    currentScrollPosition = 0;

    if (ratings.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="no-reviews-message">
                <i class="fas fa-star"></i>
                <h3>No Reviews Yet</h3>
                <p>Be the first to share your experience with K.K.M.A. Homestyler!</p>
                <a href="#rating" class="btn btn-primary">Write a Review</a>
            </div>
        `;
        updateReviewsSummary(0, 0);
        hideNavigation();
        return;
    }

    // Update summary
    const averageRating = calculateAverageRating(ratings);
    updateReviewsSummary(ratings.length, averageRating);

    // Sort and display reviews
    sortAndDisplayReviews();
}

function sortAndDisplayReviews() {
    const sortValue = sortReviewsSelect ? sortReviewsSelect.value : 'newest';
    const sortedReviews = sortReviews(allReviews, sortValue);

    // Generate all review cards HTML
    const reviewsHTML = sortedReviews.map(review => createReviewCard(review)).join('');
    reviewsContainer.innerHTML = reviewsHTML;

    // Reset scroll position
    currentScrollPosition = 0;
    if (reviewsContainer) {
        reviewsContainer.scrollLeft = 0;
    }

    // Update navigation
    updateNavigation(sortedReviews.length);
}

function updateNavigation(totalReviews) {
    if (totalReviews <= reviewsPerView) {
        hideNavigation();
    } else {
        showNavigation();
        updateScrollIndicator(totalReviews);
        updateNavigationButtons(totalReviews);
    }
}

function showNavigation() {
    if (reviewsNavigation) {
        reviewsNavigation.style.display = 'flex';
    }
    if (scrollIndicator) {
        scrollIndicator.style.display = 'block';
    }
}

function hideNavigation() {
    if (reviewsNavigation) {
        reviewsNavigation.style.display = 'none';
    }
    if (scrollIndicator) {
        scrollIndicator.style.display = 'none';
    }
}

function updateScrollIndicator(totalReviews) {
    const totalPages = Math.ceil(totalReviews / reviewsPerView);
    const currentPage = Math.floor(currentScrollPosition / reviewsPerView) + 1;

    if (scrollPosition) {
        scrollPosition.textContent = `${currentPage} / ${totalPages}`;
    }
}

function updateNavigationButtons(totalReviews) {
    const maxPosition = Math.max(0, totalReviews - reviewsPerView);

    if (scrollLeftBtn) {
        scrollLeftBtn.disabled = currentScrollPosition <= 0;
    }

    if (scrollRightBtn) {
        scrollRightBtn.disabled = currentScrollPosition >= maxPosition;
    }
}

function scrollReviews(direction) {
    const sortValue = sortReviewsSelect ? sortReviewsSelect.value : 'newest';
    const sortedReviews = sortReviews(allReviews, sortValue);
    const totalReviews = sortedReviews.length;
    const maxPosition = Math.max(0, totalReviews - reviewsPerView);

    if (direction === 'left') {
        currentScrollPosition = Math.max(0, currentScrollPosition - reviewsPerView);
    } else {
        currentScrollPosition = Math.min(maxPosition, currentScrollPosition + reviewsPerView);
    }

    // Scroll to position
    if (reviewsContainer) {
        const cardWidth = 350; // Width of each review card
        const gap = 24; // Gap between cards (1.5rem = 24px)
        const scrollAmount = currentScrollPosition * (cardWidth + gap);
        reviewsContainer.scrollLeft = scrollAmount;
    }

    // Update UI
    updateScrollIndicator(totalReviews);
    updateNavigationButtons(totalReviews);
}

function sortReviews(reviews, sortBy) {
    const sorted = [...reviews];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'highest':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'lowest':
            return sorted.sort((a, b) => a.rating - b.rating);
        default:
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

function calculateAverageRating(ratings) {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, review) => total + review.rating, 0);
    return sum / ratings.length;
}

function updateReviewsSummary(count, average) {
    if (!reviewsSummary) return;

    const reviewText = count === 1 ? 'Review' : 'Reviews';
    reviewsSummary.innerHTML = `
        <span class="reviews-count">${count} ${reviewText}</span>
        <span class="reviews-average">• Average: ${average.toFixed(1)}</span>
    `;
}

function handleScrollEvent() {
    if (!reviewsContainer) return;

    const sortValue = sortReviewsSelect ? sortReviewsSelect.value : 'newest';
    const sortedReviews = sortReviews(allReviews, sortValue);
    const totalReviews = sortedReviews.length;

    const cardWidth = 350;
    const gap = 24;
    const scrollPosition = reviewsContainer.scrollLeft;

    // Calculate current position based on scroll offset
    currentScrollPosition = Math.round(scrollPosition / (cardWidth + gap));

    // Update UI
    updateScrollIndicator(totalReviews);
    updateNavigationButtons(totalReviews);
}

function createReviewCard(review) {
    const date = new Date(review.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const starsHTML = generateStarRating(review.rating);
    const displayName = review.name.charAt(0).toUpperCase() + review.name.slice(1);
    const commentHTML = review.comment ? `<p class="review-comment">${review.comment}</p>` : '';

    return `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-name">${displayName}</div>
                    <div class="review-date">${formattedDate}</div>
                </div>
                <div class="review-rating">
                    ${starsHTML}
                </div>
            </div>
            ${commentHTML}
        </div>
    `;
}

function generateStarRating(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

// Initialize rating system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Show loading state for reviews
    showReviewsLoading();

    // Load reviews from API
    loadRatings();

    // Fix portfolio image loading issues
    fixPortfolioImages();
});

function showReviewsLoading() {
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = `
        <div class="reviews-loading">
            <div class="loading-spinner"></div>
            <p>Loading reviews...</p>
        </div>
    `;
}

function fixPortfolioImages() {
    const portfolioImages = document.querySelectorAll('.portfolio-image img');

    portfolioImages.forEach(img => {
        // Handle image loading errors
        img.addEventListener('error', function() {
            console.log('Portfolio image failed to load:', this.src);
            // Try to create a placeholder if the image fails to load
            if (!this.src.includes('placeholder')) {
                this.style.background = 'var(--light-gray)';
                this.style.display = 'flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';
                this.innerHTML = '<div style="text-align: center; color: var(--text-light);"><i class="fas fa-image" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Interior Design</p></div>';
            }
        });

        // Handle successful image loading
        img.addEventListener('load', function() {
            this.style.background = 'transparent';
        });

        // Check if image is already loaded or has errors
        if (img.complete && img.naturalHeight === 0) {
            // Image failed to load
            img.dispatchEvent(new Event('error'));
        }
    });
}