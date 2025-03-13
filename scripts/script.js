// Main JS for Tarun Banala's Portfolio - Optimized Version

document.addEventListener('DOMContentLoaded', () => {
    // Performance check - only run heavy animations on desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Loading animation
    initLoading();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize custom cursor (desktop only)
    if (!isMobile) {
        initCustomCursor();
    } else {
        // Hide cursors on mobile and use default
        const cursors = document.querySelectorAll('.cursor, .cursor-follower');
        cursors.forEach(cursor => {
            cursor.style.display = 'none';
        });
        document.body.style.cursor = 'auto';
    }
    
    // Initialize skill tabs once to avoid conflicts
    initializeSkillsTabs();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize GSAP animations if available (optimized for performance)
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations(isMobile);
    }
    
    // Initialize portfolio gallery (optimized for mobile)
    initializePortfolioGallery(isMobile);
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize particles (desktop only)
    if (!isMobile && document.querySelector('.hero-particles')) {
        initializeParticles();
    }
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add CSS variable to count cards for staggered animations
    const whyHireCards = document.querySelectorAll('.why-hire-card');
    whyHireCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
});

// Loading animation
function initLoading() {
    const body = document.body;
    body.classList.add('loading');
    
    setTimeout(() => {
        body.classList.remove('loading');
        body.classList.add('loaded');
        
        // Remove loader element
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
}

// Initialize custom cursor (desktop only)
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        // Throttle mousemove for better performance
        let lastTime = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < 10) return; // Only update every 10ms
            lastTime = now;
            
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);
        });
        
        // Change cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-tab, .project-card, .experience-card, .gallery-item, input, textarea');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
        
        document.body.style.cursor = 'none';
    }
}

// Initialize navigation with performance improvements
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Navbar scroll effect with throttling
    let lastScrollPosition = 0;
    let scrollTimeout;
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(() => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                lastScrollPosition = window.scrollY;
            });
        });
    }
    
    // Mobile navigation toggle
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileNavToggle.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            
            // Prevent scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }
}

// Initialize skills tabs
function initializeSkillsTabs() {
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillPanes = document.querySelectorAll('.skill-pane');
    
    if (skillTabs.length > 0 && skillPanes.length > 0) {
        // First, ensure the active pane is visible
        const activeTab = document.querySelector('.skill-tab.active');
        if (activeTab) {
            const activeTabId = activeTab.getAttribute('data-tab');
            const activePane = document.getElementById(`${activeTabId}-pane`);
            
            if (activePane) {
                skillPanes.forEach(pane => {
                    pane.style.display = 'none';
                    pane.classList.remove('active');
                });
                
                activePane.style.display = 'block';
                activePane.classList.add('active');
                
                // Set the height of the skills-content based on the active pane
                const skillsContent = document.querySelector('.skills-content');
                if (skillsContent) {
                    const paneHeight = activePane.offsetHeight;
                    skillsContent.style.minHeight = `${paneHeight + 20}px`;
                }
                
                // Animate skill bars
                animateSkillBars(activePane);
            }
        }
        
        // Add event listeners to tabs
        skillTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                skillTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to current tab
                tab.classList.add('active');
                
                // Hide all skill panes
                skillPanes.forEach(pane => {
                    pane.classList.remove('active');
                    pane.style.display = 'none';
                });
                
                // Show the corresponding pane
                const paneId = `${tab.getAttribute('data-tab')}-pane`;
                const activePane = document.getElementById(paneId);
                
                if (activePane) {
                    activePane.style.display = 'block';
                    setTimeout(() => {
                        activePane.classList.add('active');
                        
                        // Update the min-height of the container
                        const skillsContent = document.querySelector('.skills-content');
                        if (skillsContent) {
                            const paneHeight = activePane.offsetHeight;
                            skillsContent.style.minHeight = `${paneHeight + 20}px`;
                        }
                        
                        // Animate skill bars
                        animateSkillBars(activePane);
                    }, 50);
                }
            });
        });
    }
}

// Animate skill bars
function animateSkillBars(pane) {
    const skillBars = pane.querySelectorAll('.skill-progress-bar');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Initialize scroll animations with performance optimization
function initScrollAnimations() {
    // Helper function to check if element is in viewport with throttling
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Sections to animate
    const animatedSections = document.querySelectorAll('.about, .skills, .experience, .projects, .why-hire-me, .contact, .portfolio-gallery-section');
    const experienceCards = document.querySelectorAll('.experience-card');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Throttled scroll handler
    let scrollTimeout;
    
    function handleScroll() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            // Animate sections
            animatedSections.forEach(section => {
                if (isInViewport(section)) {
                    section.classList.add('animated');
                }
            });
            
            // Animate experience cards
            experienceCards.forEach((card, index) => {
                if (isInViewport(card)) {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                }
            });
            
            // Animate project cards
            projectCards.forEach((card, index) => {
                if (isInViewport(card)) {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                }
            });
        });
    }
    
    // Run once on page load
    setTimeout(handleScroll, 500);
    
    // Add optimized scroll listener
    window.addEventListener('scroll', handleScroll);
}

// Initialize GSAP animations with performance consideration
function initGSAPAnimations(isMobile) {
    // Only run complex animations on desktop
    const complexAnimations = !isMobile;
    
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.from('.hero-tag', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8,
        delay: 0.2
    });
    
    gsap.from('.hero-title', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8,
        delay: 0.3
    });
    
    gsap.from('.hero-description', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8,
        delay: 0.4
    });
    
    gsap.from('.hero-about', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8,
        delay: 0.5
    });
    
    gsap.from('.cta-buttons', { 
        opacity: 0, 
        y: 30, 
        duration: 0.8,
        delay: 0.6
    });
    
    gsap.from('.hero-image-container', { 
        opacity: 0, 
        duration: 0.8,
        delay: 0.7
    });
    
    gsap.from('.scroll-indicator', { 
        opacity: 0, 
        y: -20, 
        duration: 0.8,
        delay: 0.8
    });
    
    // Scrolling animations - simpler version with fewer animations for mobile
    gsap.utils.toArray('.section-title-container').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });
    
    if (complexAnimations) {
        // About section animations
        gsap.from('.about-text', {
            opacity: 0,
            x: -30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        
        gsap.from('.about-image', {
            opacity: 0,
            x: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    
        // Gallery section animations - simplified for performance
        gsap.from('.gallery-item', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.portfolio-gallery',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    
        // Parallax effect on circles - reduced for better performance
        const circles = document.querySelectorAll('.hero-circle, .about-circle, .skills-circle, .projects-circle, .why-hire-circle, .contact-circle, .experience-circle, .footer-circle, .gallery-circle');
        
        circles.forEach(circle => {
            gsap.to(circle, {
                y: Math.random() * 60 - 30,
                x: Math.random() * 60 - 30,
                duration: Math.random() * 10 + 10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }
}

// Initialize portfolio gallery with optimized performance
function initializePortfolioGallery(isMobile) {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const portfolioGallery = document.querySelector('.portfolio-gallery');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!galleryWrapper || !portfolioGallery || galleryItems.length === 0) return;
    
    // Adjust gallery height based on content and device
    function adjustGalleryHeight() {
        let itemsPerRow = 3;
        
        // Calculate items per row based on viewport width
        if (window.innerWidth < 768) {
            itemsPerRow = 1;
        } else if (window.innerWidth < 992) {
            itemsPerRow = 2;
        }
        
        // Calculate total height based on items and rows
        const rowCount = Math.ceil(galleryItems.length / itemsPerRow);
        const itemHeight = 450; // Same as in CSS
        
        const totalHeight = rowCount * (itemHeight + 20); // Adding gap
        
        // Set the height
        portfolioGallery.style.minHeight = `${totalHeight}px`;
    }
    
    // Initial adjustment
    adjustGalleryHeight();
    
    // Adjust on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustGalleryHeight, 250);
    });
    
    // Add hover effects for gallery items
    galleryItems.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            // Dim other items
            galleryItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.add('dimmed');
                }
            });
            
            if (!isMobile && typeof gsap !== 'undefined') {
                gsap.to(item, {
                    scale: 1.05,
                    zIndex: 10,
                    boxShadow: '0 25px 50px rgba(110, 87, 255, 0.3)',
                    borderColor: 'rgba(110, 87, 255, 0.3)',
                    duration: 0.3
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            // Restore all items
            galleryItems.forEach(otherItem => {
                otherItem.classList.remove('dimmed');
            });
            
            if (!isMobile && typeof gsap !== 'undefined') {
                gsap.to(item, {
                    scale: 1,
                    zIndex: 1,
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    duration: 0.3
                });
            }
        });
    });
    
    // Only add complex 3D effect on desktop
    if (!isMobile && typeof gsap !== 'undefined') {
        let mouseX = 0;
        let mouseY = 0;
        let isActive = false;
        
        portfolioGallery.addEventListener('mousemove', (e) => {
            const rect = portfolioGallery.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
            isActive = true;
        });
        
        portfolioGallery.addEventListener('mouseleave', () => {
            isActive = false;
            galleryItems.forEach(item => {
                gsap.to(item, {
                    rotateY: 0,
                    rotateX: 0,
                    y: 0,
                    x: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
        
        // Apply 3D effect with less frequent updates
        let lastUpdate = 0;
        gsap.ticker.add((time) => {
            if (isActive && time - lastUpdate > 0.05) { // Limit updates for performance
                lastUpdate = time;
                galleryItems.forEach((item) => {
                    const depth = parseFloat(item.getAttribute('data-depth') || 1);
                    const rotationY = mouseX * 0.05 * depth;
                    const rotationX = -mouseY * 0.05 * depth;
                    const y = mouseY * 0.1 * depth;
                    const x = mouseX * 0.1 * depth;
                    
                    gsap.to(item, {
                        rotateY: rotationY,
                        rotateX: rotationX,
                        y: y,
                        x: x,
                        duration: 1,
                        ease: 'power2.out'
                    });
                });
            }
        });
    }
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form
            if (!name || !email || !message) {
                alert('Please fill out all fields');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Show success message (in a real scenario, you would send the data to a server)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<span>Message Sent!</span>';
            submitButton.disabled = true;
            
            // Reset form after a delay
            setTimeout(() => {
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
        });
    }
}

// Initialize particles for hero section (desktop only)
function initializeParticles() {
    const particles = document.querySelector('.hero-particles');
    
    if (particles && typeof gsap !== 'undefined') {
        // Create fewer particles for better performance
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size
            const size = Math.random() * 4 + 1;
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random opacity
            const opacity = Math.random() * 0.3 + 0.05;
            
            // Set styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.opacity = opacity;
            
            particles.appendChild(particle);
            
            // Animate with GSAP - simplified for performance
            gsap.to(particle, {
                x: Math.random() * 80 - 40,
                y: Math.random() * 80 - 40,
                duration: Math.random() * 15 + 15,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
}

// Initialize smooth scrolling with performance optimizations
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Using native scrollIntoView for better performance
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Alternatively use the following for older browsers
                /*
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                */
            }
        });
    });
}
