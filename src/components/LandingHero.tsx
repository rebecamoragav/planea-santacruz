import React from 'react';
import { Compass, Sparkles, MapPin, Users, Calendar, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { TipoPlan } from '../types';

interface LandingHeroProps {
  onArmaTuPlan: () => void;
  onSelectCategory: (tipo: TipoPlan) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onArmaTuPlan,
  onSelectCategory,
}) => {
  const categorias: { tipo: TipoPlan; label: string; emoji: string; desc: string }[] = [
    { tipo: 'cena', label: 'Cena', emoji: '🍷', desc: 'Sach’a Huaska, Botánica, Palosanto...' },
    { tipo: 'brunch', label: 'Brunch', emoji: '🥐', desc: 'Inés España, Tostado, Nook...' },
    { tipo: 'cita', label: 'Cita', emoji: '✨', desc: 'Jardín de Asia, Typica, Güembé...' },
    { tipo: 'fiesta', label: 'Fiesta', emoji: '🪩', desc: 'Sky Bar, Duda Pub, Maroon Club...' },
    { tipo: 'deporte', label: 'Deporte', emoji: '🎾', desc: 'Go Padel, Padbol, Lomas de Arena...' },
    { tipo: 'recreativo', label: 'Recreativo', emoji: '🎨', desc: 'Patio Design, Ventura, Manzana 1...' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Elementos visuales decorativos con paleta cruceña */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#D3E6E8]/40 via-transparent to-transparent -z-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-[#00B0B0]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 left-10 w-80 h-80 bg-[#4EBAA4]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Slogan corto de portada */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9E5DF] text-[#309A9E] text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xs mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#00B0B0]" />
          <span>Descubre, Planéa y Vive</span>
        </div>

        {/* Frase principal / H1 */}
        <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-[#181611] tracking-tight leading-[1.1] max-w-4xl mx-auto">
          “Que organizarlo no te quite la{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#00B0B0] via-[#309A9E] to-[#4EBAA4]">
            magia de vivirlo
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#4EBAA4]/40" viewBox="0 0 100 12" preserveAspectRatio="none">
              <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          .”
        </h1>

        {/* Subtítulo explicativo */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#5F7E7C] max-w-2xl mx-auto leading-relaxed">
          La forma más simple y rápida de encontrar el plan perfecto en <strong className="text-[#181611] font-semibold">Santa Cruz de la Sierra</strong> según tu presupuesto, zona favorita y grupo de amigos o pareja.
        </p>

        {/* BOTÓN PRINCIPAL: "Arma tu plan" */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onArmaTuPlan}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#00B0B0] to-[#309A9E] hover:from-[#309A9E] hover:to-[#00B0B0] text-white font-heading font-bold text-lg sm:text-xl shadow-xl shadow-[#00B0B0]/30 hover:shadow-2xl hover:shadow-[#00B0B0]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            <span>Arma tu plan</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Pilares rápidos */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#73ADB9] font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#00B0B0]" />
            <span>Equipetrol · Norte · Centro · Urubó</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#4EBAA4]" />
            <span>Parejas, grupos o solitario</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#309A9E]" />
            <span>Confirmación al instante por WhatsApp</span>
          </div>
        </div>

        {/* Selector rápido de categorías */}
        <div className="mt-14 pt-10 border-t border-[#E9E5DF]">
          <p className="text-xs font-bold text-[#958677] uppercase tracking-wider mb-5">
            O explora directamente por tipo de plan:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categorias.map((cat) => (
              <button
                key={cat.tipo}
                onClick={() => onSelectCategory(cat.tipo)}
                className="p-3.5 rounded-2xl bg-white hover:bg-[#F0EAE3] border border-[#E9E5DF] hover:border-[#00B0B0]/50 shadow-xs hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                  <span className="font-heading font-bold text-sm text-[#181611] block group-hover:text-[#00B0B0]">
                    {cat.label}
                  </span>
                </div>
                <span className="text-[10px] text-[#958677] line-clamp-1 mt-1">
                  {cat.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
