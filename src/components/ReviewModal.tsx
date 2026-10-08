import React, { useState } from 'react';
import { Usuario } from '../types';
import { PLANES_SANTA_CRUZ } from '../data/planesData';
import { guardarResena, registrarEvento } from '../services/storage';
import { Star, X, CheckCircle2, MessageSquareQuote } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  usuario: Usuario | null;
  defaultPlan?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  usuario,
  defaultPlan,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [planReservado, setPlanReservado] = useState(defaultPlan || PLANES_SANTA_CRUZ[0].nombre);
  const [calificacion, setCalificacion] = useState<number>(5);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nom = nombre.trim();
    const com = comentario.trim();

    if (!nom) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    if (!com) {
      setError('Por favor escribe tu comentario sobre la experiencia');
      return;
    }

    try {
      guardarResena({
        usuarioId: usuario?.id,
        nombreUsuario: nom,
        planReservado,
        calificacion,
        comentario: com
      });

      setExito(true);
      setTimeout(() => {
        setExito(false);
        onSuccess();
        onClose();
      }, 900);
    } catch (err) {
      setError('Error al guardar la reseña. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E5DF] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00B0B0]/15 text-[#00B0B0] flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-black text-xl text-[#181611]">
              Deja tu Reseña
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#958677] hover:text-[#181611] hover:bg-[#F0EAE3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {exito ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#4EBAA4] mx-auto animate-bounce" />
            <h4 className="font-heading font-bold text-lg text-[#181611]">¡Gracias por tu reseña!</h4>
            <p className="text-xs text-[#5F7E7C]">Tu opinión ayuda a otros cruceños a armar sus mejores salidas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Calificación 1 a 5 estrellas */}
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-2 text-center">
                Calificación
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCalificacion(star)}
                    className="p-1.5 text-2xl hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= calificacion
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-[#DAD6D4]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Reservado */}
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Plan o Lugar de Santa Cruz
              </label>
              <select
                value={planReservado}
                onChange={(e) => setPlanReservado(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#DAD6D4] text-xs font-semibold text-[#181611] focus:border-[#00B0B0] outline-none"
              >
                {PLANES_SANTA_CRUZ.map((p) => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre} ({p.tipo})
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Tu Nombre
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Valeria Justiniano"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#DAD6D4] text-xs text-[#181611] focus:border-[#00B0B0] outline-none"
              />
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Comentario breve
              </label>
              <textarea
                required
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="¿Qué tal la comida, la atención y el ambiente?"
                className="w-full p-3 rounded-2xl bg-white border border-[#DAD6D4] text-xs text-[#181611] focus:border-[#00B0B0] outline-none resize-none placeholder:text-[#B0AFAD]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#00B0B0]/25 transition-all cursor-pointer"
            >
              Publicar Reseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
