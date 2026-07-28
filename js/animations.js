// ============================================================
// js/animations.js — GSAP анимации и визуальные эффекты
// ANOKHIN AIRWAYS · Москва → Forever
// ============================================================

class AnimationEngine {
    constructor() {
        this.scrollTriggerInstances = [];
        this._init();
    }

    _init() {
        // Регистрируем плагин ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    /**
     * Инициализация всех анимаций страницы
     */
    initAll() {
        this._heroParallax();
        this._revealSections();
        this._flightPathAnimation();
        this._timelineAnimation();
        this._boardingPassEntrance();
        this._countdownPulse();
    }

    /**
     * Параллакс-эффект для Hero-секции
     */
    _heroParallax() {
        if (typeof gsap === 'undefined') return;

        // Параллакс для облаков
        gsap.to('.hero__cloud--1', {
            y: 60,
            x: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        gsap.to('.hero__cloud--2', {
            y: -40,
            x: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2
            }
        });

        // Параллакс для контента Hero
        gsap.to('.hero__content', {
            y: 100,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    /**
     * Плавное появление секций при скролле
     */
    _revealSections() {
        if (typeof gsap === 'undefined') return;

        // Общее появление секций
        const sections = document.querySelectorAll('section:not(#hero)');
        sections.forEach(section => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        end: 'top 50%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Заголовки секций с маской
        const sectionTitles = document.querySelectorAll('.section__title');
        sectionTitles.forEach(title => {
            gsap.fromTo(title,
                { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
                {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    /**
     * Анимация самолёта по маршруту
     */
    _flightPathAnimation() {
        if (typeof gsap === 'undefined') return;

        const plane = document.getElementById('route-plane');
        if (!plane) return;

        const path = document.getElementById('flight-path');
        if (!path) return;

        // Создаём анимацию движения по path
        const pathLength = path.getTotalLength();

        // Начальная позиция
        gsap.set(plane, { opacity: 0.3 });

        ScrollTrigger.create({
            trigger: '#route',
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1.5,
            onUpdate: (self) => {
                const progress = self.progress;
                const point = path.getPointAtLength(progress * pathLength);
                gsap.set(plane, {
                    x: point.x,
                    y: point.y,
                    opacity: 0.3 + progress * 0.7
                });

                // Поворот самолёта по направлению пути
                if (progress < 0.99) {
                    const nextPoint = path.getPointAtLength(Math.min((progress + 0.001) * pathLength, pathLength));
                    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
                    gsap.set(plane, { rotation: angle + 90 });
                }
            }
        });
    }

    /**
     * Анимация элементов таймлайна
     */
    _timelineAnimation() {
        if (typeof gsap === 'undefined') return;

        const items = document.querySelectorAll('.timeline__item');
        items.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    delay: index * 0.15,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    /**
     * Эффект появления посадочного талона
     */
    _boardingPassEntrance() {
        if (typeof gsap === 'undefined') return;

        const pass = document.getElementById('boarding-pass-card');
        if (!pass) return;

        gsap.fromTo(pass,
            { opacity: 0, y: 40, scale: 0.96 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: pass,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    /**
     * Пульсация счётчика
     */
    _countdownPulse() {
        if (typeof gsap === 'undefined') return;

        const flips = document.querySelectorAll('.countdown__flip');
        flips.forEach(flip => {
            gsap.fromTo(flip,
                { borderColor: 'rgba(215, 178, 109, 0.2)' },
                {
                    borderColor: 'rgba(215, 178, 109, 0.5)',
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                }
            );
        });
    }

    /**
     * Анимация для элементов с data-атрибутами
     */
    animateElement(el, animationType = 'fadeUp') {
        if (typeof gsap === 'undefined') return;

        switch (animationType) {
            case 'fadeUp':
                gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                break;
            case 'fadeIn':
                gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
                break;
            case 'scaleIn':
                gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' });
                break;
            default:
                break;
        }
    }

    /**
     * Очистка всех ScrollTrigger
     */
    destroy() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(st => st.kill());
        }
    }
}

window.AnimationEngine = AnimationEngine;