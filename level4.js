// Инициализация уровня 4 - Космический Генератор Планет
document.addEventListener('DOMContentLoaded', function() {
    const t = (key, fallback, params = {}) => (
        window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback
    );
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
    const probabilityControls = document.querySelector('.probability-controls');
    const statsPanel = document.querySelector('.stats-panel');
    const scannerControls = document.querySelector('.scanner-controls');
    const statsAndTasks = document.querySelector('.stats-and-tasks');
    
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
        // Planets dictionary (rebuild on language change)
    let planets = {};

    function createPlanetsDictionary() {
        return {
            green: {
                name: t('level4.planetGreenName', 'Зелёная планета'),
                emoji: t('level4.planetGreenEmoji', 'Зелёная'),
                color: '#28a745',
                desc: t('level4.planetGreenDesc', 'Идеальна для базы! Есть вода и растения.'),
                sound: new Audio('sounds/green_planet.mp3')
            },
            ice: {
                name: t('level4.planetIceName', 'Ледяная планета'),
                emoji: t('level4.planetIceEmoji', 'Ледяная'),
                color: '#17a2b8',
                desc: t('level4.planetIceDesc', 'Холодно, но есть полезные ископаемые.'),
                sound: new Audio('sounds/ice_planet.mp3')
            },
            lava: {
                name: t('level4.planetLavaName', 'Лавовая планета'),
                emoji: t('level4.planetLavaEmoji', 'Лавовая'),
                color: '#dc3545',
                desc: t('level4.planetLavaDesc', 'Опасно, но можно собрать редкие кристаллы!'),
                sound: new Audio('sounds/lava_planet.mp3')
            }
        };
    }

    function refreshDynamicTranslations() {
        planets = createPlanetsDictionary();
        updateProbabilityDisplay();

        const lastPlanetType = scanResults.lastPlanets[0];
        if (lastPlanetType && planets[lastPlanetType] && !planetPreview.classList.contains('hidden')) {
            const planet = planets[lastPlanetType];
            planetPreview.innerHTML = `
                <div class="planet-emoji">${planet.emoji}</div>
                <div class="planet-info">
                    <h3>${planet.name}</h3>
                    <p>${planet.desc}</p>
                </div>
            `;
            planetPreview.style.backgroundColor = planet.color;
            updateCatSpeech(lastPlanetType);
        } else if (scanResults.total === 0) {
            catSpeech.textContent = t(
                'level4.catIntro',
                'Привет, исследователь! Настрой вероятности и сканируй планеты.'
            );
        }
    }
    
    // Инициализация
    showTask(currentTask);
    updateProbabilityDisplay();
    nextTaskBtn.classList.remove('hidden');
    nextTaskBtn.disabled = true;
    planets = createPlanetsDictionary();
    setupMobileProbStatsRow();
    window.addEventListener('i18n:language-changed', refreshDynamicTranslations);
    // Обработчики событий
    scanBtn.addEventListener('click', scanPlanet);
    
    greenProb.addEventListener('input', updateProbabilityDisplay);
    iceProb.addEventListener('input', updateProbabilityDisplay);
    lavaProb.addEventListener('input', updateProbabilityDisplay);
    
    nextTaskBtn.addEventListener('click', function() {
        if (nextTaskBtn.disabled) {
            return;
        }

        currentTask++;
        if (currentTask < totalTasks) {
            showTask(currentTask);
        } else {
            completeLevel();
        }
    });
    
    backToMapBtn.addEventListener('click', function() {
        const mapUrl = new URL('index.html?completed=4', window.location.href).toString();
        try {
            if (window.opener && !window.opener.closed && typeof window.opener.completeLevel === 'function') {
                window.opener.completeLevel(4);
                window.close();
                return;
            }
        } catch (e) {
            // Fallback to direct navigation when opener is cross-origin or unavailable.
        }
        window.location.href = mapUrl;
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
                    if (completedTasks <= currentTask) {
                        completedTasks = currentTask + 1;
                    }
                    
                    // Показать кнопку следующего задания
                    if (currentTask < totalTasks - 1) {
                        nextTaskBtn.disabled = false;
                    } else {
                        completeLevel();
                    }
                    
                    // Обновить речь кота
                    catSpeech.textContent = getRandomCongratulation();
                } else {
                    this.classList.add('incorrect');
                    catSpeech.textContent = t('level4.tryAgain', 'Попробуй ещё раз! Обрати внимание на вероятности.');
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
        this.textContent = hint.classList.contains('hidden')
            ? t('common.showHint', 'Показать подсказку')
            : t('common.hideHint', 'Скрыть подсказку');
    });
});
    
    // Функции
    function showTask(index) {
        tasks.forEach((task, i) => {
            task.classList.toggle('active', i === index);
            task.classList.toggle('hidden', i !== index);
        });

        // Кнопка видима всегда, но активна только после выполнения текущего задания.
        nextTaskBtn.disabled = !(index < totalTasks - 1 && completedTasks > index);
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
        const green = Number.parseInt(greenProb.value, 10) || 0;
        const ice = Number.parseInt(iceProb.value, 10) || 0;
        const lava = Number.parseInt(lavaProb.value, 10) || 0;
        const total = green + ice + lava;
        
        if (total <= 0) {
            catSpeech.textContent = t(
                'level4.sumLong',
                'Сумма вероятностей должна быть ровно 100%! Настрой сканер правильно.'
            );
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
            const planetType = generatePlanet(green, ice, lava, total);
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
    
    function generatePlanet(greenProb, iceProb, lavaProb, totalProb = greenProb + iceProb + lavaProb) {
        const normalizedTotal = totalProb > 0 ? totalProb : 1;
        const random = Math.random() * normalizedTotal;
        
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
            t('level4.scanPhrase1', 'Найдена {planet}! {desc}', {
                planet: planet.name.toLowerCase(),
                desc: planet.desc
            }),
            t('level4.scanPhrase2', 'Результат сканирования: {planetName}!', {
                planetName: planet.name
            }),
            t('level4.scanPhrase3', 'Ух ты! Это {planet}!', {
                planet: planet.name.toLowerCase()
            }),
        ];
        
        catSpeech.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function getRandomCongratulation() {
        const phrases = [
            t('level4.good1', 'Правильно! Ты отлично разбираешься в вероятности!'),
            t('level4.good2', 'Верно! Космический сканер гордится тобой!'),
            t('level4.good3', 'Молодец! Ты решил задачу как настоящий учёный!'),
            t('level4.good4', 'Отличная работа! Ты понял принцип вероятности!')
        ];
        
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function completeLevel() {
        // Показать сообщение о завершении уровня
        catSpeech.textContent = t(
            'level4.complete',
            'Поздравляю! Ты завершил уровень "Космический Генератор Планет"! Теперь ты знаешь, как работает вероятность!'
        );
        nextTaskBtn.disabled = true;
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
            catSpeech.textContent = t(
                'level4.achLava',
                'Удивительно! 3 лавовые планеты подряд! Ты получил термоустойчивый сканер!'
            );
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
            catSpeech.textContent = t(
                'level4.achIce',
                'Осторожно! 5 ледяных планет подряд! Корабль может замедлиться из-за обледенения!'
            );
        }
    }
    
    function checkCustomSettings() {
        const green = parseInt(greenProb.value);
        const ice = parseInt(iceProb.value);
        const lava = parseInt(lavaProb.value);
        
        if (green + ice + lava !== 100) {
            catSpeech.textContent = t('level4.sumShort', 'Сумма вероятностей должна быть ровно 100%!');
            return;
        }
        
        if (lava > ice) {
            checkSettingsBtn.classList.add('correct');
            catSpeech.textContent = t(
                'level4.settingsOk',
                'Отлично! Теперь лавовые планеты будут встречаться чаще ледяных!'
            );
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
            }
            
            // Показать кнопку следующего задания
            if (currentTask < totalTasks - 1) {
                nextTaskBtn.disabled = false;
            } else {
                completeLevel();
            }
        } else {
            checkSettingsBtn.classList.add('incorrect');
            catSpeech.textContent = t(
                'level4.settingsRetry',
                'Попробуй ещё раз! Сделай значение для лавовой планеты больше, чем для ледяной.'
            );
        }
    }

    function setupMobileProbStatsRow() {
        if (!probabilityControls || !statsPanel || !scannerControls || !statsAndTasks) {
            return;
        }

        const mobileRow = document.createElement('div');
        mobileRow.className = 'mobile-prob-stats-row';
        const phoneQuery = window.matchMedia('(max-width: 700px)');

        const probabilityOriginalParent = probabilityControls.parentElement;
        const probabilityOriginalNext = probabilityControls.nextElementSibling;
        const statsOriginalParent = statsPanel.parentElement;
        const statsOriginalNext = statsPanel.nextElementSibling;

        const restoreToDesktop = () => {
            if (probabilityControls.parentElement !== probabilityOriginalParent) {
                if (probabilityOriginalNext && probabilityOriginalNext.parentElement === probabilityOriginalParent) {
                    probabilityOriginalParent.insertBefore(probabilityControls, probabilityOriginalNext);
                } else {
                    probabilityOriginalParent.appendChild(probabilityControls);
                }
            }

            if (statsPanel.parentElement !== statsOriginalParent) {
                if (statsOriginalNext && statsOriginalNext.parentElement === statsOriginalParent) {
                    statsOriginalParent.insertBefore(statsPanel, statsOriginalNext);
                } else {
                    statsOriginalParent.appendChild(statsPanel);
                }
            }

            if (mobileRow.parentElement) {
                mobileRow.remove();
            }
        };

        const applyMobileLayout = () => {
            if (statsAndTasks.contains(statsPanel)) {
                statsAndTasks.insertBefore(mobileRow, statsAndTasks.firstChild);
            }

            mobileRow.appendChild(probabilityControls);
            mobileRow.appendChild(statsPanel);
        };

        const syncLayout = () => {
            if (phoneQuery.matches) {
                applyMobileLayout();
            } else {
                restoreToDesktop();
            }
        };

        syncLayout();
        window.addEventListener('resize', syncLayout);
    }
});
