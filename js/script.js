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
    const navOverlay = document.getElementById('mobile-menu-overlay');

    const openMenu = () => {
        if (!navMenu) return;
        navMenu.classList.remove('-right-full');
        navMenu.classList.add('right-0');
        if (navOverlay) {
            navOverlay.classList.remove('hidden');
            requestAnimationFrame(() => navOverlay.classList.remove('opacity-0'));
        }
        document.body.classList.add('overflow-hidden');
    };

    const closeMenu = () => {
        if (!navMenu) return;
        navMenu.classList.remove('right-0');
        navMenu.classList.add('-right-full');
        if (navOverlay) {
            navOverlay.classList.add('opacity-0');
            setTimeout(() => navOverlay.classList.add('hidden'), 300);
        }
        document.body.classList.remove('overflow-hidden');
    };

    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    const navLinks = document.querySelectorAll('#mobile-menu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
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
            scrollUpBtn.classList.remove('-bottom-1/4');
            scrollUpBtn.classList.add('bottom-4', 'sm:bottom-6');
        } else {
            scrollUpBtn.classList.remove('bottom-4', 'sm:bottom-6');
            scrollUpBtn.classList.add('-bottom-1/4');
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

    /*=============== MOBILE VIEW ALL PROJECTS TOGGLE ===============*/
    const viewAllBtn = document.getElementById('view-all-projects-btn');
    const viewAllText = document.getElementById('view-all-projects-text');
    const viewAllIcon = document.getElementById('view-all-projects-icon');
    const extraProjects = document.querySelectorAll('.project-item-extra');

    if (viewAllBtn && extraProjects.length) {
        let isExpanded = false;
        viewAllBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            extraProjects.forEach(item => {
                if (isExpanded) {
                    item.classList.remove('hidden');
                    item.classList.add('flex');
                } else {
                    item.classList.remove('flex');
                    item.classList.add('hidden');
                }
            });

            if (viewAllText) {
                viewAllText.textContent = isExpanded ? 'Show Less' : 'View All Projects (6)';
            }
            if (viewAllIcon) {
                viewAllIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            if (!isExpanded) {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        });
    }

    /*=============== CONTACT SECTION INTERACTION ===============*/
    initContactInteractions();

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
            { scale: 0.98 },
            { scale: 1, duration: 0.8, ease: "power2.out", clearProps: "all" },
            "-=0.4"
        )
        // Hero portrait gentle zoom settle
        tl.fromTo(".hero-portrait-img",
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

        // ScrollTrigger animations for Projects section
        initProjectsAnimations();

        // ScrollTrigger animations for Contact section
        initContactAnimations();

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
    if (window.innerWidth < 768) return; // Immediate visibility on mobile devices

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
    if (window.innerWidth < 768) return; // Immediate visibility on mobile devices

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

/*=============== PROJECTS SECTION ANIMATIONS ===============*/
function initProjectsAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.innerWidth < 768) return; // Immediate visibility on mobile devices

    try {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".projects-master-card", {
            scrollTrigger: {
                trigger: "#projects",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "all"
        });

        gsap.from("#projects .project-item", {
            scrollTrigger: {
                trigger: "#projects",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all"
        });
    } catch (e) {
        console.warn("Projects GSAP Error:", e);
    }
}

/*=============== CONTACT SECTION ANIMATIONS ===============*/
function initContactAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (window.innerWidth < 768) return; // Immediate visibility on mobile devices

    try {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from(".contact-master-card", {
            scrollTrigger: {
                trigger: "#contact",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "all"
        });
    } catch (e) {
        console.warn("Contact GSAP Error:", e);
    }
}

/*=============== CONTACT SECTION INTERACTION ===============*/
function initContactInteractions() {
    const ctaView = document.getElementById('contact-cta-view');
    const formView = document.getElementById('contact-form-view');
    const openBtn = document.getElementById('open-contact-form-btn');
    const closeBtn = document.getElementById('close-contact-form-btn');
    const form = document.getElementById('project-contact-form');
    const feedback = document.getElementById('form-feedback');
    const nameInput = document.getElementById('form-name');

    if (!ctaView || !formView) return;

    const showForm = () => {
        ctaView.style.opacity = '0';
        ctaView.style.transform = 'scale(0.96)';
        setTimeout(() => {
            ctaView.classList.add('hidden');
            formView.classList.remove('hidden');
            setTimeout(() => {
                formView.classList.remove('opacity-0', 'scale-95');
                formView.classList.add('opacity-100', 'scale-100');
                if (nameInput) nameInput.focus();
            }, 30);
        }, 250);
    };

    const hideForm = () => {
        formView.classList.remove('opacity-100', 'scale-100');
        formView.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            formView.classList.add('hidden');
            ctaView.classList.remove('hidden');
            setTimeout(() => {
                ctaView.style.opacity = '1';
                ctaView.style.transform = 'scale(1)';
            }, 30);
        }, 250);
    };

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showForm();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideForm();
        });
    }

    // Connect any "Let's talk" buttons to open the form directly
    const talkButtons = document.querySelectorAll('a[href="#contact"]');
    talkButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(showForm, 400);
        });
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('form-submit-btn');
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            const honeyInput = form.querySelector('input[name="_honey"]');

            // Honeypot bot protection
            if (honeyInput && honeyInput.value) {
                return;
            }

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                if (feedback) {
                    feedback.className = 'p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm text-center font-medium';
                    feedback.textContent = 'Please fill out all fields before sending.';
                    feedback.classList.remove('hidden');
                }
                return;
            }

            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Sending message...</span>
                `;
            }

            const openMailtoFallback = () => {
                const mailtoUrl = `mailto:devenrajput30209@gmail.com?subject=${encodeURIComponent('Project Inquiry from ' + name)}&body=${encodeURIComponent('Hi Deven,\n\nName: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
                window.location.href = mailtoUrl;
            };

            const escapeHTML = (str) => {
                const p = document.createElement('p');
                p.textContent = str;
                return p.innerHTML;
            };

            try {
                const response = await fetch('https://formsubmit.co/ajax/devenrajput30209@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Inquiry from ${name}`,
                        _captcha: 'false',
                        _template: 'table'
                    })
                });

                const data = await response.json();

                if (response.ok && (data.success === 'true' || data.success === true)) {
                    if (feedback) {
                        feedback.className = 'p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium leading-relaxed';
                        feedback.innerHTML = `✨ <strong>Thank you, ${escapeHTML(name)}!</strong><br>Your message has been delivered directly to <a href="mailto:devenrajput30209@gmail.com" class="underline font-semibold">devenrajput30209@gmail.com</a>. I'll get back to you shortly.`;
                        feedback.classList.remove('hidden');
                    }
                    if (submitBtn) {
                        submitBtn.innerHTML = `<span>Sent Successfully! ✓</span>`;
                    }
                    form.reset();
                } else if (data.message && data.message.includes('Activation')) {
                    if (feedback) {
                        feedback.className = 'p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium leading-relaxed';
                        feedback.innerHTML = `✨ <strong>Message Received!</strong> FormSubmit sent a one-time activation confirmation to <a href="mailto:devenrajput30209@gmail.com" class="underline font-semibold">devenrajput30209@gmail.com</a>. Opening your mail app as immediate backup...`;
                        feedback.classList.remove('hidden');
                    }
                    if (submitBtn) {
                        submitBtn.innerHTML = `<span>Message Sent! ✓</span>`;
                    }
                    setTimeout(openMailtoFallback, 1200);
                    form.reset();
                } else {
                    throw new Error(data.message || 'Submission error');
                }
            } catch (err) {
                console.warn('Form submission fallback:', err);
                if (feedback) {
                    feedback.className = 'p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm text-center font-medium leading-relaxed';
                    feedback.innerHTML = `📬 Opening your mail app to send your message directly to <a href="mailto:devenrajput30209@gmail.com" class="underline font-semibold">devenrajput30209@gmail.com</a>...`;
                    feedback.classList.remove('hidden');
                }
                setTimeout(openMailtoFallback, 800);
            } finally {
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHTML;
                    }
                }, 5000);
            }
        });
    }
}

// Refresh ScrollTrigger when images load
window.addEventListener('load', () => {
    if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
    }
});
