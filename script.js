// ============================================
// INITIALIZATION AND SETUP
// ============================================

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Avoid animations for users who prefer reduced motion
if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// ============================================
// CUSTOM CURSOR GLOW
// ============================================

const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0;
let mouseY = 0;

if (cursorGlow && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorGlow.style.left = (mouseX - 15) + 'px';
        cursorGlow.style.top = (mouseY - 15) + 'px';
    });
}

// ============================================
// NAVIGATION STICKY AND ACTIVE STATE
// ============================================

const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active navigation link
    updateActiveNavLink();
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when link clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// 3D BUTTON EFFECTS
// ============================================

const premiumButtons = document.querySelectorAll('.premium-btn');

premiumButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.classList.add('active-3d');
    });
    
    button.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        button.style.setProperty('--rotateX', rotateX + 'deg');
        button.style.setProperty('--rotateY', rotateY + 'deg');
    });
    
    button.addEventListener('mouseleave', () => {
        button.classList.remove('active-3d');
        button.style.setProperty('--rotateX', '0deg');
        button.style.setProperty('--rotateY', '0deg');
    });
});

// ============================================
// 3D CARD EFFECTS WITH MOUSE TRACKING
// ============================================

const cards = document.querySelectorAll('.skill-card, .about-card, .project-card, .education-card, .certificate-card, .timeline-card, .contact-info-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('active-tilt');
    });
    
    card.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(10px)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.classList.remove('active-tilt');
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// ============================================
// PARALLAX AND 3D HERO EFFECT
// ============================================

const heroSection = document.querySelector('.hero-section');
const parallaxElements = document.querySelectorAll('.parallax-element');

if (heroSection && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable on mobile
        
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        
        parallaxElements.forEach(element => {
            const depth = element.dataset.depth || 1;
            element.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        });
    });
}

// ============================================
// SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px) rotateX(10deg)';
    section.style.transition = 'opacity 0.8s cubic-bezier(0.23, 1, 0.320, 1), transform 0.8s cubic-bezier(0.23, 1, 0.320, 1)';
    
    if (section.id === 'home') {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0) rotateX(0)';
    } else {
        observer.observe(section);
    }
});

// Stagger animations for child elements
const staggerElements = document.querySelectorAll('[class*="stagger-"]');
staggerElements.forEach(element => {
    element.style.opacity = '0';
    element.style.animation = `fadeUpIn 0.8s cubic-bezier(0.23, 1, 0.320, 1) forwards`;
    
    const match = element.className.match(/stagger-(\d)/);
    if (match) {
        const delay = parseInt(match[1]) * 0.1;
        element.style.animationDelay = delay + 's';
    }
});

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createScrollProgressBar();

// ============================================
// ANIMATED BACKGROUND WITH CANVAS
// ============================================

const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle system
class Particle {
    constructor(x, y, vx, vy, color, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = Math.random() * 0.01 + 0.002;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.vy += 0.1; // Gravity
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Floating nodes
class FloatingNode {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.radius = radius;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.angle = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.angle += 0.01;
        this.x = this.originalX + Math.cos(this.angle) * 20;
        this.y = this.originalY + Math.sin(this.angle) * 20;
        
        // Bounce at edges
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.vx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.vy *= -1;
    }
    
    draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}

// Initialize particles and nodes
const particles = [];
const nodes = [];
const colors = [
    'rgba(16, 185, 129, 0.6)',   // emerald
    'rgba(147, 51, 234, 0.6)',   // purple
    'rgba(217, 70, 239, 0.6)',   // fuchsia
    'rgba(217, 119, 6, 0.6)',    // amber
];

// Create initial nodes
for (let i = 0; i < 8; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    nodes.push(new FloatingNode(x, y, radius, color));
}

// Draw connections between nearby nodes
function drawConnections() {
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateBackground() {
    // Clear canvas with semi-transparent background for motion blur
    ctx.fillStyle = 'rgba(17, 24, 39, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw nodes
    nodes.forEach(node => {
        node.update();
        node.draw();
    });
    
    // Draw connections
    drawConnections();
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    
    // Occasionally spawn new particles
    if (Math.random() < 0.3) {
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push(new Particle(node.x, node.y, vx, vy, color, 1));
        }
    }
    
    requestAnimationFrame(animateBackground);
}

// Start animation only on desktop
if (!prefersReducedMotion && window.innerWidth > 768) {
    animateBackground();
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !message) {
            showFormStatus('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('Please enter a valid email address', 'error');
            return;
        }
        
        // Create mailto link
        const subject = `New Portfolio Inquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:shantanuaptikar1202@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Show success message and reset form
        showFormStatus('Thank you for your message! Opening email client...', 'success');
        contactForm.reset();
        
        // Redirect to mailto
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 500);
    });
}

function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = type;
    formStatus.classList.remove('hidden');
    
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
}

// ============================================
// VIDEO OPTIMIZATION
// ============================================

const heroVideo = document.querySelector('.hero-video-container video');

if (heroVideo) {
    // Pause video when page is not visible to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            heroVideo.pause();
        } else {
            heroVideo.play();
        }
    });
    
    // Handle video loading
    heroVideo.addEventListener('error', () => {
        console.warn('Video could not be loaded. Please ensure assets/avatar-video.mp4 exists.');
    });
}

// ============================================
// SMOOTH SCROLL OFFSET FOR STICKY NAVBAR
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Throttle scroll events
let ticking = false;
function throttle(callback) {
    if (!ticking) {
        callback();
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
        });
    }
}

// Lazy load images if any
document.querySelectorAll('img[data-src]').forEach(img => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                entry.target.removeAttribute('data-src');
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(img);
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Ensure keyboard navigation works properly
document.querySelectorAll('.premium-btn, a, input, textarea, button').forEach(element => {
    element.addEventListener('focus', (e) => {
        e.target.style.outline = '2px solid #10b981';
        e.target.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', (e) => {
        e.target.style.outline = 'none';
    });
});

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('🚀 Portfolio website loaded successfully!');
console.log('✨ All interactive features are active');
