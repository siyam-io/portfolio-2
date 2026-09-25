/**
 * nav.js — Navigation scroll behavior, active section, mobile menu
 * Esthyak Ahmmed Siyam Portfolio
 */

export function initNav() {
    const nav = document.getElementById('site-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.nav__mobile-link') : [];
    const navLinks = document.querySelectorAll('.nav__link');

    // ── Scroll: add .scrolled class to nav ───
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (nav) {
                    nav.classList.toggle('scrolled', window.scrollY > 60);
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', onScroll, {
        passive: true
    });
    onScroll(); // initial state

    // ── Mobile menu toggle ────────────────────
    function openMenu() {
        hamburger ? .classList.add('open');
        mobileMenu ? .classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger ? .setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        hamburger ? .classList.remove('open');
        mobileMenu ? .classList.remove('open');
        document.body.style.overflow = '';
        hamburger ? .setAttribute('aria-expanded', 'false');
    }

    hamburger ? .addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close menu when a mobile nav link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // ── Active section highlight via IntersectionObserver ─
    const sections = document.querySelectorAll('section[id], div[id]');
    if (sections.length && navLinks.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            link.classList.toggle('active', href === `#${id}`);
                        });
                    }
                });
            }, {
                rootMargin: '-40% 0px -55% 0px',
                threshold: 0
            }
        );

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ── Smooth scroll for all anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        });
    });
}