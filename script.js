// script.js

document.addEventListener('DOMContentLoaded', () => {

    // Toggle Mobile Menu
    const toggleBtn = document.querySelector('.toggle-btn');
    const nav = document.querySelector('header nav'); // Target the nav element itself

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            toggleBtn.setAttribute('aria-expanded', isActive); // Update aria-expanded
            // Optional: Toggle body class to prevent scrolling when menu is open
            // document.body.classList.toggle('no-scroll', isActive);
        });

        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                 if (nav.classList.contains('active')) {
                     nav.classList.remove('active');
                     toggleBtn.setAttribute('aria-expanded', 'false');
                     // Optional: Remove body class
                     // document.body.classList.remove('no-scroll');
                 }
            });
        });

        // Close menu if user clicks outside the nav area (optional)
        document.addEventListener('click', (event) => {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggleBtn = toggleBtn.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggleBtn && nav.classList.contains('active')) {
                nav.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                // document.body.classList.remove('no-scroll');
            }
        });

    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
             e.preventDefault(); // Prevent default button behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling and Active Link Highlighting for anchor links
     const header = document.querySelector('header');
     const headerHeight = header ? header.offsetHeight : 0;
     const navLinksForScroll = document.querySelectorAll('header nav ul li a[href^="#"]');

     // Function to remove active class from all nav links
     const removeActiveClasses = () => {
        navLinksForScroll.forEach(link => link.classList.remove('active'));
     };

     // Add click listener for smooth scroll
     navLinksForScroll.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Check if it's a valid internal link
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerHeight - 20; // Extra offset

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Remove active class from others and add to clicked one immediately
                    // We will refine this with scrollspy below for better accuracy
                    removeActiveClasses();
                    this.classList.add('active');

                    // Close mobile nav if open after clicking a link
                     if (nav && nav.classList.contains('active')) {
                         nav.classList.remove('active');
                         toggleBtn.setAttribute('aria-expanded', 'false');
                     }
                }
            }
        });
    });

    // Scrollspy for Active Link Highlighting
    const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID

    const scrollSpy = () => {
        const currentScroll = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Add more offset
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`header nav ul li a[href="#${sectionId}"]`);

            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                if (correspondingLink) {
                    removeActiveClasses(); // Remove from all
                    correspondingLink.classList.add('active'); // Add to current
                }
            }
        });

        // Special case for top of the page
        if (currentScroll < sections[0].offsetTop - headerHeight - 50) {
             removeActiveClasses();
             const homeLink = document.querySelector('header nav ul li a[href="#home"]');
             if (homeLink) {
                 homeLink.classList.add('active');
             }
        }
         // Special case for reaching the contact (footer) section if it's the last link
         const contactLink = document.querySelector('header nav ul li a[href="#contact"]');
         const footer = document.querySelector('footer#contact');
         if (contactLink && footer) {
             // Check if bottom of viewport is near or past the top of the footer
             if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100) { // Near bottom
                  removeActiveClasses();
                  contactLink.classList.add('active');
             }
         }

    };

    // Attach scrollspy to scroll event, potentially throttle this later if performance issues arise
    window.addEventListener('scroll', scrollSpy);
     // Run initially in case the page loads scrolled down
     scrollSpy();

}); // End DOMContentLoaded