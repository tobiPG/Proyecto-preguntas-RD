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

    // Configuración
    this.QUESTION_TIME = 15000; // 15 segundos
    this.POINTS_CORRECT = 10;
    this.STREAK_BONUS = 2;

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
    this.loadMap();
    this.registerServiceWorker();
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
      stats: document.getElementById('stats-screen')
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
    document.getElementById('btn-retry').addEventListener('click', () => this.startQuiz(this.currentCategory));
    document.getElementById('btn-home').addEventListener('click', () => this.showScreen('home'));

    // Reset stats
    document.getElementById('btn-reset-stats').addEventListener('click', () => this.confirmReset());

    // Modal
    this.modal.cancel.addEventListener('click', () => this.hideModal());
    this.modal.container.addEventListener('click', (e) => {
      if (e.target === this.modal.container) this.hideModal();
    });
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
  startQuiz(category) {
    this.currentCategory = category;
    this.questions = questionGenerator.generateQuestions(category, 10);
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timeBonus = 0;

    // Actualizar UI
    const categoryInfo = CATEGORIES[category] || { name: 'Modo Aleatorio', icon: '🎲' };
    this.quizElements.categoryName.textContent = categoryInfo.name;
    this.quizElements.score.textContent = '0';

    this.showScreen('quiz');
    this.showQuestion();
  }

  /**
   * Muestra la pregunta actual
   */
  showQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResults();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    this.isAnswered = false;

    // Actualizar progreso
    this.quizElements.progress.textContent = `${this.currentQuestionIndex + 1} / ${this.questions.length}`;

    // Ocultar elementos
    this.quizElements.mapContainer.classList.add('hidden');
    this.quizElements.imageContainer.classList.add('hidden');
    this.quizElements.feedbackContainer.classList.add('hidden');
    this.quizElements.btnNext.classList.add('hidden');
    this.quizElements.questionHint.classList.add('hidden');

    // Mostrar imagen si tiene imagen (provincias, superficie)
    if (question.image) {
      this.quizElements.imageContainer.classList.remove('hidden');
      this.quizElements.questionImage.src = question.image;
      this.quizElements.questionImage.alt = 'Provincia destacada en el mapa';
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
      this.showFeedback(false, question);
    }

    // Actualizar score display
    this.quizElements.score.textContent = this.score;

    // Actualizar mapa si es provincia
    if (question.type === 'provincias' && question.provinceId) {
      this.updateProvinceStatus(question.provinceId, isCorrect);
    }

    // Mostrar botón siguiente
    this.quizElements.btnNext.classList.remove('hidden');

    // Vibración (si está habilitada)
    if (storage.getSettings().vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(isCorrect ? [50] : [100, 50, 100]);
    }
  }

  /**
   * Muestra feedback de la respuesta
   */
  showFeedback(isCorrect, question) {
    this.quizElements.feedbackContainer.classList.remove('hidden', 'correct', 'wrong');
    this.quizElements.feedbackContainer.classList.add(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      this.quizElements.feedbackIcon.textContent = '✅';
      this.quizElements.feedbackText.textContent = '¡Correcto!';
      if (this.streak > 1) {
        this.quizElements.feedbackDetail.textContent = `🔥 Racha de ${this.streak}`;
      } else {
        this.quizElements.feedbackDetail.textContent = question.detail || '';
      }
    } else {
      this.quizElements.feedbackIcon.textContent = '❌';
      this.quizElements.feedbackText.textContent = 'Incorrecto';
      this.quizElements.feedbackDetail.textContent = `La respuesta era: ${question.correctAnswer}`;
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

      const question = this.questions[this.currentQuestionIndex];

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
      this.quizElements.feedbackDetail.textContent = `La respuesta era: ${question.correctAnswer}`;

      this.quizElements.btnNext.classList.remove('hidden');

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
    this.resultsElements.score.textContent = this.score;
    this.resultsElements.message.textContent = resultConfig.message;
    this.resultsElements.correct.textContent = this.correctCount;
    this.resultsElements.wrong.textContent = this.wrongCount;
    this.resultsElements.timeBonus.textContent = `+${this.timeBonus}`;
    this.resultsElements.streak.textContent = storage.getStats().dailyStreak;

    // Verificar logros nuevos
    const newAchievements = storage.checkAchievements();
    if (newAchievements.length > 0) {
      setTimeout(() => {
        this.showToast(`🏆 ¡Logro desbloqueado: ${newAchievements[0].name}!`);
      }, 1000);
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
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new RDQuizApp();
});
