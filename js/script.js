/**
 * ==========================================================================
 * AIT ICHOU Rafik - Portfolio Script
 * Gestion du Thème Sombre, Animations AOS, Typed.js, Navigation & Modals
 * ==========================================================================
 */

// 1. Initialisation immédiate du thème sombre pour éviter le flash blanc (FOUC)
(function initThemeImmediately() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    // ----------------------------------------------------------------------
    // 2. Gestion du Thème Sombre (Dark Mode)
    // ----------------------------------------------------------------------
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

    function updateThemeIcons(currentTheme) {
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (!icon) return;
            if (currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
                btn.setAttribute('aria-label', 'Activer le mode clair');
                btn.setAttribute('title', 'Mode clair');
            } else {
                icon.className = 'fas fa-moon';
                btn.setAttribute('aria-label', 'Activer le mode sombre');
                btn.setAttribute('title', 'Mode sombre');
            }
        });
    }

    // Mettre à jour l'icône au chargement
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcons(currentTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    // ----------------------------------------------------------------------
    // 3. Navbar au Défilement (Transparent en haut, Plein + Ombre après scroll)
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Vérification initiale

    // ----------------------------------------------------------------------
    // 4. Fermeture automatique du menu burger sur Mobile au clic
    // ----------------------------------------------------------------------
    const navCollapse = document.getElementById('navbarNav');
    if (navCollapse && typeof bootstrap !== 'undefined') {
        const navLinks = navCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. Effet de Texte Tapé (Typed.js avec fallback léger)
    // ----------------------------------------------------------------------
    const typedTarget = document.getElementById('typed-text');
    if (typedTarget) {
        const isEnglish = document.documentElement.lang === 'en';
        const strings = isEnglish
            ? [
                "Full-Stack &amp; Mobile",
                "Spring Boot &amp; Angular",
                "Flutter &amp; Dart",
                "Software Quality &amp; CI/CD",
                "Intelligent Systems"
            ]
            : [
                "Full-Stack &amp; Mobile",
                "Spring Boot &amp; Angular",
                "Flutter &amp; Dart",
                "Qualité Logicielle &amp; CI/CD",
                "Systèmes Intelligents"
            ];

        if (typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: strings,
                typeSpeed: 60,
                backSpeed: 35,
                backDelay: 1800,
                startDelay: 300,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        } else {
            // Fallback simple si Typed.js CDN n'est pas encore prêt
            let stringIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function fallbackType() {
                const currentStr = strings[stringIndex].replace(/&amp;/g, '&');
                if (isDeleting) {
                    typedTarget.textContent = currentStr.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    typedTarget.textContent = currentStr.substring(0, charIndex + 1);
                    charIndex++;
                }

                let speed = isDeleting ? 40 : 70;

                if (!isDeleting && charIndex === currentStr.length) {
                    isDeleting = true;
                    speed = 1800;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    stringIndex = (stringIndex + 1) % strings.length;
                    speed = 400;
                }

                setTimeout(fallbackType, speed);
            }
            fallbackType();
        }
    }

    // ----------------------------------------------------------------------
    // 6. Initialisation de AOS (Animate On Scroll)
    // ----------------------------------------------------------------------
    if (typeof AOS !== 'undefined') {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
            AOS.init({
                duration: 450,
                easing: 'ease-out-cubic',
                once: true,
                offset: 50,
                delay: 50
            });
        }
    }

    // ----------------------------------------------------------------------
    // 7. Mise en Évidence de la Navigation Active
    // ----------------------------------------------------------------------
    function setActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const targetPage = href.split('/').pop();

            if (targetPage === currentPath || (currentPath === '' && targetPage === 'index.html')) {
                link.classList.add('active');
            } else if (link.classList.contains('active') && targetPage !== currentPath) {
                // Seulement retirer si non ancré
                if (!href.startsWith('#')) {
                    link.classList.remove('active');
                }
            }
        });
    }
    setActiveNavLink();

    // ----------------------------------------------------------------------
    // 8. Fenêtre Modale CV (Sélection & Aperçu)
    // ----------------------------------------------------------------------
    const cvModal = document.getElementById('cvModal');
    if (cvModal) {
        const choiceView = document.getElementById('cvChoiceView');
        const previewView = document.getElementById('cvPreviewView');
        const frame = document.getElementById('cvFrame');
        const title = document.getElementById('cvModalTitle');
        const dlBtn = document.getElementById('cvDownloadBtn');
        const backBtn = document.getElementById('cvBackBtn');
        const DEFAULT_TITLE = title ? title.textContent : 'CV - AIT ICHOU Rafik';

        function showChoice() {
            if (previewView) previewView.classList.add('d-none');
            if (choiceView) choiceView.classList.remove('d-none');
            if (dlBtn) dlBtn.classList.add('d-none');
            if (frame) frame.src = '';
            if (title) title.textContent = DEFAULT_TITLE;
        }

        document.querySelectorAll('.btn-cv-preview').forEach(btn => {
            btn.addEventListener('click', function () {
                const file = encodeURI(btn.getAttribute('data-cv') || '');
                if (frame) frame.src = file;
                if (dlBtn) {
                    dlBtn.href = file;
                    dlBtn.classList.remove('d-none');
                }
                if (title) title.innerHTML = btn.getAttribute('data-title') || DEFAULT_TITLE;
                if (choiceView) choiceView.classList.add('d-none');
                if (previewView) previewView.classList.remove('d-none');
            });
        });

        if (backBtn) {
            backBtn.addEventListener('click', showChoice);
        }
        cvModal.addEventListener('hidden.bs.modal', showChoice);
    }

    // ----------------------------------------------------------------------
    // 9. Sécurité des Liens Externes
    // ----------------------------------------------------------------------
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.getAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});