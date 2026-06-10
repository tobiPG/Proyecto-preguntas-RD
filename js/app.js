/**
 * RD Quiz - Aplicación Principal
 * Controlador del juego y navegación
 */

class RDQuizApp {
  constructor() {
    // Estado del juego
    this.currentScreen = 'home';
    this.currentCategory = null;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timeBonus = 0;
    this.timer = null;
    this.timeLeft = 100;
    this.isAnswered = false;
    this.questionsAnswered = 0; // Total de preguntas respondidas en la sesión
    this.immunityTimer = null;
    
    // Puntuación acumulada
    this.totalScore = 0;
    this.totalCorrect = 0;
    this.totalWrong = 0;

    // Configuración
    this.QUESTION_TIME = 15000; // 15 segundos
    this.POINTS_CORRECT = 10;
    this.STREAK_BONUS = 2;
    this.MAX_LIVES = 5;

    // Inicializar
    this.init();
  }

  /**
   * Inicializa la aplicación
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.updateHomeProgress();
    this.updateLivesDisplay();
    this.updateCoinsDisplay();
    this.updateImmunityDisplay();
    this.updateAdsVisibility();
    this.applyDarkMode();
    this.loadMap();
    this.registerServiceWorker();
    this.startImmunityTimer();
  }

  /**
   * Cachea elementos del DOM
   */
  cacheElements() {
    // Pantallas
    this.screens = {
      home: document.getElementById('home-screen'),
      quiz: document.getElementById('quiz-screen'),
      results: document.getElementById('results-screen'),
      stats: document.getElementById('stats-screen'),
      settings: document.getElementById('settings-screen'),
      store: document.getElementById('store-screen')
    };

    // Elementos del quiz
    this.quizElements = {
      categoryName: document.getElementById('quiz-category-name'),
      progress: document.getElementById('quiz-progress'),
      score: document.getElementById('current-score'),
      mapContainer: document.getElementById('map-container'),
      imageContainer: document.getElementById('image-container'),
      questionImage: document.getElementById('question-image'),
      questionText: document.getElementById('question-text'),
      questionHint: document.getElementById('question-hint'),
      optionsContainer: document.getElementById('options-container'),
      feedbackContainer: document.getElementById('feedback-container'),
      feedbackIcon: document.getElementById('feedback-icon'),
      feedbackText: document.getElementById('feedback-text'),
      feedbackDetail: document.getElementById('feedback-detail'),
      timerFill: document.getElementById('timer-fill'),
      btnNext: document.getElementById('btn-next')
    };

    // Elementos de resultados
    this.resultsElements = {
      icon: document.getElementById('results-icon'),
      title: document.getElementById('results-title'),
      score: document.getElementById('final-score'),
      message: document.getElementById('results-message'),
      correct: document.getElementById('correct-count'),
      wrong: document.getElementById('wrong-count'),
      timeBonus: document.getElementById('time-bonus'),
      streak: document.getElementById('streak-count')
    };

    // Modal
    this.modal = {
      container: document.getElementById('confirm-modal'),
      title: document.getElementById('modal-title'),
      message: document.getElementById('modal-message'),
      cancel: document.getElementById('modal-cancel'),
      confirm: document.getElementById('modal-confirm')
    };

    // Toast
    this.toast = {
      container: document.getElementById('toast'),
      icon: document.getElementById('toast-icon'),
      message: document.getElementById('toast-message')
    };

    // Sistema de vidas
    this.livesElements = {
      container: document.getElementById('lives-container'),
      display: document.getElementById('lives-display'),
      timer: document.getElementById('lives-timer'),
      quizDisplay: document.getElementById('quiz-lives'),
      immunityBtn: document.getElementById('btn-immunity')
    };
  }

  /**
   * Vincula eventos
   */
  bindEvents() {
    // Categorías
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => this.startQuiz(card.dataset.mode));
    });

    // Botones de navegación
    document.getElementById('btn-stats').addEventListener('click', () => this.showStats());
    document.getElementById('btn-random').addEventListener('click', () => this.startQuiz('random'));
    document.getElementById('btn-back').addEventListener('click', () => this.confirmExit());
    document.getElementById('btn-stats-back').addEventListener('click', () => this.showScreen('home'));
    document.getElementById('btn-next').addEventListener('click', () => this.nextQuestion());
    document.getElementById('btn-retry').addEventListener('click', () => this.startQuiz(this.currentCategory, false));
    document.getElementById('btn-continue').addEventListener('click', () => this.continueQuiz());
    document.getElementById('btn-home').addEventListener('click', () => this.goHome());

    // Reset stats
    document.getElementById('btn-reset-stats').addEventListener('click', () => this.confirmReset());

    // Modal
    this.modal.cancel.addEventListener('click', () => this.hideModal());
    this.modal.container.addEventListener('click', (e) => {
      if (e.target === this.modal.container) this.hideModal();
    });

    // Botón de inmunidad
    if (this.livesElements.immunityBtn) {
      this.livesElements.immunityBtn.addEventListener('click', () => this.activateImmunity());
    }

    // Configuración
    document.getElementById('btn-settings').addEventListener('click', () => this.showSettings());
    document.getElementById('btn-settings-back').addEventListener('click', () => this.showScreen('home'));
    
    // Toggles de configuración
    document.getElementById('toggle-dark-mode').addEventListener('change', (e) => this.toggleDarkMode(e.target.checked));
    document.getElementById('toggle-sound').addEventListener('change', (e) => this.toggleSetting('soundEnabled', e.target.checked));
    document.getElementById('toggle-vibration').addEventListener('change', (e) => this.toggleSetting('vibrationEnabled', e.target.checked));
    
    // Enlaces legales
    document.getElementById('btn-privacy').addEventListener('click', () => this.showPolicy('privacy'));
    document.getElementById('btn-terms').addEventListener('click', () => this.showPolicy('terms'));
    document.getElementById('btn-about').addEventListener('click', () => this.showPolicy('about'));
    document.getElementById('policy-modal-close').addEventListener('click', () => this.hidePolicyModal());

    // Tienda
    document.getElementById('btn-store').addEventListener('click', () => this.showStore());
    document.getElementById('btn-store-back').addEventListener('click', () => this.showScreen('home'));
    
    // Compras de vidas
    document.querySelectorAll('.store-item[data-lives]').forEach(item => {
      item.addEventListener('click', () => this.buyLives(
        parseInt(item.dataset.lives),
        parseInt(item.dataset.price)
      ));
    });
    
    // Suscripción Premium
    document.getElementById('btn-premium-monthly').addEventListener('click', () => this.purchasePremium(1));
    document.getElementById('btn-premium-annual').addEventListener('click', () => this.purchasePremium(12));
    
    // Comprar monedas
    document.getElementById('buy-coins-100').addEventListener('click', () => this.purchaseCoins(100, 2.99));
    document.getElementById('buy-coins-500').addEventListener('click', () => this.purchaseCoins(550, 4.99));
    document.getElementById('buy-coins-1000').addEventListener('click', () => this.purchaseCoins(1200, 8.99));
    
    // Ver anuncio
    document.getElementById('btn-watch-ad').addEventListener('click', () => this.watchAdForCoins());
    
    // Restaurar compras
    document.getElementById('btn-restore-purchases').addEventListener('click', () => this.restorePurchases());
  }

  /**
   * Muestra una pantalla
   */
  showScreen(screenName) {
    Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
    this.screens[screenName].classList.add('active');
    this.currentScreen = screenName;

    if (screenName === 'home') {
      this.updateHomeProgress();
      this.updateLivesDisplay();
      this.updateCoinsDisplay();
      this.updateAdsVisibility();
    }
  }

  /**
   * Actualiza el progreso en la pantalla de inicio
   */
  updateHomeProgress() {
    Object.keys(CATEGORIES).forEach(cat => {
      const badge = document.getElementById(`progress-${cat}`);
      if (badge) {
        badge.textContent = `${storage.getCategoryProgress(cat)}%`;
      }
    });
  }

  /**
   * Inicia un quiz
   */
  startQuiz(category, keepScore = false) {
    // Verificar si tiene vidas
    if (!storage.hasLives()) {
      this.showNoLivesModal();
      return;
    }

    this.currentCategory = category;
    this.questions = questionGenerator.generateQuestions(category, 5);
    this.currentQuestionIndex = 0;
    
    // Si keepScore es false, reiniciar todo
    if (!keepScore) {
      this.totalScore = 0;
      this.totalCorrect = 0;
      this.totalWrong = 0;
    }
    
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timeBonus = 0;
    this.questionsAnswered = 0;

    // Actualizar UI
    const categoryInfo = CATEGORIES[category] || { name: 'Modo Aleatorio', icon: '🎲' };
    this.quizElements.categoryName.textContent = categoryInfo.name;
    this.quizElements.score.textContent = keepScore ? this.totalScore : '0';
    this.updateQuizLivesDisplay();

    this.showScreen('quiz');
    this.showQuestion();
  }

  /**
   * Continúa el quiz manteniendo los puntos acumulados
   */
  continueQuiz() {
    if (!storage.hasLives()) {
      this.showNoLivesModal();
      return;
    }
    this.startQuiz(this.currentCategory, true);
  }

  /**
   * Vuelve al inicio y reinicia los puntos acumulados
   */
  goHome() {
    this.totalScore = 0;
    this.totalCorrect = 0;
    this.totalWrong = 0;
    this.showScreen('home');
  }

  /**
   * Muestra la pregunta actual
   */
  showQuestion() {
    // Verificar si tiene vidas
    if (!storage.hasLives()) {
      this.showGameOver();
      return;
    }

    // Si se acabaron las preguntas del lote, mostrar resultados
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResults();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    this.isAnswered = false;

    // Actualizar progreso (mostrar preguntas respondidas en total)
    this.quizElements.progress.textContent = `Pregunta ${this.questionsAnswered + 1}`;

    // Ocultar elementos
    this.quizElements.mapContainer.classList.add('hidden');
    this.quizElements.imageContainer.classList.add('hidden');
    this.quizElements.feedbackContainer.classList.add('hidden');
    this.quizElements.btnNext.classList.add('hidden');
    this.quizElements.questionHint.classList.add('hidden');

    // Mostrar imagen si tiene imagen (provincias, superficie, escudos, fundaciones)
    if (question.image) {
      this.quizElements.imageContainer.classList.remove('hidden');
      this.quizElements.questionImage.src = question.image;
      this.quizElements.questionImage.alt = question.question;
    }

    // Mostrar pregunta
    this.quizElements.questionText.textContent = question.question;

    // Mostrar opciones
    this.renderOptions(question.options);

    // Iniciar timer
    this.startTimer();
  }

  /**
   * Renderiza las opciones de respuesta
   */
  renderOptions(options) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const isMultipleOptions = options.length > 4;
    const containerClass = isMultipleOptions ? 'multiple-options' : '';
    
    this.quizElements.optionsContainer.className = containerClass;
    this.quizElements.optionsContainer.innerHTML = options.map((opt, i) => `
      <button class="option-btn ${isMultipleOptions ? 'compact' : ''}" data-answer="${opt}">
        <span class="option-letter">${letters[i]}</span>
        <span class="option-text">${opt}</span>
      </button>
    `).join('');

    // Vincular eventos
    this.quizElements.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.selectAnswer(btn));
    });
  }

  /**
   * Selecciona una respuesta
   */
  selectAnswer(button) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.questionsAnswered++;

    this.stopTimer();

    const question = this.questions[this.currentQuestionIndex];
    const selectedAnswer = button.dataset.answer;
    const isCorrect = selectedAnswer === question.correctAnswer;

    // Marcar botones
    this.quizElements.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === question.correctAnswer) {
        btn.classList.add('correct');
      } else if (btn === button && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // Actualizar puntuación
    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      // Calcular puntos
      const timePoints = Math.floor(this.timeLeft / 10);
      const streakBonus = Math.min(this.streak - 1, 5) * this.STREAK_BONUS;
      const points = this.POINTS_CORRECT + timePoints + streakBonus;
      this.score += points;
      this.timeBonus += timePoints;

      this.showFeedback(true, question);
    } else {
      this.wrongCount++;
      this.streak = 0;
      
      // Perder vida (a menos que tenga inmunidad)
      const livesLeft = storage.loseLife();
      this.updateQuizLivesDisplay();
      this.updateLivesDisplay();
      
      if (storage.isImmunityActive()) {
        this.showFeedback(false, question, true); // true = inmunidad activa
      } else {
        this.showFeedback(false, question);
      }
    }

    // Actualizar score display
    this.quizElements.score.textContent = this.totalScore + this.score;

    // Actualizar mapa si es provincia
    if (question.type === 'provincias' && question.provinceId) {
      this.updateProvinceStatus(question.provinceId, isCorrect);
    }

    // Mostrar botón siguiente o game over
    if (storage.hasLives()) {
      this.quizElements.btnNext.classList.remove('hidden');
    } else {
      // Sin vidas, mostrar game over después de un momento
      setTimeout(() => this.showGameOver(), 1500);
    }

    // Vibración (si está habilitada)
    if (storage.getSettings().vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(isCorrect ? [50] : [100, 50, 100]);
    }
  }

  /**
   * Muestra feedback de la respuesta
   */
  showFeedback(isCorrect, question, hasImmunity = false) {
    this.quizElements.feedbackContainer.classList.remove('hidden', 'correct', 'wrong');
    this.quizElements.feedbackContainer.classList.add(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      this.quizElements.feedbackIcon.textContent = '✅';
      this.quizElements.feedbackText.textContent = '¡Correcto!';
      
      let detail = '';
      if (this.streak > 1) {
        detail = `🔥 Racha de ${this.streak}`;
      }
      this.quizElements.feedbackDetail.textContent = detail || question.detail || '';
    } else {
      this.quizElements.feedbackIcon.textContent = '❌';
      this.quizElements.feedbackText.textContent = 'Incorrecto';
      if (storage.isPremium()) {
        this.quizElements.feedbackDetail.textContent = `👑 ¡Premium! No perdiste vida. Respuesta: ${question.correctAnswer}`;
      } else if (hasImmunity) {
        this.quizElements.feedbackDetail.textContent = `🛡️ ¡Inmunidad activa! No perdiste vida. Respuesta: ${question.correctAnswer}`;
      } else {
        const livesLeft = storage.getLives();
        this.quizElements.feedbackDetail.textContent = `❤️ -1 vida (${livesLeft} restantes). Respuesta: ${question.correctAnswer}`;
      }
    }
  }

  /**
   * Siguiente pregunta
   */
  nextQuestion() {
    this.currentQuestionIndex++;
    this.showQuestion();
  }

  /**
   * Inicia el timer
   */
  startTimer() {
    this.timeLeft = 100;
    this.quizElements.timerFill.style.width = '100%';

    const interval = this.QUESTION_TIME / 100;
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.quizElements.timerFill.style.width = `${this.timeLeft}%`;

      if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, interval);
  }

  /**
   * Detiene el timer
   */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Se acabó el tiempo
   */
  timeUp() {
    this.stopTimer();
    if (!this.isAnswered) {
      this.isAnswered = true;
      this.wrongCount++;
      this.streak = 0;
      this.questionsAnswered++;

      const question = this.questions[this.currentQuestionIndex];
      const hasImmunity = storage.isImmunityActive();
      
      // Perder vida si no tiene inmunidad
      if (!hasImmunity) {
        storage.loseLife();
        this.updateQuizLivesDisplay();
        this.updateLivesDisplay();
      }

      // Marcar respuesta correcta
      this.quizElements.optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.answer === question.correctAnswer) {
          btn.classList.add('correct');
        }
      });

      this.quizElements.feedbackContainer.classList.remove('hidden', 'correct', 'wrong');
      this.quizElements.feedbackContainer.classList.add('wrong');
      this.quizElements.feedbackIcon.textContent = '⏱️';
      this.quizElements.feedbackText.textContent = '¡Tiempo agotado!';
      
      if (hasImmunity) {
        this.quizElements.feedbackDetail.textContent = `🛡️ ¡Inmunidad activa! No perdiste vida. Respuesta: ${question.correctAnswer}`;
      } else {
        const livesLeft = storage.getLives();
        this.quizElements.feedbackDetail.textContent = `❤️ -1 vida (${livesLeft} restantes). Respuesta: ${question.correctAnswer}`;
      }

      // Mostrar botón siguiente o game over
      if (storage.hasLives()) {
        this.quizElements.btnNext.classList.remove('hidden');
      } else {
        setTimeout(() => this.showGameOver(), 1500);
      }

      if (storage.getSettings().vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }
  }

  /**
   * Muestra resultados
   */
  showResults() {
    this.stopTimer();

    // Acumular puntos
    this.totalScore += this.score;
    this.totalCorrect += this.correctCount;
    this.totalWrong += this.wrongCount;

    // Guardar progreso
    storage.recordGame(
      this.currentCategory,
      this.correctCount,
      this.wrongCount,
      this.score,
      this.maxStreak
    );

    // Determinar mensaje según puntuación
    const percentage = (this.correctCount / this.questions.length) * 100;
    let resultConfig;
    for (const key of ['excellent', 'great', 'good', 'learning', 'beginner']) {
      if (percentage >= RESULT_MESSAGES[key].min) {
        resultConfig = RESULT_MESSAGES[key];
        break;
      }
    }

    // Actualizar UI
    this.resultsElements.icon.textContent = resultConfig.icon;
    this.resultsElements.title.textContent = resultConfig.title;
    this.resultsElements.score.textContent = this.totalScore;
    this.resultsElements.message.textContent = resultConfig.message;
    this.resultsElements.correct.textContent = this.totalCorrect;
    this.resultsElements.wrong.textContent = this.totalWrong;
    this.resultsElements.timeBonus.textContent = `+${this.timeBonus}`;
    this.resultsElements.streak.textContent = storage.getStats().dailyStreak;

    // Otorgar monedas basado en puntuación de la ronda (1 moneda por cada 20 puntos)
    if (!storage.isPremium()) {
      const coinsEarned = Math.floor(this.score / 20);
      if (coinsEarned > 0) {
        storage.addCoins(coinsEarned);
        setTimeout(() => {
          this.showToast(`+${coinsEarned} 🪙 por tu puntuación`, '🪙');
        }, 500);
      }
    }

    // Verificar logros nuevos
    const newAchievements = storage.checkAchievements();
    if (newAchievements.length > 0) {
      setTimeout(() => {
        this.showToast(`🏆 ¡Logro desbloqueado: ${newAchievements[0].name}!`);
      }, 1500);
    }

    this.showScreen('results');
  }

  /**
   * Muestra pantalla de estadísticas
   */
  showStats() {
    const stats = storage.getStats();

    // Estadísticas generales
    document.getElementById('total-played').textContent = stats.gamesPlayed;
    document.getElementById('total-correct').textContent = stats.totalCorrect;
    document.getElementById('best-streak').textContent = stats.bestStreak;

    // Progreso por categoría
    const categoryStatsContainer = document.getElementById('category-stats');
    categoryStatsContainer.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => {
      const progress = storage.getCategoryProgress(key);
      return `
        <div class="category-stat-item">
          <span class="category-stat-icon">${cat.icon}</span>
          <div class="category-stat-info">
            <span class="category-stat-name">${cat.name}</span>
            <div class="category-stat-bar">
              <div class="category-stat-fill" style="width: ${progress}%"></div>
            </div>
          </div>
          <span class="category-stat-percent">${progress}%</span>
        </div>
      `;
    }).join('');

    // Logros
    const achievementsContainer = document.getElementById('achievements');
    achievementsContainer.innerHTML = storage.getAchievements().map(a => `
      <div class="achievement ${a.unlocked ? 'unlocked' : ''}">
        <span class="achievement-icon">${a.icon}</span>
        <span class="achievement-name">${a.name}</span>
      </div>
    `).join('');

    this.showScreen('stats');
  }

  /**
   * Confirma salir del quiz
   */
  confirmExit() {
    this.showModal(
      '¿Salir del quiz?',
      'Perderás el progreso de esta partida.',
      () => {
        this.stopTimer();
        this.showScreen('home');
      }
    );
  }

  /**
   * Confirma reiniciar estadísticas
   */
  confirmReset() {
    this.showModal(
      '¿Reiniciar progreso?',
      'Se borrarán todas las estadísticas y logros.',
      () => {
        storage.reset();
        this.showStats();
        this.showToast('Progreso reiniciado');
      }
    );
  }

  /**
   * Muestra modal de confirmación
   */
  showModal(title, message, onConfirm) {
    this.modal.title.textContent = title;
    this.modal.message.textContent = message;
    this.modal.container.classList.remove('hidden');
    
    this.modal.confirm.onclick = () => {
      this.hideModal();
      onConfirm();
    };
  }

  /**
   * Oculta modal
   */
  hideModal() {
    this.modal.container.classList.add('hidden');
  }

  /**
   * Muestra toast
   */
  showToast(message, icon = '✓') {
    this.toast.icon.textContent = icon;
    this.toast.message.textContent = message;
    this.toast.container.classList.remove('hidden', 'hiding');

    setTimeout(() => {
      this.toast.container.classList.add('hiding');
      setTimeout(() => {
        this.toast.container.classList.add('hidden');
      }, 300);
    }, 3000);
  }

  /**
   * Carga el mapa SVG
   */
  loadMap() {
    fetch('img/mapa-rd.svg')
      .then(response => response.text())
      .then(svg => {
        document.getElementById('rd-map').innerHTML = svg;
      })
      .catch(err => {
        console.log('Mapa no disponible aún');
      });
  }

  /**
   * Resalta una provincia en el mapa
   */
  highlightProvince(provinceId) {
    const map = document.getElementById('rd-map');
    
    // Quitar highlights anteriores
    map.querySelectorAll('.province').forEach(p => {
      p.classList.remove('highlighted', 'correct', 'wrong');
    });

    // Resaltar provincia actual
    const province = map.querySelector(`#${provinceId}`);
    if (province) {
      province.classList.add('highlighted');
    }
  }

  /**
   * Actualiza estado de provincia después de responder
   */
  updateProvinceStatus(provinceId, isCorrect) {
    const map = document.getElementById('rd-map');
    const province = map.querySelector(`#${provinceId}`);
    if (province) {
      province.classList.remove('highlighted');
      province.classList.add(isCorrect ? 'correct' : 'wrong');
    }
  }

  /**
   * Registra Service Worker
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('SW registrado'))
        .catch(err => console.log('SW error:', err));
    }
  }

  // ==================== SISTEMA DE VIDAS ====================

  /**
   * Actualiza el display de vidas en la pantalla principal
   */
  updateLivesDisplay() {
    if (!this.livesElements.container) return;
    
    // Si es premium, mostrar infinito
    if (storage.isPremium()) {
      this.livesElements.display.innerHTML = '<span class="premium-lives">👑 ∞</span>';
      this.livesElements.timer.classList.add('hidden');
      return;
    }
    
    const lives = storage.getLives();
    const maxLives = this.MAX_LIVES;
    
    let heartsHTML = '';
    for (let i = 0; i < maxLives; i++) {
      if (i < lives) {
        heartsHTML += '<span class="heart full">❤️</span>';
      } else {
        heartsHTML += '<span class="heart empty">🖤</span>';
      }
    }
    
    this.livesElements.display.innerHTML = heartsHTML;
    
    // Mostrar tiempo de recarga si no tiene vidas completas
    if (lives < maxLives) {
      const status = storage.getLifeStatus();
      if (status.nextRefillTime) {
        const timeLeft = Math.ceil((status.nextRefillTime - Date.now()) / 60000);
        this.livesElements.timer.textContent = `Recarga en ${timeLeft}min`;
        this.livesElements.timer.classList.remove('hidden');
      }
    } else {
      this.livesElements.timer.classList.add('hidden');
    }
  }

  /**
   * Actualiza el display de vidas durante el quiz
   */
  updateQuizLivesDisplay() {
    if (!this.livesElements.quizDisplay) return;
    
    // Si es premium, mostrar infinito
    if (storage.isPremium()) {
      this.livesElements.quizDisplay.innerHTML = '👑 ∞';
      return;
    }
    
    const lives = storage.getLives();
    let heartsHTML = '';
    for (let i = 0; i < this.MAX_LIVES; i++) {
      if (i < lives) {
        heartsHTML += '❤️';
      } else {
        heartsHTML += '🖤';
      }
    }
    
    this.livesElements.quizDisplay.innerHTML = heartsHTML;
    
    // Animación cuando pierde vida
    if (lives < this.MAX_LIVES) {
      this.livesElements.quizDisplay.classList.add('shake');
      setTimeout(() => {
        this.livesElements.quizDisplay.classList.remove('shake');
      }, 500);
    }
  }

  /**
   * Actualiza el display de monedas
   */
  updateCoinsDisplay() {
    const homeCoins = document.getElementById('home-coins');
    if (homeCoins) {
      homeCoins.textContent = storage.getCoins();
    }
  }

  /**
   * Actualiza el display de inmunidad
   */
  updateImmunityDisplay() {
    if (!this.livesElements.immunityBtn) return;
    
    if (storage.isImmunityActive()) {
      // Inmunidad activa
      const timeLeft = storage.getImmunityTimeLeft();
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      
      this.livesElements.immunityBtn.disabled = true;
      this.livesElements.immunityBtn.innerHTML = `🛡️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
      this.livesElements.immunityBtn.classList.add('active');
    } else if (storage.canActivateImmunity()) {
      // Puede activar inmunidad
      this.livesElements.immunityBtn.disabled = false;
      this.livesElements.immunityBtn.innerHTML = '🛡️ Activar Inmunidad (30min)';
      this.livesElements.immunityBtn.classList.remove('active', 'used');
    } else {
      // Ya usó inmunidad hoy
      this.livesElements.immunityBtn.disabled = true;
      this.livesElements.immunityBtn.innerHTML = '🛡️ Usada hoy';
      this.livesElements.immunityBtn.classList.add('used');
    }
  }

  /**
   * Inicia el timer de inmunidad
   */
  startImmunityTimer() {
    // Limpiar timer anterior
    if (this.immunityTimer) {
      clearInterval(this.immunityTimer);
    }
    
    // Actualizar cada segundo si la inmunidad está activa
    this.immunityTimer = setInterval(() => {
      if (storage.isImmunityActive()) {
        this.updateImmunityDisplay();
      } else {
        this.updateImmunityDisplay(); // Actualizar una última vez
      }
    }, 1000);
  }

  /**
   * Activa la inmunidad
   */
  activateImmunity() {
    if (storage.canActivateImmunity()) {
      storage.activateImmunity();
      this.updateImmunityDisplay();
      this.showToast('¡Inmunidad activada por 30 minutos!', '🛡️');
    }
  }

  /**
   * Muestra pantalla de game over
   */
  showGameOver() {
    this.stopTimer();
    
    // Crear modal de game over si no existe
    let gameOverModal = document.getElementById('game-over-modal');
    if (!gameOverModal) {
      gameOverModal = document.createElement('div');
      gameOverModal.id = 'game-over-modal';
      gameOverModal.className = 'modal';
      gameOverModal.innerHTML = `
        <div class="modal-content game-over-content">
          <div class="game-over-icon">💔</div>
          <h2>¡Game Over!</h2>
          <p class="game-over-stats"></p>
          <div class="game-over-actions">
            <button class="btn btn-primary" id="btn-go-home">Volver al Inicio</button>
          </div>
        </div>
      `;
      document.body.appendChild(gameOverModal);
      
      document.getElementById('btn-go-home').addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        this.showScreen('home');
        // Rellenar vidas después de game over
        storage.refillLives();
        this.updateLivesDisplay();
      });
    }
    
    // Actualizar estadísticas
    const stats = gameOverModal.querySelector('.game-over-stats');
    stats.innerHTML = `
      Respondiste <strong>${this.questionsAnswered}</strong> preguntas<br>
      ✅ ${this.correctCount} correctas | ❌ ${this.wrongCount} incorrectas
    `;
    
    gameOverModal.classList.remove('hidden');
  }

  /**
   * Muestra modal de sin vidas
   */
  showNoLivesModal() {
    let noLivesModal = document.getElementById('no-lives-modal');
    if (!noLivesModal) {
      noLivesModal = document.createElement('div');
      noLivesModal.id = 'no-lives-modal';
      noLivesModal.className = 'modal';
      noLivesModal.innerHTML = `
        <div class="modal-content no-lives-content">
          <div class="no-lives-icon">💔</div>
          <h2>¡Sin vidas!</h2>
          <p>Espera a que se recarguen tus vidas o vuelve más tarde.</p>
          <p class="no-lives-timer"></p>
          <button class="btn btn-secondary" id="btn-close-no-lives">Cerrar</button>
        </div>
      `;
      document.body.appendChild(noLivesModal);
      
      document.getElementById('btn-close-no-lives').addEventListener('click', () => {
        noLivesModal.classList.add('hidden');
      });
    }
    
    noLivesModal.classList.remove('hidden');
  }

  // ==================== CONFIGURACIÓN ====================

  /**
   * Muestra la pantalla de configuración
   */
  showSettings() {
    const stats = storage.getStats();
    const settings = storage.getSettings();
    const firstUsed = storage.data.firstUsed;
    
    // Actualizar datos del usuario
    const registerDate = new Date(firstUsed);
    document.getElementById('user-register-date').textContent = registerDate.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('user-games-played').textContent = stats.gamesPlayed;
    document.getElementById('user-correct-answers').textContent = stats.totalCorrect;
    document.getElementById('user-best-streak').textContent = stats.bestStreak;
    document.getElementById('user-total-score').textContent = stats.totalScore;
    
    // Actualizar toggles
    document.getElementById('toggle-dark-mode').checked = settings.darkMode || false;
    document.getElementById('toggle-sound').checked = settings.soundEnabled;
    document.getElementById('toggle-vibration').checked = settings.vibrationEnabled;
    
    this.showScreen('settings');
  }

  /**
   * Aplica el modo oscuro según la configuración guardada
   */
  applyDarkMode() {
    const settings = storage.getSettings();
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  /**
   * Activa/desactiva el modo oscuro
   */
  toggleDarkMode(enabled) {
    storage.updateSettings({ darkMode: enabled });
    this.applyDarkMode();
    this.showToast(enabled ? 'Modo oscuro activado' : 'Modo claro activado', enabled ? '🌙' : '☀️');
  }

  /**
   * Actualiza una configuración
   */
  toggleSetting(setting, value) {
    storage.updateSettings({ [setting]: value });
    const labels = {
      soundEnabled: value ? 'Sonido activado' : 'Sonido desactivado',
      vibrationEnabled: value ? 'Vibración activada' : 'Vibración desactivada'
    };
    this.showToast(labels[setting], value ? '✓' : '✗');
  }

  /**
   * Muestra modal de política/términos
   */
  showPolicy(type) {
    const policyModal = document.getElementById('policy-modal');
    const policyTitle = document.getElementById('policy-title');
    const policyContent = document.getElementById('policy-content');
    
    const policies = {
      privacy: {
        title: '🔒 Política de Privacidad',
        content: `
          <h4>Información que Recopilamos</h4>
          <p>RD Quiz almacena localmente en tu dispositivo:</p>
          <ul>
            <li>Tu progreso en el juego y estadísticas</li>
            <li>Preferencias de configuración (modo oscuro, sonido, vibración)</li>
            <li>Fecha de primer uso de la aplicación</li>
          </ul>
          
          <h4>Uso de la Información</h4>
          <p>Esta información se utiliza únicamente para:</p>
          <ul>
            <li>Guardar tu progreso y permitirte continuar donde lo dejaste</li>
            <li>Personalizar tu experiencia según tus preferencias</li>
            <li>Mostrar estadísticas de tu rendimiento</li>
          </ul>
          
          <h4>Almacenamiento de Datos</h4>
          <p>Todos los datos se almacenan localmente en tu dispositivo usando localStorage. No enviamos ninguna información a servidores externos.</p>
          
          <h4>Tus Derechos</h4>
          <p>Puedes eliminar todos tus datos en cualquier momento desde la sección "Mi Progreso" usando el botón "Reiniciar Progreso".</p>
          
          <h4>Contacto</h4>
          <p>Si tienes preguntas sobre esta política, puedes contactarnos a través de las tiendas de aplicaciones donde descargaste RD Quiz.</p>
        `
      },
      terms: {
        title: '📄 Términos de Uso',
        content: `
          <h4>Aceptación de Términos</h4>
          <p>Al usar RD Quiz, aceptas estos términos de uso. Si no estás de acuerdo, por favor no uses la aplicación.</p>
          
          <h4>Uso Permitido</h4>
          <p>RD Quiz es una aplicación educativa gratuita diseñada para:</p>
          <ul>
            <li>Aprender sobre la geografía, historia y cultura de República Dominicana</li>
            <li>Entretenimiento educativo personal</li>
          </ul>
          
          <h4>Contenido</h4>
          <p>Nos esforzamos por proporcionar información precisa y actualizada. Sin embargo, no garantizamos la exactitud completa de todo el contenido. La información presentada tiene fines educativos.</p>
          
          <h4>Propiedad Intelectual</h4>
          <p>Todo el contenido de RD Quiz, incluyendo textos, imágenes, diseño y código, está protegido por derechos de autor.</p>
          
          <h4>Modificaciones</h4>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.</p>
        `
      },
      about: {
        title: 'ℹ️ Acerca de RD Quiz',
        content: `
          <h4>Nuestra Misión</h4>
          <p>RD Quiz nace del deseo de promover el conocimiento sobre República Dominicana de una manera divertida e interactiva.</p>
          
          <h4>¿Qué Puedes Aprender?</h4>
          <ul>
            <li>🗺️ Las 32 provincias y sus ubicaciones</li>
            <li>🦸 Personajes históricos importantes</li>
            <li>🏛️ Presidentes de la República</li>
            <li>📅 Fechas históricas significativas</li>
            <li>📜 Artículos de la Constitución</li>
            <li>🏅 Escudos municipales</li>
            <li>Y mucho más...</li>
          </ul>
          
          <h4>Características</h4>
          <ul>
            <li>✅ 12 categorías de preguntas</li>
            <li>✅ Sistema de vidas y puntuación</li>
            <li>✅ Inmunidad diaria de 30 minutos</li>
            <li>✅ Modo oscuro</li>
            <li>✅ Funciona sin conexión</li>
          </ul>
          
          <h4>Versión</h4>
          <p>RD Quiz v1.0.0</p>
          <p>Hecho con ❤️ en República Dominicana</p>
        `
      }
    };
    
    const policy = policies[type];
    policyTitle.textContent = policy.title;
    policyContent.innerHTML = policy.content;
    policyModal.classList.remove('hidden');
  }

  /**
   * Oculta el modal de política
   */
  hidePolicyModal() {
    document.getElementById('policy-modal').classList.add('hidden');
  }

  // ==================== TIENDA Y ANUNCIOS ====================

  /**
   * Muestra la pantalla de tienda
   */
  showStore() {
    // Actualizar monedas
    document.getElementById('store-coins').textContent = storage.getCoins();
    
    // Mostrar/ocultar estado premium
    const premiumStatus = document.getElementById('premium-status');
    if (storage.isPremium()) {
      premiumStatus.classList.remove('hidden');
      document.getElementById('premium-days-left').textContent = storage.getPremiumDaysLeft();
    } else {
      premiumStatus.classList.add('hidden');
    }
    
    this.showScreen('store');
  }

  /**
   * Compra vidas con monedas
   */
  buyLives(quantity, cost) {
    if (storage.getLives() >= this.MAX_LIVES) {
      this.showToast('¡Ya tienes las vidas al máximo!', '❤️');
      return;
    }

    const currentCoins = storage.getCoins();
    if (currentCoins < cost) {
      this.showToast(`Necesitas ${cost} monedas. Tienes ${currentCoins}`, '🪙');
      return;
    }

    const result = storage.buyLivesWithCoins(quantity, cost);
    if (result === true) {
      this.showToast(`¡Compraste ${quantity} vida${quantity > 1 ? 's' : ''}!`, '❤️');
      document.getElementById('store-coins').textContent = storage.getCoins();
      this.updateLivesDisplay();
    }
  }

  /**
   * Compra suscripción premium (simulado)
   */
  purchasePremium(months) {
    // En producción, esto conectaría con Google Play / App Store
    const prices = { 1: 4.99, 12: 39.99 };
    const price = prices[months];
    
    this.showModal(
      '👑 Confirmar Compra',
      `¿Deseas suscribirte por ${months === 1 ? '1 mes' : '1 año'} por $${price}?<br><br><small>Nota: Esta es una simulación. En la versión final se conectará con la tienda de aplicaciones.</small>`,
      () => {
        storage.activatePremium(months);
        this.showToast('¡Bienvenido a Premium!', '👑');
        this.showStore(); // Actualizar UI
        this.updateLivesDisplay();
        this.updateAdsVisibility();
      }
    );
  }

  /**
   * Compra monedas (simulado)
   */
  purchaseCoins(amount, price) {
    // En producción, esto conectaría con Google Play / App Store
    this.showModal(
      '🪙 Confirmar Compra',
      `¿Deseas comprar ${amount} monedas por $${price}?<br><br><small>Nota: Esta es una simulación. En la versión final se conectará con la tienda de aplicaciones.</small>`,
      () => {
        storage.addCoins(amount);
        this.showToast(`¡Obtuviste ${amount} monedas!`, '🪙');
        document.getElementById('store-coins').textContent = storage.getCoins();
      }
    );
  }

  /**
   * Ver anuncio para obtener monedas
   */
  watchAdForCoins() {
    // Crear modal de anuncio
    let adModal = document.getElementById('ad-interstitial');
    if (!adModal) {
      adModal = document.createElement('div');
      adModal.id = 'ad-interstitial';
      adModal.className = 'ad-interstitial';
      adModal.innerHTML = `
        <div class="ad-interstitial-content">
          <h3>📺 Anuncio</h3>
          <p>Gracias por ver este anuncio.</p>
          <p>En la versión final aquí aparecerá un video publicitario.</p>
          <div style="font-size: 3rem; margin: 1rem 0;">🎬</div>
        </div>
        <p class="ad-close-timer">Podrás cerrar en <span id="ad-timer">5</span> segundos</p>
        <button class="btn-close-ad hidden" id="btn-close-ad">Cerrar y obtener 🪙 10</button>
      `;
      document.body.appendChild(adModal);
    }
    
    adModal.classList.remove('hidden');
    const closeBtn = document.getElementById('btn-close-ad');
    const timerSpan = document.getElementById('ad-timer');
    closeBtn.classList.add('hidden');
    
    let countdown = 5;
    timerSpan.textContent = countdown;
    
    const timer = setInterval(() => {
      countdown--;
      timerSpan.textContent = countdown;
      
      if (countdown <= 0) {
        clearInterval(timer);
        closeBtn.classList.remove('hidden');
        document.querySelector('.ad-close-timer').textContent = '¡Anuncio completado!';
      }
    }, 1000);
    
    // Evento de cierre (solo una vez)
    closeBtn.onclick = () => {
      adModal.classList.add('hidden');
      storage.addCoins(10);
      this.showToast('¡Obtuviste 10 monedas!', '🪙');
      document.getElementById('store-coins').textContent = storage.getCoins();
      // Resetear timer text
      document.querySelector('.ad-close-timer').innerHTML = 'Podrás cerrar en <span id="ad-timer">5</span> segundos';
    };
  }

  /**
   * Restaurar compras
   */
  restorePurchases() {
    // En producción, esto verificaría las compras en la tienda
    this.showToast('Verificando compras...', '🔄');
    
    setTimeout(() => {
      if (storage.isPremium()) {
        this.showToast('Suscripción Premium restaurada', '👑');
      } else {
        this.showToast('No se encontraron compras para restaurar', 'ℹ️');
      }
    }, 1500);
  }

  /**
   * Actualiza la visibilidad de anuncios según estado premium
   */
  updateAdsVisibility() {
    const adBanners = document.querySelectorAll('.ad-banner');
    const isPremium = storage.isPremium();
    
    adBanners.forEach(banner => {
      if (isPremium) {
        banner.classList.add('hidden');
      } else {
        banner.classList.remove('hidden');
      }
    });
  }

  /**
   * Muestra un modal de confirmación con callback
   */
  showModal(title, message, onConfirm) {
    this.modal.title.textContent = title;
    this.modal.message.innerHTML = message;
    this.modal.container.classList.remove('hidden');
    
    // Configurar confirmación
    this.modal.confirm.onclick = () => {
      this.hideModal();
      if (onConfirm) onConfirm();
    };
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new RDQuizApp();
});
