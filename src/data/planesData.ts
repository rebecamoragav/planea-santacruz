import { PlanLugar, Resena, ZonaSantaCruz, TipoPlan } from '../types';

const PLANES_BASE = [
  // ================= CENA =================
  {
    id: 'cena-1',
    nombre: "Sach’a Huaska",
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cena',
    descripcion: 'Cena con comida típica o internacional, cocina de autor y cócteles únicos.',
    precioEstimadoBs: 160,
    ambiente: 'Contemporáneo & Exclusivo',
    minPersonas: 2,
    maxPersonas: 8,
    horarioSugerido: '20:00 - 23:30',
    destacado: true,
    tags: ['Comida típica', 'Internacional', 'Tragos de autor'],
    iconoEmoji: '🥩'
  },
  {
    id: 'cena-2',
    nombre: 'Palosanto',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cena',
    descripcion: 'Cena elegante con amigos, gastronomía gourmet y carta de vinos selecta.',
    precioEstimadoBs: 210,
    ambiente: 'Elegante & Social',
    minPersonas: 2,
    maxPersonas: 12,
    horarioSugerido: '20:30 - 00:00',
    destacado: true,
    tags: ['Gourmet', 'Vinos', 'Amigos'],
    iconoEmoji: '🍷'
  },
  {
    id: 'cena-3',
    nombre: 'The Dubliner / The Steakhouse',
    zona: 'Centro',
    zonaDetalle: 'Centro / Zona Av. Monseñor Rivero',
    tipo: 'cena',
    descripcion: 'Parrilla, cortes de carne premium, tragos y cena animada sobre el boulevard.',
    precioEstimadoBs: 175,
    ambiente: 'Parrillero & Animado',
    minPersonas: 2,
    maxPersonas: 15,
    horarioSugerido: '19:30 - 23:00',
    tags: ['Parrilla', 'Cervezas', 'Carnes'],
    iconoEmoji: '🍖'
  },
  {
    id: 'cena-4',
    nombre: 'Rokani El Bosque',
    zona: 'Norte',
    zonaDetalle: 'Norte / El Bosque',
    tipo: 'cena',
    descripcion: 'Sushi de alta gama y comida asiática en un entorno natural y relajado.',
    precioEstimadoBs: 185,
    ambiente: 'Asiático Zen & Natural',
    minPersonas: 2,
    maxPersonas: 8,
    horarioSugerido: '20:00 - 23:30',
    tags: ['Sushi', 'Asiático', 'Coctelería'],
    iconoEmoji: '🍣'
  },
  {
    id: 'cena-5',
    nombre: 'Botánica',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cena',
    descripcion: 'Cena tranquila rodeada de vegetación, luces cálidas y platos frescos.',
    precioEstimadoBs: 155,
    ambiente: 'Verde & Romántico',
    minPersonas: 2,
    maxPersonas: 6,
    horarioSugerido: '19:30 - 22:30',
    destacado: true,
    tags: ['Romántico', 'Vegetación', 'Cena íntima'],
    iconoEmoji: '🌿'
  },
  {
    id: 'cena-6',
    nombre: 'Muelle 18',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cena',
    descripcion: 'Mariscos frescos, ceviches de primer nivel y comida internacional marina.',
    precioEstimadoBs: 175,
    ambiente: 'Costero & Sofisticado',
    minPersonas: 2,
    maxPersonas: 10,
    horarioSugerido: '19:30 - 23:00',
    tags: ['Mariscos', 'Ceviche', 'Internacional'],
    iconoEmoji: '🍤'
  },
  {
    id: 'cena-7',
    nombre: 'Bistro La Casona',
    zona: 'Centro',
    zonaDetalle: 'Centro Histórico',
    tipo: 'cena',
    descripcion: 'Cena clásica y especial en una casona colonial cruceña con encanto.',
    precioEstimadoBs: 145,
    ambiente: 'Colonial & Acogedor',
    minPersonas: 2,
    maxPersonas: 8,
    horarioSugerido: '19:00 - 22:30',
    tags: ['Colonial', 'Bistró', 'Cena clásica'],
    iconoEmoji: '🕯️'
  },
  {
    id: 'cena-8',
    nombre: 'Hapo y Jarana',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cena',
    descripcion: 'Comida peruana y fusión nikkei llena de sabor, tapas y cócteles de autor.',
    precioEstimadoBs: 165,
    ambiente: 'Fusión & Dinámico',
    minPersonas: 2,
    maxPersonas: 10,
    horarioSugerido: '20:00 - 23:30',
    tags: ['Peruana', 'Fusión', 'Pisco Bar'],
    iconoEmoji: '🥢'
  },
  {
    id: 'cena-9',
    nombre: 'El Aljibe',
    zona: 'Centro',
    zonaDetalle: 'Centro Tradicional',
    tipo: 'cena',
    descripcion: 'Comida típica cruceña auténtica: majadito, keperi, sopa de maní y masitas.',
    precioEstimadoBs: 120,
    ambiente: 'Tradicional Cruceño',
    minPersonas: 1,
    maxPersonas: 12,
    horarioSugerido: '18:30 - 22:00',
    tags: ['Típico Cruceño', 'Majadito', 'Patrimonio'],
    iconoEmoji: '🍲'
  },
  {
    id: 'cena-10',
    nombre: 'El Arriero',
    zona: 'Centro',
    zonaDetalle: 'Centro / Norte',
    tipo: 'cena',
    descripcion: 'Parrilla de tradición, carnes a la brasa jugosas y ensaladas abundantes.',
    precioEstimadoBs: 195,
    ambiente: 'Rústico de Campo',
    minPersonas: 2,
    maxPersonas: 16,
    horarioSugerido: '19:30 - 23:30',
    tags: ['Parrilla', 'Carnes', 'Familiar'],
    iconoEmoji: '🥩'
  },

  // ================= BRUNCH =================
  {
    id: 'brunch-1',
    nombre: 'Tostado Café Resto Bar',
    zona: 'Centro',
    zonaDetalle: 'Centro',
    tipo: 'brunch',
    descripcion: 'Café de especialidad, brunch completo y comida casual en un punto céntrico.',
    precioEstimadoBs: 95,
    ambiente: 'Urbano & Fresco',
    minPersonas: 1,
    maxPersonas: 8,
    horarioSugerido: '09:00 - 14:00',
    destacado: true,
    tags: ['Brunch', 'Tostadas', 'Café'],
    iconoEmoji: '🥑'
  },
  {
    id: 'brunch-2',
    nombre: 'Inés España Bakery & Bistro',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'brunch',
    descripcion: 'Brunch gourmet, repostería fina de autor, panes artesanales y postres de ensueño.',
    precioEstimadoBs: 130,
    ambiente: 'Chic & Francés',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '08:30 - 13:00',
    destacado: true,
    tags: ['Repostería fina', 'Panadería', 'Gourmet'],
    iconoEmoji: '🥐'
  },
  {
    id: 'brunch-3',
    nombre: 'Nook Coffee',
    zona: 'Norte',
    zonaDetalle: 'Zona Norte',
    tipo: 'brunch',
    descripcion: 'Café de origen, bowls de açaí, desayunos nutritivos y estética nórdica.',
    precioEstimadoBs: 88,
    ambiente: 'Minimalista & Moderno',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '08:00 - 12:30',
    tags: ['Café de origen', 'Healthy', 'Bowls'],
    iconoEmoji: '☕'
  },
  {
    id: 'brunch-4',
    nombre: 'Mangarosa Brasserie',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'brunch',
    descripcion: 'Brunch elegante con mimosas, huevos benedictinos y terraza sofisticada.',
    precioEstimadoBs: 135,
    ambiente: 'Brasserie Elegante',
    minPersonas: 2,
    maxPersonas: 8,
    horarioSugerido: '09:30 - 14:00',
    tags: ['Mimosas', 'Benedictinos', 'Terraza'],
    iconoEmoji: '🍳'
  },
  {
    id: 'brunch-5',
    nombre: 'Cornelia',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'brunch',
    descripcion: 'Café botánico, brunch colorido, pancakes esponjosos y postres visuales.',
    precioEstimadoBs: 110,
    ambiente: 'Pastel & Fotogénico',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '09:00 - 13:30',
    tags: ['Pancakes', 'Estético', 'Brunch dulce'],
    iconoEmoji: '🥞'
  },
  {
    id: 'brunch-6',
    nombre: 'Café 1900',
    zona: 'Centro',
    zonaDetalle: 'Centro Histórico',
    tipo: 'brunch',
    descripcion: 'Café tradicional con aires de época, cuñapé, empanadas y café caliente.',
    precioEstimadoBs: 75,
    ambiente: 'Histórico & Cálido',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '08:30 - 12:00',
    tags: ['Tradicional', 'Cuñapé', 'Café cruceño'],
    iconoEmoji: '☕'
  },
  {
    id: 'brunch-7',
    nombre: 'Librería Café Ateneo',
    zona: 'Norte',
    zonaDetalle: 'Norte / Ventura Mall',
    tipo: 'brunch',
    descripcion: 'Café, libros, charla pausada y delicias de pastelería para leer con calma.',
    precioEstimadoBs: 85,
    ambiente: 'Cultural & Intelectual',
    minPersonas: 1,
    maxPersonas: 4,
    horarioSugerido: '10:00 - 13:30',
    tags: ['Libros', 'Tranquilidad', 'Cafetería'],
    iconoEmoji: '📖'
  },
  {
    id: 'brunch-8',
    nombre: 'Coffee Cherry',
    zona: 'Norte',
    zonaDetalle: 'Zona Norte',
    tipo: 'brunch',
    descripcion: 'Café de altura, tostadas gourmet, sándwiches artesanales y repostería.',
    precioEstimadoBs: 88,
    ambiente: 'Juvenil & Dinámico',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '08:30 - 12:30',
    tags: ['Sándwiches', 'Espresso', 'Juventud'],
    iconoEmoji: '🍒'
  },
  {
    id: 'brunch-9',
    nombre: 'Kawka Panadería',
    zona: 'Norte',
    zonaDetalle: 'Zona Norte',
    tipo: 'brunch',
    descripcion: 'Panadería artesanal con masa madre, croissants recién horneados y buen café.',
    precioEstimadoBs: 88,
    ambiente: 'Artesanal & Rústico',
    minPersonas: 1,
    maxPersonas: 4,
    horarioSugerido: '08:00 - 12:00',
    tags: ['Masa Madre', 'Croissants', 'Artesanal'],
    iconoEmoji: '🥖'
  },
  {
    id: 'brunch-10',
    nombre: 'Fridolin',
    zona: 'Centro',
    zonaDetalle: 'Norte / Centro',
    tipo: 'brunch',
    descripcion: 'Clásico cruceño para postres, tortas, salteñas y café de media mañana.',
    precioEstimadoBs: 85,
    ambiente: 'Familiar & Tradicional',
    minPersonas: 1,
    maxPersonas: 8,
    horarioSugerido: '09:00 - 12:30',
    tags: ['Tortas', 'Salteñas', 'Clásico'],
    iconoEmoji: '🍰'
  },

  // ================= CITA =================
  {
    id: 'cita-1',
    nombre: 'Jardín de Asia',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cita',
    descripcion: 'Cena especial bajo los tradicionales ayllus de mimbre con gastronomía asiático-amazónica.',
    precioEstimadoBs: 220,
    ambiente: 'Romántico de Lujo',
    minPersonas: 2,
    maxPersonas: 4,
    horarioSugerido: '20:30 - 23:30',
    destacado: true,
    tags: ['Cita romántica', 'Amazónico-asiático', 'Ayllus privados'],
    iconoEmoji: '🍱'
  },
  {
    id: 'cita-2',
    nombre: 'Botánica',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cita',
    descripcion: 'Cena o tragos tranquilos entre plantas tropicales e iluminación tenue ideal para dos.',
    precioEstimadoBs: 160,
    ambiente: 'Íntimo & Tropical',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '20:00 - 23:00',
    tags: ['Tragos suaves', 'Noche en pareja', 'Luces cálidas'],
    iconoEmoji: '🌱'
  },
  {
    id: 'cita-3',
    nombre: 'Muelle 18',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cita',
    descripcion: 'Cena romántica de mariscos y vinos espumantes en un espacio acogedor y moderno.',
    precioEstimadoBs: 190,
    ambiente: 'Romántico & Gourmet',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '20:00 - 23:00',
    tags: ['Mariscos', 'Vino blanco', 'Cita especial'],
    iconoEmoji: '🥂'
  },
  {
    id: 'cita-4',
    nombre: 'Bistro La Casona',
    zona: 'Centro',
    zonaDetalle: 'Centro',
    tipo: 'cita',
    descripcion: 'Cena elegante a la luz de las velas con fondo musical suave y patio de jardín colonial.',
    precioEstimadoBs: 150,
    ambiente: 'Velas & Patio Colonial',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '19:30 - 22:30',
    tags: ['A la luz de velas', 'Intimidad', 'Centro histórico'],
    iconoEmoji: '🕯️'
  },
  {
    id: 'cita-5',
    nombre: 'Chalet La Suisse',
    zona: 'Norte',
    zonaDetalle: 'Zona Norte',
    tipo: 'cita',
    descripcion: 'Cena tranquila suiza-europea con fondue de queso, fondue de carne y vinos selectos.',
    precioEstimadoBs: 215,
    ambiente: 'Alpino Romántico',
    minPersonas: 2,
    maxPersonas: 4,
    horarioSugerido: '20:00 - 23:00',
    tags: ['Fondue', 'Vinos', 'Exclusivo'],
    iconoEmoji: '🧀'
  },
  {
    id: 'cita-6',
    nombre: 'Mangarosa',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cita',
    descripcion: 'Brunch o café bonito al atardecer con vista acogedora y platos delicados.',
    precioEstimadoBs: 130,
    ambiente: 'Atardecer en Pareja',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '17:00 - 20:00',
    tags: ['Atardecer', 'Café bonito', 'Charla'],
    iconoEmoji: '🌇'
  },
  {
    id: 'cita-7',
    nombre: 'Cornelia',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cita',
    descripcion: 'Café y postres en un entorno de ensueño con flores y rincones fotográficos.',
    precioEstimadoBs: 115,
    ambiente: 'Dulce & Floral',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '16:30 - 20:00',
    tags: ['Postres', 'Flores', 'Charla dulce'],
    iconoEmoji: '🌸'
  },
  {
    id: 'cita-8',
    nombre: 'Café Typica',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'cita',
    descripcion: 'Café tranquilo de especialidad con sillones vintage y música acústica de fondo.',
    precioEstimadoBs: 90,
    ambiente: 'Vintage & Acústico',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '16:00 - 21:00',
    destacado: true,
    tags: ['Especialidad', 'Vintage', 'Primera cita'],
    iconoEmoji: '☕'
  },
  {
    id: 'cita-9',
    nombre: 'Manzana Uno',
    zona: 'Centro',
    zonaDetalle: 'Centro Cultural',
    tipo: 'cita',
    descripcion: 'Arte, paseo cultural por galerías de entrada libre y fotos románticas junto a la catedral.',
    precioEstimadoBs: 75,
    ambiente: 'Cultural & Urbano',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '17:00 - 20:30',
    tags: ['Arte', 'Caminata', 'Centro'],
    iconoEmoji: '🎨'
  },
  {
    id: 'cita-10',
    nombre: 'Biocentro Güembé',
    zona: 'Urubó',
    zonaDetalle: 'Norte / Urubó',
    tipo: 'cita',
    descripcion: 'Paseo natural en el mariposario más grande, lagunas, puentes colgantes y cócteles al atardecer.',
    precioEstimadoBs: 180,
    ambiente: 'Naturaleza & Desconexión',
    minPersonas: 2,
    maxPersonas: 2,
    horarioSugerido: '11:00 - 18:00',
    tags: ['Mariposario', 'Lagunas', 'Día en pareja'],
    iconoEmoji: '🦋'
  },

  // ================= FIESTA =================
  {
    id: 'fiesta-1',
    nombre: 'Duda Pop Pub',
    zona: 'Centro',
    zonaDetalle: 'Centro',
    tipo: 'fiesta',
    descripcion: 'Bar bohemio, música retro/pop/rock, tragos creativos y buena vibra.',
    precioEstimadoBs: 125,
    ambiente: 'Retro Pop & Bohemio',
    minPersonas: 2,
    maxPersonas: 15,
    horarioSugerido: '21:00 - 02:30',
    destacado: true,
    tags: ['Pop Pub', 'Cervezas', 'Amigos'],
    iconoEmoji: '🍻'
  },
  {
    id: 'fiesta-2',
    nombre: 'Maroon Club',
    zona: 'Norte',
    zonaDetalle: 'Zona Norte',
    tipo: 'fiesta',
    descripcion: 'Boliche / fiesta con DJ en vivo, pista de baile de luces y beats electrónicos y urbanos.',
    precioEstimadoBs: 175,
    ambiente: 'Clubbing & DJ',
    minPersonas: 2,
    maxPersonas: 20,
    horarioSugerido: '23:00 - 04:00',
    destacado: true,
    tags: ['Boliche', 'Pista de baile', 'DJs'],
    iconoEmoji: '🪩'
  },
  {
    id: 'fiesta-3',
    nombre: 'Mento Café Bar',
    zona: 'Centro',
    zonaDetalle: 'Centro / Norte',
    tipo: 'fiesta',
    descripcion: 'Bar y música en vivo, cerveza artesanal tirada y terraza nocturna animada.',
    precioEstimadoBs: 115,
    ambiente: 'Artesanal & Terraza',
    minPersonas: 2,
    maxPersonas: 12,
    horarioSugerido: '20:00 - 01:30',
    tags: ['Cerveza artesanal', 'Música en vivo', 'Terraza'],
    iconoEmoji: '🍺'
  },
  {
    id: 'fiesta-4',
    nombre: 'La Rota Carlota',
    zona: 'Centro',
    zonaDetalle: 'Centro',
    tipo: 'fiesta',
    descripcion: 'Bar con ritmo latino, baile, mojitos bien servidos y fiesta garantizada.',
    precioEstimadoBs: 108,
    ambiente: 'Latino & Baile',
    minPersonas: 2,
    maxPersonas: 12,
    horarioSugerido: '21:30 - 03:00',
    tags: ['Ritmo latino', 'Mojitos', 'Baile'],
    iconoEmoji: '💃'
  },
  {
    id: 'fiesta-5',
    nombre: 'San Bartolo SC',
    zona: 'Norte',
    zonaDetalle: 'Norte',
    tipo: 'fiesta',
    descripcion: 'Bar y tragos al aire libre, picadas cruceñas y buena vibra para grupos grandes.',
    precioEstimadoBs: 128,
    ambiente: 'Al aire libre & Festivo',
    minPersonas: 3,
    maxPersonas: 16,
    horarioSugerido: '20:30 - 02:00',
    tags: ['Tragos', 'Amigos', 'Outdoor'],
    iconoEmoji: '🍹'
  },
  {
    id: 'fiesta-6',
    nombre: 'Irish Pub',
    zona: 'Centro',
    zonaDetalle: 'Centro / Monseñor Rivero',
    tipo: 'fiesta',
    descripcion: 'Pub clásico irlandés en Monseñor Rivero con pintas, rock y deportes en pantalla.',
    precioEstimadoBs: 130,
    ambiente: 'Pub Clásico & Rock',
    minPersonas: 2,
    maxPersonas: 10,
    horarioSugerido: '19:00 - 02:00',
    tags: ['Irish Pub', 'Pintas', 'Monseñor Rivero'],
    iconoEmoji: '🍺'
  },
  {
    id: 'fiesta-7',
    nombre: 'Sky Bar',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'fiesta',
    descripcion: 'Rooftop con vista panorámica a la ciudad de Santa Cruz, cócteles de autor y música lounge.',
    precioEstimadoBs: 195,
    ambiente: 'Rooftop Chic',
    minPersonas: 2,
    maxPersonas: 10,
    horarioSugerido: '20:00 - 02:30',
    destacado: true,
    tags: ['Rooftop', 'Vista Panorámica', 'Cocteles'],
    iconoEmoji: '🍸'
  },
  {
    id: 'fiesta-8',
    nombre: 'Karma',
    zona: 'Norte',
    zonaDetalle: 'Norte',
    tipo: 'fiesta',
    descripcion: 'Bar discoteca con shows, temáticas de fin de semana y promociones de botellas.',
    precioEstimadoBs: 145,
    ambiente: 'Fiesta & Show',
    minPersonas: 4,
    maxPersonas: 18,
    horarioSugerido: '22:00 - 03:30',
    tags: ['Shows', 'Botellas', 'Boliche'],
    iconoEmoji: '🎉'
  },
  {
    id: 'fiesta-9',
    nombre: 'Zen Pub Karaoke',
    zona: 'Norte',
    zonaDetalle: 'Centro / Norte',
    tipo: 'fiesta',
    descripcion: 'Karaoke con cabinas privadas y pista general, tragos por metro y risas aseguradas.',
    precioEstimadoBs: 110,
    ambiente: 'Karaoke & Diversión',
    minPersonas: 3,
    maxPersonas: 15,
    horarioSugerido: '20:30 - 02:30',
    tags: ['Karaoke', 'Canto', 'Tragos'],
    iconoEmoji: '🎤'
  },
  {
    id: 'fiesta-10',
    nombre: 'Gold Time Karaoke',
    zona: 'Centro',
    zonaDetalle: 'Centro / 1er Anillo',
    tipo: 'fiesta',
    descripcion: 'Karaoke céntrico y fiesta animada para desatar tu talento vocal con tus amigos.',
    precioEstimadoBs: 105,
    ambiente: 'Karaoke Party',
    minPersonas: 2,
    maxPersonas: 16,
    horarioSugerido: '21:00 - 03:00',
    tags: ['Karaoke', '1er Anillo', 'Noche de amigos'],
    iconoEmoji: '🎶'
  },

  // ================= DEPORTE =================
  {
    id: 'deporte-1',
    nombre: 'Padbol Santa Cruz',
    zona: 'Norte',
    zonaDetalle: 'Norte',
    tipo: 'deporte',
    descripcion: 'Fusión de fútbol, vóley y tenis en canchas con paredes de cristal dinámicas.',
    precioEstimadoBs: 88,
    ambiente: 'Deportivo & Competitivo',
    minPersonas: 4,
    maxPersonas: 8,
    horarioSugerido: '07:00 - 22:00',
    destacado: true,
    tags: ['Padbol', 'Fútbol-tenis', 'Amigos'],
    iconoEmoji: '⚽'
  },
  {
    id: 'deporte-2',
    nombre: 'Go Padel Santa Cruz',
    zona: 'Norte',
    zonaDetalle: 'Norte',
    tipo: 'deporte',
    descripcion: 'Canchas panorámicas de pádel de césped sintético azul, alquiler de paletas y tercer tiempo.',
    precioEstimadoBs: 100,
    ambiente: 'Pádel Moderno',
    minPersonas: 4,
    maxPersonas: 4,
    horarioSugerido: '07:00 - 23:00',
    destacado: true,
    tags: ['Pádel', 'Canchas sintéticas', 'Tercer tiempo'],
    iconoEmoji: '🎾'
  },
  {
    id: 'deporte-3',
    nombre: 'Padel Lounge Club',
    zona: 'Norte',
    zonaDetalle: 'Norte',
    tipo: 'deporte',
    descripcion: 'Complejo de pádel con lounge bar para refrescarse con amigos tras el partido.',
    precioEstimadoBs: 105,
    ambiente: 'Sport & Lounge',
    minPersonas: 4,
    maxPersonas: 8,
    horarioSugerido: '08:00 - 23:00',
    tags: ['Pádel', 'Lounge', 'Snacks'],
    iconoEmoji: '🏸'
  },
  {
    id: 'deporte-4',
    nombre: 'Paintball Park Santa Cruz',
    zona: 'Urubó',
    zonaDetalle: 'Norte / Urubó',
    tipo: 'deporte',
    descripcion: 'Combate táctico de paintball con obstáculos naturales, trincheras y adrenalina pura.',
    precioEstimadoBs: 140,
    ambiente: 'Adrenalina & Táctica',
    minPersonas: 6,
    maxPersonas: 20,
    horarioSugerido: '10:00 - 18:00',
    tags: ['Paintball', 'Adrenalina', 'Grupos'],
    iconoEmoji: '🎯'
  },
  {
    id: 'deporte-5',
    nombre: 'Cambódromo',
    zona: 'Norte',
    zonaDetalle: 'Norte / Entre 4to y 8vo Anillo',
    tipo: 'deporte',
    descripcion: 'Pista de 4 km ideal para bicicleta, patines, trote matutino o caminata al atardecer.',
    precioEstimadoBs: 48,
    ambiente: 'Libre & Al Aire Libre',
    minPersonas: 1,
    maxPersonas: 20,
    horarioSugerido: '06:00 - 21:00',
    tags: ['Bicicleta', 'Running', 'Paseo activo'],
    iconoEmoji: '🚴'
  },
  {
    id: 'deporte-6',
    nombre: 'Parque Urbano Central',
    zona: 'Centro',
    zonaDetalle: 'Centro / 2do Anillo',
    tipo: 'deporte',
    descripcion: 'Caminata, trote bajo los tajibos, canchas polideportivas y áreas de calistenia.',
    precioEstimadoBs: 48,
    ambiente: 'Naturaleza Urbana',
    minPersonas: 1,
    maxPersonas: 10,
    horarioSugerido: '06:30 - 20:00',
    tags: ['Trote', 'Tajibos', 'Parque'],
    iconoEmoji: '🏃'
  },
  {
    id: 'deporte-7',
    nombre: 'Super Jump Park',
    zona: 'Norte',
    zonaDetalle: 'Zona Norte',
    tipo: 'deporte',
    descripcion: 'Parque de camas elásticas gigantes, clavadas de basket y saltos acrobáticos.',
    precioEstimadoBs: 100,
    ambiente: 'Enérgico & Saltos',
    minPersonas: 1,
    maxPersonas: 12,
    horarioSugerido: '14:00 - 21:00',
    tags: ['Trampolines', 'Acrobacias', 'Diversión activa'],
    iconoEmoji: '🤸'
  },
  {
    id: 'deporte-8',
    nombre: 'Lomas de Arena',
    zona: 'Sur',
    zonaDetalle: 'Sur de Santa Cruz',
    tipo: 'deporte',
    descripcion: 'Caminata por dunas de arena desérticas, sandboard en pendientes y oasis natural.',
    precioEstimadoBs: 115,
    ambiente: 'Aventura & Dunas',
    minPersonas: 2,
    maxPersonas: 10,
    horarioSugerido: '08:00 - 17:00',
    destacado: true,
    tags: ['Sandboard', 'Dunas', 'Trekking'],
    iconoEmoji: '🏜️'
  },
  {
    id: 'deporte-9',
    nombre: 'Jardín Botánico',
    zona: 'Este',
    zonaDetalle: 'Este / Cotoca',
    tipo: 'deporte',
    descripcion: 'Senderos ecológicos entre bosque chiquitano, avistamiento de aves y caminata deportiva.',
    precioEstimadoBs: 68,
    ambiente: 'Ecológico & Silvestre',
    minPersonas: 1,
    maxPersonas: 15,
    horarioSugerido: '08:00 - 16:30',
    tags: ['Senderismo', 'Naturaleza', 'Bosque Chiquitano'],
    iconoEmoji: '🌳'
  },
  {
    id: 'deporte-10',
    nombre: 'Estadio Tahuichi Aguilera',
    zona: 'Centro',
    zonaDetalle: 'Centro / 1er Anillo',
    tipo: 'deporte',
    descripcion: 'Vibrar con la pasión del fútbol cruceño en partido oficial o tour deportivo.',
    precioEstimadoBs: 88,
    ambiente: 'Pasión Futbolera',
    minPersonas: 1,
    maxPersonas: 10,
    horarioSugerido: '15:30 - 20:00',
    tags: ['Fútbol', 'Estadio', 'Clásico cruceño'],
    iconoEmoji: '⚽'
  },

  // ================= RECREATIVO =================
  {
    id: 'recreativo-1',
    nombre: 'Ventura Mall',
    zona: 'Norte',
    zonaDetalle: 'Norte / 4to Anillo',
    tipo: 'recreativo',
    descripcion: 'El centro comercial más grande con cine IMAX, bowling, tiendas de moda y plaza de comidas.',
    precioEstimadoBs: 115,
    ambiente: 'Mall Moderno & Cine',
    minPersonas: 1,
    maxPersonas: 10,
    horarioSugerido: '11:00 - 22:00',
    destacado: true,
    tags: ['Cine', 'Shopping', 'Bowling'],
    iconoEmoji: '🛍️'
  },
  {
    id: 'recreativo-2',
    nombre: 'Patio Design Lifestyle Center',
    zona: 'Equipetrol',
    zonaDetalle: 'Norte / Equipetrol',
    tipo: 'recreativo',
    descripcion: 'Paseo comercial de diseño, arquitectura abierta, restaurantes gourmet y heladerías.',
    precioEstimadoBs: 130,
    ambiente: 'Open Mall Sofisticado',
    minPersonas: 1,
    maxPersonas: 8,
    horarioSugerido: '12:00 - 22:30',
    destacado: true,
    tags: ['Diseño', 'Restaurantes', 'Paseo al aire libre'],
    iconoEmoji: '✨'
  },
  {
    id: 'recreativo-3',
    nombre: 'Manzana Uno',
    zona: 'Centro',
    zonaDetalle: 'Centro Histórico',
    tipo: 'recreativo',
    descripcion: 'Centro de arte y cultura con exposiciones de artes visuales, fotografía y talleres.',
    precioEstimadoBs: 68,
    ambiente: 'Arte & Cultura Cruceña',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '10:00 - 20:00',
    tags: ['Cultura', 'Fotografía', 'Plaza Principal'],
    iconoEmoji: '🏛️'
  },
  {
    id: 'recreativo-4',
    nombre: 'Plaza 24 de Septiembre',
    zona: 'Centro',
    zonaDetalle: 'Centro de la Ciudad',
    tipo: 'recreativo',
    descripcion: 'Corazón de Santa Cruz: paseo bajo los árboles, café en los balcones coloniales y palomas.',
    precioEstimadoBs: 72,
    ambiente: 'Histórico & Social',
    minPersonas: 1,
    maxPersonas: 8,
    horarioSugerido: '16:00 - 21:00',
    tags: ['Plaza Principal', 'Café', 'Fotografía'],
    iconoEmoji: '🕊️'
  },
  {
    id: 'recreativo-5',
    nombre: 'Catedral Metropolitana',
    zona: 'Centro',
    zonaDetalle: 'Centro / Plaza Principal',
    tipo: 'recreativo',
    descripcion: 'Visita turística, ascenso al mirador del campanario con vista de 360° a toda Santa Cruz.',
    precioEstimadoBs: 60,
    ambiente: 'Mirador & Patrimonio',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '09:00 - 17:30',
    tags: ['Mirador 360', 'Catedral', 'Fotos panorámicas'],
    iconoEmoji: '⛪'
  },
  {
    id: 'recreativo-6',
    nombre: 'Parque El Arenal',
    zona: 'Centro',
    zonaDetalle: 'Centro',
    tipo: 'recreativo',
    descripcion: 'Paseo céntrico con su laguna histórica, mural del gran artista Lorgio Vaca y museo folklórico.',
    precioEstimadoBs: 55,
    ambiente: 'Laguna & Tradición',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '09:00 - 18:00',
    tags: ['Laguna', 'Mural Lorgio Vaca', 'Folklore'],
    iconoEmoji: '🦆'
  },
  {
    id: 'recreativo-7',
    nombre: 'Zoológico Municipal',
    zona: 'Norte',
    zonaDetalle: 'Norte / 3er Anillo',
    tipo: 'recreativo',
    descripcion: 'Paseo recreativo especializado en fauna sudamericana, tapires, tucanes y jaguares.',
    precioEstimadoBs: 72,
    ambiente: 'Fauna Sudamericana',
    minPersonas: 1,
    maxPersonas: 8,
    horarioSugerido: '09:00 - 17:00',
    tags: ['Fauna nativa', 'Familiar', 'Paseo verde'],
    iconoEmoji: '🦜'
  },
  {
    id: 'recreativo-8',
    nombre: 'Biocentro Güembé',
    zona: 'Urubó',
    zonaDetalle: 'Norte / Urubó',
    tipo: 'recreativo',
    descripcion: 'Piscinas naturales, kayak en lagunas, senderos con monos y el aviario más impresionante.',
    precioEstimadoBs: 180,
    ambiente: 'Resort Natural & Piscinas',
    minPersonas: 1,
    maxPersonas: 12,
    horarioSugerido: '09:00 - 18:30',
    destacado: true,
    tags: ['Piscinas naturales', 'Aventura', 'Kayak'],
    iconoEmoji: '🏊'
  },
  {
    id: 'recreativo-9',
    nombre: 'Fexpocruz',
    zona: 'Sur',
    zonaDetalle: 'Sur / Av. Roca y Coronado',
    tipo: 'recreativo',
    descripcion: 'Recinto ferial líder: Expocruz, ferias temáticas gastronómicas, conciertos y pabellones.',
    precioEstimadoBs: 100,
    ambiente: 'Ferial & Masivo',
    minPersonas: 2,
    maxPersonas: 15,
    horarioSugerido: '17:00 - 23:00',
    tags: ['Ferias', 'Conciertos', 'Eventos'],
    iconoEmoji: '🎪'
  },
  {
    id: 'recreativo-10',
    nombre: 'Melchor Pinto Casa Cultural',
    zona: 'Centro',
    zonaDetalle: 'Centro Cultural',
    tipo: 'recreativo',
    descripcion: 'Café de autor, exposiciones de pintura, patio tradicional cruceño y agenda cultural activa.',
    precioEstimadoBs: 75,
    ambiente: 'Bohemio & Cultural',
    minPersonas: 1,
    maxPersonas: 6,
    horarioSugerido: '15:00 - 21:00',
    tags: ['Casa Cultural', 'Café', 'Exposiciones'],
    iconoEmoji: '🎨'
  }
];

// Mapeo detallado de imágenes reales y representativas de locales y experiencias en Santa Cruz
const IMAGENES_POR_LUGAR: Record<string, { local: string; experiencia: string; alt: string }> = {
  // CENA
  'cena-1': {
    local: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    alt: "Sach'a Huaska - Cena de autor en Equipetrol"
  },
  'cena-2': {
    local: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    alt: 'Palosanto - Gastronomía gourmet y carta de vinos'
  },
  'cena-3': {
    local: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
    alt: 'The Dubliner Steakhouse - Cortes a la parrilla sobre el boulevard'
  },
  'cena-4': {
    local: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
    alt: 'Rokani El Bosque - Sushi de alta gama en entorno natural'
  },
  'cena-5': {
    local: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    alt: 'Botánica - Cena íntima rodeada de vegetación'
  },
  'cena-6': {
    local: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1535400255456-984241443b29?w=800&auto=format&fit=crop&q=80',
    alt: 'Muelle 18 - Mariscos frescos y ceviches en Equipetrol'
  },
  'cena-7': {
    local: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    alt: 'Bistro La Casona - Arquitectura colonial en el centro histórico'
  },
  'cena-8': {
    local: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    alt: 'Hapo y Jarana - Fusión nikkei y coctelería'
  },
  'cena-9': {
    local: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    alt: 'El Aljibe - Comida típica tradicional cruceña'
  },
  'cena-10': {
    local: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
    alt: 'El Arriero - Parrilla tradicional cruceña'
  },

  // BRUNCH
  'brunch-1': {
    local: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    alt: 'Tostado Café Resto Bar - Café de especialidad y brunch'
  },
  'brunch-2': {
    local: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
    alt: 'Inés España Bakery & Bistro - Repostería fina y panadería artesanal'
  },
  'brunch-3': {
    local: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80',
    alt: 'Nook Coffee - Bowls nutritivos y café de origen'
  },
  'brunch-4': {
    local: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80',
    alt: 'Mangarosa Brasserie - Huevos benedictinos y mimosas'
  },
  'brunch-5': {
    local: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=80',
    alt: 'Cornelia - Café estético y pancakes en Equipetrol'
  },

  // CITA
  'cita-1': {
    local: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    alt: 'Jardín de Asia - Ayllus privados y cena romántica'
  },
  'cita-5': {
    local: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    alt: 'Chalet La Suisse - Fondue y estilo alpino'
  },
  'cita-8': {
    local: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80',
    alt: 'Café Typica - Café acústico en Equipetrol'
  },
  'cita-10': {
    local: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80',
    alt: 'Biocentro Güembé - Mariposario y lagunas naturales en Urubó'
  },

  // FIESTA
  'fiesta-1': {
    local: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    alt: 'Duda Pop Pub - Música pop rock y onda bohemia'
  },
  'fiesta-2': {
    local: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    alt: 'Maroon Club - Fiesta con DJs y pista de baile'
  },
  'fiesta-7': {
    local: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    alt: 'Sky Bar - Rooftop con vista panorámica a Santa Cruz'
  },

  // DEPORTE
  'deporte-1': {
    local: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    alt: 'Padbol Santa Cruz - Canchas de padbol'
  },
  'deporte-2': {
    local: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80',
    alt: 'Go Padel Santa Cruz - Canchas de pádel panorámicas'
  },
  'deporte-4': {
    local: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    alt: 'Paintball Park Santa Cruz - Adrenalina y combate táctico'
  },
  'deporte-8': {
    local: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    alt: 'Lomas de Arena - Sandboard en dunas y naturaleza'
  },

  // RECREATIVO
  'recreativo-1': {
    local: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    alt: 'Ventura Mall - Centro comercial, cine y bowling'
  },
  'recreativo-2': {
    local: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    alt: 'Patio Design Lifestyle Center - Paseo comercial y gastronómico'
  },
  'recreativo-8': {
    local: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80',
    alt: 'Biocentro Güembé - Piscinas naturales y resort en Urubó'
  }
};

// Fallbacks de alta calidad clasificados por tipo de plan
const IMAGENES_FALLBACK_TIPO: Record<string, { local: string; experiencia: string; alt: string }> = {
  cena: {
    local: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    alt: 'Restaurante y cena en Santa Cruz'
  },
  brunch: {
    local: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80',
    alt: 'Cafetería y brunch en Santa Cruz'
  },
  cita: {
    local: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    alt: 'Cita romántica y velada para dos'
  },
  fiesta: {
    local: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=80',
    alt: 'Bar, discoteca y coctelería'
  },
  deporte: {
    local: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    alt: 'Canchas y actividad deportiva'
  },
  recreativo: {
    local: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
    experiencia: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    alt: 'Paseo recreativo y entretenimiento'
  }
};

// Función para generar ideas de planes con imágenes por tipo de experiencia
const PLANES_SUGERIDOS_POR_TIPO: Record<string, Array<{ titulo: string; imagen: string; emoji: string }>> = {
  cena: [
    { titulo: 'Cena Gourmet & Platos', imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80', emoji: '🥩' },
    { titulo: 'Coctelería de Autor', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80', emoji: '🍸' },
    { titulo: 'Mesa Especial & Terraza', imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80', emoji: '✨' },
    { titulo: 'Postres de Autor', imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', emoji: '🍰' }
  ],
  brunch: [
    { titulo: 'Brunch & Tostadas', imagen: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80', emoji: '🥞' },
    { titulo: 'Café de Especialidad', imagen: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80', emoji: '☕' },
    { titulo: 'Mimosas & Mañana', imagen: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=600&auto=format&fit=crop&q=80', emoji: '🥂' },
    { titulo: 'Bowls Saludables', imagen: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80', emoji: '🍓' }
  ],
  cita: [
    { titulo: 'Cena para Dos', imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80', emoji: '🕯️' },
    { titulo: 'Brindis & Copas', imagen: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&auto=format&fit=crop&q=80', emoji: '🥂' },
    { titulo: 'Rincón Especial', imagen: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80', emoji: '✨' },
    { titulo: 'Postre Compartido', imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80', emoji: '🍫' }
  ],
  fiesta: [
    { titulo: 'Ronda de Tragos', imagen: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80', emoji: '🍹' },
    { titulo: 'Pista con DJ', imagen: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80', emoji: '🪩' },
    { titulo: 'Mesa con Amigos', imagen: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&auto=format&fit=crop&q=80', emoji: '🎉' },
    { titulo: 'Cervezas & Shots', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80', emoji: '🍻' }
  ],
  deporte: [
    { titulo: 'Cancha Reservada', imagen: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop&q=80', emoji: '🎾' },
    { titulo: 'Juego con Amigos', imagen: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80', emoji: '🔥' },
    { titulo: 'Tercer Tiempo', imagen: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80', emoji: '🥤' },
    { titulo: 'Actividad Física', imagen: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&auto=format&fit=crop&q=80', emoji: '⚡' }
  ],
  recreativo: [
    { titulo: 'Paseo & Recorrido', imagen: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80', emoji: '📸' },
    { titulo: 'Cine & Ocio', imagen: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80', emoji: '🎬' },
    { titulo: 'Paseo al Aire Libre', imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', emoji: '🌴' },
    { titulo: 'Compras & Helados', imagen: 'https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=600&auto=format&fit=crop&q=80', emoji: '🛍️' }
  ]
};

export const PLANES_SANTA_CRUZ: PlanLugar[] = PLANES_BASE.map(plan => {
  const customImg = IMAGENES_POR_LUGAR[plan.id];
  const fallbackImg = IMAGENES_FALLBACK_TIPO[plan.tipo] || IMAGENES_FALLBACK_TIPO.cena;
  const planesSugeridos = PLANES_SUGERIDOS_POR_TIPO[plan.tipo] || PLANES_SUGERIDOS_POR_TIPO.cena;

  const imgLocal = customImg ? customImg.local : fallbackImg.local;
  const imgExperiencia = customImg ? customImg.experiencia : fallbackImg.experiencia;
  const imgTercera = planesSugeridos[0]?.imagen || fallbackImg.experiencia;

  return {
    ...plan,
    zona: plan.zona as ZonaSantaCruz,
    tipo: plan.tipo as TipoPlan,
    precioEstimadoPorPersona: plan.precioEstimadoBs,
    moneda: 'Bs',
    imagenLocal: imgLocal,
    imagenExperiencia: imgExperiencia,
    altImagen: customImg ? customImg.alt : `${plan.nombre} - ${plan.tipo} en Santa Cruz (Imagen referencial)`,
    fotosPlanes: [imgLocal, imgExperiencia, imgTercera],
    planesSugeridos
  };
});

export const RESENAS_INICIALES: Resena[] = [
  {
    id: 'rev-1',
    nombreUsuario: 'Valeria Justiniano',
    planReservado: 'Palosanto',
    calificacion: 5,
    comentario: '¡Increíble experiencia! El filtro nos ayudó a decidir en 2 minutos sin discutir en el grupo de WhatsApp. La mesa estaba lista cuando llegamos.',
    fecha: '2026-09-28',
    aprobada: true
  },
  {
    id: 'rev-2',
    nombreUsuario: 'Sebastián Roca',
    planReservado: 'Go Padel Santa Cruz',
    calificacion: 5,
    comentario: 'Excelente para armar el partido con amigos el fin de semana. Reservamos en la zona norte sin complicaciones y sumamos puntos para el evento gratis.',
    fecha: '2026-09-29',
    aprobada: true
  },
  {
    id: 'rev-3',
    nombreUsuario: 'Camila Aguilera',
    planReservado: 'Jardín de Asia',
    calificacion: 5,
    comentario: 'La mejor cita de aniversario. El soporte por WhatsApp (78100777) nos confirmó rapidísimo. ¡Planéa nos salvó!',
    fecha: '2026-09-30',
    aprobada: true
  },
  {
    id: 'rev-4',
    nombreUsuario: 'Mateo Banegas',
    planReservado: 'Duda Pop Pub',
    calificacion: 4,
    comentario: 'Muy buen ambiente y tragos. Lo armamos por presupuesto y dio exacto con lo que queríamos gastar en el centro.',
    fecha: '2026-10-01',
    aprobada: true
  }
];
