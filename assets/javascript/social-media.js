/* ═══════════════════════════════════════════════════════
   SOCIAL MEDIA PAGE — JavaScript
   Handles: Custom cursor, hero entrance, scroll reveals,
            IG grid hover, GSAP timeline, header scroll
═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── CUSTOM CURSOR ──────────────────────────────────────
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        }
    });

    (function animateCursor() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
        }
        requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .sm-account-card, .sm-svc-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor)     cursor.style.transform     = 'translate(-50%,-50%) scale(2.5)';
            if (cursorRing) cursorRing.style.transform = 'translate(-50%,-50%) scale(1.4)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursor)     cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
            if (cursorRing) cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    });

    // ── HERO ENTRANCE ─────────────────────────────────────
    function heroEntrance() {
        const eyebrow  = document.getElementById('sm-eyebrow');
        const content  = document.getElementById('sm-hero-content');
        const badges   = document.getElementById('sm-badges');
        const scrollInd = document.getElementById('sm-scroll-ind');

        const animate = (el, delay, styles) => {
            if (!el) return;
            setTimeout(() => {
                Object.assign(el.style, { transition: 'opacity 0.9s ease, transform 0.9s ease', ...styles });
            }, delay);
        };

        animate(eyebrow,   200,  { opacity: '1', transform: 'translateY(0)' });
        animate(content,   600,  { opacity: '1', transform: 'translateY(0)' });
        animate(badges,    1000, { opacity: '1' });
        animate(scrollInd, 1400, { opacity: '1' });
    }

    // ── HERO GRID ANIMATION ───────────────────────────────
    function initHeroGrid() {
        const tiles = document.querySelectorAll('.sm-grid-tile');
        // Stagger initial entrance
        tiles.forEach((tile, i) => {
            tile.style.opacity  = '0';
            tile.style.transform = 'scale(1.1)';
            setTimeout(() => {
                tile.style.transition = `opacity 1s ease ${i * 80}ms, transform 1.2s ease ${i * 80}ms`;
                tile.style.opacity   = '';
                tile.style.transform = '';
            }, 100);
        });
    }

    // ── SCROLL PARALLAX ON HERO ───────────────────────────
    function initParallax() {
        const heroGrid    = document.getElementById('sm-hero-grid');
        const heroContent = document.getElementById('sm-hero-content');

        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (heroGrid)    heroGrid.style.transform    = `scale(1.08) translateY(${sy * 0.2}px)`;
            if (heroContent) {
                heroContent.style.opacity   = String(Math.max(0, 1 - sy / 500));
                heroContent.style.transform = `translateY(${sy * 0.12}px)`;
            }
        }, { passive: true });
    }

    // ── SCROLL REVEAL ─────────────────────────────────────
    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-sm-reveal]');

        const isMobile = window.innerWidth <= 768;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const siblings = Array.from(
                    entry.target.parentElement.querySelectorAll('[data-sm-reveal]')
                );
                const index = siblings.indexOf(entry.target);
                const delay = index * 130;

                setTimeout(() => {
                    entry.target.style.opacity   = '';
                    entry.target.style.transform = '';
                    entry.target.classList.add('is-visible');
                }, delay);

                observer.unobserve(entry.target);
            });
        }, { 
            threshold: isMobile ? 0.05 : 0.12, 
            rootMargin: isMobile ? '0px 0px -150px 0px' : '0px 0px -50px 0px' 
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ── IG GRID HOVER — individual cell zoom ─────────────
    function initIGGridHover() {
        document.querySelectorAll('.sm-ig-cell').forEach(cell => {
            cell.addEventListener('mouseenter', () => {
                cell.style.filter = 'brightness(1.15)';
            });
            cell.addEventListener('mouseleave', () => {
                cell.style.filter = '';
            });
        });
    }

    // ── JOURNEY NODE ANIMATION ────────────────────────────
    function initJourneyAnimation() {
        const middle = document.querySelector('.sm-journey-middle');
        if (!middle) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.2s';
                entry.target.style.opacity    = '1';
                entry.target.style.transform  = 'scale(1)';
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.3 });

        observer.observe(middle);
    }

    // ── GSAP ENHANCEMENTS ─────────────────────────────────
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth <= 768;

        // Account cards stagger
        gsap.utils.toArray('.sm-account-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 60,
                duration: 0.9,
                delay: i * 0.18,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: isMobile ? 'top 75%' : 'top 82%',
                    once: true
                }
            });
        });

        // Result numbers — word pulse
        gsap.utils.toArray('.sm-result-num').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: isMobile ? 'top 75%' : 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.from(el, {
                        opacity: 0,
                        y: 20,
                        scale: 0.85,
                        duration: 0.7,
                        ease: 'back.out(1.5)'
                    });
                }
            });
        });

        // Services items stagger
        gsap.utils.toArray('.sm-svc-item').forEach((item, i) => {
            gsap.from(item, {
                opacity: 0,
                y: 30,
                duration: 0.7,
                delay: i * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: isMobile ? 'top 75%' : 'top 85%',
                    once: true
                }
            });
        });

        // Floating tiles in CTA — subtle continuous float
        gsap.utils.toArray('.sm-cta-tile').forEach((tile, i) => {
            gsap.to(tile, {
                y: '-=14',
                rotation: `+=${2 + i}`,
                duration: 3 + i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.7
            });
        });

        // Hero grid tiles subtle drift
        gsap.utils.toArray('.sm-grid-tile').forEach((tile, i) => {
            gsap.to(tile, {
                scale: 1.04 + (i % 3) * 0.01,
                duration: 6 + i * 0.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.3
            });
        });
    }

    // ── HEADER SCROLL ─────────────────────────────────────
    function initHeaderScroll() {
        const header = document.getElementById('site-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.style.background     = 'rgba(0,5,16,0.92)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.borderBottom   = '1px solid rgba(159,69,176,0.15)';
            } else {
                header.style.background     = '#000510';
                header.style.backdropFilter = 'none';
                header.style.borderBottom   = 'none';
            }
        }, { passive: true });
    }

    // ── ACCOUNT CARD TILT ─────────────────────────────────
    function initCardTilt() {
        document.querySelectorAll('.sm-account-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect  = card.getBoundingClientRect();
                const x     = (e.clientX - rect.left) / rect.width  - 0.5;
                const y     = (e.clientY - rect.top)  / rect.height - 0.5;
                const rotX  = -y * 8;
                const rotY  =  x * 8;
                card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }

    // ── INIT ──────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        heroEntrance();
        initHeroGrid();
        initParallax();
        initScrollReveal();
        initIGGridHover();
        initJourneyAnimation();
        initGSAP();
        initHeaderScroll();
        initCardTilt();
    });

})();
