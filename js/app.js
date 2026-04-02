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

// Анимация спиннера
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== ПЕРЕКЛЮЧЕНИЕ ТЁМНОЙ/СВЕТЛОЙ ТЕМЫ =====
let themeBtn = null;

function initThemeToggle() {
    themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Переключить тему');
    themeBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(176, 62, 62, 0.7);
        backdrop-filter: blur(4px);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    themeBtn.onmouseenter = () => {
        themeBtn.style.backgroundColor = 'rgba(176, 62, 62, 1)';
        themeBtn.style.transform = 'scale(1.05)';
    };
    themeBtn.onmouseleave = () => {
        themeBtn.style.backgroundColor = 'rgba(176, 62, 62, 0.7)';
        themeBtn.style.transform = 'scale(1)';
    };
    
    document.body.appendChild(themeBtn);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '☀️';
    } else {
        themeBtn.innerHTML = '🌙';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeBtn.innerHTML = isDark ? '☀️' : '🌙';
    });
}

// ===== ПЛАВАЮЩАЯ КНОПКА МЕНЮ И ПЛАВАЮЩЕЕ МЕНЮ =====
let floatingMenuBtn = null;
let floatingMenuPanel = null;
let scrollTimeout = null;

function initFloatingMenuButton() {
    // Создаём плавающую кнопку меню (справа, над кнопкой темы)
    floatingMenuBtn = document.createElement('button');
    floatingMenuBtn.id = 'floating-menu-btn';
    floatingMenuBtn.setAttribute('aria-label', 'Меню');
    floatingMenuBtn.innerHTML = '☰';
    floatingMenuBtn.style.cssText = `
        position: fixed;
        bottom: 140px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(176, 62, 62, 0.7);
        backdrop-filter: blur(4px);
        color: white;
        border: none;
        font-size: 1.8rem;
        font-weight: normal;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.2s;
        display: none;
        align-items: center;
        justify-content: center;
    `;
    
    floatingMenuBtn.onmouseenter = () => {
        floatingMenuBtn.style.backgroundColor = 'rgba(176, 62, 62, 1)';
        floatingMenuBtn.style.transform = 'scale(1.05)';
    };
    floatingMenuBtn.onmouseleave = () => {
        floatingMenuBtn.style.backgroundColor = 'rgba(176, 62, 62, 0.7)';
        floatingMenuBtn.style.transform = 'scale(1)';
    };
    
    document.body.appendChild(floatingMenuBtn);
    
    // Создаём плавающую панель меню (изначально скрыта)
    floatingMenuPanel = document.createElement('div');
    floatingMenuPanel.id = 'floating-menu-panel';
    floatingMenuPanel.style.cssText = `
        position: fixed;
        bottom: 200px;
        right: 80px;
        background-color: var(--bg-card, #fff);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        padding: 10px 0;
        min-width: 180px;
        z-index: 1001;
        display: none;
        flex-direction: column;
        border: 1px solid var(--border-light, #efebe5);
        backdrop-filter: blur(8px);
        background-color: rgba(255,255,255,0.95);
        transition: opacity 0.2s;
    `;
    
    // Добавляем ссылки меню (копируем из .menu-box)
    const menuLinks = [
        { href: "index.html", icon: "🏠", text: "Главная" },
        { href: "osaka.html", icon: "🌆", text: "Осака" },
        { href: "fuji.html", icon: "🗻", text: "Фудзи" },
        { href: "tokyo.html", icon: "🗼", text: "Токио" },
        { href: "shanghai.html", icon: "🏙", text: "Шанхай" },
        { href: "budget.html", icon: "💰", text: "Общий бюджет" },
        { href: "toilet-map.html", icon: "🚽", text: "Карта туалетов" },
        { href: "visa.html", icon: "🛂", text: "Всё для визы" },
        { href: "contacts.html", icon: "📞", text: "Контакты" },
        { href: "glossary.html", icon: "📖", text: "Глоссарий" }
    ];
    
    menuLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.innerHTML = `${link.icon} ${link.text}`;
        a.style.cssText = `
            display: block;
            padding: 10px 20px;
            color: var(--text-primary, #1a1a1a);
            text-decoration: none;
            font-weight: 500;
            transition: background 0.2s;
        `;
        a.addEventListener('mouseenter', () => {
            a.style.backgroundColor = 'var(--card-hover, #f9f7f4)';
        });
        a.addEventListener('mouseleave', () => {
            a.style.backgroundColor = 'transparent';
        });
        floatingMenuPanel.appendChild(a);
    });
    
    document.body.appendChild(floatingMenuPanel);
    
    // Функция показа/скрытия кнопки при прокрутке (как у кнопки "Наверх")
    function toggleFloatingMenuButton() {
        if (window.scrollY > 300) {
            floatingMenuBtn.style.display = 'flex';
        } else {
            floatingMenuBtn.style.display = 'none';
            // Скрываем также панель меню, если она открыта
            floatingMenuPanel.style.display = 'none';
        }
    }
    
    // Обработчик клика по кнопке: переключение видимости панели меню
    floatingMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = floatingMenuPanel.style.display === 'flex';
        floatingMenuPanel.style.display = isVisible ? 'none' : 'flex';
    });
    
    // Закрываем панель при клике вне её
    document.addEventListener('click', (e) => {
        if (floatingMenuPanel && floatingMenuBtn) {
            if (!floatingMenuPanel.contains(e.target) && e.target !== floatingMenuBtn) {
                floatingMenuPanel.style.display = 'none';
            }
        }
    });
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(toggleFloatingMenuButton, 50);
    });
    window.addEventListener('resize', toggleFloatingMenuButton);
    toggleFloatingMenuButton();
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    saveRatesToLocalStorage();
    initCollapsibleBlocks();
    addRateLoadingIndicator();
    initThemeToggle();
    initFloatingMenuButton();
});
