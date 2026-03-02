document.addEventListener('DOMContentLoaded', function() {
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
        updateCatSpeech("Отлично! Бросай монетку, но помни о риске!");
    });

    playSafeBtn.addEventListener('click', function() {
        riskTaken = false;
        riskModal.classList.remove('visible');
        gameState = 'flipping';
        flipBtn.disabled = false;
        updateCatSpeech("Безопасный выбор! Бросай монетку!");
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
                    updateCatSpeech("Ура! Ты рискнул и получил бонус +3 очка!");
                }
            } else {
                tailsCount++;
                if (riskTaken) {
                    // Если рискнули и выпала решка - штраф -1
                    headsCount = Math.max(0, headsCount - 1);
                    updateCatSpeech("Решка! Ты теряешь 1 очко из-за риска.");
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
        progressText.textContent = `${headsCount} орлов из ${headsGoal}`;
        
        // Проверяем, достигли ли цели
        if (headsCount >= headsGoal) {
            updateCatSpeech("Ура! Ты собрал нужное количество орлов! Теперь давай изучим кое-что интересное...");
            setTimeout(startMontyHallGame, 2000);
        } else if (totalFlips >= flipsGoal) {
            updateCatSpeech("О нет! Ты использовал все попытки. Попробуй ещё раз!");
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
                updateCatSpeech("Стоп! У меня есть предложение...");
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
                question: "Какова вероятность, что следующий бросок будет орлом?",
                options: ["50%", "70%", "Зависит от предыдущих бросков"],
                correct: 0,
                explanation: "Каждый бросок монетки независим, вероятность орла всегда 50%!"
            },
            {
                question: "Если было 5 орлов подряд, что вероятнее на 6-й бросок?",
                options: ["Орёл", "Решка", "Одинаково"],
                correct: 2,
                explanation: "Монетка не помнит предыдущие броски - это называется независимость событий!"
            },
            {
                question: "Какова вероятность двух орлов подряд?",
                options: ["25%", "50%", "75%"],
                correct: 0,
                explanation: "Вероятность каждого орла 50%, а двух подряд - 50% × 50% = 25%!"
            }
        ];
        
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        
        challengeContainer.innerHTML = `
            <h3>Вопрос на размышление</h3>
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
                    updateCatSpeech("Правильно! " + challenge.explanation);
                } else {
                    this.classList.add('incorrect');
                    updateCatSpeech("Не совсем! " + challenge.explanation);
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
        updateCatSpeech("Выбери дверь, за которой приз! После твоего выбора я открою одну пустую.");
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
                        <p>Ты выбрал дверь ${selectedDoor}, я открыл дверь ${doorToOpen}.</p>
                        <p>Хочешь поменять свой выбор на оставшуюся дверь или оставить текущий выбор?</p>
                    `;
                    
                    // Создаем кнопки для выбора
                    const switchBtn = document.createElement('button');
                    switchBtn.className = 'modal-btn';
                    switchBtn.textContent = 'Поменять выбор';
                    switchBtn.addEventListener('click', () => handleMontyChoice(true));
                    
                    const stayBtn = document.createElement('button');
                    stayBtn.className = 'modal-btn';
                    stayBtn.textContent = 'Оставить выбор';
                    stayBtn.addEventListener('click', () => handleMontyChoice(false));
                    
                    // Очищаем и добавляем новые элементы
                    montyResult.innerHTML = '';
                    montyResult.appendChild(document.createElement('p')).textContent = 
                        `Ты выбрал дверь ${selectedDoor}, я открыл дверь ${doorToOpen}.`;
                    montyResult.appendChild(document.createElement('p')).textContent = 
                        'Хочешь поменять свой выбор на оставшуюся дверь или оставить текущий выбор?';
                    
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
        montyResult.innerHTML = `
            <p>Ты ${shouldSwitch ? 'поменял' : 'оставил'} свой выбор и ${won ? 'выиграл' : 'проиграл'}!</p>
            <p>Приз был за дверью ${prizeDoor}.</p>
            <p>Это демонстрация парадокса Монти Холла - смена выбора увеличивает шансы с 1/3 до 2/3!</p>
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
        updateCatSpeech("Давай попробуем ещё раз! Бросай монетку и собирай орлов.");
        showRandomChallenge(); // Показываем вопрос после сброса
    }

    // Завершение уровня
    function completeLevel() {
        gameState = 'completed';
        updateCatSpeech("Поздравляю! Ты завершил уровень 'Монетный Барьер'! Теперь ты знаешь больше о вероятности!");
    }

    // Инициализируем игру при загрузке
    initGame();
});