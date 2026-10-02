import React, { useState, useEffect } from 'react';
import { 
  getEstadisticasDashboard, 
  actualizarEstadoReserva, 
  toggleAprobacionResena, 
  actualizarCrmUsuario,
  resetearDatosDemo 
} from '../services/storage';
import { EstadoReserva, Usuario } from '../types';
import { 
  Shield, 
  Lock, 
  Users, 
  CalendarCheck, 
  Star, 
  MousePointer, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  MessageCircle,
  Phone,
  Compass,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  DollarSign,
  UserCheck,
  CreditCard,
  Building,
  Crown,
  FileText,
  Save,
  CheckCircle2,
  Filter,
  Layers,
  ArrowUpRight,
  Award
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [tabActiva, setTabActiva] = useState<'resumen' | 'graficos' | 'crm' | 'reservas' | 'resenas' | 'metricas'>('resumen');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCrmEtiqueta, setFiltroCrmEtiqueta] = useState<'todos' | 'vip' | 'frecuente' | 'nuevo' | 'inactivo'>('todos');
  const [notasEditando, setNotasEditando] = useState<Record<string, string>>({});
  const [version, setVersion] = useState(0); // Para forzar re-render

  // Escuchar actualizaciones en tiempo real desde Firestore
  useEffect(() => {
    const handleUpdate = () => {
      setVersion(v => v + 1);
    };
    window.addEventListener('planea_datos_actualizados', handleUpdate);
    return () => {
      window.removeEventListener('planea_datos_actualizados', handleUpdate);
    };
  }, []);

  const stats = getEstadisticasDashboard();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAutenticado(true);
      setErrorPassword(false);
    } else {
      setErrorPassword(true);
    }
  };

  const handleCambiarEstado = (reservaId: string, nuevoEstado: EstadoReserva) => {
    actualizarEstadoReserva(reservaId, nuevoEstado);
    setVersion(v => v + 1);
  };

  const handleToggleResena = (resenaId: string) => {
    toggleAprobacionResena(resenaId);
    setVersion(v => v + 1);
  };

  const handleGuardarNotaCrm = (usuarioId: string) => {
    const nota = notasEditando[usuarioId];
    if (nota !== undefined) {
      actualizarCrmUsuario(usuarioId, { notasCrm: nota });
      setVersion(v => v + 1);
    }
  };

  const handleCambiarEtiquetaCrm = (usuarioId: string, etiqueta: 'nuevo' | 'frecuente' | 'vip' | 'inactivo') => {
    actualizarCrmUsuario(usuarioId, { etiquetaCrm: etiqueta });
    setVersion(v => v + 1);
  };

  const handleResetDemo = () => {
    if (window.confirm('¿Seguro que deseas restablecer todos los datos iniciales de demo?')) {
      resetearDatosDemo();
      setVersion(v => v + 1);
    }
  };

  // Pantalla de contraseña protegida
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#FCFBF6] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E9E5DF] p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#00B0B0]/15 text-[#00B0B0] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-black text-2xl text-[#181611]">
              Panel Privado Planéa
            </h2>
            <p className="text-xs text-[#5F7E7C] mt-1">
              Ingresa la contraseña administrativa para ver métricas, gráficos y CRM.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Contraseña Administrativa
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Ingresa admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl bg-[#FCFBF6] border text-sm font-semibold text-[#181611] outline-none transition-all ${
                  errorPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-[#DAD6D4] focus:border-[#00B0B0]'
                }`}
              />
              {errorPassword && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  Contraseña incorrecta. (Pista: usa <code className="font-bold">admin123</code>)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#00B0B0]/25 transition-all cursor-pointer"
            >
              Ingresar al Dashboard
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 text-xs text-[#5F7E7C] hover:text-[#181611] font-semibold transition-colors"
            >
              ← Volver a la portada de Planéa
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#F0EAE3] text-center">
            <span className="text-[11px] text-[#958677]">
              Acceso exclusivo para el equipo de Planéa Santa Cruz
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Clientes filtrados para la pestaña CRM
  const clientesCrmFiltrados = stats.crm.usuariosDetalle.filter(u => {
    const matchFiltro = filtroCrmEtiqueta === 'todos' || u.etiquetaCrm === filtroCrmEtiqueta;
    const matchTexto = !filtroTexto || 
      u.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      u.correo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (u.telefono && u.telefono.includes(filtroTexto));
    return matchFiltro && matchTexto;
  });

  return (
    <div className="min-h-screen bg-[#FCFBF6] pb-16">
      
      {/* Barra superior de administración */}
      <div className="bg-white border-b border-[#E9E5DF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-[#5F7E7C] hover:text-[#181611] hover:bg-[#FCFBF6] transition-colors"
              title="Volver a la portada"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#00B0B0] text-white flex items-center justify-center font-black text-sm">
                P
              </span>
              <div>
                <h1 className="font-heading font-black text-base text-[#181611] leading-none">
                  Planéa Admin
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-[#4EBAA4] font-bold uppercase tracking-wider">
                    Métricas & CRM · Santa Cruz
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Nube Activa (Multidispositivo)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 rounded-xl border border-[#DAD6D4] text-[#5F7E7C] hover:text-[#181611] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Restablecer datos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
            <button
              onClick={() => setAutenticado(false)}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Tabs de navegación con iconos */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'resumen', label: 'Resumen General', icono: Activity },
            { id: 'graficos', label: 'Análisis de Gráficos', icono: BarChart3 },
            { id: 'crm', label: `CRM Clientes (${stats.totalUsuarios})`, icono: UserCheck },
            { id: 'reservas', label: `Reservas (${stats.totalReservas})`, icono: CalendarCheck },
            { id: 'resenas', label: `Reseñas (${stats.totalResenas})`, icono: Star },
            { id: 'metricas', label: `Auditoría Clics (${stats.metricas.length})`, icono: MousePointer },
          ].map((tab) => {
            const Icon = tab.icono;
            const activa = tabActiva === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  activa
                    ? 'bg-[#00B0B0] text-white shadow-xs'
                    : 'bg-[#FCFBF6] hover:bg-[#E9E5DF] text-[#5F7E7C]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ================= TAB 1: RESUMEN GENERAL ================= */}
        {tabActiva === 'resumen' && (
          <div className="space-y-8">
            
            {/* TARJETAS PRINCIPALES CON SEPARACIÓN PLANÉA (10%) VS RESTAURANTES (90%) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Usuarios</span>
                  <Users className="w-4 h-4 text-[#00B0B0]" />
                </div>
                <p className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
                  {stats.totalUsuarios}
                </p>
                <p className="text-[11px] text-[#4EBAA4] font-semibold mt-1">
                  Registrados en total
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Total Reservas</span>
                  <CalendarCheck className="w-4 h-4 text-[#309A9E]" />
                </div>
                <p className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
                  {stats.totalReservas}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#5F7E7C] mt-1 font-medium">
                  <span className="text-emerald-600 font-bold">{stats.reservasConfirmadas} conf.</span>
                  <span>·</span>
                  <span className="text-amber-600 font-bold">{stats.reservasPendientes} pend.</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Volumen Total (GMV)</span>
                  <DollarSign className="w-4 h-4 text-[#958677]" />
                </div>
                <p className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
                  Bs {stats.volumenTotalGestionadoBs}
                </p>
                <p className="text-[11px] text-[#958677] mt-1">
                  Restaurantes: <strong className="text-[#181611]">Bs {stats.liquidacionRestaurantesBs} (90%)</strong>
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs">
                <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Comisión Planéa (10%)</span>
                  <Crown className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-700">
                  Bs {stats.ingresosPlaneaBs}
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  Ingreso neto Planéa
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-[#FCFBF6] border border-[#00B0B0]/40 shadow-xs col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-[#309A9E] text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Ticket Prom. Planéa</span>
                  <Award className="w-4 h-4 text-[#00B0B0]" />
                </div>
                <p className="font-heading font-black text-2xl sm:text-3xl text-[#00B0B0]">
                  Bs {stats.ticketPromedioPlaneaBs}
                </p>
                <p className="text-[10px] text-[#5F7E7C] mt-1">
                  Ticket total: <strong className="text-[#181611]">Bs {stats.ticketPromedioTotalBs}</strong>
                </p>
              </div>
            </div>

            {/* SECCIÓN DE CLICS ESPECÍFICOS REQUERIDOS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
              <h3 className="font-heading font-bold text-lg text-[#181611] mb-5 flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-[#00B0B0]" />
                <span>Métricas de Clics por Botón</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#5F7E7C] font-semibold mb-1">
                    <Compass className="w-3.5 h-3.5 text-[#00B0B0]" />
                    <span>“Arma tu plan”</span>
                  </div>
                  <p className="font-heading font-black text-2xl text-[#181611]">
                    {stats.clics.armaTuPlan}
                  </p>
                  <p className="text-[10px] text-[#958677]">Clics en portada</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#5F7E7C] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#4EBAA4]" />
                    <span>Ver Sugeridos</span>
                  </div>
                  <p className="font-heading font-black text-2xl text-[#181611]">
                    {stats.clics.verPlanesSugeridos || 0}
                  </p>
                  <p className="text-[10px] text-[#958677]">Filtros consultados</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#5F7E7C] font-semibold mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pago Realizado</span>
                  </div>
                  <p className="font-heading font-black text-2xl text-emerald-700">
                    {stats.clics.pagoRealizado || 0}
                  </p>
                  <p className="text-[10px] text-[#958677]">QR Confirmados</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#5F7E7C] font-semibold mb-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </div>
                  <p className="font-heading font-black text-2xl text-[#181611]">
                    {stats.clics.whatsapp}
                  </p>
                  <p className="text-[10px] text-[#958677]">Envíos al 78100777</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#5F7E7C] font-semibold mb-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reseñas</span>
                  </div>
                  <p className="font-heading font-black text-2xl text-[#181611]">
                    {stats.clics.resenas}
                  </p>
                  <p className="text-[10px] text-[#958677]">Opiniones enviadas</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                  <div className="flex items-center gap-1.5 text-xs text-[#5F7E7C] font-semibold mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#309A9E]" />
                    <span>Soporte</span>
                  </div>
                  <p className="font-heading font-black text-2xl text-[#181611]">
                    {stats.clics.soporte}
                  </p>
                  <p className="text-[10px] text-[#958677]">Llamadas / Ayuda</p>
                </div>
              </div>
            </div>

            {/* Acceso directo a Gráficos y CRM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => setTabActiva('graficos')}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#00B0B0]/10 to-[#4EBAA4]/15 border border-[#00B0B0]/30 hover:border-[#00B0B0] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 rounded-2xl bg-[#00B0B0] text-white">
                    <BarChart3 className="w-6 h-6" />
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-[#00B0B0] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h4 className="font-heading font-bold text-xl text-[#181611]">
                  Ver Análisis Completo de Gráficos
                </h4>
                <p className="text-xs text-[#5F7E7C] mt-1">
                  Embudo de conversión, distribución de reservas por zona de Santa Cruz y comparativa de ingresos por tipo de plan.
                </p>
              </div>

              <div 
                onClick={() => setTabActiva('crm')}
                className="p-6 rounded-3xl bg-gradient-to-br from-[#309A9E]/10 to-[#D3E6E8]/40 border border-[#309A9E]/30 hover:border-[#309A9E] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 rounded-2xl bg-[#309A9E] text-white">
                    <UserCheck className="w-6 h-6" />
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-[#309A9E] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
                <h4 className="font-heading font-bold text-xl text-[#181611]">
                  Abrir CRM y Fidelización de Clientes
                </h4>
                <p className="text-xs text-[#5F7E7C] mt-1">
                  Directorio de clientes, etiquetas VIP, historial de reservas, notas internas y contacto directo por WhatsApp.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: ANÁLISIS DE GRÁFICOS (SOLICITADO) ================= */}
        {tabActiva === 'graficos' && (
          <div className="space-y-8">
            
            {/* 1. EMBUDO DE CONVERSIÓN (FUNNEL) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-[#181611] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#00B0B0]" />
                    <span>Embudo de Conversión (Funnel de Planéa)</span>
                  </h3>
                  <p className="text-xs text-[#5F7E7C] mt-0.5">
                    Rendimiento del flujo desde que visitan la web hasta que completan el pago con QR y confirman.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D3E6E8] text-[#309A9E] self-start sm:self-auto">
                  {stats.totalReservas > 0 ? `${Math.round((stats.reservasConfirmadas / stats.totalReservas) * 100)}% efectividad` : '100% efectividad'}
                </span>
              </div>

              <div className="space-y-4">
                {stats.funnel.map((etapa, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#181611] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FCFBF6] border border-[#DAD6D4] text-[10px] flex items-center justify-center font-bold text-[#5F7E7C]">
                          {idx + 1}
                        </span>
                        {etapa.etapa}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#181611]">{etapa.valor}</span>
                        <span className="text-[#958677] text-[11px]">({etapa.porcentaje}%)</span>
                      </div>
                    </div>
                    {/* Barra de progreso */}
                    <div className="h-4 bg-[#FCFBF6] border border-[#E9E5DF] rounded-xl overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-lg transition-all duration-700 ${
                          idx === 0 ? 'bg-[#73ADB9]' :
                          idx === 1 ? 'bg-[#309A9E]' :
                          idx === 2 ? 'bg-[#00B0B0]' :
                          idx === 3 ? 'bg-[#4EBAA4]' :
                          'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.max(8, etapa.porcentaje)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. GRÁFICO POR ZONA EN SANTA CRUZ Y POR TIPO DE PLAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Zonas de Santa Cruz */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
                <h3 className="font-heading font-bold text-lg text-[#181611] mb-2 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#00B0B0]" />
                  <span>Reservas por Zona de Santa Cruz</span>
                </h3>
                <p className="text-xs text-[#5F7E7C] mb-6">
                  Zonas con mayor demanda de salidas y reservas en la ciudad.
                </p>

                <div className="space-y-3.5">
                  {Object.entries(stats.reservasPorZona).map(([zona, cantidad]) => {
                    const pct = Math.round((cantidad / (stats.totalReservas || 1)) * 100);
                    return (
                      <div key={zona}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-[#181611]">📍 {zona}</span>
                          <span className="font-mono font-bold text-[#00B0B0]">{cantidad} ({pct}%)</span>
                        </div>
                        <div className="h-2.5 bg-[#FCFBF6] rounded-full overflow-hidden border border-[#E9E5DF]">
                          <div 
                            className="h-full bg-gradient-to-r from-[#00B0B0] to-[#4EBAA4] rounded-full"
                            style={{ width: `${Math.max(6, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ingresos por Tipo de Actividad con desglose Planéa vs Restaurante */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-heading font-bold text-lg text-[#181611] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#309A9E]" />
                    <span>Facturación por Tipo de Plan (Bs)</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    10% Planéa · 90% Restaurante
                  </span>
                </div>
                <p className="text-xs text-[#5F7E7C] mb-6">
                  Separación de la ganancia neta para Planéa frente a lo que se liquida a los restaurantes.
                </p>

                <div className="space-y-4">
                  {Object.entries(stats.ingresosPorTipo).map(([tipo, data]) => {
                    const totalPlan = typeof data === 'object' ? data.totalBs : data;
                    const planeaPlan = typeof data === 'object' ? data.planeaBs : Math.round(totalPlan * 0.10);
                    const restPlan = typeof data === 'object' ? data.restauranteBs : totalPlan - planeaPlan;
                    const pct = Math.round((totalPlan / (stats.volumenTotalGestionadoBs || 1)) * 100);

                    const emojis: Record<string, string> = {
                      cena: '🍷',
                      brunch: '🥐',
                      cita: '🕯️',
                      fiesta: '🪩',
                      deporte: '🎾',
                      recreativo: '🎨'
                    };
                    return (
                      <div key={tipo} className="p-3 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-[#181611] capitalize">
                            {emojis[tipo] || '✨'} {tipo}
                          </span>
                          <span className="font-mono font-bold text-[#181611]">
                            Total: Bs {totalPlan} <span className="text-[10px] text-[#958677]">({pct}%)</span>
                          </span>
                        </div>

                        {/* Desglose Restaurante vs Planéa */}
                        <div className="flex items-center justify-between text-[11px] mb-2 text-[#5F7E7C]">
                          <span>🍽️ Restaurante (90%): <strong className="text-[#181611]">Bs {restPlan}</strong></span>
                          <span>💎 Planéa (10%): <strong className="text-emerald-700 font-bold">Bs {planeaPlan}</strong></span>
                        </div>

                        {/* Barra compuesta */}
                        <div className="h-2.5 bg-[#E9E5DF] rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-[#309A9E] transition-all"
                            style={{ width: `${Math.max(5, pct * 0.90)}%` }}
                            title="Restaurante 90%"
                          />
                          <div 
                            className="h-full bg-emerald-500 transition-all"
                            style={{ width: `${Math.max(2, pct * 0.10)}%` }}
                            title="Comisión Planéa 10%"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 3. EVOLUCIÓN DIARIA COMPARATIVA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
              <h3 className="font-heading font-bold text-lg text-[#181611] mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Actividad Diaria Registrada</span>
              </h3>
              <p className="text-xs text-[#5F7E7C] mb-6">
                Comparativa de nuevos usuarios y reservas generadas por fecha.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(stats.reservasPorDia).map(([dia, count]) => (
                  <div key={dia} className="p-3.5 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF] text-center">
                    <span className="text-[10px] text-[#958677] block font-medium truncate">{dia}</span>
                    <span className="font-heading font-black text-xl text-[#00B0B0] block my-1">{count}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">reservas</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: CRM DE CLIENTES (SOLICITADO) ================= */}
        {tabActiva === 'crm' && (
          <div className="space-y-6">
            
            {/* KPI CARDS DEL CRM */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Clientes Totales</span>
                  <Users className="w-4 h-4 text-[#00B0B0]" />
                </div>
                <p className="font-heading font-black text-3xl text-[#181611]">
                  {stats.crm.usuariosDetalle.length}
                </p>
                <p className="text-[11px] text-[#4EBAA4] font-semibold mt-1">Base de datos de Planéa</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Clientes VIP</span>
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <p className="font-heading font-black text-3xl text-amber-500">
                  {stats.crm.clientesVip}
                </p>
                <p className="text-[11px] text-[#958677] font-semibold mt-1">Alta fidelidad y consumo</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Tasa de Repetición</span>
                  <RefreshCw className="w-4 h-4 text-[#309A9E]" />
                </div>
                <p className="font-heading font-black text-3xl text-[#309A9E]">
                  {stats.crm.tasaRecurrencia}%
                </p>
                <p className="text-[11px] text-[#958677] font-semibold mt-1">Clientes con 2+ reservas</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>LTV Ganancia Planéa (10%)</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-heading font-black text-3xl text-emerald-700">
                  Bs {stats.crm.ltvPlaneaPromedioBs}
                </p>
                <p className="text-[11px] text-[#958677] font-semibold mt-1">
                  Gasto total cliente: <strong className="text-[#181611]">Bs {stats.crm.ltvPromedioBs}</strong>
                </p>
              </div>
            </div>

            {/* BARRA DE FILTROS CRM Y BÚSQUEDA */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E9E5DF] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#958677] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, correo o teléfono..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-[#FCFBF6] border border-[#DAD6D4] text-xs font-semibold text-[#181611] focus:border-[#00B0B0] outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-bold text-[#5F7E7C] mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Filtrar:
                </span>
                {(['todos', 'vip', 'frecuente', 'nuevo', 'inactivo'] as const).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFiltroCrmEtiqueta(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      filtroCrmEtiqueta === tag
                        ? 'bg-[#181611] text-white'
                        : 'bg-[#FCFBF6] text-[#5F7E7C] hover:bg-[#E9E5DF]'
                    }`}
                  >
                    {tag === 'todos' ? 'Todos' : tag}
                  </button>
                ))}
              </div>

            </div>

            {/* TABLA DETALLADA DEL CRM */}
            <div className="bg-white rounded-3xl border border-[#E9E5DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#5F7E7C] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Cliente</th>
                      <th className="py-3.5 px-3">Segmento</th>
                      <th className="py-3.5 px-3">Reservas</th>
                      <th className="py-3.5 px-3">Gasto Total</th>
                      <th className="py-3.5 px-3">Comisión Planéa (10%)</th>
                      <th className="py-3.5 px-3">Puntos Planéa</th>
                      <th className="py-3.5 px-4">Notas Internas CRM</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {clientesCrmFiltrados.map((cliente) => {
                      const notaActual = notasEditando[cliente.id] !== undefined 
                        ? notasEditando[cliente.id] 
                        : (cliente.notasCrm || '');

                      const telefonoWa = cliente.telefono?.replace(/\D/g, '') || '59178100777';
                      const msgWa = encodeURIComponent(`Hola ${cliente.nombre}, te saludamos desde Planéa Santa Cruz. ¡Gracias por confiar en nosotros para organizar tus planes!`);

                      return (
                        <tr key={cliente.id} className="hover:bg-[#FCFBF6] transition-colors">
                          
                          {/* Cliente */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#00B0B0]/20 text-[#00B0B0] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {cliente.nombre.slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-bold text-[#181611] block leading-tight">{cliente.nombre}</span>
                                <span className="text-[11px] text-[#958677]">{cliente.correo}</span>
                                {cliente.telefono && (
                                  <span className="text-[10px] text-[#309A9E] block font-mono">📱 {cliente.telefono}</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Segmento */}
                          <td className="py-3.5 px-3">
                            <select
                              value={cliente.etiquetaCrm || 'nuevo'}
                              onChange={(e) => handleCambiarEtiquetaCrm(cliente.id, e.target.value as any)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                                cliente.etiquetaCrm === 'vip' 
                                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                  : cliente.etiquetaCrm === 'frecuente'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : cliente.etiquetaCrm === 'inactivo'
                                  ? 'bg-gray-100 text-gray-600 border-gray-300'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              <option value="nuevo">Nuevo</option>
                              <option value="frecuente">Frecuente</option>
                              <option value="vip">⭐ VIP</option>
                              <option value="inactivo">Inactivo</option>
                            </select>
                          </td>

                          {/* Reservas */}
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-[#181611]">{cliente.totalReservas} reservas</span>
                            {cliente.reservasCanceladas > 0 && (
                              <span className="text-[10px] text-red-500 block">({cliente.reservasCanceladas} canc.)</span>
                            )}
                          </td>

                          {/* Total gastado (GMV) */}
                          <td className="py-3.5 px-3">
                            <span className="font-mono font-bold text-[#181611]">
                              Bs {cliente.totalGastadoBs}
                            </span>
                            <span className="text-[10px] text-[#958677] block">Gasto cliente</span>
                          </td>

                          {/* Comisión Planéa 10% */}
                          <td className="py-3.5 px-3">
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 inline-block">
                              + Bs {cliente.comisionGeneradaPlaneaBs || Math.round(cliente.totalGastadoBs * 0.10)}
                            </span>
                          </td>

                          {/* Puntos y Evento Gratis */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1 font-bold text-[#00B0B0]">
                              <Award className="w-3.5 h-3.5" />
                              <span>{cliente.puntos || 0}/10 pts</span>
                            </div>
                            <span className="text-[10px] text-[#958677]">
                              {cliente.puntos >= 10 ? '🎁 ¡Evento gratis listo!' : `Faltan ${10 - (cliente.puntos || 0)}`}
                            </span>
                          </td>

                          {/* Notas CRM */}
                          <td className="py-3.5 px-4 min-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                placeholder="Escribe nota del cliente..."
                                value={notaActual}
                                onChange={(e) => setNotasEditando({ ...notasEditando, [cliente.id]: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#DAD6D4] text-xs text-[#181611] focus:border-[#00B0B0] outline-none"
                              />
                              {notasEditando[cliente.id] !== undefined && notasEditando[cliente.id] !== (cliente.notasCrm || '') && (
                                <button
                                  type="button"
                                  onClick={() => handleGuardarNotaCrm(cliente.id)}
                                  className="p-1.5 rounded-lg bg-[#00B0B0] text-white hover:bg-[#309A9E] transition-colors"
                                  title="Guardar nota"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Acciones */}
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={`https://wa.me/${telefonoWa}?text=${msgWa}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: RESERVAS ================= */}
        {tabActiva === 'reservas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#181611]">
                Gestión de Reservas ({stats.totalReservas})
              </h3>
            </div>

            <div className="bg-white rounded-3xl border border-[#E9E5DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#5F7E7C] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Código</th>
                      <th className="py-3 px-3">Cliente</th>
                      <th className="py-3 px-3">Plan</th>
                      <th className="py-3 px-3">Fecha y Hora</th>
                      <th className="py-3 px-3">Personas</th>
                      <th className="py-3 px-3">Total (100%)</th>
                      <th className="py-3 px-3">Restaurante (90%)</th>
                      <th className="py-3 px-3">Planéa (10%)</th>
                      <th className="py-3 px-3">Pago QR</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {stats.reservas.map((res) => {
                      const totalMonto = res.montoEstimado || 0;
                      const planeaComision = Math.round(totalMonto * 0.10);
                      const restNeto = totalMonto - planeaComision;

                      return (
                        <tr key={res.id} className="hover:bg-[#FCFBF6] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#00B0B0]">{res.id}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#181611] block">{res.nombreUsuario}</span>
                            <span className="text-[10px] text-[#958677]">{res.correo}</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#181611]">{res.planSeleccionado}</td>
                          <td className="py-3 px-3">{res.fecha} · {res.hora} hrs</td>
                          <td className="py-3 px-3 font-semibold">{res.numeroPersonas} pers</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#181611]">Bs {totalMonto}</td>
                          <td className="py-3 px-3 font-mono text-[#5F7E7C]">Bs {restNeto}</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                            + Bs {planeaComision}
                          </td>
                          <td className="py-3 px-3">
                            {res.pagoRealizado ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ✓ Pagado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              res.estado === 'confirmada' ? 'bg-emerald-100 text-emerald-800' :
                              res.estado === 'pendiente' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {res.estado.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {res.estado !== 'confirmada' && (
                                <button
                                  onClick={() => handleCambiarEstado(res.id, 'confirmada')}
                                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold"
                                >
                                  Confirmar
                                </button>
                              )}
                              {res.estado !== 'cancelada' && (
                                <button
                                  onClick={() => handleCambiarEstado(res.id, 'cancelada')}
                                  className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-bold"
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: RESEÑAS ================= */}
        {tabActiva === 'resenas' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#181611]">
              Moderación de Reseñas ({stats.totalResenas})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.resenas.map((r) => (
                <div key={r.id} className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-[#181611] block">{r.nombreUsuario}</span>
                        <span className="text-[11px] text-[#5F7E7C]">{r.planReservado} · {r.fecha}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < r.calificacion ? 'fill-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#181611] italic bg-[#FCFBF6] p-3 rounded-2xl border border-[#F0EAE3]">
                      "{r.comentario}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0EAE3] flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.aprobada ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {r.aprobada ? 'Visible en Portada' : 'Oculta'}
                    </span>

                    <button
                      onClick={() => handleToggleResena(r.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                        r.aprobada ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {r.aprobada ? 'Ocultar' : 'Aprobar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: AUDITORÍA DE CLICS ================= */}
        {tabActiva === 'metricas' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#181611]">
              Registro de Eventos y Clics ({stats.metricas.length})
            </h3>

            <div className="bg-white rounded-3xl border border-[#E9E5DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#5F7E7C] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-3">Tipo de Evento</th>
                      <th className="py-3 px-3">Botón / Acción</th>
                      <th className="py-3 px-3">Página</th>
                      <th className="py-3 px-4">Detalles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {stats.metricas.slice(0, 50).map((m) => (
                      <tr key={m.id} className="hover:bg-[#FCFBF6]">
                        <td className="py-2.5 px-4 font-mono text-[11px] text-[#958677]">
                          {m.fechaHora.split('T')[1]?.slice(0, 8)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E]">
                            {m.tipoEvento}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#181611]">{m.nombreBotonAccion}</td>
                        <td className="py-2.5 px-3 text-[#958677]">{m.pagina}</td>
                        <td className="py-2.5 px-4 text-[#5F7E7C] text-[11px] truncate max-w-xs">
                          {m.infoAdicional || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
