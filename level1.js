// Инициализация уровня
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Статистика
    const stats = {
        totalRolls: 0,
        faces: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0},
        even: 0,
        odd: 0,
        greaterThan3: 0
    };
    
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
            nextTaskBtn.classList.add('hidden');
        } else {
            // Все задания выполнены
            completeLevel();
        }
    });
    
    // Назад на карту
    backToMapBtn.addEventListener('click', function() {
// Используем window.opener если открыто из окна, или переходим на index.html с параметром
if (window.opener) {
    window.opener.completeLevel(1);
    window.close();
} else {
    window.location.href = 'index.html?completed=1';
}
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
                nextTaskBtn.classList.remove('hidden');
            } else {
                completeLevel();
            }
            
            // Обновить речь кота
            catSpeech.textContent = getRandomCongratulation();
        } else {
            this.classList.add('incorrect');
            // Не блокируем другие кнопки, позволяем попробовать снова
            catSpeech.textContent = 'Попробуй ещё раз! Вспомни, сколько всего граней у кубика.';
        }
    });
});
    
    // Показать подсказку
    hintBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const hint = this.previousElementSibling;
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
    
    // Сброс состояния кнопок
    document.querySelectorAll('.options .option-btn').forEach(b => {
        b.disabled = false;
        b.classList.remove('correct', 'incorrect');
        // Убрал удаление класса 'answered' - теперь он добавляется только при правильном ответе
    });
    
    // Скрыть подсказки
    document.querySelectorAll('.hint').forEach(h => h.classList.add('hidden'));
    document.querySelectorAll('.hint-btn').forEach(b => b.textContent = 'Показать подсказку');
    
    // Скрыть кнопку следующего задания
    nextTaskBtn.classList.add('hidden');
}
    
    function rotateDiceToValue(value) {
        // Углы поворота для каждого значения кубика
        const rotations = {
            1: { x: 0, y: 0, z: 0 },
            2: { x: 90, y: 0, z: 0 },
            3: { x: 0, y: -90, z: 0 },
            4: { x: 0, y: 90, z: 0 },
            5: { x: -90, y: 0, z: 0 },
            6: { x: 180, y: 0, z: 0 }
        };
        
        const rot = rotations[value];
        dice.style.transform = `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg)`;
    }
    
    function updateCatSpeech(value) {
        const phrases = [
            `Выпало число ${value}! Как это связано с задачей?`,
            `Кубик показал ${value}. Интересно, как это поможет тебе ответить?`,
            `Ого, ${value}! Теперь подумай над заданием.`,
            `${value} - хорошее число! Но как оно связано с вероятностью?`
        ];
        
        catSpeech.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function getRandomCongratulation() {
        const phrases = [
            'Правильно! Ты отлично разбираешься в вероятности!',
            'Верно! Космический кубик гордится тобой!',
            'Молодец! Ты решил задачу как настоящий математик!',
            'Отличная работа! Ты понял принцип вероятности!'
        ];
        
        return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    function updateProgress() {
        const percent = (completedTasks / totalTasks) * 100;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${completedTasks}/${totalTasks} задач выполнено`;
    }
    
    function completeLevel() {
        // Показать сообщение о завершении уровня
        catSpeech.textContent = 'Поздравляю! Ты завершил уровень "Кубик Галактики"! Теперь ты знаешь основы вероятности!';
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
            <h3>Статистика бросков:</h3>
            <div class="stat-item">
                <span>Всего бросков:</span>
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
                <span>Чётные:</span>
                <span class="stat-value">${stats.even} (${Math.round((stats.even / stats.totalRolls) * 100)}%)</span>
            </div>
            <div class="stat-item">
                <span>Нечётные:</span>
                <span class="stat-value">${stats.odd} (${Math.round((stats.odd / stats.totalRolls) * 100)}%)</span>
            </div>
            <div class="stat-item">
                <span>Больше 3:</span>
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
});