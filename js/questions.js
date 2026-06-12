/**
 * RD Quiz - Generador de Preguntas
 * Sistema dinámico de generación de preguntas
 */

class QuestionGenerator {
  constructor() {
    this.usedQuestions = new Set();

    // Las 10 regiones organizadas por macroregión
    this.REGIONES = [
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
   * Ordena una lista de items priorizando los que NO aparecen en recentIds,
   * para evitar repetir el mismo sujeto en partidas consecutivas
   */
  prioritizeFresh(items, recentIds = []) {
    const fresh = this.shuffle(items.filter(item => !recentIds.includes(item.id)));
    const stale = this.shuffle(items.filter(item => recentIds.includes(item.id)));
    return [...fresh, ...stale];
  }

  /**
   * Genera opciones de regiones, siempre incluyendo la correcta
   */
  generateRegionOptions(correctRegion, totalOptions = 8) {
    const options = [correctRegion];
    const others = this.shuffle(this.REGIONES.filter(r => r !== correctRegion));

    for (let i = 0; i < totalOptions - 1 && i < others.length; i++) {
      options.push(others[i]);
    }

    return this.shuffle(options);
  }

  /**
   * Genera preguntas de provincias
   */
  generateProvinciaQuestions(count = 10, recentIds = []) {
    const questions = [];
    const provincias = this.prioritizeFresh(RD_DATA.provincias, recentIds);
    const allNames = RD_DATA.provincias.map(p => p.nombre);

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];

      questions.push({
        type: 'provincias',
        provinceId: provincia.id,
        image: `img/provincias/${provincia.id}.png`,
        question: '¿Cuál es esta provincia?',
        hint: provincia.dato,
        correctAnswer: provincia.nombre,
        options: this.shuffle([provincia.nombre, ...this.getRandomOptions(provincia.nombre, allNames, 3)]),
        detail: `Capital: ${provincia.capital}`
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de datos provinciales (capital, región, población, superficie)
   */
  generateDatosProvinciasQuestions(count = 10) {
    const questions = [];
    const provincias = this.shuffle([...RD_DATA.provincias]);
    const allCapitales = RD_DATA.provincias.map(p => p.capital);

    const questionTypes = [
      // Tipo 1: ¿Cuál es la capital de esta provincia?
      (p) => ({
        question: `¿Cuál es la capital de ${p.nombre}?`,
        hint: p.dato,
        correctAnswer: p.capital,
        options: this.shuffle([p.capital, ...this.getRandomOptions(p.capital, allCapitales, 3)]),
        detail: `La capital de ${p.nombre} es ${p.capital}`
      }),
      // Tipo 2: ¿A qué región pertenece esta provincia?
      (p) => ({
        question: `¿A qué región pertenece ${p.nombre}?`,
        hint: `Capital: ${p.capital}`,
        correctAnswer: p.region,
        options: this.generateRegionOptions(p.region, 8),
        detail: `${p.nombre} pertenece a la región ${p.region}`
      }),
      // Tipo 3: ¿Cuál de estas dos provincias tiene MÁS habitantes?
      (p, idx, arr) => {
        const otra = arr[(idx + 1) % arr.length];
        const mayor = p.poblacion > otra.poblacion ? p : otra;
        const menor = mayor === p ? otra : p;
        return {
          question: '¿Cuál de estas dos provincias tiene MÁS habitantes?',
          hint: `Compara: ${p.nombre} vs ${otra.nombre}`,
          correctAnswer: mayor.nombre,
          options: this.shuffle([p.nombre, otra.nombre]),
          detail: `${mayor.nombre} (${mayor.poblacion.toLocaleString('es-DO')} hab.) tiene más población que ${menor.nombre} (${menor.poblacion.toLocaleString('es-DO')} hab.)`
        };
      },
      // Tipo 4: ¿Cuál de estas dos provincias tiene MAYOR superficie?
      (p, idx, arr) => {
        const otra = arr[(idx + 1) % arr.length];
        const mayor = p.superficie > otra.superficie ? p : otra;
        const menor = mayor === p ? otra : p;
        return {
          question: '¿Cuál de estas dos provincias tiene MAYOR superficie?',
          hint: `Compara: ${p.nombre} vs ${otra.nombre}`,
          correctAnswer: mayor.nombre,
          options: this.shuffle([p.nombre, otra.nombre]),
          detail: `${mayor.nombre} (${mayor.superficie.toLocaleString('es-DO')} km²) tiene mayor superficie que ${menor.nombre} (${menor.superficie.toLocaleString('es-DO')} km²)`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](provincia, i, provincias);

      questions.push({
        type: 'datosProvincias',
        ...template
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
    const allTitulos = [...new Set(RD_DATA.personajes.map(p => p.titulo))];

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
      },
      // Tipo 7: ¿Cuál de estos dos personajes nació primero?
      (p, idx, arr) => {
        let otro = arr[(idx + 1) % arr.length];
        let offset = 1;
        while (otro.nacimiento === p.nacimiento && offset < arr.length) {
          offset++;
          otro = arr[(idx + offset) % arr.length];
        }
        const primero = p.nacimiento < otro.nacimiento ? p : otro;
        const segundo = primero === p ? otro : p;
        return {
          question: '¿Cuál de estos dos personajes nació primero?',
          hint: `Compara: ${p.nombre} vs ${otro.nombre}`,
          correctAnswer: primero.nombre,
          options: this.shuffle([p.nombre, otro.nombre]),
          detail: `${primero.nombre} (${primero.nacimiento}) nació antes que ${segundo.nombre} (${segundo.nacimiento})`
        };
      }
    ];

    // Se mezcla el orden de los tipos para que, con lotes de 5 preguntas,
    // todos los tipos tengan oportunidad de aparecer entre rondas
    const typeOrder = this.shuffle(questionTypes.map((_, idx) => idx));

    for (let i = 0; i < Math.min(count, personajes.length); i++) {
      const personaje = personajes[i];
      const typeIndex = typeOrder[i % typeOrder.length];
      const template = questionTypes[typeIndex](personaje, i, personajes);

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

    // Línea de tiempo cronológica de todos los períodos presidenciales
    const timeline = [];
    RD_DATA.presidentes.forEach(p => {
      p.periodos.forEach(periodo => {
        timeline.push({ nombre: p.nombre, periodo, inicio: parseInt(periodo.split('-')[0]) });
      });
    });
    timeline.sort((a, b) => a.inicio - b.inicio);

    // Eventos históricos usados como respuesta/distractores en el Tipo 7
    const HISTORICAL_EVENTS = [
      'Anexión a España (1861-1865)',
      'Ocupación Militar de Estados Unidos (1916-1924)',
      'Ocupación Haitiana (1822-1844)',
      'Guerra de la Restauración (1863-1865)',
      'Era de Trujillo (1930-1961)'
    ];

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
      // Tipo 7: ¿Quién/qué gobernó/sucedió después de...? (basado en la línea de tiempo real)
      (p) => {
        const lastPeriodo = p.periodos[p.periodos.length - 1];

        // Si el período termina en un evento histórico (no en otro presidente),
        // se pregunta por ese evento en lugar de por un sucesor inexistente
        if (p.eventoTras) {
          const correctAnswer = `${p.eventoTras.evento} (${p.eventoTras.periodo})`;
          const otrosEventos = HISTORICAL_EVENTS.filter(e => e !== correctAnswer);
          return {
            question: `¿Qué sucedió después del gobierno de ${p.nombre} (${lastPeriodo})?`,
            hint: `${p.nombre} era del partido ${p.partido}`,
            correctAnswer,
            options: this.shuffle([correctAnswer, ...this.shuffle(otrosEventos).slice(0, 3)]),
            detail: `Después de ${p.nombre} (${lastPeriodo}): ${correctAnswer}`
          };
        }

        const idx = timeline.findIndex(t => t.nombre === p.nombre && t.periodo === lastPeriodo);
        const next = timeline[idx + 1];
        if (!next) return null;
        return {
          question: `¿Quién gobernó después de ${p.nombre} (${lastPeriodo})?`,
          hint: `${p.nombre} era del partido ${p.partido}`,
          correctAnswer: next.nombre,
          options: this.shuffle([next.nombre, ...this.getRandomOptions(next.nombre, allNames, 3)]),
          detail: `${next.nombre} gobernó a partir de ${next.periodo}`
        };
      }
    ];

    const typeOrder = this.shuffle(questionTypes.map((_, idx) => idx));
    for (let i = 0; i < Math.min(count, presidentes.length); i++) {
      const presidente = presidentes[i];
      const typeIndex = typeOrder[i % typeOrder.length];
      const template = questionTypes[typeIndex](presidente, i, presidentes) || questionTypes[0](presidente, i, presidentes);

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
      (a) => {
        const offsets = this.shuffle([5, 7, 10, 15, 20, -5, -7, -10, -15, -20]);
        const wrongNumbers = [];
        for (const offset of offsets) {
          const num = a.articulo + offset;
          if (num >= 1 && num !== a.articulo && !wrongNumbers.includes(num)) {
            wrongNumbers.push(num);
            if (wrongNumbers.length >= 3) break;
          }
        }
        return {
          question: `¿Qué artículo de la Constitución establece "${a.titulo}"?`,
          hint: a.texto.substring(0, 50) + '...',
          correctAnswer: `Artículo ${a.articulo}`,
          options: this.shuffle([
            `Artículo ${a.articulo}`,
            ...wrongNumbers.map(n => `Artículo ${n}`)
          ]),
          detail: a.texto.substring(0, 100) + '...'
        };
      },
      // Tipo 3: Completar texto
      (a) => {
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
      },
      // Tipo 4: ¿Cuál de estas frases corresponde al Artículo X?
      (a) => {
        const excerpt = (texto) => texto.length > 60 ? texto.substring(0, 60) + '...' : texto;
        const otrosExcerptos = [...new Set(
          RD_DATA.constitucion
            .filter(x => x.articulo !== a.articulo)
            .map(x => excerpt(x.texto))
        )];
        return {
          question: `¿Cuál de estas frases corresponde al Artículo ${a.articulo} de la Constitución?`,
          hint: `Trata sobre: ${a.titulo}`,
          correctAnswer: excerpt(a.texto),
          options: this.shuffle([excerpt(a.texto), ...this.getRandomOptions(excerpt(a.texto), otrosExcerptos, 3)]),
          detail: a.texto
        };
      }
    ];

    for (let i = 0; i < Math.min(count, articulos.length); i++) {
      const articulo = articulos[i];
      const typeIndex = i % questionTypes.length;
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
    const fechas = this.shuffle([...RD_DATA.fechas]);

    // Etiquetas legibles para cada categoría histórica
    const CATEGORIA_LABELS = {
      colonial: 'Período Colonial',
      independencia: 'Independencia',
      batallas: 'Batallas Históricas',
      restauracion: 'Guerra de Restauración',
      siglo20: 'Siglo XX',
      festividades: 'Día Patrio o Conmemoración',
      contemporaneo: 'Era Contemporánea'
    };
    const allCategoryLabels = Object.values(CATEGORIA_LABELS);

    /**
     * Genera 4 opciones de años cercanos al año correcto
     */
    const generateYearOptions = (correctYear) => {
      const options = [correctYear];
      const variations = this.shuffle([-2, -4, -6, -8, -10, 2, 4, 6, 8, 10, -12, 12, -3, 3, -5, 5]);

      for (const variation of variations) {
        const newYear = correctYear + variation;
        if (newYear > 1400 && newYear <= 2026 && !options.includes(newYear)) {
          options.push(newYear);
          if (options.length >= 4) break;
        }
      }

      return this.shuffle(options);
    };

    const questionTypes = {
      // Tipo A: ¿En qué año ocurrió X? (requiere año)
      year: (f) => {
        const yearOptions = generateYearOptions(f.año);
        return {
          question: `¿En qué año ${f.descripcion.charAt(0).toLowerCase() + f.descripcion.slice(1)}?`,
          hint: f.evento,
          correctAnswer: f.año.toString(),
          options: yearOptions.map(y => y.toString()),
          detail: `${f.evento} - ${f.fecha}`
        };
      },
      // Tipo B: ¿Cuál de estos eventos ocurrió en el año X? (requiere año)
      event: (f) => {
        const candidates = [...new Set(
          RD_DATA.fechas.filter(x => x.año !== f.año).map(x => x.evento)
        )];
        return {
          question: `¿Cuál de estos eventos ocurrió en el año ${f.año}?`,
          hint: f.descripcion,
          correctAnswer: f.evento,
          options: this.shuffle([f.evento, ...this.getRandomOptions(f.evento, candidates, 3)]),
          detail: `${f.evento} - ${f.fecha}`
        };
      },
      // Tipo C: ¿A qué período histórico pertenece...? (cualquier fecha)
      category: (f) => {
        const correctLabel = CATEGORIA_LABELS[f.categoria];
        return {
          question: `¿A qué período histórico pertenece "${f.evento}"?`,
          hint: f.descripcion,
          correctAnswer: correctLabel,
          options: this.shuffle([correctLabel, ...this.getRandomOptions(correctLabel, allCategoryLabels, 3)]),
          detail: `${f.evento} - ${f.fecha}`
        };
      },
      // Tipo D: ¿En qué fecha se celebra...? (solo días patrios sin año)
      festividad: (f) => {
        const candidates = [...new Set(
          RD_DATA.fechas.filter(x => !x.año && x.fecha !== f.fecha).map(x => x.fecha)
        )];
        return {
          question: `¿En qué fecha se celebra "${f.evento}"?`,
          hint: f.descripcion,
          correctAnswer: f.fecha,
          options: this.shuffle([f.fecha, ...this.getRandomOptions(f.fecha, candidates, 3)]),
          detail: `${f.evento} - ${f.descripcion}`
        };
      }
    };

    for (let i = 0; i < Math.min(count, fechas.length); i++) {
      const fecha = fechas[i];
      const availableTypes = fecha.año
        ? ['year', 'event', 'category']
        : ['category', 'festividad'];
      const typeKey = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const template = questionTypes[typeKey](fecha);

      questions.push({
        type: 'fechas',
        ...template
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

    const questionTypes = [
      // Tipo 1: ¿A qué región pertenece esta provincia? (8 opciones de región)
      (p) => ({
        question: `¿A qué región pertenece ${p.nombre}?`,
        hint: `Capital: ${p.capital}`,
        correctAnswer: p.region,
        options: this.generateRegionOptions(p.region, 8),
        detail: `${p.nombre} pertenece a la región ${p.region}`
      }),
      // Tipo 2: ¿Cuál de estas provincias pertenece a la región X?
      (p) => {
        const otrasProvincias = RD_DATA.provincias
          .filter(x => x.region !== p.region)
          .map(x => x.nombre);
        return {
          question: `¿Cuál de estas provincias pertenece a la región ${p.region}?`,
          hint: `Capital: ${p.capital}`,
          correctAnswer: p.nombre,
          options: this.shuffle([p.nombre, ...this.getRandomOptions(p.nombre, otrasProvincias, 3)]),
          detail: `${p.nombre} pertenece a la región ${p.region}`
        };
      },
      // Tipo 3: ¿Cuántas provincias conforman la región X?
      (p) => {
        const numProvincias = RD_DATA.provincias.filter(x => x.region === p.region).length;
        return {
          question: `¿Cuántas provincias conforman la región ${p.region}?`,
          hint: `${p.nombre} es una de ellas`,
          correctAnswer: numProvincias.toString(),
          options: this.shuffle([
            numProvincias.toString(),
            (numProvincias - 1).toString(),
            (numProvincias + 1).toString(),
            (numProvincias + 2).toString()
          ]),
          detail: `La región ${p.region} está conformada por ${numProvincias} provincia${numProvincias === 1 ? '' : 's'}`
        };
      },
      // Tipo 4: ¿Cuál es la provincia más poblada de la región X?
      (p) => {
        const provinciasRegion = RD_DATA.provincias.filter(x => x.region === p.region);
        const masPoblada = provinciasRegion.reduce((a, b) => a.poblacion > b.poblacion ? a : b);
        const otrasMismaRegion = provinciasRegion.filter(x => x.nombre !== masPoblada.nombre).map(x => x.nombre);
        const otrasRegiones = this.shuffle(RD_DATA.provincias.filter(x => x.region !== p.region).map(x => x.nombre));
        const wrongOptions = [...otrasMismaRegion, ...otrasRegiones].slice(0, 3);
        return {
          question: `¿Cuál es la provincia más poblada de la región ${p.region}?`,
          hint: `${provinciasRegion.length} provincia${provinciasRegion.length === 1 ? '' : 's'} en esta región`,
          correctAnswer: masPoblada.nombre,
          options: this.shuffle([masPoblada.nombre, ...wrongOptions]),
          detail: `${masPoblada.nombre} tiene ${masPoblada.poblacion.toLocaleString('es-DO')} habitantes`
        };
      },
      // Tipo 5: ¿Cuál es la provincia con mayor superficie de la región X?
      (p) => {
        const provinciasRegion = RD_DATA.provincias.filter(x => x.region === p.region);
        const masGrande = provinciasRegion.reduce((a, b) => a.superficie > b.superficie ? a : b);
        const otrasMismaRegion = provinciasRegion.filter(x => x.nombre !== masGrande.nombre).map(x => x.nombre);
        const otrasRegiones = this.shuffle(RD_DATA.provincias.filter(x => x.region !== p.region).map(x => x.nombre));
        const wrongOptions = [...otrasMismaRegion, ...otrasRegiones].slice(0, 3);
        return {
          question: `¿Cuál es la provincia con mayor superficie de la región ${p.region}?`,
          hint: `${provinciasRegion.length} provincia${provinciasRegion.length === 1 ? '' : 's'} en esta región`,
          correctAnswer: masGrande.nombre,
          options: this.shuffle([masGrande.nombre, ...wrongOptions]),
          detail: `${masGrande.nombre} tiene ${masGrande.superficie.toLocaleString('es-DO')} km²`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](provincia);

      questions.push({
        type: 'regiones',
        ...template
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

    const questionTypes = [
      // Tipo 1: ¿Cuál es la superficie de X?
      (p) => ({
        question: `¿Cuál es la superficie de ${p.nombre}?`,
        hint: `Región: ${p.region}`,
        correctAnswer: `${p.superficie.toLocaleString('es-DO')} km²`,
        options: generateAreaOptions(p.superficie),
        image: `img/provincias/${p.id}.png`,
        detail: `${p.nombre} tiene ${p.superficie.toLocaleString('es-DO')} km²`
      }),
      // Tipo 2: ¿Cuál de estas dos provincias tiene mayor superficie?
      (p, idx, arr) => {
        const otra = arr[(idx + 1) % arr.length];
        const mayor = p.superficie > otra.superficie ? p : otra;
        const menor = mayor === p ? otra : p;
        return {
          question: '¿Cuál de estas dos provincias tiene MAYOR superficie?',
          hint: `Compara: ${p.nombre} vs ${otra.nombre}`,
          correctAnswer: mayor.nombre,
          options: this.shuffle([p.nombre, otra.nombre]),
          image: `img/provincias/${p.id}.png`,
          detail: `${mayor.nombre} (${mayor.superficie.toLocaleString('es-DO')} km²) es más grande que ${menor.nombre} (${menor.superficie.toLocaleString('es-DO')} km²)`
        };
      },
      // Tipo 3: De estas 4 provincias, ¿cuál tiene mayor superficie?
      (p) => {
        const otras = this.getRandomOptions(p.nombre, RD_DATA.provincias.map(x => x.nombre), 3)
          .map(nombre => RD_DATA.provincias.find(x => x.nombre === nombre));
        const candidatos = this.shuffle([p, ...otras]);
        const mayor = candidatos.reduce((max, c) => c.superficie > max.superficie ? c : max, candidatos[0]);

        return {
          question: '¿Cuál de estas provincias tiene MAYOR superficie?',
          hint: 'Compara las 4 opciones',
          correctAnswer: mayor.nombre,
          options: candidatos.map(c => c.nombre),
          detail: `${mayor.nombre} tiene ${mayor.superficie.toLocaleString('es-DO')} km², la mayor entre estas opciones`
        };
      },
      // Tipo 4: ¿Cuál de estas dos provincias tiene MENOR superficie?
      (p, idx, arr) => {
        const otra = arr[(idx + 1) % arr.length];
        const menor = p.superficie < otra.superficie ? p : otra;
        const mayor = menor === p ? otra : p;
        return {
          question: '¿Cuál de estas dos provincias tiene MENOR superficie?',
          hint: `Compara: ${p.nombre} vs ${otra.nombre}`,
          correctAnswer: menor.nombre,
          options: this.shuffle([p.nombre, otra.nombre]),
          image: `img/provincias/${p.id}.png`,
          detail: `${menor.nombre} (${menor.superficie.toLocaleString('es-DO')} km²) es más pequeña que ${mayor.nombre} (${mayor.superficie.toLocaleString('es-DO')} km²)`
        };
      },
      // Tipo 5: De estas 4 provincias, ¿cuál tiene menor superficie?
      (p) => {
        const otras = this.getRandomOptions(p.nombre, RD_DATA.provincias.map(x => x.nombre), 3)
          .map(nombre => RD_DATA.provincias.find(x => x.nombre === nombre));
        const candidatos = this.shuffle([p, ...otras]);
        const menor = candidatos.reduce((min, c) => c.superficie < min.superficie ? c : min, candidatos[0]);

        return {
          question: '¿Cuál de estas provincias tiene MENOR superficie?',
          hint: 'Compara las 4 opciones',
          correctAnswer: menor.nombre,
          options: candidatos.map(c => c.nombre),
          detail: `${menor.nombre} tiene ${menor.superficie.toLocaleString('es-DO')} km², la menor entre estas opciones`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](provincia, i, provincias);

      questions.push({
        type: 'superficie',
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de escudos provinciales
   * ¿A qué provincia pertenece este escudo?
   */
  generateEscudosQuestions(count = 10, recentIds = []) {
    const questions = [];

    // Todas las 32 provincias tienen escudo
    const provincias = this.prioritizeFresh(RD_DATA.provincias, recentIds);
    const allNames = RD_DATA.provincias.map(p => p.nombre);
    const allCapitales = RD_DATA.provincias.map(p => p.capital);

    // Función para determinar extensión del escudo
    const getEscudoPath = (id) => {
      const pngEscudos = ['azua', 'distrito-nacional'];
      const ext = pngEscudos.includes(id) ? 'png' : 'jpg';
      return `img/escudos/${id}.${ext}`;
    };

    const questionTypes = [
      // Tipo 1: ¿A qué provincia pertenece este escudo?
      (p) => ({
        question: '¿A qué provincia pertenece este escudo?',
        hint: `Región: ${p.region}`,
        correctAnswer: p.nombre,
        options: this.shuffle([p.nombre, ...this.getRandomOptions(p.nombre, allNames, 3)]),
        detail: `Escudo de ${p.nombre} (${p.region})`
      }),
      // Tipo 2: ¿Cuál es la capital de la provincia de este escudo?
      (p) => ({
        question: '¿Cuál es la capital de la provincia de este escudo?',
        hint: `Región: ${p.region}`,
        correctAnswer: p.capital,
        options: this.shuffle([p.capital, ...this.getRandomOptions(p.capital, allCapitales, 3)]),
        detail: `La capital de ${p.nombre} es ${p.capital}`
      }),
      // Tipo 3: Este escudo pertenece a una provincia de la región X. ¿Cuál es?
      (p) => {
        const mismaRegion = RD_DATA.provincias
          .filter(x => x.region === p.region && x.nombre !== p.nombre)
          .map(x => x.nombre);
        const otrasRegiones = RD_DATA.provincias
          .filter(x => x.region !== p.region)
          .map(x => x.nombre);
        const necesarios = 3 - mismaRegion.length;
        const wrongOptions = necesarios > 0
          ? [...this.shuffle(mismaRegion), ...this.getRandomOptions(p.nombre, otrasRegiones, necesarios)]
          : this.shuffle(mismaRegion).slice(0, 3);

        return {
          question: `Este escudo pertenece a una provincia de la región ${p.region}. ¿Cuál es?`,
          hint: `Capital: ${p.capital}`,
          correctAnswer: p.nombre,
          options: this.shuffle([p.nombre, ...wrongOptions]),
          detail: `${p.nombre} está en la región ${p.region}`
        };
      },
      // Tipo 4: De estas 4 provincias (una es la de este escudo), ¿cuál tiene MÁS habitantes?
      (p) => {
        const otras = this.getRandomOptions(p.nombre, RD_DATA.provincias.map(x => x.nombre), 3)
          .map(nombre => RD_DATA.provincias.find(x => x.nombre === nombre));
        const candidatos = this.shuffle([p, ...otras]);
        const mayor = candidatos.reduce((max, c) => c.poblacion > max.poblacion ? c : max, candidatos[0]);

        return {
          question: 'Una de estas provincias tiene este escudo. ¿Cuál de las 4 tiene MÁS habitantes?',
          hint: 'Compara las 4 opciones',
          correctAnswer: mayor.nombre,
          options: candidatos.map(c => c.nombre),
          detail: `${mayor.nombre} tiene ${mayor.poblacion.toLocaleString('es-DO')} habitantes, la mayor entre estas opciones`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, provincias.length); i++) {
      const provincia = provincias[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](provincia);

      questions.push({
        type: 'escudos',
        provinceId: provincia.id,
        image: getEscudoPath(provincia.id),
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de municipios y provincias
   * ¿A qué provincia pertenece este municipio?
   */
  generateMunicipiosQuestions(count = 10) {
    const questions = [];
    const municipios = this.shuffle([...RD_DATA.municipios]);
    const allProvincias = [...new Set(RD_DATA.municipios.map(m => m.provincia))];

    const questionTypes = [
      // Tipo 1: ¿A qué provincia pertenece este municipio?
      (m) => ({
        question: `¿A qué provincia pertenece el municipio de ${m.nombre}?`,
        hint: m.nombreCompleto ? `Nombre completo: ${m.nombreCompleto}` : 
              m.nombreAntiguo ? `Antes conocido como: ${m.nombreAntiguo}` : 
              `Creado en ${m.año}`,
        correctAnswer: m.provincia,
        options: this.shuffle([m.provincia, ...this.getRandomOptions(m.provincia, allProvincias, 3)]),
        detail: `${m.nombre} pertenece a la provincia ${m.provincia}`
      }),
      // Tipo 2: ¿Cuál de estos municipios pertenece a la provincia X?
      (m) => {
        const otrosMunicipios = RD_DATA.municipios
          .filter(x => x.provincia !== m.provincia)
          .map(x => x.nombre);
        return {
          question: `¿Cuál de estos municipios pertenece a la provincia de ${m.provincia}?`,
          hint: `Busca el municipio correcto`,
          correctAnswer: m.nombre,
          options: this.shuffle([m.nombre, ...this.getRandomOptions(m.nombre, otrosMunicipios, 3)]),
          detail: `${m.nombre} pertenece a ${m.provincia}`
        };
      },
      // Tipo 3: Si tiene nombre antiguo/completo
      (m) => {
        const nombreAlterno = m.nombreCompleto || m.nombreAntiguo;
        if (nombreAlterno) {
          return {
            question: `${nombreAlterno} es el nombre ${m.nombreCompleto ? 'completo' : 'antiguo'} de un municipio en:`,
            hint: `Actualmente se conoce como ${m.nombre}`,
            correctAnswer: m.provincia,
            options: this.shuffle([m.provincia, ...this.getRandomOptions(m.provincia, allProvincias, 3)]),
            detail: `${m.nombre} (${nombreAlterno}) está en ${m.provincia}`
          };
        }
        // Fallback al tipo 1
        return {
          question: `¿A qué provincia pertenece el municipio de ${m.nombre}?`,
          hint: `Creado el ${m.creacion}`,
          correctAnswer: m.provincia,
          options: this.shuffle([m.provincia, ...this.getRandomOptions(m.provincia, allProvincias, 3)]),
          detail: `${m.nombre} pertenece a la provincia ${m.provincia}`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, municipios.length); i++) {
      const municipio = municipios[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](municipio);

      questions.push({
        type: 'municipios',
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas sobre fundación de municipios
   * ¿Cuándo se creó/fundó este municipio?
   */
  generateFundacionesQuestions(count = 10) {
    const questions = [];
    const municipios = this.shuffle([...RD_DATA.municipios]);
    const allAños = [...new Set(RD_DATA.municipios.map(m => m.año))].sort((a, b) => a - b);

    // Escudo del municipio (mismo que se usa en el modo Escudos de Municipios)
    const getMunicipioEscudo = (nombre) => {
      const file = RD_DATA.escudosMunicipios[nombre];
      return file ? `img/escudos-municipios/${encodeURIComponent(file)}` : null;
    };

    const questionTypes = [
      // Tipo 1: ¿En qué año fue creado el municipio X?
      (m) => ({
        question: `¿En qué año fue elevado a municipio ${m.nombre}?`,
        hint: `Provincia: ${m.provincia}`,
        correctAnswer: m.año.toString(),
        options: this.shuffle([
          m.año.toString(),
          (m.año - 10 + Math.floor(Math.random() * 5)).toString(),
          (m.año + 5 + Math.floor(Math.random() * 10)).toString(),
          (m.año - 20 + Math.floor(Math.random() * 5)).toString()
        ]),
        image: getMunicipioEscudo(m.nombre),
        detail: `${m.nombre} fue creado el ${m.creacion}`
      }),
      // Tipo 2: ¿Cuál de estos municipios fue creado en el año X?
      (m) => {
        const otrosMunicipios = RD_DATA.municipios
          .filter(x => x.año !== m.año)
          .map(x => x.nombre);
        return {
          question: `¿Cuál de estos municipios fue creado en ${m.año}?`,
          hint: `Fecha exacta: ${m.creacion}`,
          correctAnswer: m.nombre,
          options: this.shuffle([m.nombre, ...this.getRandomOptions(m.nombre, otrosMunicipios, 3)]),
          detail: `${m.nombre} fue creado el ${m.creacion}`
        };
      },
      // Tipo 3: ¿Cuál es la fecha de creación de X?
      (m) => ({
        question: `¿Cuál es la fecha de creación del municipio ${m.nombre}?`,
        hint: `Provincia: ${m.provincia}`,
        correctAnswer: m.creacion,
        options: this.shuffle([
          m.creacion,
          ...this.generateFakeDates(m.creacion, 3)
        ]),
        image: getMunicipioEscudo(m.nombre),
        detail: `${m.nombre} (${m.provincia}) fue creado el ${m.creacion}`
      }),
      // Tipo 4: ¿Cuál municipio es más antiguo/reciente?
      (m, idx, arr) => {
        const otroMunicipio = arr[(idx + 1) % arr.length];
        const esMasAntiguo = m.año < otroMunicipio.año;
        return {
          question: `¿Cuál de estos dos municipios fue creado primero?`,
          hint: `Compara: ${m.nombre} vs ${otroMunicipio.nombre}`,
          correctAnswer: esMasAntiguo ? m.nombre : otroMunicipio.nombre,
          options: this.shuffle([m.nombre, otroMunicipio.nombre]),
          image: getMunicipioEscudo(m.nombre),
          detail: `${esMasAntiguo ? m.nombre : otroMunicipio.nombre} (${esMasAntiguo ? m.año : otroMunicipio.año}) es más antiguo que ${esMasAntiguo ? otroMunicipio.nombre : m.nombre} (${esMasAntiguo ? otroMunicipio.año : m.año})`
        };
      },
      // Tipo 5: Identificar municipios de 1845
      (m) => {
        if (m.año === 1845) {
          const municipiosNuevos = RD_DATA.municipios
            .filter(x => x.año > 2000)
            .map(x => x.nombre);
          return {
            question: `¿Cuál de estos municipios fue fundado con la República en 1845?`,
            hint: `Los municipios originales datan del 5 de marzo de 1845`,
            correctAnswer: m.nombre,
            options: this.shuffle([m.nombre, ...this.getRandomOptions(m.nombre, municipiosNuevos, 3)]),
            detail: `${m.nombre} es uno de los municipios fundadores (${m.creacion})`
          };
        }
        // Fallback
        return {
          question: `¿En qué año fue elevado a municipio ${m.nombre}?`,
          hint: `Provincia: ${m.provincia}`,
          correctAnswer: m.año.toString(),
          options: this.shuffle([
            m.año.toString(),
            '1845',
            (m.año + 15).toString(),
            (m.año - 25 > 1845 ? m.año - 25 : 1900).toString()
          ]),
          image: getMunicipioEscudo(m.nombre),
          detail: `${m.nombre} fue creado el ${m.creacion}`
        };
      },
      // Tipo 6: Municipios más recientes
      (m) => {
        if (m.año >= 2020) {
          return {
            question: `${m.nombre} es uno de los municipios más recientes. ¿En qué año fue creado?`,
            hint: m.dato || `Provincia: ${m.provincia}`,
            correctAnswer: m.año.toString(),
            options: this.shuffle(['2020', '2022', '2024', '2016']),
            image: getMunicipioEscudo(m.nombre),
            detail: `${m.nombre} fue elevado a municipio en ${m.año}`
          };
        }
        return {
          question: `¿En qué año fue creado el municipio de ${m.nombre}?`,
          hint: `Provincia: ${m.provincia}`,
          correctAnswer: m.año.toString(),
          options: this.shuffle([
            m.año.toString(),
            (m.año - 8).toString(),
            (m.año + 12).toString(),
            (m.año - 15 > 1845 ? m.año - 15 : 1860).toString()
          ]),
          image: getMunicipioEscudo(m.nombre),
          detail: `${m.nombre} fue creado el ${m.creacion}`
        };
      }
    ];

    // Se mezcla el orden de los tipos para que, con lotes de 5 preguntas,
    // todos los tipos (incluido el 6) tengan oportunidad de aparecer entre rondas
    const typeOrder = this.shuffle(questionTypes.map((_, idx) => idx));

    for (let i = 0; i < Math.min(count, municipios.length); i++) {
      const municipio = municipios[i];
      const typeIndex = typeOrder[i % typeOrder.length];
      const template = questionTypes[typeIndex](municipio, i, municipios);

      questions.push({
        type: 'fundaciones',
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera preguntas de escudos de municipios
   * ¿A qué municipio pertenece este escudo?
   */
  generateEscudosMunicipiosQuestions(count = 10) {
    const questions = [];
    const escudosMap = RD_DATA.escudosMunicipios;
    
    // Solo municipios que tienen escudo disponible
    const municipiosConEscudo = RD_DATA.municipios.filter(m => escudosMap[m.nombre]);
    const shuffled = this.shuffle([...municipiosConEscudo]);
    const allNames = municipiosConEscudo.map(m => m.nombre);

    const questionTypes = [
      // Tipo 1: ¿A qué municipio pertenece este escudo?
      (m) => ({
        question: '¿A qué municipio pertenece este escudo?',
        hint: `Provincia: ${m.provincia}`,
        correctAnswer: m.nombre,
        options: this.shuffle([m.nombre, ...this.getRandomOptions(m.nombre, allNames, 3)]),
        detail: `Escudo de ${m.nombre} (${m.provincia})`
      }),
      // Tipo 2: Con pista del nombre antiguo/completo
      (m) => {
        const nombreAlterno = m.nombreCompleto || m.nombreAntiguo;
        return {
          question: '¿A qué municipio pertenece este escudo?',
          hint: nombreAlterno ? `También conocido como: ${nombreAlterno}` : `Creado en ${m.año}`,
          correctAnswer: m.nombre,
          options: this.shuffle([m.nombre, ...this.getRandomOptions(m.nombre, allNames, 3)]),
          detail: `${m.nombre} - ${m.provincia}`
        };
      },
      // Tipo 3: Escudo de municipios de una provincia específica
      (m) => {
        const otrosMunicipios = municipiosConEscudo
          .filter(x => x.provincia !== m.provincia)
          .map(x => x.nombre);
        return {
          question: `Este escudo pertenece a un municipio de ${m.provincia}. ¿Cuál es?`,
          hint: `Fundado en ${m.año}`,
          correctAnswer: m.nombre,
          options: this.shuffle([m.nombre, ...this.getRandomOptions(m.nombre, otrosMunicipios, 3)]),
          detail: `${m.nombre} está en la provincia ${m.provincia}`
        };
      }
    ];

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const municipio = shuffled[i];
      const typeIndex = i % questionTypes.length;
      const template = questionTypes[typeIndex](municipio);

      questions.push({
        type: 'escudosMunicipios',
        image: `img/escudos-municipios/${encodeURIComponent(escudosMap[municipio.nombre])}`,
        ...template
      });
    }

    return questions;
  }

  /**
   * Genera fechas falsas similares a una fecha real
   */
  generateFakeDates(realDate, count) {
    const fakeDates = [];
    const parts = realDate.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/);
    
    if (!parts) {
      // Si es solo un año
      const year = parseInt(realDate);
      return [
        (year - 5).toString(),
        (year + 8).toString(),
        (year - 12).toString()
      ].slice(0, count);
    }

    const [, day, month, year] = parts;
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const usedDates = new Set([realDate]);
    let attempts = 0;

    while (fakeDates.length < count && attempts < count * 10) {
      attempts++;
      const fakeDay = Math.max(1, Math.min(28, parseInt(day) + (Math.random() > 0.5 ? 1 : -1) * (5 + Math.floor(Math.random() * 10))));
      const monthIdx = months.indexOf(month.toLowerCase());
      const fakeMonthIdx = (monthIdx + 2 + Math.floor(Math.random() * 4)) % 12;
      const fakeYear = parseInt(year) + (Math.random() > 0.5 ? 1 : -1) * (3 + Math.floor(Math.random() * 15));

      const fakeDate = `${String(fakeDay).padStart(2, '0')} de ${months[fakeMonthIdx]} de ${Math.max(1845, fakeYear)}`;
      if (!usedDates.has(fakeDate)) {
        usedDates.add(fakeDate);
        fakeDates.push(fakeDate);
      }
    }

    return fakeDates;
  }

  /**
   * Genera preguntas aleatorias de todas las categorías
   */
  generateRandomQuestions(count = 10) {
    const generators = [
      () => this.generateProvinciaQuestions(2),
      () => this.generateDatosProvinciasQuestions(2),
      () => this.generatePersonajesQuestions(2),
      () => this.generatePresidentesQuestions(2),
      () => this.generatePeriodosQuestions(2),
      () => this.generateLeyesQuestions(2),
      () => this.generateFechasQuestions(2),
      () => this.generateRegionesQuestions(2),
      () => this.generateSuperficieQuestions(2),
      () => this.generateEscudosQuestions(2),
      () => this.generateMunicipiosQuestions(2),
      () => this.generateFundacionesQuestions(2),
      () => this.generateEscudosMunicipiosQuestions(2)
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
  generateQuestions(category, count = 10, recentIds = []) {
    this.reset();

    switch (category) {
      case 'provincias':
        return this.generateProvinciaQuestions(count, recentIds);
      case 'datosProvincias':
        return this.generateDatosProvinciasQuestions(count);
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
        return this.generateEscudosQuestions(count, recentIds);
      case 'municipios':
        return this.generateMunicipiosQuestions(count);
      case 'fundaciones':
        return this.generateFundacionesQuestions(count);
      case 'escudosMunicipios':
        return this.generateEscudosMunicipiosQuestions(count);
      case 'random':
        return this.generateRandomQuestions(count);
      default:
        return this.generateRandomQuestions(count);
    }
  }
}

// Instancia global del generador
window.questionGenerator = new QuestionGenerator();
