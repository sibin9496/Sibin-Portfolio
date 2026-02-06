// ========== MAIN INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initializeAnimations();
    initializeNavigation();
    initializeCounters();
    initializeSkillBars();
    initializeTypingEffect();
    initializeBackToTop();
    initializeProjectCards();
    initializeTechTags();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeActiveNavLinks();
    initializeImageLoading();
});

// ========== ANIMATIONS ==========
function initializeAnimations() {
    // Initialize GSAP if available
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        setupScrollAnimations();
    }
}

function setupScrollAnimations() {
    // Animate elements on scroll
    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            start: 'top 80%',
            onEnter: () => element.classList.add('animated')
        });
    });
}

// ========== NAVIGATION ==========
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ========== COUNTERS ==========
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count')) || 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        let current = 0;
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            }
        };
        
        // Use ScrollTrigger if available, otherwise animate immediately
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                once: true,
                onEnter: updateCounter
            });
        } else {
            // Fallback: animate when element is in viewport
            if (isElementInViewport(counter)) {
                updateCounter();
            }
        }
    });
}

// ========== SKILL BARS ==========
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width') + '%';
        
        if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
            ScrollTrigger.create({
                trigger: bar,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(bar, {
                        width: width,
                        duration: 1.8,
                        ease: 'power3.out',
                        delay: 0.2
                    });
                }
            });
        } else {
            // Fallback
            if (isElementInViewport(bar)) {
                bar.style.width = width;
            }
        }
    });
}

// ========== TYPING EFFECT ==========
function initializeTypingEffect() {
    const typeElement = document.querySelector('.type-text');
    
    if (typeElement) {
        const texts = JSON.parse(typeElement.getAttribute('data-text') || '["Web Apps","APIs","Solutions","Experiences"]');
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isStopped = false;
        let typingSpeed = 100;
        let deletingSpeed = 50;
        let pauseTime = 2000;
        
        function type() {
            if (isStopped) return;
            
            const currentText = texts[index];
            
            if (isDeleting) {
                typeElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, pauseTime);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
            }
        }
        
        // Start typing after a delay
        setTimeout(type, 1000);
        
        // Pause typing when user interacts
        typeElement.addEventListener('mouseenter', () => {
            isStopped = true;
        });
        
        typeElement.addEventListener('mouseleave', () => {
            if (isStopped) {
                isStopped = false;
                type();
            }
        });
    }
}

// ========== BACK TO TOP ==========
function initializeBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== PROJECT CARDS ==========
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // 3D hover effect
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth > 768) { // Only on desktop
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 20;
                const rotateX = (centerY - y) / 20;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-15px)
                    scale(1.02)
                `;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
        
        // Touch device support
        card.addEventListener('touchstart', () => {
            card.classList.add('touched');
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => card.classList.remove('touched'), 300);
        });
    });
}

// ========== TECH TAGS ==========
function initializeTechTags() {
    const techTags = document.querySelectorAll('.tech-tag');
    
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', (e) => {
            const color = tag.getAttribute('data-color');
            const colors = {
                blue: '#4361ee',
                green: '#2ecc71',
                orange: '#e67e22',
                purple: '#9b59b6',
                yellow: '#f1c40f',
                pink: '#e84393',
                teal: '#1abc9c',
                red: '#e74c3c',
                indigo: '#5d69e8'
            };
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: ${colors[color] || '#4361ee'};
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 0;
            `;
            
            const size = Math.max(tag.offsetWidth, tag.offsetHeight);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.offsetX - size/2 + 'px';
            ripple.style.top = e.offsetY - size/2 + 'px';
            
            tag.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode === tag) {
                    tag.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add ripple animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ========== CONTACT FORM ==========
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('span').textContent;
            const originalIcon = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
            
            // Simulate API call (replace with actual API endpoint)
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showNotification('🎉 Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                showNotification('❌ Something went wrong. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.querySelector('span').textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }
        });
    }
}

// ========== NOTIFICATIONS ==========
function showNotification(message, type) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 16px 22px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode === document.body) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ========== SMOOTH SCROLLING ==========
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== ACTIVE NAV LINKS ==========
function initializeActiveNavLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========== IMAGE LOADING ==========
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading class
        img.classList.add('loading');
        
        // Handle loaded images
        if (img.complete) {
            imgLoaded(img);
        } else {
            img.addEventListener('load', () => imgLoaded(img));
            img.addEventListener('error', () => imgError(img));
        }
    });
    
    // Handle profile image specifically
    const profileImage = document.querySelector('.profile-photo');
    if (profileImage) {
        profileImage.addEventListener('error', function() {
            console.log('Profile image failed to load, using fallback...');
            this.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
        });
    }
}

function imgLoaded(img) {
    img.classList.remove('loading');
    img.classList.add('loaded');
    img.style.animation = 'fadeInUp 0.5s ease-out';
}

function imgError(img) {
    img.classList.remove('loading');
    img.classList.add('error');
    console.error('Image failed to load:', img.src);
}

// ========== UTILITY FUNCTIONS ==========
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========== WINDOW LOAD ==========
window.addEventListener('load', function() {
    // Ensure all animations start after page is fully loaded
    document.body.classList.add('loaded');
    
    // Force counters to start if they haven't already
    setTimeout(() => {
        if (typeof ScrollTrigger === 'undefined') {
            initializeCounters();
            initializeSkillBars();
        }
    }, 1000);
});

// ========== RESIZE HANDLER ==========
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Reinitialize anything that needs it on resize
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});