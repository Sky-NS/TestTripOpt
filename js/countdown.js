// ============================================================
// js/countdown.js — Обратный отсчёт до даты свадьбы
// ANOKHIN AIRWAYS · Москва → Forever
// ============================================================

class LuxuryCountdown {
    constructor(targetDate, options = {}) {
        this.targetDate = new Date(targetDate).getTime();
        this.daysElement = document.getElementById(options.daysId || 'countdown-days');
        this.hoursElement = document.getElementById(options.hoursId || 'countdown-hours');
        this.minutesElement = document.getElementById(options.minutesId || 'countdown-minutes');
        this.secondsElement = document.getElementById(options.secondsId || 'countdown-seconds');
        this.intervalId = null;
        this._init();
    }

    _init() {
        if (!this.daysElement || !this.hoursElement || !this.minutesElement || !this.secondsElement) {
            console.warn('Countdown: элементы не найдены в DOM');
            return;
        }
        this._update();
        this.intervalId = setInterval(() => this._update(), 1000);
    }

    _update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance <= 0) {
            this._setAll('000', '00', '00', '00');
            this.destroy();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this._setAll(
            String(days).padStart(3, '0'),
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0')
        );
    }

    _setAll(days, hours, minutes, seconds) {
        if (this.daysElement.textContent !== days) {
            this.daysElement.textContent = days;
        }
        if (this.hoursElement.textContent !== hours) {
            this.hoursElement.textContent = hours;
        }
        if (this.minutesElement.textContent !== minutes) {
            this.minutesElement.textContent = minutes;
        }
        if (this.secondsElement.textContent !== seconds) {
            this.secondsElement.textContent = seconds;
        }
    }

    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Экспорт для использования в app.js
window.LuxuryCountdown = LuxuryCountdown;