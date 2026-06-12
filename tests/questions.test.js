'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createAppContext } = require('./helpers/app-context');

const ctx = createAppContext();
const { QuestionGenerator, RD_DATA, CATEGORIES } = ctx;

const CATEGORY_IDS = Object.keys(CATEGORIES);

function validateQuestion(category, q) {
  assert.ok(typeof q.question === 'string' && q.question.length > 0,
    `[${category}] pregunta sin texto`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2,
    `[${category}] "${q.question}" debe tener al menos 2 opciones`);
  assert.ok(q.options.includes(q.correctAnswer),
    `[${category}] "${q.question}" -> correctAnswer "${q.correctAnswer}" no está en options ${JSON.stringify(q.options)}`);
  assert.strictEqual(new Set(q.options).size, q.options.length,
    `[${category}] "${q.question}" tiene opciones duplicadas: ${JSON.stringify(q.options)}`);
  for (const opt of q.options) {
    assert.ok(opt !== undefined && opt !== null,
      `[${category}] "${q.question}" tiene una opción undefined/null`);
    assert.notStrictEqual(String(opt), 'NaN',
      `[${category}] "${q.question}" tiene una opción NaN`);
  }
}

test('generateQuestions devuelve 5 preguntas válidas por categoría (muestreo)', () => {
  const gen = new QuestionGenerator();
  const RUNS = 100;

  for (const category of CATEGORY_IDS) {
    for (let i = 0; i < RUNS; i++) {
      const questions = gen.generateQuestions(category, 5);
      assert.strictEqual(questions.length, 5, `[${category}] debe devolver 5 preguntas`);
      for (const q of questions) {
        validateQuestion(category, q);
      }
    }
  }
});

test('generateQuestions("random") devuelve preguntas válidas mezclando categorías', () => {
  const gen = new QuestionGenerator();
  for (let i = 0; i < 50; i++) {
    const questions = gen.generateQuestions('random', 5);
    assert.strictEqual(questions.length, 5);
    for (const q of questions) {
      validateQuestion('random', q);
    }
  }
});

// ===== Regresiones específicas =====

test('Danilo Medina fue presidente 2 veces (2012-2016, 2016-2020)', () => {
  const danilo = RD_DATA.presidentes.find(p => p.nombre === 'Danilo Medina');
  assert.strictEqual(danilo.periodos.length, 2);

  const gen = new QuestionGenerator();
  let found = null;
  for (let i = 0; i < 500 && !found; i++) {
    const qs = gen.generateQuestions('presidentes', 5);
    found = qs.find(q => q.question === '¿Cuántas veces fue presidente Danilo Medina?');
  }
  assert.ok(found, 'no se generó la pregunta de Danilo Medina en 500 intentos');
  assert.strictEqual(found.correctAnswer, '2 veces');
});

test('Leonel Fernández fue presidente 3 veces (1996-2000, 2004-2008, 2008-2012)', () => {
  const leonel = RD_DATA.presidentes.find(p => p.nombre === 'Leonel Fernández');
  assert.strictEqual(leonel.periodos.length, 3);
});

test('Presidentes Tipo 7: sucesión cronológica correcta (Danilo Medina -> Luis Abinader)', () => {
  const gen = new QuestionGenerator();
  let found = null;
  for (let i = 0; i < 500 && !found; i++) {
    const qs = gen.generateQuestions('presidentes', 5);
    found = qs.find(q => q.question.includes('después de Danilo Medina (2016-2020)'));
  }
  assert.ok(found, 'no se generó la pregunta de sucesión de Danilo Medina en 500 intentos');
  assert.strictEqual(found.correctAnswer, 'Luis Abinader');
});

test('Presidentes Tipo 7: nunca se pregunta por el sucesor de Luis Abinader (es el actual)', () => {
  const gen = new QuestionGenerator();
  for (let i = 0; i < 500; i++) {
    const qs = gen.generateQuestions('presidentes', 5);
    for (const q of qs) {
      assert.ok(!q.question.includes('después de Luis Abinader'),
        'Abinader es el presidente actual, no debería tener sucesor');
    }
  }
});

test('Personajes Tipo 7: nunca compara un personaje consigo mismo', () => {
  const gen = new QuestionGenerator();
  for (let i = 0; i < 300; i++) {
    const qs = gen.generateQuestions('personajes', 5);
    for (const q of qs) {
      if (q.question === '¿Cuál de estos dos personajes nació primero?') {
        assert.notStrictEqual(q.options[0], q.options[1]);
      }
    }
  }
});

test('Fechas: incluye preguntas de días patrios (festividades sin año)', () => {
  const gen = new QuestionGenerator();
  let found = false;
  for (let i = 0; i < 300 && !found; i++) {
    const qs = gen.generateQuestions('fechas', 5);
    found = qs.some(q => q.question.startsWith('¿En qué fecha se celebra'));
  }
  assert.ok(found, 'no se generó una pregunta de día patrio en 300 intentos');
});

test('Fechas: incluye preguntas de período histórico (categoría)', () => {
  const gen = new QuestionGenerator();
  let found = false;
  for (let i = 0; i < 300 && !found; i++) {
    const qs = gen.generateQuestions('fechas', 5);
    found = qs.some(q => q.question.includes('período histórico pertenece'));
  }
  assert.ok(found, 'no se generó una pregunta de período histórico en 300 intentos');
});

test('Leyes: incluye preguntas de identificación de frase del artículo', () => {
  const gen = new QuestionGenerator();
  let found = false;
  for (let i = 0; i < 300 && !found; i++) {
    const qs = gen.generateQuestions('leyes', 5);
    found = qs.some(q => q.question.includes('frases corresponde al Artículo'));
  }
  assert.ok(found, 'no se generó una pregunta de frase en 300 intentos');
});

test('Provincias: con recentIds, evita repetir sujetos recientes mientras haya opciones frescas', () => {
  const gen = new QuestionGenerator();
  const allIds = RD_DATA.provincias.map(p => p.id);
  // Marcar todas menos 5 como "recientes"
  const recentIds = allIds.slice(0, allIds.length - 5);

  const qs = gen.generateQuestions('provincias', 5, recentIds);
  assert.strictEqual(qs.length, 5);
  for (const q of qs) {
    assert.ok(!recentIds.includes(q.provinceId),
      `la provincia ${q.provinceId} está en el historial reciente`);
  }
});

test('Escudos: con recentIds, evita repetir sujetos recientes mientras haya opciones frescas', () => {
  const gen = new QuestionGenerator();
  const allIds = RD_DATA.provincias.map(p => p.id);
  const recentIds = allIds.slice(0, allIds.length - 5);

  const qs = gen.generateQuestions('escudos', 5, recentIds);
  assert.strictEqual(qs.length, 5);
  for (const q of qs) {
    assert.ok(!recentIds.includes(q.provinceId),
      `el escudo ${q.provinceId} está en el historial reciente`);
  }
});

test('Regiones: incluye preguntas de provincia más poblada y mayor superficie', () => {
  const gen = new QuestionGenerator();
  let foundPoblada = false;
  let foundSuperficie = false;
  for (let i = 0; i < 300 && !(foundPoblada && foundSuperficie); i++) {
    const qs = gen.generateQuestions('regiones', 5);
    foundPoblada = foundPoblada || qs.some(q => q.question.includes('más poblada'));
    foundSuperficie = foundSuperficie || qs.some(q => q.question.includes('mayor superficie'));
  }
  assert.ok(foundPoblada, 'no se generó una pregunta de provincia más poblada en 300 intentos');
  assert.ok(foundSuperficie, 'no se generó una pregunta de mayor superficie en 300 intentos');
});
