// Инициализация игры при загрузке
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
        animateCatToLevel(1);
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
            
            const level = this.getAttribute('data-level');
            startLevel(level);
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
    updateLevelPath();
    window.addEventListener('resize', updateLevelPath);

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => requestAnimationFrame(updateLevelPath));
    }
});

// Функция для анимации кота к определенному уровню
function animateCatToLevel(levelNum) {
    const cat = document.getElementById('map-cat');
    if (!cat) return;
    
    cat.style.transition = 'all 1s ease-in-out';
    cat.style.left = `${15 + (levelNum-1)*20}%`;
    cat.style.bottom = `${50 + (levelNum%2 ? -10 : 10)}%`;
}

// Функция запуска уровня
function startLevel(levelNum) {
    // Анимация кота к выбранному уровню
    animateCatToLevel(levelNum);
    
    // Через 1 секунду - переход на уровень
    setTimeout(() => {
        switch(levelNum) {
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
        const rect = planet.getBoundingClientRect();
        return {
            x: rect.left - mapRect.left + rect.width / 2,
            y: rect.top - mapRect.top + rect.height / 2
        };
    });

    svg.setAttribute('viewBox', `0 0 ${mapRect.width} ${mapRect.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = prev.x + (curr.x - prev.x) * 0.5;

        d += ` C ${midX.toFixed(2)} ${prev.y.toFixed(2)}, ${midX.toFixed(2)} ${curr.y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
    }

    path.setAttribute('d', d);
}
