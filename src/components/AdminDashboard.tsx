import React, { useState, useEffect } from 'react';
import { 
  getEstadisticasDashboard, 
  actualizarEstadoReserva, 
  toggleAprobacionResena, 
  actualizarCrmUsuario,
  actualizarEstadoRecordatorio,
  crearUsuarioManual,
  resetearDatosDemo 
} from '../services/storage';
import { EstadoReserva, Usuario } from '../types';
import { 
  Shield, 
  Lock, 
  Users, 
  UserPlus,
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
  Award,
  Target,
  Trophy,
  Utensils,
  Share2,
  MessageSquare,
  Bell,
  Coins,
  Send,
  HelpCircle,
  ThumbsUp,
  Mail
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

// ----------------- COMPONENTE: GRÁFICO DE LÍNEAS SEMANAL (SVG) -----------------
const GraficoLineasSemanal: React.FC<{
  datos: Array<{ diaLabel: string; fecha: string; reservas: number; usuarios: number; ingresosBs: number }>;
}> = ({ datos }) => {
  const datosSeguros = datos || [];
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxVal = Math.max(...datosSeguros.map(d => Math.max(d.reservas || 0, d.usuarios || 0)), 5);
  const width = 640;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;
  const plotW = width - paddingX * 2;
  const plotH = height - paddingY * 2;

  const pointsReservas = datosSeguros.map((d, i) => {
    const x = paddingX + (i / Math.max(datosSeguros.length - 1, 1)) * plotW;
    const y = height - paddingY - ((d.reservas || 0) / maxVal) * plotH;
    return { x, y, ...d };
  });

  const pointsUsuarios = datosSeguros.map((d, i) => {
    const x = paddingX + (i / Math.max(datosSeguros.length - 1, 1)) * plotW;
    const y = height - paddingY - ((d.usuarios || 0) / maxVal) * plotH;
    return { x, y, ...d };
  });

  const pathReservas = pointsReservas.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const areaReservas = pointsReservas.length > 0
    ? `${pathReservas} L ${pointsReservas[pointsReservas.length - 1].x} ${height - paddingY} L ${pointsReservas[0].x} ${height - paddingY} Z`
    : '';

  const pathUsuarios = pointsUsuarios.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00B0B0]" />
            <span className="font-bold text-[#181611]">Reservas Realizadas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="font-bold text-[#5F7E7C]">Usuarios Registrados</span>
          </div>
        </div>
        <span className="text-[11px] text-[#958677] font-medium bg-[#FCFBF6] px-2.5 py-1 rounded-lg border border-[#E9E5DF]">
          Últimos 7 días · Santa Cruz
        </span>
      </div>

      <div className="relative w-full overflow-x-auto pb-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52 sm:h-60 select-none">
          <defs>
            <linearGradient id="areaGradientReservas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00B0B0" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#00B0B0" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines horizontales */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingY + plotH * (1 - ratio);
            const valor = Math.round(maxVal * ratio);
            return (
              <g key={idx}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#E9E5DF" strokeDasharray="3 3" />
                <text x={paddingX - 10} y={y + 3} textAnchor="end" fontSize="9" fill="#958677" fontWeight="bold">
                  {valor}
                </text>
              </g>
            );
          })}

          {/* Área sombreada Reservas */}
          {areaReservas && <path d={areaReservas} fill="url(#areaGradientReservas)" />}

          {/* Línea Usuarios Registrados */}
          {pathUsuarios && (
            <path
              d={pathUsuarios}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Línea Reservas */}
          {pathReservas && (
            <path
              d={pathReservas}
              fill="none"
              stroke="#00B0B0"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Puntos y tooltips */}
          {pointsReservas.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              className="cursor-pointer"
            >
              {/* Eje X Label */}
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5F7E7C">
                {p.diaLabel}
              </text>
              {/* Círculo usuario */}
              <circle
                cx={pointsUsuarios[i].x}
                cy={pointsUsuarios[i].y}
                r={hoverIdx === i ? 5 : 3.5}
                fill="#FFFFFF"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              {/* Círculo reserva */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIdx === i ? 6.5 : 4.5}
                fill="#FFFFFF"
                stroke="#00B0B0"
                strokeWidth="2.5"
              />
            </g>
          ))}
        </svg>

        {hoverIdx !== null && datos[hoverIdx] && (
          <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#E9E5DF] shadow-md text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-[#181611]">📅 {datos[hoverIdx].diaLabel}</span>
            <div className="flex items-center gap-3">
              <span className="text-[#00B0B0] font-bold">🟢 {datos[hoverIdx].reservas} reservas</span>
              <span className="text-[#F59E0B] font-bold">🟡 {datos[hoverIdx].usuarios} nuevos usuarios</span>
              <span className="text-emerald-700 font-bold font-mono">Bs {datos[hoverIdx].ingresosBs} volumen</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState(false);
  const [tabActiva, setTabActiva] = useState<'resumen' | 'graficos' | 'crm' | 'reservas' | 'encuestas' | 'recordatorios' | 'resenas' | 'metricas'>('resumen');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCrmEtiqueta, setFiltroCrmEtiqueta] = useState<'todos' | 'vip' | 'frecuente' | 'nuevo' | 'inactivo'>('todos');
  const [notasEditando, setNotasEditando] = useState<Record<string, string>>({});
  const [version, setVersion] = useState(0); // Para forzar re-render

  // Modal para agregar nuevo cliente/perfil desde CRM
  const [modalNuevoPerfil, setModalNuevoPerfil] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevoEtiqueta, setNuevoEtiqueta] = useState<'nuevo' | 'frecuente' | 'vip' | 'inactivo'>('nuevo');
  const [nuevoNotas, setNuevoNotas] = useState('');
  const [errorNuevoPerfil, setErrorNuevoPerfil] = useState<string | null>(null);
  const [exitoNuevoPerfil, setExitoNuevoPerfil] = useState<string | null>(null);

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

  const handleCambiarEstadoRecordatorio = (id: string, nuevoEstado: 'pendiente' | 'enviado' | 'fallido') => {
    actualizarEstadoRecordatorio(id, nuevoEstado);
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

  const handleCrearNuevoCliente = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNuevoPerfil(null);
    setExitoNuevoPerfil(null);

    const nomLimpio = nuevoNombre.trim();
    const corrLimpio = nuevoCorreo.trim().toLowerCase();

    if (!nomLimpio) {
      setErrorNuevoPerfil('Por favor ingresa el nombre del cliente.');
      return;
    }

    if (!corrLimpio || !corrLimpio.includes('@') || !corrLimpio.includes('.')) {
      setErrorNuevoPerfil('Por favor ingresa un correo electrónico válido.');
      return;
    }

    try {
      crearUsuarioManual({
        nombre: nomLimpio,
        correo: corrLimpio,
        telefono: nuevoTelefono.trim() || undefined,
        etiquetaCrm: nuevoEtiqueta,
        notasCrm: nuevoNotas.trim() || undefined
      });

      setExitoNuevoPerfil('¡Perfil registrado y sincronizado exitosamente!');
      setTimeout(() => {
        setModalNuevoPerfil(false);
        setNuevoNombre('');
        setNuevoCorreo('');
        setNuevoTelefono('');
        setNuevoNotas('');
        setNuevoEtiqueta('nuevo');
        setExitoNuevoPerfil(null);
        setVersion(v => v + 1);
      }, 700);
    } catch (err) {
      console.error(err);
      setErrorNuevoPerfil('Error al registrar el perfil. Intenta nuevamente.');
    }
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
            { id: 'encuestas', label: `Encuestas App (${stats.encuestas?.total || 0})`, icono: MessageSquare },
            { id: 'recordatorios', label: `Recordatorios (${stats.recordatorios?.total || 0})`, icono: Bell },
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
            
            {/* TARJETAS KPI PRINCIPALES (6 MÉTRICAS CLAVE SOLICITADAS) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              
              {/* 1. Usuarios Registrados */}
              <div className="p-4 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#5F7E7C] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Usuarios</span>
                  <Users className="w-4 h-4 text-[#00B0B0]" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
                    {stats.totalUsuarios}
                  </p>
                  <p className="text-[10px] text-[#4EBAA4] font-bold mt-0.5">
                    {stats.usuariosQueReservaronCount} activos con reservas
                  </p>
                </div>
              </div>

              {/* 2. Cantidad de Reservas */}
              <div className="p-4 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#5F7E7C] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Reservas</span>
                  <CalendarCheck className="w-4 h-4 text-[#309A9E]" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
                    {stats.totalReservas}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    {stats.reservasConfirmadas} conf. · {stats.reservasPendientes} pend.
                  </p>
                </div>
              </div>

              {/* 3. Tasa de Retención (usuarios que reservaron / usuarios registrados) */}
              <div className="p-4 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#5F7E7C] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Tasa Retención</span>
                  <Target className="w-4 h-4 text-[#00B0B0]" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#00B0B0]">
                    {stats.tasaRetencion}%
                  </p>
                  <p className="text-[10px] text-[#5F7E7C] font-medium mt-0.5">
                    {stats.usuariosQueReservaronCount} de {stats.totalUsuarios} usuarios
                  </p>
                </div>
              </div>

              {/* 4. Clics en Botones Importantes */}
              <div className="p-4 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#5F7E7C] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Clicks Clave</span>
                  <MousePointer className="w-4 h-4 text-[#958677]" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
                    {stats.clics.total}
                  </p>
                  <p className="text-[10px] text-[#958677] font-medium mt-0.5">
                    Acciones auditadas
                  </p>
                </div>
              </div>

              {/* 5. Reseñas y Calificación Promedio */}
              <div className="p-4 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[#5F7E7C] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Rating Lugares</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-amber-500">
                    ★ {stats.promedioCalificacion}
                  </p>
                  <p className="text-[10px] text-[#958677] font-medium mt-0.5">
                    {stats.totalResenas} opiniones de comensales
                  </p>
                </div>
              </div>

              {/* 6. Comisión Planéa (15% sobre pago de reserva del 50%) */}
              <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <span>Comisión Planéa (15%)</span>
                  <Crown className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-700">
                    Bs {stats.comisionPlaneaBs}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                    Reservas: Bs {stats.totalCobradoReservasBs} · Total: Bs {stats.volumenTotalGestionadoBs}
                  </p>
                </div>
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

        {/* ================= TAB 2: ANÁLISIS DE GRÁFICOS Y COMPORTAMIENTO (SOLICITADO) ================= */}
        {tabActiva === 'graficos' && (
          <div className="space-y-8">
            
            {/* 1. GRÁFICO DE LÍNEAS INTERACTIVO: RESERVAS Y USUARIOS POR DÍA / SEMANA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-[#181611] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#00B0B0]" />
                    <span>Evolución Temporal de Reservas y Usuarios</span>
                  </h3>
                  <p className="text-xs text-[#5F7E7C] mt-0.5">
                    Gráfico cronológico de reservas generadas vs nuevos registros en la última semana.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🟢 {stats.totalReservas} reservas acumuladas
                  </span>
                </div>
              </div>

              {/* Render del SVG Interactivo de Líneas */}
              <GraficoLineasSemanal datos={stats.serieUltimos7Dias} />

              {/* Tarjetas resumen por día */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-6 pt-6 border-t border-[#F0EAE3]">
                {stats.serieUltimos7Dias.map((d, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF] text-center hover:border-[#00B0B0] transition-colors">
                    <span className="text-[10px] text-[#958677] font-semibold block">{d.diaLabel}</span>
                    <span className="font-heading font-black text-lg text-[#00B0B0] block my-0.5">{d.reservas}</span>
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#5F7E7C]">
                      <span>{d.usuarios} usrs</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-700 font-bold">Bs {d.ingresosBs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. GRÁFICO DE BARRAS POR CATEGORÍA */}
            <div className="w-full">
              {/* Gráfico de Barras: Reservas por Categoría (Cena, Brunch, Cita, Fiesta, Deporte, Recreativo) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-heading font-bold text-lg text-[#181611] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#309A9E]" />
                    <span>Reservas por Categoría de Plan</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E]">
                    6 Categorías
                  </span>
                </div>
                <p className="text-xs text-[#5F7E7C] mb-6">
                  Distribución de demanda entre cena, brunch, cita, fiesta, deporte y recreativo en Santa Cruz de la Sierra.
                </p>

                {/* Barras verticales / horizontales estilizadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { id: 'cena', label: 'Cena', emoji: '🍷', color: 'from-[#00B0B0] to-[#309A9E]' },
                    { id: 'brunch', label: 'Brunch', emoji: '🥐', color: 'from-amber-500 to-amber-600' },
                    { id: 'cita', label: 'Cita Romántica', emoji: '🕯️', color: 'from-rose-500 to-rose-600' },
                    { id: 'fiesta', label: 'Fiesta & Noche', emoji: '🪩', color: 'from-purple-500 to-indigo-600' },
                    { id: 'deporte', label: 'Deporte & Activo', emoji: '🎾', color: 'from-emerald-500 to-teal-600' },
                    { id: 'recreativo', label: 'Recreativo & Arte', emoji: '🎨', color: 'from-sky-500 to-blue-600' }
                  ].map((cat) => {
                    const cantidad = stats.reservasPorTipo[cat.id] || 0;
                    const pct = Math.round((cantidad / (stats.totalReservas || 1)) * 100);
                    const infoIngreso = stats.ingresosPorTipo[cat.id] || { totalBs: 0, planeaBs: 0 };

                    return (
                      <div key={cat.id} className="p-3.5 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF]">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-[#181611] flex items-center gap-1.5">
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[#181611]">
                              {cantidad} <span className="text-[10px] text-[#958677] font-normal">reservas</span>
                            </span>
                            <span className="text-[11px] font-bold text-[#309A9E]">({pct}%)</span>
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="h-2.5 bg-[#E9E5DF] rounded-full overflow-hidden mb-1.5">
                          <div 
                            className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(4, pct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-[#958677]">
                          <span>Volumen: <strong className="text-[#181611]">Bs {infoIngreso.totalBs}</strong></span>
                          <span>Comisión Planéa: <strong className="text-emerald-700">Bs {infoIngreso.planeaBs}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. RANKING DE LOS LUGARES MÁS RESERVADOS & RESERVAS POR ZONA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Ranking de Lugares Más Reservados (2 Columnas) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-heading font-bold text-lg text-[#181611] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Ranking de Lugares Más Reservados en Santa Cruz</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Top Lugares
                  </span>
                </div>
                <p className="text-xs text-[#5F7E7C] mb-6">
                  Restaurantes, rooftops y espacios con mayor volumen de reservas y preferencia del público.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#5F7E7C] uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Lugar / Establecimiento</th>
                        <th className="py-2.5 px-3">Zona</th>
                        <th className="py-2.5 px-3 text-center">Reservas</th>
                        <th className="py-2.5 px-3">Total Generado</th>
                        <th className="py-2.5 px-3">Planéa (15%)</th>
                        <th className="py-2.5 px-3 text-right">Calificación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EAE3]">
                      {(stats.rankingLugares || []).slice(0, 7).map((lugar: any, idx: number) => {
                        const medallas = ['🥇', '🥈', '🥉'];
                        const esTop3 = idx < 3;
                        return (
                          <tr key={lugar.nombre ? `${lugar.nombre}-${idx}` : `top-${idx}`} className="hover:bg-[#FCFBF6] transition-colors">
                            <td className="py-3 px-3 font-bold text-sm">
                              {medallas[idx] || <span className="text-[#958677] text-xs font-mono ml-1">{idx + 1}</span>}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{lugar.emoji || '🍽️'}</span>
                                <div>
                                  <span className="font-bold text-[#181611] block leading-tight">{lugar.nombre}</span>
                                  <span className="text-[10px] text-[#958677] capitalize">{lugar.tipo}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-md bg-[#FCFBF6] border border-[#E9E5DF] text-[10px] font-semibold text-[#5F7E7C]">
                                📍 {lugar.zona}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${
                                esTop3 ? 'bg-[#00B0B0]/15 text-[#00B0B0]' : 'bg-gray-100 text-[#181611]'
                              }`}>
                                {lugar.reservasCount}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-[#181611]">
                              Bs {lugar.volumenBs}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                              + Bs {lugar.gananciaPlaneaBs}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                                ★ {lugar.rating || 4.9}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reservas por Zona de Santa Cruz (1 Columna) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#181611] mb-1 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#00B0B0]" />
                    <span>Reservas por Zona</span>
                  </h3>
                  <p className="text-xs text-[#5F7E7C] mb-5">
                    Zonas con mayor demanda de salidas en Santa Cruz.
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
                              className="h-full bg-gradient-to-r from-[#00B0B0] to-[#4EBAA4] rounded-full transition-all"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F0EAE3] text-center">
                  <span className="text-[11px] text-[#958677]">
                    Zona con mayor ticket promedio: <strong className="text-[#181611]">Equipetrol & Urubó</strong>
                  </span>
                </div>
              </div>

            </div>

            {/* 4. EMBUDO Y RETENCIÓN VISUAL: REGISTRO → BÚSQUEDA → CLICK → RESERVA → RESEÑA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-[#181611] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#00B0B0]" />
                    <span>Embudo y Retención de Usuarios</span>
                  </h3>
                  <p className="text-xs text-[#5F7E7C] mt-0.5">
                    Flujo de retención y comportamiento: Registro ➔ Búsqueda ➔ Click en Plan ➔ Reserva ➔ Reseña.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D3E6E8] text-[#309A9E]">
                    Tasa de Retención: {stats.tasaRetencion}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {stats.funnelCompleto.map((paso: any, idx: number) => {
                  const colores = ['bg-[#309A9E]', 'bg-[#00B0B0]', 'bg-[#4EBAA4]', 'bg-emerald-600', 'bg-amber-500'];
                  const iconos = ['👤', '🔍', '👆', '📅', '⭐'];

                  return (
                    <div 
                      key={paso.etapa ? `${paso.etapa}-${idx}` : `funnel-${idx}`} 
                      className="p-4 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF] relative flex flex-col justify-between hover:border-[#00B0B0] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{iconos[idx]}</span>
                          <span className="w-6 h-6 rounded-full bg-white border border-[#E9E5DF] text-[11px] font-bold text-[#5F7E7C] flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#181611] leading-tight mb-1">
                          {paso.etapa}
                        </h4>
                        <p className="text-[10px] text-[#958677] mb-3">
                          {paso.descripcion}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="font-heading font-black text-2xl text-[#181611]">
                            {paso.valor}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#00B0B0]">
                            {paso.porcentaje}%
                          </span>
                        </div>

                        <div className="h-2 bg-[#E9E5DF] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colores[idx]} rounded-full transition-all duration-700`}
                            style={{ width: `${Math.max(8, paso.porcentaje)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  <span>Comisión Planéa (15% s/reserva)</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-heading font-black text-3xl text-emerald-700">
                  Bs {stats.comisionPlaneaBs}
                </p>
                <p className="text-[11px] text-[#958677] font-semibold mt-1">
                  Cobrado en reservas: <strong className="text-[#181611]">Bs {stats.totalCobradoReservasBs}</strong>
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

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
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

                <button
                  onClick={() => {
                    setErrorNuevoPerfil(null);
                    setExitoNuevoPerfil(null);
                    setModalNuevoPerfil(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#00B0B0] hover:bg-[#309A9E] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ml-auto"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Nuevo Perfil / Cliente</span>
                </button>
              </div>

            </div>

            {/* Modal para Crear Nuevo Perfil en CRM */}
            {modalNuevoPerfil && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                <div 
                  className="w-full max-w-md bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] p-6 space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DF]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#00B0B0]/20 text-[#00B0B0] flex items-center justify-center">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-base text-[#181611]">
                          Registrar Nuevo Perfil
                        </h4>
                        <p className="text-[11px] text-[#5F7E7C]">
                          Se agregará al CRM y se sincronizará con Firestore
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalNuevoPerfil(false)}
                      className="p-1 rounded-full text-[#958677] hover:bg-[#E9E5DF]"
                    >
                      ✕
                    </button>
                  </div>

                  {errorNuevoPerfil && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                      {errorNuevoPerfil}
                    </div>
                  )}

                  {exitoNuevoPerfil && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      {exitoNuevoPerfil}
                    </div>
                  )}

                  <form onSubmit={handleCrearNuevoCliente} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#181611] uppercase mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Rodrigo Aguilera"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DAD6D4] text-xs font-medium focus:border-[#00B0B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181611] uppercase mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rodrigo@ejemplo.com"
                        value={nuevoCorreo}
                        onChange={(e) => setNuevoCorreo(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DAD6D4] text-xs font-medium focus:border-[#00B0B0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181611] uppercase mb-1">
                        Teléfono / WhatsApp (Santa Cruz)
                      </label>
                      <input
                        type="tel"
                        placeholder="78100777"
                        value={nuevoTelefono}
                        onChange={(e) => setNuevoTelefono(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DAD6D4] text-xs font-medium focus:border-[#00B0B0] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-[#181611] uppercase mb-1">
                          Segmento Inicial
                        </label>
                        <select
                          value={nuevoEtiqueta}
                          onChange={(e) => setNuevoEtiqueta(e.target.value as any)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DAD6D4] text-xs font-bold outline-none"
                        >
                          <option value="nuevo">Nuevo</option>
                          <option value="frecuente">Frecuente</option>
                          <option value="vip">⭐ VIP</option>
                          <option value="inactivo">Inactivo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#181611] uppercase mb-1">
                          Puntos Iniciales
                        </label>
                        <div className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-500">
                          0 pts (auto-calculado)
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#181611] uppercase mb-1">
                        Notas CRM (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Notas del cliente, preferencias de comida, zona, etc."
                        value={nuevoNotas}
                        onChange={(e) => setNuevoNotas(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DAD6D4] text-xs font-medium focus:border-[#00B0B0] outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setModalNuevoPerfil(false)}
                        className="flex-1 py-2.5 rounded-xl bg-[#E9E5DF] text-[#181611] text-xs font-bold hover:bg-[#DAD6D4] transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-[#00B0B0] hover:bg-[#309A9E] text-white text-xs font-bold transition-all shadow-md shadow-[#00B0B0]/20"
                      >
                        Guardar Perfil
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

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
                      <th className="py-3.5 px-3">Comisión Planéa (15%)</th>
                      <th className="py-3.5 px-3">Puntos Planéa (Meta 100)</th>
                      <th className="py-3.5 px-4">Notas Internas CRM</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {clientesCrmFiltrados.map((cliente, idx) => {
                      const notaActual = notasEditando[cliente.id] !== undefined 
                        ? notasEditando[cliente.id] 
                        : (cliente.notasCrm || '');

                      const telefonoWa = cliente.telefono?.replace(/\D/g, '') || '59178100777';
                      const nombreCliente = cliente.nombre || cliente.correo || 'Cliente';
                      const msgWa = encodeURIComponent(`Hola ${nombreCliente}, te saludamos desde Planéa Santa Cruz. ¡Gracias por confiar en nosotros para organizar tus planes!`);

                      return (
                        <tr key={cliente.id ? `${cliente.id}-${idx}` : `cli-${idx}`} className="hover:bg-[#FCFBF6] transition-colors">
                          
                          {/* Cliente */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#00B0B0]/20 text-[#00B0B0] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {nombreCliente.slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-bold text-[#181611] block leading-tight">{nombreCliente}</span>
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
                            <span className="text-[10px] text-[#958677] block">Gasto total</span>
                          </td>

                          {/* Comisión Planéa 15% sobre reserva */}
                          <td className="py-3.5 px-3">
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 inline-block">
                              + Bs {cliente.comisionGeneradaPlaneaBs || Math.round((cliente.montoReservasPagadasBs || cliente.montoSeñasPagadasBs || 0) * 0.15)}
                            </span>
                            <span className="text-[10px] text-emerald-800/80 block mt-0.5">
                              15% de Bs {cliente.montoReservasPagadasBs || cliente.montoSeñasPagadasBs || 0} (reserva)
                            </span>
                          </td>

                          {/* Puntos y Evento Gratis (Meta 100) */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1 font-bold text-[#00B0B0]">
                              <Award className="w-3.5 h-3.5" />
                              <span>{cliente.puntos || 0} pts</span>
                            </div>
                            <span className="text-[10px] text-[#958677] block">
                              {(cliente.puntos || 0) >= 100 
                                ? '🎁 ¡Evento gratis ganado!' 
                                : `Faltan ${Math.max(0, 100 - (cliente.puntos || 0))} pts`}
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
              <div>
                <h3 className="font-heading font-bold text-lg text-[#181611]">
                  Gestión de Reservas ({stats.totalReservas})
                </h3>
                <p className="text-xs text-[#5F7E7C] mt-0.5">
                  Cobro de reserva del 50%, comisión Planéa del 15% y liquidación a locales en Santa Cruz.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {stats.reservasConfirmadas} Confirmadas
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {stats.reservasPendientes} Pendientes
                </span>
              </div>
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
                      <th className="py-3 px-3">Total Estimado</th>
                      <th className="py-3 px-3">Reserva (50%)</th>
                      <th className="py-3 px-3">Comisión Planéa (15%)</th>
                      <th className="py-3 px-3">Adelanto Local</th>
                      <th className="py-3 px-3">Puntos</th>
                      <th className="py-3 px-3">Pago</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {(stats.reservas || []).map((res, idx) => {
                      const totalMonto = res.precioTotal || res.montoEstimado || 200;
                      const montoReserva = res.montoReserva || Math.round(totalMonto * 0.50);
                      const comisionPlanea = res.comisionPlanea || Math.round(montoReserva * 0.15);
                      const montoParaProveedor = res.montoParaProveedor || (montoReserva - comisionPlanea);
                      const puntos = res.puntosGanados || Math.max(1, Math.floor(totalMonto / 10));

                      return (
                        <tr key={res.id ? `${res.id}-${idx}` : `reserva-${idx}`} className="hover:bg-[#FCFBF6] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#00B0B0]">{res.id}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#181611] block">{res.nombreUsuario}</span>
                            <span className="text-[10px] text-[#958677]">{res.correo}</span>
                            {res.telefono && <span className="text-[10px] text-[#309A9E] block font-mono">📱 {res.telefono}</span>}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#181611]">{res.planSeleccionado}</td>
                          <td className="py-3 px-3">{res.fecha} · {res.hora} hrs</td>
                          <td className="py-3 px-3 font-semibold">{res.numeroPersonas} pers</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#181611]">Bs {totalMonto}</td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-800 bg-emerald-50/40">
                            Bs {montoReserva}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-100/50">
                            + Bs {comisionPlanea}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#5F7E7C]">
                            Bs {montoParaProveedor}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E]">
                              +{puntos} pts
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {res.estadoPago === 'pagado' || res.pagoRealizado ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                ✓ Reserva Pagada
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
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
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                  Confirmar
                                </button>
                              )}
                              {res.estado !== 'cancelada' && (
                                <button
                                  onClick={() => handleCambiarEstado(res.id, 'cancelada')}
                                  className="px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-bold transition-colors cursor-pointer"
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

        {/* ================= TAB 5: ENCUESTAS DE LA APP (REQUERIMIENTO 7) ================= */}
        {tabActiva === 'encuestas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-black text-xl text-[#181611] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#00B0B0]" />
                  <span>Encuestas de Satisfacción de la App Planéa</span>
                </h3>
                <p className="text-xs text-[#5F7E7C] mt-0.5">
                  Calificación del funcionamiento de la plataforma web, facilidad de uso y claridad (no del restaurante).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D3E6E8] text-[#309A9E]">
                  {stats.encuestas?.total || 0} respuestas recibidas
                </span>
              </div>
            </div>

            {/* TARJETAS KPI DE ENCUESTAS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Facilidad de uso */}
              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Facilidad de Uso</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-heading font-black text-3xl text-amber-500">
                    ★ {stats.encuestas?.promedioFacilidad || 5}
                  </p>
                  <span className="text-xs text-[#958677] font-semibold">/ 5.0</span>
                </div>
                <p className="text-[11px] text-[#4EBAA4] font-semibold mt-1">Escala de 1 a 5</p>
              </div>

              {/* Claridad de información */}
              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Claridad del Plan</span>
                  <CheckCircle2 className="w-4 h-4 text-[#00B0B0]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="font-heading font-black text-3xl text-[#00B0B0]">
                    ★ {stats.encuestas?.promedioClaridad || 5}
                  </p>
                  <span className="text-xs text-[#958677] font-semibold">/ 5.0</span>
                </div>
                <p className="text-[11px] text-[#5F7E7C] font-semibold mt-1">Transparencia de datos</p>
              </div>

              {/* Recomendaciones positivas */}
              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Recomendación Positiva</span>
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="font-heading font-black text-3xl text-emerald-700">
                  {stats.encuestas?.porcentajeRecomendacion || 100}%
                </p>
                <p className="text-[11px] text-[#958677] font-semibold mt-1">
                  {stats.encuestas?.recomendacionesPositivas || 0} dijeron que Sí recomendarían
                </p>
              </div>

              {/* Feedback directo */}
              <div className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs">
                <div className="flex items-center justify-between text-[#5F7E7C] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>Sugerencias de Mejora</span>
                  <MessageCircle className="w-4 h-4 text-[#309A9E]" />
                </div>
                <p className="font-heading font-black text-3xl text-[#181611]">
                  {stats.encuestas?.comentariosMejora?.length || 0}
                </p>
                <p className="text-[11px] text-[#5F7E7C] font-semibold mt-1">Comentarios recibidos</p>
              </div>
            </div>

            {/* BANNER DE COMENTARIOS DESTACADOS */}
            {stats.encuestas?.comentariosMejora && stats.encuestas.comentariosMejora.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-[#E9E5DF] shadow-xs">
                <h4 className="font-heading font-bold text-base text-[#181611] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00B0B0]" />
                  <span>Comentarios y Sugerencias de los Usuarios sobre la App</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(stats.encuestas?.comentariosMejora || []).map((c, i) => (
                    <div key={c.id ? `${c.id}-${i}` : `comentario-${i}`} className="p-3.5 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF] flex flex-col justify-between">
                      <p className="text-xs text-[#181611] italic">"{c.sugerenciaMejora}"</p>
                      <div className="mt-2.5 pt-2 border-t border-[#F0EAE3] flex items-center justify-between text-[11px] text-[#958677]">
                        <span className="font-bold text-[#309A9E]">{c.nombreUsuario || 'Usuario'}</span>
                        <span>{typeof c.fechaCreacion === 'string' && c.fechaCreacion.includes('T') ? c.fechaCreacion.split('T')[0] : String(c.fechaCreacion || 'Reciente')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABLA DETALLADA DE ENCUESTAS RECIBIDAS */}
            <div className="bg-white rounded-3xl border border-[#E9E5DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#5F7E7C] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-3">Usuario</th>
                      <th className="py-3 px-3">Contacto</th>
                      <th className="py-3 px-3 text-center">Facilidad (1-5)</th>
                      <th className="py-3 px-3 text-center">Claridad (1-5)</th>
                      <th className="py-3 px-3">¿Para Presupuesto?</th>
                      <th className="py-3 px-3">¿Recomienda?</th>
                      <th className="py-3 px-4">Sugerencia / Comentario</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {stats.encuestas?.lista && stats.encuestas.lista.length > 0 ? (
                      stats.encuestas.lista.map((enc, idx) => (
                        <tr key={enc.id ? `${enc.id}-${idx}` : `encuesta-${idx}`} className="hover:bg-[#FCFBF6] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-[#958677]">
                            {typeof enc.fechaCreacion === 'string' && enc.fechaCreacion.includes('T') ? enc.fechaCreacion.split('T')[0] : String(enc.fechaCreacion || 'Hoy')}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#181611]">
                            {enc.nombreUsuario}
                          </td>
                          <td className="py-3 px-3 text-[#5F7E7C]">
                            {enc.correoOrWhatsapp}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200">
                              ★ {enc.facilidadUso}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-black bg-[#D3E6E8] text-[#309A9E] border border-[#73ADB9]/30">
                              ★ {enc.claridadInformacion}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              enc.planesParaPresupuesto === 'si'
                                ? 'bg-emerald-50 text-emerald-800'
                                : enc.planesParaPresupuesto === 'mas_o_menos'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-red-50 text-red-800'
                            }`}>
                              {enc.planesParaPresupuesto === 'si' ? 'Sí' : enc.planesParaPresupuesto === 'mas_o_menos' ? 'Más o menos' : 'No'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              enc.recomendaria === 'si'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enc.recomendaria === 'tal_vez'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {enc.recomendaria === 'si' ? '✓ Sí' : enc.recomendaria === 'tal_vez' ? 'Tal vez' : '✗ No'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#181611] max-w-xs text-[11px] italic">
                            {enc.sugerenciaMejora ? `"${enc.sugerenciaMejora}"` : <span className="text-[#958677] not-italic">Sin comentarios adicionales</span>}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#958677]">
                          Aún no se han recibido encuestas de satisfacción.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: RECORDATORIOS AUTOMÁTICOS (REQUERIMIENTO 8) ================= */}
        {tabActiva === 'recordatorios' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-black text-xl text-[#181611] flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#00B0B0]" />
                  <span>Recordatorios de Reserva (1 Día Antes)</span>
                </h3>
                <p className="text-xs text-[#5F7E7C] mt-0.5">
                  Automatización de notificaciones 24 horas antes del evento por WhatsApp o Correo.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {stats.recordatorios?.pendientes || 0} pendientes
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {stats.recordatorios?.enviados || 0} enviados
                </span>
              </div>
            </div>

            {/* BANNER INFORMATIVO ARQUITECTURA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs text-emerald-950 space-y-1">
                <p className="font-bold">
                  Sistema de Recordatorios Programados:
                </p>
                <p className="text-emerald-900/90 leading-relaxed text-[11px]">
                  Cada vez que una reserva queda confirmada, se programa automáticamente un recordatorio para 1 día antes del evento (fechaEvento - 1). 
                  Se guarda en la estructura <code className="font-bold bg-white/70 px-1 py-0.5 rounded">recordatorios_reserva</code> con su mensaje sugerido. 
                  Desde este panel puedes consultar su estado, simular el envío o despacharlo directamente al WhatsApp o correo del cliente.
                </p>
              </div>
            </div>

            {/* TABLA DE RECORDATORIOS */}
            <div className="bg-white rounded-3xl border border-[#E9E5DF] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FCFBF6] border-b border-[#E9E5DF] text-[#5F7E7C] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">ID Recordatorio</th>
                      <th className="py-3 px-3">Reserva ID</th>
                      <th className="py-3 px-3">Medio</th>
                      <th className="py-3 px-3">Fecha Programada</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-4">Mensaje Oficial</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE3]">
                    {stats.recordatorios?.lista && stats.recordatorios.lista.length > 0 ? (
                      stats.recordatorios.lista.map((rec, idx) => {
                        const esWa = rec.medio === 'whatsapp';
                        const urlEnvioWa = `https://wa.me/59178100777?text=${encodeURIComponent(rec.mensaje)}`;

                        return (
                          <tr key={rec.id ? `${rec.id}-${idx}` : `rec-${idx}`} className="hover:bg-[#FCFBF6] transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#00B0B0] text-[11px]">
                              {rec.id}
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-[#5F7E7C]">
                              {rec.reservaId}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                esWa ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {esWa ? <MessageCircle className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                                <span className="capitalize">{rec.medio}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-[#181611]">
                              {rec.fechaProgramada}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rec.estado === 'enviado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : rec.estado === 'pendiente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {rec.estado.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#181611] max-w-sm text-[11px] leading-relaxed">
                              {rec.mensaje}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {rec.estado === 'pendiente' ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleCambiarEstadoRecordatorio(rec.id, 'enviado')}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                                    >
                                      Marcar Enviado
                                    </button>
                                    <a
                                      href={urlEnvioWa}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 transition-colors inline-flex items-center gap-1"
                                    >
                                      <Send className="w-3 h-3" />
                                      <span>Enviar</span>
                                    </a>
                                  </>
                                ) : (
                                  <span className="text-[11px] text-emerald-700 font-bold">
                                    ✓ Despachado
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#958677]">
                          No hay recordatorios pendientes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: RESEÑAS ================= */}
        {tabActiva === 'resenas' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-lg text-[#181611]">
              Moderación de Reseñas ({stats.totalResenas})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(stats.resenas || []).map((r, idx) => (
                <div key={r.id ? `${r.id}-${idx}` : `resena-${idx}`} className="p-5 rounded-3xl bg-white border border-[#E9E5DF] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-[#181611] block">{r.nombreUsuario}</span>
                        <span className="text-[11px] text-[#5F7E7C]">{r.planReservado} · {r.fecha}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={`star-${r.id || idx}-${i}`}
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
                    {(stats.metricas || []).slice(0, 50).map((m, idx) => {
                      const horaTexto = typeof m.fechaHora === 'string' && m.fechaHora.includes('T')
                        ? (m.fechaHora.split('T')[1] || '').slice(0, 8)
                        : (m.fechaHora ? String(m.fechaHora).slice(0, 8) : 'Hoy');

                      return (
                        <tr key={m.id ? `${m.id}-${idx}` : `metrica-${idx}`} className="hover:bg-[#FCFBF6]">
                          <td className="py-2.5 px-4 font-mono text-[11px] text-[#958677]">
                            {horaTexto}
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
                      );
                    })}
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
