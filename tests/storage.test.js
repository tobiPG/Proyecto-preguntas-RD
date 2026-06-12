'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createAppContext } = require('./helpers/app-context');

function freshStorage() {
  const ctx = createAppContext();
  return new ctx.StorageManager();
}

test('estado inicial: 5 vidas, 0 monedas', () => {
  const storage = freshStorage();
  assert.strictEqual(storage.getLives(), 5);
  assert.strictEqual(storage.getCoins(), 0);
});

test('recordGame actualiza estadísticas y progreso de categoría', () => {
  const storage = freshStorage();
  storage.recordGame('provincias', 8, 2, 80, 8);

  const stats = storage.getStats();
  assert.strictEqual(stats.gamesPlayed, 1);
  assert.strictEqual(stats.totalCorrect, 8);
  assert.strictEqual(stats.totalWrong, 2);
  assert.strictEqual(stats.bestStreak, 8);
  assert.strictEqual(stats.accuracy, 80);

  assert.strictEqual(storage.data.categoryProgress.provincias.played, 1);
  assert.strictEqual(storage.data.categoryProgress.provincias.correct, 8);
});

test('getCategoryProgress calcula porcentaje sobre 10 preguntas por partida', () => {
  const storage = freshStorage();
  storage.recordGame('leyes', 10, 0, 100, 10);
  assert.strictEqual(storage.getCategoryProgress('leyes'), 100);

  // 2da partida: total correctas=15, total preguntas=20 -> 75%
  storage.recordGame('leyes', 5, 5, 50, 5);
  assert.strictEqual(storage.getCategoryProgress('leyes'), 75);
});

test('monedas: agregar y gastar', () => {
  const storage = freshStorage();
  storage.addCoins(100);
  assert.strictEqual(storage.getCoins(), 100);

  assert.strictEqual(storage.spendCoins(30), true);
  assert.strictEqual(storage.getCoins(), 70);

  assert.strictEqual(storage.spendCoins(1000), false);
  assert.strictEqual(storage.getCoins(), 70);
});

test('vidas: perder y restaurar', () => {
  const storage = freshStorage();
  assert.strictEqual(storage.getLives(), 5);

  storage.loseLife();
  storage.loseLife();
  assert.strictEqual(storage.getLives(), 3);

  storage.refillLives();
  assert.strictEqual(storage.getLives(), 5);
});

test('vidas: no bajan de 0', () => {
  const storage = freshStorage();
  for (let i = 0; i < 10; i++) storage.loseLife();
  assert.strictEqual(storage.getLives(), 0);
});

test('inmunidad: se puede activar solo una vez al día', () => {
  const storage = freshStorage();
  assert.strictEqual(storage.canActivateImmunity(), true);
  assert.strictEqual(storage.activateImmunity(), true);
  assert.strictEqual(storage.isImmunityActive(), true);

  assert.strictEqual(storage.canActivateImmunity(), false);
  assert.strictEqual(storage.activateImmunity(), false);
});

test('inmunidad: loseLife no resta vidas mientras está activa', () => {
  const storage = freshStorage();
  storage.activateImmunity();
  storage.loseLife();
  assert.strictEqual(storage.getLives(), 5);
});

test('códigos de promoción: un código válido otorga monedas una sola vez', () => {
  const storage = freshStorage();

  const first = storage.redeemPromoCode('bienvenido');
  assert.strictEqual(first.success, true);
  assert.strictEqual(storage.getCoins(), first.coins);

  const second = storage.redeemPromoCode('BIENVENIDO');
  assert.strictEqual(second.success, false);
  assert.strictEqual(storage.getCoins(), first.coins);
});

test('códigos de promoción: un código inválido no otorga monedas', () => {
  const storage = freshStorage();
  const result = storage.redeemPromoCode('NOEXISTE');
  assert.strictEqual(result.success, false);
  assert.strictEqual(storage.getCoins(), 0);
});

test('racha diaria: incrementa si jugó ayer, se reinicia si pasó más de un día', () => {
  const storage = freshStorage();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  storage.data.dailyStreak = { count: 3, lastPlayedDate: yesterday.toDateString() };
  assert.strictEqual(storage.updateDailyStreak(), 4);

  // Jugar otra vez el mismo día no cambia la racha
  assert.strictEqual(storage.updateDailyStreak(), 4);

  // Racha rota (última partida hace 5 días)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  storage.data.dailyStreak = { count: 10, lastPlayedDate: fiveDaysAgo.toDateString() };
  assert.strictEqual(storage.updateDailyStreak(), 1);
});

test('logros: first_game se desbloquea tras la primera partida', () => {
  const storage = freshStorage();
  storage.recordGame('provincias', 5, 5, 50, 5);

  const achievements = storage.getAchievements();
  const firstGame = achievements.find(a => a.id === 'first_game');
  assert.ok(firstGame.unlocked);
});

test('persistencia: los datos se mantienen entre instancias usando el mismo localStorage', () => {
  const ctx = createAppContext();
  const storage1 = new ctx.StorageManager();
  storage1.addCoins(50);

  const storage2 = new ctx.StorageManager();
  assert.strictEqual(storage2.getCoins(), 50);
});

test('reset restaura el estado por defecto', () => {
  const storage = freshStorage();
  storage.addCoins(100);
  storage.loseLife();
  storage.reset();

  assert.strictEqual(storage.getCoins(), 0);
  assert.strictEqual(storage.getLives(), 5);
});
