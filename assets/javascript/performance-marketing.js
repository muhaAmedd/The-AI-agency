/* ═══════════════════════════════════════════════════════
   PERFORMANCE MARKETING PAGE — JavaScript
   Handles: Custom cursor, hero entrance, scroll reveals,
            GSAP animations, number counters.
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── CUSTOM CURSOR ──────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .pm-dash-card, .pm-number-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
            if (cursorRing) cursorRing.style.transform = 'translate(-50%,-50%) scale(1.4)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            if (cursorRing) cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    });

    // ── HERO ENTRANCE ANIMATION ───────────────────────────
    function heroEntrance() {
        const bgImg = document.querySelector('.pm-hero-bg-img');
        const eyebrow = document.getElementById('pm-eyebrow');
        const h1 = document.getElementById('pm-hero-h1');
        const actions = document.getElementById('pm-hero-actions');
        const scrollInd = document.getElementById('pm-scroll-ind');

        if (bgImg) {
            gsap.to(bgImg, { scale: 1, filter: "brightness(0.7) saturate(1)", duration: 2, ease: "power2.out" });
        }
        if (eyebrow) {
            gsap.from(eyebrow, { opacity: 0, y: 20, duration: 1, delay: 0.5, ease: "power2.out" });
        }
        if (h1) {
            gsap.from(h1, { opacity: 0, y: 30, duration: 1, delay: 0.7, ease: "power2.out" });
        }
        if (actions) {
            gsap.from(actions, { opacity: 0, y: 20, duration: 1, delay: 0.9, ease: "power2.out" });
        }
        if (scrollInd) {
            gsap.from(scrollInd, { opacity: 0, duration: 1, delay: 1.5 });
        }
    }

    // ── SCROLL REVEAL ─────────────────────────────────────
    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-pm-reveal]');

        const isMobile = window.innerWidth <= 768;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-pm-reveal]'));
                    const index = siblings.indexOf(entry.target);
                    const delay = index * 120;

                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: isMobile ? 0.05 : 0.15,
            rootMargin: isMobile ? '0px 0px -150px 0px' : '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ── GSAP ANIMATIONS & COUNTERS ────────────────────────
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth <= 768;

        // Number counters
        gsap.utils.toArray('.pm-num-val').forEach(el => {
            const target = el.getAttribute('data-target');
            if (target) {
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const numTarget = parseInt(target);

                ScrollTrigger.create({
                    trigger: el,
                    start: isMobile ? 'top 75%' : 'top 85%',
                    once: true,
                    onEnter: () => {
                        let obj = { val: 0 };
                        gsap.to(obj, {
                            val: numTarget,
                            duration: 2,
                            ease: "power3.out",
                            onUpdate: () => {
                                el.textContent = prefix + Math.floor(obj.val) + suffix;
                            }
                        });
                    }
                });
            }
        });

        // Dashboard charts animation
        gsap.utils.toArray('.pm-dash-chart svg path:nth-child(2)').forEach((path, i) => {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            
            ScrollTrigger.create({
                trigger: path,
                start: isMobile ? 'top 75%' : 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(path, { strokeDashoffset: 0, duration: 1.5, delay: i * 0.2, ease: "power2.out" });
                }
            });
        });
        
        // Dashboard gradient fill animation
        gsap.utils.toArray('.pm-dash-chart svg path:nth-child(1)').forEach((path, i) => {
             gsap.set(path, { opacity: 0, y: 10 });
             ScrollTrigger.create({
                trigger: path,
                start: isMobile ? 'top 75%' : 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(path, { opacity: 1, y: 0, duration: 1, delay: 0.5 + (i * 0.2), ease: "power2.out" });
                }
            });
        });
    }

    // ── HEADER SCROLL STYLE ───────────────────────────────
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.style.background = 'rgba(0,5,16,0.92)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.borderBottom = '1px solid rgba(159,69,176,0.15)';
            } else {
                header.style.background = '#000510';
                header.style.backdropFilter = 'none';
                header.style.borderBottom = 'none';
            }
        }, { passive: true });
    }

    // ── INIT ──────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        heroEntrance();
        initScrollReveal();
        initGSAP();
        initHeaderScroll();
    });

})();
