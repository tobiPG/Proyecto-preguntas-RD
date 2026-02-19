/**
 * RD Quiz - Generador de Preguntas
 * Sistema dinámico de generación de preguntas
 */

class QuestionGenerator {
  constructor() {
    this.usedQuestions = new Set();
  }

  /**
   * Reinicia las preguntas usadas
   */
  reset() {
    this.usedQuestions.clear();
  }

  /**
   * Mezcla un array usando Fisher-Yates
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Obtiene opciones aleatorias excluyendo la correcta
   */
  getRandomOptions(correctAnswer, allOptions, count = 3) {
    const filtered = allOptions.filter(opt => opt !== correctAnswer);
    return this.shuffle(filtered).slice(0, count);
  }

  /**
   * Genera preguntas de provincias
   */
  generateProvinciaQuestions(count = 10) {
    const questions = [];
    const provincias = this.shuffle([...RD_DATA.provincias]);
    const allNames = RD_DATA.provincias.map(p => p.nombre);

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const wrongOptions = this.getRandomOptions(provincia.nombre, allNames, 3);
      const options = this.shuffle([provincia.nombre, ...wrongOptions]);

      questions.push({
        type: 'provincias',
        question: '¿Cuál es esta provincia?',
        hint: provincia.dato,
        correctAnswer: provincia.nombre,
        options: options,
        provinceId: provincia.id,
        image: `img/provincias/${provincia.id}.png`,
        detail: `Capital: ${provincia.capital}`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de personajes históricos
   * Preguntas variadas sin imágenes
   */
  generatePersonajesQuestions(count = 10) {
    const questions = [];
    const personajes = this.shuffle([...RD_DATA.personajes]);
    const allNames = RD_DATA.personajes.map(p => p.nombre);
    const allTitulos = RD_DATA.personajes.map(p => p.titulo);

    const questionTypes = [
      // Tipo 1: ¿Quién fue conocido como...?
      (p) => ({
        question: `¿Quién fue conocido como "${p.titulo}"?`,
        hint: `Vivió entre ${p.nacimiento} y ${p.muerte}`,
        correctAnswer: p.nombre,
        options: this.shuffle([p.nombre, ...this.getRandomOptions(p.nombre, allNames, 3)]),
        detail: p.dato
      }),
      // Tipo 2: ¿Qué título tuvo...?
      (p) => ({
        question: `¿Qué título o reconocimiento tuvo ${p.nombre}?`,
        hint: `Nació en ${p.nacimiento}`,
        correctAnswer: p.titulo,
        options: this.shuffle([p.titulo, ...this.getRandomOptions(p.titulo, allTitulos, 3)]),
        detail: p.dato
      }),
      // Tipo 3: ¿En qué año nació...?
      (p) => ({
        question: `¿En qué año nació ${p.nombre}?`,
        hint: `Conocido como ${p.titulo}`,
        correctAnswer: p.nacimiento.toString(),
        options: this.shuffle([
          p.nacimiento.toString(),
          (p.nacimiento - 5).toString(),
          (p.nacimiento + 7).toString(),
          (p.nacimiento - 12).toString()
        ]),
        detail: `${p.nombre} nació en ${p.nacimiento} y murió en ${p.muerte}`
      }),
      // Tipo 4: ¿En qué año murió...?
      (p) => ({
        question: `¿En qué año murió ${p.nombre}?`,
        hint: `Fue conocido como ${p.titulo}`,
        correctAnswer: p.muerte.toString(),
        options: this.shuffle([
          p.muerte.toString(),
          (p.muerte + 4).toString(),
          (p.muerte - 6).toString(),
          (p.muerte + 10).toString()
        ]),
        detail: `${p.nombre} (${p.nacimiento}-${p.muerte})`
      }),
      // Tipo 5: Dato histórico - ¿Quién...?
      (p) => ({
        question: `¿Quién ${p.dato.toLowerCase()}?`,
        hint: `Vivió entre ${p.nacimiento} y ${p.muerte}`,
        correctAnswer: p.nombre,
        options: this.shuffle([p.nombre, ...this.getRandomOptions(p.nombre, allNames, 3)]),
        detail: `${p.nombre} - ${p.titulo}`
      }),
      // Tipo 6: ¿Cuántos años vivió...?
      (p) => {
        const años = p.muerte - p.nacimiento;
        return {
          question: `¿Cuántos años vivió ${p.nombre}?`,
          hint: p.titulo,
          correctAnswer: `${años} años`,
          options: this.shuffle([
            `${años} años`,
            `${años + 5} años`,
            `${años - 8} años`,
            `${años + 12} años`
          ]),
          detail: `${p.nombre} (${p.nacimiento}-${p.muerte})`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, personajes.length); i++) {
      const personaje = personajes[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](personaje);

      questions.push({
        type: 'personajes',
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de presidentes
   * Preguntas variadas sobre mandatarios
   */
  generatePresidentesQuestions(count = 10) {
    const questions = [];
    const presidentes = this.shuffle([...RD_DATA.presidentes]);
    const allNames = RD_DATA.presidentes.map(p => p.nombre);
    const allPartidos = [...new Set(RD_DATA.presidentes.map(p => p.partido))];

    const questionTypes = [
      // Tipo 1: ¿Quién gobernó en el período...?
      (p) => ({
        question: `¿Quién fue presidente en el período ${p.periodos[0]}?`,
        hint: `Partido: ${p.partido}`,
        correctAnswer: p.nombre,
        options: this.shuffle([p.nombre, ...this.getRandomOptions(p.nombre, allNames, 3)]),
        detail: p.dato
      }),
      // Tipo 2: ¿De qué partido era...?
      (p) => ({
        question: `¿A qué partido pertenecía ${p.nombre}?`,
        hint: `Gobernó en ${p.periodos[0]}`,
        correctAnswer: p.partido,
        options: this.shuffle([p.partido, ...this.getRandomOptions(p.partido, allPartidos, 3)]),
        detail: `${p.nombre} - ${p.dato}`
      }),
      // Tipo 3: ¿Cuántas veces fue presidente?
      (p) => ({
        question: `¿Cuántas veces fue presidente ${p.nombre}?`,
        hint: p.dato,
        correctAnswer: `${p.periodos.length} ${p.periodos.length === 1 ? 'vez' : 'veces'}`,
        options: this.shuffle([
          `${p.periodos.length} ${p.periodos.length === 1 ? 'vez' : 'veces'}`,
          `${Math.max(1, p.periodos.length - 1)} ${p.periodos.length - 1 === 1 ? 'vez' : 'veces'}`,
          `${p.periodos.length + 1} veces`,
          `${p.periodos.length + 2} veces`
        ]),
        detail: `Períodos: ${p.periodos.join(', ')}`
      }),
      // Tipo 4: Dato característico - ¿Qué presidente...?
      (p) => ({
        question: `¿Qué presidente ${p.dato.toLowerCase()}?`,
        hint: `Partido: ${p.partido}`,
        correctAnswer: p.nombre,
        options: this.shuffle([p.nombre, ...this.getRandomOptions(p.nombre, allNames, 3)]),
        detail: `${p.nombre} (${p.periodos[0]})`
      }),
      // Tipo 5: ¿Qué presidente pertenecía al partido...?
      (p) => ({
        question: `¿Cuál de estos presidentes pertenecía al partido ${p.partido}?`,
        hint: p.dato,
        correctAnswer: p.nombre,
        options: this.shuffle([
          p.nombre, 
          ...this.getRandomOptions(p.nombre, 
            RD_DATA.presidentes.filter(x => x.partido !== p.partido).map(x => x.nombre), 
            3)
        ]),
        detail: `${p.nombre} - ${p.partido}`
      }),
      // Tipo 6: ¿En qué año inició su primer mandato?
      (p) => {
        const añoInicio = p.periodos[0].split('-')[0];
        return {
          question: `¿En qué año inició ${p.nombre} su primer mandato?`,
          hint: `Partido: ${p.partido}`,
          correctAnswer: añoInicio,
          options: this.shuffle([
            añoInicio,
            (parseInt(añoInicio) - 4).toString(),
            (parseInt(añoInicio) + 6).toString(),
            (parseInt(añoInicio) - 10).toString()
          ]),
          detail: `${p.nombre} gobernó en: ${p.periodos.join(', ')}`
        };
      },
      // Tipo 7: ¿Quién fue presidente antes/después de...?
      (p, idx, arr) => {
        const nextIdx = (idx + 1) % arr.length;
        const nextPres = arr[nextIdx];
        return {
          question: `¿Quién gobernó después de ${p.nombre} (${p.periodos[p.periodos.length - 1]})?`,
          hint: `${p.nombre} era del partido ${p.partido}`,
          correctAnswer: nextPres.nombre,
          options: this.shuffle([nextPres.nombre, ...this.getRandomOptions(nextPres.nombre, allNames, 3)]),
          detail: `${nextPres.nombre} sucedió a ${p.nombre}`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, presidentes.length); i++) {
      const presidente = presidentes[i];
      const typeIndex = i % 6; // Usar los primeros 6 tipos (el 7 es más complejo)
      const template = questionTypes[typeIndex](presidente, i, presidentes);

      questions.push({
        type: 'presidentes',
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de períodos presidenciales
   */
  generatePeriodosQuestions(count = 10) {
    const questions = [];
    const allNames = RD_DATA.presidentes.map(p => p.nombre);

    // Crear lista de años y presidentes
    const yearPresidents = [];
    RD_DATA.presidentes.forEach(p => {
      p.periodos.forEach(periodo => {
        const years = periodo.split('-');
        const startYear = parseInt(years[0]);
        const endYear = years[1] === 'presente' ? 2026 : parseInt(years[1]);
        
        // Agregar algunos años del período
        for (let year = startYear; year <= endYear; year += Math.max(1, Math.floor((endYear - startYear) / 3))) {
          if (year <= 2026) {
            yearPresidents.push({
              year: year,
              presidente: p.nombre,
              partido: p.partido
            });
          }
        }
      });
    });

    const shuffledYears = this.shuffle(yearPresidents);

    for (let i = 0; i < Math.min(count, shuffledYears.length); i++) {
      const item = shuffledYears[i];
      const wrongOptions = this.getRandomOptions(item.presidente, allNames, 3);
      const options = this.shuffle([item.presidente, ...wrongOptions]);

      questions.push({
        type: 'periodos',
        question: `¿Quién era presidente en el año ${item.year}?`,
        hint: `Partido en el poder: ${item.partido}`,
        correctAnswer: item.presidente,
        options: options,
        detail: `${item.presidente} gobernó durante ese período`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de la constitución y leyes
   */
  generateLeyesQuestions(count = 10) {
    const questions = [];
    const articulos = this.shuffle([...RD_DATA.constitucion]);

    const questionTypes = [
      // Tipo 1: ¿De qué trata el artículo X?
      (a) => ({
        question: `¿De qué trata el Artículo ${a.articulo} de la Constitución?`,
        hint: `"${a.texto.substring(0, 60)}..."`,
        correctAnswer: a.titulo,
        options: this.shuffle([
          a.titulo,
          ...this.getRandomOptions(a.titulo, RD_DATA.constitucion.map(x => x.titulo), 3)
        ]),
        detail: a.texto.substring(0, 100) + '...'
      }),
      // Tipo 2: ¿Qué artículo establece...?
      (a) => ({
        question: `¿Qué artículo de la Constitución establece "${a.titulo}"?`,
        hint: a.texto.substring(0, 50) + '...',
        correctAnswer: `Artículo ${a.articulo}`,
        options: this.shuffle([
          `Artículo ${a.articulo}`,
          `Artículo ${Math.max(1, a.articulo - 5)}`,
          `Artículo ${a.articulo + 7}`,
          `Artículo ${a.articulo + 15}`
        ]),
        detail: a.texto.substring(0, 100) + '...'
      }),
      // Tipo 3: Completar texto
      (a) => {
        const palabrasClave = a.titulo.split(' ');
        return {
          question: `Según la Constitución, el Artículo ${a.articulo} trata sobre:`,
          hint: `"${a.texto.substring(0, 40)}..."`,
          correctAnswer: a.titulo,
          options: this.shuffle([
            a.titulo,
            ...this.getRandomOptions(a.titulo, RD_DATA.constitucion.map(x => x.titulo), 3)
          ]),
          detail: a.texto
        };
      }
    ];

    for (let i = 0; i < Math.min(count, articulos.length); i++) {
      const articulo = articulos[i];
      const typeIndex = i % 3;
      const template = questionTypes[typeIndex](articulo);

      questions.push({
        type: 'leyes',
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de fechas históricas
   * Formato: ¿En qué año ocurrió X? con 4 opciones de años
   */
  generateFechasQuestions(count = 10) {
    const questions = [];
    // Filtrar solo fechas que tienen año definido
    const fechasConAño = RD_DATA.fechas.filter(f => f.año);
    const fechas = this.shuffle([...fechasConAño]);

    /**
     * Genera 4 opciones de años cercanos al año correcto
     */
    const generateYearOptions = (correctYear) => {
      const options = [correctYear];
      const variations = [-2, -4, -6, -8, -10, 2, 4, 6, 8, 10, -12, 12, -3, 3, -5, 5];
      const shuffledVariations = this.shuffle(variations);
      
      for (const variation of shuffledVariations) {
        const newYear = correctYear + variation;
        if (newYear > 1400 && newYear <= 2026 && !options.includes(newYear)) {
          options.push(newYear);
          if (options.length >= 4) break;
        }
      }
      
      return this.shuffle(options);
    };

    for (let i = 0; i < Math.min(count, fechas.length); i++) {
      const fecha = fechas[i];
      
      // Todas las preguntas son del tipo "¿En qué año...?"
      const yearOptions = generateYearOptions(fecha.año);
      
      questions.push({
        type: 'fechas',
        question: `¿En qué año ${fecha.descripcion.charAt(0).toLowerCase() + fecha.descripcion.slice(1)}?`,
        hint: fecha.evento,
        correctAnswer: fecha.año.toString(),
        options: yearOptions.map(y => y.toString()),
        detail: `${fecha.evento} - ${fecha.fecha}`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de regiones (Ubica la Provincia)
   * Pregunta con 8 opciones de regiones
   */
  generateRegionesQuestions(count = 10) {
    const questions = [];
    const provincias = this.shuffle([...RD_DATA.provincias]);
    
    // Las 10 regiones organizadas por macroregión
    const REGIONES = [
      // Cibao
      'Cibao Norte',
      'Cibao Sur', 
      'Cibao Nordeste',
      'Cibao Noroeste',
      // Sur
      'Valdesia',
      'El Valle',
      'Enriquillo',
      // Oriental/Este
      'Yuma',
      'Higuamo',
      'Ozama'
    ];

    /**
     * Genera 8 opciones de regiones, siempre incluyendo la correcta
     */
    const generate8Options = (correctRegion) => {
      const options = [correctRegion];
      const otherRegions = REGIONES.filter(r => r !== correctRegion);
      const shuffledOthers = this.shuffle(otherRegions);
      
      // Agregar 7 regiones más para completar 8 opciones
      for (let i = 0; i < 7 && i < shuffledOthers.length; i++) {
        options.push(shuffledOthers[i]);
      }
      
      return this.shuffle(options);
    };

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const options = generate8Options(provincia.region);

      questions.push({
        type: 'regiones',
        question: `¿A qué región pertenece ${provincia.nombre}?`,
        hint: `Capital: ${provincia.capital}`,
        correctAnswer: provincia.region,
        options: options,
        detail: `${provincia.nombre} pertenece a la región ${provincia.region}`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de superficie provincial
   * ¿Cuánto mide X provincia?
   */
  generateSuperficieQuestions(count = 10) {
    const questions = [];
    const provincias = this.shuffle([...RD_DATA.provincias]);
    
    /**
     * Genera 4 opciones de superficie cercanas a la correcta
     */
    const generateAreaOptions = (correctArea) => {
      const options = [`${correctArea.toLocaleString('es-DO')} km²`];
      const variations = [0.7, 0.85, 1.15, 1.3, 0.6, 1.4, 0.75, 1.25];
      const shuffledVariations = this.shuffle(variations);
      
      for (const variation of shuffledVariations) {
        const newArea = Math.round(correctArea * variation * 10) / 10;
        const formatted = `${newArea.toLocaleString('es-DO')} km²`;
        if (!options.includes(formatted) && newArea > 50) {
          options.push(formatted);
          if (options.length >= 4) break;
        }
      }
      
      return this.shuffle(options);
    };

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const options = generateAreaOptions(provincia.superficie);

      questions.push({
        type: 'superficie',
        question: `¿Cuál es la superficie de ${provincia.nombre}?`,
        hint: `Región: ${provincia.region}`,
        correctAnswer: `${provincia.superficie.toLocaleString('es-DO')} km²`,
        options: options,
        image: `img/provincias/${provincia.id}.png`,
        detail: `${provincia.nombre} tiene ${provincia.superficie.toLocaleString('es-DO')} km²`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de escudos provinciales
   * ¿A qué provincia pertenece este escudo?
   */
  generateEscudosQuestions(count = 10) {
    const questions = [];
    
    // Todas las 32 provincias tienen escudo
    const provincias = this.shuffle([...RD_DATA.provincias]);
    const allNames = RD_DATA.provincias.map(p => p.nombre);

    // Función para determinar extensión del escudo
    const getEscudoPath = (id) => {
      const pngEscudos = ['azua', 'distrito-nacional'];
      const ext = pngEscudos.includes(id) ? 'png' : 'jpg';
      return `img/escudos/${id}.${ext}`;
    };

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const wrongOptions = this.getRandomOptions(provincia.nombre, allNames, 3);
      const options = this.shuffle([provincia.nombre, ...wrongOptions]);

      questions.push({
        type: 'escudos',
        question: '¿A qué provincia pertenece este escudo?',
        hint: `Región: ${provincia.region}`,
        correctAnswer: provincia.nombre,
        options: options,
        image: getEscudoPath(provincia.id),
        detail: `Escudo de ${provincia.nombre} (${provincia.region})`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas aleatorias de todas las categorías
   */
  generateRandomQuestions(count = 10) {
    const generators = [
      () => this.generateProvinciaQuestions(2),
      () => this.generatePersonajesQuestions(2),
      () => this.generatePresidentesQuestions(2),
      () => this.generatePeriodosQuestions(2),
      () => this.generateLeyesQuestions(2),
      () => this.generateFechasQuestions(2),
      () => this.generateRegionesQuestions(2),
      () => this.generateSuperficieQuestions(2),
      () => this.generateEscudosQuestions(2)
    ];

    let allQuestions = [];
    generators.forEach(gen => {
      allQuestions = allQuestions.concat(gen());
    });

    return this.shuffle(allQuestions).slice(0, count);
  }

  /**
   * Genera preguntas según la categoría
   */
  generateQuestions(category, count = 10) {
    this.reset();

    switch (category) {
      case 'provincias':
        return this.generateProvinciaQuestions(count);
      case 'personajes':
        return this.generatePersonajesQuestions(count);
      case 'presidentes':
        return this.generatePresidentesQuestions(count);
      case 'periodos':
        return this.generatePeriodosQuestions(count);
      case 'leyes':
        return this.generateLeyesQuestions(count);
      case 'fechas':
        return this.generateFechasQuestions(count);
      case 'regiones':
        return this.generateRegionesQuestions(count);
      case 'superficie':
        return this.generateSuperficieQuestions(count);
      case 'escudos':
        return this.generateEscudosQuestions(count);
      case 'random':
        return this.generateRandomQuestions(count);
      default:
        return this.generateRandomQuestions(count);
    }
  }
}

// Instancia global del generador
window.questionGenerator = new QuestionGenerator();
