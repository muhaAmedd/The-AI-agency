/* ═══════════════════════════════════════════════════════════
   NAV.JS — Shared navigation logic for all pages
   - Services dropdown: click to open/close (desktop)
   - Hamburger menu: mobile full-screen overlay
   - Close on outside click / Escape key
   - Header scroll glass effect
═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ── Collect nav links from existing <nav> ──────────── */
        const header = document.getElementById('site-header');
        const desktopNav = header ? header.querySelector('nav') : null;

        /* ── Inject Hamburger Button ────────────────────────── */
        if (header) {
            const hamburger = document.createElement('button');
            hamburger.className = 'nav-hamburger';
            hamburger.setAttribute('aria-label', 'Toggle menu');
            hamburger.innerHTML = '<span></span><span></span><span></span>';
            header.appendChild(hamburger);

            /* ── Build Mobile Overlay ───────────────────────── */
            const overlay = document.createElement('div');
            overlay.className = 'nav-mobile-overlay';

            // X close button at the top of the overlay
            const closeBtn = document.createElement('button');
            closeBtn.className = 'nav-mobile-close';
            closeBtn.setAttribute('aria-label', 'Close menu');
            closeBtn.innerHTML = '&#10005;';
            overlay.appendChild(closeBtn);

            // Gather nav links from existing desktop nav
            if (desktopNav) {

                // Always prepend a Home link at the top
                const homeLink = document.createElement('a');
                homeLink.href = '../index.html';
                homeLink.textContent = 'Home';
                overlay.appendChild(homeLink);

                const navChildren = Array.from(desktopNav.children);

                navChildren.forEach(function (child) {
                    if (child.classList.contains('nav-dropdown')) {
                        // Services accordion
                        const toggle = child.querySelector('.nav-dropdown-toggle');
                        const menu = child.querySelector('.nav-dropdown-menu');
                        const toggleText = toggle ? (toggle.childNodes[0].textContent || '').trim() : 'Services';

                        const btn = document.createElement('button');
                        btn.className = 'nav-mobile-services-toggle';
                        btn.innerHTML = toggleText + ' <span class="nav-mobile-services-arrow">▼</span>';

                        const submenu = document.createElement('div');
                        submenu.className = 'nav-mobile-submenu';

                        if (menu) {
                            const subLinks = menu.querySelectorAll('a');
                            subLinks.forEach(function (link) {
                                const a = document.createElement('a');
                                a.href = link.getAttribute('href');
                                a.textContent = link.textContent.trim();
                                submenu.appendChild(a);
                            });
                        }

                        btn.addEventListener('click', function () {
                            btn.classList.toggle('is-open');
                            submenu.classList.toggle('is-open');
                        });

                        overlay.appendChild(btn);
                        overlay.appendChild(submenu);

                    } else if (child.tagName === 'A') {
                        // Skip links that duplicate Home
                        const href = child.getAttribute('href') || '';
                        if (href === '../index.html' || href === 'index.html' || href === '/') return;

                        const a = document.createElement('a');
                        a.href = href;
                        a.textContent = child.textContent.trim();
                        if (child.classList.contains('nav-cta')) {
                            a.className = 'nav-mobile-cta';
                        }
                        overlay.appendChild(a);
                    }
                });
            }


            document.body.appendChild(overlay);

            /* ── Hamburger Toggle ───────────────────────────── */
            function openMenu() {
                hamburger.classList.add('is-open');
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }

            function closeMenu() {
                hamburger.classList.remove('is-open');
                overlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }

            hamburger.addEventListener('click', function () {
                if (hamburger.classList.contains('is-open')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Close button inside overlay
            closeBtn.addEventListener('click', function () {
                closeMenu();
            });

            // Close when a nav link is tapped
            overlay.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    closeMenu();
                });
            });

            // Close on Escape
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    closeMenu();
                    dropdowns.forEach(function (d) { d.classList.remove('is-open'); });
                }
            });
        }

        /* ── Desktop Services Dropdown ──────────────────────── */
        const dropdowns = document.querySelectorAll('.nav-dropdown');

        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            if (!toggle) return;

            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = dropdown.classList.contains('is-open');
                dropdowns.forEach(function (d) { d.classList.remove('is-open'); });
                if (!isOpen) {
                    dropdown.classList.add('is-open');
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav-dropdown')) {
                dropdowns.forEach(function (d) { d.classList.remove('is-open'); });
            }
        });

        /* ── Header scroll glass effect ─────────────────────── */
        if (header) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 60) {
                    header.style.background = 'rgba(0, 5, 16, 0.92)';
                    header.style.backdropFilter = 'blur(20px)';
                    header.style.webkitBackdropFilter = 'blur(20px)';
                    header.style.borderBottom = '1px solid rgba(159, 69, 176, 0.12)';
                } else {
                    header.style.background = '#000510';
                    header.style.backdropFilter = 'none';
                    header.style.webkitBackdropFilter = 'none';
                    header.style.borderBottom = 'none';
                }
            }, { passive: true });
        }

    });

})();

