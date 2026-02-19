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
        totalScore: 0
      },
      // Progreso por categoría
      categoryProgress: {
        provincias: { played: 0, correct: 0, mastered: [] },
        personajes: { played: 0, correct: 0, mastered: [] },
        presidentes: { played: 0, correct: 0, mastered: [] },
        periodos: { played: 0, correct: 0, mastered: [] },
        leyes: { played: 0, correct: 0, mastered: [] },
        fechas: { played: 0, correct: 0, mastered: [] }
      },
      // Racha diaria
      dailyStreak: {
        count: 0,
        lastPlayedDate: null
      },
      // Logros desbloqueados
      achievements: [],
      // Configuración
      settings: {
        soundEnabled: true,
        vibrationEnabled: true,
        timerEnabled: true
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
        if (progress >= req.percent) {
          unlocked = true;
        }
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
}

// Instancia global
window.storage = new StorageManager();
