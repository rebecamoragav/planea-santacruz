import React from 'react';
import { Sparkles, Phone, MessageCircle, Heart, MapPin } from 'lucide-react';
import { TipoPlan } from '../types';

interface FooterProps {
  onArmaTuPlan: () => void;
  onOpenAdmin: () => void;
  onOpenRegister: () => void;
  onSelectCategory: (tipo: TipoPlan) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onArmaTuPlan,
  onOpenAdmin,
  onOpenRegister,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#181611] text-[#DAD6D4] pt-16 pb-12 border-t border-[#309A9E]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#5F7E7C]/30">
          
          {/* Marca & Slogan */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00B0B0] to-[#4EBAA4] text-white flex items-center justify-center font-heading font-black text-xl">
                P
              </div>
              <span className="font-heading font-black text-2xl text-white tracking-tight">
                Plan<span className="text-[#00B0B0]">éa</span>
              </span>
            </div>

            <p className="text-white font-medium text-sm italic">
              “Que organizarlo no te quite la magia de vivirlo.”
            </p>

            <p className="text-xs text-[#B0AFAD] max-w-md leading-relaxed">
              Plataforma intermediaria que ayuda a las personas en Santa Cruz de la Sierra, Bolivia, a encontrar y reservar los mejores planes según su presupuesto, zona, número de personas y tipo de experiencia.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#4EBAA4]">
              <MapPin className="w-4 h-4 text-[#00B0B0]" />
              <span>Santa Cruz de la Sierra, Bolivia</span>
            </div>
          </div>

          {/* Planes en Santa Cruz */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Categorías de Planes
            </h4>
            <ul className="space-y-2 text-xs text-[#B0AFAD]">
              <li>
                <button onClick={() => onSelectCategory('cena')} className="hover:text-[#00B0B0] transition-colors">
                  Cena gourmet y típica
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('brunch')} className="hover:text-[#00B0B0] transition-colors">
                  Brunch y café de autor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('cita')} className="hover:text-[#00B0B0] transition-colors">
                  Citas románticas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('fiesta')} className="hover:text-[#00B0B0] transition-colors">
                  Boliches y bares
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('deporte')} className="hover:text-[#00B0B0] transition-colors">
                  Pádel y aventura al aire libre
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('recreativo')} className="hover:text-[#00B0B0] transition-colors">
                  Cultura y centros comerciales
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto y Soporte */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Soporte Directo
            </h4>
            <p className="text-xs text-[#B0AFAD]">
              Llámanos o escríbenos directamente para atención personalizada:
            </p>
            <div className="space-y-2">
              <a
                href="tel:78100777"
                className="flex items-center gap-2 text-sm font-bold text-[#00B0B0] hover:text-[#4EBAA4] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>78100777</span>
              </a>
              <a
                href="https://wa.me/59178100777?text=Hola,%20necesito%20ayuda%20con%20mi%20reserva%20en%20Planéa."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-white/90 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Soporte</span>
              </a>
            </div>

            <div className="pt-3">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-[#73ADB9] hover:text-white underline underline-offset-4 transition-colors"
              >
                Acceso Administrativo (/admin)
              </button>
            </div>
          </div>

        </div>

        {/* Créditos y copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#958677]">
          <p>© {new Date().getFullYear()} Planéa. Descubre, Planéa y Vive.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> para Santa Cruz de la Sierra
          </p>
        </div>

      </div>
    </footer>
  );
};
