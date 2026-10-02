import React, { useState } from 'react';
import { Phone, MessageCircle, HelpCircle, X, Sparkles } from 'lucide-react';
import { registrarEvento } from '../services/storage';

export const SupportFloating: React.FC = () => {
  const [abierto, setAbierto] = useState(false);

  const handleLlamar = () => {
    registrarEvento('clic_soporte', 'Llamada directa', 'soporte_flotante', 'Tel: 78100777');
    window.location.href = 'tel:78100777';
  };

  const handleWhatsapp = () => {
    // Mensaje sugerido por el usuario:
    // “Hola, necesito ayuda con mi reserva en Planéa.”
    const mensaje = encodeURIComponent('Hola, necesito ayuda con mi reserva en Planéa.');
    registrarEvento('clic_soporte', 'WhatsApp soporte', 'soporte_flotante', 'Tel: 78100777');
    window.open(`https://wa.me/59178100777?text=${mensaje}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {abierto && (
        <div className="mb-3 w-72 bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] p-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E5DF]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00B0B0] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-[#181611]">Soporte Planéa</h4>
                <p className="text-[10px] text-[#5F7E7C]">Santa Cruz de la Sierra</p>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="p-1 rounded-lg text-[#958677] hover:text-[#181611]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <button
              onClick={handleWhatsapp}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#181611] transition-all cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#181611]">Escribir a WhatsApp</p>
                <p className="text-[10px] text-[#5F7E7C]">Atención rápida · 78100777</p>
              </div>
            </button>

            <button
              onClick={handleLlamar}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-[#00B0B0]/10 hover:bg-[#00B0B0]/20 text-[#181611] transition-all cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-[#00B0B0] text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#181611]">Llamar al 78100777</p>
                <p className="text-[10px] text-[#5F7E7C]">Llamada directa telefónica</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setAbierto(!abierto)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#00B0B0] to-[#309A9E] hover:from-[#309A9E] hover:to-[#00B0B0] text-white flex items-center justify-center shadow-xl shadow-[#00B0B0]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Soporte Planéa 78100777"
        title="Soporte Planéa (78100777)"
      >
        {abierto ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
};
