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

// Кнопка "Наверх" (полупрозрачная, появляется при прокрутке > 100px)
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '⬆️';
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Наверх');
    btn.style.cssText = `
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
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.2s;
        align-items: center;
        justify-content: center;
    `;
    
    btn.onmouseenter = () => {
        btn.style.backgroundColor = 'rgba(176, 62, 62, 1)';
        btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseleave = () => {
        btn.style.backgroundColor = 'rgba(176, 62, 62, 0.7)';
        btn.style.transform = 'scale(1)';
    };
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            btn.style.display = 'flex';
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
        bottom: 140px;
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

// ===== ПЛАВАЮЩАЯ КНОПКА БУРГЕР-МЕНЮ (всегда видна, открывает плавающее меню) =====
let floatingMenuBtn = null;
let floatingMenuPanel = null;

function initFloatingMenuButton() {
    // Создаём кнопку
    floatingMenuBtn = document.createElement('button');
    floatingMenuBtn.id = 'floating-menu-btn';
    floatingMenuBtn.setAttribute('aria-label', 'Меню');
    floatingMenuBtn.innerHTML = '☰';
    floatingMenuBtn.style.cssText = `
        position: fixed;
        bottom: 200px;
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
        z-index: 1001;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.2s;
        display: flex;
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
    
    // Создаём плавающую панель меню
    floatingMenuPanel = document.createElement('div');
    floatingMenuPanel.id = 'floating-menu-panel';
    floatingMenuPanel.style.cssText = `
        position: fixed;
        bottom: 260px;
        right: 20px;
        background-color: var(--bg-card, white);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        padding: 12px 0;
        min-width: 180px;
        z-index: 1000;
        display: none;
        flex-direction: column;
        gap: 4px;
        border: 1px solid var(--border-light, #efebe5);
        backdrop-filter: blur(8px);
        background-color: rgba(30, 30, 30, 0.95);
    `;
    
    // Копируем ссылки из оригинального меню
    const originalMenuList = document.querySelector('.menu-box');
    if (originalMenuList) {
        const links = originalMenuList.querySelectorAll('a');
        links.forEach(link => {
            const newLink = document.createElement('a');
            newLink.href = link.href;
            newLink.textContent = link.textContent;
            newLink.style.cssText = `
                display: block;
                padding: 10px 20px;
                color: var(--text-primary, white);
                text-decoration: none;
                font-weight: 500;
                transition: background 0.2s;
                font-size: 0.95rem;
            `;
            newLink.onmouseenter = () => {
                newLink.style.backgroundColor = 'rgba(176, 62, 62, 0.2)';
            };
            newLink.onmouseleave = () => {
                newLink.style.backgroundColor = 'transparent';
            };
            floatingMenuPanel.appendChild(newLink);
        });
    }
    
    document.body.appendChild(floatingMenuPanel);
    
    // Открытие/закрытие меню по клику на кнопку
    let isMenuOpen = false;
    floatingMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
            floatingMenuPanel.style.display = 'none';
            isMenuOpen = false;
        } else {
            floatingMenuPanel.style.display = 'flex';
            isMenuOpen = true;
        }
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !floatingMenuPanel.contains(e.target) && e.target !== floatingMenuBtn) {
            floatingMenuPanel.style.display = 'none';
            isMenuOpen = false;
        }
    });
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
