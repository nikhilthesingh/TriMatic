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

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* ========================================
   Initialization
   ======================================== */

/* ============================================================
   🎬 HERO v3 — GSAP Cinematic Reveal
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

    // Mouse-tracking spotlight (CSS var approach — no canvas, no RAF loop)
    const hero = document.getElementById('hero');
    if (hero) {
        let mx = 50, my = 40, cx = 50, cy = 40, raf;
        hero.addEventListener('mousemove', e => {
            const r = hero.getBoundingClientRect();
            mx = ((e.clientX - r.left) / r.width) * 100;
            my = ((e.clientY - r.top) / r.height) * 100;
        });
        const mesh = hero.querySelector('.h-bg__mesh');
        if (mesh) {
            (function loop() {
                cx += (mx - cx) * 0.05;
                cy += (my - cy) * 0.05;
                mesh.style.background = `
                    radial-gradient(ellipse 55% 45% at ${cx}% ${cy}%, rgba(254,110,0,0.16) 0%, transparent 60%),
                    radial-gradient(ellipse 50% 60% at ${100 - cx}% ${100 - cy}%, rgba(67,97,238,0.10) 0%, transparent 60%),
                    #080808`;
                raf = requestAnimationFrame(loop);
            })();
        }
    }
}

window.addEventListener('load', () => {
    initPreloader();
    initCustomCursor();
    initHeroNew();
    initNavigation();
    initBeyondLogic();
    initMagneticButtons();

    // ENHANCED FEATURES
    initTypewriter();
    initGlassmorphNavbar();
    initAboutTextReveal();
    initSmoothScrollLinks();
    initRippleEffect();
    initScrollReveal();
    initParallaxSections();
    initImageLazyReveal();

    // NEW SECTIONS
    initServicesSection();
    initGlobeCanvas();
    initWorkShowcase();
    initPricingSection();
    initContactAnimations();

    // REACTBITS FEATURES
    initFlowingServices();
    initCircularGallery();
    initMagicBentoSpotlight();
    initTargetCursor();
});



/* ========================================
   Footer Spotlight
   ======================================== */
function initFooterSpotlight() {
    const brandText = document.querySelector('.footer-brand-text');
    if (!brandText) return;

    brandText.addEventListener('mousemove', (e) => {
        const rect = brandText.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        brandText.style.setProperty('--x', `${x}px`);
        brandText.style.setProperty('--y', `${y}px`);
    });
}

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

    // Add magnetic effect to CTAs
    const ctaButtons = document.querySelectorAll('.cta-button, .cta-secondary, .magnetic-btn');
    ctaButtons.forEach(btn => {
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
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/* ========================================
   Splash Cursor (React Bits inspired)
   ======================================== */
function initSplashCursor() {
    const splashLayer = document.getElementById('fx-splash');
    if (!splashLayer) return;

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    if (reducedMotion || !canHover) return;

    let lastTime = 0;
    const spawnGap = 24;

    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastTime < spawnGap) return;
        lastTime = now;

        const dot = document.createElement('span');
        dot.className = 'splash-dot';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        dot.style.setProperty('--size', `${Math.random() * 11 + 5}px`);

        splashLayer.appendChild(dot);
        setTimeout(() => dot.remove(), 760);
    });
}

/* ========================================
   Hero Orbit Parallax
   ======================================== */
function initHeroOrbitParallax() {
    const orbit = document.querySelector('.hero-orbit');
    const hero = document.querySelector('.hero');
    if (!orbit || !hero) return;

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(orbit, {
            x: x * 24,
            y: y * 16,
            duration: 0.6,
            ease: 'power3.out'
        });
    });

    hero.addEventListener('mouseleave', () => {
        gsap.to(orbit, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

/* ========================================
   Scramble Text Reveal
   ======================================== */
function initScrambleText() {
    const targets = document.querySelectorAll('.scramble-word, .hero-title .outline');
    if (!targets.length) return;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    targets.forEach(target => {
        const original = target.textContent;
        if (!original || !original.trim()) return;

        ScrollTrigger.create({
            trigger: target,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                let frame = 0;
                const totalFrames = 22;

                const timer = setInterval(() => {
                    const progress = frame / totalFrames;
                    const revealCount = Math.floor(original.length * progress);

                    const scrambled = original
                        .split('')
                        .map((char, index) => {
                            if (char === ' ' || char === '\n') return char;
                            if (index < revealCount) return original[index];
                            return letters[Math.floor(Math.random() * letters.length)];
                        })
                        .join('');

                    target.textContent = scrambled;
                    frame += 1;

                    if (frame > totalFrames) {
                        clearInterval(timer);
                        target.textContent = original;
                    }
                }, 28);
            }
        });
    });
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

/* ========================================
   Hero Animation
   ======================================== */
/* ========================================
   Hero Animations
   ======================================== */
function initHeroAnimations() {
    // Set initial states with transforms
    gsap.set('.hero-label', { opacity: 0, y: 30, filter: 'blur(10px)' });
    gsap.set('.title-word', { y: '110%', rotateX: -15 });
    gsap.set('.hero-description', { opacity: 0, y: 40, filter: 'blur(5px)' });
    gsap.set('.hero-sub-description', { opacity: 0, y: 30 });
    gsap.set('.hero-stats', { opacity: 0, y: 40 });
    gsap.set('.hero-cta', { opacity: 0, y: 40, scale: 0.95 });
    gsap.set('.hero-scroll', { opacity: 0, y: 20 });
}

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
   Liquid Canvas Animation
   ======================================== */
function initLiquidCanvas() {
    const canvas = document.getElementById('liquidCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        time += 0.005;

        // Create liquid gradient blobs
        const gradients = [
            { x: 0.3, y: 0.2, color: 'rgba(254, 110, 0, 0.4)', radius: 0.35 },
            { x: 0.7, y: 0.7, color: 'rgba(0, 240, 255, 0.3)', radius: 0.3 },
            { x: 0.5, y: 0.5, color: 'rgba(255, 190, 92, 0.25)', radius: 0.4 }
        ];

        gradients.forEach((blob, i) => {
            const offsetX = Math.sin(time + i * 2) * width * 0.1;
            const offsetY = Math.cos(time * 0.8 + i * 1.5) * height * 0.1;
            const x = blob.x * width + offsetX;
            const y = blob.y * height + offsetY;
            const radius = blob.radius * Math.min(width, height);

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });

        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
}

/* ========================================
   Horizontal Scroll Story
   ======================================== */
function initHorizontalScroll() {
    const section = document.querySelector('.horizontal-story');
    if (!section) return;

    const track = section.querySelector('.story-track');
    const slides = gsap.utils.toArray('.story-slide');

    if (!track || !slides.length) return;

    // Create horizontal scroll animation
    const totalWidth = slides.length * 100;

    gsap.to(track, {
        x: () => -(totalWidth - 100) + 'vw',
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: track,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });

    // Animate individual slides as they come into view
    slides.forEach((slide, i) => {
        const content = slide.querySelector('.story-content');
        const visual = slide.querySelector('.story-visual');

        if (content) {
            gsap.from(content, {
                y: 80,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: () => `top+=${i * 33}% top`,
                    end: () => `top+=${i * 33 + 33}% top`,
                    scrub: 1
                }
            });
        }

        if (visual) {
            gsap.from(visual, {
                x: 100,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: () => `top+=${i * 33 + 10}% top`,
                    end: () => `top+=${i * 33 + 33}% top`,
                    scrub: 1
                }
            });
        }
    });
}

/* ========================================
   Tunnel Effect (Process Section)
   ======================================== */
function initTunnelEffect() {
    const tunnelSection = document.querySelector('.process');
    const tunnelImages = document.querySelectorAll('.tunnel-image');
    const tunnelContents = document.querySelector('.tunnel-contents');
    const tunnelContentItems = document.querySelectorAll('.tunnel-content');
    const progressRing = document.querySelector('.progress-ring');
    const progressLabel = document.querySelector('.progress-label');
    const processProgress = document.querySelector('.process-progress');

    if (!tunnelSection) return;

    // Progress Ring Logic
    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    if (progressRing) {
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;
    }

    ScrollTrigger.matchMedia({
        // Desktop/Tablet (Landscape) only
        "(min-width: 900px)": function () {
            const tl = ScrollTrigger.create({
                trigger: tunnelSection,
                start: 'top top',
                end: 'bottom bottom',
                pin: '.tunnel-container',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const totalSlides = tunnelImages.length;
                    const slideIndex = Math.min(
                        Math.floor(progress * totalSlides),
                        totalSlides - 1
                    );

                    // Progress Ring
                    if (progressRing) {
                        const offset = circumference - progress * circumference;
                        progressRing.style.strokeDashoffset = offset;
                    }

                    // Update Label
                    const phrases = ['SYNC', 'PLAN', 'MAKE', 'LIVE'];
                    if (progressLabel) {
                        progressLabel.textContent = phrases[slideIndex];
                    }

                    // Show/Hide Progress Widget
                    if (processProgress) {
                        if (progress > 0.05 && progress < 0.95) {
                            processProgress.classList.add('visible');
                        } else {
                            processProgress.classList.remove('visible');
                        }
                    }

                    // Switch Slides
                    tunnelImages.forEach((img, i) => {
                        if (i === slideIndex) {
                            // Current Slide
                            img.classList.add('active');
                            if (tunnelContentItems[i]) tunnelContentItems[i].classList.add('active');

                            // Zoom effect inside active slide
                            const slideProgress = (progress * totalSlides) % 1;
                            gsap.to(img, {
                                scale: 1 + slideProgress * 0.5,
                                opacity: 1,
                                filter: 'blur(0px)',
                                duration: 0.1,
                                overwrite: true
                            });
                        } else {
                            // Other Slides
                            img.classList.remove('active');
                            if (tunnelContentItems[i]) tunnelContentItems[i].classList.remove('active');

                            if (i < slideIndex) {
                                // Past Slides (Zoom out and fade)
                                gsap.to(img, {
                                    scale: 1.5 + (slideIndex - i) * 0.5,
                                    opacity: 0,
                                    filter: 'blur(10px)',
                                    duration: 0.5,
                                    overwrite: true
                                });
                            } else {
                                // Future Slides (Small and hidden)
                                gsap.to(img, {
                                    scale: 0.25,
                                    opacity: 0,
                                    filter: 'blur(10px)',
                                    duration: 0.5,
                                    overwrite: true
                                });
                            }
                        }
                    });
                }
            });

            return () => {
                // Cleanup when media query doesn't match
                // GSAP matchMedia handles most revert logic, but we explicitly reset styles if needed
                gsap.set([tunnelImages, '.tunnel-content'], { clearProps: "all" });
            };
        },

        // Mobile fallback (optional cleanup)
        "(max-width: 899px)": function () {
            gsap.set([tunnelImages, '.tunnel-content'], { clearProps: "all" });
            // Ensure active classes are removed or handled by CSS
            tunnelImages.forEach(img => img.classList.remove('active'));
            tunnelContentItems.forEach(item => item.classList.remove('active'));
        }
    });
}

/* ========================================
   Service Hover Effect
   ======================================== */
function initServiceHover() {
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        const mask = item.querySelector('.service-mask');

        item.addEventListener('mouseenter', () => {
            // Handled by CSS for clip-path
            // We can add GSAP punchy rotation or scale here if needed
        });

        item.addEventListener('mousemove', (e) => {
            // Optional: Tilt effect
            // const rect = item.getBoundingClientRect();
            // const x = e.clientX - rect.left;
            // const y = e.clientY - rect.top;
        });

        item.addEventListener('mouseleave', () => {
            // Reset
        });
    });
}

/* ========================================
   Work Hover Effect
   ======================================== */
function initWorkHover() {
    // Basic hover is handled by CSS
    // Add scroll reveal animations

    const workItems = document.querySelectorAll('.work-item');

    workItems.forEach(item => {
        gsap.from(item, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            }
        });
    });
}

/* ========================================
   Perspectives Section
   ======================================== */
function initPerspectives() {
    const perspectives = document.querySelectorAll('.perspective-item');

    perspectives.forEach((item, index) => {
        gsap.from(item, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                delay: index * 0.1
            }
        });
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

        // Animate
        gsap.to(particle, {
            y: '+=100',
            x: '+=' + (Math.random() * 50 - 25),
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Title 3D Effect on Mouse Move
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

/* ========================================
   Contact Section
   ======================================== */
function initContactSection() {
    const contact = document.querySelector('.contact');

    if (!contact) return;

    gsap.from('.contact-title span', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 60%'
        }
    });

    // Form Inputs Animation
    const inputs = document.querySelectorAll('.form-group input');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            // Optional focus logic
        });
    });

    // Form Submit
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = document.getElementById('submit-btn');
            const btnText = btn.querySelector('.btn-text');

            // Simulation
            btnText.textContent = 'Sending...';

            setTimeout(() => {
                btnText.textContent = 'Message Sent';
                gsap.to(btn, {
                    backgroundColor: '#fe6e00',
                    valid: true,
                    duration: 0.3
                });
                form.reset();

                // Announce for screen reader users
                announce('Message sent. Thank you.');

                setTimeout(() => {
                    btnText.textContent = 'Send';
                    gsap.to(btn, {
                        backgroundColor: 'transparent',
                        duration: 0.3
                    });
                }, 3000);
            }, 1500);
        });
    }
}

/* ========================================
   Social Links Hover
   ======================================== */
function initSocialLinks() {
    const links = document.querySelectorAll('.social-link');

    links.forEach(link => {
        const text = link.getAttribute('data-text');

        // We could do a text scramble effect here if desired
        // For now, CSS hover is handling the visual change
    });
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
   Floating CTA
   ======================================== */
function initFloatingCTA() {
    const cta = document.getElementById('floating-cta');
    if (!cta) return;

    // Initial hidden state
    gsap.set(cta, { autoAlpha: 0, y: 20 });

    // Reveal when user scrolls a bit
    ScrollTrigger.create({
        start: 'top top+=200',
        onEnter: () => gsap.to(cta, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }),
        onLeaveBack: () => gsap.to(cta, { autoAlpha: 0, y: 20, duration: 0.4 })
    });

    // Smooth scroll to contact using Lenis when available
    cta.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#contact');
        if (!target) return;
        if (typeof lenis !== 'undefined' && lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(target, { offset: -80 });
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Magnetic nudge (subtle) handled via mousemove
    cta.addEventListener('mousemove', (e) => {
        const rect = cta.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
        gsap.to(cta, { x, y, duration: 0.25, ease: 'power2.out' });
    });

    cta.addEventListener('mouseleave', () => {
        gsap.to(cta, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
}

/* ========================================
   Parallax Video Showcase
   ======================================== */
function initParallaxShowcase() {
    const section = document.querySelector('.live-section');
    if (!section) return;

    // Reveal Animation (support both `.parallax-card` and `.parallax-video-card`)
    const cards = section.querySelectorAll('.parallax-card, .parallax-video-card');
    gsap.to(cards, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Parallax Effect
    // Left column moves slower (appears further away) or opposing direction
    // User asked for "Left parallax effect", usually simple shift
    const leftCol = section.querySelector('.parallax-col.left');
    const rightCol = section.querySelector('.parallax-col.right');

    if (leftCol && window.innerWidth > 900) {
        gsap.to(leftCol, {
            yPercent: 10, // Moves down slightly as we scroll down
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    if (rightCol && window.innerWidth > 900) {
        gsap.to(rightCol, {
            yPercent: -10, // Moves up slightly as we scroll down
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

/* ========================================
   Work Item Interactions (Tilt + subtle parallax)
   ======================================== */
function initWorkInteractions() {
    const workItems = document.querySelectorAll('.work-item');
    if (!workItems.length) return;

    workItems.forEach(item => {
        const img = item.querySelector('.work-image img');
        if (!img) return;

        // Mouse tilt on desktop
        item.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return;
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateY = x * 6; // degrees
            const rotateX = -y * 6;
            const translateZ = 20;

            gsap.to(img, {
                rotationX: rotateX,
                rotationY: rotateY,
                z: translateZ,
                transformPerspective: 800,
                transformOrigin: 'center center',
                duration: 0.45,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(img, { rotationX: 0, rotationY: 0, z: 0, duration: 0.7, ease: 'elastic.out(1,0.6)' });
        });

        // Keyboard focus: reveal slight scale
        item.setAttribute('tabindex', '0');
        item.addEventListener('focus', () => {
            gsap.to(img, { scale: 1.05, duration: 0.45, ease: 'power3.out' });
        });
        item.addEventListener('blur', () => {
            gsap.to(img, { scale: 1, duration: 0.45, ease: 'power3.out' });
        });
    });
}

/* ========================================
   Service Hover / Focus Reveal
   ======================================== */
function initServiceInteractions() {
    const services = document.querySelectorAll('.service-item');
    if (!services.length) return;

    services.forEach(item => {
        const mask = item.querySelector('.service-mask');

        function open() {
            item.classList.add('open');
            gsap.to(mask, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power3.out' });
        }

        function close() {
            item.classList.remove('open');
            gsap.to(mask, { clipPath: 'inset(0% 50% 0% 50%)', duration: 0.45, ease: 'power3.inOut' });
        }

        item.addEventListener('mouseenter', () => {
            open();
        });

        item.addEventListener('mouseleave', () => {
            close();
        });

        // Keyboard accessibility
        item.addEventListener('focus', () => {
            open();
        });

        item.addEventListener('blur', () => {
            close();
        });

        // Touch toggle: first tap opens, second follows link (if any)
        let touched = false;
        item.addEventListener('touchstart', (e) => {
            if (!touched) {
                e.preventDefault();
                open();
                touched = true;
                setTimeout(() => { touched = false; }, 800);
            }
        }, { passive: false });
    });
}

/* ========================================
   Live Section Enhancements
   - tilt on mousemove
   - play/pause toggle
   - reveal animation (ensures visible)
======================================== */
function initLiveSection() {
    const section = document.querySelector('.live-section');
    if (!section) return;

    const cards = section.querySelectorAll('.parallax-video-card');

    // Reveal if JS left them hidden
    gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', overwrite: true });

    cards.forEach(card => {
        const video = card.querySelector('video');
        const btn = card.querySelector('.video-play');

        // Tilt effect
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotY = x * 6;
            const rotX = -y * 6;
            gsap.to(card, { rotationY: rotY, rotationX: rotX, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
            gsap.to(video, { scale: 1.03, duration: 0.6, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.9, ease: 'elastic.out(1,0.6)' });
            gsap.to(video, { scale: 1, duration: 0.8, ease: 'power2.out' });
        });

        // Play/pause via button & keyboard
        if (btn && video) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    btn.textContent = '❚❚';
                    announce('Video playing');
                } else {
                    video.pause();
                    btn.textContent = '▶';
                    announce('Video paused');
                }
            });

            // Make button focusable
            btn.setAttribute('tabindex', '0');
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') btn.click();
            });
        }

        // Autoplay fallback: ensure video plays if allowed, otherwise show poster and allow user to play
        try {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // autoplay succeeded
                }).catch(() => {
                    // muted autoplay may be blocked; leave muted and show play button
                    video.muted = true;
                });
            }
        } catch (e) {
            // ignore
        }
    });
}

/* ========================================
   Lanyard (Matter.js + Custom Render)
   ======================================== */
function initLanyard() {
    const canvas = document.getElementById('lanyard-canvas');
    if (!canvas || !window.Matter) return;

    const ctx = canvas.getContext('2d');

    // Matter.js Aliases
    const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Bodies = Matter.Bodies;

    // Engine Setup
    const engine = Engine.create();
    const world = engine.world;
    engine.gravity.y = 1.2;

    // Dimensions
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;

    // Resize Handler
    function onResize() {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', onResize);
    onResize();

    // Create Chain
    // Use a stack of small bodies as the rope
    const segments = 10;
    const startX = width * 0.7; // Start slightly to the right 
    const startY = 0;
    const segmentLength = 25;

    const group = Body.nextGroup(true);

    const rope = Composites.stack(startX, startY, segments, 1, 0, 0, function (x, y) {
        return Bodies.rectangle(x, y, 10, 10, {
            collisionFilter: { group: group },
            frictionAir: 0.05,
            render: { visible: false }
        });
    });

    Composites.chain(rope, 0.5, 0, -0.5, 0, {
        stiffness: 0.8,
        damping: 0.1,
        length: segmentLength,
        render: { visible: false }
    });

    // Fix the Top
    const topAnchor = Constraint.create({
        bodyB: rope.bodies[0],
        pointB: { x: 0, y: 0 },
        pointA: { x: startX, y: -20 },
        stiffness: 0.8
    });

    // Create The Card Body
    const cardBody = Bodies.rectangle(startX, startY + segments * segmentLength, 160, 220, {
        collisionFilter: { group: group },
        frictionAir: 0.02,
        chamfer: { radius: 10 },
        density: 0.005,
        render: { visible: false }
    });

    // Constrain Card to Rope
    const lastRopeBody = rope.bodies[rope.bodies.length - 1];
    const cardConstraint = Constraint.create({
        bodyA: lastRopeBody,
        bodyB: cardBody,
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: -100 }, // Attach near top of card
        stiffness: 0.8
    });

    Composite.add(world, [rope, topAnchor, cardBody, cardConstraint]);

    // Mouse Interaction
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    mouseConstraint.mouse.pixelRatio = window.devicePixelRatio || 1;
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    Composite.add(world, mouseConstraint);

    // Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Render Loop
    (function renderLoop() {
        requestAnimationFrame(renderLoop);

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Logical pixels
        ctx.clearRect(0, 0, width * dpr * 2, height * dpr * 2);

        // Draw Rope (Quadratic Curve Spline)
        ctx.beginPath();
        ctx.moveTo(topAnchor.pointA.x, topAnchor.pointA.y);

        let points = rope.bodies.map(b => b.position);

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = (i === 0) ? topAnchor.pointA : points[i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];

            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;

            if (i === 0) {
                ctx.lineTo(p1.x, p1.y);
            } else {
                ctx.quadraticCurveTo(p1.x, p1.y, mx, my);
            }
        }

        const lastBody = points[points.length - 1];
        ctx.lineTo(lastBody.x, lastBody.y);


        ctx.lineWidth = 4;
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw Card
        const pos = cardBody.position;
        const angle = cardBody.angle;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        const w = 160;
        const h = 220;

        // Card Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;

        // Card Base
        ctx.fillStyle = '#111';
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, 12);
            ctx.fill();
        } else {
            ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        ctx.shadowColor = 'transparent';

        // Card Border
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Header Strip
        ctx.fillStyle = '#fe6e00';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.fillRect(-w / 2, -h / 2, w, 6);
        }

        // Clip/Hole
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.arc(0, -h / 2 + 20, 8, 0, Math.PI * 2);
        ctx.fill();

        // Text
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = '700 12px "Inter", sans-serif';
        ctx.fillText('TRIMATIC', 0, -h / 2 + 50);

        ctx.fillStyle = '#666';
        ctx.font = '400 10px "Inter", sans-serif';
        ctx.fillText('ACCESS PASS', 0, -h / 2 + 65);

        // Photo Placeholder
        ctx.fillStyle = '#222';
        ctx.fillRect(-50, -30, 100, 100);

        // Icon / Logo Placeholder in Photo
        ctx.strokeStyle = '#fe6e00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-30, 20);
        ctx.lineTo(0, 0);
        ctx.lineTo(30, 20);
        ctx.stroke();

        ctx.fillStyle = '#fe6e00';
        ctx.font = '700 16px "Inter", sans-serif';
        ctx.fillText('VISITOR', 0, 100);

        ctx.restore();

    })();
}

/* ========================================
   🎬 SHOWREEL VIDEO PLAYER
   ======================================== */
function initShowreelPlayer() {
    const video = document.getElementById('showreel-video');
    const playBtn = document.getElementById('showreel-play');
    const muteBtn = document.getElementById('showreel-mute');
    const fullscreenBtn = document.getElementById('showreel-fullscreen');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');

    if (!video || !playBtn) return;

    // Play/Pause
    playBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playBtn.classList.add('playing');
        } else {
            video.pause();
            playBtn.classList.remove('playing');
        }
    });

    // Reset play button when video ends
    video.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
    });

    // Mute/Unmute
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
        });
    }

    // Fullscreen
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        });
    }

    // Progress Bar
    if (progressBar && progressFill) {
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressFill.style.width = `${progress}%`;
        });

        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            video.currentTime = percent * video.duration;
        });
    }
}

/* ========================================
   ⚡ CATEGORY FILTER SYSTEM
   ======================================== */
function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bentoItems = document.querySelectorAll('.bento-item');

    if (!filterBtns.length || !bentoItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items with GSAP animation
            bentoItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    gsap.to(item, {
                        scale: 1,
                        opacity: 1,
                        display: 'block',
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: 'back.out(1.7)',
                        onStart: () => {
                            item.classList.remove('hidden');
                        }
                    });
                } else {
                    gsap.to(item, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            item.classList.add('hidden');
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

/* ========================================
   🎥 BENTO GRID VIDEO HOVER
   ======================================== */
function initBentoVideoHover() {
    const bentoItems = document.querySelectorAll('.bento-item');

    bentoItems.forEach(item => {
        const video = item.querySelector('video');

        if (video) {
            item.addEventListener('mouseenter', () => {
                video.play().catch(err => console.log('Video play failed:', err));
            });

            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        }

        // Add 3D tilt effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;

            gsap.to(item, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

/* ========================================
   🎭 BEFORE/AFTER SLIDER
   ======================================== */
function initBeforeAfterSlider() {
    const container = document.getElementById('ba-container');
    if (!container) return;

    const after = container.querySelector('.ba-image.after');
    const handle = container.querySelector('.ba-handle');
    let isDragging = false;

    function updatePosition(x) {
        const rect = container.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        position = Math.max(0, Math.min(100, position));

        after.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        handle.style.left = `${position}%`;
    }

    // Mouse events
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        updatePosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        updatePosition(e.touches[0].clientX);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updatePosition(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/* ========================================
   📱 REELS VIDEO PLAYERS
   ======================================== */
function initReelsPlayers() {
    const reelCards = document.querySelectorAll('.reel-card');

    reelCards.forEach(card => {
        const video = card.querySelector('video');
        const playBtn = card.querySelector('.reel-play-btn');
        const overlay = card.querySelector('.reel-overlay');

        if (!video || !playBtn) return;

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (video.paused) {
                video.play();
                playBtn.style.opacity = '0';
                overlay.style.background = 'transparent';
            } else {
                video.pause();
                playBtn.style.opacity = '1';
                overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)';
            }
        });

        // Reset on video end
        video.addEventListener('ended', () => {
            playBtn.style.opacity = '1';
            overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)';
        });

        // Pause when clicked outside
        card.addEventListener('click', () => {
            if (!video.paused) {
                video.pause();
                playBtn.style.opacity = '1';
                overlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)';
            }
        });
    });
}

/* ========================================
   🧪 SHOWCASE LAB INTERACTIONS
   ======================================== */
function initShowcaseLab() {
    const tabs = document.querySelectorAll('.lab-tab');
    const panels = document.querySelectorAll('.lab-panel');
    const spotlightTiles = document.querySelectorAll('.spotlight-tile');

    if (!tabs.length || !panels.length) return;

    function activateMode(mode) {
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-mode') === mode;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });

        panels.forEach(panel => {
            const shouldShow = panel.getAttribute('data-mode') === mode;
            panel.classList.toggle('active', shouldShow);
            panel.hidden = !shouldShow;

            if (shouldShow) {
                gsap.fromTo(panel,
                    { y: 24, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
                );
            }
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.getAttribute('data-mode');
            if (mode) activateMode(mode);
        });

        tab.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

            const tabArray = Array.from(tabs);
            const currentIndex = tabArray.indexOf(tab);
            const direction = e.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (currentIndex + direction + tabArray.length) % tabArray.length;
            tabArray[nextIndex].focus();
            tabArray[nextIndex].click();
        });
    });

    spotlightTiles.forEach(tile => {
        const mediaVideo = tile.querySelector('video');

        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            tile.style.setProperty('--spotlight-x', `${x}%`);
            tile.style.setProperty('--spotlight-y', `${y}%`);
        });

        if (mediaVideo) {
            tile.addEventListener('mouseenter', () => {
                mediaVideo.play().catch(() => null);
            });

            tile.addEventListener('mouseleave', () => {
                mediaVideo.pause();
                mediaVideo.currentTime = 0;
            });
        }
    });
}

/* ========================================
   🎨 SCROLL ANIMATIONS FOR NEW SECTIONS
   ======================================== */
function initNewSectionsAnimations() {
    // Showreel Hero
    gsap.from('.showreel-header', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.showreel-hero',
            start: 'top 70%'
        }
    });

    gsap.from('.showreel-player', {
        y: 100,
        opacity: 0,
        scale: 0.9,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.showreel-player',
            start: 'top 75%'
        }
    });

    // Portfolio Showcase Header
    gsap.from('.showcase-header .header-left', {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.portfolio-showcase',
            start: 'top 70%'
        }
    });

    gsap.from('.showcase-header .header-right', {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.portfolio-showcase',
            start: 'top 70%'
        }
    });

    // Filter Tabs
    gsap.from('.filter-tabs .filter-btn', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.filter-tabs',
            start: 'top 80%'
        }
    });

    // Bento Grid Items
    gsap.from('.bento-item', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.bento-grid',
            start: 'top 75%'
        }
    });

    // Showcase Lab
    gsap.from('.showcase-lab-header', {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.showcase-lab',
            start: 'top 72%'
        }
    });

    gsap.from('.lab-mode-tabs .lab-tab', {
        y: 30,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.lab-mode-tabs',
            start: 'top 82%'
        }
    });

    gsap.from('.lab-panel.active .timeline-card, .lab-panel.active .layer-card, .lab-panel.active .spotlight-tile', {
        y: 55,
        opacity: 0,
        scale: 0.9,
        rotateX: -15,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.lab-modes',
            start: 'top 80%'
        }
    });

    // Before/After Section
    gsap.from('.before-after-section .section-header', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.before-after-section',
            start: 'top 70%'
        }
    });

    gsap.from('.ba-container', {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.ba-container',
            start: 'top 75%'
        }
    });

    // Reels Grid
    gsap.from('.reels-grid .reel-card', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.reels-grid',
            start: 'top 75%'
        }
    });

    // Services Cards
    gsap.from('.service-card', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.services-grid-new',
            start: 'top 75%'
        }
    });
}

/* ========================================
   ✨ SPOTLIGHT CARD EFFECT
   ======================================== */
function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ========================================
   ✨ FLOATING PARTICLES EFFECT
   ======================================== */
function initFloatingParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';

        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation duration
        const duration = Math.random() * 10 + 10;
        particle.style.animation = `floatParticle ${duration}s linear infinite`;

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.2;

        container.appendChild(particle);
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        .floating-particle {
            position: absolute;
            background: radial-gradient(circle, var(--color-accent), transparent);
            border-radius: 50%;
            pointer-events: none;
            filter: blur(2px);
        }

        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translate(${Math.random() * 200 - 100}px, -100vh) scale(0.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   📧 CONTACT FORM HANDLING
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form-new');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.submit-btn-new');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        // Show loading state
        btnText.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            btnText.textContent = 'Message Sent!';

            // Add success style
            btn.style.background = 'var(--color-accent)';
            btn.style.transform = 'scale(1.05)';

            // Announce for screen readers
            if (typeof announce === 'function') {
                announce('Message sent successfully. We\'ll get back to you soon!');
            }

            // Reset form
            setTimeout(() => {
                form.reset();
                btnText.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.transform = '';
            }, 3000);
        }, 1500);
    });
}

/* ========================================
   ✨ PREMIUM EFFECTS - Aceternity Inspired
   ======================================== */

// Sparkles Animation
function initSparkles() {
    const container = document.getElementById('sparklesContainer');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 8}s`;
        container.appendChild(sparkle);
    }
}

// Card Spotlight Mouse Tracking
function initCardSpotlightTracking() {
    const cards = document.querySelectorAll('.bento-item, .timeline-card, .service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Add Meteors to Sections
function initMeteors() {
    const sections = document.querySelectorAll('.hero, .showcase-lab, .services-new');

    sections.forEach(section => {
        for (let i = 0; i < 3; i++) {
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            meteor.style.left = `${Math.random() * 100}%`;
            meteor.style.animationDelay = `${Math.random() * 3}s`;
            meteor.style.animationDuration = `${2 + Math.random() * 2}s`;
            section.appendChild(meteor);
        }
    });
}

// Add Section Spotlights
function initSectionSpotlights() {
    const sections = document.querySelectorAll('.about, .services-new, .work');

    sections.forEach(section => {
        const spotlightContainer = document.createElement('div');
        spotlightContainer.className = 'section-spotlight';
        spotlightContainer.innerHTML = `
            <div class="spotlight-beam"></div>
            <div class="spotlight-beam"></div>
        `;
        section.style.position = 'relative';
        section.insertBefore(spotlightContainer, section.firstChild);
    });
}

// Add Lamp Glow to Headers
function initLampGlow() {
    const headers = document.querySelectorAll('.section-header, .showcase-lab-header');

    headers.forEach(header => {
        const lampGlow = document.createElement('div');
        lampGlow.className = 'lamp-glow';
        header.style.position = 'relative';
        header.insertBefore(lampGlow, header.firstChild);
    });
}

/* ========================================
   ✍️ TYPEWRITER EFFECT
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
   🔮 GLASSMORPHISM NAVBAR ON SCROLL
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

        // Only toggle glass depth — never hide
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
   📖 ABOUT TEXT WORD-BY-WORD REVEAL
   ======================================== */
function initAboutTextReveal() {
    const aboutText = document.getElementById('about-text');
    if (!aboutText) return;

    const text = aboutText.textContent.trim();
    const words = text.split(/\s+/);

    aboutText.innerHTML = words.map(word =>
        `<span class="word">${word}</span>`
    ).join(' ');

    const wordEls = aboutText.querySelectorAll('.word');

    ScrollTrigger.create({
        trigger: aboutText,
        start: 'top 80%',
        end: 'bottom 30%',
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const totalWords = wordEls.length;
            const highlightCount = Math.floor(progress * totalWords);

            wordEls.forEach((word, i) => {
                if (i <= highlightCount) {
                    word.classList.add('highlighted');
                } else {
                    word.classList.remove('highlighted');
                }
            });
        }
    });
}

/* ========================================
   💬 TESTIMONIALS INTERACTIONS
   ======================================== */
function initTestimonials() {
    const cards = document.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    // Mouse tracking for spotlight effect
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Scroll reveal animation
    gsap.from('.testimonial-card', {
        y: 80,
        opacity: 0,
        rotateX: -10,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.testimonials-track',
            start: 'top 80%'
        }
    });
}

/* ========================================
   🔗 SMOOTH SCROLL FOR NAV LINKS
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
   💧 RIPPLE CLICK EFFECT
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
   👁️ SCROLL REVEAL ANIMATIONS
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
   🌊 PARALLAX SECTIONS
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
   🖼️ IMAGE LAZY REVEAL
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

/* ========================================
   🔢 ANIMATED COUNTERS IN VIEW
   ======================================== */
function initSectionCountUp() {
    const counters = document.querySelectorAll('.reel-stats span');

    counters.forEach(counter => {
        const text = counter.textContent;
        const match = text.match(/([\d.]+)([A-Za-z+%]*\s*.*)/);

        if (match) {
            const targetNum = parseFloat(match[1]);
            const suffix = match[2];

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    let obj = { val: 0 };
                    gsap.to(obj, {
                        val: targetNum,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (targetNum >= 1) {
                                counter.textContent = Math.floor(obj.val * 10) / 10 + suffix;
                            } else {
                                counter.textContent = obj.val.toFixed(1) + suffix;
                            }
                        }
                    });
                }
            });
        }
    });
}


/* ════════════════════════════════════════════════════════════
   SERVICES SECTION — Tab Switching + Scroll Reveals
════════════════════════════════════════════════════════════ */
function initServicesSection() {
    // ── Title reveal ──────────────────────────────────────
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

    // ── Tab switching ──────────────────────────────────────
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
                const cards = targetPanel.querySelectorAll('.svc-card');
                gsap.fromTo(cards,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }
                );
            }
        });
    });

    // ── Initial card reveal ────────────────────────────────
    ScrollTrigger.create({
        trigger: '.sv-grid',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            const activeCards = document.querySelectorAll('.sv-panel.active .svc-card');
            gsap.fromTo(activeCards,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
            );
        }
    });
}


/* ════════════════════════════════════════════════════════════
   3D GLOBE CANVAS
════════════════════════════════════════════════════════════ */
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

    wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        targetRX = ((e.clientY - r.top)  / r.height - 0.5) * 0.6;
        targetRY = ((e.clientX - r.left) / r.width  - 0.5) * 0.8;
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


/* ════════════════════════════════════════════════════════════
   WORK SHOWCASE — Category Filter + Reveal
════════════════════════════════════════════════════════════ */
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
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return;
            const rect = card.getBoundingClientRect();
            const x    = (e.clientX - rect.left) / rect.width  - 0.5;
            const y    = (e.clientY - rect.top)  / rect.height - 0.5;
            gsap.to(card, { rotateX: -y * 8, rotateY: x * 8, y: -6, transformPerspective: 700, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
        });
    });
}


/* ════════════════════════════════════════════════════════════
   PRICING SECTION — Cards + Feature Stagger
════════════════════════════════════════════════════════════ */
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


/* ════════════════════════════════════════════════════════════
   CONTACT SECTION — Cinematic Reveal + Channel Stagger
════════════════════════════════════════════════════════════ */
function initContactAnimations() {
    /* ── header reveals ── */
    gsap.to('.cs-eyebrow', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-section', start: 'top 70%', once: true }
    });
    gsap.to('.cs-title-word', {
        y: '0%', duration: 1.2, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: '.contact-section', start: 'top 65%', once: true }
    });
    gsap.to('.cs-sub', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4,
        scrollTrigger: { trigger: '.contact-section', start: 'top 65%', once: true }
    });

    /* ── left column ── */
    gsap.to('.cs-avail-badge', {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.cs-body', start: 'top 82%', once: true }
    });
    gsap.to('.cs-channel', {
        opacity: 1, x: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: '.cs-channels', start: 'top 85%', once: true }
    });

    /* ── right column (form card) ── */
    gsap.to('.cs-right', {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.25,
        scrollTrigger: { trigger: '.cs-body', start: 'top 82%', once: true }
    });

    /* ── footer bar ── */
    gsap.to('.cs-footer-bar', {
        opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.cs-footer-bar', start: 'top 92%', once: true }
    });

    /* ── Contact form submission ── */
    const form    = document.getElementById('csForm');
    const success = document.getElementById('csFormSuccess');
    if (!form || !success) return;

    const btn     = form.querySelector('.cs-form__submit');
    const btnText = form.querySelector('.cs-submit-text');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Basic validation */
        const name  = form.querySelector('#cf-name').value.trim();
        const email = form.querySelector('#cf-email').value.trim();
        const msg   = form.querySelector('#cf-msg').value.trim();
        if (!name || !email || !msg) return;

        /* Loading state */
        if (btn)     btn.disabled = true;
        if (btnText) btnText.textContent = 'Sending…';

        /* Simulate send — swap for Formspree / EmailJS in production */
        setTimeout(() => {
            /* Hide fields, show success */
            Array.from(form.elements).forEach(el => {
                if (el !== btn) el.style.opacity = '0';
            });
            btn.style.display = 'none';

            success.removeAttribute('hidden');
            gsap.from(success, { opacity: 0, y: 10, duration: 0.5, ease: 'power3.out' });

            form.reset();
        }, 900);
    });
}


/* ════════════════════════════════════════════════════════════
   FLOWING SERVICES — ReactBits Flowing-Menu
════════════════════════════════════════════════════════════ */
function initFlowingServices() {
    const rows = document.querySelectorAll('.fs-row');
    if (!rows.length) return;

    // Scroll-reveal for the section header
    gsap.from('.flowing-services .section-label', {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.flowing-services', start: 'top 80%', once: true }
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


/* ════════════════════════════════════════════════════════════
   CIRCULAR GALLERY — 3-D Drag Carousel
════════════════════════════════════════════════════════════ */
function initCircularGallery() {
    const ring      = document.getElementById('dgRing');
    const stage     = document.getElementById('dgStage');
    const lightbox  = document.getElementById('dgLightbox');
    const lbClose   = document.getElementById('dgLbClose');
    const lbBackdrop = document.getElementById('dgLbBackdrop');
    const lbVisual  = document.getElementById('dgLbVisual');
    const lbNum     = document.getElementById('dgLbNum');
    const lbTitle   = document.getElementById('dgLbTitle');
    const prevBtn   = document.getElementById('dgPrev');
    const nextBtn   = document.getElementById('dgNext');
    const idxEl     = document.getElementById('dgIdx');
    if (!ring || !stage) return;

    const cards   = Array.from(ring.querySelectorAll('.dg-card'));
    const N       = cards.length;
    const STEP    = 360 / N;   // 36°
    const TITLES  = [
        'Logo Design', 'Brand Identity', 'Thumbnails', 'Social Media',
        'Cover Pages', 'Motion Intros', 'Color Grading', 'LUT Packs',
        'Brand Materials', 'Poster Design'
    ];

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

    // ── Rotation state ──
    let rotAngle = 0;     // current angle (degrees)
    let targetAngle = 0;  // snapped target
    let raf = null;
    let inView = false;

    // Active card index → card at front
    function frontIndex() {
        // normalize negative to 0-360
        const norm = ((-rotAngle % 360) + 360) % 360;
        return Math.round(norm / STEP) % N;
    }

    function updateActive() {
        const fi = frontIndex();
        cards.forEach((c, i) => {
            c.classList.toggle('dg-card--active', i === fi);
            // Fade/dim farther cards
            const rawDiff = Math.abs(((i * STEP + rotAngle) % 360 + 360) % 360);
            const diff = Math.min(rawDiff, 360 - rawDiff);
            const t = diff / 180; // 0=front,1=back
            const dimVal = gsap.utils.interpolate(1, 0.35, t);
            c.style.filter = `brightness(${dimVal})`;
            c.style.opacity = diff > 120 ? '0.25' : '1';
        });
        if (idxEl) {
            idxEl.textContent = String(fi + 1).padStart(2, '0');
        }
    }

    // ── RAF loop ──
    let autoSpin = true;
    let spinning = false;
    const AUTO_SPEED = 0.12;

    function tick() {
        if (!inView) { raf = null; return; }
        raf = requestAnimationFrame(tick);

        if (autoSpin && !isDragging) {
            rotAngle += AUTO_SPEED;
            targetAngle = rotAngle;
        } else if (!isDragging) {
            // Snap tween
            rotAngle += (targetAngle - rotAngle) * 0.08;
        }

        ring.style.transform = `translate(-50%, -50%) rotateY(${rotAngle}deg)`;
        updateActive();
    }

    function startLoop() { if (!raf && inView) { raf = requestAnimationFrame(tick); } }
    function stopLoop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    // ScrollTrigger visibility
    ScrollTrigger.create({
        trigger: '.design-gallery',
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter:      () => { inView = true;  startLoop(); },
        onLeave:      () => { inView = false; stopLoop();  },
        onEnterBack:  () => { inView = true;  startLoop(); },
        onLeaveBack:  () => { inView = false; stopLoop();  }
    });

    // ── Drag ──
    let isDragging = false;
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
        const dx = x - dragX0;
        rotAngle = rotAngle0 + dx * 0.35;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        stage.style.cursor = 'grab';
        // Snap to nearest card
        const norm = ((-rotAngle % 360) + 360) % 360;
        const snapIdx = Math.round(norm / STEP) % N;
        targetAngle = rotAngle + (((-snapIdx * STEP - rotAngle) % 360 + 360) % 360);
        // Simplify: find the nearest multiple of -STEP that is close to current
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

    // ── Pause auto-spin on hover ──
    stage.addEventListener('mouseenter', () => { autoSpin = false; });
    stage.addEventListener('mouseleave', () => { if (!isDragging) autoSpin = true; });

    // ── Prev / Next buttons ──
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    function navigate(dir) {
        autoSpin = false;
        targetAngle = rotAngle - dir * STEP;
    }

    // ── Card click → lightbox ──
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            const fi = frontIndex();
            if (i !== fi) {
                // Navigate toward clicked card instead of open lightbox
                const diff = ((i - fi) + N) % N;
                const dir  = diff <= N / 2 ? diff : diff - N;
                navigate(-dir);
                return;
            }
            openLightbox(i);
        });
    });

    function openLightbox(i) {
        if (!lightbox || !lbVisual) return;
        lightbox.removeAttribute('hidden');

        // Clone card vis into lightbox
        lbVisual.innerHTML = '';
        const srcVis = cards[i].querySelector('.dg-card-vis');
        if (srcVis) {
            const clone = srcVis.cloneNode(true);
            lbVisual.appendChild(clone);
        }
        if (lbNum)   lbNum.textContent   = String(i + 1).padStart(2, '0');
        if (lbTitle) lbTitle.textContent = TITLES[i] || '';

        // Animate in
        gsap.fromTo(lightbox.querySelector('.dg-lb-backdrop'),
            { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
        gsap.fromTo(lightbox.querySelector('.dg-lb-card'),
            { opacity: 0, scale: 0.88, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.5)' });
    }

    function closeLightbox() {
        if (!lightbox) return;
        gsap.to(lightbox.querySelector('.dg-lb-card'),
            { opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: 'power2.in',
              onComplete: () => lightbox.setAttribute('hidden', '') });
    }

    if (lbClose)   lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // ── Section reveal ──
    const tl = gsap.timeline({
        scrollTrigger: { trigger: '.design-gallery', start: 'top 72%', once: true }
    });
    tl.to('.dg-tw', {
        y: '0%', duration: 1.1, stagger: 0.18, ease: 'expo.out'
    }).to('.dg-hint', {
        opacity: 1, duration: 0.8, ease: 'power3.out'
    }, '-=0.4');
}


/* ════════════════════════════════════════════════════════════
   MAGIC BENTO SPOTLIGHT — cursor-tracked glow on cards
════════════════════════════════════════════════════════════ */
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

            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
                const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
                el.style.setProperty('--sx', x);
                el.style.setProperty('--sy', y);
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


/* ════════════════════════════════════════════════════════════
   TARGET CURSOR BRACKETS — 4-corner bracket snapping
════════════════════════════════════════════════════════════ */
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
