// ============================================================
// js/rsvp.js — Обработка формы RSVP и генерация посадочного талона
// ANOKHIN AIRWAYS · Москва → Forever
// ============================================================

class RSVPManager {
    constructor(options = {}) {
        this.form = document.getElementById(options.formId || 'rsvp-form');
        this.confirmation = document.getElementById(options.confirmationId || 'rsvp-confirmation');
        this.confirmedPass = document.getElementById(options.confirmedPassId || 'confirmed-pass');
        this.resetBtn = document.getElementById(options.resetId || 'rsvp-reset');
        this.submitBtn = document.getElementById(options.submitId || 'rsvp-submit');
        this.passengerNameInput = document.getElementById('passenger-name');
        this.passengerPhoneInput = document.getElementById('passenger-phone');
        this.mealSelect = document.getElementById('meal-choice');
        this.barSelect = document.getElementById('bar-preference');
        this.commentsTextarea = document.getElementById('comments');
        this._init();
    }

    _init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this._handleSubmit(e));
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this._resetForm());
        }
        this._setupValidation();
    }

    _setupValidation() {
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this._validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('rsvp__input--error')) {
                    this._validateField(input);
                }
            });
        });
    }

    _validateField(field) {
        const errorEl = field.parentElement.querySelector('.rsvp__error-message');
        let error = null;

        if (field.hasAttribute('required') && !field.value.trim()) {
            error = 'Обязательное поле';
        } else if (field.type === 'tel' && field.value.trim() && !/^\+?[\d\s\-()]{7,20}$/.test(field.value.trim())) {
            error = 'Некорректный номер телефона';
        }

        if (error) {
            field.classList.add('rsvp__input--error');
            field.classList.add('rsvp__select--error');
            if (errorEl) {
                errorEl.textContent = error;
            } else {
                const span = document.createElement('span');
                span.className = 'rsvp__error-message';
                span.textContent = error;
                field.parentElement.appendChild(span);
            }
            return false;
        } else {
            field.classList.remove('rsvp__input--error');
            field.classList.remove('rsvp__select--error');
            if (errorEl) errorEl.remove();
            return true;
        }
    }

    async _handleSubmit(e) {
        e.preventDefault();

        // Валидация всех полей
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!this._validateField(input)) isValid = false;
        });

        if (!isValid) return;

        // Состояние загрузки
        this.submitBtn.classList.add('rsvp__submit--loading');
        this.submitBtn.disabled = true;

        // Имитация отправки данных
        await this._simulateSubmission();

        // Генерация посадочного талона
        this._generateBoardingPass();

        // Показ подтверждения
        this.form.style.display = 'none';
        this.confirmation.style.display = 'block';

        // Прокрутка к подтверждению
        this.confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Сброс состояния кнопки
        this.submitBtn.classList.remove('rsvp__submit--loading');
        this.submitBtn.disabled = false;

        // Интеграция с Telegram Bot (закомментировано)
        // this._sendToTelegram(formData);
    }

    async _simulateSubmission() {
        return new Promise(resolve => setTimeout(resolve, 1200));
    }

    _generateBoardingPass() {
        const passengerName = this.passengerNameInput.value.trim();
        const phone = this.passengerPhoneInput.value.trim();
        const meal = this.mealSelect.options[this.mealSelect.selectedIndex]?.text || 'Не выбрано';
        const bar = this.barSelect.options[this.barSelect.selectedIndex]?.text || 'Не выбрано';
        const comments = this.commentsTextarea.value.trim();
        const bookingRef = 'AA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        const passHTML = `
            <div class="boarding-pass" style="grid-template-columns: 1fr 160px; max-width: 650px; margin: 0 auto;">
                <div class="boarding-pass__perforation" style="left: calc(100% - 160px);" aria-hidden="true"></div>
                <div class="boarding-pass__main" style="padding: 28px 24px;">
                    <div class="boarding-pass__header" style="margin-bottom: 20px;">
                        <div class="boarding-pass__airline">
                            <svg width="24" height="24" viewBox="0 0 48 48" fill="none"><path d="M24 4L28 16L40 20L28 24L24 36L20 24L8 20L20 16L24 4Z" stroke="#D7B26D" stroke-width="1.5" fill="none"/></svg>
                            <span style="font-size:10px;">ANOKHIN AIRWAYS</span>
                        </div>
                        <span class="boarding-pass__class">BUSINESS CLASS · CONFIRMED</span>
                    </div>
                    <div class="boarding-pass__body" style="gap: 18px;">
                        <div class="boarding-pass__row boarding-pass__row--double">
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Пассажир</span>
                                <span class="boarding-pass__field-value" style="font-size:16px;">${this._escapeHTML(passengerName)}</span>
                            </div>
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Бронь</span>
                                <span class="boarding-pass__field-value" style="font-size:16px;">${bookingRef}</span>
                            </div>
                        </div>
                        <div class="boarding-pass__row boarding-pass__row--quad">
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Рейс</span>
                                <span class="boarding-pass__field-value">AA-0827</span>
                            </div>
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Класс</span>
                                <span class="boarding-pass__field-value">Business</span>
                            </div>
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Меню</span>
                                <span class="boarding-pass__field-value" style="font-size:13px;">${this._escapeHTML(meal)}</span>
                            </div>
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Бар</span>
                                <span class="boarding-pass__field-value" style="font-size:13px;">${this._escapeHTML(bar)}</span>
                            </div>
                        </div>
                        <div class="boarding-pass__row boarding-pass__row--triple">
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Посадка</span>
                                <span class="boarding-pass__field-value">13:00</span>
                            </div>
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Дата</span>
                                <span class="boarding-pass__field-value">08 AUG 2027</span>
                            </div>
                            <div class="boarding-pass__field">
                                <span class="boarding-pass__field-label">Пункт назначения</span>
                                <span class="boarding-pass__field-value">FOREVER</span>
                            </div>
                        </div>
                        ${comments ? `<div class="boarding-pass__row"><div class="boarding-pass__field"><span class="boarding-pass__field-label">Примечания</span><span class="boarding-pass__field-value" style="font-size:12px;">${this._escapeHTML(comments)}</span></div></div>` : ''}
                    </div>
                </div>
                <div class="boarding-pass__stub" style="padding: 20px 12px;">
                    <div class="boarding-pass__stub-content">
                        <span class="boarding-pass__stub-label">ПОСАДОЧНЫЙ</span>
                        <span class="boarding-pass__stub-flight" style="font-size:20px;">AA-0827</span>
                        <span class="boarding-pass__stub-date">08 AUG 2027</span>
                        <span class="boarding-pass__stub-seat">CONFIRMED</span>
                        <div class="boarding-pass__qr" style="margin-top:8px;">
                            <svg width="56" height="56" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="white"/><rect x="4" y="4" width="16" height="16" fill="#07111F"/><rect x="8" y="8" width="8" height="8" fill="white"/><rect x="44" y="4" width="16" height="16" fill="#07111F"/><rect x="48" y="8" width="8" height="8" fill="white"/><rect x="4" y="44" width="16" height="16" fill="#07111F"/><rect x="8" y="48" width="8" height="8" fill="white"/><rect x="24" y="12" width="4" height="4" fill="#07111F"/><rect x="36" y="12" width="4" height="4" fill="#07111F"/><rect x="44" y="24" width="4" height="4" fill="#07111F"/><rect x="12" y="28" width="4" height="4" fill="#07111F"/><rect x="36" y="28" width="12" height="4" fill="#07111F"/><rect x="28" y="36" width="4" height="4" fill="#07111F"/><rect x="24" y="52" width="8" height="4" fill="#07111F"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.confirmedPass.innerHTML = passHTML;
    }

    _resetForm() {
        this.form.style.display = 'flex';
        this.confirmation.style.display = 'none';
        this.form.reset();
        // Удаляем все сообщения об ошибках
        this.form.querySelectorAll('.rsvp__error-message').forEach(el => el.remove());
        this.form.querySelectorAll('.rsvp__input--error, .rsvp__select--error').forEach(el => {
            el.classList.remove('rsvp__input--error', 'rsvp__select--error');
        });
        this.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Интеграция с Telegram Bot (закомментировано для будущей активации)
    /*
    async _sendToTelegram(formData) {
        const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
        const CHAT_ID = 'YOUR_CHAT_ID_HERE';
        const message = this._formatTelegramMessage(formData);

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
        }
    }

    _formatTelegramMessage(data) {
        return `
    <b>🛫 НОВЫЙ ПАССАЖИР · ANOKHIN AIRWAYS</b>

    <b>Имя:</b> ${data.name}
    <b>Телефон:</b> ${data.phone}
    <b>Меню:</b> ${data.meal}
    <b>Бар:</b> ${data.bar}
    <b>Комментарий:</b> ${data.comments || 'Нет'}

    <i>Рейс AA-0827 · Москва → Forever</i>
        `.trim();
    }
    */
}

window.RSVPManager = RSVPManager;