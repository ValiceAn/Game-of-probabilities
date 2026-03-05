document.addEventListener('DOMContentLoaded', function() {
    const t = (key, fallback, params = {}) => (
        window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback
    );
    // Элементы интерфейса
    const starField = document.getElementById('star-field');
    const generateBtn = document.getElementById('generate-stars');
    const resetBtn = document.getElementById('reset-lab');
    const backToMapBtn = document.getElementById('back-to-map');
    const catSpeech = document.getElementById('cat-speech');
    const tasks = document.querySelectorAll('.task');
    const nextTaskBtn = document.getElementById('next-task');
    
    // Статистика
    const totalStarsEl = document.getElementById('total-stars');
    const redStarsEl = document.getElementById('red-stars');
    const blueStarsEl = document.getElementById('blue-stars');
    const blackStarsEl = document.getElementById('black-stars');
    
    // График
    const actualRedBar = document.getElementById('actual-red-bar');
    const actualBlueBar = document.getElementById('actual-blue-bar');
    const actualBlackBar = document.getElementById('actual-black-bar');
    
    // Прогресс заданий
    const progress1 = document.getElementById('progress1');
    const progressText1 = progress1.nextElementSibling;
    const progress2 = document.getElementById('progress2');
    const progressText2 = progress2.nextElementSibling;
    const progress3 = document.getElementById('progress3');
    const progressText3 = progress3.nextElementSibling;
    
    // Ввод гипотезы
    const hypothesisInput = document.getElementById('hypothesis-input');
    const checkHypothesisBtn = document.getElementById('check-hypothesis');
    
    let currentTask = 0;
    let starsData = {
        total: 0,
        red: 0,
        blue: 0,
        black: 0
    };
    
    // Вероятности по умолчанию
    const starProbabilities = {
        red: 0.6,
        blue: 0.3,
        black: 0.1
    };
    
    // Инициализация
    function init() {
        showTask(currentTask);
        updateStats();
        
        // Показать речь кота
        setTimeout(() => {
            catSpeech.classList.add('visible');
        }, 1000);
    }
    
    // Показать задание
    function showTask(index) {
        tasks.forEach((task, i) => {
            task.classList.toggle('active', i === index);
            task.classList.toggle('hidden', i !== index);
        });
    }
    
    // Генерация звёзд
    function generateStars() {
        // Количество звёзд для генерации (1-10)
        const count = Math.floor(Math.random() * 10) + 1;
        
        // Анимация ускорителя
        animateCollider();
        
        // Задержка для визуального эффекта
        setTimeout(() => {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    createStar();
                }, i * 200);
            }
        }, 500);
    }
    
    // Анимация ускорителя
    function animateCollider() {
        const collider = document.querySelector('.collider-ring');
        collider.style.animationDuration = '0.5s';
        
        setTimeout(() => {
            collider.style.animationDuration = '20s';
        }, 1000);
    }
    
    // Создание одной звезды
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Определяем тип звезды по вероятности
        const rand = Math.random();
        let starType;
        
        if (rand < starProbabilities.black) {
            starType = 'black';
        } else if (rand < starProbabilities.black + starProbabilities.blue) {
            starType = 'blue';
        } else {
            starType = 'red';
        }
        
        star.classList.add(starType);
        
        // Позиция на экране
        const x = 50 + Math.random() * 40; // 50-90%
        const y = 20 + Math.random() * 60; // 20-80%
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        
        // Размер в зависимости от типа
        if (starType === 'red') {
            star.style.width = '30px';
            star.style.height = '30px';
        } else if (starType === 'blue') {
            star.style.width = '20px';
            star.style.height = '20px';
        } else {
            star.style.width = '40px';
            star.style.height = '40px';
        }
        
        starField.appendChild(star);
        
        // Обновляем статистику
        starsData.total++;
        starsData[starType]++;
        updateStats();
        
        // Проверяем задания
        checkTasks();
    }
    
    // Эффект чёрной дыры
    function createBlackHoleEffect(blackHole) {
        // Находим ближайшие звёзды
        const stars = document.querySelectorAll('.star:not(.black)');
        const bhRect = blackHole.getBoundingClientRect();
        const bhCenter = {
            x: bhRect.left + bhRect.width / 2,
            y: bhRect.top + bhRect.height / 2
        };
        
        stars.forEach(star => {
            const starRect = star.getBoundingClientRect();
            const starCenter = {
                x: starRect.left + starRect.width / 2,
                y: starRect.top + starRect.height / 2
            };
            
            // Расстояние до чёрной дыры
            const distance = Math.sqrt(
                Math.pow(starCenter.x - bhCenter.x, 2) + 
                Math.pow(starCenter.y - bhCenter.y, 2)
            );
            
            // Если звезда достаточно близко - "затягиваем" её
            if (distance < 200) {
                const duration = Math.max(500, distance * 5);
                
                star.style.transition = `all ${duration}ms linear`;
                star.style.transform = 'scale(0)';
                star.style.left = `${50}%`;
                star.style.top = `${50}%`;
                
                // Удаляем звезду после анимации
                setTimeout(() => {
                    if (star.parentNode) {
                        starField.removeChild(star);
                        
                        // Обновляем статистику
                        const starType = star.classList.contains('red') ? 'red' : 'blue';
                        starsData[starType]--;
                        starsData.total--;
                        updateStats();
                    }
                }, duration);
            }
        });
    }
    
    // Обновление статистики
    function updateStats() {
        totalStarsEl.textContent = starsData.total;
        
        const redPercent = starsData.total > 0 ? 
            Math.round((starsData.red / starsData.total) * 100) : 0;
        const bluePercent = starsData.total > 0 ? 
            Math.round((starsData.blue / starsData.total) * 100) : 0;
        const blackPercent = starsData.total > 0 ? 
            Math.round((starsData.black / starsData.total) * 100) : 0;
        
        redStarsEl.textContent = `${starsData.red} (${redPercent}%)`;
        blueStarsEl.textContent = `${starsData.blue} (${bluePercent}%)`;
        blackStarsEl.textContent = `${starsData.black} (${blackPercent}%)`;
        
        // Обновляем график
        updateChart(redPercent, bluePercent, blackPercent);
    }
    
    // Обновление графика
    function updateChart(redPercent, bluePercent, blackPercent) {
        actualRedBar.style.width = `${redPercent}%`;
        actualBlueBar.style.width = `${bluePercent}%`;
        actualBlackBar.style.width = `${blackPercent}%`;
    }
    
    // Проверка выполнения заданий
    function checkTasks() {
        // Задание 1: 20 звёзд
        if (starsData.total <= 20) {
            const progress = (starsData.total / 20) * 100;
            progress1.style.width = `${progress}%`;
            progressText1.textContent = `${starsData.total}/20`;
            
            if (starsData.total === 20) {
                catSpeech.textContent = t(
                    'level5.msg20',
                    'Отлично! Ты создал 20 звёзд. Чёрных дыр получилось {black}. Ожидалось около 2, но пока возможны отклонения. Это нормально!',
                    { black: starsData.black }
                );
                
                // Переход к следующему заданию
                setTimeout(() => {
                    currentTask = 1;
                    showTask(currentTask);
                }, 3000);
            }
        }
        
        // Задание 2: 100 звёзд
        if (starsData.total <= 100 && starsData.total > 20) {
            const progress = ((starsData.total - 20) / 80) * 100;
            progress2.style.width = `${progress}%`;
            progressText2.textContent = `${starsData.total}/100`;
            
            if (starsData.total === 100) {
                catSpeech.textContent = t(
                    'level5.msg100',
                    'Супер! После 100 звёзд распределение: {red}% красных, {blue}% голубых, {black}% чёрных дыр.',
                    {
                        red: Math.round((starsData.red / 100) * 100),
                        blue: Math.round((starsData.blue / 100) * 100),
                        black: Math.round((starsData.black / 100) * 100)
                    }
                );
                
                // Переход к следующему заданию
                setTimeout(() => {
                    currentTask = 2;
                    showTask(currentTask);
                }, 4000);
            }
        }
        
        // Задание 3: 50 звёзд (своя гипотеза)
        if (starsData.total <= 150 && starsData.total > 100) {
            const progress = ((starsData.total - 100) / 50) * 100;
            progress3.style.width = `${progress}%`;
            progressText3.textContent = `${starsData.total - 100}/50`;
            
            if (starsData.total === 150) {
                const expectedBlack = Math.round(150 * 0.1);
                catSpeech.textContent = t(
                    'level5.msg150',
                    'После 150 звёзд чёрных дыр получилось {black}. Ожидалось около {expected}.',
                    { black: starsData.black, expected: expectedBlack }
                );
                
                // Завершение уровня
                setTimeout(() => {
                    completeLevel();
                }, 4000);
            }
        }
    }
    
    // Проверка гипотезы
    function checkHypothesis() {
        const userGuess = parseInt(hypothesisInput.value);
        
        if (isNaN(userGuess)) {
            catSpeech.textContent = t('level5.enter', 'Пожалуйста, введите число!');
            return;
        }
        
        const expected = Math.round(50 * starProbabilities.black);
        
        if (Math.abs(userGuess - expected) <= 2) {
            catSpeech.textContent = t(
                'level5.guessGood',
                'Отличная догадка! Действительно, после 50 звёзд обычно получается около {expected} чёрных дыр.',
                { expected }
            );
        } else {
            catSpeech.textContent = t(
                'level5.guessOff',
                'Интересная гипотеза! На самом деле, после 50 звёзд обычно получается около {expected} чёрных дыр. Попробуй создать 50 звёзд и проверь!',
                { expected }
            );
        }
    }
    
    // Сброс лаборатории
    function resetLab() {
        starField.innerHTML = '';
        starsData = {
            total: 0,
            red: 0,
            blue: 0,
            black: 0
        };
        updateStats();
        
        // Сброс прогресса заданий
        if (currentTask === 0) {
            progress1.style.width = '0%';
            progressText1.textContent = '0/20';
        } else if (currentTask === 1) {
            progress2.style.width = '0%';
            progressText2.textContent = '0/100';
        } else if (currentTask === 2) {
            progress3.style.width = '0%';
            progressText3.textContent = '0/50';
        }
        
        catSpeech.textContent = t('level5.labReset', 'Лаборатория очищена. Можно начинать заново!');
    }
    
    // Завершение уровня
    function completeLevel() {
        catSpeech.textContent = t(
            'level5.complete',
            'Ты доказал: даже в квантовом хаосе есть порядок! Это и есть закон больших чисел.'
        );
    }
    
    // Обработчики событий

    function refreshDynamicTranslations() {
        updateStats();

        if (starsData.total === 0) {
            catSpeech.textContent = t(
                'level5.catIntro',
                'Привет! Этот ускоритель создаёт звёзды с разной вероятностью.'
            );
        } else if (starsData.total === 20) {
            catSpeech.textContent = t(
                'level5.msg20',
                'Отлично! Ты создал 20 звёзд. Чёрных дыр: {black}. Отклонения — это нормально.',
                { black: starsData.black }
            );
        } else if (starsData.total === 100) {
            catSpeech.textContent = t(
                'level5.msg100',
                'Супер! После 100 звёзд: {red}% красных, {blue}% голубых, {black}% чёрных дыр.',
                {
                    red: Math.round((starsData.red / 100) * 100),
                    blue: Math.round((starsData.blue / 100) * 100),
                    black: Math.round((starsData.black / 100) * 100)
                }
            );
        } else if (starsData.total >= 150) {
            catSpeech.textContent = t(
                'level5.complete',
                'Ты доказал: даже в квантовом хаосе есть порядок!'
            );
        }
    }
    generateBtn.addEventListener('click', generateStars);
    resetBtn.addEventListener('click', resetLab);
    backToMapBtn.addEventListener('click', () => {
        const mapUrl = new URL('index.html?completed=5', window.location.href).toString();
        try {
            if (window.opener && !window.opener.closed && typeof window.opener.completeLevel === 'function') {
                window.opener.completeLevel(5);
                window.close();
                return;
            }
        } catch (e) {
            // Fallback to direct navigation when opener is cross-origin or unavailable.
        }
        window.location.href = mapUrl;
    });
    checkHypothesisBtn.addEventListener('click', checkHypothesis);
    window.addEventListener('i18n:language-changed', refreshDynamicTranslations);
    
    // Инициализация уровня
    init();
});
