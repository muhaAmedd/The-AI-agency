/* ═══════════════════════════════════════════════════════
   MEDIA PRODUCTION PAGE — JavaScript
   Handles: Custom cursor, scroll reveals, hero animations,
            video play toggle, GSAP animations
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
            cursor.style.top  = mouseY + 'px';
        }
    });

    // Smooth ring follow
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        if (cursorRing) {
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top  = ringY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover state on links / buttons
    document.querySelectorAll('a, button, .mp-campaign-video-frame').forEach(el => {
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
        const eyebrow = document.getElementById('mp-eyebrow');
        const content = document.getElementById('mp-hero-content');
        const scrollInd = document.getElementById('mp-scroll-ind');
        const heroVideo = document.querySelector('.mp-hero-video');

        // Slight zoom out on hero video
        if (heroVideo) {
            // ── 7-SECOND LOOP ────────────────────────────────────────
            // Only load the first 7s and loop seamlessly. This avoids
            // buffering the entire video file as a background element.
            const LOOP_END = 7; // seconds

            heroVideo.addEventListener('loadedmetadata', () => {
                heroVideo.play().catch(() => {});
            });

            heroVideo.addEventListener('timeupdate', () => {
                if (heroVideo.currentTime >= LOOP_END) {
                    heroVideo.currentTime = 0;
                }
            });

            // If metadata already loaded (cached), play immediately
            if (heroVideo.readyState >= 1) {
                heroVideo.play().catch(() => {});
            }

            setTimeout(() => {
                heroVideo.style.transform = 'scale(1.0)';
            }, 500);
        }

        // Staggered fade-in
        if (eyebrow) {
            setTimeout(() => {
                eyebrow.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                eyebrow.style.opacity = '1';
                eyebrow.style.transform = 'translateY(0)';
            }, 300);
        }

        if (content) {
            setTimeout(() => {
                content.style.transition = 'opacity 1s ease, transform 1s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 600);
        }

        if (scrollInd) {
            setTimeout(() => {
                scrollInd.style.transition = 'opacity 0.8s ease';
                scrollInd.style.opacity = '1';
            }, 1400);
        }
    }

    // ── SCROLL REVEAL ─────────────────────────────────────
    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-mp-reveal]');

        const isMobile = window.innerWidth <= 768;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger within same parent
                    const siblings = Array.from(entry.target.parentElement.querySelectorAll('[data-mp-reveal]'));
                    const index = siblings.indexOf(entry.target);
                    const delay = index * 120;

                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                        // Reset inline transforms so animation takes over
                        entry.target.style.opacity = '';
                        entry.target.style.transform = '';
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: isMobile ? 0.05 : 0.15,
            rootMargin: isMobile ? '0px 0px -150px 0px' : '0px 0px -60px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ── VIDEO AUTOPLAY ON SCROLL + CLICK FOR SOUND ────────
    function initVideoHover() {
        const campaignFrames = document.querySelectorAll('.mp-campaign-video-frame');

        campaignFrames.forEach(frame => {
            const video   = frame.querySelector('.mp-campaign-video');
            const playBtn = frame.querySelector('.mp-play-btn');

            if (!video) return;

            // Autoplay silently when in view, pause when out of view
            const videoObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (video.dataset.src) {
                        video.src = video.dataset.src;
                        video.removeAttribute('data-src');
                        video.loop = true;
                        video.muted = true;
                    }
                    // Only attempt to play if it's paused
                    if (video.paused) {
                        video.play().catch(() => {});
                    }
                } else {
                    // Pause the video when it leaves the screen and reset to silent
                    if (!video.dataset.src && !video.paused) {
                        video.pause();
                        video.muted = true;
                        frame.classList.remove('is-playing-sound');
                    }
                }
            }, { rootMargin: '0px', threshold: 0 });

            videoObserver.observe(frame);

            // Click interaction
            playBtn && playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Edge case: if somehow clicked before observer triggered
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                    video.loop = true;
                }

                if (video.muted || video.paused) {
                    // It was silently autoplaying OR paused -> play from start with sound
                    video.currentTime = 0;
                    video.muted = false;
                    video.play();
                    frame.classList.add('is-playing-sound');
                } else {
                    // It was playing with sound -> pause it
                    video.pause();
                    frame.classList.remove('is-playing-sound');
                }
            });
        });
    }



    // ── PARALLAX ON SCROLL ────────────────────────────────
    function initParallax() {
        const heroVideo = document.querySelector('.mp-hero-video');
        const heroContent = document.getElementById('mp-hero-content');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Video parallax
            if (heroVideo) {
                heroVideo.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
            }

            // Hero content parallax
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                heroContent.style.opacity = Math.max(0, 1 - scrollY / 600) + '';
            }
        }, { passive: true });
    }

    // ── GSAP ANIMATIONS (if available) ────────────────────
    function initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth <= 768;

        // Animate timeline steps
        gsap.utils.toArray('.mp-timeline-step').forEach((step, i) => {
            gsap.from(step, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: step,
                    start: isMobile ? 'top 75%' : 'top 80%',
                    once: true
                }
            });
        });

        // Animate campaign headlines with text reveal
        gsap.utils.toArray('.mp-campaign-headline').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 30,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: isMobile ? 'top 75%' : 'top 80%',
                    once: true
                }
            });
        });

        // Stat card counters (simple numeric animation)
        gsap.utils.toArray('.mp-stat-num').forEach(el => {
            const text = el.textContent;
            const num = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.]/g, '');

            if (!isNaN(num) && num > 1) {
                let obj = { val: 0 };
                ScrollTrigger.create({
                    trigger: el,
                    start: isMobile ? 'top 75%' : 'top 85%',
                    once: true,
                    onEnter: () => {
                        gsap.to(obj, {
                            val: num,
                            duration: 1.8,
                            ease: 'power2.out',
                            onUpdate: () => {
                                el.textContent = (Number.isInteger(num)
                                    ? Math.round(obj.val)
                                    : obj.val.toFixed(1)) + suffix;
                            }
                        });
                    }
                });
            }
        });

        // Process icon-wrap hover effect glow
        gsap.utils.toArray('.mp-step-icon-wrap').forEach(wrap => {
            wrap.addEventListener('mouseenter', () => {
                gsap.to(wrap, { boxShadow: '0 0 50px rgba(229,78,208,0.4)', duration: 0.3 });
            });
            wrap.addEventListener('mouseleave', () => {
                gsap.to(wrap, { boxShadow: '0 0 20px rgba(68,0,139,0.2)', duration: 0.3 });
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
        initVideoHover();
        initParallax();
        initGSAP();
        initHeaderScroll();
    });

})();
