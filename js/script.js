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
                document.getElementById(placeholderId).innerHTML = data;
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
        // All HTML content is loaded, now initialize the scripts
        initializePortfolio();
    });
});

function initializePortfolio() {
    // Initialize Lucide Icons
    lucide.createIcons();

    /*=============== THEME SWITCHER ===============*/
    const themeButton = document.getElementById('theme-button');
    const darkTheme = 'dark';
    const sunIcon = 'sun';
    const moonIcon = 'moon';

    const updateIcon = () => {
        const isDarkMode = document.documentElement.classList.contains(darkTheme);
        const newIcon = isDarkMode ? moonIcon : sunIcon;
        themeButton.innerHTML = `<i data-lucide="${newIcon}" class="w-6 h-6"></i>`;
        lucide.createIcons();
    };

    const applyInitialTheme = () => {
        const savedTheme = localStorage.getItem('selected-theme');
        if (savedTheme === darkTheme) {
            document.documentElement.classList.add(darkTheme);
        } else {
            document.documentElement.classList.remove(darkTheme);
        }
        updateIcon();
    };

    applyInitialTheme();

    themeButton.addEventListener('click', () => {
        document.documentElement.classList.toggle(darkTheme);
        const currentTheme = document.documentElement.classList.contains(darkTheme) ? darkTheme : 'light';
        localStorage.setItem('selected-theme', currentTheme);
        updateIcon();
    });

    /*=============== MOBILE MENU ===============*/
    const navMenu = document.getElementById('mobile-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.remove('-right-full');
            navMenu.classList.add('right-0');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('right-0');
            navMenu.classList.add('-right-full');
        });
    }

    const navLinks = document.querySelectorAll('#mobile-menu .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('right-0');
            navMenu.classList.add('-right-full');
        });
    });

    /*=============== HEADER BACKGROUND ON SCROLL ===============*/
    const scrollHeader = () => {
        const header = document.getElementById('header');
        if (window.scrollY >= 50) {
            header.classList.add('shadow-lg');
            header.style.backgroundColor = 'var(--header-bg)';
            header.classList.add('backdrop-blur-sm');
        } else {
            header.classList.remove('shadow-lg', 'backdrop-blur-sm');
            header.style.backgroundColor = 'transparent';
        }
    };
    window.addEventListener('scroll', scrollHeader);

    /*=============== ACTIVE NAV LINK ON SCROLL ===============*/
    const sections = document.querySelectorAll('section[id]');
    const scrollActive = () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight,
                  sectionTop = current.offsetTop - 58,
                  sectionId = current.getAttribute('id');
            const navMenuLink = document.querySelector('#nav-menu a[href*=' + sectionId + ']');
            if (navMenuLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navMenuLink.classList.add('active-link');
                } else {
                    navMenuLink.classList.remove('active-link');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollActive);

    /*=============== SHOW SCROLL TO TOP BUTTON ===============*/
    const scrollUp = () => {
        const scrollUpBtn = document.getElementById('scroll-up');
        if (window.scrollY >= 350) {
            scrollUpBtn.classList.replace('-bottom-1/4', 'bottom-4');
        } else {
            scrollUpBtn.classList.replace('bottom-4', '-bottom-1/4');
        }
    };
    window.addEventListener('scroll', scrollUp);

    /*=============== TYPING EFFECT ===============*/
    new Typed('.typing-effect', {
        strings: ['App Developer', 'Flutter Developer', 'Web Developer'],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    /*=============== SCROLL REVEAL ANIMATION ===============*/
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2500,
        delay: 400,
    });
    sr.reveal(`#home .text-4xl, #home .text-2xl, #home p, #home .flex-col`);
    sr.reveal(`#home .relative`, { delay: 600, origin: 'bottom' });
    sr.reveal(`#about .grid > div:first-child`, { origin: 'left' });
    sr.reveal(`#about .grid > div:last-child`, { origin: 'right' });
    sr.reveal(`.section-title, .section-subtitle`, { interval: 100 });
    sr.reveal(`#skills .skills-content`, { origin: 'left', interval: 200 });
    sr.reveal(`#services .card`, { interval: 200 });
    sr.reveal(`#qualifications .timeline-item`, { interval: 200 });
    sr.reveal(`#projects .project-filter`, { interval: 100 });
    sr.reveal(`#projects .project-item`, { interval: 200 });
    sr.reveal(`#contact .grid > div:first-child`, { origin: 'left' });
    sr.reveal(`#contact .grid > div:last-child`, { origin: 'right' });

    /*=============== PROJECT FILTER ===============*/
    const filterButtons = document.querySelectorAll('.project-filter');
    const projectItems = document.querySelectorAll('.project-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active-filter'));
            button.classList.add('active-filter');
            const filterValue = button.getAttribute('data-filter');
            projectItems.forEach(item => {
                item.style.display = (filterValue === 'all' || item.getAttribute('data-category') === filterValue) ? 'block' : 'none';
            });
        });
    });

    /*=============== SERVICES LINK TO PROJECT FILTER ===============*/
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', () => {
            const filterTarget = link.getAttribute('data-filter-target');
            if (filterTarget) {
                const filterButton = document.querySelector(`.project-filter[data-filter="${filterTarget}"]`);
                if (filterButton) {
                    setTimeout(() => filterButton.click(), 50);
                }
            }
        });
    });
}
