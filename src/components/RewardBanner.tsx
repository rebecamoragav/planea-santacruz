import React from 'react';
import { Usuario } from '../types';
import { calcularRecompensa } from '../services/storage';
import { Award, Gift, Sparkles, PartyPopper, CheckCircle } from 'lucide-react';

interface RewardBannerProps {
  usuario: Usuario | null;
  onOpenBookings: () => void;
}

export const RewardBanner: React.FC<RewardBannerProps> = ({
  usuario,
  onOpenBookings,
}) => {
  if (!usuario) return null;

  const recompensa = calcularRecompensa(usuario.id);
  const porcentaje = Math.min(100, (recompensa.puntos % 10 === 0 && recompensa.puntos > 0 ? 10 : recompensa.puntos % 10) * 10);
  const puntosEnCiclo = recompensa.puntos % 10 === 0 && recompensa.puntos > 0 ? 10 : recompensa.puntos % 10;
  const faltan = 10 - puntosEnCiclo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {recompensa.tieneRecompensa > 0 ? (
        // Banner de Recompensa Ganada!
        <div className="bg-gradient-to-r from-[#00B0B0] via-[#309A9E] to-[#4EBAA4] rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-[#00B0B0]/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white text-[#00B0B0] flex items-center justify-center shrink-0 shadow-lg">
              <PartyPopper className="w-9 h-9" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>¡Recompensa Desbloqueada!</span>
              </div>
              <h3 className="font-heading font-black text-2xl sm:text-3xl leading-tight">
                {recompensa.mensajeRecompensa}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
                ¡Felicidades, {usuario.nombre}! Completaste tus 10 planes confirmados. El promedio de tus salidas equivale a este valor para canjear en tu próximo plan.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBookings}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-white text-[#00B0B0] hover:bg-[#FCFBF6] font-heading font-black text-sm shadow-md transition-all cursor-pointer hover:scale-105 active:scale-100"
          >
            Ver mis reservas y canjear
          </button>
        </div>
      ) : (
        // Barra de progreso hacia la recompensa
        <div className="bg-white rounded-3xl p-5 border border-[#E9E5DF] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-[#00B0B0]/10 text-[#00B0B0] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-sm text-[#181611]">
                  Club de Puntos Planéa
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E]">
                  {recompensa.puntos} / 10 reservas
                </span>
              </div>
              <p className="text-xs text-[#5F7E7C] mt-0.5">
                {faltan === 0
                  ? '¡Has alcanzado la meta!'
                  : `Te faltan solo ${faltan} reserva${faltan > 1 ? 's' : ''} confirmada${faltan > 1 ? 's' : ''} para ganar tu evento gratis.`}
              </p>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="w-full sm:w-64 space-y-1.5">
            <div className="w-full h-2.5 bg-[#F0EAE3] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00B0B0] to-[#4EBAA4] rounded-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#958677] font-semibold">
              <span>0 planes</span>
              <span>10 planes (Evento Gratis)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
