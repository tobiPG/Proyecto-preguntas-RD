# 📋 RD Quiz - Pendientes para 100%

## Estado Actual: ~78% Completado

---

## 🔴 Alta Prioridad

*(Sin pendientes - ver decisión de monetización en "Completado")*

---

## 🟡 Media Prioridad

### Backend y Autenticación (3%)
- [ ] Crear API backend (Node.js/Firebase)
- [ ] Implementar login con Google/Facebook
- [ ] Sincronizar progreso en la nube
- [ ] Backup/restore de datos del usuario

### Audio y Sonidos (2%)
- [ ] Música de fondo (opcional)
- [ ] Control de volumen en settings

### Escudo Municipal Faltante (0.1%)
- [ ] Buscar escudo de Juan de Herrera (San Juan) - único municipio sin escudo (159/160 actuales)

### Imágenes para Personajes Históricos (1%)
- [ ] Buscar retratos/ilustraciones para los 16 personajes históricos
- [ ] ⚠️ No usar imágenes de presidentes por derechos de autor

### Notificaciones Push (2%)
- [ ] Configurar Firebase Cloud Messaging
- [ ] Recordatorio diario para jugar
- [ ] Notificar vidas recargadas
- [ ] Notificar nuevos logros

---

## 🟢 Baja Prioridad

### Ranking Online (2%)
- [ ] Leaderboard global
- [ ] Leaderboard por categoría
- [ ] Rankings semanales/mensuales

### Compartir en Redes (1%)
- [ ] Compartir puntuación en WhatsApp
- [ ] Compartir en Facebook
- [ ] Compartir en Twitter/X
- [ ] Generar imagen con resultados

### Tutorial (1%)
- [ ] Onboarding para nuevos usuarios
- [ ] Tips durante el juego
- [ ] Explicación de sistema de vidas

### Testing (1%)
- [ ] Tests e2e con Playwright/Cypress

---

## ✅ Completado

- [x] 12 modos de juego
- [x] Sistema de 5 vidas diarias
- [x] Inmunidad de 5 minutos (1x día)
- [x] Preguntas infinitas hasta game over
- [x] Sistema de monedas (ganadas por puntuación)
- [x] Decisión de monetización: sin pagos reales ni anuncios. Monedas se obtienen jugando + códigos de promoción canjeables en la tienda
- [x] Modo oscuro
- [x] PWA con offline support
- [x] 32 provincias con escudos
- [x] 160 municipios
- [x] 159 escudos municipales (solo falta Juan de Herrera)
- [x] Persistencia localStorage
- [x] Sistema de logros
- [x] Estadísticas por categoría
- [x] Botón "Continuar" acumulativo
- [x] 3 tipos de pregunta en Provincias, Regiones, Superficie y Escudos Provinciales (antes solo 1 cada uno)
- [x] Corregido bug de rotación de tipos en Personajes y Fundación de Municipios (todos los tipos pueden aparecer)
- [x] Corregidas opciones de respuesta duplicadas en Personajes, Constitución y Fundación de Municipios
- [x] 4 tipos de pregunta en Fechas Históricas (eventos por año, período histórico, días patrios)
- [x] Habilitado Tipo 7 de Presidentes (sucesión cronológica real) - corregido bug "2 veces" de Danilo Medina y Leonel Fernández
- [x] 5 tipos de pregunta en Regiones (provincia más poblada y con mayor superficie por región)
- [x] 5 tipos de pregunta en Superficie (comparaciones de MENOR superficie agregadas)
- [x] 4 tipos de pregunta en Leyes/Constitución (identificar frase del artículo)
- [x] 7 tipos de pregunta en Personajes Históricos (comparación de quién nació primero)
- [x] 4 tipos de pregunta en Provincias (comparación de población)
- [x] 4 tipos de pregunta en Escudos Provinciales (comparación de población entre 4 provincias)
- [x] Suite de tests unitarios (25 tests con node:test) para questions.js y storage.js - corregido bug de refill de vidas en el primer día
- [x] Tienda simplificada: comprar vidas con monedas + canjear código de promoción (BIENVENIDO, RDQUIZ2026, BETATESTER)
- [x] Sonidos de respuesta correcta/incorrecta/tiempo agotado y logro desbloqueado (Web Audio API, respeta el toggle de Sonido)
- [x] Configuración verificada: toggles de Sonido, Vibración y Modo Oscuro funcionando con feedback inmediato al activarlos
- [x] Código de promoción OZIELRD1: restaura las vidas al máximo, reutilizable sin límite
- [x] Provincias y Escudos Provinciales: se evita repetir el mismo sujeto hasta que pasen 30 distintos (historial persistente)
- [x] Modo Provincias vuelve a ser solo identificación por imagen (1 tipo); nuevo modo "Datos de las Provincias" (capital, región, población y superficie)
- [x] Corregido bug de input de código promocional invisible (texto negro sobre fondo negro en modo oscuro del sistema)

---

*Última actualización: Junio 2026*
