import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Heart, Compass, MapPin, Calendar, CheckCircle2, Share2, MessageCircle } from 'lucide-react';

interface BlogViewProps {
  onBack: () => void;
  onArmaTuPlan?: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onBack, onArmaTuPlan }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Planéa: cuando organizar un plan no debería quitarte las ganas de vivirlo',
        text: 'Conoce la historia y el propósito detrás de Planéa en Santa Cruz.',
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <article className="min-h-screen bg-[#FCFBF6] text-[#181611] font-sans selection:bg-[#00B0B0] selection:text-white pb-20">
      {/* Barra de navegación superior del blog */}
      <nav className="sticky top-0 z-40 bg-[#FCFBF6]/95 backdrop-blur-md border-b border-[#E9E5DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#F0EAE3] hover:bg-[#E9E5DF] text-[#181611] text-xs sm:text-sm font-bold transition-all border border-[#DAD6D4]/60 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#00B0B0] group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Planéa</span>
          </button>

          {/* Logo y título de sección */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00B0B0] via-[#309A9E] to-[#4EBAA4] flex items-center justify-center text-white font-heading font-black text-lg shadow-sm shadow-[#00B0B0]/20">
              P
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-heading font-black text-base text-[#181611] tracking-tight">
                Plan<span className="text-[#00B0B0]">éa</span>
              </span>
              <span className="text-[10px] font-bold text-[#309A9E] block -mt-1 uppercase tracking-wider">
                BLOG
              </span>
            </div>
          </div>

          {/* Compartir */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl text-[#5F7E7C] hover:text-[#00B0B0] hover:bg-[#F0EAE3] transition-colors cursor-pointer"
            title="Compartir historia"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Cabecera del artículo */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center sm:text-left">
        {/* Identificador de categoría / Sección */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#181611] text-white font-heading font-black text-xs uppercase tracking-widest">
            BLOG —
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9E5DF] text-[#309A9E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00B0B0]" />
            Desde dónde nace Planéa
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D3E6E8]/70 text-[#00B0B0] text-xs font-semibold">
            Historia y propósito
          </span>
        </div>

        {/* Título principal del artículo */}
        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-[#181611] tracking-tight leading-[1.18] mb-6">
          Planéa: cuando organizar un plan no debería quitarte las ganas de vivirlo
        </h1>

        {/* Autor y metadatos */}
        <div className="flex items-center justify-center sm:justify-start gap-3.5 pt-4 border-t border-[#E9E5DF]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00B0B0] to-[#4EBAA4] text-white flex items-center justify-center font-heading font-black text-lg shadow-md shadow-[#00B0B0]/25 ring-2 ring-white shrink-0">
            P
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm sm:text-base text-[#181611]">
                Planéa
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#4EBAA4]/15 text-[#309A9E] text-[10px] font-bold uppercase tracking-wider">
                Historia y visión
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#73ADB9] mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#00B0B0]" />
                Santa Cruz de la Sierra
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#309A9E]" />
                Lectura de 3 min
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Imagen representativa editorial */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-10">
        <div className="relative rounded-3xl overflow-hidden border border-[#E9E5DF] shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1400&auto=format&fit=crop&q=80"
            alt="Amigos disfrutando de un momento juntos en Santa Cruz"
            className="w-full h-64 sm:h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white text-left">
            <p className="font-heading font-bold text-sm sm:text-base drop-shadow-sm">
              “Que organizarlo no te quite la magia de vivirlo.”
            </p>
            <p className="text-[11px] sm:text-xs text-white/80 mt-0.5">
              La visión de transformar salidas en recuerdos memorables en Santa Cruz.
            </p>
          </div>
        </div>
      </div>

      {/* Cuerpo del artículo con el texto exacto solicitado */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="space-y-6 text-[#181611] text-base sm:text-lg leading-relaxed font-normal">
          
          {/* Párrafo 1 */}
          <p className="text-lg sm:text-xl font-medium text-[#181611] leading-relaxed">
            Planéa nace de una situación simple, pero muy común: querer salir, hacer algo diferente o compartir un momento especial, y terminar perdiendo demasiado tiempo tratando de organizarlo.
          </p>

          {/* Párrafo 2 */}
          <p className="text-[#36322B]">
            A veces no faltan ganas, faltan opciones claras. Hay que revisar Instagram, preguntar precios, buscar ubicaciones, escribir a distintos lugares, comparar horarios y coordinar con otras personas. Lo que debería sentirse emocionante termina volviéndose cansador.
          </p>

          {/* Párrafo 3 - Quiebre reflexivo */}
          <div className="py-2">
            <p className="font-heading font-black text-2xl sm:text-3xl text-[#00B0B0] tracking-tight">
              Ahí apareció la idea de Planéa.
            </p>
          </div>

          {/* Párrafo 4 */}
          <p className="text-[#36322B]">
            Me di cuenta de que el problema no era que en Santa Cruz no existieran lugares, actividades o experiencias interesantes. El problema era que toda esa información estaba dispersa. Las personas no necesitan mil opciones sueltas; necesitan encontrar el plan correcto según su presupuesto, su tiempo, su zona, sus gustos y con quién quieren compartirlo.
          </p>

          {/* Tarjeta destacada del insight */}
          <div className="my-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#D3E6E8]/40 via-[#FCFBF6] to-[#E9E5DF]/60 border border-[#00B0B0]/30 shadow-xs relative overflow-hidden">
            <div className="w-1.5 bg-gradient-to-b from-[#00B0B0] to-[#4EBAA4] absolute left-0 top-0 bottom-0" />
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-[#00B0B0] shrink-0 mt-1" />
              <div>
                <p className="font-heading font-bold text-sm uppercase tracking-wider text-[#309A9E] mb-1">
                  El enfoque de Planéa
                </p>
                <p className="text-sm sm:text-base text-[#181611] font-medium leading-relaxed">
                  Menos tiempo preguntando y comparando en distintas pantallas; más tiempo compartiendo con quienes más quieres.
                </p>
              </div>
            </div>
          </div>

          {/* Párrafo 5 */}
          <p className="text-[#36322B]">
            Por eso Planéa busca simplificar la forma en que descubrimos y organizamos planes. La idea es que puedas entrar, filtrar lo que estás buscando, encontrar opciones reales, ver precios, ubicaciones y reservar de una manera más sencilla.
          </p>

          {/* Párrafo 6 */}
          <p className="text-[#36322B]">
            Más que una app de planes, Planéa quiere ser una herramienta para que organizar una salida vuelva a sentirse fácil. Para que una cita, un cumpleaños, una tarde con amigos o una experiencia nueva no empiece con estrés, sino con emoción.
          </p>

          {/* Párrafo 7 - Frase de cierre */}
          <blockquote className="my-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#E9E5DF] shadow-sm text-center relative">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#00B0B0]/15 text-[#00B0B0] mb-3">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <p className="font-heading font-black text-xl sm:text-2xl text-[#181611] tracking-tight leading-snug">
              “Porque al final, un buen plan no debería comenzar con cansancio. Debería comenzar con ganas de vivirlo.”
            </p>
            <p className="text-xs font-bold text-[#309A9E] uppercase tracking-wider mt-3">
              — Planéa
            </p>
          </blockquote>

        </div>

        {/* Llamado a la acción y botones de retorno */}
        <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-[#181611] to-[#25221B] text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#00B0B0]/20 rounded-full blur-3xl pointer-events-none" />
          
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-[#4EBAA4] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Descubre, Planéa y Vive
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight max-w-xl mx-auto mb-3">
            ¿Listo para armar tu próximo momento especial?
          </h2>
          <p className="text-xs sm:text-sm text-[#DAD6D4] max-w-lg mx-auto mb-8 leading-relaxed">
            Filtra por presupuesto, tu zona favorita y tu grupo para reservar en segundos sin complicaciones.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {onArmaTuPlan && (
              <button
                onClick={onArmaTuPlan}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00B0B0] to-[#309A9E] hover:from-[#309A9E] hover:to-[#00B0B0] text-white font-heading font-bold text-base shadow-lg shadow-[#00B0B0]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Compass className="w-5 h-5" />
                <span>Arma tu plan ahora</span>
              </button>
            )}

            <button
              onClick={onBack}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-bold text-sm transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Planéa</span>
            </button>
          </div>
        </div>

      </main>
    </article>
  );
};
