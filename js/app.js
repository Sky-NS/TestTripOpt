// ============================================================
// js/app.js — Основной модуль приложения
// ANOKHIN AIRWAYS · Москва → Forever
// ============================================================

class AnokhinAirwaysApp {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.mainContent = document.getElementById('main-content');
        this.nav = document.getElementById('nav');
        this.navBurger = document.getElementById('nav-burger');
        this.mobileNav = document.getElementById('mobile-nav');
        this.heroCanvas = document.getElementById('hero-canvas');
        this.animationEngine = null;
        this.countdown = null;
        this.rsvpManager = null;
        this._init();
    }

    _init() {
        // Ждём загрузки DOM и ресурсов
        window.addEventListener('DOMContentLoaded', () => this._onDOMReady());
        window.addEventListener('load', () => this._onLoad());
    }

    _onDOMReady() {
        // Инициализация навигации
        this._initNavigation();

        // Инициализация анимаций
        this.animationEngine = new AnimationEngine();

        // Инициализация обратного отсчёта
        this.countdown = new LuxuryCountdown('2027-08-08T13:00:00+03:00', {
            daysId: 'countdown-days',
            hoursId: 'countdown-hours',
            minutesId: 'countdown-minutes',
            secondsId: 'countdown-seconds'
        });

        // Инициализация RSVP
        this.rsvpManager = new RSVPManager({
            formId: 'rsvp-form',
            confirmationId: 'rsvp-confirmation',
            confirmedPassId: 'confirmed-pass',
            resetId: 'rsvp-reset',
            submitId: 'rsvp-submit'
        });
    }

    _onLoad() {
        // Скрываем прелоадер
        this._hidePreloader();

        // Запускаем canvas-анимацию звёзд
        this._initStarfield();

        // Инициализируем все GSAP-анимации
        if (this.animationEngine) {
            this.animationEngine.initAll();
        }
    }

    /**
     * Скрытие прелоадера
     */
    _hidePreloader() {
        if (!this.preloader) return;

        setTimeout(() => {
            this.preloader.classList.add('preloader--hidden');
            this.mainContent.classList.add('main-content--visible');

            // Удаляем прелоадер из DOM после анимации
            this.preloader.addEventListener('transitionend', () => {
                if (this.preloader.parentNode) {
                    this.preloader.remove();
                }
            }, { once: true });
        }, 1200);
    }

    /**
     * Инициализация навигации
     */
    _initNavigation() {
        // Изменение навигации при скролле
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                this.nav.classList.add('nav--scrolled');
            } else {
                this.nav.classList.remove('nav--scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });

        // Мобильное меню
        if (this.navBurger && this.mobileNav) {
            this.navBurger.addEventListener('click', () => this._toggleMobileNav());

            // Закрытие меню при клике на ссылку
            const mobileLinks = this.mobileNav.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => this._closeMobileNav());
            });
        }

        // Плавный скролл для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = this.nav.offsetHeight + 20;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    _toggleMobileNav() {
        const isOpen = this.mobileNav.classList.contains('mobile-nav--open');
        if (isOpen) {
            this._closeMobileNav();
        } else {
            this._openMobileNav();
        }
    }

    _openMobileNav() {
        this.mobileNav.classList.add('mobile-nav--open');
        this.mobileNav.setAttribute('aria-hidden', 'false');
        this.navBurger.classList.add('nav__burger--active');
        this.navBurger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    _closeMobileNav() {
        this.mobileNav.classList.remove('mobile-nav--open');
        this.mobileNav.setAttribute('aria-hidden', 'true');
        this.navBurger.classList.remove('nav__burger--active');
        this.navBurger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     * Canvas-анимация звёздного неба в Hero
     */
    _initStarfield() {
        if (!this.heroCanvas) return;

        const canvas = this.heroCanvas;
        const ctx = canvas.getContext('2d');
        let stars = [];
        let animationId = null;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        const createStars = () => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const count = Math.floor((width * height) / 3500);
            stars = [];

            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.2 + 0.3,
                    opacity: Math.random() * 0.7 + 0.15,
                    twinkleSpeed: Math.random() * 0.015 + 0.005,
                    twinkleOffset: Math.random() * Math.PI * 2
                });
            }
        };

        const draw = (timestamp) => {
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            ctx.clearRect(0, 0, width, height);

            stars.forEach(star => {
                const twinkle = Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset) * 0.35 + 0.65;
                const alpha = star.opacity * twinkle;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();

                // Лёгкое свечение для ярких звёзд
                if (star.radius > 0.8 && alpha > 0.5) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(215, 178, 109, ${alpha * 0.12})`;
                    ctx.fill();
                }
            });

            animationId = requestAnimationFrame(draw);
        };

        resize();
        createStars();
        animationId = requestAnimationFrame(draw);

        // Ресайз
        const handleResize = () => {
            resize();
            createStars();
        };

        window.addEventListener('resize', handleResize);

        // Сохраняем ссылку для очистки
        this._starfieldCleanup = () => {
            if (animationId) cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }

    /**
     * Публичный метод для очистки ресурсов
     */
    destroy() {
        if (this.countdown) this.countdown.destroy();
        if (this.animationEngine) this.animationEngine.destroy();
        if (this._starfieldCleanup) this._starfieldCleanup();
    }
}

// Запуск приложения
const app = new AnokhinAirwaysApp();

// Экспорт для возможного внешнего использования
window.AnokhinAirwaysApp = AnokhinAirwaysApp;
window.app = app;