document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const urn = document.getElementById('urn');
    const drawnBallsContainer = document.querySelector('.drawn-balls .balls-container');
    const catSpeech = document.getElementById('cat-speech');
    const tasks = document.querySelectorAll('.task');
    const nextTaskBtn = document.getElementById('next-task');
    const backToMapBtn = document.getElementById('back-to-map');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const combinationsGrid = document.querySelector('.combinations-grid');
    const visualComb = document.getElementById('visual-comb');
    
    // Кнопки заданий
    const drawTwoBtn = document.getElementById('draw-two');
    const reset1Btn = document.getElementById('reset1');
    const drawAfterRedBtn = document.getElementById('draw-after-red');
    const reset2Btn = document.getElementById('reset2');
    const checkCombBtn = document.getElementById('check-combination');
    const combinationInput = document.getElementById('combination-input');
    const reset3Btn = document.getElementById('reset3');
    
    // Вероятности
    const prob1Display = document.getElementById('prob1');
    const prob2Display = document.getElementById('prob2');
    const prob3Display = document.getElementById('prob3');
    
    let currentTask = 0;
    let completedTasks = 0;
    const totalTasks = tasks.length;
    
    // Исходные данные
    const initialBalls = {
        blue: 4,
        red: 3
    };
    
    let balls = JSON.parse(JSON.stringify(initialBalls));
    let drawnBalls = [];
    
    // Инициализация
    function init() {
        showTask(currentTask);
        updateProgress();
        createBalls();
        generateCombinations();
        
        // Показать речь кота
        setTimeout(() => {
            catSpeech.classList.add('visible');
        }, 1000);
    }
    
    // Создание шариков в урне
    function createBalls() {
        urn.innerHTML = '';
        drawnBalls = [];
        updateDrawnBalls();
        
        // Создаем синие шарики
        for (let i = 0; i < balls.blue; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball blue';
            ball.textContent = 'B' + (i+1);
            urn.appendChild(ball);
        }
        
        // Создаем красные шарики
        for (let i = 0; i < balls.red; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball red';
            ball.textContent = 'R' + (i+1);
            urn.appendChild(ball);
        }
    }
    
    // Обновление отображения вытянутых шариков
    function updateDrawnBalls() {
        drawnBallsContainer.innerHTML = '';
        drawnBalls.forEach(ball => {
            const ballEl = document.createElement('div');
            ballEl.className = `ball ${ball.color}`;
            ballEl.textContent = ball.id;
            drawnBallsContainer.appendChild(ballEl);
        });
    }
    
    // Показать задание
    function showTask(index) {
        tasks.forEach((task, i) => {
            task.classList.toggle('active', i === index);
            task.classList.toggle('hidden', i !== index);
        });
        
        // Сброс состояния для нового задания
        resetUrn();
        
        // Обновление интерфейса в зависимости от задания
        if (index === 0) {
            // Задание 1: вытянуть 2 синих
            updateProbabilityDisplay(1);
        } else if (index === 1) {
            // Задание 2: после красного
            updateProbabilityDisplay(2);
        } else if (index === 2) {
            // Задание 3: комбинации
            combinationInput.value = '';
            updateProbabilityDisplay(3);
            visualComb.innerHTML = '';
        }
    }
    
    // Обновление отображения вероятности
    function updateProbabilityDisplay(taskNum) {
        if (taskNum === 1) {
            prob1Display.textContent = `28.6% (4/7 × 3/6)`;
        } else if (taskNum === 2) {
            // Вероятность вытянуть синий после красного
            prob2Display.textContent = `66.7% (4/6)`;
        } else if (taskNum === 3) {
            // Количество комбинаций 1 синий + 1 красный
            const combinations = initialBalls.blue * initialBalls.red;
            prob3Display.textContent = combinations;
        }
    }
    
    // Генерация всех возможных комбинаций
    function generateCombinations() {
        combinationsGrid.innerHTML = '';
        
        const types = [
            {name: "2 синих", color1: "blue", color2: "blue", count: (balls.blue * (balls.blue - 1)) / 2},
            {name: "2 красных", color1: "red", color2: "red", count: (balls.red * (balls.red - 1)) / 2},
            {name: "1 синий + 1 красный", color1: "blue", color2: "red", count: balls.blue * balls.red}
        ];
        
        types.forEach(type => {
            const comb = document.createElement('div');
            comb.className = 'combination';
            comb.innerHTML = `
                <div class="ball ${type.color1}">${type.color1 === "blue" ? "B" : "R"}</div>
                <div class="ball ${type.color2}">${type.color2 === "blue" ? "B" : "R"}</div>
                <div class="comb-count">${type.count} способов</div>
            `;
            combinationsGrid.appendChild(comb);
        });
    }
    
    // Показать все комбинации для задания 3
    function showAllCombinations() {
        visualComb.innerHTML = '';
        
        // Создаем все возможные пары 1 синий + 1 красный
        for (let b = 1; b <= initialBalls.blue; b++) {
            for (let r = 1; r <= initialBalls.red; r++) {
                const pair = document.createElement('div');
                pair.className = 'ball-pair';
                pair.innerHTML = `
                    <div class="ball blue">B${b}</div>
                    <div class="ball red">R${r}</div>
                `;
                visualComb.appendChild(pair);
            }
        }
    }
    
    // Проверка введенного количества комбинаций
    function checkCombination() {
        const userAnswer = parseInt(combinationInput.value);
        const correctAnswer = initialBalls.blue * initialBalls.red;
        
        if (isNaN(userAnswer)) {
            catSpeech.textContent = 'Пожалуйста, введите число!';
            return;
        }
        
        if (userAnswer === correctAnswer) {
            catSpeech.textContent = 'Правильно! Действительно, существует ' + correctAnswer + ' способов вытянуть 1 синий и 1 красный шарик.';
            
            // Показываем все комбинации
            showAllCombinations();
            
            // Обновляем прогресс только если задание еще не было выполнено
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
                updateProgress();
            }
            
            // Для последнего задания не показываем кнопку "Следующее задание"
            if (currentTask < totalTasks - 1) {
                nextTaskBtn.classList.remove('hidden');
            } else {
                // Для последнего задания показываем завершение
                completeLevel();
            }
        } else {
            catSpeech.textContent = 'Неверно. Попробуй еще раз! Подсказка: умножь количество синих шариков на количество красных.';
        }
    }
    
    // Вытягивание шариков (для задания 1)
    function drawTwoBalls() {
        if (drawnBalls.length >= 2) return;
        
        // Анимация вытягивания
        const allBalls = [...urn.querySelectorAll('.ball')];
        const randomIndex = Math.floor(Math.random() * allBalls.length);
        const ball = allBalls[randomIndex];
        
        // Определяем цвет шарика
        const isBlue = ball.classList.contains('blue');
        const ballId = ball.textContent;
        
        // Добавляем в вытянутые
        drawnBalls.push({
            id: ballId,
            color: isBlue ? 'blue' : 'red'
        });
        
        // Удаляем из урны
        ball.classList.add('drawn');
        setTimeout(() => {
            urn.removeChild(ball);
            updateDrawnBalls();
            
            // Обновляем счетчики
            if (isBlue) {
                balls.blue--;
            } else {
                balls.red--;
            }
            
            // Если вытянули 2 шарика, проверяем результат
            if (drawnBalls.length === 2) {
                checkTwoBlueResult();
            } else {
                // Можно вытягивать второй шарик
                updateProbabilityDisplay(1);
            }
        }, 500);
    }
    
    // Проверка результата для задания 1
    function checkTwoBlueResult() {
        const bothBlue = drawnBalls.every(ball => ball.color === 'blue');
        
        if (bothBlue) {
            catSpeech.textContent = 'Ура! Ты вытянул два синих шарика подряд! Теперь ты видишь, как вычисляется вероятность такого события.';
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
                updateProgress();
            }
            nextTaskBtn.classList.remove('hidden');
        } else {
            catSpeech.textContent = 'Не получилось два синих подряд. Попробуй еще раз! Помни, вероятность этого события ' + 
                                  prob1Display.textContent.split(' (')[0] + '.';
        }
        
        updateProbabilityDisplay(1);
    }
    
    // Вытягивание после красного (для задания 2)
    function drawAfterRed() {
        if (drawnBalls.length >= 1) return;
        
        // Сначала вытягиваем красный
        const redBalls = [...urn.querySelectorAll('.ball.red')];
        if (redBalls.length === 0) {
            catSpeech.textContent = 'Красных шариков больше нет! Нажми "Начать заново".';
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * redBalls.length);
        const ball = redBalls[randomIndex];
        const ballId = ball.textContent;
        
        drawnBalls.push({
            id: ballId,
            color: 'red'
        });
        
        ball.classList.add('drawn');
        setTimeout(() => {
            urn.removeChild(ball);
            updateDrawnBalls();
            balls.red--;
            
            // Обновляем вероятность
            updateProbabilityDisplay(2);
            
            // Теперь можно вытянуть второй шарик
            drawAfterRedBtn.textContent = 'Вытянуть второй шарик';
            drawAfterRedBtn.onclick = drawSecondBallAfterRed;
        }, 500);
    }
    
    // Вытягивание второго шарика после красного
    function drawSecondBallAfterRed() {
        const allBalls = [...urn.querySelectorAll('.ball')];
        const randomIndex = Math.floor(Math.random() * allBalls.length);
        const ball = allBalls[randomIndex];
        const isBlue = ball.classList.contains('blue');
        const ballId = ball.textContent;
        
        drawnBalls.push({
            id: ballId,
            color: isBlue ? 'blue' : 'red'
        });
        
        ball.classList.add('drawn');
        setTimeout(() => {
            urn.removeChild(ball);
            updateDrawnBalls();
            
            if (isBlue) {
                balls.blue--;
            } else {
                balls.red--;
            }
            
            // Проверяем результат
            checkAfterRedResult(isBlue);
        }, 500);
    }
    
    // Проверка результата для задания 2
    function checkAfterRedResult(secondIsBlue) {
        if (secondIsBlue) {
            catSpeech.textContent = 'Ты вытянул синий шарик после красного!';
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
                updateProgress();
            }
            nextTaskBtn.classList.remove('hidden');
        } else {
            catSpeech.textContent = 'В этот раз второй шарик оказался красным. Попробуй еще раз!';
        }
        
        updateProbabilityDisplay(2);
    }
    
    // Сброс урны
    function resetUrn() {
        balls = JSON.parse(JSON.stringify(initialBalls));
        drawnBalls = [];
        createBalls();
        
        // Сброс кнопки для задания 2
        drawAfterRedBtn.textContent = 'Вытянуть после красного';
        drawAfterRedBtn.onclick = drawAfterRed;
    }
    
    // Обновление прогресса
    function updateProgress() {
        const percent = (completedTasks / totalTasks) * 100;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${completedTasks}/${totalTasks} задач выполнено`;
        
        // Добавляем анимацию при обновлении прогресса
        progressFill.style.transition = 'width 0.5s ease-in-out';
    }
    
    // Завершение уровня
    function completeLevel() {
        // Убедимся, что прогресс показывает 100%
        completedTasks = totalTasks;
        updateProgress();
        
        catSpeech.textContent = 'Поздравляю! Ты освоил комбинаторику и зависимые события! Теперь ты понимаешь, как меняются вероятности.';
        nextTaskBtn.classList.add('hidden');
    }
    
    // Обработчики событий
    drawTwoBtn.addEventListener('click', drawTwoBalls);
    reset1Btn.addEventListener('click', resetUrn);
    reset2Btn.addEventListener('click', resetUrn);
    reset3Btn.addEventListener('click', resetUrn);
    checkCombBtn.addEventListener('click', checkCombination);
    
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
    window.opener.completeLevel(3);
    window.close();
} else {
    window.location.href = 'index.html?completed=3';
}
    });
    
    // Инициализация уровня
    init();
});