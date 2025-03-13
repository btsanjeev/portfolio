// JavaScript Fixes and Improvements

document.addEventListener('DOMContentLoaded', () => {
    // Fix for the skills section tabs
    initializeSkillsTabs();
    
    // Fix for the portfolio gallery
    initializePortfolioGallery();
    
    // Initialize the contact form
    initializeContactForm();
    
    // Initialize particle background
    initializeParticles();
});

// Initialize skills tabs with height adjustment
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

// Initialize portfolio gallery with responsive height
function initializePortfolioGallery() {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const portfolioGallery = document.querySelector('.portfolio-gallery');
    
    if (galleryWrapper && portfolioGallery) {
        // Adjust height for the gallery based on content
        function adjustGalleryHeight() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            if (galleryItems.length === 0) return;
            
            let totalHeight = 0;
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
            
            totalHeight = rowCount * (itemHeight + 20); // Adding gap
            
            // Set the height
            portfolioGallery.style.minHeight = `${totalHeight}px`;
        }
        
        // Initial adjustment
        adjustGalleryHeight();
        
        // Adjust on window resize
        window.addEventListener('resize', adjustGalleryHeight);
        
        // Add 3D effect with mouse movement
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
            document.querySelectorAll('.gallery-item').forEach(item => {
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
        
        // Animate the gallery items on hover
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const depth = parseFloat(item.getAttribute('data-depth') || 1);
            
            item.addEventListener('mouseenter', () => {
                // Keep track of the active item
                document.querySelectorAll('.gallery-item').forEach(i => {
                    if (i !== item) {
                        i.classList.add('dimmed');
                    }
                });
                
                gsap.to(item, {
                    scale: 1.05,
                    zIndex: 10,
                    boxShadow: '0 25px 50px rgba(110, 87, 255, 0.3)',
                    borderColor: 'rgba(110, 87, 255, 0.3)',
                    duration: 0.3
                });
            });
            
            item.addEventListener('mouseleave', () => {
                document.querySelectorAll('.gallery-item').forEach(i => {
                    i.classList.remove('dimmed');
                });
                
                gsap.to(item, {
                    scale: 1,
                    zIndex: 1,
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    duration: 0.3
                });
            });
            
            // Apply parallax effect if GSAP is available
            if (typeof gsap !== 'undefined') {
                gsap.ticker.add(() => {
                    if (isActive) {
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
                    }
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
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                alert('Please fill out all fields');
                return;
            }
            
            // Show success message (in a real scenario, you would send the data to a server)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<span>Message Sent!</span>';
            submitButton.disabled = true;
            
            // Reset form after a delay
            setTimeout(() => {
                contactForm.reset();
                submitButton.innerHTML = '<span>Send Message</span>';
                submitButton.disabled = false;
            }, 3000);
        });
    }
}

// Initialize particle background for the hero section
function initializeParticles() {
    const particles = document.querySelector('.hero-particles');
    
    if (particles && typeof gsap !== 'undefined') {
        // Create 50 particle elements
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size
            const size = Math.random() * 5 + 2;
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // Random opacity
            const opacity = Math.random() * 0.5 + 0.1;
            
            // Set styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.opacity = opacity;
            
            particles.appendChild(particle);
            
            // Animate with GSAP
            gsap.to(particle, {
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                duration: Math.random() * 20 + 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
}