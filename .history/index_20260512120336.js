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
                card.classList.toggle('flipped');
            });
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

        // Mount the WAR roadmap using React
        if (window.React && window.ReactDOM) {
            const e = React.createElement;

            const roadmapTopItems = [
                'Dextools trending',
                'CoinGecko listing',
                'Contract audit',
                'Tier 3 CEX listings',
                'WAR Burn Bot',
                'WAR merch',
                'Charity events',
                'WAR 10-30 mins short movie',
                'WAR Debit Cards',
                'WARswap',
                'P2E game development',
                'Game release on Apple and Play stores',
                '5k+ holders',
                'WARchain layer 1 blockchain',
                'WAR Wallet',
                'WARFi',
                'WAR ecosystem is complete',
                'Website 3.0',
                'More charity events'
            ];

            const roadmapBottomItems = [
                'Whitepaper release',
                'CoinMarketCap listing',
                'Press articles',
                '3D NFT sneak peaks',
                'WAR AI Bot',
                '1-5+ million in market cap',
                '3D NFT release',
                'Tier 2 CEX listings',
                'Certik audit',
                'Website 2.0',
                'WAR university',
                '10-50+ million in market cap',
                'Charity events',
                'Web3 integration',
                '10k+ holders',
                'Tier 1 CEX listings',
                'Social media verified',
                '10-25k+ holders'
            ];

            function buildRoadmapItem(text, index, isTop) {
                const type = isTop ? 'top' : 'bottom';
                const animIndex = isTop ? index * 2 + 1 : index * 2 + 2;
                const animClass = `anim${animIndex}`;
                return e('div', {
                    key: `${type}-${index}`,
                    className: `phases__box__content__${type}__el`
                },
                e('span', {
                    className: `phases__box__content__${type}__el__text text-m ${animClass}`,
                    style: { color: '#00b5c2' }
                }, text),
                e('div', { className: `phases__box__content__${type}__el__img` },
                    e('svg', {
                        className: `phases__box__content__${type}__el__img__line`,
                        width: '6',
                        viewBox: '0 0 6 181',
                        fill: 'none',
                        xmlns: 'http://www.w3.org/2000/svg'
                    },
                        e('path', {
                            className: `phases__box__content__${type}__el__img__line__ellipse ${animClass}`,
                            d: 'M3 5.65544C4.47276 5.65544 5.66667 4.46153 5.66667 2.98877C5.66667 1.51601 4.47276 0.322098 3 0.322098C1.52724 0.322098 0.333333 1.51601 0.333333 2.98877C0.333333 4.46153 1.52724 5.65544 3 5.65544ZM3.5 181L3.5 2.98877H2.5L2.5 181H3.5Z',
                            fill: '#5F616D',
                            style: { fill: '#00b5c2' }
                        })
                    ),
                    e('div', {
                        className: `phases__box__content__${type}__el__img__animation ${animClass}`,
                        style: { height: '119px' }
                    })
                ));
            }

            function Roadmap() {
                return e('div', { className: 'phases landing-section' },
                    e('div', { className: 'phases__box' },
                        e('span', { className: 'phases__box__start' }, 'start'),
                        e('div', { className: 'phases__box__content' },
                            e('div', { className: 'phases__box__content__top' },
                                roadmapTopItems.map((item, index) => buildRoadmapItem(item, index, true))
                            ),
                            e('div', { className: 'phases__box__content__line' },
                                e('span', { className: 'phases__box__content__line__main' }),
                                e('span', { className: 'phases__box__content__line__second' }),
                                e('span', { className: 'phases__box__content__line__ellipse' })
                            ),
                            e('div', { className: 'phases__box__content__bottom' },
                                roadmapBottomItems.map((item, index) => buildRoadmapItem(item, index, false))
                            )
                        )
                    ),
                    e('div', { className: 'phases__list' },
                        ['PHASE 1', 'PHASE 2', 'PHASE 3'].map((label, idx) =>
                            e('span', {
                                key: label,
                                className: 'phases__list__el',
                                style: idx === 0 ? { marginLeft: '83.7rem' } : {}
                            }, label)
                        )
                    )
                );
            }

            const roadmapRoot = document.getElementById('roadmap-root');
            if (roadmapRoot) {
                ReactDOM.createRoot(roadmapRoot).render(e(Roadmap));
                
                // Sticky horizontal roadmap scroll
                setTimeout(() => {
                    const roadmapScroll = document.querySelector('.roadmap__scroll');
                    const roadmapBox = document.querySelector('.phases__box');
                    if (!roadmapScroll || !roadmapBox) return;

                    const animItems = roadmapBox.querySelectorAll('[class*="anim"]');
                    const lineSecond = document.querySelector('.phases__box__content__line__second');
                    const lineEllipse = document.querySelector('.phases__box__content__line__ellipse');

                    let travel = 0;
                    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

                    const updateSizes = () => {
                        const visibleWidth = roadmapScroll.clientWidth;
                        const contentWidth = roadmapBox.scrollWidth;
                        travel = Math.max(0, contentWidth - visibleWidth + 80);
                        roadmapScroll.style.height = `${window.innerHeight + travel + 120}px`;
                        updatePosition();
                    };

                    const updatePosition = () => {
                        const rect = roadmapScroll.getBoundingClientRect();
                        const progress = clamp((window.innerHeight - rect.top) / (rect.height - window.innerHeight), 0, 1);
                        roadmapBox.style.transform = `translateX(${-travel * progress}px)`;

                        if (lineSecond) {
                            lineSecond.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
                        }
                        if (lineEllipse) {
                            lineEllipse.style.left = `${Math.min(100, Math.max(0, progress * 100))}%`;
                        }

                        if (progress > 0.02) {
                            animItems.forEach((item, index) => {
                                if (!item.classList.contains('animated')) {
                                    setTimeout(() => item.classList.add('animated'), index * 25);
                                }
                            });
                        }
                    };

                    window.addEventListener('scroll', () => requestAnimationFrame(updatePosition));
                    window.addEventListener('resize', () => requestAnimationFrame(updateSizes));
                    updateSizes();
                }, 100);
            }
        }

        