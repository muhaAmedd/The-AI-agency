gsap.registerPlugin(ScrollTrigger);

// �"?�"?�"? CURSOR �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

gsap.ticker.add(() => {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { width: 6, height: 6, duration: 0.2 });
        gsap.to(ring, { width: 64, height: 64, rotation: 90, duration: 0.3, ease: 'power2.out' });
        gsap.to(ring.querySelector('.cursor-hex-inner'), { opacity: 1, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { width: 12, height: 12, duration: 0.2 });
        gsap.to(ring, { width: 44, height: 44, rotation: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(ring.querySelector('.cursor-hex-inner'), { opacity: 0.6, duration: 0.3 });
    });
});

// �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.�
//  THREE �?" shared renderer / scene / camera (single ticker)
// �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.�
const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000510, 0.036);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.08, 220);
camera.position.z = 5;
camera.userData.restZ = 5;

const ambient = new THREE.AmbientLight(0x3a1a5c, 0.42);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffe4f2, 0.55);
keyLight.position.set(4, 6, 8);
scene.add(keyLight);

const pLight = new THREE.PointLight(0xe54ed0, 42, 40);
pLight.position.set(2.8, 1.6, 4);
scene.add(pLight);

const pLight2 = new THREE.PointLight(0x00076f, 28, 40);
pLight2.position.set(-3.2, -1.8, 3);
scene.add(pLight2);

const hemi = new THREE.HemisphereLight(0x2a1048, 0x000510, 0.35);
scene.add(hemi);

// "?"? Stars Background "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?// Detect mobile once — used to skip heavy Three.js features on phones
const isMobileDevice = window.innerWidth <= 768;

// Stars: 400 on mobile (lighter GPU load), 1500 on desktop
const starCount = isMobileDevice ? 400 : 1500;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 60;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffe4f2, size: 0.045, transparent: true, opacity: 0.8 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// �"?�"? 3 Purple Glowy Meteors �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const meteors = new THREE.Group();
scene.add(meteors);

function createMeteor() {
    const geo = new THREE.ConeGeometry(0.06, 5, 8);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x9f45b0,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const mesh = new THREE.Mesh(geo, mat);

    const headGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({
        color: 0xe54ed0,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.z = 2.5;
    mesh.add(head);

    return mesh;
}

function resetMeteor(mesh) {
    // Spawn in the top-right, far back
    mesh.position.set(
        10 + Math.random() * 20,
        10 + Math.random() * 15,
        -30 - Math.random() * 20
    );
    // Point diagonally towards bottom-left, forward
    mesh.lookAt(
        mesh.position.x - 30 - Math.random() * 10,
        mesh.position.y - 20 - Math.random() * 10,
        10 + Math.random() * 10
    );
    // Slower speed for a majestic feel
    mesh.userData.speed = 0.03 + Math.random() * 0.02;
}

// Meteors: desktop only — too heavy for mobile GPUs
if (!isMobileDevice) {
    for (let i = 0; i < 3; i++) {
        const m = createMeteor();
        resetMeteor(m);
        // Fast-forward them randomly so they are spread out initially
        m.translateZ(Math.random() * 30);
        meteors.add(m);
    }
}



// �"?�"? 2D hero logo (replaces logo.glb) �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const heroLogoEl = document.getElementById('hero-logo-wrapper');
const logoBaseScale = 1;
const logoTargetScale = 1.3;

// �"?�"? Motion Blur Velocity Tracker �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
let lastScrollY = 0;
let scrollVelocity = 0;
gsap.ticker.add(() => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Smooth the velocity to prevent jitter
    scrollVelocity += (Math.abs(delta) - scrollVelocity) * 0.15;

});

// �"?�"? Mouse state �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
let targetMX = 0, targetMY = 0, lerpMX = 0, lerpMY = 0;

// Mouse parallax — desktop only (touch users gain nothing from it)
if (!isMobileDevice) {
    document.addEventListener('mousemove', e => {
        targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
}

const clock = new THREE.Clock();

function render3D() {
    const t = clock.getElapsedTime();

    if (isMobileDevice) {
        // Mobile: gentle auto-rotation only, no mouse parallax computation
        stars.rotation.y = t * 0.003;
    } else {
        lerpMX += (targetMX - lerpMX) * 0.045;
        lerpMY += (targetMY - lerpMY) * 0.045;
        stars.rotation.y = t * 0.005 + lerpMX * 0.05;
        stars.rotation.x = lerpMY * 0.05;
    }

    meteors.children.forEach((mesh) => {
        const data = mesh.userData;
        mesh.translateZ(data.speed);

        if (mesh.position.z > 15 || mesh.position.x < -30 || mesh.position.y < -20) {
            resetMeteor(mesh);
        }
    });
    pLight.position.x = Math.sin(t * 0.65) * 3.8;
    pLight.position.y = Math.cos(t * 0.48) * 2.8;
    pLight2.position.x = Math.cos(t * 0.55) * 3.6;
    pLight2.position.y = Math.sin(t * 0.38) * 2.4;

    renderer.render(scene, camera);
}

gsap.ticker.add(render3D);
gsap.ticker.lagSmoothing(0);

// Pause Three.js render loop when the browser tab is hidden — saves CPU/GPU
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.ticker.remove(render3D);
    } else {
        gsap.ticker.add(render3D);
    }
});

let _prevIsMobile = window.innerWidth <= 768;
window.addEventListener('resize', () => {
    const _nowMobile = window.innerWidth <= 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // If user crosses the mobile/desktop threshold (e.g. device rotation)
    // reload so GSAP scroll animations re-initialise for the correct layout.
    if (_nowMobile !== _prevIsMobile) {
        _prevIsMobile = _nowMobile;
        window.location.reload();
        return;
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

// �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.�
//  ENTRANCE �?" logo revealed as loader fades, then scroll takes over
// �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.�

// �"?�"? 1. Setup initial states IMMEDIATELY so ScrollTrigger can measure correctly �"?�"?
if (heroLogoEl) {
    gsap.set(heroLogoEl, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: logoBaseScale,
        opacity: 1,
        visibility: 'visible',
        transformOrigin: '50% 50%'
    });
}
gsap.set('#ui', { opacity: 1 });       // Make entire UI visible
gsap.set('#site-header', { yPercent: -100 });
gsap.set('#hero-h1', { opacity: 0, scale: 0.95 });
// Set hero sub-elements to invisible so entrance can animate them in
gsap.set('.hero-eyebrow, .stats-bar, .hero-actions', { opacity: 0 });

function runEntrance() {
    // Mark loader as seen for this browser session
    sessionStorage.setItem('loaderSeen', '1');

    const isMob = window.innerWidth <= 768;

    // Fade loader OUT while logo is already visible behind it
    const tl = gsap.timeline();
    tl.to('#loader-back', { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
    tl.to('#loader-front', { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.2);

    // Clean up loader
    tl.to('#loader', { autoAlpha: 0, duration: 0.5 });
    tl.call(() => {
        const loader = document.getElementById('loader');
        loader.style.pointerEvents = 'none';
    });

    // Cinematic intro: reveal h1 with elegant scale and depth (atmospheric intro)
    // On mobile use translateZ(0) since perspective is disabled, but keep scale+opacity
    if (isMob) {
        tl.fromTo('#hero-h1',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' },
            '+=0.2'
        );
        // Stagger in the sub-elements below h1 (from slight y offset)
        tl.fromTo('.hero-eyebrow',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.8'
        );
        tl.fromTo('.hero-actions',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.7'
        );
        tl.fromTo('.stats-bar',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.6'
        );
        // Slide header down on mobile
        tl.to('#site-header', { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=1.5');
    } else {
        tl.fromTo('#hero-h1', {opacity:0, scale:0.95, z:-50}, {opacity:1, scale:1, z:0, duration:2.5, ease:'power3.out'}, '+=0.2');

        // Move logo backwards behind text and trigger dark shadow
        if (heroLogoEl) {
            tl.to(heroLogoEl, { z: -150, duration: 2.5, ease: 'power3.out' }, '-=2.5');
            tl.call(() => {
                const img = document.getElementById('hero-logo');
                if (img) img.classList.add('dark-shadowed');
            }, null, '-=2.5');
        }
    }
}

function skipEntrance() {
    // Instantly hide loader and show hero without any animation delay
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
    }
    gsap.set('#hero-h1', { opacity: 1, scale: 1, z: 0 });
    gsap.set('#site-header', { yPercent: 0, opacity: 1 });
    gsap.set('.hero-eyebrow, .stats-bar, .hero-actions, .hero-sub', { opacity: 1, x: 0, y: 0 });
    if (heroLogoEl) {
        const isMob = window.innerWidth <= 768;
        gsap.set(heroLogoEl, { z: -150, opacity: isMob ? 0 : 1 });
        if (!isMob) {
            const img = document.getElementById('hero-logo');
            if (img) img.classList.add('dark-shadowed');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Refresh ScrollTrigger when everything actually loads to fix heights
    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
    // Initialize scroll triggers immediately so browser can restore scroll position accurately
    initScroll();

    // ── LAZY-LOAD REEL VIDEOS ──────────────────────────────────────────────────
    // Videos only start downloading when the user scrolls near the Reels section.
    const reelSection = document.getElementById('reels');
    let reelsLoaded = false;

    if (reelSection) {
        const lazyObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !reelsLoaded) {
                reelsLoaded = true;
                lazyObserver.disconnect();

                const lazyVideos = reelSection.querySelectorAll('video[data-src]');
                lazyVideos.forEach((vid, i) => {
                    vid.src = vid.dataset.src;
                    vid.removeAttribute('data-src');
                    vid.load();
                    // Auto-play only the first (active) reel
                    if (i === 0) {
                        vid.loop = true;
                        vid.play().catch(() => {});
                    }
                });
            }
        }, {
            rootMargin: '200px 0px' // Start loading 200px before section enters viewport
        });

        lazyObserver.observe(reelSection);
    }
    // ──────────────────────────────────────────────────────────────────────────

    // Only show the loader on the very first visit of this browser session.
    // If the user navigates back from a service page, skip it entirely.
    if (sessionStorage.getItem('loaderSeen')) {
        skipEntrance();

        // If the URL has a hash (e.g. index.html#contact), scroll to that section
        // after a short delay so ScrollTrigger can finish refreshing first
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                }, 150);
            }
        }
    } else {
        // Wait for the CSS load bar to finish (~2.2s), then reveal
        setTimeout(runEntrance, 2200);
    }
});



// �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.�
//  SCROLL �?" 3-phase choreography
// �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.�
let scrollAnimationsInited = false;
let idleRotActive = true; // paused during scroll

function initScroll() {
    if (scrollAnimationsInited) return;
    scrollAnimationsInited = true;

    const isMobileView = window.innerWidth <= 768;

    if (isMobileView) {
        // Logo hidden on mobile
        if (heroLogoEl) gsap.set(heroLogoEl, { z: 0, opacity: 0 });

        // ── MOBILE SCROLL EFFECTS ─────────────────────────────────────────────

        // 1. H1 subtle upward parallax — title feels like it floats slower than the page
        gsap.to('#hero-h1', {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // 2. H1 color shift — lines 1 & 2 go purple, line 3 flips to white
        //    mirrors the desktop pinned-scroll effect but driven by normal scroll
        gsap.to('.hero-l1, .hero-l2', {
            color: '#7b1fa2',
            '-webkit-text-fill-color': '#7b1fa2',
            textShadow: '0 0 20px rgba(123,31,162,0.7), 0 0 40px rgba(123,31,162,0.35)',
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'center top',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        gsap.to('.hero-l3', {
            color: '#ffffff',
            '-webkit-text-fill-color': '#ffffff',
            textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.25)',
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'center top',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        // 3. Hero content exit — fades and lifts as Who We Are scrolls into view
        gsap.to('.hero-inner', {
            y: -50,
            opacity: 0,
            ease: 'power2.in',
            scrollTrigger: {
                trigger: '#who-we-are',
                start: 'top 90%',
                end: 'top 30%',
                scrub: 1.5
            }
        });

    } else {
        // "?"? DESKTOP ONLY: Hero pinned scroll choreography "?"?
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '+=200%',
                pin: true,
                scrub: 1.5,
                anticipatePin: 1,
                onUpdate: () => { idleRotActive = false; },
                onLeaveBack: () => { idleRotActive = true; }
            }
        });

        heroTl.fromTo('#light-sweep',
            { yPercent: 0 },
            { yPercent: -100, ease: 'power3.out', duration: 1 }, 1.2
        );
        heroTl.to('.hero-l1, .hero-l2', { color: '#7b1fa2', '-webkit-text-fill-color': '#7b1fa2', '-webkit-text-stroke': '2px #7b1fa2', textShadow: '0 0 18px rgba(123, 31, 162, 0.6), 0 0 40px rgba(123, 31, 162, 0.3)', duration: 0.8 }, 1.2);
        heroTl.to('.hero-l3', { background: 'none', color: '#ffffff', '-webkit-text-fill-color': '#ffffff', filter: 'none', textShadow: '0 0 18px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2)', duration: 0.8 }, 1.2);

        if (heroLogoEl) {
            heroTl.fromTo(heroLogoEl,
                { z: -150, scale: 1, xPercent: -50, yPercent: -50 },
                { z: -300, scale: 0.65, xPercent: -50, yPercent: -65, ease: 'power3.inOut', duration: 1 }, 1
            );
        }
        heroTl.fromTo('#site-header',
            { yPercent: -100, opacity: 1 },
            { yPercent: 0, opacity: 1, ease: 'power2.out', duration: 0.8, immediateRender: false }, 1.2
        );
        heroTl.fromTo('.hero-eyebrow', { opacity: 0, x: -80 }, { opacity: 1, x: 0, ease: 'power3.out', duration: 1 }, 1.2);
        heroTl.fromTo('.stats-bar', { opacity: 0, x: 80 }, { opacity: 1, x: 0, ease: 'power3.out', duration: 1 }, 1.3);
        heroTl.fromTo('.hero-actions', { opacity: 0, x: -80, y: 30 }, { opacity: 1, x: 0, y: 0, ease: 'power3.out', duration: 1 }, 1.4);
        heroTl.fromTo('.hero-sub', { opacity: 0, x: 80, y: 30 }, { opacity: 1, x: 0, y: 0, ease: 'power3.out', duration: 1 }, 1.5);
        heroTl.to({}, { duration: 1 }, 1);

        // �"?�"? PHASE 2 �?" Fade hero out when #who-we-are enters �"?�"?
        const heroFadeTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#who-we-are',
                start: 'top bottom',
                end: 'top center',
                scrub: 1.5,
                onUpdate: () => { idleRotActive = false; }
            }
        });
        if (heroLogoEl) heroFadeTl.to(heroLogoEl, { y: -120, opacity: 0, ease: 'power3.inOut', duration: 1 }, 0);
        heroFadeTl.to('.hero-inner', { y: -120, opacity: 0, ease: 'power3.inOut', duration: 1 }, 0);

        // �"?�"? PHASE 3A �?" ENTER: logo scales up 30% �"?�"?
        const enterTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#who-we-are',
                start: 'top bottom',
                end: 'top top',
                scrub: 3,
                onUpdate: () => { idleRotActive = false; }
            }
        });
        if (heroLogoEl) enterTl.fromTo(heroLogoEl, { scale: logoBaseScale }, { scale: logoTargetScale, ease: 'none', immediateRender: false }, 0);

        // �"?�"? PHASE 3B �?" EXIT: logo scales back �"?�"?
        const exitTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#who-we-are',
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 3,
                onUpdate: () => { idleRotActive = false; },
                onLeave: () => { idleRotActive = true; },
                onLeaveBack: () => { idleRotActive = false; }
            }
        });
        if (heroLogoEl) exitTl.fromTo(heroLogoEl, { scale: logoTargetScale }, { scale: logoBaseScale, ease: 'none', immediateRender: false }, 0);

        // �"?�"? WHO WE ARE full entrance (desktop) �"?�"?
        const whoTl = gsap.timeline({
            scrollTrigger: { trigger: '#who-we-are', start: 'top 40%', toggleActions: 'play none none none' }
        });
        whoTl.from('.who-content-left .section-eyebrow', { x: -40, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .from('.who-content-left .section-title', { y: 60, opacity: 0, scale: 0.95, duration: 1.2, ease: 'expo.out' }, '-=0.6')
            .from('.who-main-text', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1.0')
            .from('.who-sub-text p', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.6')
            .from('.who-highlight-box', { x: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6');
    }

    // �"?�"? WHO WE ARE simple entrance (mobile only) �"?�"?
    if (isMobileView) {
        const whoTlMobile = gsap.timeline({
            scrollTrigger: { trigger: '#who-we-are', start: 'top 80%', toggleActions: 'play none none none' }
        });
        whoTlMobile
            .from('.who-content-left .section-eyebrow', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
            .from('.who-content-left .section-title', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
            .from('.who-main-text', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .from('.who-sub-text p', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.5')
            .from('.who-highlight-box', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    }

    const statNums = document.querySelectorAll('.stat-num');
    ScrollTrigger.create({
        trigger: '.stats-bar',
        // 'top 95%' fires reliably on mobile where the bar is in-flow below the fold
        start: isMobileView ? 'top 95%' : 'top bottom',
        once: true,
        onEnter: () => {
            statNums.forEach((el, idx) => {
                gsap.from(el, { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out', delay: idx * 0.08 });
            });
        }
    });

    // �"?�"? LOGOS CAROUSEL ENTRANCE �"?�"?
    const logosTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#top-logos',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    logosTl.from('.logos-title', {
        y: 30, opacity: 0, duration: 1, ease: 'power3.out'
    })
        .from('.logos-carousel-wrap', {
            opacity: 0, duration: 1.5, ease: 'power2.out'
        }, "-=0.6");

    // �"?�"? IMMERSIVE DEPTH-WALK REELS (centered + alternating) �"?�"?
    const reelCards = gsap.utils.toArray('.reel-card');
    const totalReels = reelCards.length;
    const progressFill = document.querySelector('.reels-progress-fill');

    const zSpacing = 600; // depth gap between reels in perspective px

    const isMobile = () => window.innerWidth <= 768;

    // Initial placement
    reelCards.forEach((card, i) => {
        if (isMobile()) {
            // On mobile: CSS controls display via .is-active class
            // Clear any inline styles that would fight CSS
            card.style.display = '';
            card.style.opacity = '';
            card.style.transform = '';
            card.style.filter = '';
            card.style.zIndex = '';
        } else {
            gsap.set(card, {
                translateZ: -(i * zSpacing),
                scale: 1,
                opacity: i === 0 ? 1 : 0.5,
                filter: i === 0 ? 'blur(0px) brightness(1)' : 'blur(3px) brightness(0.4)',
                zIndex: totalReels - i
            });
        }
        if (i === 0) card.classList.add('is-active');
    });

    // �"?�"? MUTE/UNMUTE TOGGLE (EXCLUSIVE PLAYBACK PER REEL) �"?�"?
    const muteBtns = document.querySelectorAll('.reel-mute-btn');
    const allReelVideos = document.querySelectorAll('.reel-video-wrap video');
    let isGlobalMuted = true;

    // �"?�"? WHEEL-DRIVEN REEL CYCLER �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
    let activeReelIdx = 0;
    let lastReelChange = 0;
    const REEL_COOLDOWN = 600;

    function goToReel(idx) {
        if (idx < 0 || idx >= totalReels) return;
        const now = Date.now();
        if (now - lastReelChange < REEL_COOLDOWN) return;
        lastReelChange = now;

        activeReelIdx = idx;

        // Progress bar
        if (progressFill) {
            gsap.to(progressFill, { width: (idx / (totalReels - 1) * 100) + '%', duration: 0.5, ease: 'power2.out' });
        }

        if (isMobile()) {
            // Mobile: toggle .is-active �?" CSS handles display flex/none
            reelCards.forEach((card, i) => {
                const isActive = i === idx;
                card.classList.toggle('is-active', isActive);
                // Clear any stale inline display so CSS takes over
                card.style.display = '';

                if (isActive) {
                    const activeVideo = card.querySelector('.reel-video-wrap video');
                    allReelVideos.forEach(vid => { if (vid !== activeVideo) { vid.muted = true; vid.pause(); } });
                    if (activeVideo) {
                        activeVideo.muted = false;
                        activeVideo.play().catch(() => {});
                    }
                }
            });
        } else {
            // Desktop: full GSAP transition
            reelCards.forEach((card, i) => {
                const dist = i - idx;

                let ty, sc, op, bl, br;
                if (dist < 0) {
                    ty = -100; sc = 0.95; op = 0; bl = 4; br = 0.5;
                } else if (dist === 0) {
                    ty = 0; sc = 1; op = 1; bl = 0; br = 1;
                } else {
                    ty = 100; sc = 0.95; op = 0; bl = 4; br = 0.5;
                }

                gsap.killTweensOf(card);

                const isActive = dist === 0;
                gsap.to(card, {
                    y: ty, translateZ: 0, scale: sc, opacity: op,
                    filter: `blur(${bl}px) brightness(${br})`,
                    duration: 0.8,
                    ease: 'power3.inOut',
                    zIndex: isActive ? 1000 : 1
                });

                if (isActive) {
                    reelCards.forEach(c => c.classList.remove('is-active'));
                    card.classList.add('is-active');

                    const activeVideo = card.querySelector('.reel-video-wrap video');
                    allReelVideos.forEach(vid => { if (vid !== activeVideo) { vid.muted = true; vid.pause(); } });
                    if (activeVideo) {
                        activeVideo.muted = false;
                        activeVideo.play().catch(() => {});
                    }
                }
            });
        }
    }

    // Wheel listener �?" only active when cursor is inside the framed tunnel
    const reelsTunnel = document.querySelector('.reels-tunnel');
    if (reelsTunnel) {
        // Arrow Button Navigation
        const btnPrev = document.getElementById('reel-prev');
        const btnNext = document.getElementById('reel-next');
        if (btnPrev) btnPrev.addEventListener('click', () => goToReel(activeReelIdx - 1));
        if (btnNext) btnNext.addEventListener('click', () => goToReel(activeReelIdx + 1));

        // Auto-advance (Story mode)
        allReelVideos.forEach(vid => {
            vid.loop = false; // Disable default loop to allow 'ended' event
            vid.addEventListener('ended', () => {
                if (activeReelIdx < totalReels - 1) {
                    goToReel(activeReelIdx + 1);
                } else {
                    // Loop the very last video indefinitely
                    vid.play().catch(() => {});
                }
            });
        });
    }

    // Mute and pause audio/video on page scroll past the section
    ScrollTrigger.create({
        trigger: '#reels',
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => {
            isGlobalMuted = true;
            allReelVideos.forEach(vid => { vid.muted = true; vid.pause(); });
        },
        onLeaveBack: () => {
            isGlobalMuted = true;
            allReelVideos.forEach(vid => { vid.muted = true; vid.pause(); });
        },
        onEnter: () => {
            const activeVideo = reelCards[activeReelIdx].querySelector('.reel-video-wrap video');
            if (activeVideo) {
                activeVideo.muted = false;
                activeVideo.play().catch(()=>{});
            }
        },
        onEnterBack: () => {
            const activeVideo = reelCards[activeReelIdx].querySelector('.reel-video-wrap video');
            if (activeVideo) {
                activeVideo.muted = false;
                activeVideo.play().catch(()=>{});
            }
        }
    });

    // Header entrance
    gsap.fromTo('.reels-header',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#reels', start: 'top 60%', toggleActions: 'play none none reverse' } }
    );

    muteBtns.forEach(btn => {
        const video = btn.closest('.reel-video-wrap').querySelector('video');

        btn.addEventListener('click', () => {
            const isCurrentlyMuted = video.muted;

            if (isCurrentlyMuted) {
                isGlobalMuted = false;
                allReelVideos.forEach(vid => { vid.muted = true; vid.pause(); });
                muteBtns.forEach(otherBtn => {
                    const iconM = otherBtn.querySelector('.icon-mute'), iconU = otherBtn.querySelector('.icon-unmute');
                    if (iconM) iconM.style.display = 'block';
                    if (iconU) iconU.style.display = 'none';
                });
                video.muted = false;
                video.play();
                btn.querySelector('.icon-mute').style.display = 'none';
                btn.querySelector('.icon-unmute').style.display = 'block';
            } else {
                isGlobalMuted = true;
                video.muted = true;
                btn.querySelector('.icon-mute').style.display = 'block';
                btn.querySelector('.icon-unmute').style.display = 'none';
                allReelVideos.forEach(vid => { vid.play().catch(() => {}); });
            }
        });
    });


    // �"?�"? SERVICES ENTRANCE �"?�"?


    // Header reveal
    gsap.from('#services .services-top-row', {
        y: 50, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '#services', start: 'top 80%', toggleActions: 'play none none none' }
    });

    // Cards cascade: each reveals from bottom with clip-path wipe
    const cards = gsap.utils.toArray('#services .svc-card');
    cards.forEach((card, i) => {
        gsap.fromTo(card,
            { yPercent: 12, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
            {
                yPercent: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.4,
                delay: i * 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '#services .services-layout',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );

        // index line swipe-in
        gsap.from(card.querySelector('.svc-card-index'), {
            x: -30, opacity: 0, duration: 0.8, delay: i * 0.1 + 0.5, ease: 'power2.out',
            scrollTrigger: { trigger: '#services .services-layout', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // title explosive pop
        gsap.from(card.querySelector('.svc-card-title'), {
            y: 30, opacity: 0, skewY: 4, duration: 0.9, delay: i * 0.1 + 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: '#services .services-layout', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // cta fade-up
        gsap.from(card.querySelector('.svc-cta'), {
            y: 20, opacity: 0, duration: 0.7, delay: i * 0.1 + 0.85, ease: 'power2.out',
            scrollTrigger: { trigger: '#services .services-layout', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // bg number parallax
        gsap.fromTo(card.querySelector('.svc-card-bg-num'),
            { yPercent: 20, opacity: 0 },
            {
                yPercent: 0, opacity: 1, duration: 1.8, delay: i * 0.12, ease: 'power2.out',
                scrollTrigger: { trigger: '#services .services-layout', start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
    });


    // �"?�"? MEET THE TEAM: header entrance �"?�"?
    const teamHdrTl = gsap.timeline({
        scrollTrigger: { trigger: '#meet-the-team', start: 'top 75%', toggleActions: 'play none none none' }
    });
    teamHdrTl
        .from('#meet-the-team .services-eyebrow-centered', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' })
        .from('#meet-the-team .team-title', { opacity: 0, y: 60, skewY: 3, duration: 1.2, ease: 'expo.out' }, '-=0.5')
        .from('#meet-the-team .team-title-grad', { opacity: 0.4, duration: 1, ease: 'power2.out' }, '-=0.6');

    // �"?�"? TEAM SLIDER �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
    (function() {
        const slides   = Array.from(document.querySelectorAll('.ts-slide'));
        const dots     = Array.from(document.querySelectorAll('.ts-dot'));
        const prevBtn  = document.getElementById('ts-prev');
        const nextBtn  = document.getElementById('ts-next');
        if (!slides.length) return;

        let current   = 0;
        let animating = false;

        // Apply accent CSS var to each slide info panel
        slides.forEach(slide => {
            const accent = slide.dataset.accent || 'var(--c4)';
            slide.querySelector('.ts-info').style.setProperty('--ts-accent', accent);
        });

        // �"?�"? Vibe entrance animations �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
        function runVibe(slide) {
            const vibe  = slide.dataset.vibe;
            const img   = slide.querySelector('.ts-photo img');
            const info  = slide.querySelector('.ts-info');
            const num   = slide.querySelector('.ts-num');
            const name  = slide.querySelector('.ts-name');
            const rule  = slide.querySelector('.ts-rule');
            const bio   = slide.querySelector('.ts-bio');
            const tl    = gsap.timeline();

            // Reset info elements before animating
            gsap.set([num, name, rule, bio], { clearProps: 'all' });

            if (vibe === 'bold') {
                // Photo slams from left, name impacts
                tl.fromTo(img,
                    { clipPath: 'inset(0 100% 0 0)', scale: 1.25 },
                    { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 0.85, ease: 'expo.inOut' })
                  .fromTo(num, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
                  .fromTo(name, { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: 'expo.out' }, '-=0.25')
                  .fromTo(rule, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.5')
                  .fromTo(bio,  { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.4');

            } else if (vibe === 'clean') {
                // Blur dissolve from above
                tl.fromTo(img,
                    { opacity: 0, filter: 'blur(24px)', y: -30, scale: 1.08 },
                    { opacity: 1, filter: 'blur(0px)', y: 0, scale: 1, duration: 1.05, ease: 'power3.out' })
                  .fromTo([num, name, rule, bio],
                    { opacity: 0, y: 28 },
                    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, '-=0.6');

            } else if (vibe === 'creative') {
                // Diagonal sweep from bottom with skew
                tl.fromTo(img,
                    { clipPath: 'inset(100% 0 0 0)', rotation: 2, transformOrigin: 'bottom right' },
                    { clipPath: 'inset(0% 0 0 0)', rotation: 0, duration: 0.85, ease: 'expo.out' })
                  .fromTo(num,  { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4 }, '-=0.4')
                  .fromTo(name, { opacity: 0, y: 40, skewY: 5 }, { opacity: 1, y: 0, skewY: 0, duration: 0.7, ease: 'expo.out' }, '-=0.35')
                  .fromTo(rule, { opacity: 0, x: 36 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '-=0.45')
                  .fromTo(bio,  { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.3');

            } else if (vibe === 'digital') {
                // Glitch: rapid hue-rotate flashes then settle
                tl.set(img, { opacity: 0 })
                  .to(img, { opacity: 1, duration: 0.05 })
                  .to(img, { filter: 'hue-rotate(120deg) saturate(5) brightness(1.6)', x: 10, duration: 0.07 })
                  .to(img, { filter: 'hue-rotate(-60deg) saturate(2)', x: -6, duration: 0.06 })
                  .to(img, { filter: 'hue-rotate(30deg) saturate(3)', x: 4, duration: 0.06 })
                  .to(img, { filter: 'none', x: 0, duration: 0.55, ease: 'power2.out' })
                  .fromTo(num,  { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3)
                  .fromTo(name, { opacity: 0, filter: 'blur(10px)', letterSpacing: '18px' },
                                { opacity: 1, filter: 'blur(0px)', letterSpacing: '-1px', duration: 0.7, ease: 'power3.out' }, 0.38)
                  .fromTo(rule, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.65)
                  .fromTo(bio,  { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.8);

            } else if (vibe === 'geometric') {
                // Diamond expand clip-path
                tl.fromTo(img,
                    { clipPath: 'polygon(50% 20%, 80% 50%, 50% 80%, 20% 50%)', scale: 1.3 },
                    { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1, duration: 0.9, ease: 'expo.inOut' })
                  .fromTo(num,  { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.35')
                  .fromTo(name, { opacity: 0, x: 44 }, { opacity: 1, x: 0, duration: 0.65, ease: 'expo.out' }, '-=0.3')
                  .fromTo(rule, { opacity: 0, scaleX: 0, transformOrigin: 'left' }, { opacity: 1, scaleX: 1, duration: 0.5 }, '-=0.45')
                  .fromTo(bio,  { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.35');

            } else {
                // structured: curtain drop
                tl.fromTo(img,
                    { clipPath: 'inset(0 0 100% 0)' },
                    { clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power4.out' })
                  .fromTo([num, name, rule, bio],
                    { opacity: 0, y: 32 },
                    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out' }, '-=0.55');
            }
            return tl;
        }

        // �"?�"? Go to slide �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
        function goTo(idx) {
            if (animating || idx === current) return;
            animating = true;

            const outSlide = slides[current];
            const inSlide  = slides[idx];

            // Fade out current
            gsap.to(outSlide, { opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: () => {
                outSlide.classList.remove('ts-active');
            }});

            // Activate new slide then run its vibe
            setTimeout(() => {
                inSlide.classList.add('ts-active');
                gsap.set(inSlide, { opacity: 1 });
                runVibe(inSlide).eventCallback('onComplete', () => { animating = false; });
            }, 200);

            // Update dots
            dots[current].classList.remove('ts-dot-active');
            dots[idx].classList.add('ts-dot-active');
            current = idx;
        }

        // �"?�"? Controls �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
        if (prevBtn) prevBtn.addEventListener('click', () => goTo((current - 1 + slides.length) % slides.length));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo((current + 1) % slides.length));
        dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.goto)));

        // Keyboard
        document.addEventListener('keydown', e => {
            if (!document.getElementById('ts-wrap')) return;
            if (e.key === 'ArrowRight') goTo((current + 1) % slides.length);
            if (e.key === 'ArrowLeft')  goTo((current - 1 + slides.length) % slides.length);
        });

        // Run entrance vibe on the first slide when section scrolls into view
        ScrollTrigger.create({
            trigger: '#meet-the-team',
            start: 'top 70%',
            once: true,
            onEnter: () => {
                gsap.set(slides[0], { opacity: 1 });
                runVibe(slides[0]);
            }
        });
    })();

    // �"?�"? CONTACT SECTION ENTRANCE �"?�"?
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    contactTl
        .from('.contact-eyebrow', { opacity: 0, x: -30, duration: 0.8, ease: 'power3.out' })
        .from('.contact-title', { opacity: 0, y: 60, skewY: 2, duration: 1.1, ease: 'expo.out' }, '-=0.5')
        .from('.contact-desc', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out' }, '-=0.7')
        .from('.contact-info-item', {
            opacity: 0, x: -24, duration: 0.6, stagger: 0.12, ease: 'power2.out'
        }, '-=0.5');

    contactTl.fromTo('.contact-right',
        { opacity: 0, x: 60, filter: 'blur(6px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' },
        '-=1.0'
    );

    gsap.utils.toArray('.form-row').forEach((row, i) => {
        gsap.from(row, {
            opacity: 0, y: 30, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    gsap.from('.form-submit-row', {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
            trigger: '.form-submit-row',
            start: 'top 95%',
            toggleActions: 'play none none none'
        }
    });

    ScrollTrigger.refresh();
}

// �"?�"?�"? HEX LOGO HOVER EFFECT �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
document.querySelector('.brand').addEventListener('mouseenter', () => {
    gsap.to('.brand-logo svg polygon', {
        attr: { 'stroke-width': 2.5 }, duration: 0.4, stagger: 0.05, ease: 'power2.out'
    });
});
document.querySelector('.brand').addEventListener('mouseleave', () => {
    gsap.to('.brand-logo svg polygon', {
        attr: { 'stroke-width': 1.5 }, duration: 0.4, stagger: 0.05, ease: 'power2.out'
    });
});

// �"?�"?�"? CONTACT FORM: Select colour fix + Submit handler �"?�"?�"?�"?
document.addEventListener('DOMContentLoaded', () => {

    const subjectSelect = document.getElementById('cf-subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', () => {
            subjectSelect.classList.toggle('has-value', subjectSelect.value !== '');
        });
    }

    const contactForm = document.getElementById('contact-form');
    const cfFeedback  = document.getElementById('cf-feedback');
    const cfSubmit    = document.getElementById('cf-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            const required = contactForm.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderBottomColor = 'rgba(245,168,200,0.7)';
                    valid = false;
                } else {
                    field.style.borderBottomColor = '';
                }
            });
            if (!valid) {
                cfFeedback.className = 'form-feedback error';
                cfFeedback.textContent = '\u2726  Please fill in all required fields.';
                return;
            }

            // Sending state
            cfSubmit.classList.add('is-sending');
            cfSubmit.querySelector('.submit-text').textContent = 'Sending\u2026';
            cfFeedback.className = 'form-feedback';
            cfFeedback.textContent = '';

            // Build payload �?" send to our own PHP mailer
            const data = new FormData(contactForm);

            try {
                const res  = await fetch('send.php', {
                    method: 'POST',
                    body:   data
                });
                const json = await res.json();

                cfSubmit.classList.remove('is-sending');
                cfSubmit.querySelector('.submit-text').textContent = 'Send Message';

                if (json.success) {
                    cfFeedback.className = 'form-feedback success';
                    cfFeedback.textContent = '\u2726  Message received! We\u2019ll be in touch within 24 hours.';
                    contactForm.reset();
                    if (subjectSelect) subjectSelect.classList.remove('has-value');
                } else {
                    cfFeedback.className = 'form-feedback error';
                    cfFeedback.textContent = '\u2726  Something went wrong. Please try again or email us directly.';
                }
            } catch (err) {
                cfSubmit.classList.remove('is-sending');
                cfSubmit.querySelector('.submit-text').textContent = 'Send Message';
                cfFeedback.className = 'form-feedback error';
                cfFeedback.textContent = '\u2726  Connection error. Please check your internet and try again.';
            }

            gsap.from(cfFeedback, { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out' });
        });
    }
});

// �"?�"?�"? PREVENT FOUC �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
// (Removed overflow: hidden so browser can natively restore scroll position on refresh)
