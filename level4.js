// Инициализация уровня 4 - Космический Генератор Планет
document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const scanBtn = document.getElementById('scan-btn');
    const scannerDisplay = document.getElementById('scanner-display');
    const planetPreview = document.getElementById('planet-preview');
    const scanningAnimation = document.getElementById('scanning-animation');
    const catSpeech = document.getElementById('cat-speech');
    const tasks = document.querySelectorAll('.task');
    const optionBtns = document.querySelectorAll('.option-btn');
    const hintBtns = document.querySelectorAll('.hint-btn');
    const nextTaskBtn = document.getElementById('next-task');
    const backToMapBtn = document.getElementById('back-to-map');
    const checkSettingsBtn = document.getElementById('check-settings-btn');
    
    // Элементы статистики
    const greenBar = document.getElementById('green-bar');
    const iceBar = document.getElementById('ice-bar');
    const lavaBar = document.getElementById('lava-bar');
    const greenCount = document.getElementById('green-count');
    const iceCount = document.getElementById('ice-count');
    const lavaCount = document.getElementById('lava-count');
    const totalScans = document.getElementById('total-scans');
    
    // Элементы управления вероятностью
    const greenProb = document.getElementById('green-prob');
    const iceProb = document.getElementById('ice-prob');
    const lavaProb = document.getElementById('lava-prob');
    const greenValue = document.getElementById('green-value');
    const iceValue = document.getElementById('ice-value');
    const lavaValue = document.getElementById('lava-value');
    const totalValue = document.getElementById('total-value');
    
    // Достижения
    const achievementsPanel = document.getElementById('achievements');
    const lavaStreak = document.getElementById('lava-streak');
    const iceWarning = document.getElementById('ice-warning');
    
    // Переменные состояния
    let currentTask = 0;
    let completedTasks = 0;
    const totalTasks = tasks.length;
    let scanResults = {
        green: 0,
        ice: 0,
        lava: 0,
        total: 0,
        lastPlanets: []
    };
    
    // Планеты и их свойства
    const planets = {
        green: {
            name: "Зелёная планета",
            emoji: "🟢",
            color: "#28a745",
            desc: "Идеальна для базы! Есть вода и растения.",
            sound: new Audio('sounds/green_planet.mp3')
        },
        ice: {
            name: "Ледяная планета",
            emoji: "❄️",
            color: "#17a2b8",
            desc: "Холодно, но есть полезные ископаемые.",
            sound: new Audio('sounds/ice_planet.mp3')
        },
        lava: {
            name: "Лавовая планета",
            emoji: "🌋",
            color: "#dc3545",
            desc: "Опасно, но можно собрать редкие кристаллы!",
            sound: new Audio('sounds/lava_planet.mp3')
        }
    };
    
    // Инициализация
    showTask(currentTask);
    updateProbabilityDisplay();
    
    // Обработчики событий
    scanBtn.addEventListener('click', scanPlanet);
    
    greenProb.addEventListener('input', updateProbabilityDisplay);
    iceProb.addEventListener('input', updateProbabilityDisplay);
    lavaProb.addEventListener('input', updateProbabilityDisplay);
    
    nextTaskBtn.addEventListener('click', function() {
        currentTask++;
        if (currentTask < totalTasks) {
            showTask(currentTask);
            nextTaskBtn.classList.add('hidden');
        } else {
            completeLevel();
        }
    });
    
    backToMapBtn.addEventListener('click', function() {
       // Используем window.opener если открыто из окна, или переходим на index.html с параметром
if (window.opener) {
    window.opener.completeLevel(4);
    window.close();
} else {
    window.location.href = 'index.html?completed=4';
}
    });
    
    checkSettingsBtn.addEventListener('click', checkCustomSettings);
    
    // Обработка выбора ответа
    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Если это не кнопка проверки настроек
            if (btn.id !== 'check-settings-btn') {
                const isCorrect = this.getAttribute('data-correct') === 'true';
                
                if (isCorrect) {
                    this.classList.add('correct');
                    completedTasks++;
                    
                    // Показать кнопку следующего задания
                    if (currentTask < totalTasks - 1) {
                        nextTaskBtn.classList.remove('hidden');
                    } else {
                        completeLevel();
                    }
                    
                    // Обновить речь кота
                    catSpeech.textContent = getRandomCongratulation();
                } else {
                    this.classList.add('incorrect');
                    catSpeech.textContent = 'Попробуй ещё раз! Обрати внимание на вероятности.';
                }
            }
        });
    });
    
// Показать подсказку
hintBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const taskContainer = this.closest('.task');
        const hint = taskContainer.querySelector('.hint');
        hint.classList.toggle('hidden');
        this.textContent = hint.classList.contains('hidden') ? 'Показать подсказку' : 'Скрыть подсказку';
    });
});
    
    // Функции
    function showTask(index) {
        tasks.forEach((task, i) => {
            task.classList.toggle('active', i === index);
            task.classList.toggle('hidden', i !== index);
        });
    }
    
    function updateProbabilityDisplay() {
        // Обновляем значения
        const green = parseInt(greenProb.value);
        const ice = parseInt(iceProb.value);
        const lava = parseInt(lavaProb.value);
        
        greenValue.textContent = green;
        iceValue.textContent = ice;
        lavaValue.textContent = lava;
        
        // Проверяем, чтобы сумма не превышала 100%
        const total = green + ice + lava;
        totalValue.textContent = total;
        
        if (total > 100) {
            totalValue.style.color = "#dc3545";
        } else {
            totalValue.style.color = "#fec72d";
        }
    }
    
    function scanPlanet() {
        // Проверяем, что сумма вероятностей равна 100%
        const green = parseInt(greenProb.value);
        const ice = parseInt(iceProb.value);
        const lava = parseInt(lavaProb.value);
        const total = green + ice + lava;
        
        if (total !== 100) {
            catSpeech.textContent = "Сумма вероятностей должна быть ровно 100%! Настрой сканер правильно.";
            return;
        }
        
        // Блокируем кнопку на время сканирования
        scanBtn.disabled = true;
        
        // Показываем анимацию сканирования
        planetPreview.classList.add('hidden');
        scanningAnimation.classList.remove('hidden');
        
        // Запускаем звук сканирования
        const scanSound = new Audio('sounds/scan.mp3');
        scanSound.play();
        
        // Через 2 секунды показываем результат
        setTimeout(() => {
            // Скрываем анимацию
            scanningAnimation.classList.add('hidden');
            
            // Генерируем случайную планету
            const planetType = generatePlanet(green, ice, lava);
            const planet = planets[planetType];
            
            // Обновляем статистику
            scanResults[planetType]++;
            scanResults.total++;
            scanResults.lastPlanets.unshift(planetType);
            if (scanResults.lastPlanets.length > 5) {
                scanResults.lastPlanets.pop();
            }
            
            // Проверяем достижения
            checkAchievements();
            
            // Показываем планету
            planetPreview.innerHTML = `
                <div class="planet-emoji">${planet.emoji}</div>
                <div class="planet-info">
                    <h3>${planet.name}</h3>
                    <p>${planet.desc}</p>
                </div>
            `;
            planetPreview.style.backgroundColor = planet.color;
            planetPreview.classList.remove('hidden');
            
            // Воспроизводим звук планеты
            planet.sound.play();
            
            // Обновляем статистику
            updateStats();
            
            // Обновляем речь кота
            updateCatSpeech(planetType);
            
            // Разблокируем кнопку
            scanBtn.disabled = false;
        }, 2000);
    }
    
    function generatePlanet(greenProb, iceProb, lavaProb) {
        const random = Math.random() * 100;
        
        if (random < greenProb) {
            return 'green';
        } else if (random < greenProb + iceProb) {
            return 'ice';
        } else {
            return 'lava';
        }
    }
    
    function updateStats() {
        // Обновляем счетчики
        greenCount.textContent = scanResults.green;
        iceCount.textContent = scanResults.ice;
        lavaCount.textContent = scanResults.lava;
        totalScans.textContent = scanResults.total;
        
        // Обновляем графики
        if (scanResults.total > 0) {
            const greenPercent = (scanResults.green / scanResults.total) * 100;
            const icePercent = (scanResults.ice / scanResults.total) * 100;
            const lavaPercent = (scanResults.lava / scanResults.total) * 100;
            
            greenBar.style.width = `${greenPercent}%`;
            iceBar.style.width = `${icePercent}%`;
            lavaBar.style.width = `${lavaPercent}%`;
        }
    }
    
    function updateCatSpeech(planetType) {
        const planet = planets[planetType];
        const phrases = [
            `Найдена ${planet.name.toLowerCase()}! ${planet.desc}`,
            `Результат сканирования: ${planet.name}!`,
            `Ух ты! Это ${planet.name.toLowerCase()}!`,
        ];
        
        catSpeech.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function getRandomCongratulation() {
        const phrases = [
            'Правильно! Ты отлично разбираешься в вероятности!',
            'Верно! Космический сканер гордится тобой!',
            'Молодец! Ты решил задачу как настоящий учёный!',
            'Отличная работа! Ты понял принцип вероятности!'
        ];
        
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function completeLevel() {
        // Показать сообщение о завершении уровня
        catSpeech.textContent = 'Поздравляю! Ты завершил уровень "Космический Генератор Планет"! Теперь ты знаешь, как работает вероятность!';
    }
    
    function checkAchievements() {
        // Проверяем, есть ли 3 лавовые планеты подряд
        if (scanResults.lastPlanets.length >= 3 && 
            scanResults.lastPlanets[0] === 'lava' && 
            scanResults.lastPlanets[1] === 'lava' && 
            scanResults.lastPlanets[2] === 'lava') {
            lavaStreak.classList.add('unlocked');
            achievementsPanel.classList.remove('hidden');
            
            // Показываем сообщение
            catSpeech.textContent = 'Удивительно! 3 лавовые планеты подряд! Ты получил термоустойчивый сканер!';
        }
        
        // Проверяем, есть ли 5 ледяных планет подряд
        if (scanResults.lastPlanets.length >= 5 && 
            scanResults.lastPlanets[0] === 'ice' && 
            scanResults.lastPlanets[1] === 'ice' && 
            scanResults.lastPlanets[2] === 'ice' && 
            scanResults.lastPlanets[3] === 'ice' && 
            scanResults.lastPlanets[4] === 'ice') {
            iceWarning.classList.add('unlocked');
            achievementsPanel.classList.remove('hidden');
            
            // Показываем сообщение
            catSpeech.textContent = 'Осторожно! 5 ледяных планет подряд! Корабль может замедлиться из-за обледенения!';
        }
    }
    
    function checkCustomSettings() {
        const green = parseInt(greenProb.value);
        const ice = parseInt(iceProb.value);
        const lava = parseInt(lavaProb.value);
        
        if (green + ice + lava !== 100) {
            catSpeech.textContent = "Сумма вероятностей должна быть ровно 100%!";
            return;
        }
        
        if (lava > ice) {
            checkSettingsBtn.classList.add('correct');
            catSpeech.textContent = "Отлично! Теперь лавовые планеты будут встречаться чаще ледяных!";
            completedTasks++;
            
            // Показать кнопку следующего задания
            if (currentTask < totalTasks - 1) {
                nextTaskBtn.classList.remove('hidden');
            } else {
                completeLevel();
            }
        } else {
            checkSettingsBtn.classList.add('incorrect');
            catSpeech.textContent = "Попробуй ещё раз! Сделай значение для лавовой планеты больше, чем для ледяной.";
        }
    }
});