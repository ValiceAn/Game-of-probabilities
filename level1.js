// Инициализация уровня
document.addEventListener('DOMContentLoaded', function() {
    const t = (key, fallback, params = {}) => (
        window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback
    );
    const dice = document.getElementById('dice');
    const rollBtn = document.getElementById('roll-dice');
    const nextTaskBtn = document.getElementById('next-task');
    const backToMapBtn = document.getElementById('back-to-map');
    const catSpeech = document.getElementById('cat-speech');
    const tasks = document.querySelectorAll('.task');
    const optionBtns = document.querySelectorAll('.option-btn');
    const hintBtns = document.querySelectorAll('.hint-btn');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const statsContainer = document.getElementById('stats-container');
    
    let currentTask = 0;
    let completedTasks = 0;
    const totalTasks = tasks.length;
    const desktopQuery = window.matchMedia('(min-width: 64.01rem)');
    
    // Статистика
    const stats = {
        totalRolls: 0,
        faces: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
        even: 0,
        odd: 0,
        greaterThan3: 0
    };

    function isCurrentTaskSolved() {
        const task = tasks[currentTask];
        return Boolean(task && task.querySelector('.option-btn.correct'));
    }

    function updateNextTaskButtonState() {
        const solved = isCurrentTaskSolved();
        const hasNextTask = currentTask < totalTasks - 1;
        const canGoNext = solved && hasNextTask;

        if (desktopQuery.matches) {
            nextTaskBtn.classList.remove('hidden');
            nextTaskBtn.disabled = !canGoNext;
            return;
        }

        nextTaskBtn.disabled = !canGoNext;
        nextTaskBtn.classList.toggle('hidden', !canGoNext);
    }
    
    // Показать первое задание
    showTask(currentTask);
    updateProgress();
    
    // Показать речь кота
    setTimeout(() => {
        catSpeech.classList.add('visible');
    }, 1000);
    
    // Бросок кубика
    rollBtn.addEventListener('click', function() {
        // Анимация броска
        dice.classList.add('dice-rolling');
        rollBtn.disabled = true;
        
        // Случайное число от 1 до 6
        const randomValue = Math.floor(Math.random() * 6) + 1;
        
        // Обновление статистики
        updateStats(randomValue);
        
        // Остановка анимации и показ результата
        setTimeout(() => {
            dice.classList.remove('dice-rolling');
            rotateDiceToValue(randomValue);
            rollBtn.disabled = false;
            
            // Обновление речи кота
            updateCatSpeech(randomValue);
        }, 1500);
    });
    
    // Следующее задание
    nextTaskBtn.addEventListener('click', function() {
        currentTask++;
        if (currentTask < totalTasks) {
            showTask(currentTask);
        } else {
            // Все задания выполнены
            completeLevel();
        }
    });
    
    // Назад на карту
    backToMapBtn.addEventListener('click', function() {
        const mapUrl = new URL('index.html?completed=1', window.location.href).toString();
        try {
            if (window.opener && !window.opener.closed && typeof window.opener.completeLevel === 'function') {
                window.opener.completeLevel(1);
                window.close();
                return;
            }
        } catch (e) {
            // Fallback to direct navigation when opener is cross-origin or unavailable.
        }
        window.location.href = mapUrl;
    });
    
    // Обработка выбора ответа
// Обработка выбора ответа
optionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Если уже отвечали на этот вопрос правильно, игнорируем
        if (this.parentElement.querySelector('.option-btn.correct')) return;
        
        const isCorrect = this.getAttribute('data-correct') === 'true';
        
        if (isCorrect) {
            // Помечаем все кнопки как отвеченные только при правильном ответе
            document.querySelectorAll('.options .option-btn').forEach(b => {
                b.classList.add('answered');
            });
            
            this.classList.add('correct');
            completedTasks++;
            updateProgress();
            
            // Показать кнопку следующего задания
            if (currentTask < totalTasks - 1) {
                updateNextTaskButtonState();
            } else {
                completeLevel();
            }
            
            // Обновить речь кота
            catSpeech.textContent = getRandomCongratulation();
        } else {
            this.classList.add('incorrect');
            // Не блокируем другие кнопки, позволяем попробовать снова
            catSpeech.textContent = t(
                'level1.tryAgain',
                'Попробуй ещё раз! Вспомни, сколько всего граней у кубика.'
            );
            updateNextTaskButtonState();
        }
    });
});
    
    // Показать подсказку
    hintBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hint = this.previousElementSibling;
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
    
    // Сброс состояния кнопок
    document.querySelectorAll('.options .option-btn').forEach(b => {
        b.disabled = false;
        b.classList.remove('correct', 'incorrect');
        // Убрал удаление класса 'answered' - теперь он добавляется только при правильном ответе
    });
    
    // Скрыть подсказки
    document.querySelectorAll('.hint').forEach(h => h.classList.add('hidden'));
    document.querySelectorAll('.hint-btn').forEach(b => {
        b.textContent = t('common.showHint', 'Показать подсказку');
    });
    
    // Скрыть кнопку следующего задания
    updateNextTaskButtonState();
}
    
    function rotateDiceToValue(value) {
        // Углы поворота для каждого значения кубика.
        // Mapping must match faces in level1.html:
        // front=1, back=6, right=4, left=3, top=2, bottom=5.
        const rotations = {
            1: { x: 0, y: 0, z: 0 },
            2: { x: -90, y: 0, z: 0 },
            3: { x: 0, y: 90, z: 0 },
            4: { x: 0, y: -90, z: 0 },
            5: { x: 90, y: 0, z: 0 },
            6: { x: 180, y: 0, z: 0 }
        };
        
        const rot = rotations[value];
        dice.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg)`;
    }
    
    function updateCatSpeech(value) {
        const phrases = [
            t('level1.rollPhrase1', 'Выпало число {value}! Как это связано с задачей?', { value }),
            t('level1.rollPhrase2', 'Кубик показал {value}. Интересно, как это поможет тебе ответить?', { value }),
            t('level1.rollPhrase3', 'Ого, {value}! Теперь подумай над заданием.', { value }),
            t('level1.rollPhrase4', '{value} - хорошее число! Но как оно связано с вероятностью?', { value })
        ];
        
        catSpeech.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function getRandomCongratulation() {
        const phrases = [
            t('level1.good1', 'Правильно! Ты отлично разбираешься в вероятности!'),
            t('level1.good2', 'Верно! Космический кубик гордится тобой!'),
            t('level1.good3', 'Молодец! Ты решил задачу как настоящий математик!'),
            t('level1.good4', 'Отличная работа! Ты понял принцип вероятности!')
        ];
        
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function updateProgress() {
        const percent = (completedTasks / totalTasks) * 100;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = t(
            'level1.progress',
            '{done}/{total} задач выполнено',
            { done: completedTasks, total: totalTasks }
        );
    }
    
    function completeLevel() {
        // Показать сообщение о завершении уровня
        catSpeech.textContent = t(
            'level1.complete',
            'Поздравляю! Ты завершил уровень "Кубик Галактики"! Теперь ты знаешь основы вероятности!'
        );
    }
    
    function updateStats(value) {
        stats.totalRolls++;
        stats.faces[value]++;
        
        if (value % 2 === 0) {
            stats.even++;
        } else {
            stats.odd++;
        }
        
        if (value > 3) {
            stats.greaterThan3++;
        }
        
        renderStats();
    }
    
    function renderStats() {
        statsContainer.innerHTML = `
            <h3>${t('level1.statsTitleColon', 'Статистика бросков:')}</h3>
            <div class="stat-item">
                <span>${t('level1.totalRolls', 'Всего бросков:')}</span>
                <span class="stat-value">${stats.totalRolls}</span>
            </div>
            <div class="stat-row">
                ${[1, 2, 3, 4, 5, 6].map(num => `
                    <div class="stat-face">
                        <div class="face-number">${num}</div>
                        <div class="face-count">${stats.faces[num]}</div>
                        <div class="face-bar" style="width: ${(stats.faces[num] / stats.totalRolls) * 100}%"></div>
                    </div>
                `).join('')}
            </div>
            <div class="stat-item">
                <span>${t('level1.even', 'Чётные:')}</span>
                <span class="stat-value">${stats.even} (${Math.round((stats.even / stats.totalRolls) * 100)}%)</span>
            </div>
            <div class="stat-item">
                <span>${t('level1.odd', 'Нечётные:')}</span>
                <span class="stat-value">${stats.odd} (${Math.round((stats.odd / stats.totalRolls) * 100)}%)</span>
            </div>
            <div class="stat-item">
                <span>${t('level1.gt3', 'Больше 3:')}</span>
                <span class="stat-value">${stats.greaterThan3} (${Math.round((stats.greaterThan3 / stats.totalRolls) * 100)}%)</span>
            </div>
        `;
    }
    
    function showCorrectAnswer() {
        const options = document.querySelectorAll('.options .option-btn');
        options.forEach(btn => {
            if (btn.getAttribute('data-correct') === 'true') {
                btn.classList.add('correct');
            }
        });
    }

    function refreshDynamicTexts() {
        updateProgress();
        updateNextTaskButtonState();

        if (stats.totalRolls > 0) {
            renderStats();
        }

        hintBtns.forEach(btn => {
            const hint = btn.previousElementSibling;
            if (!hint) return;
            btn.textContent = hint.classList.contains('hidden')
                ? t('common.showHint', 'Показать подсказку')
                : t('common.hideHint', 'Скрыть подсказку');
        });
    }

    window.addEventListener('i18n:language-changed', refreshDynamicTexts);
    if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', updateNextTaskButtonState);
    } else if (typeof desktopQuery.addListener === 'function') {
        desktopQuery.addListener(updateNextTaskButtonState);
    }
});
