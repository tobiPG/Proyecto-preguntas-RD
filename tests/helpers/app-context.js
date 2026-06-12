/**
 * Carga definitions.js, questions.js y storage.js en un contexto vm aislado,
 * simulando el entorno global del navegador (window, localStorage) para
 * poder probar las clases sin un build system ni un DOM real.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS_DIR = path.join(__dirname, '..', '..', 'js');

function createLocalStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

function createAppContext() {
  const context = {};
  context.window = context;
  context.localStorage = createLocalStorage();
  context.console = console;
  vm.createContext(context);

  for (const file of ['definitions.js', 'questions.js', 'storage.js']) {
    const code = fs.readFileSync(path.join(JS_DIR, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
  }

  // Las clases declaradas con `class` son bindings léxicos del contexto,
  // no propiedades de `window`. Las exponemos explícitamente para poder
  // acceder a ellas (e.g. ctx.QuestionGenerator) desde fuera del vm.
  vm.runInContext(`
    window.QuestionGenerator = QuestionGenerator;
    window.StorageManager = StorageManager;
  `, context, { filename: 'expose-classes.js' });

  return context;
}

module.exports = { createAppContext, createLocalStorage };
