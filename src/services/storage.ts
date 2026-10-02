import { Usuario, Reserva, Resena, MetricaEvento, TipoEvento, EstadoReserva } from '../types';
import { RESENAS_INICIALES } from '../data/planesData';
import { db, validarConexionFirestore } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  USUARIOS: 'planea_usuarios',
  USUARIO_ACTUAL: 'planea_usuario_actual',
  RESERVAS: 'planea_reservas',
  RESENAS: 'planea_reseñas',
  METRICAS: 'planea_metricas_eventos',
};

// Safe localStorage helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

/**
 * Elimina recursivamente todas las propiedades con valor undefined
 * para evitar el error de Firebase: "Unsupported field value: undefined"
 */
function sanitizarParaFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const limpio: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        limpio[key] = sanitizarParaFirestore(value);
      } else {
        limpio[key] = value;
      }
    }
  }
  return limpio;
}

// ----------------- INICIALIZACIÓN Y SINCRONIZACIÓN EN LA NUBE -----------------
let sincronizacionIniciada = false;

export function inicializarStorage(): void {
  // Inicializar reseñas locales si no existen
  const resenas = safeGet<Resena[]>(STORAGE_KEYS.RESENAS, []);
  if (resenas.length === 0) {
    safeSet(STORAGE_KEYS.RESENAS, RESENAS_INICIALES);
  }

  // Inicializar métricas locales de ejemplo si está vacío
  const metricas = safeGet<MetricaEvento[]>(STORAGE_KEYS.METRICAS, []);
  if (metricas.length === 0) {
    const hoy = new Date().toISOString();
    const demoEventos: MetricaEvento[] = [
      {
        id: 'evt_init_1',
        tipoEvento: 'clic_arma_tu_plan',
        nombreBotonAccion: 'Arma tu plan',
        pagina: 'portada',
        fechaHora: hoy,
        infoAdicional: 'Interacción inicial landing'
      }
    ];
    safeSet(STORAGE_KEYS.METRICAS, demoEventos);
  }

  // Activar sincronización en tiempo real con Firebase Firestore
  iniciarSincronizacionNube();
}

/**
 * Escucha cambios en tiempo real desde Firestore.
 * Esto permite que cualquier usuario registrado o reserva desde CUALQUIER dispositivo
 * aparezca automáticamente en la pantalla del administrador en tiempo real.
 */
function iniciarSincronizacionNube() {
  if (sincronizacionIniciada) return;
  sincronizacionIniciada = true;

  // Validar conexión a Firestore requerida
  validarConexionFirestore().catch(() => {});

  try {
    // 1. Sincronizar Usuarios en tiempo real
    onSnapshot(collection(db, 'usuarios'), (snapshot) => {
      if (!snapshot.empty) {
        const usuariosNube: Usuario[] = [];
        snapshot.forEach(docSnap => {
          usuariosNube.push(docSnap.data() as Usuario);
        });
        
        // Unificar con los locales
        const usuariosLocales = safeGet<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
        const mapa = new Map<string, Usuario>();
        usuariosLocales.forEach(u => mapa.set(u.id, u));
        usuariosNube.forEach(u => mapa.set(u.id, u));
        const unificados = Array.from(mapa.values());
        
        safeSet(STORAGE_KEYS.USUARIOS, unificados);
        window.dispatchEvent(new CustomEvent('planea_datos_actualizados'));
      }
    }, (err) => console.warn('Sync usuarios Firestore:', err.message));

    // 2. Sincronizar Reservas en tiempo real
    onSnapshot(collection(db, 'reservas'), (snapshot) => {
      if (!snapshot.empty) {
        const reservasNube: Reserva[] = [];
        snapshot.forEach(docSnap => {
          reservasNube.push(docSnap.data() as Reserva);
        });

        // Ordenar por fecha de creación descendente
        reservasNube.sort((a, b) => (b.fechaCreacion || '').localeCompare(a.fechaCreacion || ''));

        const reservasLocales = safeGet<Reserva[]>(STORAGE_KEYS.RESERVAS, []);
        const mapa = new Map<string, Reserva>();
        reservasLocales.forEach(r => mapa.set(r.id, r));
        reservasNube.forEach(r => mapa.set(r.id, r));
        const unificados = Array.from(mapa.values()).sort((a, b) => (b.fechaCreacion || '').localeCompare(a.fechaCreacion || ''));

        safeSet(STORAGE_KEYS.RESERVAS, unificados);
        window.dispatchEvent(new CustomEvent('planea_datos_actualizados'));
      }
    }, (err) => console.warn('Sync reservas Firestore:', err.message));

    // 3. Sincronizar Reseñas en tiempo real
    onSnapshot(collection(db, 'resenas'), (snapshot) => {
      if (!snapshot.empty) {
        const resenasNube: Resena[] = [];
        snapshot.forEach(docSnap => {
          resenasNube.push(docSnap.data() as Resena);
        });

        const resenasLocales = safeGet<Resena[]>(STORAGE_KEYS.RESENAS, RESENAS_INICIALES);
        const mapa = new Map<string, Resena>();
        resenasLocales.forEach(r => mapa.set(r.id, r));
        resenasNube.forEach(r => mapa.set(r.id, r));
        const unificados = Array.from(mapa.values());

        safeSet(STORAGE_KEYS.RESENAS, unificados);
        window.dispatchEvent(new CustomEvent('planea_datos_actualizados'));
      }
    }, (err) => console.warn('Sync reseñas Firestore:', err.message));

    // 4. Sincronizar Métricas / Eventos de clics en tiempo real
    onSnapshot(collection(db, 'metricas'), (snapshot) => {
      if (!snapshot.empty) {
        const metricasNube: MetricaEvento[] = [];
        snapshot.forEach(docSnap => {
          metricasNube.push(docSnap.data() as MetricaEvento);
        });

        const metricasLocales = safeGet<MetricaEvento[]>(STORAGE_KEYS.METRICAS, []);
        const mapa = new Map<string, MetricaEvento>();
        metricasLocales.forEach(m => mapa.set(m.id, m));
        metricasNube.forEach(m => mapa.set(m.id, m));
        const unificados = Array.from(mapa.values()).sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));

        safeSet(STORAGE_KEYS.METRICAS, unificados);
        window.dispatchEvent(new CustomEvent('planea_datos_actualizados'));
      }
    }, (err) => console.warn('Sync métricas Firestore:', err.message));

  } catch (e) {
    console.warn('Error inicializando Firestore listeners:', e);
  }
}

// ----------------- USUARIOS -----------------
export function getUsuarios(): Usuario[] {
  return safeGet<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
}

export function getUsuarioActual(): Usuario | null {
  return safeGet<Usuario | null>(STORAGE_KEYS.USUARIO_ACTUAL, null);
}

export function setUsuarioActual(usuario: Usuario | null): void {
  safeSet(STORAGE_KEYS.USUARIO_ACTUAL, usuario);
}

export function logoutUsuario(): void {
  localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL);
}

export function registrarUsuario(nombre: string, correo: string): { usuario: Usuario; esNuevo: boolean } {
  const nombreLimpio = nombre.trim();
  const correoLimpio = correo.trim().toLowerCase();
  const usuarios = getUsuarios();

  const usuarioExistente = usuarios.find(u => u.correo.toLowerCase() === correoLimpio);

  if (usuarioExistente) {
    const actualizado: Usuario = {
      ...usuarioExistente,
      nombre: nombreLimpio || usuarioExistente.nombre
    };
    const listaActualizada = usuarios.map(u => u.id === actualizado.id ? actualizado : u);
    safeSet(STORAGE_KEYS.USUARIOS, listaActualizada);
    setUsuarioActual(actualizado);

    // Guardar en Firestore para que todos los dispositivos lo vean
    setDoc(doc(db, 'usuarios', actualizado.id), sanitizarParaFirestore(actualizado), { merge: true }).catch(err => {
      console.warn('Error guardando usuario en Firestore:', err);
    });

    registrarEvento('usuario_registrado', 'Inicio de sesión recurrente', 'registro', `Correo: ${correoLimpio}`);
    return { usuario: actualizado, esNuevo: false };
  }

  // Generar ID único
  const nuevoId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const nuevoUsuario: Usuario = {
    id: nuevoId,
    nombre: nombreLimpio,
    correo: correoLimpio,
    fechaRegistro: new Date().toISOString().split('T')[0],
    puntos: 0,
    etiquetaCrm: 'nuevo'
  };

  usuarios.push(nuevoUsuario);
  safeSet(STORAGE_KEYS.USUARIOS, usuarios);
  setUsuarioActual(nuevoUsuario);

  // Guardar en Firestore centralizado
  setDoc(doc(db, 'usuarios', nuevoId), sanitizarParaFirestore(nuevoUsuario)).catch(err => {
    console.warn('Error guardando nuevo usuario en Firestore:', err);
  });

  registrarEvento('usuario_registrado', 'Registro nuevo usuario', 'registro', `ID: ${nuevoId}, Correo: ${correoLimpio}`);

  return { usuario: nuevoUsuario, esNuevo: true };
}

// ----------------- RESERVAS -----------------
export function getReservas(): Reserva[] {
  return safeGet<Reserva[]>(STORAGE_KEYS.RESERVAS, []);
}

export function guardarReserva(reservaData: Omit<Reserva, 'id' | 'fechaCreacion' | 'estado'>): Reserva {
  const reservas = getReservas();
  const id = `res_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const fechaCreacion = new Date().toISOString();

  const nuevaReserva: Reserva = {
    ...reservaData,
    id,
    fechaCreacion,
    estado: 'confirmada' // Por defecto confirmada
  };

  reservas.unshift(nuevaReserva);
  safeSet(STORAGE_KEYS.RESERVAS, reservas);

  // Incrementar puntos del usuario por reserva confirmada
  const usuarios = getUsuarios();
  const usuarioIdx = usuarios.findIndex(u => u.id === reservaData.usuarioId);
  if (usuarioIdx >= 0) {
    usuarios[usuarioIdx].puntos = (usuarios[usuarioIdx].puntos || 0) + 1;
    safeSet(STORAGE_KEYS.USUARIOS, usuarios);

    const usuarioAct = getUsuarioActual();
    if (usuarioAct && usuarioAct.id === reservaData.usuarioId) {
      usuarioAct.puntos = usuarios[usuarioIdx].puntos;
      setUsuarioActual(usuarioAct);
    }

    // Actualizar puntos de usuario en Firestore
    setDoc(doc(db, 'usuarios', reservaData.usuarioId), sanitizarParaFirestore(usuarios[usuarioIdx]), { merge: true }).catch(() => {});
  }

  // Guardar reserva en Firestore en la nube
  setDoc(doc(db, 'reservas', id), sanitizarParaFirestore(nuevaReserva)).catch(err => {
    console.warn('Error guardando reserva en Firestore:', err);
  });

  registrarEvento(
    'confirmacion_reserva',
    'Confirmar Reserva',
    'modal_reserva',
    `Reserva: ${id} | Plan: ${reservaData.planSeleccionado} | Personas: ${reservaData.numeroPersonas}`
  );

  return nuevaReserva;
}

export function actualizarEstadoReserva(id: string, nuevoEstado: EstadoReserva): Reserva | null {
  const reservas = getReservas();
  const index = reservas.findIndex(r => r.id === id);
  if (index === -1) return null;

  reservas[index].estado = nuevoEstado;
  safeSet(STORAGE_KEYS.RESERVAS, reservas);

  // Actualizar en Firestore
  setDoc(doc(db, 'reservas', id), sanitizarParaFirestore({ estado: nuevoEstado }), { merge: true }).catch(err => {
    console.warn('Error actualizando estado en Firestore:', err);
  });

  // Recalcular puntos para el usuario según reservas confirmadas activas
  recalcularPuntosUsuario(reservas[index].usuarioId);

  return reservas[index];
}

export function marcarPagoRealizado(id: string): Reserva | null {
  const reservas = getReservas();
  const index = reservas.findIndex(r => r.id === id);
  if (index === -1) return null;

  reservas[index].pagoRealizado = true;
  reservas[index].fechaPago = new Date().toISOString();
  reservas[index].estado = 'confirmada';
  reservas[index].correoEnviado = true;
  safeSet(STORAGE_KEYS.RESERVAS, reservas);

  // Actualizar en Firestore en la nube
  setDoc(doc(db, 'reservas', id), sanitizarParaFirestore({
    pagoRealizado: true,
    fechaPago: reservas[index].fechaPago,
    estado: 'confirmada',
    correoEnviado: true
  }), { merge: true }).catch(err => {
    console.warn('Error actualizando pago en Firestore:', err);
  });

  // Recalcular puntos para el usuario
  recalcularPuntosUsuario(reservas[index].usuarioId);

  registrarEvento(
    'clic_pago_realizado',
    'Pago Realizado (QR Referencial)',
    'modal_pago_reserva',
    `Reserva: ${id} | Monto: Bs ${reservas[index].montoEstimado} | Correo enviado a: ${reservas[index].correo}`
  );

  return reservas[index];
}

export function cancelarReserva(id: string, motivo?: string): Reserva | null {
  const reservas = getReservas();
  const index = reservas.findIndex(r => r.id === id);
  if (index === -1) return null;

  reservas[index].estado = 'cancelada';
  if (motivo) {
    reservas[index].notas = (reservas[index].notas ? reservas[index].notas + ' | ' : '') + `Cancelación: ${motivo}`;
  }
  safeSet(STORAGE_KEYS.RESERVAS, reservas);

  // Actualizar cancelación en Firestore
  setDoc(doc(db, 'reservas', id), sanitizarParaFirestore({
    estado: 'cancelada',
    notas: reservas[index].notas || ''
  }), { merge: true }).catch(err => {
    console.warn('Error guardando cancelación en Firestore:', err);
  });

  // Recalcular puntos
  recalcularPuntosUsuario(reservas[index].usuarioId);

  registrarEvento(
    'cancelacion_reserva',
    'Cancelar Reserva',
    'modal_pago_reserva',
    `Reserva: ${id} | Motivo: ${motivo || 'Cancelado por el usuario'}`
  );

  return reservas[index];
}

export function actualizarCrmUsuario(usuarioId: string, datos: Partial<Usuario>): Usuario | null {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id === usuarioId);
  if (index === -1) return null;

  usuarios[index] = {
    ...usuarios[index],
    ...datos,
    ultimoContacto: new Date().toISOString()
  };
  safeSet(STORAGE_KEYS.USUARIOS, usuarios);

  // Guardar en Firestore para que se sincronice en todos los administradores
  setDoc(doc(db, 'usuarios', usuarioId), sanitizarParaFirestore(usuarios[index]), { merge: true }).catch(err => {
    console.warn('Error actualizando CRM en Firestore:', err);
  });

  const usuarioAct = getUsuarioActual();
  if (usuarioAct && usuarioAct.id === usuarioId) {
    setUsuarioActual({
      ...usuarioAct,
      ...datos,
      ultimoContacto: usuarios[index].ultimoContacto
    });
  }

  return usuarios[index];
}

export function recalcularPuntosUsuario(usuarioId: string): void {
  const reservas = getReservas();
  const confirmadas = reservas.filter(r => r.usuarioId === usuarioId && r.estado === 'confirmada').length;
  
  const usuarios = getUsuarios();
  const userIdx = usuarios.findIndex(u => u.id === usuarioId);
  if (userIdx >= 0) {
    usuarios[userIdx].puntos = confirmadas;
    safeSet(STORAGE_KEYS.USUARIOS, usuarios);
    
    const usuarioAct = getUsuarioActual();
    if (usuarioAct && usuarioAct.id === usuarioId) {
      usuarioAct.puntos = confirmadas;
      setUsuarioActual(usuarioAct);
    }

    setDoc(doc(db, 'usuarios', usuarioId), { puntos: confirmadas }, { merge: true }).catch(() => {});
  }
}

// ----------------- RESEÑAS -----------------
export function getResenas(): Resena[] {
  return safeGet<Resena[]>(STORAGE_KEYS.RESENAS, RESENAS_INICIALES);
}

export function guardarResena(resenaData: Omit<Resena, 'id' | 'fecha' | 'aprobada'>): Resena {
  const resenas = getResenas();
  const id = `rev_${Date.now()}`;
  const fecha = new Date().toISOString().split('T')[0];

  const nuevaResena: Resena = {
    ...resenaData,
    id,
    fecha,
    aprobada: true // Aprobada para que se vea reflejada de inmediato
  };

  resenas.unshift(nuevaResena);
  safeSet(STORAGE_KEYS.RESENAS, resenas);

  // Guardar reseña en Firestore
  setDoc(doc(db, 'resenas', id), sanitizarParaFirestore(nuevaResena)).catch(err => {
    console.warn('Error guardando reseña en Firestore:', err);
  });

  registrarEvento(
    'envio_resena',
    'Enviar Reseña',
    'modal_resena',
    `Plan: ${resenaData.planReservado} | Estrellas: ${resenaData.calificacion}`
  );

  return nuevaResena;
}

export function toggleAprobacionResena(id: string): boolean {
  const resenas = getResenas();
  const idx = resenas.findIndex(r => r.id === id);
  if (idx === -1) return false;

  resenas[idx].aprobada = !resenas[idx].aprobada;
  safeSet(STORAGE_KEYS.RESENAS, resenas);

  setDoc(doc(db, 'resenas', id), { aprobada: resenas[idx].aprobada }, { merge: true }).catch(() => {});
  return resenas[idx].aprobada;
}

// ----------------- MÉTRICAS Y EVENTOS -----------------
export function getMetricas(): MetricaEvento[] {
  return safeGet<MetricaEvento[]>(STORAGE_KEYS.METRICAS, []);
}

export function registrarEvento(
  tipoEvento: TipoEvento,
  nombreBotonAccion: string,
  pagina: string,
  infoAdicional?: string
): MetricaEvento {
  const metricas = getMetricas();
  const usuarioAct = getUsuarioActual();

  const nuevoEvento: MetricaEvento = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    usuarioId: usuarioAct?.id || '',
    tipoEvento,
    nombreBotonAccion,
    pagina,
    fechaHora: new Date().toISOString(),
    infoAdicional: infoAdicional || ''
  };

  metricas.unshift(nuevoEvento);
  if (metricas.length > 500) {
    metricas.pop();
  }
  safeSet(STORAGE_KEYS.METRICAS, metricas);

  // Guardar evento en Firestore (en background) sanitizado
  setDoc(doc(db, 'metricas', nuevoEvento.id), sanitizarParaFirestore(nuevoEvento)).catch((err) => {
    console.warn('Error guardando métrica en Firestore:', err);
  });

  return nuevoEvento;
}

// ----------------- CLUB DE PUNTOS Y RECOMPENSA -----------------
export function calcularRecompensa(usuarioId: string) {
  const reservas = getReservas();
  const reservasUsuarioConfirmadas = reservas.filter(
    r => r.usuarioId === usuarioId && r.estado === 'confirmada'
  );

  const count = reservasUsuarioConfirmadas.length;
  const tieneRecompensa = Math.floor(count / 10);

  let promedioGastadoBs = 0;
  let mensajeRecompensa = '';

  if (tieneRecompensa > 0) {
    const ultimas10 = reservasUsuarioConfirmadas.slice(0, 10);
    const sumaTotal = ultimas10.reduce((acc, curr) => acc + (curr.montoEstimado || 0), 0);
    promedioGastadoBs = Math.round(sumaTotal / ultimas10.length) || 120;
    mensajeRecompensa = `Tienes un evento gratis estimado en Bs ${promedioGastadoBs}`;
  }

  return {
    puntos: count,
    meta: 10,
    tieneRecompensa,
    promedioGastadoBs,
    mensajeRecompensa,
    reservasConfirmadasCount: count
  };
}

export const getInfoRecompensa = calcularRecompensa;

// ----------------- MÉTRICAS PARA DASHBOARD ADMIN -----------------
export function getEstadisticasDashboard() {
  const usuarios = getUsuarios();
  const reservas = getReservas();
  const resenas = getResenas();
  const metricas = getMetricas();

  const totalUsuarios = usuarios.length;
  const totalReservas = reservas.length;
  const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada').length;
  const reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
  const reservasCanceladas = reservas.filter(r => r.estado === 'cancelada').length;

  const totalResenas = resenas.length;
  const sumaCalificaciones = resenas.reduce((acc, r) => acc + r.calificacion, 0);
  const promedioCalificacion = totalResenas > 0 ? (sumaCalificaciones / totalResenas).toFixed(1) : '5.0';

  // Clics específicos solicitados
  const clicsArmaTuPlan = metricas.filter(m => m.tipoEvento === 'clic_arma_tu_plan').length;
  const clicsVerPlanesSugeridos = metricas.filter(m => m.tipoEvento === 'clic_ver_planes_sugeridos').length;
  const clicsWhatsApp = metricas.filter(m => m.tipoEvento === 'clic_whatsapp').length;
  const clicsConfirmarReserva = metricas.filter(m => m.tipoEvento === 'confirmacion_reserva').length;
  const clicsPagoRealizado = metricas.filter(m => m.tipoEvento === 'clic_pago_realizado').length;
  const clicsCancelacion = metricas.filter(m => m.tipoEvento === 'cancelacion_reserva').length;
  const clicsResenas = metricas.filter(m => m.tipoEvento === 'envio_resena' || m.tipoEvento === 'clic_resenas').length;
  const clicsSoporte = metricas.filter(m => m.tipoEvento === 'clic_soporte').length;
  const visitasPagina = metricas.filter(m => m.tipoEvento === 'visita_pagina').length || Math.max(metricas.length, 12);

  // Ingresos y finanzas con separación de comisión del 10% de Planéa y 90% Restaurante
  const reservasConMonto = reservas.filter(r => r.estado !== 'cancelada');
  const volumenTotalGestionadoBs = reservasConMonto.reduce((acc, r) => acc + (r.montoEstimado || 0), 0);
  const comisionPorcentaje = 10;
  const ingresosPlaneaBs = Math.round(volumenTotalGestionadoBs * 0.10); // 10% comisión Planéa
  const liquidacionRestaurantesBs = volumenTotalGestionadoBs - ingresosPlaneaBs; // 90% para restaurantes
  
  const ticketPromedioTotalBs = reservasConMonto.length > 0 ? Math.round(volumenTotalGestionadoBs / reservasConMonto.length) : 0;
  const ticketPromedioPlaneaBs = Math.round(ticketPromedioTotalBs * 0.10); // Comisión promedio Planéa por reserva
  const ticketPromedioRestauranteBs = ticketPromedioTotalBs - ticketPromedioPlaneaBs;

  const pagosConfirmadosCount = reservas.filter(r => r.pagoRealizado || r.estado === 'confirmada').length;

  // Agrupación por día (últimos 7 días)
  const usuariosPorDia: Record<string, number> = {};
  usuarios.forEach(u => {
    const dia = u.fechaRegistro || 'Hoy';
    usuariosPorDia[dia] = (usuariosPorDia[dia] || 0) + 1;
  });

  const reservasPorDia: Record<string, number> = {};
  reservas.forEach(r => {
    const dia = r.fechaCreacion ? r.fechaCreacion.split('T')[0] : r.fecha;
    reservasPorDia[dia] = (reservasPorDia[dia] || 0) + 1;
  });

  // Distribución por tipo de plan con desglose 10% Planéa / 90% Restaurante
  const reservasPorTipo: Record<string, number> = {};
  const ingresosPorTipo: Record<string, { totalBs: number; planeaBs: number; restauranteBs: number }> = {};
  reservas.forEach(r => {
    reservasPorTipo[r.tipoPlan] = (reservasPorTipo[r.tipoPlan] || 0) + 1;
    if (r.estado !== 'cancelada') {
      const prev = ingresosPorTipo[r.tipoPlan] || { totalBs: 0, planeaBs: 0, restauranteBs: 0 };
      const nuevoTotal = prev.totalBs + (r.montoEstimado || 0);
      const nuevaComision = Math.round(nuevoTotal * 0.10);
      ingresosPorTipo[r.tipoPlan] = {
        totalBs: nuevoTotal,
        planeaBs: nuevaComision,
        restauranteBs: nuevoTotal - nuevaComision
      };
    }
  });

  // Distribución por zona de Santa Cruz
  const reservasPorZona: Record<string, number> = {};
  reservas.forEach(r => {
    const zona = r.ubicacionPlan || 'Equipetrol';
    reservasPorZona[zona] = (reservasPorZona[zona] || 0) + 1;
  });

  // CRM Analytics con desglose Planéa vs Restaurante
  const usuariosConReservas = usuarios.map(u => {
    const misReservas = reservas.filter(r => r.usuarioId === u.id);
    const gastadoTotal = misReservas
      .filter(r => r.estado !== 'cancelada')
      .reduce((acc, r) => acc + (r.montoEstimado || 0), 0);
    const canceladas = misReservas.filter(r => r.estado === 'cancelada').length;
    const gananciaPlanea = Math.round(gastadoTotal * 0.10);
    
    // Etiqueta automática si no tiene una manual
    let etiqueta = u.etiquetaCrm;
    if (!etiqueta) {
      if (u.puntos >= 3 || gastadoTotal > 800) etiqueta = 'vip';
      else if (misReservas.length >= 2) etiqueta = 'frecuente';
      else if (misReservas.length === 0) etiqueta = 'inactivo';
      else etiqueta = 'nuevo';
    }

    return {
      ...u,
      etiquetaCrm: etiqueta,
      totalReservas: misReservas.length,
      reservasCanceladas: canceladas,
      totalGastadoBs: gastadoTotal,
      comisionGeneradaPlaneaBs: gananciaPlanea,
      reservas: misReservas
    };
  });

  const clientesVip = usuariosConReservas.filter(u => u.etiquetaCrm === 'vip').length;
  const clientesRecurrentes = usuariosConReservas.filter(u => u.totalReservas >= 2).length;
  const tasaRecurrencia = totalUsuarios > 0 ? Math.round((clientesRecurrentes / totalUsuarios) * 100) : 0;
  const ltvPromedioBs = totalUsuarios > 0 ? Math.round(volumenTotalGestionadoBs / totalUsuarios) : 0;
  const ltvPlaneaPromedioBs = Math.round(ltvPromedioBs * 0.10);

  return {
    totalUsuarios,
    totalReservas,
    reservasConfirmadas,
    reservasPendientes,
    reservasCanceladas,
    pagosConfirmadosCount,
    // Métricas Financieras Separadas:
    volumenTotalGestionadoBs,
    ingresosPlaneaBs,
    liquidacionRestaurantesBs,
    comisionPorcentaje,
    ticketPromedioTotalBs,
    ticketPromedioPlaneaBs,
    ticketPromedioRestauranteBs,
    // Retrocompatibilidad
    ingresosTotalesBs: volumenTotalGestionadoBs,
    ticketPromedioBs: ticketPromedioPlaneaBs,
    totalResenas,
    promedioCalificacion: parseFloat(promedioCalificacion),
    clics: {
      armaTuPlan: clicsArmaTuPlan,
      verPlanesSugeridos: clicsVerPlanesSugeridos,
      whatsapp: clicsWhatsApp,
      confirmarReserva: clicsConfirmarReserva,
      pagoRealizado: clicsPagoRealizado,
      cancelacion: clicsCancelacion,
      resenas: clicsResenas,
      soporte: clicsSoporte,
      visitas: visitasPagina,
      total: metricas.length
    },
    funnel: [
      { etapa: 'Visitas a la Web', valor: visitasPagina, porcentaje: 100 },
      { etapa: 'Clics en "Arma tu plan"', valor: clicsArmaTuPlan, porcentaje: visitasPagina ? Math.min(100, Math.round((clicsArmaTuPlan / visitasPagina) * 100)) : 80 },
      { etapa: 'Consultaron Planes Sugeridos', valor: clicsVerPlanesSugeridos || clicsArmaTuPlan, porcentaje: visitasPagina ? Math.min(100, Math.round(((clicsVerPlanesSugeridos || clicsArmaTuPlan) / visitasPagina) * 100)) : 70 },
      { etapa: 'Iniciaron Reserva', valor: totalReservas, porcentaje: visitasPagina ? Math.min(100, Math.round((totalReservas / visitasPagina) * 100)) : 50 },
      { etapa: 'Pago Realizado & Confirmada', valor: pagosConfirmadosCount, porcentaje: totalReservas ? Math.min(100, Math.round((pagosConfirmadosCount / totalReservas) * 100)) : 80 }
    ],
    crm: {
      clientesVip,
      clientesRecurrentes,
      tasaRecurrencia,
      ltvPromedioBs,
      ltvPlaneaPromedioBs,
      usuariosDetalle: usuariosConReservas
    },
    usuariosPorDia,
    reservasPorDia,
    reservasPorTipo,
    reservasPorZona,
    ingresosPorTipo,
    usuarios,
    reservas,
    resenas,
    metricas
  };
}

// Función para reiniciar datos a estado demo
export function resetearDatosDemo(): void {
  localStorage.clear();
  inicializarStorage();
}
