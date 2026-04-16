// JavaScript Document
document.addEventListener('DOMContentLoaded', () => {
    // Pickup Slider
    let pickupSwiper = null;
    if (document.querySelector('.pickup__slider')) {
        pickupSwiper = new Swiper('.pickup__slider', {
            loop: true,
            speed: 600,
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 40,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.pickup__next',
                prevEl: '.pickup__prev',
            },
            breakpoints: {
                768: {
                    // PC: standard
                    slidesPerView: 'auto',
                    spaceBetween: 60,
                    centeredSlides: true,
                },
                320: {
                    // SP: 235px width (CSS), hide others
                    slidesPerView: 'auto',
                    spaceBetween: 200, // Push others off screen (70px margin + 200px gap > screen width)
                    centeredSlides: true,
                }
            }
        });
    }

    // Course Detail Slider
    let courseSwiper = null;
    if (document.querySelector('.course-slider')) {
        courseSwiper = new Swiper('.course-slider', {
            loop: true,
            speed: 600,
            slidesPerView: 1,
            spaceBetween: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Swipe Guide Logic
        const sliderEl = document.querySelector('.course-slider');
        const guideEl = document.querySelector('.course-slider__guide');
        if (sliderEl && guideEl) {
            const hideGuide = () => {
                guideEl.classList.add('is-hidden');
                // Remove listener after first interaction
                sliderEl.removeEventListener('touchstart', hideGuide);
                sliderEl.removeEventListener('click', hideGuide);
            };
            sliderEl.addEventListener('touchstart', hideGuide, { passive: true });
            sliderEl.addEventListener('click', hideGuide);
        }
    }
    if (pickupSwiper && courseSwiper) {
        const pickupSlides = document.querySelectorAll('.pickup__slider .swiper-slide');
    
        pickupSlides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                // 外部リンク付きバナーはそのまま遷移
                if (e.target.closest('a')) {
                    return;
                }
    
                // js-pickup-slide が付いたものだけ連動
                if (!slide.classList.contains('js-pickup-slide')) {
                    return;
                }
    
                const index = Number(slide.dataset.courseIndex);
                if (Number.isNaN(index)) {
                    return;
                }
    
                const target = document.querySelector('#course-detail');
                if (target) {
                    const targetPos = target.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: targetPos - 100,
                        behavior: 'smooth'
                    });
                }
    
                courseSwiper.slideToLoop(index);
            });
        });
    }
    // School Accordion
    const accordionTriggers = document.querySelectorAll('.js-accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const body = trigger.nextElementSibling;
            trigger.classList.toggle('is-open');
            body.classList.toggle('is-open');

            if (trigger.classList.contains('is-open')) {
                const height = body.scrollHeight;
                body.style.height = height + 'px';
            } else {
                body.style.height = '0';
            }
        });
    });

    // Scroll Management (Header, Hamburger, CTA)
    const fixedHeader = document.querySelector('.header--fixed');
    const hamburger = document.querySelector('.js-hamburger');
    const spNav = document.querySelector('.header__nav');
    const closeBtn = document.querySelector('.js-menu-close');
    const spNavLinks = document.querySelectorAll('.header__nav .header__item a');
    const floatCta = document.querySelector('.float-cta');
    const pagetop = document.querySelector('.js-pagetop');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky Header (PC only via CSS)
        if (fixedHeader) {
            if (scrollY > 600) {
                fixedHeader.classList.add('is-show');
            } else {
                fixedHeader.classList.remove('is-show');
            }
        }

        // Hamburger Visibility (SP only via CSS)
        if (hamburger) {
            if (hamburger.classList.contains('is-active') || scrollY > 20) {
                hamburger.classList.add('is-visible');
            } else {
                hamburger.classList.remove('is-visible');
            }
        }

        // Page Top Visibility
        if (pagetop) {
            if (scrollY > 300) {
                pagetop.classList.add('is-visible');
            } else {
                pagetop.classList.remove('is-visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Page Top Click Event
    if (pagetop) {
        pagetop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    if (hamburger && spNav) {
        hamburger.addEventListener('click', () => {
            const floatCta = document.querySelector('.float-cta');
            hamburger.classList.toggle('is-active');
            spNav.classList.toggle('is-active');
            if (spNav.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden'; // Prevent background scroll
                if (floatCta) floatCta.classList.add('is-hidden');
            } else {
                document.body.style.overflow = '';

                if (floatCta) floatCta.classList.remove('is-hidden');
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const floatCta = document.querySelector('.float-cta');
                hamburger.classList.remove('is-active');
                spNav.classList.remove('is-active');
                document.body.style.overflow = '';
                if (floatCta) floatCta.classList.remove('is-hidden');
            });
        }

        spNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                const floatCta = document.querySelector('.float-cta');
                hamburger.classList.remove('is-active');
                spNav.classList.remove('is-active');
                document.body.style.overflow = '';
                if (floatCta) floatCta.classList.remove('is-hidden');
            });
        });
    }

    // Smooth Scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '') return;

            e.preventDefault();
            try {
                const target = document.querySelector(href);
                if (target) {
                    const targetPos = target.getBoundingClientRect().top + window.scrollY;
                    const isSP = window.innerWidth <= 768;
                    const headerHeight = isSP ? 0 : (fixedHeader ? 60 : 0);

                    window.scrollTo({
                        top: targetPos - headerHeight,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error('Invalid selector for smooth scroll:', href, error);
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const scrollTriggerElements = document.querySelectorAll('.js-scroll-trigger');
    const options = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    scrollTriggerElements.forEach(el => {
        observer.observe(el);
    });
});
