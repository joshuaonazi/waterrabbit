        const loadingScreen = document.getElementById('loading-screen');
        const loadingLogo = document.querySelector('.loader-logo');
        const loadingPercent = document.querySelector('.loader-percent');
        const loadingProgress = document.querySelector('.loader-progress');

        let startTime = null;
        const loadDuration = 2200;

        function stepLoader(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = Math.min(timestamp - startTime, loadDuration);
            const percent = Math.round((elapsed / loadDuration) * 100);
            loadingPercent.textContent = `${percent}%`;
            loadingProgress.style.width = `${percent}%`;
            loadingLogo.style.filter = `grayscale(${100 - percent}%) brightness(${0.6 + percent * 0.0035}) saturate(${0.7 + percent * 0.003})`;

            if (elapsed < loadDuration) {
                window.requestAnimationFrame(stepLoader);
            } else {
                loadingLogo.style.filter = 'grayscale(0%) brightness(1) saturate(1)';
                setTimeout(() => {
                    loadingScreen.classList.add('hide');
                    document.body.style.overflow = '';
                }, 180);
            }
        }

        document.body.style.overflow = 'hidden';
        window.requestAnimationFrame(stepLoader);

        // Scroll-triggered fade-in
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.12
        });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Flip card toggle
        const flipCards = document.querySelectorAll('.flip-card');
        flipCards.forEach(card => {
            card.addEventListener('click', () => {
    // Flip card toggle & Infinite Scroll
    const flipContainer = document.querySelector('.flip-cards-container');
    if (flipContainer) {
        // Event delegation for flipping
        flipContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.flip-card');
            if (card) {
                card.classList.toggle('flipped');
            }
        });

        // Clone cards for infinite loop
        const originalCards = Array.from(flipContainer.querySelectorAll('.flip-card'));
        if (originalCards.length > 0) {
            // Clone two sets to ensure enough scroll buffer
            for (let i = 0; i < 2; i++) {
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.classList.remove('fade-up', 'visible');
                    flipContainer.appendChild(clone);
                });
            }

            flipContainer.addEventListener('scroll', () => {
                const scrollLeft = flipContainer.scrollLeft;
                const maxScrollLeft = flipContainer.scrollWidth - flipContainer.clientWidth;
                
                const cardWidth = originalCards[0].offsetWidth;
                const style = window.getComputedStyle(flipContainer);
                const gap = style.gap && style.gap !== 'normal' ? parseFloat(style.gap) : 0;
                const setWidth = (cardWidth + gap) * originalCards.length;

                // Reset position seamlessly at edges
                if (scrollLeft >= maxScrollLeft - 5) {
                    flipContainer.scrollLeft = scrollLeft - setWidth;
                } else if (scrollLeft <= 0) {
                    flipContainer.scrollLeft = scrollLeft + setWidth;
                }
            });

            setTimeout(() => {
                const cardWidth = originalCards[0].offsetWidth;
                const style = window.getComputedStyle(flipContainer);
                const gap = style.gap && style.gap !== 'normal' ? parseFloat(style.gap) : 0;
                flipContainer.scrollLeft = (cardWidth + gap) * originalCards.length;
            }, 500);
        }
    }

        // Contact form handler
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();
                
                if (!name || !email || !subject || !message) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                
                // Reset form
                contactForm.reset();
            });
        }

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // FAQ accordion toggle
        const faqToggles = document.querySelectorAll('.faq-toggle');
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const item = toggle.closest('.faq-item');
                const expanded = toggle.getAttribute('aria-expanded') === 'true';
                
                // Close all other items
                faqToggles.forEach(otherToggle => {
                    const otherItem = otherToggle.closest('.faq-item');
                    if (otherItem !== item) {
                        otherToggle.setAttribute('aria-expanded', 'false');
                        otherItem.classList.remove('open');
                    }
                });
                
                // Toggle current item
                toggle.setAttribute('aria-expanded', String(!expanded));
                item.classList.toggle('open', !expanded);
            });
        });

        // HERO carousel (3 slides) with text transitions
        (function setupHeroCarousel() {
            const slides = Array.from(document.querySelectorAll('.hero-slide'));
            const texts = Array.from(document.querySelectorAll('.hero-text'));
            if (!slides.length || !texts.length) return;

            let current = 0;
            const exitClasses = ['exit-up', 'exit-left', 'exit-down'];
            const intervalMs = 2000;

            function goTo(next) {
                if (next === current) return;

                // images
                slides[current].classList.remove('active');
                slides[next].classList.add('active');

                // texts
                const outgoing = texts[current];
                const incoming = texts[next];

                // trigger outgoing exit animation matching the outgoing index
                outgoing.classList.remove('active');
                const exit = exitClasses[current % exitClasses.length];
                outgoing.classList.add(exit);

                // ensure we clear the exit class after transition
                setTimeout(() => {
                    outgoing.classList.remove(exit);
                }, 950);

                // show incoming with fade-in
                incoming.classList.add('active');

                current = next;
            }

            // auto advance
            let autoAdvance = null;
            function startAutoAdvance() {
                if (autoAdvance) {
                    clearInterval(autoAdvance);
                }
                autoAdvance = setInterval(() => {
                    const next = (current + 1) % slides.length;
                    goTo(next);
                }, intervalMs);
            }

            const heroSection = document.getElementById('hero');
            heroSection.addEventListener('mousemove', (event) => {
                const rect = heroSection.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                heroSection.style.setProperty('--hero-tooltip-x', `${x}px`);
                heroSection.style.setProperty('--hero-tooltip-y', `${y}px`);
            });
            heroSection.addEventListener('mouseenter', () => {
                if (autoAdvance) {
                    clearInterval(autoAdvance);
                    autoAdvance = null;
                }
            });
            heroSection.addEventListener('mouseleave', startAutoAdvance);

            startAutoAdvance();
        })();

        