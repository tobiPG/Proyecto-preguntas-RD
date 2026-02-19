/**
 * RD Quiz - Definiciones y datos
 * Base de datos completa sobre República Dominicana
 */

const RD_DATA = {
  // ===== LAS 32 PROVINCIAS DE REPÚBLICA DOMINICANA =====
  provincias: [
    { id: 'azua', nombre: 'Azua', capital: 'Azua de Compostela', region: 'Valdesia', poblacion: 214311, superficie: 2682.5, dato: 'Fundada en 1504, una de las villas más antiguas' },
    { id: 'bahoruco', nombre: 'Bahoruco', capital: 'Neiba', region: 'Enriquillo', poblacion: 97313, superficie: 1284.9, dato: 'Hogar del Lago Enriquillo' },
    { id: 'barahona', nombre: 'Barahona', capital: 'Santa Cruz de Barahona', region: 'Enriquillo', poblacion: 187105, superficie: 1660.2, dato: 'Conocida por sus minas de larimar' },
    { id: 'dajabon', nombre: 'Dajabón', capital: 'Dajabón', region: 'Cibao Noroeste', poblacion: 63955, superficie: 1021.3, dato: 'Frontera con Haití, mercado binacional' },
    { id: 'distrito-nacional', nombre: 'Distrito Nacional', capital: 'Santo Domingo', region: 'Ozama', poblacion: 965040, superficie: 91.6, dato: 'Capital del país, ciudad primada de América' },
    { id: 'duarte', nombre: 'Duarte', capital: 'San Francisco de Macorís', region: 'Cibao Nordeste', poblacion: 289574, superficie: 1649.5, dato: 'Nombrada en honor a Juan Pablo Duarte' },
    { id: 'elias-pina', nombre: 'Elías Piña', capital: 'Comendador', region: 'El Valle', poblacion: 63029, superficie: 1395.5, dato: 'Zona fronteriza con importante comercio' },
    { id: 'el-seibo', nombre: 'El Seibo', capital: 'Santa Cruz del Seibo', region: 'Yuma', poblacion: 87680, superficie: 1788.4, dato: 'Rica en historia taína' },
    { id: 'espaillat', nombre: 'Espaillat', capital: 'Moca', region: 'Cibao Norte', poblacion: 231938, superficie: 843.0, dato: 'Cuna de los ajusticiadores de Trujillo' },
    { id: 'hato-mayor', nombre: 'Hato Mayor', capital: 'Hato Mayor del Rey', region: 'Higuamo', poblacion: 85017, superficie: 1319.3, dato: 'Importante producción ganadera' },
    { id: 'hermanas-mirabal', nombre: 'Hermanas Mirabal', capital: 'Salcedo', region: 'Cibao Nordeste', poblacion: 92193, superficie: 427.4, dato: 'Honra a las heroínas Mirabal' },
    { id: 'independencia', nombre: 'Independencia', capital: 'Jimaní', region: 'Enriquillo', poblacion: 52589, superficie: 2007.4, dato: 'Frontera sur con Haití' },
    { id: 'la-altagracia', nombre: 'La Altagracia', capital: 'Higüey', region: 'Yuma', poblacion: 273210, superficie: 2998.4, dato: 'Hogar de la Basílica de Higüey y Punta Cana' },
    { id: 'la-romana', nombre: 'La Romana', capital: 'La Romana', region: 'Yuma', poblacion: 245433, superficie: 652.1, dato: 'Centro turístico y de Zona Franca' },
    { id: 'la-vega', nombre: 'La Vega', capital: 'Concepción de La Vega', region: 'Cibao Sur', poblacion: 394205, superficie: 2292.5, dato: 'Famosa por su carnaval' },
    { id: 'maria-trinidad-sanchez', nombre: 'María Trinidad Sánchez', capital: 'Nagua', region: 'Cibao Nordeste', poblacion: 140925, superficie: 1206.5, dato: 'Nombrada en honor a la heroína trinitaria' },
    { id: 'monsenor-nouel', nombre: 'Monseñor Nouel', capital: 'Bonao', region: 'Cibao Sur', poblacion: 165224, superficie: 992.0, dato: 'Centro minero de ferroníquel' },
    { id: 'monte-cristi', nombre: 'Monte Cristi', capital: 'San Fernando de Monte Cristi', region: 'Cibao Noroeste', poblacion: 109607, superficie: 1885.8, dato: 'Parque Nacional Monte Cristi' },
    { id: 'monte-plata', nombre: 'Monte Plata', capital: 'Monte Plata', region: 'Higuamo', poblacion: 185956, superficie: 2601.6, dato: 'Importante producción agrícola' },
    { id: 'pedernales', nombre: 'Pedernales', capital: 'Pedernales', region: 'Enriquillo', poblacion: 31587, superficie: 2080.5, dato: 'La más al sur, frontera con Haití' },
    { id: 'peravia', nombre: 'Peravia', capital: 'Baní', region: 'Valdesia', poblacion: 184344, superficie: 785.2, dato: 'Famosa por sus mangos y salinas' },
    { id: 'puerto-plata', nombre: 'Puerto Plata', capital: 'San Felipe de Puerto Plata', region: 'Cibao Norte', poblacion: 321597, superficie: 1805.6, dato: 'Costa del Ámbar, destino turístico' },
    { id: 'samana', nombre: 'Samaná', capital: 'Santa Bárbara de Samaná', region: 'Cibao Nordeste', poblacion: 91875, superficie: 862.8, dato: 'Avistamiento de ballenas jorobadas' },
    { id: 'san-cristobal', nombre: 'San Cristóbal', capital: 'San Cristóbal', region: 'Valdesia', poblacion: 569930, superficie: 1240.6, dato: 'Cuna de la Constitución dominicana' },
    { id: 'san-jose-de-ocoa', nombre: 'San José de Ocoa', capital: 'San José de Ocoa', region: 'Valdesia', poblacion: 59544, superficie: 853.4, dato: 'Zona montañosa y agrícola' },
    { id: 'san-juan', nombre: 'San Juan', capital: 'San Juan de la Maguana', region: 'El Valle', poblacion: 232333, superficie: 3363.8, dato: 'Valle de San Juan, granero del sur' },
    { id: 'san-pedro-de-macoris', nombre: 'San Pedro de Macorís', capital: 'San Pedro de Macorís', region: 'Higuamo', poblacion: 290458, superficie: 1254.3, dato: 'Cuna de grandes peloteros' },
    { id: 'sanchez-ramirez', nombre: 'Sánchez Ramírez', capital: 'Cotuí', region: 'Cibao Sur', poblacion: 151392, superficie: 1185.8, dato: 'Importante minería de oro' },
    { id: 'santiago', nombre: 'Santiago', capital: 'Santiago de los Caballeros', region: 'Cibao Norte', poblacion: 963422, superficie: 2806.3, dato: 'Segunda ciudad más importante, Ciudad Corazón' },
    { id: 'santiago-rodriguez', nombre: 'Santiago Rodríguez', capital: 'San Ignacio de Sabaneta', region: 'Cibao Noroeste', poblacion: 57476, superficie: 1147.5, dato: 'Presa de Monción' },
    { id: 'santo-domingo', nombre: 'Santo Domingo', capital: 'Santo Domingo Este', region: 'Ozama', poblacion: 2374370, superficie: 1302.2, dato: 'Provincia más poblada del país' },
    { id: 'valverde', nombre: 'Valverde', capital: 'Mao', region: 'Cibao Noroeste', poblacion: 163030, superficie: 823.0, dato: 'La línea noroeste, producción de arroz' }
  ],

  // ===== PRESIDENTES DE REPÚBLICA DOMINICANA =====
  presidentes: [
    { nombre: 'Pedro Santana', periodos: ['1844-1848', '1853-1856', '1858-1861'], partido: 'Conservador', dato: 'Primer presidente constitucional' },
    { nombre: 'Manuel Jimenes', periodos: ['1848-1849'], partido: 'Liberal', dato: 'Segundo presidente del país' },
    { nombre: 'Buenaventura Báez', periodos: ['1849-1853', '1856-1858', '1865-1866', '1868-1874', '1876-1878'], partido: 'Rojo', dato: 'Presidente en 5 ocasiones' },
    { nombre: 'José Desiderio Valverde', periodos: ['1857-1858'], partido: 'Liberal', dato: 'Presidente durante la Revolución Cibaeña' },
    { nombre: 'Pedro Antonio Pimentel', periodos: ['1865'], partido: 'Restaurador', dato: 'Presidente durante la Restauración' },
    { nombre: 'José María Cabral', periodos: ['1865', '1866-1868'], partido: 'Azul', dato: 'Militar y político' },
    { nombre: 'Gregorio Luperón', periodos: ['1879-1880'], partido: 'Azul', dato: 'Héroe de la Restauración' },
    { nombre: 'Ulises Heureaux (Lilís)', periodos: ['1882-1884', '1887-1899'], partido: 'Azul', dato: 'Dictador, gobernó 13 años' },
    { nombre: 'Horacio Vásquez', periodos: ['1899', '1902-1903', '1924-1930'], partido: 'Horacista', dato: 'Tres veces presidente' },
    { nombre: 'Juan Isidro Jimenes', periodos: ['1899-1902', '1914-1916'], partido: 'Jimenista', dato: 'Derrocado durante intervención USA' },
    { nombre: 'Ramón Cáceres', periodos: ['1906-1911'], partido: 'Horacista', dato: 'Asesinado en 1911' },
    { nombre: 'Rafael Leónidas Trujillo', periodos: ['1930-1938', '1942-1952'], partido: 'Dominicano', dato: 'Dictador por 31 años (1930-1961)' },
    { nombre: 'Héctor Trujillo', periodos: ['1952-1960'], partido: 'Dominicano', dato: 'Hermano de Trujillo, presidente títere' },
    { nombre: 'Joaquín Balaguer', periodos: ['1960-1962', '1966-1978', '1986-1996'], partido: 'PRSC', dato: 'Gobernó 22 años en total' },
    { nombre: 'Juan Bosch', periodos: ['1963'], partido: 'PRD', dato: 'Primer presidente elegido democráticamente post-Trujillo' },
    { nombre: 'Donald Reid Cabral', periodos: ['1963-1965'], partido: 'Triunvirato', dato: 'Gobierno de facto' },
    { nombre: 'Antonio Guzmán', periodos: ['1978-1982'], partido: 'PRD', dato: 'Primera transición democrática pacífica' },
    { nombre: 'Salvador Jorge Blanco', periodos: ['1982-1986'], partido: 'PRD', dato: 'Enfrentó crisis económica' },
    { nombre: 'Leonel Fernández', periodos: ['1996-2000', '2004-2012'], partido: 'PLD', dato: 'Tres períodos presidenciales' },
    { nombre: 'Hipólito Mejía', periodos: ['2000-2004'], partido: 'PRD', dato: 'Intentó reelección fallida' },
    { nombre: 'Danilo Medina', periodos: ['2012-2020'], partido: 'PLD', dato: 'Dos períodos consecutivos' },
    { nombre: 'Luis Abinader', periodos: ['2020-presente'], partido: 'PRM', dato: 'Presidente actual desde 2020' }
  ],

  // ===== PERSONAJES HISTÓRICOS =====
  personajes: [
    { nombre: 'Juan Pablo Duarte', titulo: 'Padre de la Patria', nacimiento: 1813, muerte: 1876, dato: 'Fundador de La Trinitaria, ideólogo de la independencia' },
    { nombre: 'Matías Ramón Mella', titulo: 'Padre de la Patria', nacimiento: 1816, muerte: 1864, dato: 'Disparó el trabucazo del 27 de febrero' },
    { nombre: 'Francisco del Rosario Sánchez', titulo: 'Padre de la Patria', nacimiento: 1817, muerte: 1861, dato: 'Primer presidente de la Junta Gubernativa' },
    { nombre: 'María Trinidad Sánchez', titulo: 'Heroína', nacimiento: 1794, muerte: 1845, dato: 'Mártir de la independencia, confeccionó la primera bandera' },
    { nombre: 'Concepción Bona', titulo: 'Heroína', nacimiento: 1824, muerte: 1901, dato: 'Cosió la primera bandera dominicana' },
    { nombre: 'Salomé Ureña', titulo: 'Poetisa Nacional', nacimiento: 1850, muerte: 1897, dato: 'Fundadora del Instituto de Señoritas' },
    { nombre: 'Gregorio Luperón', titulo: 'Héroe de la Restauración', nacimiento: 1839, muerte: 1897, dato: 'Líder militar de la Guerra de Restauración' },
    { nombre: 'Las Hermanas Mirabal', titulo: 'Mariposas', nacimiento: 1924, muerte: 1960, dato: 'Símbolo de resistencia contra Trujillo' },
    { nombre: 'Pedro Henríquez Ureña', titulo: 'Humanista', nacimiento: 1884, muerte: 1946, dato: 'Intelectual y crítico literario' },
    { nombre: 'Juan Bosch', titulo: 'Escritor y Político', nacimiento: 1909, muerte: 2001, dato: 'Maestro del cuento latinoamericano' },
    { nombre: 'Eugenio María de Hostos', titulo: 'El Gran Ciudadano de América', nacimiento: 1839, muerte: 1903, dato: 'Educador y reformador social' },
    { nombre: 'Máximo Gómez', titulo: 'El Generalísimo', nacimiento: 1836, muerte: 1905, dato: 'Héroe de la independencia de Cuba' },
    { nombre: 'Anacaona', titulo: 'Cacica Taína', nacimiento: 1474, muerte: 1503, dato: 'Reina taína de Jaragua' },
    { nombre: 'Enriquillo', titulo: 'Cacique Rebelde', nacimiento: 1498, muerte: 1535, dato: 'Líder de la rebelión taína' },
    { nombre: 'Manuela Diez', titulo: 'Madre de Duarte', nacimiento: 1786, muerte: 1858, dato: 'Madre del padre de la patria' },
    { nombre: 'Rosa Duarte', titulo: 'Hermana de Duarte', nacimiento: 1820, muerte: 1888, dato: 'Preservó los escritos de Duarte' }
  ],

  // ===== FECHAS HISTÓRICAS =====
  fechas: [
    // === PERÍODO COLONIAL Y DESCUBRIMIENTO ===
    { fecha: '12 de octubre de 1492', evento: 'Llegada de Colón a América', descripcion: 'Cristóbal Colón llega al continente americano', categoria: 'colonial', año: 1492 },
    { fecha: '5 de diciembre de 1492', evento: 'Descubrimiento de La Hispaniola', descripcion: 'Colón llega a la isla que llamó La Española', categoria: 'colonial', año: 1492 },
    { fecha: '25 de diciembre de 1492', evento: 'Fundación de La Navidad', descripcion: 'Primer asentamiento europeo en América', categoria: 'colonial', año: 1492 },
    { fecha: '4 de agosto de 1496', evento: 'Fundación de Santo Domingo', descripcion: 'Bartolomé Colón funda la ciudad primada de América', categoria: 'colonial', año: 1496 },
    { fecha: '1503', evento: 'Muerte de Anacaona', descripcion: 'La cacica taína es ejecutada por los españoles', categoria: 'colonial', año: 1503 },
    { fecha: '1511', evento: 'Creación de la Real Audiencia', descripcion: 'Se crea la Real Audiencia de Santo Domingo, primera corte de justicia en América', categoria: 'colonial', año: 1511 },
    { fecha: '1512', evento: 'Inicio construcción Catedral Primada', descripcion: 'Comienza la construcción de la Catedral Primada de América', categoria: 'colonial', año: 1512 },
    { fecha: '1519', evento: 'Rebelión de Enriquillo', descripcion: 'El cacique inicia su resistencia en el Bahoruco', categoria: 'colonial', año: 1519 },
    { fecha: '1533', evento: 'Tratado con Enriquillo', descripcion: 'Se firma la paz con el cacique rebelde', categoria: 'colonial', año: 1533 },
    { fecha: '1586', evento: 'Ataque de Francis Drake', descripcion: 'El pirata inglés saquea Santo Domingo', categoria: 'colonial', año: 1586 },
    { fecha: '1697', evento: 'Tratado de Ryswick', descripcion: 'España cede el oeste de la isla a Francia', categoria: 'colonial', año: 1697 },
    { fecha: '22 de julio de 1795', evento: 'Tratado de Basilea', descripcion: 'España cede toda la isla a Francia', categoria: 'colonial', año: 1795 },
    
    // === ESPAÑA BOBA Y OCUPACIÓN HAITIANA ===
    { fecha: '1809', evento: 'Inicio de la España Boba', descripcion: 'Comienza el período de abandono español conocido como España Boba', categoria: 'independencia', año: 1809 },
    
    // === LUCHAS POR LA INDEPENDENCIA ===
    { fecha: '26 de enero de 1813', evento: 'Nacimiento de Juan Pablo Duarte', descripcion: 'Nace el Padre de la Patria en Santo Domingo', categoria: 'independencia', año: 1813 },
    { fecha: '1 de diciembre de 1821', evento: 'Independencia Efímera', descripcion: 'José Núñez de Cáceres proclama independencia de España', categoria: 'independencia', año: 1821 },
    { fecha: '9 de febrero de 1822', evento: 'Ocupación Haitiana', descripcion: 'Jean-Pierre Boyer unifica la isla bajo dominio haitiano', categoria: 'independencia', año: 1822 },
    { fecha: '16 de julio de 1838', evento: 'Fundación de La Trinitaria', descripcion: 'Juan Pablo Duarte funda la sociedad secreta patriótica', categoria: 'independencia', año: 1838 },
    { fecha: '27 de febrero de 1844', evento: 'Independencia Nacional', descripcion: 'Proclamación de la República Dominicana en la Puerta del Conde', categoria: 'independencia', año: 1844 },
    { fecha: '27 de febrero de 1844', evento: 'Creación de la Bandera Dominicana', descripcion: 'Se iza por primera vez la bandera nacional en la Puerta del Conde', categoria: 'independencia', año: 1844 },
    { fecha: '19 de marzo de 1844', evento: 'Batalla del 19 de Marzo (Azua)', descripcion: 'Primera batalla de la independencia contra Haití', categoria: 'batallas', año: 1844 },
    { fecha: '30 de marzo de 1844', evento: 'Batalla del 30 de Marzo (Santiago)', descripcion: 'Victoria decisiva sobre el ejército haitiano', categoria: 'batallas', año: 1844 },
    { fecha: '6 de noviembre de 1844', evento: 'Primera Constitución', descripcion: 'Se promulga la primera Constitución dominicana en San Cristóbal', categoria: 'independencia', año: 1844 },
    { fecha: '21 de diciembre de 1844', evento: 'Batalla de La Estrelleta', descripcion: 'Victoria dominicana en el sur del país', categoria: 'batallas', año: 1844 },
    { fecha: '17 de septiembre de 1845', evento: 'Batalla de Beler', descripcion: 'Importante victoria sobre invasión haitiana', categoria: 'batallas', año: 1845 },
    { fecha: '22 de septiembre de 1845', evento: 'Batalla de La Sabana', descripcion: 'Otra victoria contra el ejército haitiano', categoria: 'batallas', año: 1845 },
    { fecha: '21 de abril de 1849', evento: 'Batalla de Las Carreras', descripcion: 'Victoria decisiva sobre las fuerzas haitianas de Soulouque', categoria: 'batallas', año: 1849 },
    
    // === PERÍODO DE ANEXIÓN Y RESTAURACIÓN ===
    { fecha: '18 de marzo de 1861', evento: 'Anexión a España', descripcion: 'Pedro Santana anexa el país a España', categoria: 'restauracion', año: 1861 },
    { fecha: '16 de agosto de 1863', evento: 'Grito de Capotillo', descripcion: 'Inicio de la Guerra de Restauración contra España', categoria: 'restauracion', año: 1863 },
    { fecha: '14 de septiembre de 1863', evento: 'Gobierno Restaurador', descripcion: 'Se instala el gobierno provisional en Santiago', categoria: 'restauracion', año: 1863 },
    { fecha: '3 de marzo de 1865', evento: 'Restauración de la República', descripcion: 'Fin de la anexión, España abandona el país', categoria: 'restauracion', año: 1865 },
    { fecha: '11 de julio de 1865', evento: 'Fin de la Guerra Restauradora', descripcion: 'Últimas tropas españolas abandonan Santo Domingo', categoria: 'restauracion', año: 1865 },
    { fecha: '15 de julio de 1876', evento: 'Muerte de Juan Pablo Duarte', descripcion: 'Fallece el Padre de la Patria en Caracas, Venezuela', categoria: 'restauracion', año: 1876 },
    
    // === SIGLO XX - EVENTOS IMPORTANTES ===
    { fecha: '26 de julio de 1899', evento: 'Muerte de Ulises Heureaux', descripcion: 'Asesinato del dictador Lilís en Moca', categoria: 'siglo20', año: 1899 },
    { fecha: '29 de noviembre de 1916', evento: 'Inicio Ocupación Estadounidense', descripcion: 'Estados Unidos ocupa militarmente el país', categoria: 'siglo20', año: 1916 },
    { fecha: '12 de julio de 1924', evento: 'Fin de la Primera Ocupación', descripcion: 'Retiro de las tropas estadounidenses', categoria: 'siglo20', año: 1924 },
    { fecha: '16 de agosto de 1930', evento: 'Inicio Era de Trujillo', descripcion: 'Rafael Leónidas Trujillo asume el poder', categoria: 'siglo20', año: 1930 },
    { fecha: '3 de septiembre de 1930', evento: 'Huracán San Zenón', descripcion: 'Devastador huracán destruye Santo Domingo', categoria: 'siglo20', año: 1930 },
    { fecha: '2 de octubre de 1937', evento: 'Masacre del Perejil', descripcion: 'Genocidio de haitianos ordenado por Trujillo', categoria: 'siglo20', año: 1937 },
    { fecha: '25 de noviembre de 1960', evento: 'Asesinato Hermanas Mirabal', descripcion: 'Las Mariposas son asesinadas por orden de Trujillo', categoria: 'siglo20', año: 1960 },
    { fecha: '30 de mayo de 1961', evento: 'Ajusticiamiento de Trujillo', descripcion: 'Fin de la dictadura trujillista de 31 años', categoria: 'siglo20', año: 1961 },
    { fecha: '20 de diciembre de 1962', evento: 'Elección de Juan Bosch', descripcion: 'Juan Bosch es electo presidente en las primeras elecciones libres post-Trujillo', categoria: 'siglo20', año: 1962 },
    { fecha: '27 de febrero de 1963', evento: 'Toma de posesión de Juan Bosch', descripcion: 'Primer presidente elegido democráticamente post-Trujillo', categoria: 'siglo20', año: 1963 },
    { fecha: '25 de septiembre de 1963', evento: 'Golpe de Estado a Bosch', descripcion: 'Militares derrocan al presidente electo', categoria: 'siglo20', año: 1963 },
    { fecha: '24 de abril de 1965', evento: 'Revolución de Abril', descripcion: 'Inicio del levantamiento constitucionalista', categoria: 'siglo20', año: 1965 },
    { fecha: '28 de abril de 1965', evento: 'Segunda Ocupación Estadounidense', descripcion: 'Tropas de EE.UU. invaden durante la Guerra Civil', categoria: 'siglo20', año: 1965 },
    { fecha: '3 de septiembre de 1965', evento: 'Acta de Reconciliación', descripcion: 'Fin del conflicto armado de la Revolución de Abril', categoria: 'siglo20', año: 1965 },
    { fecha: '1 de junio de 1966', evento: 'Elección de Joaquín Balaguer', descripcion: 'Balaguer es electo presidente por primera vez', categoria: 'siglo20', año: 1966 },
    { fecha: '16 de agosto de 1978', evento: 'Primera Transición Democrática', descripcion: 'Antonio Guzmán asume, primera alternancia pacífica', categoria: 'siglo20', año: 1978 },
    
    // === DÍAS PATRIOS Y CONMEMORACIONES ===
    { fecha: '26 de enero', evento: 'Día de Duarte', descripcion: 'Natalicio de Juan Pablo Duarte, Padre de la Patria', categoria: 'festividades' },
    { fecha: '27 de febrero', evento: 'Día de la Independencia', descripcion: 'Fiesta patria principal, proclamación de la República', categoria: 'festividades' },
    { fecha: '9 de marzo', evento: 'Día de Sánchez', descripcion: 'Natalicio de Francisco del Rosario Sánchez', categoria: 'festividades' },
    { fecha: '25 de febrero', evento: 'Día de Mella', descripcion: 'Natalicio de Matías Ramón Mella', categoria: 'festividades' },
    { fecha: '1 de mayo', evento: 'Día del Trabajo', descripcion: 'Conmemoración de los trabajadores', categoria: 'festividades' },
    { fecha: '30 de mayo', evento: 'Día de la Libertad', descripcion: 'Conmemoración del fin de la dictadura de Trujillo', categoria: 'festividades' },
    { fecha: '16 de agosto', evento: 'Día de la Restauración', descripcion: 'Conmemoración del Grito de Capotillo', categoria: 'festividades' },
    { fecha: '24 de septiembre', evento: 'Día de las Mercedes', descripcion: 'Patrona de los dominicanos', categoria: 'festividades' },
    { fecha: '6 de noviembre', evento: 'Día de la Constitución', descripcion: 'Aniversario de la primera Constitución de 1844', categoria: 'festividades' },
    { fecha: '25 de noviembre', evento: 'Día de la No Violencia Contra la Mujer', descripcion: 'En honor a las Hermanas Mirabal, fecha internacional', categoria: 'festividades' },
    { fecha: '21 de enero', evento: 'Día de la Altagracia', descripcion: 'Patrona de los dominicanos, fiesta religiosa', categoria: 'festividades' },
    
    // === BATALLAS IMPORTANTES ADICIONALES ===
    { fecha: '21 de enero de 1855', evento: 'Batalla de Santomé', descripcion: 'Victoria sobre invasión haitiana del emperador Soulouque', categoria: 'batallas', año: 1855 },
    { fecha: '22 de enero de 1855', evento: 'Batalla de Cambronal', descripcion: 'Parte de la campaña contra Soulouque', categoria: 'batallas', año: 1855 },
    { fecha: '17 de diciembre de 1855', evento: 'Batalla de Sabana Larga', descripcion: 'Última gran batalla contra Haití', categoria: 'batallas', año: 1855 },
    { fecha: '6 de septiembre de 1863', evento: 'Batalla de Santiago (Restauración)', descripcion: 'Incendio de Santiago para no entregarla a españoles', categoria: 'batallas', año: 1863 },
    
    // === EVENTOS CONTEMPORÁNEOS ===
    { fecha: '22 de septiembre de 1998', evento: 'Huracán Georges', descripcion: 'Devastador huracán categoría 3 impacta el país', categoria: 'contemporaneo', año: 1998 },
    { fecha: '16 de agosto de 2004', evento: 'Leonel Fernández segundo periodo', descripcion: 'Regresa al poder después de Hipólito Mejía', categoria: 'contemporaneo', año: 2004 },
    { fecha: '16 de agosto de 2012', evento: 'Danilo Medina presidente', descripcion: 'Inicia el gobierno del PLD con nuevo mandatario', categoria: 'contemporaneo', año: 2012 },
    { fecha: '16 de agosto de 2020', evento: 'Luis Abinader presidente', descripcion: 'El PRM gana las elecciones, fin de 16 años del PLD', categoria: 'contemporaneo', año: 2020 }
  ],

  // ===== ARTÍCULOS DE LA CONSTITUCIÓN =====
  constitucion: [
    { articulo: 1, titulo: 'Nación y Estado', texto: 'El pueblo dominicano constituye una Nación organizada en Estado libre e independiente, con el nombre de República Dominicana.' },
    { articulo: 5, titulo: 'Fundamento de la Constitución', texto: 'La Constitución se fundamenta en el respeto a la dignidad humana y en la indisoluble unidad de la Nación, patria común de todos los dominicanos.' },
    { articulo: 6, titulo: 'Supremacía de la Constitución', texto: 'Todas las personas y los órganos que ejercen potestades públicas están sujetos a la Constitución, norma suprema y fundamento del ordenamiento jurídico del Estado.' },
    { articulo: 7, titulo: 'Estado Social y Democrático de Derecho', texto: 'La República Dominicana es un Estado Social y Democrático de Derecho, organizado en forma de República unitaria.' },
    { articulo: 8, titulo: 'Función esencial del Estado', texto: 'Es función esencial del Estado, la protección efectiva de los derechos de la persona, el respeto de su dignidad y la obtención de los medios que le permitan perfeccionarse de forma igualitaria.' },
    { articulo: 9, titulo: 'Territorio Nacional', texto: 'El territorio de la República Dominicana es inalienable. Está conformado por la parte oriental de la isla de Santo Domingo y sus islas adyacentes.' },
    { articulo: 14, titulo: 'Idioma Oficial', texto: 'El idioma oficial de la República Dominicana es el español.' },
    { articulo: 18, titulo: 'Bandera Nacional', texto: 'La Bandera Nacional es la Tricolor, cruzada en el centro por una cruz blanca. Sus cuatro colores son azul ultramar y rojo bermellón.' },
    { articulo: 30, titulo: 'Escudo Nacional', texto: 'El Escudo Nacional tiene los mismos colores de la Bandera Nacional dispuestos en igual forma. Lleva en el centro la Biblia abierta en el Evangelio de San Juan.' },
    { articulo: 31, titulo: 'Himno Nacional', texto: 'El Himno Nacional es la composición musical de José Reyes con letras de Emilio Prud\'Homme.' },
    { articulo: 32, titulo: 'Lema Nacional', texto: 'El lema de la República es: Dios, Patria y Libertad.' },
    { articulo: 37, titulo: 'Derecho a la Vida', texto: 'El derecho a la vida es inviolable desde la concepción hasta la muerte.' },
    { articulo: 38, titulo: 'Dignidad Humana', texto: 'El Estado se fundamenta en el respeto a la dignidad de la persona y se organiza para la protección real y efectiva de los derechos fundamentales.' },
    { articulo: 39, titulo: 'Derecho a la Igualdad', texto: 'Todas las personas nacen libres e iguales ante la ley, reciben la misma protección y trato de las instituciones.' },
    { articulo: 40, titulo: 'Derecho a la Libertad y Seguridad Personal', texto: 'Toda persona tiene derecho a la libertad y seguridad personal.' },
    { articulo: 42, titulo: 'Derecho a la Integridad Personal', texto: 'Toda persona tiene derecho a que se respete su integridad física, psíquica, moral y sexual.' },
    { articulo: 44, titulo: 'Derecho a la Intimidad', texto: 'Toda persona tiene derecho a la intimidad. Se garantiza el respeto y la no injerencia en la vida privada.' },
    { articulo: 49, titulo: 'Libertad de Expresión', texto: 'Toda persona tiene derecho a expresar libremente sus pensamientos, ideas y opiniones, por cualquier medio.' },
    { articulo: 55, titulo: 'Derechos de la Familia', texto: 'La familia es el fundamento de la sociedad y el espacio básico para el desarrollo integral de las personas.' },
    { articulo: 56, titulo: 'Protección de Menores', texto: 'La familia, la sociedad y el Estado, harán primar el interés superior del niño, niña y adolescente.' },
    { articulo: 58, titulo: 'Protección de Personas Discapacitadas', texto: 'El Estado promoverá, protegerá y asegurará el goce de todos los derechos humanos de las personas con discapacidad.' },
    { articulo: 59, titulo: 'Derecho a la Vivienda', texto: 'Toda persona tiene derecho a una vivienda digna con servicios básicos esenciales.' },
    { articulo: 61, titulo: 'Derecho a la Salud', texto: 'Toda persona tiene derecho a la salud integral.' },
    { articulo: 62, titulo: 'Derecho al Trabajo', texto: 'El trabajo es un derecho, un deber y una función social.' },
    { articulo: 63, titulo: 'Derecho a la Educación', texto: 'Toda persona tiene derecho a una educación integral, de calidad, permanente, en igualdad de condiciones y oportunidades.' },
    { articulo: 66, titulo: 'Derechos Colectivos', texto: 'El Estado reconoce los derechos e intereses colectivos y difusos.' },
    { articulo: 75, titulo: 'Deberes Fundamentales', texto: 'Los derechos fundamentales reconocidos en esta Constitución determinan la existencia de un orden de responsabilidad jurídica y moral.' },
    { articulo: 128, titulo: 'Poder Ejecutivo', texto: 'El Poder Ejecutivo se ejerce por el presidente de la República, quien será elegido cada cuatro años por voto directo.' },
    { articulo: 148, titulo: 'Integración del Congreso Nacional', texto: 'El Poder Legislativo se ejerce en nombre del pueblo por el Congreso Nacional, conformado por el Senado y la Cámara de Diputados.' },
    { articulo: 149, titulo: 'Composición del Senado', texto: 'El Senado se compone de miembros elegidos a razón de uno por cada provincia y uno por el Distrito Nacional.' },
    { articulo: 152, titulo: 'Requisitos para ser Legislador', texto: 'Para ser senador o diputado se requiere ser dominicano en pleno ejercicio de los derechos civiles y políticos y haber cumplido veinticinco años.' }
  ],

  // ===== SÍMBOLOS PATRIOS =====
  simbolos: [
    { nombre: 'Bandera Nacional', descripcion: 'Cruzada por una cruz blanca, cuartos azul y rojo alternados', creador: 'Juan Pablo Duarte', fecha: '1844' },
    { nombre: 'Escudo Nacional', descripcion: 'Contiene la Biblia abierta, ramas de laurel y palma', lema: 'Dios, Patria y Libertad', fecha: '1844' },
    { nombre: 'Himno Nacional', descripcion: 'Quisqueyanos valientes, alcemos...', autor: 'Emilio Prud\'Homme (letra), José Reyes (música)', fecha: '1883' },
    { nombre: 'Flor Nacional', descripcion: 'Rosa de Bayahíbe (Pereskia quisqueyana)', dato: 'Endémica de República Dominicana' },
    { nombre: 'Ave Nacional', descripcion: 'Cigua Palmera (Dulus dominicus)', dato: 'Ave endémica del país' },
    { nombre: 'Árbol Nacional', descripcion: 'Caoba (Swietenia mahagoni)', dato: 'Madera preciosa del Caribe' }
  ],

  // ===== REGIONES DEL PAÍS =====
  regiones: [
    { nombre: 'Cibao Norte', provincias: ['Santiago', 'Puerto Plata', 'Espaillat'] },
    { nombre: 'Cibao Sur', provincias: ['La Vega', 'Monseñor Nouel', 'Sánchez Ramírez'] },
    { nombre: 'Cibao Nordeste', provincias: ['Duarte', 'María Trinidad Sánchez', 'Hermanas Mirabal', 'Samaná'] },
    { nombre: 'Cibao Noroeste', provincias: ['Valverde', 'Monte Cristi', 'Dajabón', 'Santiago Rodríguez'] },
    { nombre: 'Valdesia', provincias: ['San Cristóbal', 'Peravia', 'Azua', 'San José de Ocoa'] },
    { nombre: 'El Valle', provincias: ['San Juan', 'Elías Piña'] },
    { nombre: 'Enriquillo', provincias: ['Barahona', 'Bahoruco', 'Independencia', 'Pedernales'] },
    { nombre: 'Yuma', provincias: ['La Romana', 'La Altagracia', 'El Seibo', 'Hato Mayor', 'San Pedro de Macorís'] },
    { nombre: 'Ozama', provincias: ['Distrito Nacional', 'Santo Domingo', 'Monte Plata'] }
  ]
};

// Categorías del quiz
const CATEGORIES = {
  provincias: {
    id: 'provincias',
    name: 'Provincias',
    icon: '🗺️',
    description: 'Identifica las provincias en el mapa',
    questionsPerGame: 10
  },
  personajes: {
    id: 'personajes',
    name: 'Personajes Históricos',
    icon: '🦸',
    description: 'Héroes y figuras importantes',
    questionsPerGame: 10
  },
  presidentes: {
    id: 'presidentes',
    name: 'Presidentes',
    icon: '🏛️',
    description: 'Conoce a los mandatarios',
    questionsPerGame: 10
  },
  periodos: {
    id: 'periodos',
    name: 'Períodos Presidenciales',
    icon: '📅',
    description: '¿Quién gobernó en ese año?',
    questionsPerGame: 10
  },
  leyes: {
    id: 'leyes',
    name: 'Constitución y Leyes',
    icon: '📜',
    description: 'Artículos constitucionales',
    questionsPerGame: 10
  },
  fechas: {
    id: 'fechas',
    name: 'Fechas Históricas',
    icon: '🗓️',
    description: 'Eventos importantes',
    questionsPerGame: 10
  },
  regiones: {
    id: 'regiones',
    name: 'Ubica la Provincia',
    icon: '📍',
    description: '¿A qué región pertenece cada provincia?',
    questionsPerGame: 10
  },
  superficie: {
    id: 'superficie',
    name: 'Superficie Provincial',
    icon: '📐',
    description: '¿Cuánto mide cada provincia?',
    questionsPerGame: 10
  },
  escudos: {
    id: 'escudos',
    name: 'Escudos Provinciales',
    icon: '🛡️',
    description: '¿A qué provincia pertenece este escudo?',
    questionsPerGame: 10
  }
};

// Logros disponibles
const ACHIEVEMENTS = [
  { id: 'first_game', name: 'Primera Partida', icon: '🎮', condition: 'Completa tu primera partida', requirement: { gamesPlayed: 1 } },
  { id: 'perfect_10', name: 'Perfecto', icon: '💯', condition: '10 respuestas correctas seguidas', requirement: { streak: 10 } },
  { id: 'province_master', name: 'Geógrafo', icon: '🗺️', condition: 'Domina todas las provincias', requirement: { category: 'provincias', percent: 100 } },
  { id: 'region_master', name: 'Cartógrafo', icon: '📍', condition: 'Domina todas las regiones', requirement: { category: 'regiones', percent: 100 } },
  { id: 'historian', name: 'Historiador', icon: '📚', condition: 'Domina fechas históricas', requirement: { category: 'fechas', percent: 100 } },
  { id: 'politico', name: 'Politólogo', icon: '🏛️', condition: 'Domina los presidentes', requirement: { category: 'presidentes', percent: 100 } },
  { id: 'loyal', name: 'Patriota', icon: '🇩🇴', condition: 'Juega 7 días seguidos', requirement: { dailyStreak: 7 } },
  { id: 'expert', name: 'Experto', icon: '🎓', condition: '100 respuestas correctas', requirement: { totalCorrect: 100 } },
  { id: 'master', name: 'Maestro', icon: '👑', condition: '500 respuestas correctas', requirement: { totalCorrect: 500 } },
  { id: 'lawyer', name: 'Jurista', icon: '⚖️', condition: 'Domina la constitución', requirement: { category: 'leyes', percent: 100 } }
];

// Mensajes de resultados según puntuación
const RESULT_MESSAGES = {
  excellent: { min: 90, icon: '🏆', title: '¡Excelente!', message: '¡Eres un verdadero experto dominicano!' },
  great: { min: 70, icon: '🌟', title: '¡Muy Bien!', message: 'Conoces muy bien tu país' },
  good: { min: 50, icon: '👍', title: 'Bien', message: 'Vas por buen camino' },
  learning: { min: 30, icon: '📖', title: 'Sigue Aprendiendo', message: 'Cada día se aprende algo nuevo' },
  beginner: { min: 0, icon: '🌱', title: 'Principiante', message: 'La práctica hace al maestro' }
};

// Exportar para uso global
window.RD_DATA = RD_DATA;
window.CATEGORIES = CATEGORIES;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.RESULT_MESSAGES = RESULT_MESSAGES;
