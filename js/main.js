/**
 * CyberExterminator: FUMIGADOR
 * Script Principal: Menú de inicio, cinemática de introducción con alerta roja y despliegue,
 * 3 niveles del Modo Historia (HTML Fácil, CSS Medio, Python Avanzado),
 * y cinemática del gran final exterminando al último bicho con letrero de felicitaciones.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Lienzo de Batalla
    const battle = new BattleCanvas('battleCanvas');

    // Elementos del HUD y Barras Duales
    const correctScoreText = document.getElementById('correctScoreText');
    const incorrectScoreText = document.getElementById('incorrectScoreText');
    const correctMeter = document.getElementById('correctMeter');
    const incorrectMeter = document.getElementById('incorrectMeter');

    const scoreValEl = document.getElementById('scoreVal');
    const streakValEl = document.getElementById('streakVal');
    const levelDisplayEl = document.getElementById('levelDisplay');
    const serverNameEl = document.getElementById('serverName');

    // Elementos del IDE
    const catBadgeEl = document.getElementById('catBadge');
    const diffBadgeEl = document.getElementById('diffBadge');
    const qIndexBadgeEl = document.getElementById('qIndexBadge');
    const questionPromptEl = document.getElementById('questionPrompt');
    const codeBoxEl = document.getElementById('codeBox');
    const optionsGridEl = document.getElementById('optionsGrid');
    const terminalLogsEl = document.getElementById('terminalLogs');

    const tabDotEl = document.getElementById('tabDot');
    const tabFilenameEl = document.getElementById('tabFilename');

    // Modales y Overlays de Cinemática
    const mainMenuOverlay = document.getElementById('mainMenuOverlay');
    const introCinematicOverlay = document.getElementById('introCinematicOverlay');
    const grandFinaleOverlay = document.getElementById('grandFinaleOverlay');
    const modalVictory = document.getElementById('modalVictory');
    const modalDefeat = document.getElementById('modalDefeat');
    const modalHelp = document.getElementById('modalHelp');
    const modalRaceResult = document.getElementById('modalRaceResult');

    // Botones de Menú y Cinemáticas
    const btnMenuStory = document.getElementById('btnMenuStory');
    const btnMenuRace = document.getElementById('btnMenuRace');
    const btnMenuHowToPlay = document.getElementById('btnMenuHowToPlay');
    const introDeployPrompt = document.getElementById('introDeployPrompt');
    const btnReturnMenuFinal = document.getElementById('btnReturnMenuFinal');
    const btnHomeMenu = document.getElementById('btnHomeMenu');

    // Elementos de Temporizador y Barra de Carrera
    const raceTimerBadge = document.getElementById('raceTimerBadge');
    const raceTimerVal = document.getElementById('raceTimerVal');
    const raceCountdownBarContainer = document.getElementById('raceCountdownBarContainer');
    const raceCountdownBar = document.getElementById('raceCountdownBar');

    // Elementos del Modal de Carrera
    const raceResultIcon = document.getElementById('raceResultIcon');
    const raceResultTitle = document.getElementById('raceResultTitle');
    const raceResultSubtitle = document.getElementById('raceResultSubtitle');
    const raceCompareCorrectRow = document.getElementById('raceCompareCorrectRow');
    const raceCompareIncorrectRow = document.getElementById('raceCompareIncorrectRow');
    const raceModalCorrectVal = document.getElementById('raceModalCorrectVal');
    const raceModalCorrectMeter = document.getElementById('raceModalCorrectMeter');
    const raceModalIncorrectVal = document.getElementById('raceModalIncorrectVal');
    const raceModalIncorrectMeter = document.getElementById('raceModalIncorrectMeter');
    const raceScoreVal = document.getElementById('raceScoreVal');
    const raceOutcomeBadge = document.getElementById('raceOutcomeBadge');
    const btnRetryRace = document.getElementById('btnRetryRace');
    const btnExitToMenuRace = document.getElementById('btnExitToMenuRace');

    // Botones de Modales de Nivel
    const btnNextLevel = document.getElementById('btnNextLevel');
    const btnExitToMenuVic = document.getElementById('btnExitToMenuVic');
    const btnRetry = document.getElementById('btnRetry');
    const btnExitToMenuDef = document.getElementById('btnExitToMenuDef');
    const btnSoundToggle = document.getElementById('btnSoundToggle');
    const btnHelp = document.getElementById('btnHelp');
    const btnCloseHelp = document.getElementById('btnCloseHelp');

    // Stats en modales
    const vicScoreEl = document.getElementById('vicScore');
    const vicBugsEl = document.getElementById('vicBugs');
    const vicAccuracyEl = document.getElementById('vicAccuracy');
    const defScoreEl = document.getElementById('defScore');
    const defErrorsEl = document.getElementById('defErrors');
    const finScoreEl = document.getElementById('finScore');
    const finBugsEl = document.getElementById('finBugs');

    // Configuración exacta de los 3 Niveles del Modo Historia
    const QUESTIONS_PER_LEVEL = 5;
    const STORY_LEVELS = [
        {
            name: "NIVEL 1: HTML (FÁCIL)",
            category: "HTML",
            difficulty: "Fácil",
            file: "index.html",
            dotClass: "dot-html",
            bugs: 3
        },
        {
            name: "NIVEL 2: CSS (MEDIO)",
            category: "CSS",
            difficulty: "Media",
            file: "styles.css",
            dotClass: "dot-css",
            bugs: 4
        },
        {
            name: "NIVEL 3: PYTHON (AVANZADO)",
            category: "Python",
            difficulty: "Avanzada",
            file: "core_antivirus.py",
            dotClass: "dot-py",
            bugs: 5
        }
    ];

    // Estado global del juego
    let state = {
        currentScreen: 'MAIN_MENU', // 'MAIN_MENU', 'INTRO_CINEMATIC', 'PLAYING', 'FINALE'
        gameMode: 'STORY', // 'STORY' | 'RACE'
        levelIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        answeredCount: 0,
        totalQuestions: QUESTIONS_PER_LEVEL,
        score: 0,
        streak: 0,
        totalBugsKilled: 0,
        questions: [],
        currentQIndex: 0,
        isTransitioning: false,
        isGameOver: false,
        transitionTimeout: null,
        awaitingDeployKey: false,
        raceTimeLeft: 30,
        raceTimerInterval: null,
        raceQuestionsPool: [],
        lastTickSecond: 30
    };

    /**
     * Muestra la pantalla de Menú Principal
     */
    function showMainMenu() {
        state.currentScreen = 'MAIN_MENU';
        state.isGameOver = true;
        state.awaitingDeployKey = false;

        if (state.transitionTimeout) {
            clearTimeout(state.transitionTimeout);
            state.transitionTimeout = null;
        }

        if (state.raceTimerInterval) {
            clearInterval(state.raceTimerInterval);
            state.raceTimerInterval = null;
        }

        // Ocultar widgets del modo carrera
        raceTimerBadge.style.display = 'none';
        raceTimerBadge.classList.remove('race-timer-critical');
        raceCountdownBarContainer.style.display = 'none';

        // Mostrar Menú Principal y ocultar otros overlays
        mainMenuOverlay.style.display = 'flex';
        introCinematicOverlay.style.display = 'none';
        grandFinaleOverlay.classList.remove('active');
        modalVictory.classList.remove('active');
        modalDefeat.classList.remove('active');
        modalHelp.classList.remove('active');
        modalRaceResult.classList.remove('active');

        // Reset visual sutil
        battle.reset(3);
        levelDisplayEl.textContent = "FUMIGADOR::MENÚ PRINCIPAL";
        serverNameEl.textContent = "SRV-MAIN::ESPERA";
        serverNameEl.style.color = "var(--neon-cyan)";
    }

    /**
     * Inicia la cinemática de alerta antes del Nivel 1:
     * Alerta roja, invasión de bichos, esperando que el programador presione una tecla
     */
    function startIntroCinematic() {
        state.gameMode = 'STORY';
        state.currentScreen = 'INTRO_CINEMATIC';
        state.levelIndex = 0;
        state.score = 0;
        state.streak = 0;
        state.totalBugsKilled = 0;

        // Ocultar widgets de carrera
        raceTimerBadge.style.display = 'none';
        raceCountdownBarContainer.style.display = 'none';

        mainMenuOverlay.style.display = 'none';
        modalHelp.classList.remove('active');
        introCinematicOverlay.style.display = 'flex';

        // Sirena de alerta
        if (window.soundEngine) {
            window.soundEngine.playIntroSiren();
        }

        addTerminalLog(`[¡ALERTA MÁXIMA!] Invasión de bichos rojos detectada en el puerto de memoria.`, 'log-alert');
        addTerminalLog(`[PROGRAMADOR] Presiona cualquier tecla para desplegar al fumigador...`, 'log-sys');

        // Animar la invasión de bichos en el lienzo
        battle.playIntroInvasion();

        // Bandera para escuchar la tecla de despliegue
        state.awaitingDeployKey = true;
    }

    /**
     * El programador pulsa la tecla: el fumigador se despliega y comienza el juego
     */
    function triggerFumigadorDeploy() {
        if (!state.awaitingDeployKey) return;
        state.awaitingDeployKey = false;

        // Ocultar overlay de alerta
        introCinematicOverlay.style.display = 'none';

        addTerminalLog(`[CONEXIÓN] Tecla activada. Desplegando al Fumigador en la placa base...`, 'log-success');

        // Desplegar al fumigador con rayo de teletransporte
        battle.deployFumigador(() => {
            startLevel(0);
        });
    }

    /**
     * Iniciar un nivel del modo historia
     */
    function startLevel(lvlIndex) {
        if (state.transitionTimeout) {
            clearTimeout(state.transitionTimeout);
            state.transitionTimeout = null;
        }

        if (state.raceTimerInterval) {
            clearInterval(state.raceTimerInterval);
            state.raceTimerInterval = null;
        }

        state.gameMode = 'STORY';
        state.currentScreen = 'PLAYING';
        state.levelIndex = lvlIndex;
        const lvl = STORY_LEVELS[state.levelIndex];

        // Ocultar widgets de carrera
        raceTimerBadge.style.display = 'none';
        raceCountdownBarContainer.style.display = 'none';

        levelDisplayEl.textContent = lvl.name;
        tabFilenameEl.textContent = lvl.file;
        tabDotEl.className = `tab-dot ${lvl.dotClass}`;

        state.correctCount = 0;
        state.incorrectCount = 0;
        state.answeredCount = 0;
        state.currentQIndex = 0;
        state.isTransitioning = false;
        state.isGameOver = false;

        // Cargar preguntas filtradas por categoría y dificultad
        if (window.getQuestionsForLevel) {
            state.questions = window.getQuestionsForLevel(lvl.category, lvl.difficulty, QUESTIONS_PER_LEVEL);
        } else {
            let pool = window.PROGRAMMING_QUESTIONS || [];
            state.questions = pool.filter(q => q.category === lvl.category && q.difficulty === lvl.difficulty)
                                  .sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_LEVEL);
        }

        state.totalQuestions = state.questions.length;

        // Reinicio limpio del lienzo y bichos
        battle.reset(lvl.bugs);

        updateDualBars();
        updateHUD();

        // Ocultar modales
        mainMenuOverlay.style.display = 'none';
        modalHelp.classList.remove('active');
        modalVictory.classList.remove('active');
        modalDefeat.classList.remove('active');
        modalRaceResult.classList.remove('active');
        grandFinaleOverlay.classList.remove('active');

        addTerminalLog(`[FASE] Iniciando ${lvl.name}. Objetivo: 5 preguntas de código.`, 'log-sys');
        loadQuestion(state.questions[state.currentQIndex]);
    }

    /**
     * INICIAR MODO CARRERA:
     * Carrera contrarreloj de 30 segundos con preguntas aleatorias de HTML, CSS y Python.
     */
    function startRaceMode() {
        if (state.transitionTimeout) {
            clearTimeout(state.transitionTimeout);
            state.transitionTimeout = null;
        }
        if (state.raceTimerInterval) {
            clearInterval(state.raceTimerInterval);
            state.raceTimerInterval = null;
        }

        state.gameMode = 'RACE';
        state.currentScreen = 'PLAYING';
        state.levelIndex = 0;
        state.correctCount = 0;
        state.incorrectCount = 0;
        state.answeredCount = 0;
        state.score = 0;
        state.streak = 0;
        state.totalBugsKilled = 0;
        state.currentQIndex = 0;
        state.isTransitioning = false;
        state.isGameOver = false;
        state.raceTimeLeft = 30;
        state.lastTickSecond = 30;

        // Ocultar overlays y modales
        mainMenuOverlay.style.display = 'none';
        introCinematicOverlay.style.display = 'none';
        grandFinaleOverlay.classList.remove('active');
        modalVictory.classList.remove('active');
        modalDefeat.classList.remove('active');
        modalHelp.classList.remove('active');
        modalRaceResult.classList.remove('active');

        // Activar widgets de temporizador en pantalla
        raceTimerBadge.style.display = 'flex';
        raceTimerBadge.classList.remove('race-timer-critical');
        raceTimerVal.textContent = '30s';
        raceCountdownBarContainer.style.display = 'block';
        raceCountdownBar.style.width = '100%';

        levelDisplayEl.textContent = 'MODO CARRERA: CONTRARRELOJ (30s)';
        serverNameEl.textContent = 'SRV-MAIN::CARRERA';
        serverNameEl.style.color = 'var(--neon-yellow)';

        // Sonido de inicio de carrera
        if (window.soundEngine) {
            window.soundEngine.playRaceStart();
        }

        // Reinicio del lienzo para la carrera
        battle.resetForRace(4);

        // Obtener preguntas mezcladas aleatoriamente de HTML, CSS y Python
        if (window.getRandomRaceQuestions) {
            state.raceQuestionsPool = window.getRandomRaceQuestions();
        } else {
            state.raceQuestionsPool = [...(window.PROGRAMMING_QUESTIONS || [])].sort(() => Math.random() - 0.5);
        }
        state.questions = state.raceQuestionsPool;
        state.totalQuestions = state.questions.length;

        updateDualBars();
        updateHUD();

        addTerminalLog(`[MODO CARRERA] ¡Comenzó la carrera contrarreloj de 30 segundos!`, 'log-warn');
        addTerminalLog(`[DESAFÍO] Preguntas al azar de HTML, CSS y Python. ¡Demuestra tu velocidad!`, 'log-sys');

        loadQuestion(state.questions[state.currentQIndex]);

        // Temporizador de 30 segundos
        const startTime = Date.now();
        const DURATION_MS = 30 * 1000;

        state.raceTimerInterval = setInterval(() => {
            if (state.isGameOver || state.gameMode !== 'RACE') {
                clearInterval(state.raceTimerInterval);
                state.raceTimerInterval = null;
                return;
            }

            const elapsed = Date.now() - startTime;
            const remainingMs = Math.max(0, DURATION_MS - elapsed);
            state.raceTimeLeft = remainingMs / 1000;
            battle.raceTimeLeft = state.raceTimeLeft;

            const wholeSeconds = Math.ceil(state.raceTimeLeft);
            raceTimerVal.textContent = `${wholeSeconds}s`;

            const pctLeft = (remainingMs / DURATION_MS) * 100;
            raceCountdownBar.style.width = `${pctLeft}%`;

            // Alerta visual cuando quedan 10 segundos o menos
            if (state.raceTimeLeft <= 10) {
                raceTimerBadge.classList.add('race-timer-critical');
            } else {
                raceTimerBadge.classList.remove('race-timer-critical');
            }

            // Sonido de tick en los últimos 5 segundos
            if (wholeSeconds <= 5 && wholeSeconds > 0 && wholeSeconds !== state.lastTickSecond) {
                state.lastTickSecond = wholeSeconds;
                if (window.soundEngine) {
                    window.soundEngine.playRaceCountdownTick(wholeSeconds <= 2);
                }
            }

            // Cuando el tiempo de 30 segundos llega a su fin
            if (remainingMs <= 0) {
                clearInterval(state.raceTimerInterval);
                state.raceTimerInterval = null;
                state.raceTimeLeft = 0;
                battle.raceTimeLeft = 0;
                raceTimerVal.textContent = '0s';
                raceCountdownBar.style.width = '0%';
                finishRaceMode();
            }
        }, 50);
    }

    /**
     * FINALIZAR MODO CARRERA:
     * Al agotarse los 30 segundos, se evalúan las dos barras:
     * - Si la barra de respuestas malas es la más alta, el jugador pierde.
     * - Si la barra de respuestas buenas tiene más, el jugador gana.
     */
    function finishRaceMode() {
        if (state.isGameOver) return;
        state.isGameOver = true;
        state.isTransitioning = true;

        if (state.transitionTimeout) {
            clearTimeout(state.transitionTimeout);
            state.transitionTimeout = null;
        }

        // Desactivar botones de opciones
        const buttons = optionsGridEl.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);

        // Sonido de tiempo agotado
        if (window.soundEngine) {
            window.soundEngine.playTimeUp();
        }

        addTerminalLog(`[¡TIEMPO AGOTADO!] Finalizaron los 30 segundos de carrera.`, 'log-alert');
        addTerminalLog(`[EVALUACIÓN] Verificando barras de respuestas buenas vs respuestas malas...`, 'log-sys');

        const correct = state.correctCount;
        const incorrect = state.incorrectCount;
        const total = correct + incorrect;

        // Regla: si la barra de respuestas buenas tiene más -> gana el jugador
        // Si la de respuestas malas es la más alta (o igualan) -> pierde el jugador
        const playerWon = (correct > incorrect);

        let correctPercent = 0;
        let incorrectPercent = 0;
        if (total > 0) {
            correctPercent = Math.round((correct / total) * 100);
            incorrectPercent = 100 - correctPercent;
        }

        // Actualizar datos del modal de resultado
        raceModalCorrectVal.textContent = `${correctPercent}% (${correct} buenas)`;
        raceModalCorrectMeter.style.width = `${correctPercent}%`;
        raceModalIncorrectVal.textContent = `${incorrectPercent}% (${incorrect} malas)`;
        raceModalIncorrectMeter.style.width = `${incorrectPercent}%`;
        raceScoreVal.textContent = state.score;

        modalRaceResult.classList.remove('race-won', 'race-lost');
        raceCompareCorrectRow.classList.remove('winner-row');
        raceCompareIncorrectRow.classList.remove('winner-row');

        if (playerWon) {
            modalRaceResult.classList.add('race-won');
            raceCompareCorrectRow.classList.add('winner-row');
            raceResultIcon.textContent = '🏆';
            raceResultTitle.textContent = '¡CARRERA GANADA! 🏁';
            raceResultSubtitle.textContent = `¡Victoria contundente! La barra de respuestas buenas (${correct}) superó a la barra de respuestas malas (${incorrect}).`;
            raceOutcomeBadge.textContent = 'VICTORIA';
            raceOutcomeBadge.style.color = 'var(--neon-green)';

            addTerminalLog(`[RESULTADO: VICTORIA] ¡Felicitaciones! Respuestas buenas: ${correct} (${correctPercent}%) > Malas: ${incorrect} (${incorrectPercent}%).`, 'log-success');

            battle.triggerVictory(() => {
                modalRaceResult.classList.add('active');
            });
        } else {
            modalRaceResult.classList.add('race-lost');
            raceCompareIncorrectRow.classList.add('winner-row');
            raceResultIcon.textContent = '💀';
            raceResultTitle.textContent = '¡CARRERA FALLIDA! 💀';
            if (incorrect > correct) {
                raceResultSubtitle.textContent = `Se agotó el tiempo. La barra de respuestas malas (${incorrect}) fue más alta que la de buenas (${correct}).`;
            } else {
                raceResultSubtitle.textContent = `Se agotó el tiempo. Empate (${correct} vs ${incorrect}): La barra de respuestas buenas debe tener más que la de malas para ganar.`;
            }
            raceOutcomeBadge.textContent = 'DERROTA';
            raceOutcomeBadge.style.color = 'var(--neon-red)';

            addTerminalLog(`[RESULTADO: DERROTA] La barra de respuestas malas (${incorrect}) superó o igualó a la de buenas (${correct}).`, 'log-alert');

            battle.triggerDefeat(() => {
                modalRaceResult.classList.add('active');
            });
        }
    }

    /**
     * Actualiza las dos barras de progreso
     */
    function updateDualBars() {
        let correctPercent = 0;
        let incorrectPercent = 0;

        if (state.gameMode === 'RACE') {
            const total = state.correctCount + state.incorrectCount;
            if (total > 0) {
                correctPercent = Math.round((state.correctCount / total) * 100);
                incorrectPercent = 100 - correctPercent;
            }

            correctMeter.style.width = `${correctPercent}%`;
            correctScoreText.textContent = `${correctPercent}% (${state.correctCount} buenas)`;

            incorrectMeter.style.width = `${incorrectPercent}%`;
            incorrectScoreText.textContent = `${incorrectPercent}% (${state.incorrectCount} malas)`;

            if (state.incorrectCount > state.correctCount) {
                serverNameEl.textContent = "SRV-MAIN::CRÍTICO";
                serverNameEl.style.color = "var(--neon-red)";
            } else if (state.correctCount > state.incorrectCount) {
                serverNameEl.textContent = "SRV-MAIN::PROTEGIDO";
                serverNameEl.style.color = "var(--neon-green)";
            } else {
                serverNameEl.textContent = "SRV-MAIN::CARRERA";
                serverNameEl.style.color = "var(--neon-yellow)";
            }
        } else {
            // MODO HISTORIA
            correctPercent = Math.min(100, Math.round((state.correctCount / state.totalQuestions) * 100));
            incorrectPercent = Math.min(100, Math.round((state.incorrectCount / state.totalQuestions) * 100));

            correctMeter.style.width = `${correctPercent}%`;
            correctScoreText.textContent = `${correctPercent}% (${state.correctCount}/${state.totalQuestions})`;

            incorrectMeter.style.width = `${incorrectPercent}%`;
            incorrectScoreText.textContent = `${incorrectPercent}% (${state.incorrectCount}/${state.totalQuestions})`;

            if (incorrectPercent >= 60) {
                serverNameEl.textContent = "SRV-MAIN::CRÍTICO";
                serverNameEl.style.color = "var(--neon-red)";
            } else if (correctPercent >= 60) {
                serverNameEl.textContent = "SRV-MAIN::PROTEGIDO";
                serverNameEl.style.color = "var(--neon-green)";
            } else {
                serverNameEl.textContent = "SRV-MAIN::EN_DISPUTA";
                serverNameEl.style.color = "var(--neon-cyan)";
            }
        }
    }

    /**
     * Cargar una pregunta en el IDE
     */
    function loadQuestion(q) {
        if (!q) return;

        catBadgeEl.textContent = q.category;
        catBadgeEl.className = `cat-badge ${q.category}`;
        diffBadgeEl.textContent = q.difficulty;

        // Actualizar archivo y pestaña según lenguaje de la pregunta
        if (q.category === 'HTML') {
            tabFilenameEl.textContent = 'security_patch.html';
            tabDotEl.className = 'tab-dot dot-html';
        } else if (q.category === 'CSS') {
            tabFilenameEl.textContent = 'firewall_rules.css';
            tabDotEl.className = 'tab-dot dot-css';
        } else if (q.category === 'Python') {
            tabFilenameEl.textContent = 'antivirus_core.py';
            tabDotEl.className = 'tab-dot dot-py';
        }

        if (state.gameMode === 'RACE') {
            qIndexBadgeEl.textContent = `Pregunta #${state.answeredCount + 1} (Modo Carrera)`;
        } else {
            qIndexBadgeEl.textContent = `Pregunta ${state.currentQIndex + 1} de ${state.totalQuestions}`;
        }

        questionPromptEl.textContent = q.question;

        if (q.code) {
            codeBoxEl.textContent = q.code;
            codeBoxEl.style.display = 'block';
        } else {
            codeBoxEl.style.display = 'none';
        }

        optionsGridEl.innerHTML = '';

const keyLetters = ['1', '2', '3', '4'];

// Copiar las opciones y mezclarlas aleatoriamente
const shuffledOptions = q.options
    .map((text, originalIndex) => ({
        text,
        originalIndex
    }))
    .sort(() => Math.random() - 0.5);

// Encontrar dónde quedó la respuesta correcta
state.displayCorrectIndex = shuffledOptions.findIndex(
    option => option.originalIndex === q.correct
);

// Crear los botones en el nuevo orden
shuffledOptions.forEach((option, idx) => {

    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.index = idx;

    const keySpan = document.createElement('span');
    keySpan.className = 'option-key';
    keySpan.textContent = keyLetters[idx];

    const textSpan = document.createElement('span');
    textSpan.className = 'option-text';
    textSpan.textContent = option.text;

    btn.appendChild(keySpan);
    btn.appendChild(textSpan);

    btn.addEventListener('click', () => handleAnswer(idx));

    optionsGridEl.appendChild(btn);
 });
    }

    /**
     * Procesar respuesta seleccionada
     */
    function handleAnswer(selectedIndex) {
        if (state.isTransitioning || state.isGameOver || state.currentScreen !== 'PLAYING') return;
        state.isTransitioning = true;

        lightUpDeskKey(selectedIndex + 1);

        const currentQ = state.questions[state.currentQIndex];
        const buttons = optionsGridEl.querySelectorAll('.option-btn');
        const selectedBtn = buttons[selectedIndex];
        const correctBtn = buttons[currentQ.correct];

        const isCorrect = (selectedIndex === currentQ.correct);
        state.answeredCount++;

        if (isCorrect) {
            // RESPUESTA CORRECTA:
            if (selectedBtn) selectedBtn.classList.add('btn-correct');
            state.correctCount++;
            state.streak++;
            state.totalBugsKilled++;

            const pointsEarned = 150 + (state.streak * 50);
            state.score += pointsEarned;

            updateDualBars();
            updateHUD();

            battle.triggerCorrect();

            if (window.soundEngine) {
                window.soundEngine.playCorrect();
            }

            addTerminalLog(`[CORRECTO] Parche aplicado (+${pointsEarned} pts). Barra de correctas sube.`, 'log-success');

            if (state.gameMode === 'STORY') {
                // REGLA MODO HISTORIA: Si la barra verde llega al 100% -> Victoria Inmediata
                const correctPercent = Math.round((state.correctCount / state.totalQuestions) * 100);
                if (correctPercent >= 100) {
                    setTimeout(() => {
                        handleLevelWin("¡Barra de respuestas correctas al 100%! El fumigador erradicó la amenaza del nivel.");
                    }, 400);
                    return;
                }
            }

        } else {
            // RESPUESTA INCORRECTA:
            if (selectedBtn) selectedBtn.classList.add('btn-wrong');
            if (correctBtn) correctBtn.classList.add('btn-correct');

            state.incorrectCount++;
            state.streak = 0;

            updateDualBars();
            updateHUD();

            battle.triggerWrong();

            addTerminalLog(`[INCORRECTO] Error de código. Barra de incorrectas sube.`, 'log-alert');
            addTerminalLog(`[HACKER] "¡El servidor se debilita! Fallos acumulados: ${state.incorrectCount}."`, 'log-hacker');

            if (state.gameMode === 'STORY') {
                // REGLA MODO HISTORIA: Si la barra roja llega al 100% -> Derrota Inmediata
                const incorrectPercent = Math.round((state.incorrectCount / state.totalQuestions) * 100);
                if (incorrectPercent >= 100) {
                    setTimeout(() => {
                        triggerGameLoss("¡Barra de respuestas incorrectas al 100%! Los bichos sobrepasaron al fumigador.");
                    }, 400);
                    return;
                }
            }
        }

        if (state.gameMode === 'STORY') {
            // REGLA MODO HISTORIA: Fin del nivel tras responder las 5 preguntas
            if (state.answeredCount >= state.totalQuestions) {
                const finalCorrectPercent = Math.round((state.correctCount / state.totalQuestions) * 100);
                const finalIncorrectPercent = Math.round((state.incorrectCount / state.totalQuestions) * 100);

                setTimeout(() => {
                    if (finalCorrectPercent > finalIncorrectPercent) {
                        handleLevelWin(`¡Nivel superado! Las respuestas correctas (${finalCorrectPercent}%) superaron a las incorrectas (${finalIncorrectPercent}%).`);
                    } else {
                        triggerGameLoss(`Nivel fallido: Las respuestas incorrectas (${finalIncorrectPercent}%) superaron o igualaron a las correctas (${finalCorrectPercent}%).`);
                    }
                }, 700);
                return;
            }
        }

        // Siguiente pregunta (rápido en Modo Carrera para máxima velocidad, estándar en Modo Historia)
        const delay = (state.gameMode === 'RACE') ? 320 : 1200;
        state.transitionTimeout = setTimeout(() => {
            if (state.isGameOver) return;
            state.currentQIndex++;
            if (state.gameMode === 'RACE') {
                // Si se agota el banco actual, barajar de nuevo para preguntas continuas
                if (state.currentQIndex >= state.questions.length) {
                    state.questions = window.getRandomRaceQuestions ? window.getRandomRaceQuestions() : state.questions.sort(() => Math.random() - 0.5);
                    state.currentQIndex = 0;
                }
                loadQuestion(state.questions[state.currentQIndex]);
            } else {
                if (state.currentQIndex < state.questions.length) {
                    loadQuestion(state.questions[state.currentQIndex]);
                }
            }
        }, delay);
    }

    /**
     * Victoria de nivel o victoria final
     */
    function handleLevelWin(reasonText) {
        if (state.isGameOver) return;
        state.isGameOver = true;

        // Si se supera el NIVEL 3 (Python Avanzado), ¡inicia la GRAN CINEMÁTICA FINAL!
        if (state.levelIndex >= 2) {
            triggerGrandFinale();
            return;
        }

        // Si es Nivel 1 o Nivel 2, muestra victoria de nivel normal
        addTerminalLog(`[VICTORIA DE NIVEL] ${reasonText}`, 'log-success');

        // Configurar texto del botón para avanzar al siguiente nivel exacto
        if (state.levelIndex === 0) {
            btnNextLevel.textContent = "Avanzar a Nivel 2: CSS (Medio) 🚀";
        } else if (state.levelIndex === 1) {
            btnNextLevel.textContent = "Avanzar a Nivel 3: Python (Avanzado) 🚀";
        } else {
            btnNextLevel.textContent = "Continuar al Gran Final 🏆";
        }

        battle.triggerVictory(() => {
            vicScoreEl.textContent = state.score;
            vicBugsEl.textContent = state.totalBugsKilled;
            const accuracy = Math.round((state.correctCount / state.totalQuestions) * 100);
            vicAccuracyEl.textContent = `${accuracy}%`;

            const subtitleEl = modalVictory.querySelector('.modal-subtitle-victory');
            if (subtitleEl) {
                subtitleEl.textContent = reasonText;
            }

            modalVictory.classList.add('active');
        });
    }

    /**
     * GRAN CINEMÁTICA FINAL (SUPERAR NIVEL 3):
     * El fumigador destruye al último bicho con el mega rayo y se muestra el letrero:
     * "¡FELICIDADES! LIMPIASTE LA PÁGINA DE LAS PLAGAS"
     */
    function triggerGrandFinale() {
        state.currentScreen = 'FINALE';
        addTerminalLog(`[GRAN FINAL] ¡Aparición del ÚLTIMO BICHO! Cargando rayo desinfectante de máxima potencia...`, 'log-success');

        battle.playFinalBossExecution(() => {
            // Mostrar letrero final
            finScoreEl.textContent = state.score;
            finBugsEl.textContent = state.totalBugsKilled + 1; // Incluye al gran jefe bicho

            grandFinaleOverlay.classList.add('active');
            addTerminalLog(`[MISIÓN CUMPLIDA] ¡Felicidades! Limpiaste la página de las plagas.`, 'log-success');
        });
    }

    /**
     * Derrota en el nivel
     */
    function triggerGameLoss(reasonText) {
        if (state.isGameOver) return;
        state.isGameOver = true;

        addTerminalLog(`[DERROTA] ${reasonText}`, 'log-alert');

        battle.triggerDefeat(() => {
            defScoreEl.textContent = state.score;
            defErrorsEl.textContent = state.incorrectCount;

            const subtitleEl = modalDefeat.querySelector('.modal-subtitle-defeat');
            if (subtitleEl) {
                subtitleEl.textContent = reasonText;
            }

            modalDefeat.classList.add('active');
        });
    }

    function updateHUD() {
        scoreValEl.textContent = state.score;
        streakValEl.textContent = `${state.streak}x`;
    }

    function addTerminalLog(msg, typeClass = 'log-sys') {
        const now = new Date();
        const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

        const line = document.createElement('div');
        line.className = `log-line ${typeClass}`;
        line.textContent = `${timeStr} ${msg}`;

        terminalLogsEl.appendChild(line);
        terminalLogsEl.scrollTop = terminalLogsEl.scrollHeight;

        while (terminalLogsEl.children.length > 30) {
            terminalLogsEl.removeChild(terminalLogsEl.firstChild);
        }
    }

    function lightUpDeskKey(keyChar) {
        if (window.soundEngine) {
            window.soundEngine.playKeyClick();
        }

        const keyCaps = document.querySelectorAll(`.keycap[data-key="${keyChar}"]`);
        keyCaps.forEach(k => {
            k.classList.add('active');
            setTimeout(() => k.classList.remove('active'), 180);
        });
    }

    // =========================================================================
    // EVENTOS DE ENTRADA Y TECLADO
    // =========================================================================

    window.addEventListener('keydown', (e) => {
        const pressedKey = e.key;
        lightUpDeskKey(pressedKey);

        // Si estamos en la cinemática de introducción esperando una tecla:
        if (state.currentScreen === 'INTRO_CINEMATIC' && state.awaitingDeployKey) {
            triggerFumigadorDeploy();
            return;
        }

        if (state.isGameOver || state.isTransitioning || state.currentScreen !== 'PLAYING') return;

        if (['1', '2', '3', '4'].includes(pressedKey)) {
            handleAnswer(parseInt(pressedKey, 10) - 1);
        } else if (['a', 'A'].includes(pressedKey)) {
            handleAnswer(0);
        } else if (['b', 'B'].includes(pressedKey)) {
            handleAnswer(1);
        } else if (['c', 'C'].includes(pressedKey)) {
            handleAnswer(2);
        } else if (['d', 'D'].includes(pressedKey)) {
            handleAnswer(3);
        }
    });

    // Clic en el prompt de despliegue
    introDeployPrompt.addEventListener('click', () => {
        triggerFumigadorDeploy();
    });

    // Botones del Menú Principal
    btnMenuStory.addEventListener('click', () => {
        startIntroCinematic();
    });

    // MODO CARRERA: botón del menú principal
    btnMenuRace.addEventListener('click', () => {
        startRaceMode();
    });

    // MODO CARRERA: volver a jugar desde el modal de resultado
    btnRetryRace.addEventListener('click', () => {
        startRaceMode();
    });

    // MODO CARRERA: volver al menú desde el modal de resultado
    btnExitToMenuRace.addEventListener('click', () => {
        showMainMenu();
    });

    btnMenuHowToPlay.addEventListener('click', () => {
        modalHelp.classList.add('active');
    });

    // Botón de Volver al Menú Principal desde el Gran Final
    btnReturnMenuFinal.addEventListener('click', () => {
        showMainMenu();
    });

    // Botón de la barra superior para ir al menú
    btnHomeMenu.addEventListener('click', () => {
        showMainMenu();
    });

    // Botones de modales
    btnNextLevel.addEventListener('click', () => {
        const nextIdx = state.levelIndex + 1;
        if (nextIdx < STORY_LEVELS.length) {
            startLevel(nextIdx);
        } else {
            triggerGrandFinale();
        }
    });

    btnExitToMenuVic.addEventListener('click', () => {
        showMainMenu();
    });

    btnRetry.addEventListener('click', () => {
        startLevel(state.levelIndex);
    });

    btnExitToMenuDef.addEventListener('click', () => {
        showMainMenu();
    });

    // Control de audio
    btnSoundToggle.addEventListener('click', () => {
        if (window.soundEngine) {
            const enabled = window.soundEngine.toggle();
            btnSoundToggle.textContent = enabled ? '🔊' : '🔇';
            addTerminalLog(`[AUDIO] Sonido ${enabled ? 'ACTIVADO' : 'SILENCIADO'}.`, 'log-sys');
        }
    });

    // Ayuda
    btnHelp.addEventListener('click', () => {
        modalHelp.classList.add('active');
    });
    btnCloseHelp.addEventListener('click', () => {
        modalHelp.classList.remove('active');
    });

    // Iniciar mostrando el Menú Principal con el nombre "FUMIGADOR"
    showMainMenu();
});
