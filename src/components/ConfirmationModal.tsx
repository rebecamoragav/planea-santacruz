import React, { useState } from 'react';
import { Reserva } from '../types';
import { registrarEvento, cancelarReserva, guardarEncuestaApp } from '../services/storage';
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
  QrCode,
  DollarSign,
  Send,
  Sparkles,
  ThumbsUp,
  MessageSquare
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
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [encuestaEnviada, setEncuestaEnviada] = useState(false);

  // Estados de la encuesta de la app (Requerimiento 7)
  const [facilidadUso, setFacilidadUso] = useState<number>(5);
  const [planesPresupuesto, setPlanesPresupuesto] = useState<'si' | 'mas_o_menos' | 'no'>('si');
  const [claridadInfo, setClaridadInfo] = useState<number>(5);
  const [sugerenciaMejora, setSugerenciaMejora] = useState<string>('');
  const [recomendaria, setRecomendaria] = useState<'si' | 'no' | 'tal_vez'>('si');

  // Cálculos de montos seguros (Requerimientos 2, 4 y 5)
  const precioTotal = reserva.precioTotal || reserva.montoEstimado || 200;
  const montoReserva = reserva.montoReserva || Math.round(precioTotal * 0.50);
  const comisionPlanea = reserva.comisionPlanea || Math.round(montoReserva * 0.15);
  const montoParaProveedor = reserva.montoParaProveedor || (montoReserva - comisionPlanea);
  const saldoPendienteEnLocal = Math.max(0, precioTotal - montoReserva);
  const puntosGanados = reserva.puntosGanados || Math.max(1, Math.floor(precioTotal / 10));

  // Requerimiento 9: Mensaje oficial exacto requerido
  const mensajeConfirmacionRequerido = `Hola ${reserva.nombreUsuario}, tu reserva en Planéa fue confirmada. Plan: ${reserva.planSeleccionado}. Fecha: ${reserva.fecha}. Hora: ${reserva.hora}. Personas: ${reserva.numeroPersonas}. Monto de reserva pagado: Bs ${montoReserva}.`;

  const telefonoCliente = reserva.telefono ? reserva.telefono.replace(/\D/g, '') : '';
  const urlWhatsappCliente = telefonoCliente
    ? `https://wa.me/591${telefonoCliente}?text=${encodeURIComponent(mensajeConfirmacionRequerido)}`
    : `https://wa.me/59178100777?text=${encodeURIComponent(mensajeConfirmacionRequerido)}`;
  const urlWhatsappOficial = `https://wa.me/59178100777?text=${encodeURIComponent(mensajeConfirmacionRequerido)}`;

  const handleWhatsAppClick = (tipo: 'cliente' | 'oficial') => {
    registrarEvento(
      'clic_whatsapp',
      'Enviar confirmación por WhatsApp',
      'confirmacion_reserva',
      `ID Reserva: ${reserva.id} | Tipo: ${tipo} | Monto Reserva: Bs ${montoReserva}`
    );
    window.open(tipo === 'cliente' ? urlWhatsappCliente : urlWhatsappOficial, '_blank');
  };

  const handleEnviarCorreoSimulado = () => {
    const subject = encodeURIComponent(`Confirmación de Reserva en Planéa - ${reserva.planSeleccionado}`);
    const body = encodeURIComponent(mensajeConfirmacionRequerido + `\n\nCódigo de reserva: ${reserva.id}\nLugar: ${reserva.ubicacionPlan}\nSaldo pendiente a pagar en el local: Bs ${saldoPendienteEnLocal}`);
    window.location.href = `mailto:${reserva.correo}?subject=${subject}&body=${body}`;
  };

  const handleCancelarEstaReserva = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      cancelarReserva(reserva.id, 'Cancelada por el usuario desde comprobante');
      setCancelada(true);
    }
  };

  const handleEnviarEncuesta = (e: React.FormEvent) => {
    e.preventDefault();
    guardarEncuestaApp({
      usuarioId: reserva.usuarioId,
      nombreUsuario: reserva.nombreUsuario,
      correoOrWhatsapp: reserva.correo || reserva.telefono || 'Usuario Planéa',
      reservaId: reserva.id,
      facilidadUso,
      planesParaPresupuesto: planesPresupuesto,
      claridadInformacion: claridadInfo,
      sugerenciaMejora: sugerenciaMejora.trim(),
      recomendaria
    });
    setEncuestaEnviada(true);
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
            {cancelada ? 'Reserva Cancelada' : '¡Reserva Confirmada (Pago del 50%)!'}
          </span>

          <h2 className="font-heading font-black text-2xl sm:text-3xl leading-tight">
            {cancelada ? 'Tu reserva ha sido cancelada' : '¡Tu reserva está lista y confirmada!'}
          </h2>

          <p className="text-xs text-white/90 mt-1">
            Código: <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">{reserva.id}</span>
          </p>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* BANNER DESTACADO DE CORREO ENVIADO */}
          {!cancelada && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-emerald-950">
                    Comprobante enviado a tu correo
                  </p>
                  <p className="font-mono text-emerald-800 text-[11px] truncate max-w-[220px]">
                    {reserva.correo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEnviarCorreoSimulado}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors cursor-pointer shrink-0"
              >
                Abrir correo
              </button>
            </div>
          )}

          {/* Alerta de Puntos Ganados según Requerimiento 2 */}
          {!cancelada && (
            <div className="p-3.5 rounded-2xl bg-[#D3E6E8]/70 border border-[#73ADB9]/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00B0B0] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#181611]">
                  ¡Ganaste +{puntosGanados} {puntosGanados === 1 ? 'Punto' : 'Puntos'} Planéa!
                </p>
                <p className="text-[11px] text-[#5F7E7C]">
                  1 punto por cada Bs 10 del plan. Al llegar a 100 puntos ganas un evento gratis.
                </p>
              </div>
            </div>
          )}

          {/* Detalles del ticket con desglose de cobro del 50% y comisión (Requerimiento 5) */}
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
                    Reserva 50% Pagada
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

            {/* Desglose financiero Requerimiento 5 */}
            <div className="pt-2 border-t border-[#F0EAE3] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5F7E7C]">
                <span>Precio total del plan:</span>
                <span className="font-semibold text-[#181611]">Bs {precioTotal}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950">Monto de reserva pagado (50%):</span>
                <span className="font-heading font-black text-sm text-emerald-700">Bs {montoReserva}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#958677] px-1">
                <span>Comisión Planéa (15%): Bs {comisionPlanea}</span>
                <span>Adelanto local: Bs {montoParaProveedor}</span>
              </div>
              <div className="flex justify-between text-[#5F7E7C] pt-1 border-t border-[#F0EAE3]">
                <span>Saldo a pagar en el local (50% restante):</span>
                <span className="font-bold text-[#00B0B0]">Bs {saldoPendienteEnLocal}</span>
              </div>
            </div>
          </div>

          {/* REQUERIMIENTO 9: BOTONES DE CONFIRMACIÓN POR WHATSAPP Y MENSAJE REQUERIDO */}
          {!cancelada && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleWhatsAppClick(reserva.telefono ? 'cliente' : 'oficial')}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Enviar confirmación por WhatsApp {reserva.telefono ? `al ${reserva.telefono}` : '(78100777)'}</span>
              </button>
            </div>
          )}

          {/* REQUERIMIENTO 7: ENCUESTA PARA CALIFICAR LA APP (NO EL RESTAURANTE) */}
          {!cancelada && (
            <div className="p-4 rounded-2xl bg-white border border-[#E9E5DF] shadow-xs">
              {!mostrarEncuesta && !encuestaEnviada ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#181611]">¿Qué te pareció la app Planéa?</p>
                      <p className="text-[11px] text-[#5F7E7C]">Califica el funcionamiento de la web (30 seg)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMostrarEncuesta(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#00B0B0] hover:bg-[#309A9E] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Calificar app
                  </button>
                </div>
              ) : encuestaEnviada ? (
                <div className="p-3 text-center bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="font-bold text-emerald-950">¡Gracias por tu opinión!</p>
                  <p className="text-emerald-800 text-[11px] mt-0.5">Tus respuestas nos ayudan a seguir mejorando Planéa para Santa Cruz.</p>
                </div>
              ) : (
                <form onSubmit={handleEnviarEncuesta} className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between border-b border-[#F0EAE3] pb-2">
                    <span className="font-heading font-bold text-sm text-[#181611]">
                      Encuesta de Calidad de la App
                    </span>
                    <button
                      type="button"
                      onClick={() => setMostrarEncuesta(false)}
                      className="text-[#958677] hover:text-[#181611]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pregunta 1 */}
                  <div>
                    <label className="block font-bold text-[#181611] mb-1">
                      1. ¿Qué tan fácil fue usar Planéa? (1 a 5)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFacilidadUso(num)}
                          className={`flex-1 py-1.5 rounded-lg border font-bold text-xs flex items-center justify-center gap-1 ${
                            facilidadUso === num
                              ? 'bg-[#00B0B0] text-white border-[#00B0B0]'
                              : 'bg-[#FCFBF6] border-[#DAD6D4] text-[#181611]'
                          }`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pregunta 2 */}
                  <div>
                    <label className="block font-bold text-[#181611] mb-1">
                      2. ¿Encontraste planes adecuados para tu presupuesto?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['si', 'mas_o_menos', 'no'] as const).map((op) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => setPlanesPresupuesto(op)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-semibold ${
                            planesPresupuesto === op
                              ? 'bg-[#00B0B0] text-white border-[#00B0B0]'
                              : 'bg-[#FCFBF6] border-[#DAD6D4] text-[#181611]'
                          }`}
                        >
                          {op === 'si' ? 'Sí' : op === 'mas_o_menos' ? 'Más o menos' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pregunta 3 */}
                  <div>
                    <label className="block font-bold text-[#181611] mb-1">
                      3. ¿La información del plan fue clara? (1 a 5)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setClaridadInfo(num)}
                          className={`flex-1 py-1.5 rounded-lg border font-bold text-xs ${
                            claridadInfo === num
                              ? 'bg-[#00B0B0] text-white border-[#00B0B0]'
                              : 'bg-[#FCFBF6] border-[#DAD6D4] text-[#181611]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pregunta 4 */}
                  <div>
                    <label className="block font-bold text-[#181611] mb-1">
                      4. ¿Qué mejorarías de la app?
                    </label>
                    <textarea
                      rows={2}
                      value={sugerenciaMejora}
                      onChange={(e) => setSugerenciaMejora(e.target.value)}
                      placeholder="Tu opinión o sugerencia sobre la plataforma..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FCFBF6] border border-[#DAD6D4] text-xs outline-none focus:border-[#00B0B0]"
                    />
                  </div>

                  {/* Pregunta 5 */}
                  <div>
                    <label className="block font-bold text-[#181611] mb-1">
                      5. ¿Recomendarías Planéa a un amigo?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['si', 'tal_vez', 'no'] as const).map((op) => (
                        <button
                          key={op}
                          type="button"
                          onClick={() => setRecomendaria(op)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-semibold ${
                            recomendaria === op
                              ? 'bg-[#00B0B0] text-white border-[#00B0B0]'
                              : 'bg-[#FCFBF6] border-[#DAD6D4] text-[#181611]'
                          }`}
                        >
                          {op === 'si' ? 'Sí' : op === 'tal_vez' ? 'Tal vez' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#00B0B0] hover:bg-[#309A9E] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar evaluación de Planéa</span>
                  </button>
                </form>
              )}
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
                <span>Reseña del restaurante</span>
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
