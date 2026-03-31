// ==============================
// Единый скрипт для курсов валют
// Поддерживает JPY/RUB и CNY/RUB
// ==============================

// Статические fallback-курсы (на случай, если API не отвечают)
const FALLBACK_JPY_RUB = 0.5;    // 100 JPY = 50 RUB → 1 JPY = 0.5 RUB
const FALLBACK_CNY_RUB = 14.0;   // 1 CNY = 14 RUB

// Кэш в localStorage (действителен 1 час)
const CACHE_KEY_JPY = 'jpy_rub_cache';
const CACHE_KEY_CNY = 'cny_rub_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 час

// Функция сохранения курса в кэш
function saveToCache(key, rate) {
    const cache = {
        rate: rate,
        timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cache));
}

// Функция получения курса из кэша
function getFromCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp > CACHE_TTL) return null;
    return data.rate;
}

// Получение курса JPY/RUB
async function fetchJPYRate() {
    // Сначала пробуем кэш
    const cached = getFromCache(CACHE_KEY_JPY);
    if (cached !== null) return cached;

    // Пробуем API
    const urls = [
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json',
        'https://api.exchangerate.host/latest?base=JPY&symbols=RUB',
        'https://api.exchangerate-api.com/v4/latest/JPY'
    ];

    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            let rate = null;
            if (data.jpy && typeof data.jpy.rub === 'number') {
                rate = data.jpy.rub;  // формат первого API
            } else if (data.rates && data.rates.RUB) {
                rate = data.rates.RUB; // exchangerate.host
            } else if (data.rates && data.rates.RUB) {
                rate = data.rates.RUB; // exchangerate-api.com
            }

            if (rate && rate > 0) {
                saveToCache(CACHE_KEY_JPY, rate);
                return rate;
            }
        } catch (e) {
            console.warn(`Ошибка при запросе ${url}:`, e);
        }
    }

    // Fallback
    console.warn('Используем fallback-курс JPY/RUB:', FALLBACK_JPY_RUB);
    return FALLBACK_JPY_RUB;
}

// Получение курса CNY/RUB
async function fetchCNYRate() {
    const cached = getFromCache(CACHE_KEY_CNY);
    if (cached !== null) return cached;

    // Пробуем несколько API
    const urls = [
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/cny.json',
        'https://api.exchangerate.host/latest?base=CNY&symbols=RUB',
        'https://api.exchangerate-api.com/v4/latest/CNY'
    ];

    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            let rate = null;
            if (data.cny && typeof data.cny.rub === 'number') {
                rate = data.cny.rub;
            } else if (data.rates && data.rates.RUB) {
                rate = data.rates.RUB;
            }

            if (rate && rate > 0) {
                saveToCache(CACHE_KEY_CNY, rate);
                return rate;
            }
        } catch (e) {
            console.warn(`Ошибка при запросе ${url}:`, e);
        }
    }

    console.warn('Используем fallback-курс CNY/RUB:', FALLBACK_CNY_RUB);
    return FALLBACK_CNY_RUB;
}

// Обновление всех цен на странице
function updateAllPrices(jpyRate, cnyRate) {
    // Обновляем одиночные цены в JPY
    document.querySelectorAll('.rub-value[data-jpy]').forEach(el => {
        let jpy = parseFloat(el.getAttribute('data-jpy'));
        if (!isNaN(jpy)) {
            let rub = Math.round(jpy * jpyRate);
            el.textContent = `≈ ${rub} ₽`;
        }
    });

    // Обновляем диапазонные цены в JPY
    document.querySelectorAll('.rub-range[data-min][data-max]').forEach(el => {
        let minJpy = parseFloat(el.getAttribute('data-min'));
        let maxJpy = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minJpy) && !isNaN(maxJpy)) {
            let minRub = Math.round(minJpy * jpyRate);
            let maxRub = Math.round(maxJpy * jpyRate);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });

    // Обновляем одиночные цены в CNY
    document.querySelectorAll('.rub-value-cny[data-cny]').forEach(el => {
        let cny = parseFloat(el.getAttribute('data-cny'));
        if (!isNaN(cny)) {
            let rub = Math.round(cny * cnyRate);
            el.textContent = `≈ ${rub} ₽`;
        }
    });

    // Обновляем диапазонные цены в CNY
    document.querySelectorAll('.rub-range-cny[data-min][data-max]').forEach(el => {
        let minCny = parseFloat(el.getAttribute('data-min'));
        let maxCny = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minCny) && !isNaN(maxCny)) {
            let minRub = Math.round(minCny * cnyRate);
            let maxRub = Math.round(maxCny * cnyRate);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });

    // Обновляем блоки с курсом (если есть)
    let rateDisplay = document.getElementById('exchangeRatePlaceholder');
    if (rateDisplay) {
        // Если на странице есть оба курса, показываем оба
        if (document.querySelector('[data-jpy]') && document.querySelector('[data-cny]')) {
            rateDisplay.textContent = `1 CNY ≈ ${Math.round(cnyRate)} RUB | 100 JPY ≈ ${Math.round(100 * jpyRate)} RUB`;
        } else if (document.querySelector('[data-jpy]')) {
            rateDisplay.textContent = `100 JPY ≈ ${Math.round(100 * jpyRate)} RUB`;
        } else if (document.querySelector('[data-cny]')) {
            rateDisplay.textContent = `1 CNY ≈ ${Math.round(cnyRate)} RUB`;
        }
    }
}

// Главная функция инициализации
async function initCurrency() {
    // Показываем fallback-курс сразу (чтобы не было пустых мест)
    updateAllPrices(FALLBACK_JPY_RUB, FALLBACK_CNY_RUB);

    // Получаем актуальные курсы
    const jpyRate = await fetchJPYRate();
    const cnyRate = await fetchCNYRate();

    // Обновляем цены с актуальными курсами
    updateAllPrices(jpyRate, cnyRate);
}

// Запускаем после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurrency);
} else {
    initCurrency();
          }
