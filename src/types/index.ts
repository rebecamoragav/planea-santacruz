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
  precioEstimadoBs: number;
  ambiente: string;
  minPersonas: number;
  maxPersonas: number;
  horarioSugerido: string;
  destacado?: boolean;
  tags: string[];
  iconoEmoji: string;
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
  montoEstimado: number;
  pagoRealizado?: boolean;
  fechaPago?: string;
  correoEnviado?: boolean;
  notas?: string;
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
