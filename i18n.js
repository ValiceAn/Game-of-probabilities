(function () {
    const STORAGE_KEY = 'siteLang';
    const SUPPORTED = ['ru', 'en'];

    const EN = {
        // Common
        'common.backMain': 'Back to Main Menu',
        'common.backMap': 'Back to Map',
        'common.showHint': 'Show hint',
        'common.hideHint': 'Hide hint',

        // Index + tutorial
        'index.title': 'Space Cat: Gravity Races',
        'index.mainCosmic': 'SPACE',
        'index.mainCat': 'CAT',
        'index.subtitle': 'Path of Stellar Probability',
        'index.start': 'Start Game',
        'index.tutorial': 'Tutorial',
        'index.mapTitle': 'Probability Expedition Map',
        'index.l1.title': 'Galaxy Dice',
        'index.l1.desc': 'Learn probability with a space dice!',
        'index.l2.title': 'Coin Barrier',
        'index.l2.desc': 'Pass the barrier using probability!',
        'index.l3.title': 'Ball Roulette',
        'index.l3.desc': 'Learn combinatorics and dependent events!',
        'index.l4.title': 'Cosmic Planet Generator',
        'index.l4.desc': 'Explore probability by scanning planets!',
        'index.l5.title': 'Quantum Star Generator',
        'index.l5.desc': 'Discover the law of large numbers!',
        'index.tutorialTitle': '🌌 Cosmic Probability Handbook 🌠',
        'index.basics.title': '📚 Probability Basics',
        'index.basics.p1': 'Probability is the chance that something happens. It ranges from 0 (never) to 1 (certain).',
        'index.basics.p2': 'Example: probability of heads in a coin toss = 0.5 (50%)',
        'index.basics.formula': 'P(event) = Favorable outcomes / Total possible outcomes',
        'index.basics.tag': '#basics',
        'index.dice.title': '🎲 Dice Probability',
        'index.dice.p1': 'A die has 6 faces. Probability of any specific face = 1/6.',
        'index.dice.p2': 'Probability of an even number: 3/6 = 0.5 (2,4,6)',
        'index.dice.p3': 'Example: What is the probability of rolling a number greater than 4?',
        'index.dice.answer': '<span>Answer:</span> 2/6 = 1/3 (5 and 6)',
        'index.dice.tag': '#dice',
        'index.coins.title': '💲 Coin Tossing',
        'index.coins.p1': 'A coin has 2 sides: heads and tails. Probability of each = 0.5.',
        'index.coins.p2': 'Each toss is independent - previous tosses do not affect the next one!',
        'index.coins.formula': '0.5 × 0.5 = 0.25 (25%)',
        'index.coins.p3': 'Probability of two heads in a row',
        'index.coins.tag': '#coins',
        'index.comb.title': '🔢 Combinatorics',
        'index.comb.p1': 'Studies how many different combinations can be made.',
        'index.comb.p2': 'In an urn: 3 red and 2 blue balls. How many ways to draw 1 red and 1 blue?',
        'index.comb.answer': '<span>Answer:</span> 3 × 2 = 6 ways',
        'index.comb.tag': '#combinations',
        'index.dep.title': '🔗 Dependent Events',
        'index.dep.p1': 'When one event affects another. Example: drawing balls without replacement.',
        'index.dep.p2': 'In an urn: 3 blue and 2 red balls. What is the probability of drawing 2 blue in a row?',
        'index.dep.formula': '1st ball: 3/5<br>2nd ball: 2/4<br>Total: 3/5 × 2/4 = 6/20 = 0.3 (30%)',
        'index.dep.tag': '#dependence',
        'index.law.title': '🌌 Law of Large Numbers',
        'index.law.p1': 'The more trials, the closer results get to theoretical probability.',
        'index.law.p2': 'If you toss a coin 10 times, you may get 7 heads. But with 1000 tosses, heads are near 500.',
        'index.law.tag': '#laws',
        'index.locked': 'This level is still locked! Complete previous levels to unlock it.',
        'index.unlocked': '🔓 Level unlocked!',

        // Level 1
        'level1.title': 'Galaxy Dice | Space Cat',
        'level1.h1': 'Galaxy Dice',
        'level1.subtitle': 'Learn probability with a space dice!',
        'level1.stats': 'Roll Statistics',
        'level1.statsPlaceholder': 'Roll the dice to see statistics!',
        'level1.catIntro': 'Hi! I will help you learn probability. Roll the dice and answer questions!',
        'level1.task1': 'Task 1: Simple Probability',
        'level1.q1': 'What is the probability of rolling number 4?',
        'level1.hint1': 'Hint: A die has 6 faces, and only one has number 4.',
        'level1.task2': 'Task 2: Comparing Probabilities',
        'level1.q2': 'Which is more likely: an even number or a number greater than 3?',
        'level1.opt2a': 'Even number',
        'level1.opt2b': 'Number greater than 3',
        'level1.opt2c': 'Equal',
        'level1.hint2': 'Hint: There are 3 even numbers (2,4,6), and 3 numbers greater than 3 (4,5,6).',
        'level1.task3': 'Task 3: Combined Probability',
        'level1.q3': 'What is the probability of rolling a number less than 3 OR greater than 5?',
        'level1.hint3': 'Hint: Less than 3 is 1 and 2 (2 outcomes), greater than 5 is only 6 (1 outcome). 3 favorable out of 6.',
        'level1.roll': 'Roll Dice',
        'level1.next': 'Next Task',
        'level1.progress': '{done}/{total} tasks completed',
        'level1.tryAgain': 'Try again! Remember how many faces a die has.',
        'level1.rollPhrase1': 'You rolled {value}! How is it related to the task?',
        'level1.rollPhrase2': 'The dice shows {value}. How can that help you answer?',
        'level1.rollPhrase3': 'Wow, {value}! Now think about the task.',
        'level1.rollPhrase4': '{value} is a good number! But how is it linked to probability?',
        'level1.good1': 'Correct! You are great at probability!',
        'level1.good2': 'Right! The space dice is proud of you!',
        'level1.good3': 'Well done! You solved it like a real mathematician!',
        'level1.good4': 'Excellent work! You got the probability principle!',
        'level1.complete': 'Congratulations! You completed "Galaxy Dice"! Now you know the basics of probability!',
        'level1.statsTitleColon': 'Roll Statistics:',
        'level1.totalRolls': 'Total rolls:',
        'level1.even': 'Even:',
        'level1.odd': 'Odd:',
        'level1.gt3': 'Greater than 3:',

        // Level 2
        'level2.title': 'Coin Barrier | Space Cat',
        'level2.h1': 'Coin Barrier',
        'level2.subtitle': 'Pass the barrier using probability!',
        'level2.stats': 'Flip Statistics',
        'level2.total': 'Total flips:',
        'level2.heads': 'Heads:',
        'level2.tails': 'Tails:',
        'level2.goal': 'Goal:',
        'level2.progress': '{heads} heads out of {goal}',
        'level2.catIntro': 'Hi! Flip the coin and collect heads. You need 7 out of 10 flips!',
        'level2.flip': 'Flip Coin',
        'level2.riskTitle': 'Risk Choice!',
        'level2.riskText1': 'You can take a risk! If the next flip is:',
        'level2.riskLi1': 'Heads: you get +3 points (instead of +1)',
        'level2.riskLi2': 'Tails: you lose 1 point',
        'level2.riskText2': 'Continue or stop?',
        'level2.riskBtn': 'Take Risk!',
        'level2.safeBtn': 'Play Safe',
        'level2.montyTitle': 'Monty Hall Paradox',
        'level2.montyIntro': 'Choose the door with the prize! After your choice, I will open one empty door.',
        'level2.continue': 'Continue',
        'level2.catRisk': 'Great! Flip the coin, but remember the risk!',
        'level2.catSafe': 'Safe choice! Flip the coin!',
        'level2.riskWin': 'Hooray! You took a risk and got a +3 bonus!',
        'level2.riskLose': 'Tails! You lose 1 point because of the risk.',
        'level2.goalDone': 'Great! You reached the needed number of heads! Now let’s learn something interesting...',
        'level2.goalFail': 'Oh no! You used all attempts. Try again!',
        'level2.stopOffer': 'Stop! I have an offer...',
        'level2.challengeTitle': 'Think About It'
    };

    Object.assign(EN, {
        'level2.ch1.q': 'What is the probability that the next flip is heads?',
        'level2.ch1.o1': '50%',
        'level2.ch1.o2': '70%',
        'level2.ch1.o3': 'Depends on previous flips',
        'level2.ch1.ex': 'Each coin flip is independent, so the probability of heads is always 50%!',
        'level2.ch2.q': 'If there were 5 heads in a row, what is more likely on the 6th flip?',
        'level2.ch2.o1': 'Heads',
        'level2.ch2.o2': 'Tails',
        'level2.ch2.o3': 'Equal',
        'level2.ch2.ex': 'The coin does not remember previous flips - this is event independence!',
        'level2.ch3.q': 'What is the probability of two heads in a row?',
        'level2.ch3.o1': '25%',
        'level2.ch3.o2': '50%',
        'level2.ch3.o3': '75%',
        'level2.ch3.ex': 'Each heads is 50%, so two in a row is 50% × 50% = 25%!',
        'level2.correctPrefix': 'Correct! ',
        'level2.incorrectPrefix': 'Not quite! ',
        'level2.montyPick': 'Choose the door with the prize! After your choice, I will open one empty door.',
        'level2.montyLine1': 'You chose door {selected}, I opened door {opened}.',
        'level2.montyLine2': 'Do you want to switch to the remaining door or keep your current choice?',
        'level2.switchChoice': 'Switch Choice',
        'level2.stayChoice': 'Keep Choice',
        'level2.changed': 'switched',
        'level2.stayed': 'kept',
        'level2.won': 'won',
        'level2.lost': 'lost',
        'level2.result1': 'You {action} your choice and {result}!',
        'level2.result2': 'The prize was behind door {door}.',
        'level2.result3': 'Monty Hall paradox: switching increases odds from 1/3 to 2/3!',
        'level2.reset': 'Let’s try again! Flip the coin and collect heads.',
        'level2.complete': 'Congratulations! You completed "Coin Barrier"! Now you know more about probability!',

        'level3.title': 'Ball Roulette | Space Cat',
        'level3.h1': 'Ball Roulette',
        'level3.subtitle': 'Learn combinatorics and dependent events!',
        'level3.catIntro': 'Hi! This urn has 4 blue and 3 red balls. Let’s explore probabilities of combinations!',
        'level3.combTitle': 'Possible combinations:',
        'level3.task1': 'Task 1: Draw 2 blue balls',
        'level3.q1': 'Try drawing two blue balls in a row. What is the probability?',
        'level3.prob1html': 'Probability: <span id="prob1">?</span>',
        'level3.task2': 'Task 2: If first ball is red',
        'level3.q2': 'What happens to blue probability if the first ball was red?',
        'level3.prob2html': 'Probability of second blue: <span id="prob2">?</span>',
        'level3.task3': 'Task 3: Different combinations',
        'level3.q3': 'How many ways are there to draw 1 blue and 1 red ball?',
        'level3.placeholder': 'Enter a number',
        'level3.check': 'Check',
        'level3.draw': 'Draw Ball',
        'level3.drawAfterRed': 'Draw after red',
        'level3.drawSecond': 'Draw second ball',
        'level3.reset': 'Start Over',
        'level3.next': 'Next Task',
        'level3.progress': '{done}/{total} tasks completed',
        'level3.type2blue': '2 blue',
        'level3.type2red': '2 red',
        'level3.typeMixed': '1 blue + 1 red',
        'level3.ways': '{count} ways',
        'level3.enterNumber': 'Please enter a number!',
        'level3.correct': 'Correct! There are {count} ways to draw 1 blue and 1 red ball.',
        'level3.incorrect': 'Incorrect. Try again! Hint: multiply blue balls by red balls.',
        'level3.twoBlueWin': 'Great! You drew two blue balls in a row!',
        'level3.twoBlueFail': 'No two blue in a row this time. Try again! Probability is {prob}.',
        'level3.noRedLeft': 'No red balls left! Click "Start Over".',
        'level3.afterRedBlue': 'You drew a blue ball after red!',
        'level3.afterRedRed': 'This time the second ball was red. Try again!',
        'level3.complete': 'Congratulations! You mastered combinatorics and dependent events!',

        'level4.title': 'Cosmic Planet Generator | Space Cat',
        'level4.h1': 'Cosmic Planet Generator',
        'level4.subtitle': 'Explore probability by scanning planets!',
        'level4.scanText': 'SCANNING...',
        'level4.scan': 'Scan',
        'level4.probTitle': 'Probability settings:',
        'level4.greenLabel': 'Green: <span id="green-value">60</span>%',
        'level4.iceLabel': 'Ice: <span id="ice-value">30</span>%',
        'level4.lavaLabel': 'Lava: <span id="lava-value">10</span>%',
        'level4.totalLabel': 'Total: <span id="total-value">100</span>%',
        'level4.stats': 'Scan results:',
        'level4.greenPlural': 'Green:',
        'level4.icePlural': 'Ice:',
        'level4.lavaPlural': 'Lava:',
        'level4.totalScans': 'Total scans: <span id="total-scans">0</span>',
        'level4.task1': 'Task 1: Guess the probability',
        'level4.q1': 'Which planet will appear most often with current settings?',
        'level4.greenOne': 'Green',
        'level4.iceOne': 'Ice',
        'level4.lavaOne': 'Lava',
        'level4.task2': 'Task 2: Predict result',
        'level4.q2': 'If you do 10 scans, how many green planets are expected?',
        'level4.hint2': 'Hint: multiply scans (10) by green probability (60% or 0.6).',
        'level4.task3': 'Task 3: Build your own system',
        'level4.q3': 'Make lava planets appear more often than ice planets!',
        'level4.checkSettings': 'Check my settings',
        'level4.hint3': 'Hint: set lava slider higher than ice slider.',
        'level4.next': 'Next Task',
        'level4.achievements': 'Achievements:',
        'level4.achLavaIcon': 'Lava',
        'level4.achLavaText': 'Heatproof scanner (3 lava in a row)',
        'level4.achIceIcon': 'Ice',
        'level4.achIceText': 'Warning: icing! (5 ice in a row)',
        'level4.catIntro': 'Hi, explorer! Tune probabilities and scan planets.',
        'level4.planetGreenName': 'Green planet',
        'level4.planetGreenEmoji': 'Green',
        'level4.planetGreenDesc': 'Perfect for a base! Water and plants.',
        'level4.planetIceName': 'Ice planet',
        'level4.planetIceEmoji': 'Ice',
        'level4.planetIceDesc': 'Cold, but rich in minerals.',
        'level4.planetLavaName': 'Lava planet',
        'level4.planetLavaEmoji': 'Lava',
        'level4.planetLavaDesc': 'Dangerous, but full of rare crystals!',
        'level4.tryAgain': 'Try again! Check the probabilities.',
        'level4.sumLong': 'Probability total must be exactly 100%! Adjust scanner settings.',
        'level4.sumShort': 'Probability total must be exactly 100%!',
        'level4.scanPhrase1': 'Found {planet}! {desc}',
        'level4.scanPhrase2': 'Scan result: {planetName}!',
        'level4.scanPhrase3': 'Wow! It is {planet}!',
        'level4.good1': 'Correct! Great probability skills!',
        'level4.good2': 'Right! The scanner is proud of you!',
        'level4.good3': 'Well done! Real scientist move!',
        'level4.good4': 'Excellent! You got the probability idea!',
        'level4.complete': 'Congratulations! You completed "Cosmic Planet Generator"!',
        'level4.achLava': 'Amazing! 3 lava planets in a row! Heatproof scanner unlocked!',
        'level4.achIce': 'Careful! 5 ice planets in a row! Ship icing warning!',
        'level4.settingsOk': 'Great! Now lava planets appear more often than ice planets!',
        'level4.settingsRetry': 'Try again! Set lava value greater than ice value.',

        'level5.title': 'Quantum Star Generator | Space Cat',
        'level5.h1': 'Quantum Star Generator',
        'level5.subtitle': 'Discover the law of large numbers!',
        'level5.total': 'Total stars:',
        'level5.red': 'Red giants:',
        'level5.blue': 'Blue supergiants:',
        'level5.black': 'Black holes:',
        'level5.generate': 'Start Collider',
        'level5.reset': 'Reset',
        'level5.task1': 'Task 1: First 20 stars',
        'level5.q1': 'Create 20 stars. How many black holes did you get?',
        'level5.task2': 'Task 2: 100 stars',
        'level5.q2': 'Now distribution should be closer to 60/30/10. Check it!',
        'level5.task3': 'Task 3: Your hypothesis',
        'level5.q3': 'Guess how many black holes there will be after 50 stars:',
        'level5.placeholder': 'Your prediction',
        'level5.check': 'Check',
        'level5.catIntro': 'Hi! This collider creates stars with different probabilities.',
        'level5.msg20': 'Great! You created 20 stars. Black holes: {black}. Deviations are normal.',
        'level5.msg100': 'Awesome! After 100 stars: {red}% red, {blue}% blue, {black}% black holes.',
        'level5.msg150': 'After 150 stars, black holes: {black}. Expected around {expected}.',
        'level5.enter': 'Please enter a number!',
        'level5.guessGood': 'Great guess! After 50 stars it is usually around {expected} black holes.',
        'level5.guessOff': 'Interesting guess! Usually around {expected}. Generate 50 stars and check!',
        'level5.labReset': 'Lab cleared. You can start over!',
        'level5.complete': 'You proved it: even in quantum chaos there is order!'
    });

    const STATIC = {
        'index.html': [
            ['text', 'title', 'index.title'],
            ['text', '.main-title .cosmic', 'index.mainCosmic'],
            ['text', '.main-title .cat', 'index.mainCat'],
            ['text', '#start-menu .subtitle span', 'index.subtitle'],
            ['text', '#start-btn .btn-text', 'index.start'],
            ['text', '#tutorial-btn .btn-text', 'index.tutorial'],
            ['text', '#level-select .level-title > span', 'index.mapTitle'],
            ['text', '.level-planet[data-level="1"] h3', 'index.l1.title'],
            ['text', '.level-planet[data-level="1"] p', 'index.l1.desc'],
            ['text', '.level-planet[data-level="2"] h3', 'index.l2.title'],
            ['text', '.level-planet[data-level="2"] p', 'index.l2.desc'],
            ['text', '.level-planet[data-level="3"] h3', 'index.l3.title'],
            ['text', '.level-planet[data-level="3"] p', 'index.l3.desc'],
            ['text', '.level-planet[data-level="4"] h3', 'index.l4.title'],
            ['text', '.level-planet[data-level="4"] p', 'index.l4.desc'],
            ['text', '.level-planet[data-level="5"] h3', 'index.l5.title'],
            ['text', '.level-planet[data-level="5"] p', 'index.l5.desc'],
            ['text', '#back-to-menu .btn-text', 'common.backMain'],
            ['text', '#tutorial-menu .cosmic-title span', 'index.tutorialTitle'],
            ['text', '#basics h2', 'index.basics.title'],
            ['text', '#basics .section-content > p', 'index.basics.p1'],
            ['text', '#basics .cosmic-example > p', 'index.basics.p2'],
            ['text', '#basics .cosmic-formula', 'index.basics.formula'],
            ['text', '#basics .cosmic-tag', 'index.basics.tag'],
            ['text', '#dice h2', 'index.dice.title'],
            ['text', '#dice .section-content > p:nth-of-type(1)', 'index.dice.p1'],
            ['text', '#dice .section-content > p:nth-of-type(2)', 'index.dice.p2'],
            ['text', '#dice .cosmic-example > p', 'index.dice.p3'],
            ['html', '#dice .cosmic-answer', 'index.dice.answer'],
            ['text', '#dice .cosmic-tag', 'index.dice.tag'],
            ['text', '#coins h2', 'index.coins.title'],
            ['text', '#coins .section-content > p:nth-of-type(1)', 'index.coins.p1'],
            ['text', '#coins .section-content > p:nth-of-type(2)', 'index.coins.p2'],
            ['text', '#coins .cosmic-formula', 'index.coins.formula'],
            ['text', '#coins .cosmic-example > p', 'index.coins.p3'],
            ['text', '#coins .cosmic-tag', 'index.coins.tag'],
            ['text', '#combinations h2', 'index.comb.title'],
            ['text', '#combinations .section-content > p', 'index.comb.p1'],
            ['text', '#combinations .cosmic-example > p', 'index.comb.p2'],
            ['html', '#combinations .cosmic-answer', 'index.comb.answer'],
            ['text', '#combinations .cosmic-tag', 'index.comb.tag'],
            ['text', '#dependent h2', 'index.dep.title'],
            ['text', '#dependent .section-content > p', 'index.dep.p1'],
            ['text', '#dependent .cosmic-example > p', 'index.dep.p2'],
            ['html', '#dependent .cosmic-formula', 'index.dep.formula'],
            ['text', '#dependent .cosmic-tag', 'index.dep.tag'],
            ['text', '#large-numbers h2', 'index.law.title'],
            ['text', '#large-numbers .section-content > p', 'index.law.p1'],
            ['text', '#large-numbers .cosmic-example > p', 'index.law.p2'],
            ['text', '#large-numbers .cosmic-tag', 'index.law.tag'],
            ['text', '#back-to-menu-from-tutorial .btn-text', 'common.backMain']
        ],
        'level1.html': [
            ['text', 'title', 'level1.title'], ['text', '.level-header h1', 'level1.h1'], ['text', '.level-header .subtitle', 'level1.subtitle'],
            ['text', '#stats-container h3', 'level1.stats'], ['text', '#stats-container .stats-placeholder', 'level1.statsPlaceholder'], ['text', '#cat-speech', 'level1.catIntro'],
            ['text', '#task1 h3', 'level1.task1'], ['text', '#task1 > p', 'level1.q1'], ['text', '#task1 .hint', 'level1.hint1'],
            ['text', '#task2 h3', 'level1.task2'], ['text', '#task2 > p', 'level1.q2'], ['text', '#task2 .option-btn:nth-child(1)', 'level1.opt2a'], ['text', '#task2 .option-btn:nth-child(2)', 'level1.opt2b'], ['text', '#task2 .option-btn:nth-child(3)', 'level1.opt2c'], ['text', '#task2 .hint', 'level1.hint2'],
            ['text', '#task3 h3', 'level1.task3'], ['text', '#task3 > p', 'level1.q3'], ['text', '#task3 .hint', 'level1.hint3'],
            ['all', '.hint-btn', 'common.showHint'],
            ['text', '#roll-dice .btn-text', 'level1.roll'], ['text', '#next-task .btn-text', 'level1.next'], ['text', '#back-to-map .btn-text', 'common.backMap'],
            ['text', '.progress-text', 'level1.progress']
        ]
    };

    Object.assign(STATIC, {
        'level2.html': [
            ['text', 'title', 'level2.title'], ['text', '.level-header h1', 'level2.h1'], ['text', '.level-header .subtitle', 'level2.subtitle'],
            ['text', '.stats-panel h3', 'level2.stats'], ['text', '.stats-panel .stat-item:nth-child(2) > span:first-child', 'level2.total'], ['text', '.stats-panel .stat-item:nth-child(3) > span:first-child', 'level2.heads'], ['text', '.stats-panel .stat-item:nth-child(4) > span:first-child', 'level2.tails'], ['text', '.stats-panel .stat-item:nth-child(5) > span:first-child', 'level2.goal'], ['text', '#progress-text', 'level2.progress'],
            ['text', '#cat-speech', 'level2.catIntro'], ['text', '#flip-coin .btn-text', 'level2.flip'], ['text', '#back-to-map .btn-text', 'common.backMap'],
            ['text', '#risk-modal h3', 'level2.riskTitle'], ['text', '#risk-modal .modal-content > p:nth-of-type(1)', 'level2.riskText1'], ['text', '#risk-modal li:nth-child(1)', 'level2.riskLi1'], ['text', '#risk-modal li:nth-child(2)', 'level2.riskLi2'], ['text', '#risk-modal .modal-content > p:nth-of-type(2)', 'level2.riskText2'], ['text', '#take-risk', 'level2.riskBtn'], ['text', '#play-safe', 'level2.safeBtn'],
            ['text', '#monty-hall-modal h3', 'level2.montyTitle'], ['text', '#monty-hall-modal .modal-content > p', 'level2.montyIntro'], ['text', '#monty-continue', 'level2.continue']
        ],
        'level3.html': [
            ['text', 'title', 'level3.title'], ['text', '.level-header h1', 'level3.h1'], ['text', '.level-header .subtitle', 'level3.subtitle'], ['text', '#cat-speech', 'level3.catIntro'],
            ['text', '#combinations h3', 'level3.combTitle'], ['text', '#task1 h3', 'level3.task1'], ['text', '#task1 > p', 'level3.q1'], ['html', '#task1 .probability-display', 'level3.prob1html'],
            ['text', '#task2 h3', 'level3.task2'], ['text', '#task2 > p', 'level3.q2'], ['html', '#task2 .probability-display', 'level3.prob2html'],
            ['text', '#task3 h3', 'level3.task3'], ['text', '#task3 > p', 'level3.q3'], ['attr', '#combination-input', 'placeholder', 'level3.placeholder'], ['text', '#check-combination', 'level3.check'],
            ['text', '#draw-two', 'level3.draw'], ['text', '#draw-after-red', 'level3.drawAfterRed'], ['text', '#reset1', 'level3.reset'], ['text', '#reset2', 'level3.reset'], ['text', '#reset3', 'level3.reset'],
            ['text', '#next-task .btn-text', 'level3.next'], ['text', '#back-to-map .btn-text', 'common.backMap'], ['text', '.progress-text', 'level3.progress']
        ],
        'level4.html': [
            ['text', 'title', 'level4.title'], ['text', '.level-header h1', 'level4.h1'], ['text', '.level-header .subtitle', 'level4.subtitle'], ['text', '.scan-text', 'level4.scanText'], ['text', '#scan-btn .btn-text', 'level4.scan'],
            ['text', '.probability-controls h3', 'level4.probTitle'], ['html', 'label[for=\"green-prob\"]', 'level4.greenLabel'], ['html', 'label[for=\"ice-prob\"]', 'level4.iceLabel'], ['html', 'label[for=\"lava-prob\"]', 'level4.lavaLabel'], ['html', '.probability-total', 'level4.totalLabel'],
            ['text', '.stats-panel h3', 'level4.stats'], ['text', '.green-planet .stat-label', 'level4.greenPlural'], ['text', '.ice-planet .stat-label', 'level4.icePlural'], ['text', '.lava-planet .stat-label', 'level4.lavaPlural'], ['html', '.total-scans', 'level4.totalScans'],
            ['text', '#task1 h3', 'level4.task1'], ['text', '#task1 > p', 'level4.q1'], ['text', '#task1 .option-btn:nth-child(1)', 'level4.greenOne'], ['text', '#task1 .option-btn:nth-child(2)', 'level4.iceOne'], ['text', '#task1 .option-btn:nth-child(3)', 'level4.lavaOne'],
            ['text', '#task2 h3', 'level4.task2'], ['text', '#task2 > p', 'level4.q2'], ['text', '#task2 .hint', 'level4.hint2'], ['text', '#task3 h3', 'level4.task3'], ['text', '#task3 > p', 'level4.q3'], ['text', '#check-settings-btn', 'level4.checkSettings'], ['text', '#task3 .hint', 'level4.hint3'],
            ['all', '.hint-btn', 'common.showHint'], ['text', '#next-task .btn-text', 'level4.next'], ['text', '#back-to-map .btn-text', 'common.backMap'],
            ['text', '#achievements h3', 'level4.achievements'], ['text', '#lava-streak .achievement-icon', 'level4.achLavaIcon'], ['text', '#lava-streak .achievement-text', 'level4.achLavaText'], ['text', '#ice-warning .achievement-icon', 'level4.achIceIcon'], ['text', '#ice-warning .achievement-text', 'level4.achIceText'], ['text', '#cat-speech', 'level4.catIntro']
        ],
        'level5.html': [
            ['text', 'title', 'level5.title'], ['text', '.level-header h1', 'level5.h1'], ['text', '.level-header .subtitle', 'level5.subtitle'],
            ['text', '.stats-container .stat:nth-child(1) .stat-label', 'level5.total'], ['text', '.stats-container .stat:nth-child(2) .stat-label', 'level5.red'], ['text', '.stats-container .stat:nth-child(3) .stat-label', 'level5.blue'], ['text', '.stats-container .stat:nth-child(4) .stat-label', 'level5.black'],
            ['text', '#generate-stars .btn-text', 'level5.generate'], ['text', '#reset-lab .btn-text', 'level5.reset'], ['text', '#back-to-map .btn-text', 'common.backMap'],
            ['text', '#task1 h3', 'level5.task1'], ['text', '#task1 > p', 'level5.q1'], ['text', '#task2 h3', 'level5.task2'], ['text', '#task2 > p', 'level5.q2'], ['text', '#task3 h3', 'level5.task3'], ['text', '#task3 > p', 'level5.q3'], ['attr', '#hypothesis-input', 'placeholder', 'level5.placeholder'], ['text', '#check-hypothesis', 'level5.check'], ['text', '#cat-speech', 'level5.catIntro']
        ]
    });

    const STATIC_PARAMS = {
        'level1.progress': { done: 0, total: 3 },
        'level2.progress': { heads: 0, goal: 7 },
        'level3.progress': { done: 0, total: 3 }
    };

    function getPage() {
        return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    }

    function format(template, params = {}) {
        return String(template).replace(/\{(\w+)\}/g, (_, key) => (
            Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : `{${key}}`
        ));
    }

    function getLang() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED.includes(saved) ? saved : 'ru';
    }

    let currentLang = getLang();

    function t(key, fallback = key, params = {}) {
        const source = currentLang === 'en' ? EN : null;
        return format(source && source[key] ? source[key] : fallback, params);
    }

    function applyStatic() {
        if (currentLang !== 'en') {
            document.documentElement.lang = 'ru';
            return;
        }

        const list = STATIC[getPage()] || [];
        list.forEach((item) => {
            const [type, selector, a, b] = item;

            if (type === 'all') {
                document.querySelectorAll(selector).forEach((el) => {
                    const value = EN[a] ? format(EN[a], STATIC_PARAMS[a] || {}) : el.textContent;
                    el.textContent = value;
                });
                return;
            }

            const el = document.querySelector(selector);
            if (!el) return;

            if (type === 'text') {
                const value = EN[a] ? format(EN[a], STATIC_PARAMS[a] || {}) : el.textContent;
                el.textContent = value;
            } else if (type === 'html') {
                const value = EN[a] ? format(EN[a], STATIC_PARAMS[a] || {}) : el.innerHTML;
                el.innerHTML = value;
            } else if (type === 'attr') {
                const value = EN[b] ? format(EN[b], STATIC_PARAMS[b] || {}) : (el.getAttribute(a) || '');
                el.setAttribute(a, value);
            }
        });

        document.documentElement.lang = 'en';
    }

    function addToggle() {
        const btn = document.createElement('button');
        btn.id = 'lang-switch-btn';
        btn.className = 'lang-switch-btn';
        btn.type = 'button';
        btn.textContent = currentLang === 'ru' ? 'English' : 'Русский';
        btn.addEventListener('click', () => {
            currentLang = currentLang === 'ru' ? 'en' : 'ru';
            localStorage.setItem(STORAGE_KEY, currentLang);
            window.location.reload();
        });
        document.body.appendChild(btn);
    }

    function init() {
        applyStatic();
        addToggle();
    }

    window.I18N = { t, get lang() { return currentLang; } };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
