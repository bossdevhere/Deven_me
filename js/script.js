document.addEventListener("DOMContentLoaded", function() {
    // If sections are already present in DOM (index.html), initialize immediately
    if (document.getElementById('home')) {
        initializePortfolio();
        return;
    }

    // Fallback: If using placeholder injection (modular loading)
    const loadHTML = (filePath, placeholderId) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load ${filePath}`);
                return response.text();
            })
            .then(data => {
                const el = document.getElementById(placeholderId);
                if (el) el.innerHTML = data;
            })
            .catch(error => console.warn('Note loading HTML:', error));
    };

    Promise.all([
        loadHTML('sections/header.html', 'header-placeholder'),
        loadHTML('sections/home.html', 'home-placeholder'),
        loadHTML('sections/about.html', 'about-placeholder'),
        loadHTML('sections/skills.html', 'skills-placeholder'),
        loadHTML('sections/services.html', 'services-placeholder'),
        loadHTML('sections/qualifications.html', 'qualifications-placeholder'),
        loadHTML('sections/projects.html', 'projects-placeholder'),
        loadHTML('sections/contact.html', 'contact-placeholder'),
        loadHTML('sections/footer.html', 'footer-placeholder')
    ]).then(() => {
        initializePortfolio();
    });
});

function initializePortfolio() {
    /*=============== SAFE LUCIDE INITIALIZATION ===============*/
    try {
        if (window.lucide) {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn('Lucide icon note:', e);
    }

    /*=============== THEME SWITCHER ===============*/
    const themeButton = document.getElementById('theme-button');
    const darkTheme = 'dark';

    const updateThemeIcon = () => {
        if (!themeButton) return;
        const isDarkMode = document.documentElement.classList.contains(darkTheme);
        themeButton.innerHTML = `<i data-lucide="${isDarkMode ? 'sun' : 'moon'}" class="w-4 h-4"></i>`;
        try {
            if (window.lucide) lucide.createIcons();
        } catch(e) {}
    };

    const applyInitialTheme = () => {
        const savedTheme = localStorage.getItem('selected-theme');
        // Default to clean light theme matching the mockup
        if (savedTheme === darkTheme) {
            document.documentElement.classList.add(darkTheme);
        } else {
            document.documentElement.classList.remove(darkTheme);
        }
        updateThemeIcon();
    };

    applyInitialTheme();

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            document.documentElement.classList.toggle(darkTheme);
            const currentTheme = document.documentElement.classList.contains(darkTheme) ? darkTheme : 'light';
            localStorage.setItem('selected-theme', currentTheme);
            updateThemeIcon();
        });
    }

    /*=============== MOBILE NAVIGATION ===============*/
    const navMenu = document.getElementById('mobile-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.remove('-right-full');
            navMenu.classList.add('right-0');
        });
    }

    if (navClose && navMenu) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('right-0');
            navMenu.classList.add('-right-full');
        });
    }

    const navLinks = document.querySelectorAll('#mobile-menu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('right-0');
                navMenu.classList.add('-right-full');
            }
        });
    });

    /*=============== HEADER SCROLL EFFECT ===============*/
    const header = document.getElementById('header');
    const scrollHeader = () => {
        if (!header) return;
        if (window.scrollY >= 40) {
            header.classList.add('backdrop-blur-md', 'shadow-sm');
            header.style.backgroundColor = document.documentElement.classList.contains(darkTheme)
                ? 'rgba(8, 8, 8, 0.85)'
                : 'rgba(255, 255, 255, 0.85)';
        } else {
            header.classList.remove('backdrop-blur-md', 'shadow-sm');
            header.style.backgroundColor = 'transparent';
        }
    };
    window.addEventListener('scroll', scrollHeader);

    /*=============== ACTIVE NAV LINK ON SCROLL ===============*/
    const sections = document.querySelectorAll('section[id]');
    const navPillLinks = document.querySelectorAll('.nav-tab');

    const scrollActive = () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-tab[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navPillLinks.forEach(item => {
                        item.classList.remove('active-link', 'bg-[#d4f742]', 'text-black', 'font-semibold', 'shadow-sm');
                        item.classList.add('text-gray-700', 'dark:text-gray-300');
                    });
                    navLink.classList.add('active-link', 'bg-[#d4f742]', 'text-black', 'font-semibold', 'shadow-sm');
                    navLink.classList.remove('text-gray-700', 'dark:text-gray-300');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollActive);

    /*=============== SCROLL TO TOP ===============*/
    const scrollUp = () => {
        const scrollUpBtn = document.getElementById('scroll-up');
        if (!scrollUpBtn) return;
        if (window.scrollY >= 400) {
            scrollUpBtn.classList.replace('-bottom-1/4', 'bottom-6');
        } else {
            scrollUpBtn.classList.replace('bottom-6', '-bottom-1/4');
        }
    };
    window.addEventListener('scroll', scrollUp);

    /*=============== PROJECT FILTER ===============*/
    const filterButtons = document.querySelectorAll('.project-filter');
    const projectItems = document.querySelectorAll('.project-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');
            const filterValue = button.getAttribute('data-filter');
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                item.style.display = (filterValue === 'all' || category === filterValue) ? 'block' : 'none';
            });
        });
    });

    /*=============== BULLETPROOF GSAP ANIMATIONS ===============*/
    initGSAPAnimations();
}

function initGSAPAnimations() {
    if (!window.gsap) return;

    try {
        // 1. Entrance timeline with clearProps so elements NEVER get stuck hidden
        const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
                // Ensure all elements have cleared inline opacity
                gsap.set(".hero-card, .hero-title-line, .hero-btn, .hero-desc, .hero-exp-card, .hero-stat-item", {
                    clearProps: "opacity,transform"
                });
            }
        });

        // Header drop-in
        tl.fromTo("#header",
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, clearProps: "all" }
        )
        // Hero card gentle scale and reveal
        .fromTo(".hero-card",
            { scale: 0.98, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out", clearProps: "all" },
            "-=0.4"
        )
        // Hero portrait gentle zoom settle
        .fromTo(".hero-portrait-img",
            { scale: 1.05, opacity: 0.5 },
            { scale: 1, opacity: 1, duration: 1.0, ease: "power2.out", clearProps: "all" },
            "-=0.6"
        )
        // Hero headline reveal
        .fromTo(".hero-title-line",
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, clearProps: "all" },
            "-=0.6"
        )
        // CTA Button
        .fromTo(".hero-btn",
            { scale: 0.85, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", clearProps: "all" },
            "-=0.4"
        )
        // Floating experience card
        .fromTo(".hero-exp-card",
            { y: -25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.5)", clearProps: "all" },
            "-=0.5"
        )
        // Stats row
        .fromTo(".hero-stat-item",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, clearProps: "all" },
            "-=0.4"
        );

        // Micro-waving hand animation
        gsap.to(".hero-wave", {
            rotation: 20,
            duration: 0.25,
            repeat: 5,
            yoyo: true,
            ease: "power1.inOut"
        });

        // Live stats counting animation
        animateStatsCounters();

        // Idle floating physics for the EXP card
        gsap.to(".hero-exp-card", {
            y: "-=8",
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // 3D Parallax Mouse Interactivity on Hero Card
        initHeroMouseParallax();

        // ScrollTrigger animations for About section
        initAboutAnimations();

        // ScrollTrigger animations for Services section
        initServicesAnimations();

    } catch (err) {
        console.warn('GSAP animation warning:', err);
    }
}

/*=============== STATS NUMBER COUNT-UP ===============*/
function animateStatsCounters() {
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = el.getAttribute('data-decimal') === 'true';
        const isK = el.getAttribute('data-format') === 'k';
        const obj = { val: 0 };

        gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: "power2.out",
            delay: 0.4,
            onUpdate: () => {
                if (isDecimal) {
                    el.textContent = `${obj.val.toFixed(1)}${suffix}`;
                } else if (isK) {
                    const formatted = Math.floor(obj.val / 1000);
                    el.textContent = `${formatted}k${suffix}`;
                } else {
                    el.textContent = `${Math.floor(obj.val)}${suffix}`;
                }
            }
        });
    });
}

/*=============== 3D MOUSE PARALLAX ===============*/
function initHeroMouseParallax() {
    const heroCard = document.querySelector('.hero-card');
    const portrait = document.querySelector('.hero-portrait-img');
    const expCard = document.querySelector('.hero-exp-card');

    if (!heroCard || !portrait) return;

    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(portrait, {
            x: x * 15,
            y: y * 10,
            duration: 0.8,
            ease: "power1.out"
        });

        if (expCard) {
            gsap.to(expCard, {
                x: -x * 20,
                y: -y * 15,
                duration: 0.8,
                ease: "power1.out"
            });
        }
    });

    heroCard.addEventListener('mouseleave', () => {
        gsap.to(portrait, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out"
        });

        if (expCard) {
            gsap.to(expCard, {
                x: 0,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            });
        }
    });
}

/*=============== ABOUT SECTION ANIMATIONS ===============*/
function initAboutAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    try {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".about-card", {
            scrollTrigger: {
                trigger: "#about",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all"
        });

        gsap.from(".about-col-left, .about-col-center, .about-col-right", {
            scrollTrigger: {
                trigger: ".about-card",
                start: "top 75%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            clearProps: "all"
        });

        // 120% counter count-up
        const counter = document.querySelector('.about-counter');
        if (counter) {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    const target = parseFloat(counter.getAttribute('data-target')) || 120;
                    const suffix = counter.getAttribute('data-suffix') || '%';
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 1.8,
                        ease: "power2.out",
                        onUpdate: () => {
                            counter.textContent = `${Math.floor(obj.val)}${suffix}`;
                        }
                    });
                }
            });
        }
    } catch (e) {
        console.warn("About GSAP Error:", e);
    }
}

/*=============== SERVICES SECTION ANIMATIONS ===============*/
function initServicesAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    try {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from("#services .service-card", {
            scrollTrigger: {
                trigger: "#services",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 35,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "all"
        });
    } catch (e) {
        console.warn("Services GSAP Error:", e);
    }
}
