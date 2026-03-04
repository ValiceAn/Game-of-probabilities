// Инициализация игры при загрузке
const MAP_CAT_LEVEL_KEY = 'mapCatLevel';
const ACTIVE_SCREEN_KEY = 'activeScreen';
const FIXED_CAT_POSITIONS = {
    1: { left: 84.8, top: 148.813 },
    2: { left: 341.2, top: 70.18 },
    3: { left: 599.6, top: 197.997 },
    4: { left: 872, top: 7.847 },
    5: { left: 1078.8, top: 255.197 }
};
const t = (key, fallback, params = {}) => (
    window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback
);

const SCREEN_IDS = ['start-menu', 'level-select', 'tutorial-menu'];
function setActiveScreen(activeId) {
    const safeActiveId = SCREEN_IDS.includes(activeId) ? activeId : 'start-menu';
    SCREEN_IDS.forEach((screenId) => {
        const el = document.getElementById(screenId);
        if (!el) return;
        const isActive = screenId === safeActiveId;
        el.classList.toggle('visible', isActive);
        el.classList.toggle('hidden', !isActive);
    });
    try {
        sessionStorage.setItem(ACTIVE_SCREEN_KEY, safeActiveId);
    } catch (e) {
        // Ignore storage errors and keep UI functional.
    }
}

function getRememberedScreen() {
    try {
        const stored = sessionStorage.getItem(ACTIVE_SCREEN_KEY);
        return SCREEN_IDS.includes(stored) ? stored : null;
    } catch (e) {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем сохраненный прогресс
    const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
    
    // Разблокируем уровни согласно прогрессу
    document.querySelectorAll('.level-planet').forEach(planet => {
        const level = parseInt(planet.getAttribute('data-level'));
        if (unlockedLevels.includes(level)) {
            planet.classList.remove('locked');
        }
    });

    // Обработка кнопки "Начать игру"
    document.getElementById('start-btn').addEventListener('click', function() {
        setActiveScreen('level-select');
        
        // Анимация кота-проводника
        animateCatToLevel(getPreferredMapCatLevel());
    });

    // Обработка кнопки "В главное меню"
    document.getElementById('back-to-menu').addEventListener('click', function() {
        setActiveScreen('start-menu');
    });

    // Обработка выбора уровня
    document.querySelectorAll('.level-planet').forEach(planet => {
        planet.addEventListener('click', function() {
            if (this.classList.contains('locked')) {
                // Планета заблокирована - показать сообщение
                const catSpeech = document.createElement('div');
                catSpeech.className = 'cat-message';
                catSpeech.textContent = t(
                    'index.locked',
                    'Этот уровень ещё заблокирован! Пройди предыдущие уровни, чтобы открыть его.'
                );
                document.querySelector('.galaxy-map').appendChild(catSpeech);
                
                setTimeout(() => {
                    catSpeech.remove();
                }, 3000);
                return;
            }
            
            const level = Number(this.getAttribute('data-level'));
            savePreferredMapCatLevel(level);
            startLevel(String(level));
        });
    });

    // Проверяем, был ли переход с пройденного уровня
const params = new URLSearchParams(window.location.search);
const justCompleted = params.get('completed');
if (justCompleted) {
    unlockLevel(parseInt(justCompleted));
    // Показываем карту уровней вместо главного меню
    setActiveScreen('level-select');
} else {
    // Restore the last active screen after refresh/navigation.
    setActiveScreen(getRememberedScreen() || 'start-menu');
}

    // Re-enable normal transitions after initial route state is applied.
    requestAnimationFrame(() => {
        document.documentElement.classList.remove('skip-screen-fade');
    });

    // Синхронизируем путь карты с фактическими позициями планет.
    const syncMapLayout = () => {
        updateLevelPath();
        animateCatToLevel(getPreferredMapCatLevel(), false);
    };

    const scheduleSyncMapLayout = () => requestAnimationFrame(syncMapLayout);

    scheduleSyncMapLayout();
    window.addEventListener('resize', scheduleSyncMapLayout);
    window.addEventListener('orientationchange', scheduleSyncMapLayout);

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', scheduleSyncMapLayout);
    }
});

// Функция для анимации кота к определенному уровню
function animateCatToLevel(levelNum, shouldAnimate = true) {
    const level = Number(levelNum);
    const cat = document.getElementById('map-cat');
    const map = document.querySelector('.galaxy-map');
    const planet = document.querySelector(`.level-planet[data-level="${level}"]`);
    if (!cat || !map || !planet) return;

    const positionCat = () => {
        const mapRect = map.getBoundingClientRect();
        const planetTarget = planet.querySelector('.level-image') || planet;
        const planetRect = planetTarget.getBoundingClientRect();
        const catRect = cat.getBoundingClientRect();
        const catWidth = catRect.width || cat.offsetWidth;
        const catHeight = catRect.height || cat.offsetHeight;

        if (!mapRect.width || !mapRect.height || !catWidth || !catHeight) return;

        const planetCenterX = planetRect.left - mapRect.left + (planetRect.width / 2);
        const planetCenterY = planetRect.top - mapRect.top + (planetRect.height / 2);
        const planetRadius = planetRect.height / 2;

        const desiredLeft = planetCenterX - (catWidth / 2);
        const desiredTop = planetCenterY - (catHeight * 0.78) + (planetRadius * 0.42);
        const maxLeft = Math.max(0, mapRect.width - catWidth);
        const maxTop = Math.max(0, mapRect.height - catHeight);

        const isDesktop = window.matchMedia('(min-width: 64.01rem)').matches;
        const fixedPosition = isDesktop ? FIXED_CAT_POSITIONS[level] : null;
        const finalLeft = fixedPosition ? fixedPosition.left : desiredLeft;
        const finalTop = fixedPosition ? fixedPosition.top : desiredTop;

        cat.style.transition = shouldAnimate ? 'left 0.6s ease, top 0.6s ease' : 'none';
        cat.style.left = `${clamp(finalLeft, 0, maxLeft)}px`;
        cat.style.top = `${clamp(finalTop, 0, maxTop)}px`;
        cat.dataset.level = String(level);

        if (!shouldAnimate) {
            requestAnimationFrame(() => {
                cat.style.transition = 'left 0.6s ease, top 0.6s ease';
            });
        }
    };

    if (cat.complete) {
        requestAnimationFrame(positionCat);
    } else {
        cat.addEventListener('load', () => requestAnimationFrame(positionCat), { once: true });
    }
}

// Функция запуска уровня
function startLevel(levelNum) {
    const levelId = String(levelNum);
    savePreferredMapCatLevel(Number(levelId));

    // Анимация кота к выбранному уровню
    animateCatToLevel(Number(levelId));
    
    // Через 1 секунду - переход на уровень
    setTimeout(() => {
        switch(levelId) {
            case '1':
                window.location.href = 'level1.html';
                break;
            case '2':
                window.location.href = 'level2.html';
                break;
            case '3':
                window.location.href = 'level3.html';
                break;
            case '4':
                window.location.href = 'level4.html';
                break;
            case '5':
                window.location.href = 'level5.html';
                break;
            default:
                console.error(`Уровень ${levelNum} не найден`);
        }
    }, 1000);
}

// Функция разблокировки уровня
function savePreferredMapCatLevel(levelNum) {
    if (Number.isFinite(levelNum) && levelNum > 0) {
        localStorage.setItem(MAP_CAT_LEVEL_KEY, String(levelNum));
    }
}

function getPreferredMapCatLevel() {
    const storedLevel = Number(localStorage.getItem(MAP_CAT_LEVEL_KEY));
    if (Number.isFinite(storedLevel) && document.querySelector(`.level-planet[data-level="${storedLevel}"]`)) {
        return storedLevel;
    }

    const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
    const fallbackLevel = unlockedLevels.length ? Math.max(...unlockedLevels) : 1;
    return document.querySelector(`.level-planet[data-level="${fallbackLevel}"]`) ? fallbackLevel : 1;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function unlockLevel(levelNum) {
    // Получаем текущий прогресс
    const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
    
    // Если уровень еще не разблокирован, добавляем его
    if (!unlockedLevels.includes(levelNum)) {
        unlockedLevels.push(levelNum);
        unlockedLevels.sort((a, b) => a - b);
        localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
    }
    
    // Разблокируем следующий уровень, если он существует
    const nextLevel = levelNum + 1;
    const nextPlanet = document.querySelector(`.level-planet[data-level="${nextLevel}"]`);
    if (nextPlanet && !unlockedLevels.includes(nextLevel)) {
        unlockedLevels.push(nextLevel);
        localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
        nextPlanet.classList.remove('locked');
        
        // Показываем анимацию разблокировки
        const unlockEffect = document.createElement('div');
        unlockEffect.className = 'unlock-effect';
        unlockEffect.innerHTML = t('index.unlocked', '🔓 Уровень разблокирован!');
        nextPlanet.appendChild(unlockEffect);
        
        setTimeout(() => {
            unlockEffect.remove();
        }, 3000);
    }
    
    // Обновляем отображение планет
    document.querySelectorAll('.level-planet').forEach(planet => {
        const level = parseInt(planet.getAttribute('data-level'));
        if (unlockedLevels.includes(level)) {
            planet.classList.remove('locked');
        }
    });
}

// Функция для завершения уровня (вызывается из уровней)
window.completeLevel = function(levelNum) {
    // Разблокируем следующий уровень
    unlockLevel(levelNum);
    
    // Возвращаем на карту с параметром completed
    window.location.href = 'index.html?completed=' + levelNum;
}

// Инициализация первого уровня (на всякий случай)
document.querySelector('.level-planet[data-level="1"]')?.classList.remove('locked');

// Обработка кнопки "Обучение"
document.getElementById('tutorial-btn').addEventListener('click', function() {
    setActiveScreen('tutorial-menu');
});

// И добавьте обработчик для кнопки возврата:
document.getElementById('back-to-menu-from-tutorial').addEventListener('click', function() {
    setActiveScreen('start-menu');
});

function updateLevelPath() {
    const map = document.querySelector('.galaxy-map');
    const svg = document.querySelector('.level-path');
    const path = svg?.querySelector('path');

    if (!map || !svg || !path) return;

    const planets = Array.from(document.querySelectorAll('.level-planet'))
        .sort((a, b) => Number(a.dataset.level) - Number(b.dataset.level));

    if (planets.length < 2) return;

    const mapRect = map.getBoundingClientRect();
    const points = planets.map((planet) => {
        const target = planet.querySelector('.level-image') || planet;
        const rect = target.getBoundingClientRect();
        return {
            x: rect.left - mapRect.left + rect.width / 2,
            y: rect.top - mapRect.top + rect.height / 2
        };
    });

    if (points.length < 2) return;

    svg.setAttribute('width', `${mapRect.width}`);
    svg.setAttribute('height', `${mapRect.height}`);
    svg.setAttribute('viewBox', `0 0 ${mapRect.width} ${mapRect.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    if (points.length === 2) {
        d += ` L ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`;
    } else {
        // Catmull-Rom -> Bezier: smooth curve that passes through every point.
        const tension = 1;
        for (let i = 0; i < points.length - 1; i++) {
            const prev = points[i - 1] || points[i];
            const current = points[i];
            const next = points[i + 1];
            const afterNext = points[i + 2] || next;

            const cp1x = current.x + ((next.x - prev.x) / 6) * tension;
            const cp1y = current.y + ((next.y - prev.y) / 6) * tension;
            const cp2x = next.x - ((afterNext.x - current.x) / 6) * tension;
            const cp2y = next.y - ((afterNext.y - current.y) / 6) * tension;

            d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
        }
    }

    path.setAttribute('d', d);
}
