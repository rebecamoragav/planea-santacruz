import React, { useState } from 'react';
import { Reserva } from '../types';
import { registrarEvento, cancelarReserva } from '../services/storage';
import { 
  CheckCircle, 
  MessageCircle, 
  Mail, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Award, 
  X,
  Star,
  CheckCircle2,
  XCircle,
  QrCode
} from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  reserva: Reserva | null;
  onClose: () => void;
  onDejarResena?: (planNombre: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  reserva,
  onClose,
  onDejarResena,
}) => {
  if (!isOpen || !reserva) return null;

  const [cancelada, setCancelada] = useState(reserva.estado === 'cancelada');

  // Mensaje oficial para WhatsApp (+591 78100777)
  const textoMensaje = `Hola, quiero confirmar mi reserva en Planéa. Mi plan es: ${reserva.planSeleccionado}, para ${reserva.numeroPersonas} persona${reserva.numeroPersonas > 1 ? 's' : ''}, el día ${reserva.fecha} a horas ${reserva.hora}.`;

  const whatsappUrl = `https://wa.me/59178100777?text=${encodeURIComponent(textoMensaje)}`;

  const handleWhatsAppClick = () => {
    registrarEvento(
      'clic_whatsapp',
      'Enviar confirmación por WhatsApp',
      'confirmacion_reserva',
      `ID Reserva: ${reserva.id} | Tel: 78100777`
    );
    window.open(whatsappUrl, '_blank');
  };

  const handleCancelarEstaReserva = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      cancelarReserva(reserva.id, 'Cancelada por el usuario desde comprobante');
      setCancelada(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera de confirmación exitosa */}
        <div className={`p-6 text-white text-center relative ${
          cancelada 
            ? 'bg-gradient-to-br from-red-500 to-rose-700' 
            : 'bg-gradient-to-br from-[#00B0B0] via-[#309A9E] to-emerald-600'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-white text-[#00B0B0] flex items-center justify-center mx-auto mb-3 shadow-lg">
            {cancelada ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : (
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            )}
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
            {cancelada ? 'Reserva Cancelada' : '¡Pago Registrado & Confirmado!'}
          </span>

          {/* MENSAJE SOLICITADO */}
          <h2 className="font-heading font-black text-2xl sm:text-3xl leading-tight">
            {cancelada ? 'Tu reserva ha sido cancelada' : '¡Tu reserva está lista y se envió a tu correo!'}
          </h2>

          <p className="text-xs text-white/90 mt-1">
            Código de reserva: <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">{reserva.id}</span>
          </p>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* BANNER DESTACADO DE CORREO ENVIADO */}
          {!cancelada && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-950 text-sm">
                  Comprobante enviado exitosamente
                </p>
                <p className="text-emerald-800 mt-0.5">
                  Hemos enviado los datos de tu reserva y voucher a:
                </p>
                <p className="font-mono font-bold text-emerald-900 bg-white/80 px-2 py-1 rounded-lg border border-emerald-200 inline-block mt-1">
                  {reserva.correo}
                </p>
              </div>
            </div>
          )}

          {/* Alerta de +1 punto */}
          {!cancelada && (
            <div className="p-3.5 rounded-2xl bg-[#D3E6E8]/70 border border-[#73ADB9]/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00B0B0] text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#181611]">¡Ganaste +1 Punto Planéa!</p>
                <p className="text-[11px] text-[#5F7E7C]">Acumula 10 reservas y obtén un evento gratis en Santa Cruz.</p>
              </div>
            </div>
          )}

          {/* Detalles del ticket */}
          <div className="p-5 rounded-2xl bg-white border border-[#E9E5DF] shadow-xs space-y-3.5">
            <div className="flex items-start justify-between border-b border-[#F0EAE3] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#958677] tracking-wider">Plan elegido</span>
                <h4 className="font-heading font-bold text-lg text-[#181611]">{reserva.planSeleccionado}</h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E9E5DF] text-[#309A9E] uppercase">
                  {reserva.tipoPlan}
                </span>
                {!cancelada && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Pago QR Realizado
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#5F7E7C]">
                <Calendar className="w-4 h-4 text-[#00B0B0]" />
                <div>
                  <span className="text-[10px] text-[#958677] block">Fecha</span>
                  <span className="font-bold text-[#181611]">{reserva.fecha}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#5F7E7C]">
                <Clock className="w-4 h-4 text-[#00B0B0]" />
                <div>
                  <span className="text-[10px] text-[#958677] block">Hora</span>
                  <span className="font-bold text-[#181611]">{reserva.hora} hrs</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#5F7E7C]">
                <Users className="w-4 h-4 text-[#4EBAA4]" />
                <div>
                  <span className="text-[10px] text-[#958677] block">Personas</span>
                  <span className="font-bold text-[#181611]">{reserva.numeroPersonas} personas</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#5F7E7C]">
                <MapPin className="w-4 h-4 text-[#309A9E]" />
                <div>
                  <span className="text-[10px] text-[#958677] block">Ubicación</span>
                  <span className="font-bold text-[#181611] truncate max-w-[130px] block">{reserva.ubicacionPlan}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0EAE3] flex justify-between items-center text-xs">
              <span className="text-[#958677]">Titular: {reserva.nombreUsuario}</span>
              <span className="font-bold text-[#00B0B0]">Monto pagado: Bs {reserva.montoEstimado}</span>
            </div>
          </div>

          {/* BOTÓN WHATSAPP OFICIAL (78100777) */}
          {!cancelada && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirmar por WhatsApp oficial (78100777)</span>
              </button>
            </div>
          )}

          {/* Botones secundarios */}
          <div className="flex items-center gap-2 pt-1">
            {onDejarResena && !cancelada && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDejarResena(reserva.planSeleccionado);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white border border-[#DAD6D4] text-xs font-semibold text-[#181611] hover:bg-[#F0EAE3] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Dejar reseña</span>
              </button>
            )}

            {!cancelada ? (
              <button
                type="button"
                onClick={handleCancelarEstaReserva}
                className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancelar reserva</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#F0EAE3] text-xs font-bold text-[#181611]"
              >
                Cerrar comprobante
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
