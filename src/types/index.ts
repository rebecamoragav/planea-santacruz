export type TipoPlan = 'cena' | 'brunch' | 'cita' | 'fiesta' | 'deporte' | 'recreativo';

export type ZonaSantaCruz = 
  | 'Todas'
  | 'Norte'
  | 'Equipetrol'
  | 'Centro'
  | 'Urubó'
  | 'Sur'
  | 'Este';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  fechaRegistro: string;
  puntos: number;
  telefono?: string;
  notasCrm?: string;
  etiquetaCrm?: 'nuevo' | 'frecuente' | 'vip' | 'inactivo';
  ultimoContacto?: string;
}

export interface PlanLugar {
  id: string;
  nombre: string;
  zona: ZonaSantaCruz;
  zonaDetalle: string;
  tipo: TipoPlan;
  descripcion: string;
  precioEstimadoBs: number; // Mantenido para retrocompatibilidad
  precioEstimadoPorPersona: number; // Nuevo estándar
  moneda: 'Bs';
  ambiente: string;
  minPersonas: number;
  maxPersonas: number;
  horarioSugerido: string;
  destacado?: boolean;
  tags: string[];
  iconoEmoji: string;
  imagenLocal: string;
  imagenExperiencia: string;
  altImagen: string;
  fotosPlanes?: string[];
  planesSugeridos?: { titulo: string; imagen: string; emoji: string }[];
}

export type EstadoReserva = 'pendiente' | 'confirmada' | 'cancelada';

export interface Reserva {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  correo: string;
  telefono?: string;
  ubicacionPlan: string;
  planSeleccionado: string;
  tipoPlan: TipoPlan;
  fecha: string;
  hora: string;
  numeroPersonas: number;
  estado: EstadoReserva;
  fechaCreacion: string;
  montoEstimado: number; // Mantenido para retrocompatibilidad
  
  // Nuevos campos Requerimientos 2, 4 y 5
  precioEstimadoPorPersona?: number;
  precioTotal?: number;
  porcentajeCobroReserva?: number; // 50
  montoReserva?: number; // 50% del total
  porcentajeComisionPlanea?: number; // 15
  comisionPlanea?: number; // 15% del monto de reserva
  montoParaProveedor?: number; // montoReserva - comisionPlanea
  puntosGanados?: number; // Math.max(1, Math.floor(precioTotal / 10))
  estadoPago?: 'pendiente' | 'pagado' | 'reembolsado';
  medioConfirmacion?: 'correo' | 'whatsapp' | 'ambos';
  migrado?: boolean;

  pagoRealizado?: boolean;
  fechaPago?: string;
  correoEnviado?: boolean;
  notas?: string;
}

export interface HistorialPuntos {
  id: string;
  usuarioId: string;
  reservaId: string;
  nombrePlan: string;
  precioTotal: number;
  puntosGanados: number;
  fechaCreacion: string;
}

export interface EncuestaApp {
  id: string;
  usuarioId: string;
  nombreUsuario: string;
  correoOrWhatsapp: string;
  reservaId?: string;
  facilidadUso: number; // 1 a 5
  planesParaPresupuesto: 'si' | 'mas_o_menos' | 'no';
  claridadInformacion: number; // 1 a 5
  sugerenciaMejora: string;
  recomendaria: 'si' | 'no' | 'tal_vez';
  fechaCreacion: string;
}

export interface RecordatorioReserva {
  id: string;
  reservaId: string;
  usuarioId: string;
  medio: 'correo' | 'whatsapp';
  fechaProgramada: string;
  estado: 'pendiente' | 'enviado' | 'fallido';
  mensaje: string;
  fechaCreacion: string;
}

export interface Resena {
  id: string;
  usuarioId?: string;
  nombreUsuario: string;
  planReservado: string;
  calificacion: number; // 1 to 5
  comentario: string;
  fecha: string;
  aprobada: boolean;
}

export type TipoEvento =
  | 'usuario_registrado'
  | 'clic_arma_tu_plan'
  | 'clic_filtros'
  | 'clic_ver_planes_sugeridos'
  | 'clic_plan_seleccionado'
  | 'inicio_reserva'
  | 'confirmacion_reserva'
  | 'clic_pago_realizado'
  | 'cancelacion_reserva'
  | 'clic_whatsapp'
  | 'clic_resenas'
  | 'envio_resena'
  | 'clic_soporte'
  | 'clic_blog'
  | 'visita_pagina';

export interface MetricaEvento {
  id: string;
  usuarioId?: string;
  tipoEvento: TipoEvento;
  nombreBotonAccion: string;
  pagina: string;
  fechaHora: string;
  infoAdicional?: string;
}
