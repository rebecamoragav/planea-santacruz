import React, { useState } from 'react';
import { Usuario, Reserva, HistorialPuntos } from '../types';
import { getReservas, calcularRecompensa, getHistorialPuntos } from '../services/storage';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Award, 
  PartyPopper,
  CheckCircle,
  Clock3,
  XCircle,
  Coins,
  History,
  CalendarCheck
} from 'lucide-react';

interface UserBookingsModalProps {
  isOpen: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onDejarResena: (plan: string) => void;
}

export const UserBookingsModal: React.FC<UserBookingsModalProps> = ({
  isOpen,
  usuario,
  onClose,
  onDejarResena,
}) => {
  if (!isOpen || !usuario) return null;

  const [tabActual, setTabActual] = useState<'reservas' | 'puntos'>('reservas');
  const todasReservas = getReservas();
  const misReservas = todasReservas.filter(r => r.usuarioId === usuario.id);
  const miHistorialPuntos = getHistorialPuntos(usuario.id);
  const recompensa = calcularRecompensa(usuario.id);
  const puntosActuales = usuario.puntos || 0;
  const meta = 100;
  const faltan = Math.max(0, meta - puntosActuales);

  const getStatusBadge = (estado: Reserva['estado']) => {
    switch (estado) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>Confirmada</span>
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock3 className="w-3 h-3" />
            <span>Pendiente</span>
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelada</span>
          </span>
        );
    }
  };

  // Requerimiento 9: Formato oficial de confirmación
  const handleEnviarWhatsapp = (res: Reserva) => {
    const montoPagado = res.montoReserva || Math.round((res.precioTotal || res.montoEstimado || 200) * 0.50);
    const textoMensaje = `Hola ${usuario.nombre}, tu reserva en Planéa fue confirmada. Plan: ${res.planSeleccionado}. Fecha: ${res.fecha}. Hora: ${res.hora}. Personas: ${res.numeroPersonas}. Monto de reserva pagado: Bs ${montoPagado}.`;
    const url = `https://wa.me/59178100777?text=${encodeURIComponent(textoMensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="p-6 bg-white border-b border-[#E9E5DF] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#00B0B0] uppercase tracking-wider">Mi Cuenta Planéa</span>
            <h3 className="font-heading font-black text-2xl text-[#181611]">
              Mis Planes y Puntos
            </h3>
            <p className="text-xs text-[#5F7E7C] mt-0.5">
              {usuario.nombre} · {usuario.correo}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#958677] hover:text-[#181611] hover:bg-[#F0EAE3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas de Reservas vs Historial de Puntos */}
        <div className="px-6 py-2.5 bg-white border-b border-[#E9E5DF] flex gap-2">
          <button
            type="button"
            onClick={() => setTabActual('reservas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tabActual === 'reservas'
                ? 'bg-[#00B0B0] text-white shadow-xs'
                : 'text-[#5F7E7C] hover:bg-[#FCFBF6]'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mis Reservas ({misReservas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTabActual('puntos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tabActual === 'puntos'
                ? 'bg-[#00B0B0] text-white shadow-xs'
                : 'text-[#5F7E7C] hover:bg-[#FCFBF6]'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Historial de Puntos ({miHistorialPuntos.length})</span>
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Tarjeta de estado de Puntos (Requerimientos 2 y 3) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF6] to-[#E9E5DF] border border-[#DAD6D4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#00B0B0] text-white flex items-center justify-center shadow-md shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#958677] uppercase">Puntos acumulados</p>
                <h4 className="font-heading font-black text-2xl text-[#181611]">
                  {puntosActuales} <span className="text-xs font-semibold text-[#5F7E7C]">Puntos Planéa</span>
                </h4>
                <p className="text-[11px] text-[#309A9E] mt-0.5">
                  1 punto por cada Bs 10 gastados · Meta: 100 puntos
                </p>
              </div>
            </div>

            {recompensa.tieneRecompensa > 0 ? (
              <div className="p-3 bg-white rounded-xl border border-[#00B0B0] text-right">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00B0B0] text-white uppercase tracking-wider">
                  ¡Evento Gratis!
                </span>
                <p className="text-xs font-bold text-[#181611] mt-1">
                  Estimado: Bs {recompensa.promedioGastadoBs}
                </p>
                <p className="text-[10px] text-[#5F7E7C]">Según promedio de reservas</p>
              </div>
            ) : (
              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-[#181611]">
                  Faltan {faltan} puntos
                </span>
                <p className="text-[11px] text-[#958677]">para desbloquear tu evento gratis</p>
              </div>
            )}
          </div>

          {/* TAB 1: LISTA DE RESERVAS */}
          {tabActual === 'reservas' && (
            <div>
              <h4 className="font-heading font-bold text-base text-[#181611] mb-3">
                Historial de Reservas ({misReservas.length})
              </h4>

              {misReservas.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-[#E9E5DF]">
                  <p className="text-xs text-[#958677]">Aún no has realizado ninguna reserva en Planéa.</p>
                  <p className="text-xs text-[#5F7E7C] mt-1">Presiona "Arma tu plan" para comenzar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {misReservas.map((res) => {
                    const precioTot = res.precioTotal || res.montoEstimado || 200;
                    const montoReserva = res.montoReserva || Math.round(precioTot * 0.50);
                    const pts = res.puntosGanados || Math.max(1, Math.floor(precioTot / 10));

                    return (
                      <div
                        key={res.id}
                        className="p-4 rounded-2xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-[#181611]">
                              {res.planSeleccionado}
                            </span>
                            {getStatusBadge(res.estado)}
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E]">
                              +{pts} pts
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5F7E7C]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#00B0B0]" />
                              {res.fecha}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#00B0B0]" />
                              {res.hora} hrs
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#309A9E]" />
                              {res.ubicacionPlan}
                            </span>
                          </div>

                          <div className="text-xs text-[#181611] font-semibold pt-1">
                            <span>Total plan: Bs {precioTot}</span>
                            <span className="text-emerald-700 ml-2 font-bold">· Reserva pagada (50%): Bs {montoReserva}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleEnviarWhatsapp(res)}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title="Reenviar comprobante por WhatsApp a 78100777"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden md:inline">WhatsApp</span>
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              onDejarResena(res.planSeleccionado);
                            }}
                            className="px-3 py-2 rounded-xl bg-[#F0EAE3] hover:bg-[#E9E5DF] text-[#181611] text-xs font-semibold transition-colors"
                          >
                            Reseña
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORIAL DE PUNTOS GANADOS (REQUERIMIENTO 2) */}
          {tabActual === 'puntos' && (
            <div>
              <h4 className="font-heading font-bold text-base text-[#181611] mb-3">
                Movimientos de Puntos ({miHistorialPuntos.length})
              </h4>

              {miHistorialPuntos.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-[#E9E5DF]">
                  <p className="text-xs text-[#958677]">Aún no tienes movimientos registrados en tu historial de puntos.</p>
                  <p className="text-xs text-[#5F7E7C] mt-1">Ganas 1 punto por cada Bs 10 de cada reserva confirmada.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E9E5DF] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#958677] uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 font-bold">Fecha</th>
                          <th className="py-2.5 px-3 font-bold">Plan / Local</th>
                          <th className="py-2.5 px-3 font-bold">Precio Total</th>
                          <th className="py-2.5 px-3 font-bold text-right">Puntos Ganados</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE3]">
                        {miHistorialPuntos.map((hp) => (
                          <tr key={hp.id} className="hover:bg-[#FCFBF6]/60 transition-colors">
                            <td className="py-2.5 px-3 text-[#5F7E7C] font-mono text-[11px]">
                              {typeof hp.fechaCreacion === 'string' && hp.fechaCreacion.includes('T') ? hp.fechaCreacion.split('T')[0] : String(hp.fechaCreacion || 'Hoy')}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#181611]">
                              {hp.nombrePlan}
                            </td>
                            <td className="py-2.5 px-3 text-[#5F7E7C]">
                              Bs {hp.precioTotal}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                                +{hp.puntosGanados} pts
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E9E5DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#181611] text-white text-xs font-bold hover:bg-[#309A9E] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
