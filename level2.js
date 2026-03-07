document.addEventListener('DOMContentLoaded', function() {
    const t = (key, fallback, params = {}) => (
        window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback
    );
    // Элементы интерфейса
    const coin = document.getElementById('coin');
    const flipBtn = document.getElementById('flip-coin');
    const nextTaskBtn = document.getElementById('next-task');
    const backToMapBtn = document.getElementById('back-to-map');
    const catSpeech = document.getElementById('cat-speech');
    const totalFlipsEl = document.getElementById('total-flips');
    const headsCountEl = document.getElementById('heads-count');
    const tailsCountEl = document.getElementById('tails-count');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const taskProgressFill = document.getElementById('task-progress-fill');
    const taskProgressText = document.getElementById('task-progress-text');
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
    let currentChallengeId = null;
    let currentChallengeAnswered = false;
    let currentSelectedOptionIndex = null;
    let currentSelectedWasCorrect = false;
    const shownChallengeIds = new Set();
    const completedChallengeIds = new Set();
    const totalChallengeTasks = 3;

    function hideNextTaskButton() {
        if (!nextTaskBtn) return;
        nextTaskBtn.hidden = true;
        nextTaskBtn.disabled = true;
    }

    function showNextTaskButton() {
        if (!nextTaskBtn) return;
        nextTaskBtn.hidden = false;
        nextTaskBtn.disabled = false;
    }

    function lockNextTaskButton() {
        if (!nextTaskBtn) return;
        nextTaskBtn.hidden = false;
        nextTaskBtn.disabled = true;
    }

    function resetCurrentChallengeState() {
        currentChallengeAnswered = false;
        currentSelectedOptionIndex = null;
        currentSelectedWasCorrect = false;
    }

    // Инициализация игры
    function initGame() {
        updateStats();
        updateTaskProgress();
        shownChallengeIds.clear();
        hideNextTaskButton();
        showRandomChallenge();
    }

    // Показать речь кота
    setTimeout(() => {
        catSpeech.classList.add('visible');
    }, 1000);

    // Бросок монетки
    flipBtn.addEventListener('click', flipCoin);
    if (nextTaskBtn) {
        nextTaskBtn.addEventListener('click', function() {
            showRandomChallenge();
        });
    }

    // Назад на карту
    backToMapBtn.addEventListener('click', function() {
        const mapUrl = new URL('index.html?completed=2', window.location.href).toString();
        try {
            if (window.opener && !window.opener.closed && typeof window.opener.completeLevel === 'function') {
                window.opener.completeLevel(2);
                window.close();
                return;
            }
        } catch (e) {
            // Fallback to direct navigation when opener is cross-origin or unavailable.
        }
        window.location.href = mapUrl;
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

    function updateTaskProgress() {
        if (!taskProgressFill || !taskProgressText) return;

        const done = completedChallengeIds.size;
        const percent = Math.min(100, (done / totalChallengeTasks) * 100);
        taskProgressFill.style.width = `${percent}%`;
        taskProgressText.textContent = window.I18N?.lang === 'en'
            ? t('level2.taskProgress', '{done}/{total} tasks completed', { done, total: totalChallengeTasks })
            : `${done}/${totalChallengeTasks} \u0437\u0430\u0434\u0430\u0447 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u043e`;
    }

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
        
        // Вопросы меняются только вручную через кнопку "Следующая задача".
    }

    function getChallengePool() {
        return [
            {
                id: 'ch1',
                question: t('level2.ch1.q', 'What is the probability that the next flip is heads?'),
                options: [
                    t('level2.ch1.o1', '50%'),
                    t('level2.ch1.o2', '70%'),
                    t('level2.ch1.o3', 'Depends on previous flips')
                ],
                correct: 0,
                explanation: t('level2.ch1.ex', 'Each coin flip is independent, so the probability of heads is always 50%!')
            },
            {
                id: 'ch2',
                question: t('level2.ch2.q', 'If there were 5 heads in a row, what is more likely on the 6th flip?'),
                options: [
                    t('level2.ch2.o1', 'Heads'),
                    t('level2.ch2.o2', 'Tails'),
                    t('level2.ch2.o3', 'Equal')
                ],
                correct: 2,
                explanation: t('level2.ch2.ex', 'The coin does not remember previous flips - this is event independence!')
            },
            {
                id: 'ch3',
                question: t('level2.ch3.q', 'What is the probability of two heads in a row?'),
                options: [
                    t('level2.ch3.o1', '25%'),
                    t('level2.ch3.o2', '50%'),
                    t('level2.ch3.o3', '75%')
                ],
                correct: 0,
                explanation: t('level2.ch3.ex', 'Each heads is 50%, so two in a row is 50% × 50% = 25%!')
            }
        ];
    }

    function renderChallenge(challenge, restoreCurrentState = false) {
        if (!challenge) return;
        currentChallengeId = challenge.id;
        if (!restoreCurrentState || !currentChallengeAnswered) {
            hideNextTaskButton();
        }

        challengeContainer.innerHTML = `
            <h3>${t('level2.challengeTitle', 'Think About It')}</h3>
            <p>${challenge.question}</p>
            <div class="challenge-options">
                ${challenge.options.map((option, i) => `
                    <button class="challenge-btn" data-index="${i}" data-correct="${i === challenge.correct}">${option}</button>
                `).join('')}
            </div>
            <p class="challenge-explanation hidden">${challenge.explanation}</p>
        `;

        const answerButtons = challengeContainer.querySelectorAll('.challenge-btn');

        if (
            restoreCurrentState &&
            currentChallengeAnswered &&
            Number.isInteger(currentSelectedOptionIndex)
        ) {
            const selectedBtn = challengeContainer.querySelector(
                `.challenge-btn[data-index="${currentSelectedOptionIndex}"]`
            );
            if (selectedBtn) {
                selectedBtn.classList.add(currentSelectedWasCorrect ? 'correct' : 'incorrect');
            }

            const explanationEl = challengeContainer.querySelector('.challenge-explanation');
            if (explanationEl) explanationEl.classList.remove('hidden');

            answerButtons.forEach((answerBtn) => {
                answerBtn.disabled = true;
            });

            const hasMoreChallenges = getChallengePool().some(
                (item) => !shownChallengeIds.has(item.id)
            );
            if (hasMoreChallenges) {
                showNextTaskButton();
            } else {
                lockNextTaskButton();
            }
        }

        answerButtons.forEach((btn) => {
            btn.addEventListener('click', function() {
                if (currentChallengeAnswered) return;

                const isCorrect = this.getAttribute('data-correct') === 'true';
                currentChallengeAnswered = true;
                currentSelectedOptionIndex = Number(this.getAttribute('data-index'));
                currentSelectedWasCorrect = isCorrect;

                if (isCorrect) {
                    this.classList.add('correct');
                    updateCatSpeech(t('level2.correctPrefix', 'Correct! ') + challenge.explanation);
                    completedChallengeIds.add(challenge.id);
                    updateTaskProgress();
                } else {
                    this.classList.add('incorrect');
                    updateCatSpeech(t('level2.incorrectPrefix', 'Not quite! ') + challenge.explanation);
                }

                const explanationEl = challengeContainer.querySelector('.challenge-explanation');
                if (explanationEl) explanationEl.classList.remove('hidden');

                challengeContainer.querySelectorAll('.challenge-btn').forEach((answerBtn) => {
                    answerBtn.disabled = true;
                });

                const hasMoreChallenges = getChallengePool().some(
                    (item) => !shownChallengeIds.has(item.id)
                );
                if (hasMoreChallenges) {
                    showNextTaskButton();
                } else {
                    lockNextTaskButton();
                }
            });
        });
    }

    function showChallengeById(challengeId, restoreCurrentState = false) {
        const challenge = getChallengePool().find((item) => item.id === challengeId);
        if (challenge) {
            renderChallenge(challenge, restoreCurrentState);
        } else {
            showRandomChallenge();
        }
    }

    // Показать случайный обучающий вопрос
    function showRandomChallenge() {
        const challenges = getChallengePool();
        const unseen = challenges.filter((challenge) => !shownChallengeIds.has(challenge.id));
        if (unseen.length === 0) {
            lockNextTaskButton();
            return;
        }
        const challenge = unseen[Math.floor(Math.random() * unseen.length)];
        shownChallengeIds.add(challenge.id);
        resetCurrentChallengeState();
        renderChallenge(challenge);
    }

    // Начать игру с парадоксом Монти Холла
    function startMontyHallGame() {
        gameState = 'monty-hall';
        flipBtn.disabled = true;
        hideNextTaskButton();
        
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
        currentChallengeId = null;
        resetCurrentChallengeState();
        shownChallengeIds.clear();
        updateStats();
        updateCatSpeech(t('level2.reset', 'Давай попробуем ещё раз! Бросай монетку и собирай орлов.'));
        hideNextTaskButton();
        showRandomChallenge(); // Показываем вопрос после сброса
    }

    // Завершение уровня
    function completeLevel() {
        gameState = 'completed';
        hideNextTaskButton();
        updateCatSpeech(
            t(
                'level2.complete',
                'Поздравляю! Ты завершил уровень "Монетный Барьер"! Теперь ты знаешь больше о вероятности!'
            )
        );
    }

    // Инициализируем игру при загрузке

    window.addEventListener('i18n:language-changed', function() {
        progressText.textContent = t(
            'level2.progress',
            '{heads} heads out of {goal}',
            { heads: headsCount, goal: headsGoal }
        );
        updateTaskProgress();


        if (challengeContainer && challengeContainer.children.length > 0) {
            if (currentChallengeId) {
                showChallengeById(currentChallengeId, true);
            } else {
                showRandomChallenge();
            }
        }

        if (gameState === 'completed') {
            catSpeech.textContent = t(
                'level2.complete',
                'Congratulations! You completed "Coin Barrier"! Now you know more about probability!'
            );
        } else if (gameState === 'risk-choice') {
            catSpeech.textContent = t('level2.stopOffer', 'Stop! I have an offer...');
        } else if (totalFlips === 0) {
            catSpeech.textContent = t(
                'level2.catIntro',
                'Hi! Flip the coin and collect heads. You need 7 out of 10 flips!'
            );
        }
    });
    initGame();
});
