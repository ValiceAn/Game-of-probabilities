// Инициализация игры при загрузке
const MAP_CAT_LEVEL_KEY = 'mapCatLevel';

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
        document.getElementById('start-menu').classList.remove('visible');
        document.getElementById('start-menu').classList.add('hidden');
        document.getElementById('level-select').classList.remove('hidden');
        document.getElementById('level-select').classList.add('visible');
        
        // Анимация кота-проводника
        animateCatToLevel(getPreferredMapCatLevel());
    });

    // Обработка кнопки "В главное меню"
    document.getElementById('back-to-menu').addEventListener('click', function() {
        document.getElementById('level-select').classList.remove('visible');
        document.getElementById('level-select').classList.add('hidden');
        document.getElementById('start-menu').classList.remove('hidden');
        document.getElementById('start-menu').classList.add('visible');
    });

    // Обработка выбора уровня
    document.querySelectorAll('.level-planet').forEach(planet => {
        planet.addEventListener('click', function() {
            if (this.classList.contains('locked')) {
                // Планета заблокирована - показать сообщение
                const catSpeech = document.createElement('div');
                catSpeech.className = 'cat-message';
                catSpeech.textContent = 'Этот уровень ещё заблокирован! Пройди предыдущие уровни, чтобы открыть его.';
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
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('start-menu').classList.remove('visible');
    document.getElementById('level-select').classList.remove('hidden');
    document.getElementById('level-select').classList.add('visible');
}

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

        cat.style.transition = shouldAnimate ? 'left 0.6s ease, top 0.6s ease' : 'none';
        cat.style.left = `${clamp(desiredLeft, 0, maxLeft)}px`;
        cat.style.top = `${clamp(desiredTop, 0, maxTop)}px`;
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
        unlockEffect.innerHTML = '🔓 Уровень разблокирован!';
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
    document.getElementById('start-menu').classList.remove('visible');
    document.getElementById('start-menu').classList.add('hidden');
    document.getElementById('tutorial-menu').classList.remove('hidden');
    document.getElementById('tutorial-menu').classList.add('visible');
});

// И добавьте обработчик для кнопки возврата:
document.getElementById('back-to-menu-from-tutorial').addEventListener('click', function() {
    document.getElementById('tutorial-menu').classList.remove('visible');
    document.getElementById('tutorial-menu').classList.add('hidden');
    document.getElementById('start-menu').classList.remove('hidden');
    document.getElementById('start-menu').classList.add('visible');
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
        d += ` Q ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}, ${points[1].x.toFixed(2)} ${points[1].y.toFixed(2)}`;
    } else {
        for (let i = 1; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const midX = (current.x + next.x) * 0.5;
            const midY = (current.y + next.y) * 0.5;
            d += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)}, ${midX.toFixed(2)} ${midY.toFixed(2)}`;
        }

        const prev = points[points.length - 2];
        const last = points[points.length - 1];
        d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)}, ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    }

    path.setAttribute('d', d);
}
