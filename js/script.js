document.addEventListener("DOMContentLoaded", function() {
    // Function to load HTML content into a placeholder
    const loadHTML = (filePath, placeholderId) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${filePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const el = document.getElementById(placeholderId);
                if (el) el.innerHTML = data;
            })
            .catch(error => console.error('Error loading HTML:', error));
    };

    // Load all sections into their placeholders
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
        // All HTML content is loaded, now initialize the app
        initializePortfolio();
    });
});

function initializePortfolio() {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    /*=============== THEME SWITCHER ===============*/
    const themeButton = document.getElementById('theme-button');
    const darkTheme = 'dark';

    const updateThemeIcon = () => {
        if (!themeButton) return;
        const isDarkMode = document.documentElement.classList.contains(darkTheme);
        themeButton.innerHTML = `<i data-lucide="${isDarkMode ? 'sun' : 'moon'}" class="w-4 h-4"></i>`;
        if (window.lucide) lucide.createIcons();
    };

    const applyInitialTheme = () => {
        const savedTheme = localStorage.getItem('selected-theme');
        if (savedTheme === darkTheme) {
            document.documentElement.classList.add(darkTheme);
        } else {
            // Default to light or clean theme as in reference image
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

    /*=============== MOBILE MENU ===============*/
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

    /*=============== HEADER SCROLL BLUR ===============*/
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

    /*=============== GSAP ANIMATIONS ===============*/
    initGSAPAnimations();

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
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        });
    });
}

/*=============== ADVANCED GSAP SUITE ===============*/
function initGSAPAnimations() {
    if (!window.gsap) return;

    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Main entrance timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Header reveal
    tl.from("#header", {
        y: -40,
        opacity: 0,
        duration: 0.8
    })
    // 2. Hero Card scale & fade in
    .from(".hero-card", {
        scale: 0.96,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.4")
    // 3. Hero Portrait fade & settle
    .from(".hero-portrait-img", {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    }, "-=0.8")
    // 4. Greeting reveal
    .from(".hero-greeting", {
        x: -30,
        opacity: 0,
        duration: 0.6
    }, "-=0.8")
    // 5. Waving hand micro-animation
    .to(".hero-wave", {
        rotation: 20,
        duration: 0.25,
        repeat: 4,
        yoyo: true,
        ease: "power1.inOut"
    }, "-=0.3")
    // 6. Big Headline line reveal
    .from(".hero-title-line", {
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15
    }, "-=0.6")
    // 7. Hire Me Button pop
    .from(".hero-btn", {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
    }, "-=0.5")
    // 8. Descriptor paragraph
    .from(".hero-desc", {
        y: 20,
        opacity: 0,
        duration: 0.6
    }, "-=0.4")
    // 9. Floating EXP Card drop
    .from(".hero-exp-card", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)"
    }, "-=0.8")
    // 10. EXP Icons pop in
    .from(".exp-icon-item", {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: "back.out(2)"
    }, "-=0.5")
    // 11. Stats items reveal
    .from(".hero-stat-item", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12
    }, "-=0.6")
    // 12. Stats horizontal lines expand from left to right
    .from(".stat-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        stagger: 0.1
    }, "-=0.5");

    // Animate stats counter numbers dynamically
    animateStatsCounters();

    // Idle floating animation for EXP card
    gsap.to(".hero-exp-card", {
        y: "-=8",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // 3D Parallax Mouse Interactivity
    initHeroMouseParallax();
    if (window.location.search.includes("static")) { tl.progress(1); }

    // ScrollTrigger animations for other sections if on page
    if (window.ScrollTrigger) {
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        gsap.utils.toArray('.card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out"
            });
        });
    }
}

/*=============== STATS COUNTER ANIMATION ===============*/
function animateStatsCounters() {
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const isK = el.getAttribute('data-format') === 'k';
        const obj = { val: 0 };

        gsap.to(obj, {
            val: target,
            duration: 2.0,
            ease: "power2.out",
            delay: 0.8,
            onUpdate: () => {
                if (isK) {
                    const formatted = Math.floor(obj.val / 1000);
                    el.textContent = `${formatted}k${suffix}`;
                } else {
                    el.textContent = `${Math.floor(obj.val)}${suffix}`;
                }
            }
        });
    });
}

/*=============== INTERACTIVE 3D MOUSE PARALLAX ===============*/
function initHeroMouseParallax() {
    const heroCard = document.querySelector('.hero-card');
    const portrait = document.querySelector('.hero-portrait-img');
    const expCard = document.querySelector('.hero-exp-card');

    if (!heroCard || !portrait) return;

    heroCard.addEventListener('mousemove', (e) => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle portrait shift
        gsap.to(portrait, {
            x: x * 15,
            y: y * 10,
            duration: 0.8,
            ease: "power1.out"
        });

        // Inverse subtle shift for floating card (depth effect)
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
