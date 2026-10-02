import React from 'react';
import { Usuario, Reserva } from '../types';
import { getReservas, calcularRecompensa } from '../services/storage';
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
  XCircle
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

  const todasReservas = getReservas();
  const misReservas = todasReservas.filter(r => r.usuarioId === usuario.id);
  const recompensa = calcularRecompensa(usuario.id);

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

  const handleEnviarWhatsapp = (res: Reserva) => {
    const textoMensaje = `Hola, quiero confirmar mi reserva en Planéa. Mi plan es: ${res.planSeleccionado}, para ${res.numeroPersonas} persona${res.numeroPersonas > 1 ? 's' : ''}, el día ${res.fecha} a horas ${res.hora}.`;
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
            <span className="text-xs font-bold text-[#00B0B0] uppercase tracking-wider">Mi Cuenta</span>
            <h3 className="font-heading font-black text-2xl text-[#181611]">
              Mis Planes y Reservas
            </h3>
            <p className="text-xs text-[#5F7E7C] mt-0.5">
              {usuario.nombre} · {usuario.correo}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#958677] hover:text-[#181611] hover:bg-[#F0EAE3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Tarjeta de estado de Puntos */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF6] to-[#E9E5DF] border border-[#DAD6D4] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#00B0B0] text-white flex items-center justify-center shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#958677] uppercase">Puntos acumulados</p>
                <h4 className="font-heading font-black text-2xl text-[#181611]">
                  {recompensa.puntos} <span className="text-xs font-semibold text-[#5F7E7C]">Puntos Planéa</span>
                </h4>
                <p className="text-[11px] text-[#309A9E]">
                  {recompensa.reservasConfirmadasCount >= 10
                    ? '🎉 ¡Recompensa activa disponible!'
                    : `Faltan ${10 - (recompensa.puntos % 10)} reservas confirmadas para tu próximo evento gratis.`}
                </p>
              </div>
            </div>

            {recompensa.tieneRecompensa > 0 && (
              <div className="hidden sm:block text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00B0B0] text-white">
                  Evento Gratis
                </span>
                <p className="text-xs font-bold text-[#181611] mt-1">
                  Bs {recompensa.promedioGastadoBs}
                </p>
              </div>
            )}
          </div>

          {/* Lista de reservas */}
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
                {misReservas.map((res) => (
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
                        <span className="font-semibold text-[#181611]">
                          {res.numeroPersonas} pers · Bs {res.montoEstimado}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEnviarWhatsapp(res)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Reenviar confirmación por WhatsApp a 78100777"
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
                ))}
              </div>
            )}
          </div>

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
