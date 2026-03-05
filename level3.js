document.addEventListener('DOMContentLoaded', function() {
    const formatTemplate = (template, params = {}) =>
        String(template).replace(/\{(\w+)\}/g, (_, key) =>
            Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : `{${key}}`
        );

    const RU_DYNAMIC = {
        'level3.type2blue': '2 синих',
        'level3.type2red': '2 красных',
        'level3.typeMixed': '1 синий + 1 красный',
        'level3.ways': '{count} способов',
        'level3.enterNumber': 'Пожалуйста, введите число!',
        'level3.correct': 'Правильно! Действительно, существует {count} способов вытянуть 1 синий и 1 красный шарик.',
        'level3.incorrect': 'Неверно. Попробуй еще раз! Подсказка: умножь количество синих шариков на количество красных.',
        'level3.twoBlueWin': 'Ура! Ты вытянул два синих шарика подряд! Теперь ты видишь, как вычисляется вероятность такого события.',
        'level3.twoBlueFail': 'Не получилось два синих подряд. Попробуй еще раз! Помни, вероятность этого события {prob}.',
        'level3.noRedLeft': 'Красных шариков больше нет! Нажми "Начать заново".',
        'level3.drawSecond': 'Вытянуть второй шарик',
        'level3.afterRedBlue': 'Ты вытянул синий шарик после красного!',
        'level3.afterRedRed': 'В этот раз второй шарик оказался красным. Попробуй еще раз!',
        'level3.drawAfterRed': 'Вытянуть после красного',
        'level3.progress': '{done}/{total} задач выполнено',
        'level3.complete': 'Поздравляю! Ты освоил комбинаторику и зависимые события! Теперь ты понимаешь, как меняются вероятности.'
    };

    const t = (key, fallback, params = {}) => {
        if (window.I18N?.lang === 'ru' && RU_DYNAMIC[key]) {
            return formatTemplate(RU_DYNAMIC[key], params);
        }
        return window.I18N?.t ? window.I18N.t(key, fallback, params) : fallback;
    };
    // Р­Р»РµРјРµРЅС‚С‹ РёРЅС‚РµСЂС„РµР№СЃР°
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
    
    // РљРЅРѕРїРєРё Р·Р°РґР°РЅРёР№
    const drawTwoBtn = document.getElementById('draw-two');
    const reset1Btn = document.getElementById('reset1');
    const drawAfterRedBtn = document.getElementById('draw-after-red');
    const reset2Btn = document.getElementById('reset2');
    const checkCombBtn = document.getElementById('check-combination');
    const combinationInput = document.getElementById('combination-input');
    const reset3Btn = document.getElementById('reset3');
    
    // Р’РµСЂРѕСЏС‚РЅРѕСЃС‚Рё
    const prob1Display = document.getElementById('prob1');
    const prob2Display = document.getElementById('prob2');
    const prob3Display = document.getElementById('prob3');
    
    let currentTask = 0;
    let completedTasks = 0;
    const totalTasks = tasks.length;
    
    // РСЃС…РѕРґРЅС‹Рµ РґР°РЅРЅС‹Рµ
    const initialBalls = {
        blue: 4,
        red: 3
    };
    
    let balls = JSON.parse(JSON.stringify(initialBalls));
    let drawnBalls = [];
    
    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ
    function init() {
        showTask(currentTask);
        updateProgress();
        createBalls();
        generateCombinations();
        nextTaskBtn.classList.remove('hidden');
        nextTaskBtn.disabled = true;
        
        // РџРѕРєР°Р·Р°С‚СЊ СЂРµС‡СЊ РєРѕС‚Р°
        setTimeout(() => {
            catSpeech.classList.add('visible');
        }, 1000);
    }
    
    // РЎРѕР·РґР°РЅРёРµ С€Р°СЂРёРєРѕРІ РІ СѓСЂРЅРµ
    function createBalls() {
        urn.innerHTML = '';
        drawnBalls = [];
        updateDrawnBalls();
        
        // РЎРѕР·РґР°РµРј СЃРёРЅРёРµ С€Р°СЂРёРєРё
        for (let i = 0; i < balls.blue; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball blue';
            ball.textContent = 'B' + (i+1);
            urn.appendChild(ball);
        }
        
        // РЎРѕР·РґР°РµРј РєСЂР°СЃРЅС‹Рµ С€Р°СЂРёРєРё
        for (let i = 0; i < balls.red; i++) {
            const ball = document.createElement('div');
            ball.className = 'ball red';
            ball.textContent = 'R' + (i+1);
            urn.appendChild(ball);
        }
    }
    
    // РћР±РЅРѕРІР»РµРЅРёРµ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ РІС‹С‚СЏРЅСѓС‚С‹С… С€Р°СЂРёРєРѕРІ
    function updateDrawnBalls() {
        drawnBallsContainer.innerHTML = '';
        drawnBalls.forEach(ball => {
            const ballEl = document.createElement('div');
            ballEl.className = `ball ${ball.color}`;
            ballEl.textContent = ball.id;
            drawnBallsContainer.appendChild(ballEl);
        });
    }
    
    // РџРѕРєР°Р·Р°С‚СЊ Р·Р°РґР°РЅРёРµ
    function showTask(index) {
        tasks.forEach((task, i) => {
            task.classList.toggle('active', i === index);
            task.classList.toggle('hidden', i !== index);
        });

        nextTaskBtn.disabled = !(index < totalTasks - 1 && completedTasks > index);
        
        // РЎР±СЂРѕСЃ СЃРѕСЃС‚РѕСЏРЅРёСЏ РґР»СЏ РЅРѕРІРѕРіРѕ Р·Р°РґР°РЅРёСЏ
        resetUrn();
        
        // РћР±РЅРѕРІР»РµРЅРёРµ РёРЅС‚РµСЂС„РµР№СЃР° РІ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ Р·Р°РґР°РЅРёСЏ
        if (index === 0) {
            // Р—Р°РґР°РЅРёРµ 1: РІС‹С‚СЏРЅСѓС‚СЊ 2 СЃРёРЅРёС…
            updateProbabilityDisplay(1);
        } else if (index === 1) {
            // Р—Р°РґР°РЅРёРµ 2: РїРѕСЃР»Рµ РєСЂР°СЃРЅРѕРіРѕ
            updateProbabilityDisplay(2);
        } else if (index === 2) {
            // Р—Р°РґР°РЅРёРµ 3: РєРѕРјР±РёРЅР°С†РёРё
            combinationInput.value = '';
            updateProbabilityDisplay(3);
            visualComb.innerHTML = '';
        }
    }
    
    // РћР±РЅРѕРІР»РµРЅРёРµ РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ РІРµСЂРѕСЏС‚РЅРѕСЃС‚Рё
    function updateProbabilityDisplay(taskNum) {
        if (taskNum === 1) {
            prob1Display.textContent = `28.6% (4/7 × 3/6)`;
        } else if (taskNum === 2) {
            // Р’РµСЂРѕСЏС‚РЅРѕСЃС‚СЊ РІС‹С‚СЏРЅСѓС‚СЊ СЃРёРЅРёР№ РїРѕСЃР»Рµ РєСЂР°СЃРЅРѕРіРѕ
            prob2Display.textContent = `66.7% (4/6)`;
        } else if (taskNum === 3) {
            // РљРѕР»РёС‡РµСЃС‚РІРѕ РєРѕРјР±РёРЅР°С†РёР№ 1 СЃРёРЅРёР№ + 1 РєСЂР°СЃРЅС‹Р№
            const combinations = initialBalls.blue * initialBalls.red;
            prob3Display.textContent = combinations;
        }
    }
    
    // Р“РµРЅРµСЂР°С†РёСЏ РІСЃРµС… РІРѕР·РјРѕР¶РЅС‹С… РєРѕРјР±РёРЅР°С†РёР№
    function generateCombinations() {
        combinationsGrid.innerHTML = '';
        
        const types = [
            {name: t('level3.type2blue', '2 СЃРёРЅРёС…'), color1: 'blue', color2: 'blue', count: (balls.blue * (balls.blue - 1)) / 2},
            {name: t('level3.type2red', '2 РєСЂР°СЃРЅС‹С…'), color1: 'red', color2: 'red', count: (balls.red * (balls.red - 1)) / 2},
            {name: t('level3.typeMixed', '1 СЃРёРЅРёР№ + 1 РєСЂР°СЃРЅС‹Р№'), color1: 'blue', color2: 'red', count: balls.blue * balls.red}
        ];
        
        types.forEach(type => {
            const comb = document.createElement('div');
            comb.className = 'combination';
            comb.innerHTML = `
                <div class="ball ${type.color1}">${type.color1 === "blue" ? "B" : "R"}</div>
                <div class="ball ${type.color2}">${type.color2 === "blue" ? "B" : "R"}</div>
                <div class="comb-count">${t('level3.ways', '{count} \u0441\u043f\u043e\u0441\u043e\u0431\u043e\u0432', { count: type.count })}</div>
            `;
            combinationsGrid.appendChild(comb);
        });
    }
    
    // РџРѕРєР°Р·Р°С‚СЊ РІСЃРµ РєРѕРјР±РёРЅР°С†РёРё РґР»СЏ Р·Р°РґР°РЅРёСЏ 3
    function showAllCombinations() {
        visualComb.innerHTML = '';
        
        // РЎРѕР·РґР°РµРј РІСЃРµ РІРѕР·РјРѕР¶РЅС‹Рµ РїР°СЂС‹ 1 СЃРёРЅРёР№ + 1 РєСЂР°СЃРЅС‹Р№
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
    
    // РџСЂРѕРІРµСЂРєР° РІРІРµРґРµРЅРЅРѕРіРѕ РєРѕР»РёС‡РµСЃС‚РІР° РєРѕРјР±РёРЅР°С†РёР№
    function checkCombination() {
        const userAnswer = parseInt(combinationInput.value);
        const correctAnswer = initialBalls.blue * initialBalls.red;
        
        if (isNaN(userAnswer)) {
            catSpeech.textContent = t('level3.enterNumber', 'РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ С‡РёСЃР»Рѕ!');
            return;
        }
        
        if (userAnswer === correctAnswer) {
            catSpeech.textContent = t(
                'level3.correct',
                'РџСЂР°РІРёР»СЊРЅРѕ! Р”РµР№СЃС‚РІРёС‚РµР»СЊРЅРѕ, СЃСѓС‰РµСЃС‚РІСѓРµС‚ {count} СЃРїРѕСЃРѕР±РѕРІ РІС‹С‚СЏРЅСѓС‚СЊ 1 СЃРёРЅРёР№ Рё 1 РєСЂР°СЃРЅС‹Р№ С€Р°СЂРёРє.',
                { count: correctAnswer }
            );
            
            // РџРѕРєР°Р·С‹РІР°РµРј РІСЃРµ РєРѕРјР±РёРЅР°С†РёРё
            showAllCombinations();
            
            // РћР±РЅРѕРІР»СЏРµРј РїСЂРѕРіСЂРµСЃСЃ С‚РѕР»СЊРєРѕ РµСЃР»Рё Р·Р°РґР°РЅРёРµ РµС‰Рµ РЅРµ Р±С‹Р»Рѕ РІС‹РїРѕР»РЅРµРЅРѕ
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
                updateProgress();
            }
            
            // Р”Р»СЏ РїРѕСЃР»РµРґРЅРµРіРѕ Р·Р°РґР°РЅРёСЏ РЅРµ РїРѕРєР°Р·С‹РІР°РµРј РєРЅРѕРїРєСѓ "РЎР»РµРґСѓСЋС‰РµРµ Р·Р°РґР°РЅРёРµ"
            if (currentTask < totalTasks - 1) {
                nextTaskBtn.disabled = false;
            } else {
                // Р”Р»СЏ РїРѕСЃР»РµРґРЅРµРіРѕ Р·Р°РґР°РЅРёСЏ РїРѕРєР°Р·С‹РІР°РµРј Р·Р°РІРµСЂС€РµРЅРёРµ
                completeLevel();
            }
        } else {
            catSpeech.textContent = t(
                'level3.incorrect',
                'РќРµРІРµСЂРЅРѕ. РџРѕРїСЂРѕР±СѓР№ РµС‰Рµ СЂР°Р·! РџРѕРґСЃРєР°Р·РєР°: СѓРјРЅРѕР¶СЊ РєРѕР»РёС‡РµСЃС‚РІРѕ СЃРёРЅРёС… С€Р°СЂРёРєРѕРІ РЅР° РєРѕР»РёС‡РµСЃС‚РІРѕ РєСЂР°СЃРЅС‹С….'
            );
        }
    }
    
    // Р’С‹С‚СЏРіРёРІР°РЅРёРµ С€Р°СЂРёРєРѕРІ (РґР»СЏ Р·Р°РґР°РЅРёСЏ 1)
    function drawTwoBalls() {
        if (drawnBalls.length >= 2) return;
        
        // РђРЅРёРјР°С†РёСЏ РІС‹С‚СЏРіРёРІР°РЅРёСЏ
        const allBalls = [...urn.querySelectorAll('.ball')];
        const randomIndex = Math.floor(Math.random() * allBalls.length);
        const ball = allBalls[randomIndex];
        
        // РћРїСЂРµРґРµР»СЏРµРј С†РІРµС‚ С€Р°СЂРёРєР°
        const isBlue = ball.classList.contains('blue');
        const ballId = ball.textContent;
        
        // Р”РѕР±Р°РІР»СЏРµРј РІ РІС‹С‚СЏРЅСѓС‚С‹Рµ
        drawnBalls.push({
            id: ballId,
            color: isBlue ? 'blue' : 'red'
        });
        
        // РЈРґР°Р»СЏРµРј РёР· СѓСЂРЅС‹
        ball.classList.add('drawn');
        setTimeout(() => {
            urn.removeChild(ball);
            updateDrawnBalls();
            
            // РћР±РЅРѕРІР»СЏРµРј СЃС‡РµС‚С‡РёРєРё
            if (isBlue) {
                balls.blue--;
            } else {
                balls.red--;
            }
            
            // Р•СЃР»Рё РІС‹С‚СЏРЅСѓР»Рё 2 С€Р°СЂРёРєР°, РїСЂРѕРІРµСЂСЏРµРј СЂРµР·СѓР»СЊС‚Р°С‚
            if (drawnBalls.length === 2) {
                checkTwoBlueResult();
            } else {
                // РњРѕР¶РЅРѕ РІС‹С‚СЏРіРёРІР°С‚СЊ РІС‚РѕСЂРѕР№ С€Р°СЂРёРє
                updateProbabilityDisplay(1);
            }
        }, 500);
    }
    
    // РџСЂРѕРІРµСЂРєР° СЂРµР·СѓР»СЊС‚Р°С‚Р° РґР»СЏ Р·Р°РґР°РЅРёСЏ 1
    function checkTwoBlueResult() {
        const bothBlue = drawnBalls.every(ball => ball.color === 'blue');
        
        if (bothBlue) {
            catSpeech.textContent = t(
                'level3.twoBlueWin',
                'РЈСЂР°! РўС‹ РІС‹С‚СЏРЅСѓР» РґРІР° СЃРёРЅРёС… С€Р°СЂРёРєР° РїРѕРґСЂСЏРґ! РўРµРїРµСЂСЊ С‚С‹ РІРёРґРёС€СЊ, РєР°Рє РІС‹С‡РёСЃР»СЏРµС‚СЃСЏ РІРµСЂРѕСЏС‚РЅРѕСЃС‚СЊ С‚Р°РєРѕРіРѕ СЃРѕР±С‹С‚РёСЏ.'
            );
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
                updateProgress();
            }
            nextTaskBtn.disabled = false;
        } else {
            catSpeech.textContent = t(
                'level3.twoBlueFail',
                'РќРµ РїРѕР»СѓС‡РёР»РѕСЃСЊ РґРІР° СЃРёРЅРёС… РїРѕРґСЂСЏРґ. РџРѕРїСЂРѕР±СѓР№ РµС‰Рµ СЂР°Р·! РџРѕРјРЅРё, РІРµСЂРѕСЏС‚РЅРѕСЃС‚СЊ СЌС‚РѕРіРѕ СЃРѕР±С‹С‚РёСЏ {prob}.',
                { prob: prob1Display.textContent.split(' (')[0] }
            );
        }
        
        updateProbabilityDisplay(1);
    }
    
    // Р’С‹С‚СЏРіРёРІР°РЅРёРµ РїРѕСЃР»Рµ РєСЂР°СЃРЅРѕРіРѕ (РґР»СЏ Р·Р°РґР°РЅРёСЏ 2)
    function drawAfterRed() {
        if (drawnBalls.length >= 1) return;
        
        // РЎРЅР°С‡Р°Р»Р° РІС‹С‚СЏРіРёРІР°РµРј РєСЂР°СЃРЅС‹Р№
        const redBalls = [...urn.querySelectorAll('.ball.red')];
        if (redBalls.length === 0) {
            catSpeech.textContent = t('level3.noRedLeft', 'РљСЂР°СЃРЅС‹С… С€Р°СЂРёРєРѕРІ Р±РѕР»СЊС€Рµ РЅРµС‚! РќР°Р¶РјРё "РќР°С‡Р°С‚СЊ Р·Р°РЅРѕРІРѕ".');
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
            
            // РћР±РЅРѕРІР»СЏРµРј РІРµСЂРѕСЏС‚РЅРѕСЃС‚СЊ
            updateProbabilityDisplay(2);
            
            // РўРµРїРµСЂСЊ РјРѕР¶РЅРѕ РІС‹С‚СЏРЅСѓС‚СЊ РІС‚РѕСЂРѕР№ С€Р°СЂРёРє
            drawAfterRedBtn.textContent = t('level3.drawSecond', 'Р’С‹С‚СЏРЅСѓС‚СЊ РІС‚РѕСЂРѕР№ С€Р°СЂРёРє');
            drawAfterRedBtn.onclick = drawSecondBallAfterRed;
        }, 500);
    }
    
    // Р’С‹С‚СЏРіРёРІР°РЅРёРµ РІС‚РѕСЂРѕРіРѕ С€Р°СЂРёРєР° РїРѕСЃР»Рµ РєСЂР°СЃРЅРѕРіРѕ
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
            
            // РџСЂРѕРІРµСЂСЏРµРј СЂРµР·СѓР»СЊС‚Р°С‚
            checkAfterRedResult(isBlue);
        }, 500);
    }
    
    // РџСЂРѕРІРµСЂРєР° СЂРµР·СѓР»СЊС‚Р°С‚Р° РґР»СЏ Р·Р°РґР°РЅРёСЏ 2
    function checkAfterRedResult(secondIsBlue) {
        if (secondIsBlue) {
            catSpeech.textContent = t('level3.afterRedBlue', 'РўС‹ РІС‹С‚СЏРЅСѓР» СЃРёРЅРёР№ С€Р°СЂРёРє РїРѕСЃР»Рµ РєСЂР°СЃРЅРѕРіРѕ!');
            if (completedTasks <= currentTask) {
                completedTasks = currentTask + 1;
                updateProgress();
            }
            nextTaskBtn.disabled = false;
        } else {
            catSpeech.textContent = t('level3.afterRedRed', 'Р’ СЌС‚РѕС‚ СЂР°Р· РІС‚РѕСЂРѕР№ С€Р°СЂРёРє РѕРєР°Р·Р°Р»СЃСЏ РєСЂР°СЃРЅС‹Рј. РџРѕРїСЂРѕР±СѓР№ РµС‰Рµ СЂР°Р·!');
        }
        
        updateProbabilityDisplay(2);
    }
    
    // РЎР±СЂРѕСЃ СѓСЂРЅС‹
    function resetUrn() {
        balls = JSON.parse(JSON.stringify(initialBalls));
        drawnBalls = [];
        createBalls();
        
        // РЎР±СЂРѕСЃ РєРЅРѕРїРєРё РґР»СЏ Р·Р°РґР°РЅРёСЏ 2
        drawAfterRedBtn.textContent = t('level3.drawAfterRed', 'Р’С‹С‚СЏРЅСѓС‚СЊ РїРѕСЃР»Рµ РєСЂР°СЃРЅРѕРіРѕ');
        drawAfterRedBtn.onclick = drawAfterRed;
    }
    
    // РћР±РЅРѕРІР»РµРЅРёРµ РїСЂРѕРіСЂРµСЃСЃР°
    function updateProgress() {
        const percent = (completedTasks / totalTasks) * 100;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = t(
            'level3.progress',
            '{done}/{total} Р·Р°РґР°С‡ РІС‹РїРѕР»РЅРµРЅРѕ',
            { done: completedTasks, total: totalTasks }
        );
        
        // Р”РѕР±Р°РІР»СЏРµРј Р°РЅРёРјР°С†РёСЋ РїСЂРё РѕР±РЅРѕРІР»РµРЅРёРё РїСЂРѕРіСЂРµСЃСЃР°
        progressFill.style.transition = 'width 0.5s ease-in-out';
    }
    
    // Р—Р°РІРµСЂС€РµРЅРёРµ СѓСЂРѕРІРЅСЏ
    function completeLevel() {
        // РЈР±РµРґРёРјСЃСЏ, С‡С‚Рѕ РїСЂРѕРіСЂРµСЃСЃ РїРѕРєР°Р·С‹РІР°РµС‚ 100%
        completedTasks = totalTasks;
        updateProgress();
        
        catSpeech.textContent = t(
            'level3.complete',
            'РџРѕР·РґСЂР°РІР»СЏСЋ! РўС‹ РѕСЃРІРѕРёР» РєРѕРјР±РёРЅР°С‚РѕСЂРёРєСѓ Рё Р·Р°РІРёСЃРёРјС‹Рµ СЃРѕР±С‹С‚РёСЏ! РўРµРїРµСЂСЊ С‚С‹ РїРѕРЅРёРјР°РµС€СЊ, РєР°Рє РјРµРЅСЏСЋС‚СЃСЏ РІРµСЂРѕСЏС‚РЅРѕСЃС‚Рё.'
        );
        nextTaskBtn.disabled = true;
    }
    
    // РћР±СЂР°Р±РѕС‚С‡РёРєРё СЃРѕР±С‹С‚РёР№
    drawTwoBtn.addEventListener('click', drawTwoBalls);
    reset1Btn.addEventListener('click', resetUrn);
    reset2Btn.addEventListener('click', resetUrn);
    reset3Btn.addEventListener('click', resetUrn);
    checkCombBtn.addEventListener('click', checkCombination);
    
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
        const mapUrl = new URL('index.html?completed=3', window.location.href).toString();
        try {
            if (window.opener && !window.opener.closed && typeof window.opener.completeLevel === 'function') {
                window.opener.completeLevel(3);
                window.close();
                return;
            }
        } catch (e) {
            // Fallback to direct navigation when opener is cross-origin or unavailable.
        }
        window.location.href = mapUrl;
    });

    window.addEventListener('i18n:language-changed', function() {
        generateCombinations();
        updateProgress();
    });
    
    // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ СѓСЂРѕРІРЅСЏ
    init();
});
