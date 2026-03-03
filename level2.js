document.addEventListener('DOMContentLoaded', function() {
    const t = (key, fallback, params = {}) => (
        window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback
    );
    // Элементы интерфейса
    const coin = document.getElementById('coin');
    const flipBtn = document.getElementById('flip-coin');
    const backToMapBtn = document.getElementById('back-to-map');
    const catSpeech = document.getElementById('cat-speech');
    const totalFlipsEl = document.getElementById('total-flips');
    const headsCountEl = document.getElementById('heads-count');
    const tailsCountEl = document.getElementById('tails-count');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const challengeContainer = document.getElementById('challenge-container');
    const riskModal = document.getElementById('risk-modal');
    const takeRiskBtn = document.getElementById('take-risk');
    const playSafeBtn = document.getElementById('play-safe');
    const montyHallModal = document.getElementById('monty-hall-modal');
    const doors = document.querySelectorAll('.door');
    const montyResult = document.getElementById('monty-result');
    const montyContinueBtn = document.getElementById('monty-continue');

    // Игровые переменные
    let totalFlips = 0;
    let headsCount = 0;
    let tailsCount = 0;
    let headsGoal = 7;
    let flipsGoal = 10;
    let riskTaken = false;
    let gameState = 'flipping'; // 'flipping', 'risk-choice', 'monty-hall', 'completed'
    let selectedDoor = null;
    let prizeDoor = null;

    // Инициализация игры
    function initGame() {
        updateStats();
        showRandomChallenge(); // Показываем первый вопрос сразу при загрузке
    }

    // Показать речь кота
    setTimeout(() => {
        catSpeech.classList.add('visible');
    }, 1000);

    // Бросок монетки
    flipBtn.addEventListener('click', flipCoin);

    // Назад на карту
    backToMapBtn.addEventListener('click', function() {
        // Используем window.opener если открыто из окна, или переходим на index.html с параметром
if (window.opener) {
    window.opener.completeLevel(2);
    window.close();
} else {
    window.location.href = 'index.html?completed=2';
}
    });

    montyContinueBtn.addEventListener('click', function() {
        montyHallModal.classList.remove('visible');
        completeLevel();
    });

    takeRiskBtn.addEventListener('click', function() {
        riskTaken = true;
        riskModal.classList.remove('visible');
        gameState = 'flipping';
        flipBtn.disabled = false;
        updateCatSpeech(t('level2.catRisk', 'Отлично! Бросай монетку, но помни о риске!'));
    });

    playSafeBtn.addEventListener('click', function() {
        riskTaken = false;
        riskModal.classList.remove('visible');
        gameState = 'flipping';
        flipBtn.disabled = false;
        updateCatSpeech(t('level2.catSafe', 'Безопасный выбор! Бросай монетку!'));
    });

    // Функция броска монетки
    function flipCoin() {
        if (gameState !== 'flipping') return;
        
        flipBtn.disabled = true;
        coin.classList.add('flipping');
        
        // Случайный результат (орёл или решка)
        const isHeads = Math.random() > 0.5;
        const result = isHeads ? 'heads' : 'tails';
        
        // Обновляем статистику после анимации
        setTimeout(() => {
            coin.classList.remove('flipping');
            
            // Анимация результата
            if (isHeads) {
                coin.style.transform = 'rotateY(0deg)';
            } else {
                coin.style.transform = 'rotateY(180deg)';
            }
            
            // Обновляем статистику
            totalFlips++;
            
            if (isHeads) {
                headsCount++;
                if (riskTaken) {
                    // Если рискнули и выпал орёл - получаем бонус +3 вместо штрафа -2
                    headsCount += 3;
                    updateCatSpeech(t('level2.riskWin', 'Ура! Ты рискнул и получил бонус +3 очка!'));
                }
            } else {
                tailsCount++;
                if (riskTaken) {
                    // Если рискнули и выпала решка - штраф -1
                    headsCount = Math.max(0, headsCount - 1);
                    updateCatSpeech(t('level2.riskLose', 'Решка! Ты теряешь 1 очко из-за риска.'));
                }
            }
            
            // Сбрасываем флаг риска после любого исхода
            riskTaken = false;
            
            updateStats();
            
            // Проверяем условия для специальных событий
            checkSpecialEvents();
            
            flipBtn.disabled = false;
        }, 1000);
    }

    // Обновление статистики
    function updateStats() {
        totalFlipsEl.textContent = totalFlips;
        headsCountEl.textContent = headsCount;
        tailsCountEl.textContent = tailsCount;
        
        const progressPercent = Math.min(100, (headsCount / headsGoal) * 100);
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = t(
            'level2.progress',
            '{heads} орлов из {goal}',
            { heads: headsCount, goal: headsGoal }
        );
        
        // Проверяем, достигли ли цели
        if (headsCount >= headsGoal) {
            updateCatSpeech(t('level2.goalDone', 'Ура! Ты собрал нужное количество орлов! Теперь давай изучим кое-что интересное...'));
            setTimeout(startMontyHallGame, 2000);
        } else if (totalFlips >= flipsGoal) {
            updateCatSpeech(t('level2.goalFail', 'О нет! Ты использовал все попытки. Попробуй ещё раз!'));
            setTimeout(resetGame, 3000);
        }
    }

    // Проверка специальных событий
    function checkSpecialEvents() {
        // После 5 бросков предлагаем выбор риска
        if (totalFlips === 5 && gameState === 'flipping') {
            gameState = 'risk-choice';
            flipBtn.disabled = true;
            
            setTimeout(() => {
                updateCatSpeech(t('level2.stopOffer', 'Стоп! У меня есть предложение...'));
                setTimeout(() => {
                    riskModal.classList.add('visible');
                }, 1500);
            }, 1000);
        }
        
        // После каждого броска добавляем обучающий вопрос
        if (totalFlips > 0 && totalFlips < flipsGoal && headsCount < headsGoal) {
            setTimeout(showRandomChallenge, 1500);
        }
    }

    // Показать случайный обучающий вопрос
    function showRandomChallenge() {
        const challenges = [
            {
                question: t('level2.ch1.q', 'Какова вероятность, что следующий бросок будет орлом?'),
                options: [
                    t('level2.ch1.o1', '50%'),
                    t('level2.ch1.o2', '70%'),
                    t('level2.ch1.o3', 'Зависит от предыдущих бросков')
                ],
                correct: 0,
                explanation: t('level2.ch1.ex', 'Каждый бросок монетки независим, вероятность орла всегда 50%!')
            },
            {
                question: t('level2.ch2.q', 'Если было 5 орлов подряд, что вероятнее на 6-й бросок?'),
                options: [
                    t('level2.ch2.o1', 'Орёл'),
                    t('level2.ch2.o2', 'Решка'),
                    t('level2.ch2.o3', 'Одинаково')
                ],
                correct: 2,
                explanation: t('level2.ch2.ex', 'Монетка не помнит предыдущие броски - это называется независимость событий!')
            },
            {
                question: t('level2.ch3.q', 'Какова вероятность двух орлов подряд?'),
                options: [
                    t('level2.ch3.o1', '25%'),
                    t('level2.ch3.o2', '50%'),
                    t('level2.ch3.o3', '75%')
                ],
                correct: 0,
                explanation: t('level2.ch3.ex', 'Вероятность каждого орла 50%, а двух подряд - 50% × 50% = 25%!')
            }
        ];
        
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        
        challengeContainer.innerHTML = `
            <h3>${t('level2.challengeTitle', 'Вопрос на размышление')}</h3>
            <p>${challenge.question}</p>
            <div class="challenge-options">
                ${challenge.options.map((option, i) => `
                    <button class="challenge-btn" data-correct="${i === challenge.correct}">${option}</button>
                `).join('')}
            </div>
            <p class="challenge-explanation hidden">${challenge.explanation}</p>
        `;
        
        // Обработчики для кнопок ответов
        document.querySelectorAll('.challenge-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const isCorrect = this.getAttribute('data-correct') === 'true';
                
                if (isCorrect) {
                    this.classList.add('correct');
                    updateCatSpeech(t('level2.correctPrefix', 'Правильно! ') + challenge.explanation);
                } else {
                    this.classList.add('incorrect');
                    updateCatSpeech(t('level2.incorrectPrefix', 'Не совсем! ') + challenge.explanation);
                }
                
                // Показываем объяснение
                document.querySelector('.challenge-explanation').classList.remove('hidden');
                
                // Делаем кнопки неактивными
                document.querySelectorAll('.challenge-btn').forEach(b => {
                    b.disabled = true;
                });
            });
        });
    }

    // Начать игру с парадоксом Монти Холла
    function startMontyHallGame() {
        gameState = 'monty-hall';
        flipBtn.disabled = true;
        
        // Случайно выбираем дверь с призом
        prizeDoor = Math.floor(Math.random() * 3) + 1;
        
        // Показываем модальное окно
        montyResult.classList.add('hidden');
        montyContinueBtn.classList.add('hidden');
        doors.forEach(door => {
            door.className = 'door';
            door.setAttribute('data-door', door.textContent.trim().split(' ')[1]);
        });
        
        montyHallModal.classList.add('visible');
        updateCatSpeech(t('level2.montyPick', 'Выбери дверь, за которой приз! После твоего выбора я открою одну пустую.'));
    }

    // Обработчики для парадокса Монти Холла
    doors.forEach(door => {
        door.addEventListener('click', function() {
            if (gameState !== 'monty-hall' || selectedDoor) return;
            
            selectedDoor = parseInt(this.getAttribute('data-door'));
            this.classList.add('selected');
            
            // Определяем, какую дверь откроет ведущий (не выбранную и не призовую)
            let doorsToOpen = [1, 2, 3].filter(d => d !== selectedDoor && d !== prizeDoor);
            let doorToOpen = doorsToOpen[Math.floor(Math.random() * doorsToOpen.length)];
            
            setTimeout(() => {
                document.querySelector(`.door[data-door="${doorToOpen}"]`).classList.add('opened');
                
                // Показываем кнопки для выбора - поменять или оставить
                setTimeout(() => {
                    montyResult.innerHTML = `
                        <p>${t('level2.montyLine1', 'Ты выбрал дверь {selected}, я открыл дверь {opened}.', { selected: selectedDoor, opened: doorToOpen })}</p>
                        <p>${t('level2.montyLine2', 'Хочешь поменять свой выбор на оставшуюся дверь или оставить текущий выбор?')}</p>
                    `;
                    
                    // Создаем кнопки для выбора
                    const switchBtn = document.createElement('button');
                    switchBtn.className = 'modal-btn';
                    switchBtn.textContent = t('level2.switchChoice', 'Поменять выбор');
                    switchBtn.addEventListener('click', () => handleMontyChoice(true));
                    
                    const stayBtn = document.createElement('button');
                    stayBtn.className = 'modal-btn';
                    stayBtn.textContent = t('level2.stayChoice', 'Оставить выбор');
                    stayBtn.addEventListener('click', () => handleMontyChoice(false));
                    
                    // Очищаем и добавляем новые элементы
                    montyResult.innerHTML = '';
                    montyResult.appendChild(document.createElement('p')).textContent = 
                        t(
                            'level2.montyLine1',
                            'Ты выбрал дверь {selected}, я открыл дверь {opened}.',
                            { selected: selectedDoor, opened: doorToOpen }
                        );
                    montyResult.appendChild(document.createElement('p')).textContent = 
                        t('level2.montyLine2', 'Хочешь поменять свой выбор на оставшуюся дверь или оставить текущий выбор?');
                    
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'modal-options';
                    btnContainer.appendChild(switchBtn);
                    btnContainer.appendChild(stayBtn);
                    montyResult.appendChild(btnContainer);
                    
                    montyResult.classList.remove('hidden');
                }, 1000);
            }, 1000);
        });
    });

    // Обработчик выбора в парадоксе Монти Холла
    function handleMontyChoice(shouldSwitch) {
        // Определяем финальный выбор игрока
        let finalChoice;
        if (shouldSwitch) {
            // Находим оставшуюся неоткрытую дверь (не выбранную и не открытую ведущим)
            finalChoice = [1, 2, 3].find(d => d !== selectedDoor && 
                !document.querySelector(`.door[data-door="${d}"]`).classList.contains('opened'));
        } else {
            finalChoice = selectedDoor;
        }
        
        // Определяем, выиграл ли игрок
        const won = finalChoice === prizeDoor;
        
        // Показываем результат
        const action = shouldSwitch
            ? t('level2.changed', 'поменял')
            : t('level2.stayed', 'оставил');
        const result = won
            ? t('level2.won', 'выиграл')
            : t('level2.lost', 'проиграл');

        montyResult.innerHTML = `
            <p>${t('level2.result1', 'Ты {action} свой выбор и {result}!', { action, result })}</p>
            <p>${t('level2.result2', 'Приз был за дверью {door}.', { door: prizeDoor })}</p>
            <p>${t('level2.result3', 'Это демонстрация парадокса Монти Холла - смена выбора увеличивает шансы с 1/3 до 2/3!')}</p>
        `;
        
        // Подсвечиваем выигрышную дверь
        document.querySelector(`.door[data-door="${prizeDoor}"]`).classList.add('winner');
        
        // Показываем кнопку продолжения
        montyContinueBtn.classList.remove('hidden');
    }

    montyContinueBtn.addEventListener('click', function() {
        montyHallModal.classList.remove('visible');
        completeLevel();
    });

    // Обновление речи кота
    function updateCatSpeech(message) {
        catSpeech.textContent = message;
        catSpeech.classList.remove('visible');
        setTimeout(() => {
            catSpeech.classList.add('visible');
        }, 100);
    }

    // Сброс игры
    function resetGame() {
        totalFlips = 0;
        headsCount = 0;
        tailsCount = 0;
        riskTaken = false;
        gameState = 'flipping';
        updateStats();
        updateCatSpeech(t('level2.reset', 'Давай попробуем ещё раз! Бросай монетку и собирай орлов.'));
        showRandomChallenge(); // Показываем вопрос после сброса
    }

    // Завершение уровня
    function completeLevel() {
        gameState = 'completed';
        updateCatSpeech(
            t(
                'level2.complete',
                'Поздравляю! Ты завершил уровень "Монетный Барьер"! Теперь ты знаешь больше о вероятности!'
            )
        );
    }

    // Инициализируем игру при загрузке
    initGame();
});
