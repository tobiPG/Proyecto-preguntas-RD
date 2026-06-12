/**
 * RD Quiz - Sistema de Sonidos
 * Efectos de sonido generados con Web Audio API (sin archivos externos)
 */

class SoundManager {
  constructor() {
    this.ctx = null;
  }

  /**
   * Obtiene (o crea) el contexto de audio.
   * Se crea de forma diferida porque algunos navegadores requieren
   * un gesto del usuario antes de permitir audio.
   */
  getContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!this.ctx) {
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  isEnabled() {
    return storage.getSettings().soundEnabled;
  }

  /**
   * Reproduce un tono simple con envolvente de volumen.
   */
  playTone(frequency, startTime, duration, type = 'sine', volume = 0.2) {
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const start = ctx.currentTime + startTime;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  /** Respuesta correcta: dos notas ascendentes */
  playCorrect() {
    if (!this.isEnabled()) return;
    this.playTone(987.77, 0, 0.12, 'sine', 0.2);
    this.playTone(1318.51, 0.1, 0.2, 'sine', 0.2);
  }

  /** Respuesta incorrecta o tiempo agotado: tono descendente */
  playWrong() {
    if (!this.isEnabled()) return;
    this.playTone(220, 0, 0.15, 'square', 0.12);
    this.playTone(165, 0.12, 0.25, 'square', 0.12);
  }

  /** Logro desbloqueado: pequeño arpegio triunfal */
  playAchievement() {
    if (!this.isEnabled()) return;
    this.playTone(523.25, 0, 0.12, 'triangle', 0.2);
    this.playTone(659.25, 0.1, 0.12, 'triangle', 0.2);
    this.playTone(783.99, 0.2, 0.12, 'triangle', 0.2);
    this.playTone(1046.5, 0.3, 0.25, 'triangle', 0.2);
  }
}

// Instancia global
window.sounds = new SoundManager();
