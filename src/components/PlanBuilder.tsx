import React, { useState, useMemo, useRef } from 'react';
import { PlanLugar, TipoPlan, ZonaSantaCruz } from '../types';
import { PLANES_SANTA_CRUZ } from '../data/planesData';
import { registrarEvento } from '../services/storage';
import { 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  Compass,
  ArrowDown,
  Loader2,
  SlidersHorizontal,
  Wallet
} from 'lucide-react';

interface PlanBuilderProps {
  initialTipo?: TipoPlan | 'todos';
  onSelectPlan: (plan: PlanLugar, fechaSeleccionada: string, personas: number) => void;
}

export const PlanBuilder: React.FC<PlanBuilderProps> = ({
  initialTipo = 'todos',
  onSelectPlan,
}) => {
  // Filtros interactivos
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoPlan | 'todos'>(initialTipo);
  const [zonaSeleccionada, setZonaSeleccionada] = useState<ZonaSantaCruz>('Todas');
  
  // Presupuesto en Bs: Monto libre ingresado por el usuario (ej. 1500)
  const [presupuestoMonto, setPresupuestoMonto] = useState<string>('');
  const [tipoPresupuesto, setTipoPresupuesto] = useState<'total' | 'por_persona'>('total');

  const [numPersonas, setNumPersonas] = useState<number>(2);
  
  // Fecha seleccionada (hoy por defecto)
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState<string>(hoyStr);

  // Estado que controla si el usuario ya presionó el botón final de sugerir planes
  const [haGeneradoSugerencias, setHaGeneradoSugerencias] = useState<boolean>(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState<boolean>(false);

  const resultadosRef = useRef<HTMLDivElement>(null);

  const tiposDisponibles: { id: TipoPlan | 'todos'; label: string; emoji: string }[] = [
    { id: 'todos', label: 'Cualquier tipo', emoji: '✨' },
    { id: 'cena', label: 'Cena', emoji: '🍷' },
    { id: 'brunch', label: 'Brunch & Café', emoji: '🥐' },
    { id: 'cita', label: 'Cita romántica', emoji: '🕯️' },
    { id: 'fiesta', label: 'Fiesta & Bares', emoji: '🪩' },
    { id: 'deporte', label: 'Deporte & Activo', emoji: '🎾' },
    { id: 'recreativo', label: 'Recreativo & Paseo', emoji: '🎨' },
  ];

  const zonasDisponibles: ZonaSantaCruz[] = [
    'Todas',
    'Equipetrol',
    'Norte',
    'Centro',
    'Urubó',
    'Sur',
    'Este'
  ];

  // Presupuestos rápidos sugeridos en Bs
  const presupuestosRapidos = [250, 500, 1000, 1800, 3000];

  // Cálculo de planes que cumplen los filtros seleccionados
  const planesFiltrados = useMemo(() => {
    const montoLimite = parseFloat(presupuestoMonto);
    const tienePresupuesto = !isNaN(montoLimite) && montoLimite > 0;

    const lista = PLANES_SANTA_CRUZ.filter((plan) => {
      // 1. Tipo de plan
      if (tipoSeleccionado !== 'todos' && plan.tipo !== tipoSeleccionado) {
        return false;
      }

      // 2. Zona
      if (zonaSeleccionada !== 'Todas') {
        if (zonaSeleccionada === 'Equipetrol') {
          if (!plan.zonaDetalle.toLowerCase().includes('equipetrol') && plan.zona !== 'Equipetrol') {
            return false;
          }
        } else if (plan.zona !== zonaSeleccionada && !plan.zonaDetalle.toLowerCase().includes(zonaSeleccionada.toLowerCase())) {
          return false;
        }
      }

      // 3. Presupuesto en Bs ingresado por el usuario (ej. 1500 Bs)
      if (tienePresupuesto) {
        if (tipoPresupuesto === 'total') {
          // El costo total estimado del grupo no debe superar el presupuesto
          const costoTotalEstimado = plan.precioEstimadoBs * numPersonas;
          if (costoTotalEstimado > montoLimite) return false;
        } else {
          // Presupuesto por persona
          if (plan.precioEstimadoBs > montoLimite) return false;
        }
      }

      // 4. Capacidad de personas
      if (numPersonas > plan.maxPersonas + 4) return false;

      return true;
    });

    // Si tiene presupuesto, ordenamos de forma que los mejores planes acordes aparezcan primero
    if (tienePresupuesto) {
      return lista.sort((a, b) => {
        const costoA = a.precioEstimadoBs * numPersonas;
        const costoB = b.precioEstimadoBs * numPersonas;
        // Priorizar lugares con buena optimización del presupuesto
        return costoB - costoA;
      });
    }

    return lista;
  }, [tipoSeleccionado, zonaSeleccionada, presupuestoMonto, tipoPresupuesto, numPersonas]);

  // Manejador del botón final: "Ver planes sugeridos"
  const handleGenerarSugerencias = () => {
    setCargandoSugerencias(true);
    registrarEvento(
      'clic_ver_planes_sugeridos',
      'Ver planes sugeridos',
      'plan_builder',
      `Filtros: tipo=${tipoSeleccionado}, zona=${zonaSeleccionada}, presupuesto=${presupuestoMonto || 'sin_limite'} Bs (${tipoPresupuesto}), personas=${numPersonas}, fecha=${fecha}`
    );

    setTimeout(() => {
      setCargandoSugerencias(false);
      setHaGeneradoSugerencias(true);

      // Scroll suave a los resultados sugeridos
      setTimeout(() => {
        if (resultadosRef.current) {
          resultadosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 350);
  };

  const handleResetFiltros = () => {
    setTipoSeleccionado('todos');
    setZonaSeleccionada('Todas');
    setPresupuestoMonto('');
    setTipoPresupuesto('total');
    setNumPersonas(2);
    setHaGeneradoSugerencias(false);
  };

  const handleSelectPlanLugar = (plan: PlanLugar) => {
    registrarEvento(
      'clic_plan_seleccionado',
      `Eligió plan sugerido: ${plan.nombre}`,
      'plan_builder',
      `Tipo: ${plan.tipo}, Precio: Bs ${plan.precioEstimadoBs}`
    );
    onSelectPlan(plan, fecha, numPersonas);
  };

  // Texto resumen de los filtros seleccionados
  const getFiltrosResumen = () => {
    const partes: string[] = [];
    partes.push(tipoSeleccionado === 'todos' ? 'Cualquier tipo de actividad' : `Tipo: ${tipoSeleccionado.toUpperCase()}`);
    partes.push(zonaSeleccionada === 'Todas' ? 'Todas las zonas de Santa Cruz' : `Zona ${zonaSeleccionada}`);
    if (presupuestoMonto && parseFloat(presupuestoMonto) > 0) {
      partes.push(`Presupuesto: Bs ${presupuestoMonto} (${tipoPresupuesto === 'total' ? 'Total grupo' : 'Por persona'})`);
    } else {
      partes.push('Cualquier presupuesto');
    }
    partes.push(`${numPersonas} ${numPersonas === 1 ? 'persona' : 'personas'}`);
    return partes.join(' · ');
  };

  const presupuestoNum = parseFloat(presupuestoMonto);

  return (
    <div id="armar-plan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Título de la sección de filtros */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00B0B0] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Sugerencias Personalizadas · Santa Cruz de la Sierra</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#181611]">
              Arma tu plan sin complicaciones
            </h2>
            <p className="text-sm text-[#5F7E7C] mt-1 max-w-2xl">
              No tienes que escribir ni adivinar qué hacer. Ajusta tu presupuesto en Bolivianos, tu zona y tus preferencias; <strong>Planéa te sugerirá los mejores planes</strong> listos para reservar.
            </p>
          </div>

          {/* Reset de filtros */}
          <button
            onClick={handleResetFiltros}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E9E5DF] text-xs font-semibold text-[#958677] hover:text-[#181611] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* PANEL DE FILTROS PASO A PASO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5DF] shadow-md mb-10 space-y-6">
        
        {/* 1. Tipo de plan */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-[#181611] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00B0B0] text-white flex items-center justify-center text-[10px]">1</span>
              <span>¿Qué tipo de plan buscas?</span>
            </label>
            <span className="text-[11px] text-[#309A9E] font-medium hidden sm:inline">Selecciona una categoría</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {tiposDisponibles.map((t) => {
              const activo = tipoSeleccionado === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTipoSeleccionado(t.id);
                  }}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activo
                      ? 'bg-[#00B0B0] text-white shadow-md shadow-[#00B0B0]/25 scale-[1.02]'
                      : 'bg-[#FCFBF6] hover:bg-[#F0EAE3] text-[#181611] border border-[#E9E5DF]'
                  }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rejilla de filtros secundarios: Presupuesto en Bs, Zona, Personas, Fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6 border-t border-[#F0EAE3]">
          
          {/* 2. PRESUPUESTO EN BS (INGRESO MANUAL Y PRESETS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#4EBAA4] text-white flex items-center justify-center text-[10px]">2</span>
                <Wallet className="w-3.5 h-3.5 text-[#4EBAA4]" />
                <span>Presupuesto (Bs)</span>
              </label>

              {/* Selector de modo: Total vs Por persona */}
              <div className="flex bg-[#F0EAE3] p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setTipoPresupuesto('total')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    tipoPresupuesto === 'total' ? 'bg-[#00B0B0] text-white shadow-xs' : 'text-[#5F7E7C]'
                  }`}
                  title="Presupuesto total para todo el grupo"
                >
                  Total
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPresupuesto('por_persona')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    tipoPresupuesto === 'por_persona' ? 'bg-[#00B0B0] text-white shadow-xs' : 'text-[#5F7E7C]'
                  }`}
                  title="Presupuesto por cada persona"
                >
                  Por pers.
                </button>
              </div>
            </div>

            {/* Input para ingresar el monto en Bs (ej. 1500) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-xs font-black text-[#00B0B0]">Bs</span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                placeholder="Ingresa tu monto (ej. 1500)"
                value={presupuestoMonto}
                onChange={(e) => setPresupuestoMonto(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-[#FCFBF6] border border-[#DAD6D4] text-xs sm:text-sm font-bold text-[#181611] placeholder:text-[#B0AFAD] placeholder:font-normal focus:border-[#00B0B0] outline-none transition-all"
              />
              {presupuestoMonto && (
                <button
                  type="button"
                  onClick={() => setPresupuestoMonto('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#958677] hover:text-[#181611]"
                  title="Limpiar presupuesto"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Presets rápidos en Bolivianos */}
            <div className="flex flex-wrap gap-1 items-center pt-1">
              <span className="text-[10px] text-[#958677] font-medium mr-1">Rápido:</span>
              {presupuestosRapidos.map((monto) => (
                <button
                  key={monto}
                  type="button"
                  onClick={() => setPresupuestoMonto(monto.toString())}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    presupuestoMonto === monto.toString()
                      ? 'bg-[#181611] text-white'
                      : 'bg-[#FCFBF6] hover:bg-[#E9E5DF] border border-[#DAD6D4] text-[#5F7E7C]'
                  }`}
                >
                  Bs {monto}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPresupuestoMonto('')}
                className="px-2 py-0.5 rounded-md text-[10px] text-[#958677] hover:text-[#181611]"
              >
                Sin límite
              </button>
            </div>
          </div>

          {/* 3. Zona en Santa Cruz */}
          <div>
            <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00B0B0] text-white flex items-center justify-center text-[10px]">3</span>
              <MapPin className="w-3.5 h-3.5 text-[#00B0B0]" />
              <span>Zona en Santa Cruz</span>
            </label>
            <select
              value={zonaSeleccionada}
              onChange={(e) => setZonaSeleccionada(e.target.value as ZonaSantaCruz)}
              className="w-full px-3.5 py-3 rounded-2xl bg-[#FCFBF6] border border-[#DAD6D4] text-xs sm:text-sm font-semibold text-[#181611] focus:border-[#00B0B0] outline-none"
            >
              {zonasDisponibles.map(z => (
                <option key={z} value={z}>
                  {z === 'Todas' ? '📍 Todas las zonas' : `📍 ${z}`}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Número de personas */}
          <div>
            <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#309A9E] text-white flex items-center justify-center text-[10px]">4</span>
              <Users className="w-3.5 h-3.5 text-[#309A9E]" />
              <span>Personas ({numPersonas})</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 4, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumPersonas(n)}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    numPersonas === n
                      ? 'bg-[#181611] text-white shadow-xs'
                      : 'bg-[#FCFBF6] border border-[#DAD6D4] text-[#5F7E7C] hover:text-[#181611]'
                  }`}
                >
                  {n === 1 ? 'Solo' : n === 2 ? 'Pareja' : n === 4 ? '4 pers' : '8+'}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Fecha del plan */}
          <div>
            <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#00B0B0] text-white flex items-center justify-center text-[10px]">5</span>
              <CalendarIcon className="w-3.5 h-3.5 text-[#00B0B0]" />
              <span>Fecha deseada</span>
            </label>
            <input
              type="date"
              value={fecha}
              min={hoyStr}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCFBF6] border border-[#DAD6D4] text-xs sm:text-sm font-semibold text-[#181611] focus:border-[#00B0B0] outline-none"
            />
          </div>

        </div>

        {/* ============================================================== */}
        {/* BOTÓN FINAL OBLIGATORIO: MUESTRA LOS POSIBLES PLANES SUGERIDOS */}
        {/* ============================================================== */}
        <div className="pt-6 border-t border-[#F0EAE3] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#5F7E7C] flex items-center gap-2 text-center sm:text-left">
            <SlidersHorizontal className="w-4 h-4 text-[#00B0B0] shrink-0" />
            <span>
              {presupuestoMonto && parseFloat(presupuestoMonto) > 0 ? (
                <>
                  Filtro activo: Presupuesto de <strong>Bs {presupuestoMonto}</strong> ({tipoPresupuesto === 'total' ? 'total para tu grupo' : 'por persona'}) para <strong>{numPersonas} persona{numPersonas > 1 ? 's' : ''}</strong>.
                </>
              ) : (
                'Planéa analizará tus filtros para mostrarte las opciones recomendadas en Santa Cruz.'
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={handleGenerarSugerencias}
            disabled={cargandoSugerencias}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00B0B0] via-[#309A9E] to-[#4EBAA4] hover:from-[#309A9E] hover:to-[#00B0B0] text-white font-heading font-black text-sm sm:text-base shadow-lg shadow-[#00B0B0]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            {cargandoSugerencias ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Buscando planes para ti en Santa Cruz...</span>
              </>
            ) : (
              <>
                <Compass className="w-5 h-5" />
                <span>
                  {haGeneradoSugerencias ? 'Actualizar planes sugeridos' : 'Ver planes sugeridos para mí'}
                </span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SECCIÓN DE PLANES SUGERIDOS POR PLANÉA (TRAS PRESIONAR EL BOTÓN) */}
      {/* ============================================================== */}
      <div ref={resultadosRef} id="planes-sugeridos" className="pt-4 scroll-mt-24">
        
        {!haGeneradoSugerencias ? (
          // Mensaje previo a presionar el botón final
          <div className="bg-[#F0EAE3]/40 border-2 border-dashed border-[#DAD6D4] rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#00B0B0] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#181611]">
              ¿Listo para descubrir tu salida?
            </h3>
            <p className="text-xs text-[#5F7E7C] mt-1 max-w-md mx-auto">
              Ingresa tu presupuesto en Bs (ej. 1500) y presiona <strong className="text-[#00B0B0]">“Ver planes sugeridos para mí”</strong> para calcular las opciones de Santa Cruz que se ajustan a ti.
            </p>
          </div>
        ) : (
          // Resultados sugeridos
          <div>
            {/* Encabezado de los resultados */}
            <div className="mb-6 p-4 rounded-2xl bg-[#D3E6E8]/40 border border-[#73ADB9]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00B0B0]" />
                  <h3 className="font-heading font-bold text-base text-[#181611]">
                    Planes sugeridos por Planéa en Santa Cruz ({planesFiltrados.length})
                  </h3>
                </div>
                <p className="text-xs text-[#5F7E7C] mt-0.5">
                  {getFiltrosResumen()}
                </p>
              </div>

              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-bold bg-[#00B0B0] text-white">
                Sugerencias listas para reservar
              </span>
            </div>

            {planesFiltrados.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E9E5DF]">
                <p className="text-3xl mb-3">🧭</p>
                <h3 className="font-heading font-bold text-lg text-[#181611]">
                  No encontramos planes que cumplan con todos esos filtros exactos
                </h3>
                <p className="text-xs text-[#958677] mt-1 max-w-sm mx-auto">
                  {presupuestoNum > 0
                    ? `Prueba aumentando tu presupuesto de Bs ${presupuestoNum} o cambiando a "Todas las zonas".`
                    : 'Prueba cambiando la zona a "Todas" para que Planéa te sugiera más opciones.'}
                </p>
                <button
                  type="button"
                  onClick={handleResetFiltros}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#00B0B0] text-white text-xs font-bold hover:bg-[#309A9E] transition-colors"
                >
                  Restablecer y ver sugerencias generales
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planesFiltrados.map((plan) => {
                  const precioPersona = plan.precioEstimadoPorPersona || plan.precioEstimadoBs;
                  const costoGrupo = precioPersona * numPersonas;
                  const montoReservaGrupo = Math.round(costoGrupo * 0.50);
                  const dentroDelPresupuesto = !isNaN(presupuestoNum) && presupuestoNum > 0
                    ? tipoPresupuesto === 'total' 
                      ? costoGrupo <= presupuestoNum
                      : precioPersona <= presupuestoNum
                    : true;

                  return (
                    <div
                      key={plan.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E9E5DF] hover:border-[#00B0B0]/60 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Imagen representativa del local o experiencia */}
                      <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-3 bg-[#FCFBF6] border border-[#E9E5DF]">
                        <img
                          src={plan.imagenLocal || plan.imagenExperiencia}
                          alt={plan.altImagen || `${plan.nombre} - ${plan.tipo} en Santa Cruz`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 
                              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Badges sobre la imagen */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-[#181611] shadow-xs">
                            {plan.iconoEmoji} {plan.tipo}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-[10px] font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-lg">
                            {plan.altImagen?.includes('referencial') ? 'Foto referencial' : 'Local verificado'}
                          </span>
                          <span className="text-[10px] font-bold bg-[#00B0B0] px-2 py-0.5 rounded-lg shadow-xs">
                            Reserva: 50%
                          </span>
                        </div>
                      </div>

                      {/* Badge superior con desglose de presupuesto */}
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4EBAA4]/15 text-[#309A9E]">
                          <Sparkles className="w-3 h-3 text-[#00B0B0]" />
                          {dentroDelPresupuesto && presupuestoNum > 0
                            ? `Entra en tus Bs ${presupuestoNum}`
                            : 'Sugerido en Santa Cruz'}
                        </span>

                        <div className="text-right">
                          <span className="font-heading font-black text-lg text-[#181611]">
                            Bs {precioPersona}
                          </span>
                          <span className="text-[10px] text-[#958677] block font-medium">/ persona ({plan.moneda || 'Bs'})</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-start gap-2.5 mb-1.5">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] text-[#5F7E7C] font-semibold flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#00B0B0]" />
                                {plan.zonaDetalle}
                              </span>
                            </div>
                            <h3 className="font-heading font-bold text-xl text-[#181611] group-hover:text-[#00B0B0] transition-colors mt-0.5">
                              {plan.nombre}
                            </h3>
                          </div>
                        </div>

                        {/* MÁS IMÁGENES DE POSIBLES PLANES QUE PUEDES REALIZAR EN ESTE LOCAL */}
                        <div className="my-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#181611] flex items-center gap-1.5 uppercase tracking-wider">
                              <span className="text-sm">📸</span>
                              <span>Planes en este local:</span>
                            </span>
                            <span className="text-[10px] text-[#309A9E] font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {plan.horarioSugerido}
                            </span>
                          </div>

                          {/* Galería visual con fotos de posibles planes */}
                          <div className="grid grid-cols-2 gap-2">
                            {(plan.planesSugeridos || []).slice(0, 4).map((ps, idx) => (
                              <div
                                key={idx}
                                className="group/plan relative rounded-xl overflow-hidden border border-[#E9E5DF] bg-[#FCFBF6] hover:border-[#00B0B0] hover:shadow-md transition-all h-20"
                                title={ps.titulo}
                              >
                                <img
                                  src={ps.imagen}
                                  alt={ps.titulo}
                                  className="w-full h-full object-cover group-hover/plan:scale-110 transition-transform duration-500"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
                                <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10px] font-bold text-white leading-tight text-center drop-shadow-xs truncate block">
                                  {ps.emoji} {ps.titulo}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Desglose de cálculo de presupuesto para el grupo */}
                        <div className="mt-3 p-3 rounded-2xl bg-[#FCFBF6] border border-[#E9E5DF] space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#958677]">Total estimado ({numPersonas} pers):</span>
                            <span className="font-heading font-bold text-[#181611]">
                              Bs {costoGrupo}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0EAE3]">
                            <span className="font-bold text-emerald-800">Monto para reservar (50%):</span>
                            <span className="font-heading font-black text-emerald-700">
                              Bs {montoReservaGrupo}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón de acción: Reservar sin escribir nada */}
                      <div className="mt-4 pt-3 border-t border-[#E9E5DF]">
                        <button
                          type="button"
                          onClick={() => handleSelectPlanLugar(plan)}
                          className="w-full py-3.5 px-4 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#00B0B0]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>Reservar este plan (Reserva Bs {montoReservaGrupo})</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
