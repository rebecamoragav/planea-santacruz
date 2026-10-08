import React, { useState } from 'react';
import { PlanLugar, Usuario, Reserva } from '../types';
import { guardarReserva, registrarEvento } from '../services/storage';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Award,
  QrCode,
  CreditCard,
  Building,
  Phone,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Copy,
  Check
} from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  plan: PlanLugar | null;
  usuario: Usuario;
  initialFecha: string;
  initialPersonas: number;
  onClose: () => void;
  onSuccess: (reserva: Reserva) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  plan,
  usuario,
  initialFecha,
  initialPersonas,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !plan) return null;

  // Pasos: 'datos' -> 'pago_qr'
  const [paso, setPaso] = useState<'datos' | 'pago_qr'>('datos');

  const [fecha, setFecha] = useState(initialFecha || new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState('20:00');
  const [personas, setPersonas] = useState(initialPersonas || 2);
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Requerimientos 2, 4 y 5:
  const precioPorPersona = plan.precioEstimadoPorPersona || plan.precioEstimadoBs || 100;
  const precioTotal = precioPorPersona * personas;
  const porcentajeCobroReserva = 50;
  const montoReserva = Math.round(precioTotal * 0.50); // El cliente paga solo el 50%
  const porcentajeComisionPlanea = 15;
  const comisionPlanea = Math.round(montoReserva * 0.15); // 15% del monto de reserva
  const montoParaProveedor = montoReserva - comisionPlanea;
  const puntosGanados = Math.max(1, Math.floor(precioTotal / 10)); // 1 punto por cada Bs 10

  const horariosSugeridos = [
    '09:30', '11:00', '12:30', '14:00', 
    '16:30', '18:00', '19:30', '20:30', '21:30', '22:30'
  ];

  const handleIrAlPago = (e: React.FormEvent) => {
    e.preventDefault();
    registrarEvento(
      'inicio_reserva',
      'Ir al Pago de Reserva (50%)',
      'modal_reserva',
      `Plan: ${plan.nombre} | Total: Bs ${precioTotal} | Cobro 50%: Bs ${montoReserva}`
    );
    setPaso('pago_qr');
  };

  const handlePagoRealizado = () => {
    setGuardando(true);

    try {
      const nuevaReserva = guardarReserva({
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        correo: usuario.correo,
        telefono: telefono.trim() || undefined,
        ubicacionPlan: plan.zonaDetalle,
        planSeleccionado: plan.nombre,
        tipoPlan: plan.tipo,
        fecha,
        hora,
        numeroPersonas: personas,
        montoEstimado: precioTotal,
        precioEstimadoPorPersona: precioPorPersona,
        precioTotal,
        porcentajeCobroReserva,
        montoReserva,
        porcentajeComisionPlanea,
        comisionPlanea,
        montoParaProveedor,
        puntosGanados,
        estadoPago: 'pagado',
        notas: notas.trim() || undefined
      });

      // Registrar evento de pago realizado
      registrarEvento(
        'clic_pago_realizado',
        'Pago de Reserva Realizado (QR Referencial 50%)',
        'modal_pago',
        `Reserva: ${nuevaReserva.id} | Monto Pagado: Bs ${montoReserva} (50%) | Total: Bs ${precioTotal}`
      );

      setTimeout(() => {
        setGuardando(false);
        onSuccess(nuevaReserva);
      }, 450);
    } catch (err) {
      console.error(err);
      setGuardando(false);
    }
  };

  const handleCancelarReserva = () => {
    registrarEvento(
      'cancelacion_reserva',
      'Cancelar en paso de QR',
      'modal_pago',
      `Plan: ${plan.nombre} | Usuario: ${usuario.correo}`
    );
    onClose();
  };

  const handleCopiarCuenta = () => {
    navigator.clipboard?.writeText('10000045928371');
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="p-5 sm:p-6 border-b border-[#E9E5DF] flex items-start justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
              {plan.iconoEmoji}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#D3E6E8] text-[#309A9E]">
                  {plan.tipo}
                </span>
                <span className="text-xs text-[#5F7E7C] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00B0B0]" />
                  {plan.zonaDetalle}
                </span>
              </div>
              <h3 className="font-heading font-black text-xl text-[#181611] mt-0.5">
                {plan.nombre}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#958677] hover:text-[#181611] hover:bg-[#F0EAE3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="px-6 py-2.5 bg-[#F0EAE3]/50 border-b border-[#E9E5DF] flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${paso === 'datos' ? 'text-[#00B0B0] font-bold' : 'text-[#958677]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paso === 'datos' ? 'bg-[#00B0B0] text-white' : 'bg-[#E9E5DF]'}`}>1</span>
            <span>Detalles del plan</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#B0AFAD]" />
          <div className={`flex items-center gap-1.5 ${paso === 'pago_qr' ? 'text-[#00B0B0] font-bold' : 'text-[#958677]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${paso === 'pago_qr' ? 'bg-[#00B0B0] text-white' : 'bg-[#E9E5DF]'}`}>2</span>
            <span>QR Referencial & Pago</span>
          </div>
        </div>

        {/* ================= PASO 1: FORMULARIO ================= */}
        {paso === 'datos' && (
          <form onSubmit={handleIrAlPago} className="p-6 overflow-y-auto space-y-4 flex-1">
            
            {/* Banner de recompensa: Puntos Planéa calculados según Requerimiento 2 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#D3E6E8]/60 to-[#4EBAA4]/20 border border-[#4EBAA4]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00B0B0] text-white flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#181611]">
                    ¡Ganas +{puntosGanados} {puntosGanados === 1 ? 'Punto' : 'Puntos'} Planéa con esta reserva!
                  </p>
                  <p className="text-[11px] text-[#5F7E7C]">
                    1 punto por cada Bs 10 del plan. Al llegar a 100 puntos ganas un evento gratis.
                  </p>
                </div>
              </div>
            </div>

            {/* Datos del usuario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white border border-[#E9E5DF] text-xs">
              <div>
                <span className="text-[#958677] block font-medium">Titular:</span>
                <span className="font-bold text-[#181611] text-sm truncate block">{usuario.nombre}</span>
              </div>
              <div>
                <span className="text-[#958677] block font-medium">Correo de confirmación:</span>
                <span className="font-bold text-[#181611] text-sm truncate block">{usuario.correo}</span>
              </div>
            </div>

            {/* Teléfono para WhatsApp / CRM */}
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#00B0B0]" />
                <span>Teléfono celular / WhatsApp (Para coordinar)</span>
              </label>
              <input
                type="tel"
                placeholder="Ej. 78100777"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#DAD6D4] text-xs sm:text-sm font-semibold text-[#181611] placeholder:text-[#B0AFAD] focus:border-[#00B0B0] outline-none"
              />
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#00B0B0]" />
                  <span>Fecha del evento</span>
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#DAD6D4] text-xs font-semibold text-[#181611] focus:border-[#00B0B0] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B0B0]" />
                  <span>Hora</span>
                </label>
                <select
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#DAD6D4] text-xs font-semibold text-[#181611] focus:border-[#00B0B0] outline-none"
                >
                  {horariosSugeridos.map(h => (
                    <option key={h} value={h}>{h} hrs</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Número de personas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#181611] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#309A9E]" />
                  <span>Número de Personas: <strong className="text-[#00B0B0] text-sm">{personas}</strong></span>
                </label>
                <span className="text-[11px] text-[#958677]">Capacidad: {plan.minPersonas} a {plan.maxPersonas}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPersonas(Math.max(1, personas - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#DAD6D4] font-black text-lg text-[#181611] hover:bg-[#F0EAE3]"
                >
                  -
                </button>
                <div className="flex-1 py-2 text-center bg-white border border-[#DAD6D4] rounded-xl font-heading font-bold text-[#181611]">
                  {personas} {personas === 1 ? 'persona' : 'personas'}
                </div>
                <button
                  type="button"
                  onClick={() => setPersonas(personas + 1)}
                  className="w-10 h-10 rounded-xl bg-white border border-[#DAD6D4] font-black text-lg text-[#181611] hover:bg-[#F0EAE3]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notas especiales */}
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Notas o solicitudes especiales (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Cumpleaños, mesa en terraza, aniversario..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#DAD6D4] text-xs text-[#181611] placeholder:text-[#B0AFAD] focus:border-[#00B0B0] outline-none"
              />
            </div>

            {/* Resumen de costos con cobro del 50% de reserva (Requerimiento 5) */}
            <div className="p-4 rounded-2xl bg-white border border-[#E9E5DF] space-y-2">
              <div className="flex justify-between text-xs text-[#5F7E7C]">
                <span>Precio estimado por persona</span>
                <span className="font-semibold text-[#181611]">Bs {precioPorPersona}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5F7E7C]">
                <span>Cantidad de personas</span>
                <span className="font-semibold text-[#181611]">x {personas}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5F7E7C] pt-1 border-t border-[#F0EAE3]">
                <span>Precio total estimado del plan</span>
                <span className="font-bold text-[#181611]">Bs {precioTotal}</span>
              </div>
              
              {/* Cobro del 50% destacado */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-emerald-900">
                    Monto a pagar para reservar (50%)
                  </span>
                  <span className="font-heading font-black text-base text-emerald-700">
                    Bs {montoReserva}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800">
                  <span>Saldo a pagar en el local (50%)</span>
                  <span>Bs {precioTotal - montoReserva}</span>
                </div>
                <p className="text-[10px] text-emerald-700/80 pt-0.5">
                  Confirmas con el 50% de reserva; el 50% restante lo pagas directamente al llegar al local.
                </p>
              </div>
            </div>

            {/* Botones de acción Paso 1 */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-2xl bg-[#F0EAE3] text-[#181611] font-bold text-xs hover:bg-[#E9E5DF] transition-colors"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 px-4 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#00B0B0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Pagar reserva (Bs {montoReserva})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* ================= PASO 2: QR REFERENCIAL Y PAGO REALIZADO (50%) ================= */}
        {paso === 'pago_qr' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D3E6E8] text-[#309A9E] uppercase tracking-wider mb-1">
                <QrCode className="w-3.5 h-3.5 text-[#00B0B0]" />
                Pago Seguro por QR (50% de Reserva)
              </span>
              <h3 className="font-heading font-black text-2xl text-[#181611]">
                Escanea el QR Referencial
              </h3>
              <p className="text-xs text-[#5F7E7C] mt-1 max-w-sm mx-auto">
                Transfiere el 50% para la reserva (<strong>Bs {montoReserva}</strong>) para confirmar tu plan en Planéa.
              </p>
            </div>

            {/* TARJETA DEL QR REFERENCIAL */}
            <div className="bg-white rounded-3xl p-5 border-2 border-[#00B0B0]/30 shadow-md text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#00B0B0] via-[#309A9E] to-[#4EBAA4]" />

              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE3] text-xs">
                <div className="flex items-center gap-1.5 text-left">
                  <Building className="w-4 h-4 text-[#00B0B0]" />
                  <div>
                    <span className="font-bold text-[#181611] block leading-none">Banco Unión / BCP</span>
                    <span className="text-[10px] text-[#958677]">QR Simple Bolivia</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#958677] block">Reserva a pagar (50%):</span>
                  <span className="font-heading font-black text-lg text-[#00B0B0]">
                    Bs {montoReserva}
                  </span>
                  <span className="text-[9px] text-[#958677] block">Total plan: Bs {precioTotal}</span>
                </div>
              </div>

              {/* GRÁFICO DEL CÓDIGO QR */}
              <div className="my-4 flex justify-center">
                <div className="p-3 bg-white border-2 border-[#181611] rounded-2xl shadow-inner inline-block relative group">
                  <svg
                    className="w-44 h-44 sm:w-48 sm:h-48"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Marco exterior e interior del QR */}
                    <rect width="100" height="100" fill="white" />
                    
                    {/* Esquinas superiores */}
                    <rect x="5" y="5" width="28" height="28" fill="#181611" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                    <rect x="13" y="13" width="12" height="12" fill="#00B0B0" rx="1" />

                    <rect x="67" y="5" width="28" height="28" fill="#181611" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                    <rect x="75" y="13" width="12" height="12" fill="#00B0B0" rx="1" />

                    {/* Esquina inferior izquierda */}
                    <rect x="5" y="67" width="28" height="28" fill="#181611" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                    <rect x="13" y="75" width="12" height="12" fill="#00B0B0" rx="1" />

                    {/* Patrón de datos QR */}
                    <rect x="38" y="8" width="8" height="8" fill="#181611" />
                    <rect x="50" y="8" width="10" height="6" fill="#181611" />
                    <rect x="38" y="22" width="6" height="12" fill="#181611" />
                    <rect x="48" y="20" width="12" height="6" fill="#181611" />
                    <rect x="8" y="38" width="6" height="10" fill="#181611" />
                    <rect x="20" y="38" width="10" height="6" fill="#181611" />
                    <rect x="38" y="38" width="24" height="24" fill="#00B0B0" rx="3" />
                    
                    {/* Logo central de Planéa en el QR */}
                    <circle cx="50" cy="50" r="8" fill="white" />
                    <text x="50" y="54" fontSize="10" fontWeight="bold" fill="#00B0B0" textAnchor="middle">P</text>

                    {/* Más patrones */}
                    <rect x="68" y="38" width="10" height="8" fill="#181611" />
                    <rect x="82" y="42" width="10" height="6" fill="#181611" />
                    <rect x="68" y="52" width="8" height="10" fill="#181611" />
                    <rect x="80" y="54" width="12" height="6" fill="#181611" />
                    <rect x="38" y="68" width="10" height="8" fill="#181611" />
                    <rect x="54" y="68" width="8" height="12" fill="#181611" />
                    <rect x="68" y="68" width="24" height="6" fill="#181611" />
                    <rect x="74" y="78" width="18" height="8" fill="#181611" />
                    <rect x="40" y="82" width="12" height="10" fill="#181611" />
                    <rect x="56" y="86" width="10" height="6" fill="#181611" />
                  </svg>
                </div>
              </div>

              {/* Datos de transferencia bancaria */}
              <div className="bg-[#FCFBF6] rounded-2xl p-3 border border-[#E9E5DF] text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#958677]">Titular:</span>
                  <span className="font-bold text-[#181611]">Planéa Experiencias Bolivia S.R.L.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#958677]">Cta. Corriente (Bs):</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-[#181611]">
                    <span>10000045928371</span>
                    <button
                      type="button"
                      onClick={handleCopiarCuenta}
                      className="text-[#00B0B0] hover:text-[#309A9E] p-0.5"
                      title="Copiar cuenta"
                    >
                      {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#958677]">NIT:</span>
                  <span className="font-semibold text-[#181611]">1029384750</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#958677]">Glosa / Ref:</span>
                  <span className="font-bold text-[#00B0B0]">{plan.nombre.slice(0, 12)} ({personas}p)</span>
                </div>
              </div>
            </div>

            {/* BOTONES PRINCIPALES SOLICITADOS: "PAGO REALIZADO" Y "CANCELAR RESERVA" */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handlePagoRealizado}
                disabled={guardando}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#00B0B0] hover:from-emerald-700 hover:to-[#309A9E] active:scale-[0.99] text-white font-heading font-black text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>{guardando ? 'Verificando y enviando reserva...' : 'Pago realizado'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaso('datos')}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-[#DAD6D4] text-xs font-semibold text-[#5F7E7C] hover:text-[#181611] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modificar datos</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelarReserva}
                  className="flex-1 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancelar reserva</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-center text-[#958677]">
              Al hacer clic en <strong>“Pago realizado”</strong> tu reserva se confirmará automáticamente y recibirás la confirmación en tu correo.
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
