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
// ===== ПЛАВАЮЩАЯ КНОПКА БУРГЕР-МЕНЮ (появляется при прокрутке > 200px на любых устройствах) =====
let floatingMenuBtn = null;
let scrollTimeout = null;

function initFloatingMenuButton() {
    floatingMenuBtn = document.createElement('button');
    floatingMenuBtn.id = 'floating-menu-btn';
    floatingMenuBtn.setAttribute('aria-label', 'Меню');
    floatingMenuBtn.innerHTML = '☰';
    floatingMenuBtn.style.cssText = `
        position: fixed;
        bottom: 140px;
        left: 20px;
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
    
    function toggleFloatingMenuButton() {
        // Убираем проверку ширины экрана — кнопка появляется при прокрутке > 200px на любом устройстве
        if (window.scrollY > 200) {
            floatingMenuBtn.style.display = 'flex';
        } else {
            floatingMenuBtn.style.display = 'none';
        }
    }
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(toggleFloatingMenuButton, 50);
    });
    window.addEventListener('resize', toggleFloatingMenuButton);
    toggleFloatingMenuButton();
    
    floatingMenuBtn.addEventListener('click', () => {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.checked = !menuToggle.checked;
        } else {
            const menuBox = document.querySelector('.menu-box');
            if (menuBox) {
                const isVisible = menuBox.style.visibility === 'visible';
                menuBox.style.visibility = isVisible ? 'hidden' : 'visible';
                menuBox.style.opacity = isVisible ? '0' : '1';
                menuBox.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
            }
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
