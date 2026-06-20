/* ═══════════════════════════════════════════════════════════
   NAV.JS — Shared navigation logic for all pages
   - Services dropdown: click to open/close
   - Close on outside click
   - Close on Escape key
   - Header scroll glass effect
═══════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ── Services Dropdown ────────────────────────────────── */
        const dropdowns = document.querySelectorAll('.nav-dropdown');

        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');

            if (!toggle) return;

            // Toggle open/close on click
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = dropdown.classList.contains('is-open');

                // Close all other dropdowns first
                dropdowns.forEach(function (d) { d.classList.remove('is-open'); });

                // Toggle this one
                if (!isOpen) {
                    dropdown.classList.add('is-open');
                }
            });
        });

        // Close dropdown when clicking anywhere outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.nav-dropdown')) {
                dropdowns.forEach(function (d) { d.classList.remove('is-open'); });
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                dropdowns.forEach(function (d) { d.classList.remove('is-open'); });
            }
        });

        /* ── Header scroll glass effect ───────────────────────── */
        const header = document.getElementById('site-header');
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
