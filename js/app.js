// ==============================
// Общие функции для всего сайта
// ==============================

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Кнопка "Наверх"
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '⬆️';
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Наверх');
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #b03e3e;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s;
    `;
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
}

// Сохранение курсов в localStorage для budget.html
function saveRatesToLocalStorage() {
    const jpyRate = document.getElementById('jpyRate');
    const cnyRate = document.getElementById('cnyRate');
    
    if (jpyRate && cnyRate) {
        jpyRate.addEventListener('change', () => {
            localStorage.setItem('userJpyRate', jpyRate.value);
        });
        cnyRate.addEventListener('change', () => {
            localStorage.setItem('userCnyRate', cnyRate.value);
        });
        
        // Восстановление сохранённых значений
        const savedJpy = localStorage.getItem('userJpyRate');
        const savedCny = localStorage.getItem('userCnyRate');
        if (savedJpy) jpyRate.value = savedJpy;
        if (savedCny) cnyRate.value = savedCny;
    }
}

// Сворачиваемые блоки для длинных списков
function initCollapsibleBlocks() {
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
        });
    });
}

// Добавление индикатора загрузки курсов
function addRateLoadingIndicator() {
    const ratePlaceholders = document.querySelectorAll('#exchangeRatePlaceholder');
    ratePlaceholders.forEach(el => {
        if (el.textContent === 'загрузка...') {
            const loadingSpan = document.createElement('span');
            loadingSpan.textContent = '🔄';
            loadingSpan.style.display = 'inline-block';
            loadingSpan.style.animation = 'spin 1s linear infinite';
            el.textContent = '';
            el.appendChild(loadingSpan);
        }
    });
}

// Добавляем анимацию спиннера
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    saveRatesToLocalStorage();
    initCollapsibleBlocks();
    addRateLoadingIndicator();
});
