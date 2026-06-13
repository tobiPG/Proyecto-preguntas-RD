/**
 * RD Quiz - Sistema de Almacenamiento
 * Manejo de progreso, estadísticas y logros
 */

class StorageManager {
  constructor() {
    this.STORAGE_KEY = 'rdquiz_data';
    this.data = this.load();
  }

  /**
   * Estructura inicial de datos
   */
  getDefaultData() {
    return {
      // Estadísticas generales
      stats: {
        gamesPlayed: 0,
        totalCorrect: 0,
        totalWrong: 0,
        bestStreak: 0,
        currentStreak: 0,
        totalScore: 0,
        totalCoinsEarned: 0
      },
      // Progreso por categoría
      categoryProgress: {
        provincias: { played: 0, correct: 0, mastered: [] },
        datosProvincias: { played: 0, correct: 0, mastered: [] },
        personajes: { played: 0, correct: 0, mastered: [] },
        presidentes: { played: 0, correct: 0, mastered: [] },
        periodos: { played: 0, correct: 0, mastered: [] },
        leyes: { played: 0, correct: 0, mastered: [] },
        fechas: { played: 0, correct: 0, mastered: [] },
        regiones: { played: 0, correct: 0, mastered: [] },
        superficie: { played: 0, correct: 0, mastered: [] },
        escudos: { played: 0, correct: 0, mastered: [] },
        municipios: { played: 0, correct: 0, mastered: [] },
        fundaciones: { played: 0, correct: 0, mastered: [] },
        escudosMunicipios: { played: 0, correct: 0, mastered: [] }
      },
      // Racha diaria
      dailyStreak: {
        count: 0,
        lastPlayedDate: null
      },
      // Sistema de vidas
      lives: {
        current: 5,
        max: 5,
        lastRefillDate: new Date().toDateString()
      },
      // Inmunidad (30 min sin perder vidas, una vez al día)
      immunity: {
        activeUntil: null,
        lastUsedDate: null,
        durationMinutes: 30
      },
      // Logros desbloqueados
      achievements: [],
      // Configuración
      settings: {
        soundEnabled: true,
        volume: 80,
        vibrationEnabled: true,
        timerEnabled: true,
        darkMode: false
      },
      // Monedas del juego (para comprar vidas)
      coins: 0,
      // Códigos de promoción ya canjeados
      redeemedCodes: [],
      // Historial de IDs usados recientemente (evita repeticiones seguidas)
      questionHistory: {
        provincias: [],
        escudos: []
      },
      // Fecha de primer uso
      firstUsed: new Date().toISOString()
    };
  }

  /**
   * Carga datos del localStorage
   */
  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge con datos por defecto para asegurar estructura completa
        return this.mergeWithDefaults(parsed);
      }
    } catch (e) {
      console.warn('Error loading data:', e);
    }
    return this.getDefaultData();
  }

  /**
   * Combina datos guardados con estructura por defecto
   */
  mergeWithDefaults(saved) {
    const defaults = this.getDefaultData();
    return {
      stats: { ...defaults.stats, ...saved.stats },
      categoryProgress: {
        ...defaults.categoryProgress,
        ...Object.fromEntries(
          Object.keys(defaults.categoryProgress).map(key => [
            key,
            { ...defaults.categoryProgress[key], ...(saved.categoryProgress?.[key] || {}) }
          ])
        )
      },
      dailyStreak: { ...defaults.dailyStreak, ...saved.dailyStreak },
      lives: { ...defaults.lives, ...(saved.lives || {}) },
      immunity: { ...defaults.immunity, ...(saved.immunity || {}) },
      coins: saved.coins || defaults.coins,
      redeemedCodes: saved.redeemedCodes || defaults.redeemedCodes,
      questionHistory: {
        ...defaults.questionHistory,
        ...(saved.questionHistory || {})
      },
      achievements: saved.achievements || [],
      settings: { ...defaults.settings, ...saved.settings },
      firstUsed: saved.firstUsed || defaults.firstUsed
    };
  }

  /**
   * Guarda datos en localStorage
   */
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Error saving data:', e);
    }
  }

  /**
   * Actualiza la racha diaria
   */
  updateDailyStreak() {
    const today = new Date().toDateString();
    const lastPlayed = this.data.dailyStreak.lastPlayedDate;

    if (lastPlayed === today) {
      // Ya jugó hoy
      return this.data.dailyStreak.count;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastPlayed === yesterday.toDateString()) {
      // Jugó ayer, incrementar racha
      this.data.dailyStreak.count++;
    } else if (lastPlayed !== today) {
      // Racha rota, reiniciar
      this.data.dailyStreak.count = 1;
    }

    this.data.dailyStreak.lastPlayedDate = today;
    this.save();
    return this.data.dailyStreak.count;
  }

  /**
   * Registra el resultado de una partida
   */
  recordGame(category, correctCount, wrongCount, score, streak) {
    // Actualizar estadísticas generales
    this.data.stats.gamesPlayed++;
    this.data.stats.totalCorrect += correctCount;
    this.data.stats.totalWrong += wrongCount;
    this.data.stats.totalScore += score;

    if (streak > this.data.stats.bestStreak) {
      this.data.stats.bestStreak = streak;
    }

    // Actualizar progreso de categoría
    if (category !== 'random' && this.data.categoryProgress[category]) {
      this.data.categoryProgress[category].played++;
      this.data.categoryProgress[category].correct += correctCount;
    }

    // Actualizar racha diaria
    this.updateDailyStreak();

    // Verificar logros
    this.checkAchievements();

    this.save();
  }

  /**
   * Calcula el porcentaje de progreso de una categoría
   */
  getCategoryProgress(category) {
    const progress = this.data.categoryProgress[category];
    if (!progress || progress.played === 0) return 0;

    // Porcentaje basado en respuestas correctas vs jugadas
    const totalQuestions = progress.played * 10; // 10 preguntas por partida
    return Math.min(100, Math.round((progress.correct / totalQuestions) * 100));
  }

  /**
   * Obtiene estadísticas generales
   */
  getStats() {
    return {
      ...this.data.stats,
      dailyStreak: this.data.dailyStreak.count,
      accuracy: this.data.stats.totalCorrect + this.data.stats.totalWrong > 0
        ? Math.round((this.data.stats.totalCorrect / (this.data.stats.totalCorrect + this.data.stats.totalWrong)) * 100)
        : 0
    };
  }

  /**
   * Verifica y otorga logros
   */
  checkAchievements() {
    const newAchievements = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (this.data.achievements.includes(achievement.id)) return;

      const req = achievement.requirement;
      let unlocked = false;

      if (req.gamesPlayed && this.data.stats.gamesPlayed >= req.gamesPlayed) {
        unlocked = true;
      }
      if (req.streak && this.data.stats.bestStreak >= req.streak) {
        unlocked = true;
      }
      if (req.totalCorrect && this.data.stats.totalCorrect >= req.totalCorrect) {
        unlocked = true;
      }
      if (req.dailyStreak && this.data.dailyStreak.count >= req.dailyStreak) {
        unlocked = true;
      }
      if (req.category && req.percent) {
        const progress = this.getCategoryProgress(req.category);
        if (progress >= req.percent) unlocked = true;
      }
      if (req.totalCoinsEarned && (this.data.stats.totalCoinsEarned || 0) >= req.totalCoinsEarned) {
        unlocked = true;
      }
      if (req.achievementsCount && this.data.achievements.length >= req.achievementsCount) {
        unlocked = true;
      }

      if (unlocked) {
        this.data.achievements.push(achievement.id);
        newAchievements.push(achievement);
      }
    });

    return newAchievements;
  }

  /**
   * Obtiene logros con estado
   */
  getAchievements() {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: this.data.achievements.includes(a.id)
    }));
  }

  /**
   * Reinicia todo el progreso
   */
  reset() {
    this.data = this.getDefaultData();
    this.save();
  }

  /**
   * Obtiene configuración
   */
  getSettings() {
    return this.data.settings;
  }

  /**
   * Actualiza configuración
   */
  updateSettings(settings) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.save();
  }

  // ===== SISTEMA DE VIDAS =====

  /**
   * Obtiene las vidas actuales
   */
  getLives() {
    // Verificar si es un nuevo día para restaurar vidas
    const today = new Date().toDateString();
    if (this.data.lives.lastRefillDate !== today) {
      this.data.lives.current = this.data.lives.max;
      this.data.lives.lastRefillDate = today;
      this.save();
    }
    return this.data.lives.current;
  }

  /**
   * Restaura todas las vidas (para testing o compras)
   */
  refillLives() {
    this.data.lives.current = this.data.lives.max;
    this.save();
  }

  // ===== SISTEMA DE INMUNIDAD =====

  /**
   * Verifica si la inmunidad está activa
   */
  isImmunityActive() {
    if (!this.data.immunity.activeUntil) return false;
    return new Date() < new Date(this.data.immunity.activeUntil);
  }

  /**
   * Obtiene tiempo restante de inmunidad en minutos
   */
  getImmunityTimeLeft() {
    if (!this.isImmunityActive()) return 0;
    const remaining = new Date(this.data.immunity.activeUntil) - new Date();
    return Math.max(0, remaining);
  }

  /**
   * Verifica si puede activar inmunidad hoy
   */
  canActivateImmunity() {
    const today = new Date().toDateString();
    return this.data.immunity.lastUsedDate !== today;
  }

  /**
   * Activa la inmunidad de 5 minutos
   * @returns {boolean} true si se activó con éxito
   */
  activateImmunity() {
    if (!this.canActivateImmunity()) {
      return false;
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + this.data.immunity.durationMinutes * 60000);
    
    this.data.immunity.activeUntil = endTime.toISOString();
    this.data.immunity.lastUsedDate = now.toDateString();
    this.save();
    return true;
  }

  /**
   * Obtiene estado completo de vidas e inmunidad
   */
  getLifeStatus() {
    return {
      lives: this.getLives(),
      maxLives: this.data.lives.max,
      immunityActive: this.isImmunityActive(),
      immunityTimeLeft: this.getImmunityTimeLeft(),
      canActivateImmunity: this.canActivateImmunity()
    };
  }

  // ===== SISTEMA DE MONEDAS =====

  /**
   * Obtiene las monedas actuales
   */
  getCoins() {
    return this.data.coins || 0;
  }

  /**
   * Añade monedas
   */
  addCoins(amount) {
    this.data.coins = (this.data.coins || 0) + amount;
    this.data.stats.totalCoinsEarned = (this.data.stats.totalCoinsEarned || 0) + amount;
    this.save();
    return this.data.coins;
  }

  /**
   * Gasta monedas si tiene suficientes
   * @returns {boolean} true si pudo gastar
   */
  spendCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  // ===== CÓDIGOS DE PROMOCIÓN =====

  /**
   * Verifica si un código de promoción ya fue canjeado en este dispositivo
   */
  isCodeRedeemed(code) {
    return this.data.redeemedCodes.includes(code.toUpperCase());
  }

  /**
   * Canjea un código de promoción
   * @returns {{success: boolean, message: string, coins?: number}}
   */
  redeemPromoCode(code) {
    const normalized = (code || '').trim().toUpperCase();
    if (!normalized) {
      return { success: false, message: 'Ingresa un código' };
    }

    const promo = PROMO_CODES[normalized];
    if (!promo) {
      return { success: false, message: 'Código no válido' };
    }

    if (!promo.repeatable && this.isCodeRedeemed(normalized)) {
      return { success: false, message: 'Ya canjeaste este código' };
    }

    if (!promo.repeatable) {
      this.data.redeemedCodes.push(normalized);
    }

    if (promo.type === 'lives') {
      this.refillLives();
      return { success: true, message: '¡Código válido! Tus vidas fueron restauradas al máximo' };
    }

    this.addCoins(promo.amount);
    return { success: true, message: `¡Código válido! Obtuviste ${promo.amount} monedas`, coins: promo.amount };
  }

  // ===== HISTORIAL DE PREGUNTAS =====

  /**
   * Obtiene los IDs usados recientemente en una categoría (para evitar repeticiones)
   */
  getQuestionHistory(category) {
    return this.data.questionHistory[category] || [];
  }

  /**
   * Registra los IDs usados en una partida y conserva solo los últimos 30
   */
  addToQuestionHistory(category, ids) {
    const previous = this.data.questionHistory[category] || [];
    this.data.questionHistory[category] = [...previous, ...ids].slice(-30);
    this.save();
  }

  // ===== TIENDA =====

  /**
   * Compra vidas con monedas
   * @param {number} quantity - Cantidad de vidas
   * @param {number} cost - Costo en monedas
   */
  buyLivesWithCoins(quantity, cost) {
    if (this.data.lives.current >= this.data.lives.max) {
      return 'max';
    }
    if (this.spendCoins(cost)) {
      this.data.lives.current = Math.min(
        this.data.lives.current + quantity,
        this.data.lives.max
      );
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Verifica si tiene vidas disponibles
   */
  hasLives() {
    return this.getLives() > 0;
  }

  /**
   * Resta una vida (a menos que tenga inmunidad activa)
   */
  loseLife() {
    // Si tiene inmunidad activa, no pierde vida
    if (this.isImmunityActive()) {
      return this.data.lives.current;
    }
    
    if (this.data.lives.current > 0) {
      this.data.lives.current--;
      this.save();
    }
    return this.data.lives.current;
  }
}

// Instancia global
window.storage = new StorageManager();
