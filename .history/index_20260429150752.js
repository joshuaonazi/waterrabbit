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

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        