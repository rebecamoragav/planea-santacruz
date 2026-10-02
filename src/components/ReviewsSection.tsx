import React from 'react';
import { Resena } from '../types';
import { Star, MessageSquareQuote, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { registrarEvento } from '../services/storage';

interface ReviewsSectionProps {
  resenas: Resena[];
  onOpenReviewModal: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  resenas,
  onOpenReviewModal,
}) => {
  const aprobadas = resenas.filter(r => r.aprobada);

  const handleDejarResenaClick = () => {
    registrarEvento('clic_resenas', 'Abrir modal de reseña', 'seccion_resenas');
    onOpenReviewModal();
  };

  return (
    <section id="resenas" className="py-16 bg-[#F0EAE3]/40 border-t border-b border-[#E9E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#00B0B0] uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Experiencias Cruceñas Verificadas</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#181611]">
              Reseñas de la Comunidad
            </h2>
            <p className="text-sm text-[#5F7E7C] mt-1 max-w-xl">
              Descubre cómo la gente de Santa Cruz organiza sus salidas sin estrés con Planéa.
            </p>
          </div>

          <button
            onClick={handleDejarResenaClick}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#00B0B0]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Dejar mi reseña</span>
          </button>
        </div>

        {/* Cuadrícula de reseñas aprobadas */}
        {aprobadas.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E9E5DF]">
            <p className="text-xs text-[#958677]">Sé el primero en dejar una reseña de tu plan favorito.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aprobadas.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-6 border border-[#E9E5DF] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Calificación en estrellas */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= r.calificacion
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-[#DAD6D4]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#958677]">{r.fecha}</span>
                  </div>

                  {/* Comentario */}
                  <p className="text-xs text-[#181611] italic leading-relaxed mb-4">
                    “{r.comentario}”
                  </p>
                </div>

                {/* Autor y plan */}
                <div className="pt-3 border-t border-[#F0EAE3]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-xs text-[#181611]">{r.nombreUsuario}</p>
                      <p className="text-[10px] text-[#00B0B0] font-semibold mt-0.5 truncate max-w-[170px]">
                        Plan: {r.planReservado}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#4EBAA4]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
