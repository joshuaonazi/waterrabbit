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

        
        /* ============================================================
   UTILITY SECTION — JavaScript
   Place this just before your closing </body> tag
   OR wrap it in: document.addEventListener('DOMContentLoaded', () => { ... })
   ============================================================ */

(function () {
  "use strict";

  /* ── Elements ─────────────────────────────────────── */
  const track       = document.getElementById("carouselTrack");
  const prevBtn     = document.getElementById("prevBtn");
  const nextBtn     = document.getElementById("nextBtn");
  const dotsWrapper = document.getElementById("carouselDots");
  const cards       = Array.from(document.querySelectorAll(".card-wrapper"));
  const flipCards   = Array.from(document.querySelectorAll(".flip-card"));

  if (!track || !cards.length) return; // guard: elements must exist

  /* ── State ────────────────────────────────────────── */
  let currentIndex  = 0;
  let visibleCount  = getVisibleCount();
  let maxIndex      = Math.max(0, cards.length - visibleCount);

  /* ── Dots ─────────────────────────────────────────── */
  function buildDots() {
    dotsWrapper.innerHTML = "";
    const totalDots = maxIndex + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === currentIndex ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrapper.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsWrapper.querySelectorAll(".dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  /* ── Layout helpers ───────────────────────────────── */
  function getCardWidth() {
    const card = cards[0];
    const style = getComputedStyle(card);
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return card.offsetWidth + gap;
  }

  function getVisibleCount() {
    const wrapper = track.parentElement;
    const availW  = wrapper ? wrapper.clientWidth : window.innerWidth;
    const cardW   = cards[0] ? cards[0].offsetWidth : 280;
    const gap     = 24;
    return Math.max(1, Math.floor((availW + gap) / (cardW + gap)));
  }

  /* ── Navigation ───────────────────────────────────── */
  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateButtons();
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  /* ── Keyboard navigation (left / right arrows) ────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  goTo(currentIndex - 1);
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
  });

  /* ── Card flip (click + keyboard Enter/Space) ─────── */
  flipCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Prevent flip from triggering if user is dragging
      if (isDragging) return;
      card.classList.toggle("is-flipped");
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });

  /* ── Drag / swipe on the track ────────────────────── */
  let startX      = 0;
  let startScroll = 0;
  let isDragging  = false;
  const DRAG_THRESHOLD = 5; // px — below this, treat as a click not a drag

  track.addEventListener("mousedown", (e) => {
    startX      = e.pageX;
    startScroll = currentIndex;
    isDragging  = false;
    track.style.transition = "none";
  });

  window.addEventListener("mousemove", (e) => {
    if (!startX && startX !== 0) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) isDragging = true;
    if (!isDragging) return;

    const offset = startScroll * getCardWidth() - dx;
    track.style.transform = `translateX(-${Math.max(0, offset)}px)`;
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) { startX = null; return; }
    track.style.transition = ""; // restore smooth transition
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 60) {
      goTo(dx < 0 ? currentIndex + 1 : currentIndex - 1);
    } else {
      goTo(currentIndex); // snap back
    }
    startX = null;
    // Brief timeout so the click event (if any) fires AFTER isDragging check
    setTimeout(() => { isDragging = false; }, 10);
  });

  /* ── Touch swipe support ──────────────────────────── */
  let touchStartX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    isDragging  = false;
    track.style.transition = "none";
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    const dx = e.touches[0].clientX - touchStartX;
    if (Math.abs(dx) > DRAG_THRESHOLD) isDragging = true;
    if (!isDragging) return;
    const offset = currentIndex * getCardWidth() - dx;
    track.style.transform = `translateX(-${Math.max(0, offset)}px)`;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    track.style.transition = ""; // restore
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      goTo(dx < 0 ? currentIndex + 1 : currentIndex - 1);
    } else {
      goTo(currentIndex);
    }
    setTimeout(() => { isDragging = false; }, 10);
  });

  /* ── Recalculate on resize ────────────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      visibleCount = getVisibleCount();
      maxIndex     = Math.max(0, cards.length - visibleCount);
      currentIndex = Math.min(currentIndex, maxIndex);
      buildDots();
      goTo(currentIndex);
    }, 150);
  });

  /* ── Init ─────────────────────────────────────────── */
  buildDots();
  goTo(0);

})();
