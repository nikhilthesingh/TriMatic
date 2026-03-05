/* ========================================
   TRIMATIC Agency - Main JavaScript
   ======================================== */

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

/* ========================================
   Lenis Smooth Scroll
   ======================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
    touchMultiplier: 2,
});
window.lenis = lenis; // expose for preloader & lightbox scroll-lock

// Single Lenis driver via GSAP ticker (no duplicate RAF loop)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

/* ========================================
   Initialization
   ======================================== */

/* ============================================================
   ðŸŽ¬ HERO v3 â€” GSAP Cinematic Reveal
   ============================================================ */
function initHeroNew() {
    // Guard: GSAP must be loaded
    if (typeof gsap === 'undefined') return;

    const words = document.querySelectorAll('.h-title__word');
    const tag = document.getElementById('hTag');
    const bottom = document.getElementById('hBottom');
    const scroll = document.getElementById('hScroll');
    const marquee = document.querySelector('.h-marquee__track');

    if (!words.length) return;

    // Timeline fires after preloader (preloader takes ~3s, we add a small buffer)
    const tl = gsap.timeline({ delay: 3.2 });

    // 1. Eyebrow tag fades in
    if (tag) {
        tl.to(tag, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
        }, 0);
    }

    // 2. Each headline word slides up from clip (staggered)
    tl.to(words, {
        y: '0%',
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12
    }, 0.15);

    // 3. Bottom row (copy + stats + CTAs) slides up
    if (bottom) {
        tl.to(bottom, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out'
        }, 0.65);
    }

    // 4. Scroll indicator fades in
    if (scroll) {
        tl.to(scroll, {
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out'
        }, 1.0);
    }

    // Marquee: pause on hover
    if (marquee) {
        const strip = marquee.closest('.h-marquee');
        if (strip) {
            strip.addEventListener('mouseenter', () => {
                marquee.style.animationPlayState = 'paused';
            });
            strip.addEventListener('mouseleave', () => {
                marquee.style.animationPlayState = 'running';
            });
        }
    }

    // Mouse-tracking spotlight â€” paused off-screen, skipped on touch
    const hero = document.getElementById('hero');
    if (hero && window.matchMedia('(hover: hover)').matches) {
        let mx = 50, my = 40, cx = 50, cy = 40, meshRaf;
        let heroVisible = true;
        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            mx = ((e.clientX - r.left) / r.width) * 100;
            my = ((e.clientY - r.top) / r.height) * 100;
        });
        const mesh = hero.querySelector('.h-bg__mesh');
        if (mesh) {
            function meshLoop() {
                if (!heroVisible) return;
                cx += (mx - cx) * 0.05;
                cy += (my - cy) * 0.05;
                mesh.style.background = `
                    radial-gradient(ellipse 55% 45% at ${cx}% ${cy}%, rgba(254,110,0,0.16) 0%, transparent 60%),
                    radial-gradient(ellipse 50% 60% at ${100 - cx}% ${100 - cy}%, rgba(67,97,238,0.10) 0%, transparent 60%),
                    #080808`;
                meshRaf = requestAnimationFrame(meshLoop);
            }
            // Pause when hero leaves viewport
            const heroObs = new IntersectionObserver(entries => {
                heroVisible = entries[0].isIntersecting;
                if (heroVisible) meshLoop();
                else cancelAnimationFrame(meshRaf);
            }, { threshold: 0 });
            heroObs.observe(hero);
            meshLoop();
        }
    }
}

window.addEventListener('load', () => {
    // CRITICAL â€” above-the-fold (init immediately)
    initPreloader();
    initCustomCursor();
    initHeroNew();
    initNavigation();
    initGlassmorphNavbar();
    initSmoothScrollLinks();

    // DEFERRED â€” below-fold sections (idle or after 2s fallback)
    const deferInit = () => {
        initBeyondLogic();
        initMagneticButtons();
        initTypewriter();
        initAboutTextReveal();
        initRippleEffect();
        initScrollReveal();
        initParallaxSections();
        initImageLazyReveal();
        initServicesSection();
        initGlobeCanvas();
        initWorkShowcase();
        initPricingSection();
        initContactAnimations();
        initFooterSpotlight();
        initFlowingServices();
        initCircularGallery();
        initMagicBentoSpotlight();
        initTargetCursor();
        initPauseOffscreenAnimations();
    };
    if ('requestIdleCallback' in window) {
        requestIdleCallback(deferInit, { timeout: 2000 });
    } else {
        setTimeout(deferInit, 100);
    }
});



/* ========================================
   Accessibility: Live Announcements
   ======================================== */
function announce(message) {
    const live = document.getElementById('a11y-live');
    if (!live) return;
    // Clear then set to ensure repeated messages announce
    live.textContent = '';
    setTimeout(() => { live.textContent = message; }, 50);
}

/* ========================================
   Preloader Animation
   ======================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('counter');
    const titles = document.querySelectorAll('.preloader-title');
    const line = document.querySelector('.preloader-line');
    const corners = document.querySelectorAll('.corner-info, .corner-counter');
    const main = document.getElementById('main');

    // Lock scroll during preloader
    if (window.lenis) {
        window.lenis.stop();
    }

    const tl = gsap.timeline({
        defaults: { ease: 'power4.out' }
    });

    // Counter animation with smoother easing
    let count = { value: 0 };
    gsap.to(count, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
            counter.textContent = String(Math.floor(count.value)).padStart(3, '0');
        }
    });

    // Main preloader animation - smoother timing
    tl
        // Show corners
        .to(corners, {
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out'
        })
        // Animate titles in with spring-like effect
        .to(titles, {
            y: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: 'power4.out'
        }, 0.4)
        // Animate line with elastic effect
        .to(line, {
            scaleX: 1,
            duration: 1,
            ease: 'power3.inOut'
        }, 0.6)
        // Hold longer
        .to({}, { duration: 1.2 })
        // Exit animation - faster and smoother
        .to(titles, {
            y: -120,
            opacity: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power4.in'
        })
        .to(line, {
            scaleX: 0,
            duration: 0.5,
            ease: 'power4.in'
        }, '-=0.5')
        .to(corners, {
            opacity: 0,
            duration: 0.4,
            ease: 'power3.in'
        }, '-=0.4')
        // Split preloader with smoother curve
        .to('.preloader-bg-top', {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut'
        })
        .to('.preloader-bg-bottom', {
            yPercent: 100,
            duration: 1,
            ease: 'power4.inOut'
        }, '<')
        // Show main content
        .add(() => {
            preloader.classList.add('hidden');
            main.classList.add('visible');
            // Re-enable scroll
            if (window.lenis) {
                window.lenis.start();
            }
            if (typeof initHeroReveal === 'function') {
                initHeroReveal();
            } else if (typeof animateHero === 'function') {
                animateHero();
            }
        }, '-=0.5');
}

/* ========================================
   Custom Cursor
   ======================================== */
function initCustomCursor() {
    // Skip entirely on touch devices â€” no cursor needed
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = document.getElementById('cursor');
    const links = document.querySelectorAll('a, button, .work-item, .service-item, .perspective-item, .bento-item, .filter-btn, .lab-tab');

    if (!cursor) return;

    let cursorX = 0, cursorY = 0;
    let mouseX = 0, mouseY = 0;

    // Smooth cursor movement
    gsap.ticker.add(() => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        gsap.set(cursor, {
            x: cursorX,
            y: cursorY
        });
    });

    // Mouse Movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Context-aware hover effects
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered');

            // Add context classes
            if (link.classList.contains('cta-button') || link.classList.contains('cta-secondary')) {
                cursor.classList.add('cursor-cta');
            } else if (link.classList.contains('bento-item') || link.classList.contains('work-item')) {
                cursor.classList.add('cursor-view');
            } else if (link.classList.contains('filter-btn') || link.classList.contains('lab-tab')) {
                cursor.classList.add('cursor-click');
            }
        });

        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered');
            cursor.classList.remove('cursor-cta', 'cursor-view', 'cursor-click');
        });
    });

    // Magnetic effect moved to initMagneticButtons() to avoid duplicate listeners
}

/* ========================================
   Navigation
   ======================================== */
/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu') || document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let navOpen = false;

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.addEventListener('click', () => {
            navOpen = !navOpen;
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(navOpen));
            navMenu.setAttribute('aria-hidden', String(!navOpen));

            // Focus management & animations
            if (navOpen) {
                if (!reducedMotion) {
                    // Slide-down drawer: links stagger in from slight left
                    gsap.fromTo(navLinks,
                        { x: -12, opacity: 0 },
                        { x: 0, opacity: 1, stagger: 0.06, duration: 0.35, ease: 'power3.out', delay: 0.15 }
                    );
                } else {
                    navLinks.forEach(link => {
                        link.style.opacity = '1';
                        link.style.transform = 'none';
                    });
                }

                // move focus to first focusable inside nav for keyboard users
                setTimeout(() => {
                    const focusable = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                    if (focusable && focusable.length) focusable[0].focus();
                }, 220);

                window.__prevFocus = document.activeElement;
                document.addEventListener('keydown', trapFocusHandler);
                announce('Navigation opened');
            } else {
                document.removeEventListener('keydown', trapFocusHandler);
                if (window.__prevFocus) window.__prevFocus.focus();
                announce('Navigation closed');
            }
        });
    }

    // Close menu when a link is clicked (and restore aria)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                navOpen = false;
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            navOpen = false;
            navToggle.focus();
        }
    });

    // Focus trap implementation
    function trapFocusHandler(e) {
        if (e.key !== 'Tab') return;

        const focusable = Array.from(navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'))
            .filter(el => !el.hasAttribute('disabled'));
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    // Click outside to close (mobile)
    document.addEventListener('click', (e) => {
        if (!navMenu || !navToggle) return;
        if (!navMenu.classList.contains('active')) return;
        if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        navOpen = false;
    });

    // Sticky Nav Logic - Always Visible, clear any stale transform
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        gsap.set(navbar, { clearProps: 'y,transform' });
        navbar.style.transform = '';
    }
}

// Announce nav open/close inside initNavigation by calling announce()


function initHeroReveal() {
    const tl = gsap.timeline({
        delay: 0.3,
        defaults: { ease: 'power4.out' }
    });

    tl
        .to('.hero-label', {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
        })
        .to('.title-word', {
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power4.out'
        }, '-=0.6')
        .to('.hero-description', {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
        }, '-=0.8')
        .to('.hero-sub-description', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.5')
        .to('.hero-stats', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1
        }, '-=0.6')
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'back.out(1.7)'
        }, '-=0.7')
        .to('.hero-scroll', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.5');

    // Animate stats with counter
    document.querySelectorAll('.stat-value').forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        if (number) {
            let counter = { val: 0 };
            gsap.to(counter, {
                val: number,
                duration: 2,
                ease: 'power2.out',
                onUpdate: () => {
                    stat.textContent = text.replace(number, Math.floor(counter.val));
                },
                scrollTrigger: {
                    trigger: '.hero-stats',
                    start: 'top 80%'
                }
            });
        }
    });
}


/* ========================================
   Beyond Logic Animation
   ======================================== */
function initBeyondLogic() {
    const section = document.querySelector('.beyond-logic');
    const title = document.querySelector('.beyond-title');
    const particlesContainer = document.querySelector('.beyond-particles');

    if (!section) return;

    // Create Particles
    const particleCount = 20;
    const particleTweens = [];
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random placement
        gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });

        particlesContainer.appendChild(particle);

        // Animate â€” store tween to pause/play on visibility
        const tw = gsap.to(particle, {
            y: '+=100',
            x: '+=' + (Math.random() * 50 - 25),
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        particleTweens.push(tw);
    }

    // Pause particle tweens when section is off-screen
    ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => particleTweens.forEach(t => t.play()),
        onLeave: () => particleTweens.forEach(t => t.pause()),
        onEnterBack: () => particleTweens.forEach(t => t.play()),
        onLeaveBack: () => particleTweens.forEach(t => t.pause()),
    });

    // Title 3D Effect on Mouse Move (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        section.addEventListener('mousemove', (e) => {
            if (!title) return;

            const xPos = (e.clientX / window.innerWidth - 0.5) * 40;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 40;

            gsap.to(title, {
                rotationY: xPos,
                rotationX: -yPos,
                duration: 1,
                ease: 'power2.out'
            });
        });

        // Reset on leave
        section.addEventListener('mouseleave', () => {
            if (!title) return;
            gsap.to(title, {
                rotationY: 0,
                rotationX: 0,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }
}


/* ========================================
   Magnetic Buttons
   ======================================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}


/* ========================================
   âœï¸ TYPEWRITER EFFECT
   ======================================== */
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Hyper-realistic edits.',
        'Cinematic color grading.',
        'Viral content engineered for impact.',
        'Phonk edits that hit different.',
        'Motion graphics that captivate.',
        'Thumbnails that get clicks.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isPaused) {
            isPaused = false;
            isDeleting = true;
            setTimeout(type, 50);
            return;
        }

        if (!isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                isPaused = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 60 + Math.random() * 40);
        } else {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(type, 300);
                return;
            }
            setTimeout(type, 30);
        }
    }

    // Start after hero animation
    setTimeout(type, 4000);
}

/* ========================================
   ðŸ”® GLASSMORPHISM NAVBAR ON SCROLL
   ======================================== */
function initGlassmorphNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Ensure no lingering GSAP y-transform (from old hide-on-scroll code)
    gsap.set(navbar, { clearProps: 'y,transform' });
    navbar.style.transform = '';

    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY || window.pageYOffset;

        // Only toggle glass depth â€” never hide
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

/* ========================================
   ðŸ“– ABOUT TEXT WORD-BY-WORD REVEAL
   ======================================== */
function initAboutTextReveal() {
    const aboutText = document.getElementById('about-text');
    if (!aboutText) return;

    // Split text into word spans
    const rawWords = aboutText.textContent.trim().split(/\s+/);
    aboutText.innerHTML = rawWords
        .map(w => `<span class="word">${w}</span>`)
        .join(' ');

    const words = aboutText.querySelectorAll('.word');

    // Set every word to dim grey immediately â€” GSAP owns all state from here
    gsap.set(words, { color: 'rgba(255,255,255,0.14)' });

    // Build a sequenced timeline: each word illuminates in order.
    // With scrub, GSAP interpolates the playhead smoothly â€” no CSS transitions
    // needed and no onUpdate classList thrash.
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: aboutText,
            start: 'top 78%',
            end: 'bottom 28%',
            scrub: 1.2,   // lag in seconds â€” keeps motion smooth on fast scrolls
        }
    });

    words.forEach((word, i) => {
        tl.to(
            word,
            { color: '#ffffff', ease: 'power1.inOut', duration: 0.35 },
            i * 0.12  // stagger each word 0.12 timeline-units apart
        );
    });
}


/* ========================================
   ðŸ”— SMOOTH SCROLL FOR NAV LINKS
   ======================================== */
function initSmoothScrollLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '#main') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(target, { offset: -80, duration: 1.2 });
            } else {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ========================================
   ðŸ’§ RIPPLE CLICK EFFECT
   ======================================== */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button, .submit-btn, .view-more-btn, .filter-btn, .play-btn');

    buttons.forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* ========================================
   ðŸ‘ï¸ SCROLL REVEAL ANIMATIONS
   ======================================== */
function initScrollReveal() {
    // Reveal section headers with stagger
    const sectionHeaders = document.querySelectorAll('.section-header, .showcase-lab-header, .showreel-header, .about-header');

    sectionHeaders.forEach(header => {
        gsap.from(header, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                once: true
            }
        });
    });

    // Reveal trusted-by section
    gsap.from('.trusted-label', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.trusted-by',
            start: 'top 85%'
        }
    });

    gsap.from('.trusted-marquee', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.trusted-by',
            start: 'top 80%'
        }
    });
}

/* ========================================
   ðŸŒŠ PARALLAX SECTIONS
   ======================================== */
function initParallaxSections() {
    // Add subtle parallax to decorative elements
    const orbs = document.querySelectorAll('.floating-orb');

    orbs.forEach(orb => {
        gsap.to(orb, {
            y: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: orb.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    // Parallax for section titles
    const sectionTitles = document.querySelectorAll('.section-title, .showcase-title, .showcase-lab-title');

    sectionTitles.forEach(title => {
        gsap.to(title, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: title,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

/* ========================================
   ðŸ–¼ï¸ IMAGE LAZY REVEAL
   ======================================== */
function initImageLazyReveal() {
    const images = document.querySelectorAll('.bento-media img, .layer-card img, .spotlight-tile img');

    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Also mark videos
    const videos = document.querySelectorAll('.bento-media video, .spotlight-tile video, .reel-media video');
    videos.forEach(video => {
        video.classList.add('loaded');
    });
}



/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SERVICES SECTION â€” Tab Switching + Scroll Reveals
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initServicesSection() {
    // â”€â”€ Title reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const titleWords = document.querySelectorAll('.sv-title-word');
    const subtitle   = document.querySelector('.sv-subtitle');
    if (titleWords.length) {
        gsap.to(titleWords, {
            y: '0%',
            duration: 1.1,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: '.services-section', start: 'top 75%', once: true }
        });
    }
    if (subtitle) {
        gsap.to(subtitle, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4,
            scrollTrigger: { trigger: '.services-section', start: 'top 75%', once: true }
        });
    }

    // â”€â”€ Tab switching â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const tabs   = document.querySelectorAll('.sv-tab');
    const panels = document.querySelectorAll('.sv-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target      = tab.getAttribute('data-tab');
            const targetPanel = document.getElementById('panel-' + target);

            tabs.forEach(t  => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            panels.forEach(p => p.classList.remove('active'));
            if (targetPanel) {
                targetPanel.classList.add('active');
                if (window.innerWidth > 600) {
                    // Desktop: hide first (since CSS no longer does it), then stagger-reveal
                    const cards = targetPanel.querySelectorAll('.svc-card');
                    gsap.set(cards, { opacity: 0, y: 30 });
                    gsap.to(cards, {
                        opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out'
                    });
                } else {
                    // Mobile: reset carousel to card 0 on tab switch
                    const carr = targetPanel._carousel;
                    if (carr) carr.goTo(0, false);
                }
            }
        });
    });

    // â”€â”€ Initial card reveal (desktop) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (window.innerWidth > 600) {
        const activeCards = Array.from(
            document.querySelectorAll('.sv-panel.active .svc-card')
        );
        if (activeCards.length) {
            // Hide cards immediately via GSAP (not CSS) so the
            // safety-net below can override when already in view
            gsap.set(activeCards, { opacity: 0, y: 40 });

            const grid = document.querySelector('.sv-panel.active');
            const gridRect = grid ? grid.getBoundingClientRect() : null;
            const alreadyVisible = gridRect && gridRect.top < window.innerHeight * 0.88;

            if (alreadyVisible) {
                // Section is already on-screen (e.g. page refreshed mid-scroll)
                // â†’ play the reveal immediately, no ScrollTrigger needed
                gsap.to(activeCards, {
                    opacity: 1, y: 0,
                    duration: 0.7, stagger: 0.08, ease: 'power3.out'
                });
            } else {
                // Normal case: animate when section scrolls into view.
                // Using inline scrollTrigger on the tween (not ScrollTrigger.create)
                // is more reliable â€” GSAP handles boundary edge-cases internally.
                gsap.to(activeCards, {
                    opacity: 1, y: 0,
                    duration: 0.7, stagger: 0.08, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.sv-panel.active',
                        start: 'top 88%',
                        once: true,
                        invalidateOnRefresh: true
                    }
                });
            }
        }
    }

    // â”€â”€ Mobile carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    function buildCarousel(panel) {
        const wrap   = panel.querySelector('.sv-carousel-wrap');
        const track  = panel.querySelector('.sv-grid');
        const dotsEl = panel.querySelector('.sv-dots');
        const prevBtn = panel.querySelector('.sv-carr-prev');
        const nextBtn = panel.querySelector('.sv-carr-next');
        const cards  = Array.from(panel.querySelectorAll('.svc-card'));
        if (!wrap || !track || !cards.length) return;

        let current = 0;
        const total = cards.length;

        // Build dots
        dotsEl.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'sv-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to service ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
        });

        function getCardWidth() {
            return cards[0] ? cards[0].getBoundingClientRect().width : 0;
        }

        function updateButtons() {
            if (prevBtn) prevBtn.disabled = current === 0;
            if (nextBtn) nextBtn.disabled = current === total - 1;
        }

        function goTo(index, animate = true) {
            current = Math.max(0, Math.min(total - 1, index));
            const cardW = getCardWidth();
            const offset = -(current * cardW);
            if (animate) {
                gsap.to(track, { x: offset, duration: 0.5, ease: 'power3.inOut' });
            } else {
                gsap.set(track, { x: offset });
            }
            dotsEl.querySelectorAll('.sv-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
            updateButtons();
        }

        prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

        // Touch / swipe
        let touchStartX = 0;
        let touchStartY = 0;
        let isDragging  = false;

        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            if (!isDragging) return;
            isDragging = false;
            const dx = touchStartX - e.changedTouches[0].clientX;
            const dy = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                dx > 0 ? goTo(current + 1) : goTo(current - 1);
            }
        }, { passive: true });

        // Reset position on window resize (desktop / rotate)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 600) {
                gsap.set(track, { x: 0 });
            } else {
                goTo(current, false);
            }
        });

        // Peek hint animation on first entry into viewport
        ScrollTrigger.create({
            trigger: wrap,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                if (window.innerWidth > 600) return;
                wrap.classList.add('sv-hint');
                setTimeout(() => wrap.classList.remove('sv-hint'), 900);
            }
        });

        updateButtons();
        panel._carousel = { goTo };
    }

    // Only initialise carousels if on mobile; re-init on resize if needed
    function initCarousels() {
        if (window.innerWidth <= 600) {
            panels.forEach(panel => {
                if (!panel._carousel) buildCarousel(panel);
            });
        }
    }

    initCarousels();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initCarousels, 200);
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   3D GLOBE CANVAS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initGlobeCanvas() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const wrap = document.getElementById('globe-wrap');
    if (!wrap) return;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const w   = wrap.clientWidth;
        const h   = wrap.clientHeight;
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(1,0,0,1,0,0);
        ctx.scale(dpr, dpr);
        return { w, h };
    }

    let dim = resize();
    window.addEventListener('resize', () => { dim = resize(); });

    const TAGS = [
        'LOGO DESIGN', 'COLOR GRADING', 'BRAND IDENTITY', 'THUMBNAILS',
        'LUT PACKS', 'INTRO CREATION', 'BRAND MATERIALS', 'AESTHETIC EDITS',
        'COVER PAGES', 'MOTION GRAPHICS', 'VISUAL IDENTITY', 'TYPOGRAPHY'
    ];

    const ALL_POINTS = [];
    const TOTAL_DOTS = 80;
    const TAG_COUNT  = TAGS.length;
    const phi = (1 + Math.sqrt(5)) / 2; // golden ratio

    // Background dots via Fibonacci sphere
    for (let i = 0; i < TOTAL_DOTS; i++) {
        const theta = Math.acos(1 - 2 * (i + 0.5) / TOTAL_DOTS);
        const psi   = 2 * Math.PI * i / phi;
        ALL_POINTS.push({ x: Math.sin(theta)*Math.cos(psi), y: Math.sin(theta)*Math.sin(psi), z: Math.cos(theta), isTag: false, label: '' });
    }
    // Tag points
    for (let i = 0; i < TAG_COUNT; i++) {
        const theta = Math.acos(1 - 2 * (i + 0.5) / TAG_COUNT);
        const psi   = 2 * Math.PI * i / phi;
        ALL_POINTS.push({ x: Math.sin(theta)*Math.cos(psi), y: Math.sin(theta)*Math.sin(psi), z: Math.cos(theta), isTag: true, label: TAGS[i] });
    }

    let rotY = 0;
    let mouseRX = 0, mouseRY = 0;
    let targetRX = 0, targetRY = 0;
    let animRunning = false;
    let globeMovePending = false;

    wrap.addEventListener('mousemove', (e) => {
        if (globeMovePending) return;
        globeMovePending = true;
        requestAnimationFrame(() => {
            const r = wrap.getBoundingClientRect();
            targetRX = ((e.clientY - r.top)  / r.height - 0.5) * 0.6;
            targetRY = ((e.clientX - r.left) / r.width  - 0.5) * 0.8;
            globeMovePending = false;
        });
    });
    wrap.addEventListener('mouseleave', () => { targetRX = 0; targetRY = 0; });

    ScrollTrigger.create({
        trigger: '#expertise',
        start: 'top bottom',
        end: 'bottom top',
        onEnter:     () => { animRunning = true;  requestAnimationFrame(draw); },
        onLeave:     () => { animRunning = false; },
        onEnterBack: () => { animRunning = true;  requestAnimationFrame(draw); },
        onLeaveBack: () => { animRunning = false; }
    });

    function project(p) {
        const cosY = Math.cos(rotY + mouseRY), sinY = Math.sin(rotY + mouseRY);
        const x1   = p.x * cosY + p.z * sinY;
        const z1   = -p.x * sinY + p.z * cosY;
        const cosX = Math.cos(mouseRX), sinX = Math.sin(mouseRX);
        const y1   = p.y * cosX - z1 * sinX;
        const z2   = p.y * sinX + z1 * cosX;
        return { x: x1, y: y1, z: z2 };
    }

    function draw() {
        if (!animRunning) return;
        requestAnimationFrame(draw);

        const W = dim.w, H = dim.h;
        ctx.clearRect(0, 0, W, H);

        mouseRX += (targetRX - mouseRX) * 0.04;
        mouseRY += (targetRY - mouseRY) * 0.04;
        rotY    += 0.004;

        const cx = W / 2, cy = H / 2;
        const R  = Math.min(W, H) * 0.42;

        const pts = ALL_POINTS.map(p => {
            const t     = project(p);
            const depth = (t.z + 1) / 2;
            return { sx: cx + t.x * R, sy: cy + t.y * R, z: t.z, depth, isTag: p.isTag, label: p.label };
        });
        pts.sort((a, b) => a.z - b.z);

        // Latitude rings
        for (let i = 1; i < 7; i++) {
            const theta = (i / 7) * Math.PI;
            const rLat  = Math.sin(theta) * R;
            const yLat  = -Math.cos(theta) * R * Math.cos(mouseRX);
            ctx.beginPath();
            ctx.ellipse(cx, cy + yLat, rLat * (Math.abs(Math.cos(mouseRY)) * 0.25 + 0.75), rLat * 0.28, mouseRY * 0.15, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(254,110,0,0.07)';
            ctx.lineWidth = 0.6;
            ctx.stroke();
        }

        // Longitude rings
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI;
            const cosA  = Math.cos(angle + rotY + mouseRY);
            ctx.beginPath();
            ctx.ellipse(cx, cy, R * Math.abs(cosA), R, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(254,110,0,${Math.abs(cosA) * 0.06})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        }

        pts.forEach(p => {
            if (!p.isTag) {
                ctx.globalAlpha = Math.max(0.05, p.depth * 0.55);
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, 1 + p.depth * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = p.depth > 0.65 ? '#fe6e00' : '#ffffff';
                ctx.fill();
            } else if (p.depth > 0.3) {
                const fadeIn = Math.max(0, (p.depth - 0.3) / 0.7);
                const scale  = 0.55 + p.depth * 0.55;
                const fs     = Math.max(8, Math.floor(scale * 11));
                ctx.font = `600 ${fs}px 'Inter',sans-serif`;
                ctx.globalAlpha = fadeIn;
                const tw = ctx.measureText(p.label).width + 18;
                const th = fs + 10;
                const rx = p.sx - tw / 2, ry = p.sy - th / 2;

                ctx.fillStyle = p.depth > 0.72 ? 'rgba(254,110,0,0.18)' : 'rgba(10,10,10,0.7)';
                ctx.beginPath();
                if (ctx.roundRect) { ctx.roundRect(rx, ry, tw, th, 4); } else { ctx.rect(rx, ry, tw, th); }
                ctx.fill();

                ctx.strokeStyle = p.depth > 0.72 ? 'rgba(254,110,0,0.55)' : 'rgba(255,255,255,0.07)';
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                if (ctx.roundRect) { ctx.roundRect(rx, ry, tw, th, 4); } else { ctx.rect(rx, ry, tw, th); }
                ctx.stroke();

                ctx.fillStyle = p.depth > 0.72 ? '#ffaa44' : 'rgba(255,255,255,0.75)';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(p.label, p.sx, p.sy);

                ctx.beginPath();
                ctx.arc(p.sx, ry - 3, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fe6e00';
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        });
    }

    // Globe content reveals
    const tlGlobe = gsap.timeline({ scrollTrigger: { trigger: '#expertise', start: 'top 65%', once: true } });
    tlGlobe
        .to('.gt-word',     { y: '0%', duration: 1.1, stagger: 0.12, ease: 'expo.out' }, 0)
        .to('.globe-desc',  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },      0.4)
        .to('.globe-stats', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },      0.55)
        .to('.globe-cta',   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },      0.7);

    // Stat counters
    document.querySelectorAll('.gstat-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target') || '0');
        if (!target) return;
        ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
                const obj = { v: 0 };
                gsap.to(obj, {
                    v: target, duration: 2, ease: 'power2.out',
                    onUpdate: () => { el.textContent = Math.floor(obj.v); }
                });
            }
        });
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   WORK SHOWCASE â€” Category Filter + Reveal
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initWorkShowcase() {
    gsap.to('.wt-word', {
        y: '0%', duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.work-showcase', start: 'top 72%', once: true }
    });
    gsap.to(['.ws-desc', '.ws-viewall'], {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.work-showcase', start: 'top 72%', once: true }
    });
    gsap.to('.ws-filters', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ws-filters', start: 'top 85%', once: true }
    });

    const cards = document.querySelectorAll('.ws-card');
    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.to(cards, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.ws-grid', start: 'top 80%', once: true }
    });

    const filterBtns = document.querySelectorAll('.wf-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                const cat  = card.getAttribute('data-category');
                const show = filter === 'all' || cat === filter;
                if (show) {
                    card.classList.remove('ws-hidden');
                    gsap.to(card, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
                } else {
                    gsap.to(card, {
                        opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in',
                        onComplete: () => card.classList.add('ws-hidden')
                    });
                }
            });
        });
    });

    // Card tilt + y-lift (GSAP owns transform, CSS hover disabled)
    cards.forEach(card => {
        let cardMovePending = false;
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return;
            if (cardMovePending) return;
            cardMovePending = true;
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x    = (e.clientX - rect.left) / rect.width  - 0.5;
                const y    = (e.clientY - rect.top)  / rect.height - 0.5;
                gsap.to(card, { rotateX: -y * 8, rotateY: x * 8, y: -6, transformPerspective: 700, duration: 0.4, ease: 'power2.out' });
                cardMovePending = false;
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
        });
    });

    // â”€â”€ PERFORMANCE: lazy-load ambient iframes only when grid approaches â”€â”€
    // rootMargin 400px means iframes start loading 400px before visible
    const ambientObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const frame = entry.target;
            if (frame.dataset.src) {
                frame.src = frame.dataset.src;
                // fade in once Vimeo fires the load event
                // also add a timeout fallback (some browsers don't fire load on cross-origin iframes)
                const markLoaded = () => frame.classList.add('vi-loaded');
                frame.addEventListener('load', markLoaded, { once: true });
                setTimeout(markLoaded, 4000); // fallback: fade in after 4 s regardless
            }
            ambientObserver.unobserve(frame);
        });
    }, { rootMargin: '200px 0px' }); // start loading before card is visible

    // Observe ambient iframes on all devices (mobile included).
    // rootMargin keeps them lazy enough that only nearby frames load.
    document.querySelectorAll('.wsc-vimeo-frame').forEach(f => ambientObserver.observe(f));

    // â”€â”€ Vimeo oEmbed thumbnail fetch â€” lazy, fires when grid enters viewport â”€â”€
    // No img tags / 3rd-party CDN: we hit Vimeo's own CORS-enabled oEmbed endpoint
    // Also caches video dimensions for lightbox aspect-ratio detection
    const vimeoAspectCache = new Map();

    async function fetchVimeoThumb(el, videoId) {
        try {
            const res = await fetch(
                `https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F${videoId}&width=1280`,
                { mode: 'cors' }
            );
            if (!res.ok) return;
            const data = await res.json();

            // Cache video dimensions for lightbox aspect-ratio
            if (data.width && data.height) {
                vimeoAspectCache.set(videoId, { w: data.width, h: data.height });
            }

            let thumbUrl = data.thumbnail_url || '';
            // Vimeo returns e.g. "â€¦_640.jpg" â€” bump to 1280 for crisp displays
            thumbUrl = thumbUrl.replace(/_\d+(\.\w+)$/, '_1280$1');
            if (!thumbUrl) return;
            // pre-load the image in memory so the reveal is instant
            const img = new Image();
            img.onload = () => {
                el.style.backgroundImage = `url('${thumbUrl}')`;
                // force a reflow so the animation triggers cleanly
                void el.offsetHeight;
                el.classList.add('vi-thumb-loaded');
            };
            img.onerror = () => { /* keep gradient fallback silently */ };
            img.src = thumbUrl;
        } catch (_) { /* keep gradient fallback silently */ }
    }

    // Also pre-fetch oEmbed for ambient cards (they don't have thumbnails but need aspect data)
    async function prefetchVimeoAspect(videoId) {
        if (vimeoAspectCache.has(videoId)) return;
        try {
            const res = await fetch(
                `https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F${videoId}&width=640`,
                { mode: 'cors' }
            );
            if (!res.ok) return;
            const data = await res.json();
            if (data.width && data.height) {
                vimeoAspectCache.set(videoId, { w: data.width, h: data.height });
            }
        } catch (_) { /* silent */ }
    }

    // Trigger all thumb fetches + aspect prefetches once the grid scrolls into range
    const thumbTriggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // Thumbnails for play cards
            document.querySelectorAll('.wsc-thumb-bg[data-vid]').forEach(el => {
                fetchVimeoThumb(el, el.dataset.vid);
            });
            // Aspect-ratio prefetch for ambient cards (no thumbnail needed, just dimensions)
            document.querySelectorAll('.ws-card--ambient[data-vid]').forEach(card => {
                prefetchVimeoAspect(card.dataset.vid);
            });
            thumbTriggerObserver.disconnect(); // fire once
        });
    }, { rootMargin: '300px 0px' });

    const wsGrid = document.getElementById('wsGrid');
    if (wsGrid) thumbTriggerObserver.observe(wsGrid);

    // â”€â”€ Ambient cards: click opens full lightbox (not bg mode) â”€â”€
    // â”€â”€ Vimeo Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const lightbox    = document.getElementById('vimeoLightbox');
    const vlbIframe   = document.getElementById('vlbIframe');
    const vlbClose    = document.getElementById('vlbClose');
    const vlbBackdrop = document.getElementById('vlbBackdrop');

    if (!lightbox || !vlbIframe) return; // guard: elements must exist

    const vlbFrameWrap = lightbox.querySelector('.vlb-frame-wrap');
    let vlbCloseTimer = null; // tracks the delayed src-clear so rapid open/close doesn't race

    function applyLightboxAspect(w, h) {
        if (!vlbFrameWrap) return;
        const isPortrait = h > w;
        vlbFrameWrap.classList.toggle('vlb-portrait', isPortrait);
        vlbFrameWrap.classList.toggle('vlb-landscape', !isPortrait);
        vlbFrameWrap.style.aspectRatio = `${w} / ${h}`;
    }

    function openLightbox(videoId, platform) {
        if (!videoId) return;
        platform = platform || 'vimeo';

        // Cancel any pending close-timer (prevents race if user re-opens quickly)
        if (vlbCloseTimer) { clearTimeout(vlbCloseTimer); vlbCloseTimer = null; }

        // Reset aspect to default 16:9 before each open
        vlbFrameWrap.classList.remove('vlb-portrait', 'vlb-landscape');
        vlbFrameWrap.style.aspectRatio = '';

        if (platform === 'youtube') {
            // YouTube â€” always 16:9 landscape
            applyLightboxAspect(16, 9);
            vlbIframe.src = [
                `https://www.youtube.com/embed/${videoId}`,
                '?autoplay=1&rel=0&modestbranding=1',
                '&color=white&playsinline=1'
            ].join('');
        } else {
            // Vimeo â€” detect aspect ratio from oEmbed cache
            const cached = vimeoAspectCache.get(videoId);
            if (cached) {
                applyLightboxAspect(cached.w, cached.h);
            } else {
                prefetchVimeoAspect(videoId).then(() => {
                    const data = vimeoAspectCache.get(videoId);
                    if (data) applyLightboxAspect(data.w, data.h);
                });
            }
            vlbIframe.src = [
                `https://player.vimeo.com/video/${videoId}`,
                '?autoplay=1&loop=1&rel=0',
                '&color=fe6e00&byline=0&title=0&portrait=0',
                '&transparent=0&pip=0&dnt=1'
            ].join('');
        }

        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.classList.add('vlb-open');
        document.body.style.overflow = 'hidden';
        if (window.lenis) window.lenis.stop(); // freeze Lenis virtual scroll
        requestAnimationFrame(() => vlbClose.focus());
    }

    // Expose lightbox globally so the reel section script can use it
    window.openVideoLightbox = openLightbox;

    function closeLightbox() {
        if (!lightbox.classList.contains('vlb-open')) return; // prevent double-close
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start(); // resume Lenis virtual scroll
        lightbox.classList.remove('vlb-open');
        lightbox.setAttribute('aria-hidden', 'true');
        // clear src AFTER fade transition so audio stops cleanly
        vlbCloseTimer = setTimeout(() => {
            if (vlbIframe) vlbIframe.src = '';
            vlbCloseTimer = null;
        }, 450);
        // Notify other components (e.g. reel) to resume playback
        window.dispatchEvent(new CustomEvent('vlb:close'));
    }

    vlbClose.addEventListener('click', closeLightbox);
    vlbBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // Ambient cards â€” click anywhere on card opens lightbox
    document.querySelectorAll('.ws-card--ambient[data-vid]').forEach(card => {
        card.addEventListener('click', (e) => {
            // don't open if user clicked wsc-watch-btn (it fires its own handler below)
            if (e.target.closest('.wsc-watch-btn')) return;
            openLightbox(card.dataset.vid);
        });
    });

    // Watch-full button on ambient cards
    document.querySelectorAll('.wsc-watch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('[data-vid]');
            if (card) openLightbox(card.dataset.vid);
        });
    });

    // Play-button cards â€” stopPropagation prevents card-click from also firing
    document.querySelectorAll('.wsc-play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openLightbox(btn.dataset.vid);
        });
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PRICING SECTION â€” Cards + Feature Stagger
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initPricingSection() {
    gsap.to('.pt-word', {
        y: '0%', duration: 1.1, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.pricing-section', start: 'top 70%', once: true }
    });
    gsap.to('.ps-subtitle', {
        opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.pricing-section', start: 'top 70%', once: true }
    });

    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, i) => {
        const isFeatured = card.classList.contains('featured');

        // Use fromTo so the initial y:40 is explicitly set (overrides any CSS transform)
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: isFeatured ? -16 : 0,
                duration: 0.9,
                delay: i * 0.12,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.ps-grid', start: 'top 78%', once: true }
            }
        );

        const featureItems = card.querySelectorAll('.pc-features li');
        gsap.fromTo(featureItems,
            { opacity: 0, x: -10 },
            {
                opacity: 1, x: 0, duration: 0.5, stagger: 0.06,
                ease: 'power3.out', delay: 0.3 + i * 0.12,
                scrollTrigger: { trigger: card, start: 'top 82%', once: true }
            }
        );

        // Hover: lift via GSAP (since GSAP inline style now owns the transform)
        card.addEventListener('mouseenter', () => {
            const targetY = isFeatured ? -20 : -5;
            gsap.to(card, { y: targetY, boxShadow: isFeatured ? '0 20px 60px rgba(254,110,0,0.2)' : '0 20px 50px rgba(254,110,0,0.12)', duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            const restY = isFeatured ? -16 : 0;
            gsap.to(card, { y: restY, boxShadow: 'none', duration: 0.5, ease: 'elastic.out(1, 0.6)' });
        });
    });

    gsap.to('.ps-note', {
        opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.ps-note', start: 'top 88%', once: true }
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FOOTER BRAND SPOTLIGHT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initFooterSpotlight() {
    const el = document.querySelector('.footer-brand-text');
    if (!el) return;

    /* Move both gradient layers to follow the cursor (throttled) */
    let footerMovePending = false;
    el.addEventListener('mousemove', function (e) {
        if (footerMovePending) return;
        footerMovePending = true;
        requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--x', (e.clientX - rect.left) + 'px');
            el.style.setProperty('--y', (e.clientY - rect.top)  + 'px');
            footerMovePending = false;
        });
    });

    /* Push gradients off-screen so text goes invisible when not hovering */
    el.addEventListener('mouseleave', function () {
        el.style.setProperty('--x', '-9999px');
        el.style.setProperty('--y', '-9999px');
    });

    /* Scroll-reveal */
    gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 95%', once: true }
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTACT SECTION â€” Cinematic Reveal + Channel Stagger
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initContactAnimations() {
    const st = { trigger: '.contact-section', start: 'top 72%', once: true };
    const stBody = { trigger: '.cs-body', start: 'top 80%', once: true };

    /* â”€â”€ header â”€â”€ */
    gsap.to('.cs-eyebrow', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: st });
    gsap.to('.cs-title-word', { y: '0%', duration: 1.3, stagger: 0.14, ease: 'expo.out', scrollTrigger: { trigger: '.contact-section', start: 'top 68%', once: true } });
    gsap.to('.cs-header-rule', { opacity: 1, duration: 1, ease: 'power3.out', delay: 0.55, scrollTrigger: st });

    /* â”€â”€ left column â”€â”€ */
    gsap.to('.cs-avail-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: stBody });
    gsap.to('.cs-statement', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.1, scrollTrigger: stBody });
    gsap.to('.cs-stats-row', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', delay: 0.2, scrollTrigger: stBody });
    gsap.to('.cs-channel', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3, scrollTrigger: stBody });

    /* â”€â”€ right column â”€â”€ */
    gsap.to('.cs-form-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.15, scrollTrigger: stBody });
    gsap.to('.cs-form-sub', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25, scrollTrigger: stBody });
    gsap.to('.cs-right', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1, scrollTrigger: stBody });

    /* â”€â”€ footer bar â”€â”€ */
    gsap.to('.cs-footer-bar', { opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cs-footer-bar', start: 'top 92%', once: true } });

    /* â”€â”€ Form submission â”€â”€ */
    const form    = document.getElementById('csForm');
    const success = document.getElementById('csFormSuccess');
    if (!form || !success) return;

    const btn     = form.querySelector('.cs-form__submit');
    const btnText = form.querySelector('.cs-submit-text');
    const note    = form.querySelector('#csFormNote');
    const nameEl  = form.querySelector('#cf-name');
    const emailEl = form.querySelector('#cf-email');
    const msgEl   = form.querySelector('#cf-msg');
    const serviceInput = form.querySelector('#cf-service');
    const servicePills = form.querySelectorAll('#cf-service-pills .cs-pill');

    function setNote(message, tone) {
        if (!note) return;
        note.textContent = message;
        note.classList.remove('is-error', 'is-success');
        if (tone === 'error') note.classList.add('is-error');
        if (tone === 'success') note.classList.add('is-success');
    }

    function activateService(pill) {
        servicePills.forEach((other) => {
            other.classList.remove('is-active');
            other.setAttribute('aria-pressed', 'false');
        });

        pill.classList.add('is-active');
        pill.setAttribute('aria-pressed', 'true');
        if (serviceInput) serviceInput.value = (pill.textContent || '').trim();
    }

    servicePills.forEach((pill) => {
        pill.setAttribute('aria-pressed', 'false');
        pill.addEventListener('mousedown', (event) => event.preventDefault());
        pill.addEventListener('click', () => activateService(pill));
        pill.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateService(pill);
            }
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name  = nameEl?.value.trim() || '';
        const email = emailEl?.value.trim() || '';
        const msg   = msgEl?.value.trim() || '';
        if (!name || !email || !msg) {
            /* Shake the missing fields */
            [nameEl, emailEl, msgEl].forEach(el => {
                if (el && !el.value.trim()) gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.2,0.4)' });
            });
            setNote('Please fill in your name, email, and message.', 'error');
            return;
        }

        /* Validate email format */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            gsap.fromTo(emailEl, { x: -6 }, { x: 0, duration: 0.45, ease: 'elastic.out(1.2,0.4)' });
            emailEl.focus();
            emailEl.setAttribute('aria-invalid', 'true');
            emailEl.closest('.cs-field')?.classList.add('cs-field--error');
            setTimeout(() => emailEl.setAttribute('aria-invalid', 'false'), 2500);
            setNote('Please enter a valid email address.', 'error');
            return;
        }
        emailEl?.closest('.cs-field')?.classList.remove('cs-field--error');

        if (btn)     btn.disabled = true;
        if (btnText) btnText.textContent = 'Sendingâ€¦';
        setNote('Sending your messageâ€¦');

        try {
            const formData = new FormData(form);
            const selectedPill = form.querySelector('#cf-service-pills .cs-pill.is-active');
            const selectedService = (
                (selectedPill?.textContent || '').trim() ||
                (serviceInput?.value || '').trim()
            );

            if (selectedService) {
                formData.set('service', selectedService);
            } else {
                formData.set('service', 'Not specified');
            }

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to send your message right now.');
            }

            gsap.to(form.querySelectorAll('.cs-field, .cs-form__row, .cs-form__footer'), {
                opacity: 0,
                y: -8,
                duration: 0.35,
                stagger: 0.05,
                ease: 'power2.in',
                onComplete: () => {
                    form.querySelectorAll('.cs-field, .cs-form__row, .cs-form__footer').forEach(el => el.style.display = 'none');
                    success.removeAttribute('hidden');
                    gsap.from(success, { opacity: 0, y: 12, duration: 0.55, ease: 'power3.out' });
                }
            });

            form.reset();
            servicePills.forEach((pill) => {
                pill.classList.remove('is-active');
                pill.setAttribute('aria-pressed', 'false');
            });
            if (serviceInput) serviceInput.value = '';
            setNote('Message sent successfully. We will get back within 24 hours.', 'success');
            announce('Message sent successfully. We will get back to you soon.');
        } catch (error) {
            if (btn) btn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
            setNote('Could not send right now. Please try again in a moment.', 'error');
            announce('Message could not be sent. Please try again.');
        }
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FLOWING SERVICES â€” ReactBits Flowing-Menu
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initFlowingServices() {
    const rows = document.querySelectorAll('.fs-row');
    if (!rows.length) return;

    // Scroll-reveal for the hint strip + section header
    gsap.fromTo('.fs-hint-bar',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: '.flowing-services', start: 'top 82%', once: true }
        });

    // Stagger reveal each row
    gsap.from(rows, {
        opacity: 0, x: -30, duration: 0.7, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: '.flowing-services', start: 'top 72%', once: true }
    });

    rows.forEach(row => {
        const fill = row.querySelector('.fs-fill');
        // GSAP handles the clip-path animation if CSS clip-path is already set
        // fallback: ensure marquee starts paused
        const mq = row.querySelector('.fs-marquee');

        row.addEventListener('mouseenter', () => {
            if (mq) mq.style.animationPlayState = 'running';
        });
        row.addEventListener('mouseleave', () => {
            if (mq) mq.style.animationPlayState = 'paused';
        });

        // Keyboard / touch focus
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'button');
        row.addEventListener('focus', () => row.dispatchEvent(new Event('mouseenter')));
        row.addEventListener('blur',  () => row.dispatchEvent(new Event('mouseleave')));
    });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CIRCULAR GALLERY â€” 3-D Drag Carousel
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initCircularGallery() {
    const ring      = document.getElementById('dgRing');
    const stage     = document.getElementById('dgStage');
    const lightbox  = document.getElementById('dgLightbox');
    const lbClose   = document.getElementById('dgLbClose');
    const lbBackdrop = document.getElementById('dgLbBackdrop');
    const lbVisual  = document.getElementById('dgLbVisual');
    const lbNum     = document.getElementById('dgLbNum');
    const lbTitle   = document.getElementById('dgLbTitle');
    const lbPrev    = document.getElementById('dgLbPrev');
    const lbNext    = document.getElementById('dgLbNext');
    const prevBtn   = document.getElementById('dgPrev');
    const nextBtn   = document.getElementById('dgNext');
    const idxEl     = document.getElementById('dgIdx');
    if (!ring || !stage) return;

    const cards   = Array.from(ring.querySelectorAll('.dg-card'));
    const N       = cards.length;
    const STEP    = 360 / N;

    // Build a combined image list from carousel cards + marquee items for lightbox navigation
    const allImages = [];
    cards.forEach(c => {
        const img = c.dataset.img;
        const cat = c.dataset.cat || '';
        if (img) allImages.push({ src: img, title: cat });
    });
    document.querySelectorAll('.dg-mq-item').forEach(item => {
        const img = item.dataset.img;
        if (img && !allImages.some(a => a.src === img)) {
            // Derive title from filename
            const fname = img.split('/').pop().replace('design-', '').replace('.webp', '').replace(/-/g, ' ');
            allImages.push({ src: img, title: fname.charAt(0).toUpperCase() + fname.slice(1) });
        }
    });

    // Detect radius from viewport
    const getRadius = () => window.innerWidth < 769 ? 220 : 360;

    // Position all cards in 3D ring
    function positionCards(r) {
        cards.forEach((c, i) => {
            c.style.transform = `rotateY(${i * STEP}deg) translateZ(${r}px)`;
        });
    }

    positionCards(getRadius());
    window.addEventListener('resize', () => positionCards(getRadius()));

    // â”€â”€ Rotation state â”€â”€
    let rotAngle = 0;
    let targetAngle = 0;
    let raf = null;
    let inView = false;

    function frontIndex() {
        const norm = ((-rotAngle % 360) + 360) % 360;
        return Math.round(norm / STEP) % N;
    }

    function updateActive() {
        const fi = frontIndex();
        cards.forEach((c, i) => {
            c.classList.toggle('dg-card--active', i === fi);
            const rawDiff = Math.abs(((i * STEP + rotAngle) % 360 + 360) % 360);
            const diff = Math.min(rawDiff, 360 - rawDiff);
            const t = diff / 180;
            const dimVal = gsap.utils.interpolate(1, 0.35, t);
            c.style.filter = `brightness(${dimVal})`;
            c.style.opacity = diff > 120 ? '0.25' : '1';
        });
        if (idxEl) {
            idxEl.textContent = String(fi + 1).padStart(2, '0');
        }
    }

    // â”€â”€ RAF loop â”€â”€
    let autoSpin = true;
    let isDragging = false;
    const AUTO_SPEED = 0.12;

    function tick() {
        if (!inView) { raf = null; return; }
        raf = requestAnimationFrame(tick);

        if (autoSpin && !isDragging) {
            rotAngle += AUTO_SPEED;
            targetAngle = rotAngle;
        } else if (!isDragging) {
            rotAngle += (targetAngle - rotAngle) * 0.08;
        }

        ring.style.transform = `translate(-50%, -50%) rotateY(${rotAngle}deg)`;
        updateActive();
    }

    function startLoop() { if (!raf && inView) { raf = requestAnimationFrame(tick); } }
    function stopLoop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    ScrollTrigger.create({
        trigger: '.design-gallery',
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter:      () => { inView = true;  startLoop(); },
        onLeave:      () => { inView = false; stopLoop();  },
        onEnterBack:  () => { inView = true;  startLoop(); },
        onLeaveBack:  () => { inView = false; stopLoop();  }
    });

    // â”€â”€ Drag â”€â”€
    let dragX0 = 0;
    let rotAngle0 = 0;

    function onDragStart(e) {
        isDragging = true;
        autoSpin   = false;
        dragX0     = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        rotAngle0  = rotAngle;
        stage.style.cursor = 'grabbing';
    }

    function onDragMove(e) {
        if (!isDragging) return;
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        rotAngle = rotAngle0 + (x - dragX0) * 0.35;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        stage.style.cursor = 'grab';
        const raw = -rotAngle % 360;
        const snapped = Math.round(raw / STEP) * STEP;
        targetAngle = -(snapped + Math.round(rotAngle / 360) * 360);
    }

    stage.addEventListener('mousedown',  onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup',   onDragEnd);
    stage.addEventListener('touchstart', onDragStart, { passive: true });
    stage.addEventListener('touchmove',  onDragMove,  { passive: true });
    stage.addEventListener('touchend',   onDragEnd);

    stage.addEventListener('mouseenter', () => { autoSpin = false; });
    stage.addEventListener('mouseleave', () => { if (!isDragging) autoSpin = true; });

    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    function navigate(dir) {
        autoSpin = false;
        targetAngle = rotAngle - dir * STEP;
    }

    // â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    let lbIndex = 0; // index into allImages[]

    function openLightbox(imgIdx) {
        if (!lightbox || !lbVisual || imgIdx < 0 || imgIdx >= allImages.length) return;
        lbIndex = imgIdx;
        renderLightbox();
        lightbox.removeAttribute('hidden');
        if (window.lenis) window.lenis.stop();

        gsap.fromTo(lightbox.querySelector('.dg-lb-backdrop'),
            { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        gsap.fromTo(lightbox.querySelector('.dg-lb-card'),
            { opacity: 0, scale: 0.88, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.5)' });
    }

    function renderLightbox() {
        const item = allImages[lbIndex];
        lbVisual.innerHTML = '';
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title;
        img.draggable = false;
        lbVisual.appendChild(img);
        if (lbNum)   lbNum.textContent  = String(lbIndex + 1).padStart(2, '0');
        if (lbTitle) lbTitle.textContent = item.title;
    }

    function closeLightbox() {
        if (!lightbox) return;
        if (window.lenis) window.lenis.start();
        gsap.to(lightbox.querySelector('.dg-lb-card'),
            { opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: 'power2.in',
              onComplete: () => lightbox.setAttribute('hidden', '') });
    }

    function lbNav(dir) {
        lbIndex = (lbIndex + dir + allImages.length) % allImages.length;
        gsap.to(lbVisual, { opacity: 0, x: dir * -30, duration: 0.15, ease: 'power2.in', onComplete: () => {
            renderLightbox();
            gsap.fromTo(lbVisual, { opacity: 0, x: dir * 30 }, { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' });
        }});
    }

    if (lbClose)    lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev)     lbPrev.addEventListener('click', () => lbNav(-1));
    if (lbNext)     lbNext.addEventListener('click', () => lbNav(1));

    document.addEventListener('keydown', e => {
        if (lightbox.hasAttribute('hidden')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  lbNav(-1);
        if (e.key === 'ArrowRight') lbNav(1);
    });

    // Swipe support for lightbox on mobile
    let lbTouchX = 0;
    if (lbVisual) {
        lbVisual.addEventListener('touchstart', e => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
        lbVisual.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - lbTouchX;
            if (Math.abs(dx) > 50) lbNav(dx < 0 ? 1 : -1);
        }, { passive: true });
    }

    // â”€â”€ Card click â†’ lightbox â”€â”€
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            const fi = frontIndex();
            if (i !== fi) {
                const diff = ((i - fi) + N) % N;
                const dir  = diff <= N / 2 ? diff : diff - N;
                navigate(-dir);
                return;
            }
            // Find this card's image in the allImages array
            const imgSrc = card.dataset.img;
            const idx = allImages.findIndex(a => a.src === imgSrc);
            if (idx !== -1) openLightbox(idx);
        });
    });

    // â”€â”€ Marquee items â†’ lightbox â”€â”€
    document.querySelectorAll('.dg-mq-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.dataset.img;
            const idx = allImages.findIndex(a => a.src === imgSrc);
            if (idx !== -1) openLightbox(idx);
        });
    });

    // â”€â”€ Section reveal â”€â”€
    const tl = gsap.timeline({
        scrollTrigger: { trigger: '.design-gallery', start: 'top 72%', once: true }
    });
    tl.to('.dg-tw', {
        y: '0%', duration: 1.1, stagger: 0.18, ease: 'expo.out'
    }).to('.dg-hint', {
        opacity: 1, duration: 0.8, ease: 'power3.out'
    }, '-=0.4');
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAGIC BENTO SPOTLIGHT â€” cursor-tracked glow on cards
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initMagicBentoSpotlight() {
    const selectors = ['.svc-card', '.pricing-card'];
    const spotClass = { '.svc-card': 'svc-spotlight', '.pricing-card': 'pc-spotlight' };
    const glowClass = { '.svc-card': 'svc-border-glow', '.pricing-card': 'pc-border-glow' };

    selectors.forEach(sel => {
        const els = document.querySelectorAll(sel);
        els.forEach(el => {
            // Inject spotlight + border-glow divs if not already present
            if (!el.querySelector('.' + spotClass[sel])) {
                const spot = document.createElement('div');
                spot.className = spotClass[sel];
                el.appendChild(spot);
            }
            if (!el.querySelector('.' + glowClass[sel])) {
                const glow = document.createElement('div');
                glow.className = glowClass[sel];
                el.appendChild(glow);
            }

            // Make sure card has position:relative (fall-through safeguard)
            el.style.position = 'relative';
            el.style.overflow = 'hidden';

            let bentoMovePending = false;
            el.addEventListener('mousemove', e => {
                if (bentoMovePending) return;
                bentoMovePending = true;
                requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
                    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
                    el.style.setProperty('--sx', x);
                    el.style.setProperty('--sy', y);
                    bentoMovePending = false;
                });
            });

            // Spark burst on enter
            el.addEventListener('mouseenter', e => {
                spawnSparks(el, e);
            });
        });
    });

    function spawnSparks(parent, e) {
        const rect = parent.getBoundingClientRect();
        const ox = e.clientX - rect.left;
        const oy = e.clientY - rect.top;
        const count = 6;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'bento-spark';
            p.style.left = ox + 'px';
            p.style.top  = oy + 'px';
            parent.appendChild(p);
            const angle = (i / count) * 360;
            const dist  = gsap.utils.random(24, 55);
            const dx    = Math.cos(angle * Math.PI / 180) * dist;
            const dy    = Math.sin(angle * Math.PI / 180) * dist;
            gsap.fromTo(p,
                { x: 0, y: 0, opacity: 1, scale: 1 },
                { x: dx, y: dy, opacity: 0, scale: 0.2, duration: 0.55,
                  ease: 'power2.out', onComplete: () => p.remove() }
            );
        }
    }
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TARGET CURSOR BRACKETS â€” 4-corner bracket snapping
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initTargetCursor() {
    const brackets = document.getElementById('cursorBrackets');
    if (!brackets || window.matchMedia('(hover: none)').matches) return;

    const tl = document.querySelector('.cb-tl');
    const tr = document.querySelector('.cb-tr');
    const bl = document.querySelector('.cb-bl');
    const br = document.querySelector('.cb-br');
    if (!tl) return;

    const GAP = 6; // px offset outward from element edge

    let isVisible = false;

    function showBrackets(el) {
        const rect = el.getBoundingClientRect();
        const x = rect.left   - GAP;
        const y = rect.top    - GAP;
        const w = rect.width  + GAP * 2;
        const h = rect.height + GAP * 2;

        const dur = 0.25;
        const ease = 'power2.out';

        gsap.to(brackets, { opacity: 1, duration: 0.2, ease });
        // Position the wrapper
        gsap.to(brackets, { x, y, width: w, height: h, duration: dur, ease });

        isVisible = true;
    }

    function hideBrackets() {
        gsap.to(brackets, { opacity: 0, duration: 0.2, ease: 'power2.in' });
        isVisible = false;
    }

    // Observe all current + future .cursor-target elements
    const targets = document.querySelectorAll('.cursor-target');
    targets.forEach(el => {
        el.addEventListener('mouseenter', () => showBrackets(el));
        el.addEventListener('mouseleave', hideBrackets);
        el.addEventListener('focus',      () => showBrackets(el));
        el.addEventListener('blur',       hideBrackets);
    });

    // Follow cursor when brackets are visible (smooth reposition on scroll/resize)
    window.addEventListener('scroll', () => {
        if (isVisible) {
            const hovered = document.querySelector('.cursor-target:hover');
            if (hovered) showBrackets(hovered);
        }
    }, { passive: true });
}


/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PAUSE OFF-SCREEN CSS ANIMATIONS â€” saves GPU/CPU on mobile
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function initPauseOffscreenAnimations() {
    // Elements with infinite CSS animations that should pause off-screen
    const selectors = [
        '.h-marquee__track',
        '.h-bg__mesh',
        '.h-logo-glow',
        '.h-logo-img',
        '.h-tag__dot',
        '.h-scroll__wheel',
        '.beyond-orb',
        '.floating-orb',
        '.gradient-mesh',
        '.trusted-track',
        '.globe-glow-core',
        '.spotlight-beam',
        '.lamp-glow',
        '.aurora-gradient',
        '.dot-background',
        '.fs-arrow',
        '.wsc-live-dot',
        '.wsc-motion-lines div'
    ];
    const allEls = document.querySelectorAll(selectors.join(','));
    if (!allEls.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
    }, { rootMargin: '100px 0px' });

    allEls.forEach(el => observer.observe(el));
}
