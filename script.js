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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializePortfolio();
    initializeContactForm();
    initializeModal();
    initializeSuccessPopup();
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
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
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
    const project = projectDetails[projectId];
    if (!project) return;

    const imageUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`;

    modalBody.innerHTML = `
        <img src="${imageUrl}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul>
            ${project.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
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

        // Simulate form submission (replace with actual implementation)
        setTimeout(() => {
            // Reset form
            contactForm.reset();

            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showSuccessMessage();

            // In a real implementation, you would send the data to your server here
            console.log('Form submitted:', formDataObj);
        }, 2000);
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

// Add CSS for fade-in animation
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