





const CONFIG = {
    email: "oshantheekshana63@gmail.com",

    formSubmitEndpoint: "",

    frameCount: 0,

    framePath: (i) =>
        `assets/frames/frame_${String(i).padStart(3, "0")}.jpg`
};


//applicaion

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    //page loader

    const loader = document.getElementById("siteLoader");

    window.addEventListener("load", () => {

        setTimeout(() => {
            loader?.classList.add("hidden");
        }, 450);

    });

    // Backup loader timeout
    setTimeout(() => {
        loader?.classList.add("hidden");
    }, 2200);


    //copyrigth year

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    //dark & light

    const themeButton = document.getElementById("themeToggle");


    // Load previously selected theme
    const savedTheme = localStorage.getItem("ot-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.dataset.theme = savedTheme;
    }


    // Update theme icon
    const updateThemeIcon = () => {

        if (!themeButton) return;

        const isLight =
            document.documentElement.dataset.theme === "light";

        themeButton.innerHTML = `
            <i class="bi ${
                isLight
                    ? "bi-moon-stars-fill"
                    : "bi-sun-fill"
            }"></i>
        `;

    };


    updateThemeIcon();


    // Theme toggle button
    themeButton?.addEventListener("click", () => {

        const currentTheme =
            document.documentElement.dataset.theme;

        const nextTheme =
            currentTheme === "light" ? "dark" : "light";

        document.documentElement.dataset.theme = nextTheme;

        localStorage.setItem("ot-theme", nextTheme);

        updateThemeIcon();

    });


   //smooth animate

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior: reducedMotion ? "auto" : "smooth"

            });


            // Close mobile navigation
            const menu = document.getElementById("mainNav");

            if (
                menu?.classList.contains("show") &&
                window.bootstrap
            ) {

                bootstrap.Collapse
                    .getOrCreateInstance(menu)
                    .hide();

            }

        });

    });


    //nav bar scroll fun

    const navbar = document.getElementById("siteNav");

    const backToTop = document.getElementById("backToTop");


    const handleScroll = () => {

        // Navbar background
        navbar?.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );


        // Back to top button
        backToTop?.classList.toggle(
            "visible",
            window.scrollY > 600
        );

    };


    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    handleScroll();


    // Back to top
    backToTop?.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: reducedMotion ? "auto" : "smooth"

        });

    });


    //nav link

    const navigationLinks = [
        ...document.querySelectorAll(".nav-link")
    ];


    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;


                navigationLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                        "#" + entry.target.id
                    );

                });


                // Skills section animation
                if (entry.target.id === "skills") {

                    entry.target.classList.add(
                        "skills-visible"
                    );

                }

            });

        },

        {
            rootMargin: "-35% 0px -55% 0px"
        }

    );


    const sectionIDs = [
        "about",
        "work",
        "skills",
        "journey",
        "creative"
    ];


    sectionIDs.forEach(id => {

        const section = document.getElementById(id);

        if (section) {
            sectionObserver.observe(section);
        }

    });


   
       // ANIMATED DEVELOPER / DESIGNER / CREATOR TEXT
   

    const roles = [

        "Developer",
        "Designer",
        "Creator",
        "Problem Solver"

    ];


    const roleElement = document.getElementById("dynamicRole");


    if (roleElement && !reducedMotion) {

        let roleIndex = 0;

        let characterIndex = roles[0].length;

        let deleting = true;


        const typeEffect = () => {

            const currentRole = roles[roleIndex];


            // Delete or add characters
            characterIndex += deleting ? -1 : 1;


            roleElement.textContent = currentRole.slice(
                0,
                characterIndex
            );


            let delay = deleting ? 55 : 95;


            // Pause after completing a word
            if (
                !deleting &&
                characterIndex === currentRole.length
            ) {

                deleting = true;

                delay = 1200;

            }


            // Move to next word
            else if (
                deleting &&
                characterIndex === 0
            ) {

                deleting = false;

                roleIndex = (roleIndex + 1) % roles.length;

                delay = 280;

            }


            setTimeout(typeEffect, delay);

        };


        setTimeout(typeEffect, 1500);

    }


    
       //SCROLL REVEAL ANIMATIONS
       
    

    if (
        !reducedMotion &&
        window.gsap &&
        window.ScrollTrigger
    ) {

        gsap.registerPlugin(ScrollTrigger);


        gsap.utils.toArray(".reveal-up").forEach(element => {

            gsap.fromTo(

                element,

                {
                    y: 35,
                    autoAlpha: 0
                },

                {
                    y: 0,
                    autoAlpha: 1,

                    duration: 0.85,

                    ease: "power3.out",

                    scrollTrigger: {

                        trigger: element,

                        start: "top 88%",

                        once: true

                    }

                }

            );

        });

    }

    else {

        // Fallback animation without GSAP
        const revealObserver = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12
            }

        );


        document.querySelectorAll(".reveal-up").forEach(element => {

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       11. 3D MOUSE FOLLOW EFFECT
    ===================================================== */

    const supportsMouse = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


    if (supportsMouse && !reducedMotion) {

        const tiltElements = document.querySelectorAll(
            ".tilt-card, #heroTilt"
        );


        tiltElements.forEach(element => {

            element.addEventListener("mousemove", event => {

                const rect = element.getBoundingClientRect();


                const x =
                    (event.clientX - rect.left) /
                    rect.width - 0.5;


                const y =
                    (event.clientY - rect.top) /
                    rect.height - 0.5;


                element.style.transform = `

                    perspective(1000px)

                    rotateY(${x * 4}deg)

                    rotateX(${-y * 4}deg)

                    translateY(-2px)

                `;

            });


            element.addEventListener("mouseleave", () => {

                element.style.transform = "";

            });

        });

    }


    /* =====================================================
       12. CUSTOM CURSOR
    ===================================================== */

    const cursorDot = document.getElementById("cursorDot");

    const cursorRing = document.getElementById("cursorRing");


    if (
        supportsMouse &&
        cursorDot &&
        cursorRing
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let ringX = 0;
        let ringY = 0;


        // Main cursor
        window.addEventListener("mousemove", event => {

            mouseX = event.clientX;
            mouseY = event.clientY;


            cursorDot.style.transform = `
                translate(${mouseX}px, ${mouseY}px)
            `;

        });


        // Smooth following ring
        const animateCursor = () => {

            ringX += (mouseX - ringX) * 0.16;

            ringY += (mouseY - ringY) * 0.16;


            cursorRing.style.transform = `
                translate(${ringX - 17}px, ${ringY - 17}px)
            `;


            requestAnimationFrame(animateCursor);

        };


        animateCursor();


        // Cursor interaction effect
        document.querySelectorAll(
            "a, button, input, textarea"
        ).forEach(element => {

            element.addEventListener("mouseenter", () => {

                cursorRing.classList.add("active");

            });


            element.addEventListener("mouseleave", () => {

                cursorRing.classList.remove("active");

            });

        });

    }


    /* =====================================================
       13. ANIMATED PARTICLE BACKGROUND
    ===================================================== */

    const particleCanvas = document.getElementById(
        "particleCanvas"
    );


    if (particleCanvas && !reducedMotion) {

        const context = particleCanvas.getContext("2d");

        let particles = [];


        // Create particle positions
        const resizeParticles = () => {

            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );


            particleCanvas.width =
                window.innerWidth * dpr;

            particleCanvas.height =
                window.innerHeight * dpr;


            particleCanvas.style.width =
                window.innerWidth + "px";

            particleCanvas.style.height =
                window.innerHeight + "px";


            context.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            particles = Array.from(

                {
                    length: Math.min(
                        65,
                        Math.floor(window.innerWidth / 20)
                    )
                },

                () => ({

                    x: Math.random() * window.innerWidth,

                    y: Math.random() * window.innerHeight,

                    radius: Math.random() * 1.5 + 0.3,

                    velocityX: (Math.random() - 0.5) * 0.22,

                    velocityY: (Math.random() - 0.5) * 0.22

                })

            );

        };


        // Draw particles
        const drawParticles = () => {

            context.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );


            particles.forEach(particle => {

                particle.x += particle.velocityX;

                particle.y += particle.velocityY;


                // Bounce from screen edges
                if (
                    particle.x < 0 ||
                    particle.x > window.innerWidth
                ) {

                    particle.velocityX *= -1;

                }


                if (
                    particle.y < 0 ||
                    particle.y > window.innerHeight
                ) {

                    particle.velocityY *= -1;

                }


                // Particle appearance
                context.beginPath();

                context.arc(
                    particle.x,
                    particle.y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );


                context.fillStyle =
                    "rgba(198, 243, 107, 0.42)";


                context.fill();

            });


            requestAnimationFrame(drawParticles);

        };


        resizeParticles();

        drawParticles();


        window.addEventListener(
            "resize",
            resizeParticles
        );

    }


    /* =====================================================
       14. PROJECT CATEGORY FILTER
    ===================================================== */

    const filterButtons = document.querySelectorAll(
        ".filter-btn"
    );


    const projectItems = document.querySelectorAll(
        ".project-item"
    );


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;


            // Update active filter button
            filterButtons.forEach(filter => {

                filter.classList.toggle(
                    "active",
                    filter === button
                );

            });


            // Filter projects
            projectItems.forEach(item => {

                const category = item.dataset.category;


                const shouldHide =
                    selectedFilter !== "all" &&
                    category !== selectedFilter;


                item.classList.toggle(
                    "hidden",
                    shouldHide
                );

            });

        });

    });


    /* =====================================================
       15. PROJECT IMAGE LIGHTBOX
    ===================================================== */

    const lightbox = document.getElementById("lightbox");

    const lightboxImage = document.getElementById(
        "lightboxImage"
    );

    const lightboxCaption = document.getElementById(
        "lightboxCaption"
    );

    const lightboxClose = document.getElementById(
        "lightboxClose"
    );


    if (
        lightbox &&
        lightboxImage &&
        lightboxCaption &&
        lightboxClose
    ) {

        // Close lightbox
        const closeLightbox = () => {

            lightbox.classList.remove("open");

            lightbox.setAttribute("aria-hidden", "true");

            document.body.style.overflow = "";

        };


        // Open image
        document.querySelectorAll(".image-trigger").forEach(button => {

            button.addEventListener("click", () => {

                lightboxImage.src = button.dataset.full;


                lightboxImage.alt =
                    button.querySelector("img")?.alt ||
                    "Project image";


                lightboxCaption.textContent =
                    button.dataset.caption || "";


                lightbox.classList.add("open");

                lightbox.setAttribute("aria-hidden", "false");

                document.body.style.overflow = "hidden";

            });

        });


        // Close button
        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );


        // Click outside image
        lightbox.addEventListener("click", event => {

            if (event.target === lightbox) {

                closeLightbox();

            }

        });


        // Escape key
        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {

                closeLightbox();

            }

        });

    }


    /* =====================================================
       16. SCROLL-DRIVEN IMAGE SEQUENCE
       frame_001.jpg
       frame_002.jpg
       frame_003.jpg
       ...
    ===================================================== */

    const sequenceCanvas = document.getElementById(
        "sequenceCanvas"
    );


    const sequenceSection = document.getElementById(
        "sequence"
    );


    const sequenceProgress = document.getElementById(
        "sequenceProgress"
    );


    if (sequenceCanvas && sequenceSection) {

        const canvasContext = sequenceCanvas.getContext("2d");

        let frames = [];

        let currentFrame = 0;


        // Canvas dimensions
        const resizeCanvas = () => {

            const dpr = Math.min(
                window.devicePixelRatio || 1,
                2
            );


            sequenceCanvas.width =
                window.innerWidth * dpr;

            sequenceCanvas.height =
                window.innerHeight * dpr;


            canvasContext.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            renderFrame(currentFrame);

        };


        // Render selected frame
        const renderFrame = index => {

            const image = frames[index];


            canvasContext.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );


            if (
                image &&
                image.complete &&
                image.naturalWidth
            ) {

                const scale = Math.max(

                    window.innerWidth / image.naturalWidth,

                    window.innerHeight / image.naturalHeight

                );


                const width = image.naturalWidth * scale;

                const height = image.naturalHeight * scale;


                canvasContext.drawImage(

                    image,

                    (window.innerWidth - width) / 2,

                    (window.innerHeight - height) / 2,

                    width,

                    height

                );

            }

            else {

                // Placeholder animation
                canvasContext.fillStyle = "#10110f";

                canvasContext.fillRect(
                    0,
                    0,
                    window.innerWidth,
                    window.innerHeight
                );


                canvasContext.strokeStyle =
                    "rgba(198, 243, 107, 0.16)";


                for (let i = 0; i < 14; i++) {

                    canvasContext.beginPath();

                    canvasContext.arc(

                        window.innerWidth * 0.78,

                        window.innerHeight * 0.52,

                        30 + i * 22,

                        0,

                        Math.PI * 2

                    );

                    canvasContext.stroke();

                }

            }

        };


        resizeCanvas();


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        // Load image sequence
        if (CONFIG.frameCount > 0) {

            frames = Array.from(

                {
                    length: CONFIG.frameCount
                },

                (_, index) => {

                    const image = new Image();

                    image.src = CONFIG.framePath(index + 1);


                    image.onload = () => {

                        if (index === currentFrame) {

                            renderFrame(currentFrame);

                        }

                    };


                    return image;

                }

            );


            // Update sequence while scrolling
            const updateSequence = () => {

                const rect =
                    sequenceSection.getBoundingClientRect();


                const maxScroll =
                    sequenceSection.offsetHeight -
                    window.innerHeight;


                const progress = Math.max(

                    0,

                    Math.min(
                        1,
                        -rect.top / maxScroll
                    )

                );


                currentFrame = Math.min(

                    CONFIG.frameCount - 1,

                    Math.floor(
                        progress * (CONFIG.frameCount - 1)
                    )

                );


                if (sequenceProgress) {

                    sequenceProgress.style.width =
                        progress * 100 + "%";

                }


                renderFrame(currentFrame);

            };


            window.addEventListener(
                "scroll",
                updateSequence,
                { passive: true }
            );


            updateSequence();

        }

    }


    /* =====================================================
       17. CONTACT FORM
    ===================================================== */

    const contactForm = document.getElementById(
        "contactForm"
    );


    const formStatus = document.getElementById(
        "formStatus"
    );


    if (contactForm && formStatus) {

        contactForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (!contactForm.reportValidity()) {
                    return;
                }


                // Read form data
                const formData = Object.fromEntries(

                    new FormData(contactForm).entries()

                );


                // Option 1: Online form submission endpoint
                if (CONFIG.formSubmitEndpoint) {

                    const submitButton =
                        contactForm.querySelector(
                            '[type="submit"]'
                        );


                    submitButton.disabled = true;


                    try {

                        const response = await fetch(

                            CONFIG.formSubmitEndpoint,

                            {

                                method: "POST",

                                headers: {

                                    "Content-Type": "application/json",

                                    "Accept": "application/json"

                                },


                                body: JSON.stringify({

                                    ...formData,

                                    _subject:
                                        `Portfolio contact: ${formData.subject}`

                                })

                            }

                        );


                        if (!response.ok) {
                            throw new Error("Submission failed");
                        }


                        formStatus.textContent =
                            "Thanks! Your message has been submitted.";


                        contactForm.reset();

                    }

                    catch (error) {

                        formStatus.textContent =
                            "Could not send automatically. Please email me directly.";

                    }

                    finally {

                        submitButton.disabled = false;

                    }

                }


                // Option 2: Open user's email application
                else if (
                    CONFIG.email &&
                    !CONFIG.email.includes("YOUR_EMAIL")
                ) {

                    const subject = encodeURIComponent(
                        formData.subject
                    );


                    const body = encodeURIComponent(

                        `Name: ${formData.name}

Email: ${formData.email}

Message:
${formData.message}`

                    );


                    window.location.href =

                        `mailto:${CONFIG.email}` +
                        `?subject=${subject}&body=${body}`;


                    formStatus.textContent =
                        "Your email app should open with the message ready to send.";

                }


                // Email not configured
                else {

                    formStatus.textContent =
                        "Setup needed: add your email in js/main.js before using this form.";

                }

            }

        );

    }


    /* =====================================================
       18. APPLICATION INITIALIZED
    ===================================================== */

    console.log(
        "%cOSHAN THEEKSHANA PORTFOLIO",
        "color:#c6f36b;font-size:18px;font-weight:bold;"
    );

    console.log(
        "Portfolio JavaScript initialized successfully."
    );

});


document.addEventListener("DOMContentLoaded", () => {
    const photo = document.getElementById("photoSlide");
    const model = document.getElementById("modelSlide");
    const label = document.getElementById("visualLabel");

    if (!photo || !model) return;

    let showModel = false;

    function switchHeroVisual() {
        showModel = !showModel;

        photo.classList.toggle("active", !showModel);
        model.classList.toggle("active", showModel);

        if (label) {
            label.textContent = showModel
                ? "MEET MY 3D AVATAR"
                : "MEET THE DEVELOPER";
        }
    }

    const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (!motionPreference.matches) {
        setInterval(switchHeroVisual, 10000);
    }
});


