import React, { useState } from 'react';
import { Usuario } from '../types';
import { registrarUsuario } from '../services/storage';
import { Sparkles, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onSuccess: (usuario: Usuario) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  canClose = false,
}) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (!nombreLimpio) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!correoLimpio || !correoLimpio.includes('@') || !correoLimpio.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setCargando(true);
    setTimeout(() => {
      try {
        const { usuario, esNuevo } = registrarUsuario(nombreLimpio, correoLimpio);
        if (!esNuevo) {
          setMensajeExito(`¡Qué gusto verte de nuevo, ${usuario.nombre}!`);
        } else {
          setMensajeExito(`¡Bienvenido a Planéa, ${usuario.nombre}!`);
        }

        setTimeout(() => {
          setCargando(false);
          onSuccess(usuario);
        }, 700);
      } catch (err) {
        setError('Ocurrió un error al registrarte. Intenta nuevamente.');
        setCargando(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00B0B0] to-[#4EBAA4] text-white shadow-lg shadow-[#00B0B0]/25 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
            ¡Empecemos a <span className="text-[#00B0B0]">Planear</span>!
          </h2>
          <p className="text-sm text-[#5F7E7C] mt-2">
            Regístrate en un instante para descubrir y reservar los mejores planes en Santa Cruz de la Sierra.
          </p>
        </div>

        {mensajeExito ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#4EBAA4] mx-auto animate-bounce" />
            <p className="font-heading font-bold text-lg text-[#181611]">{mensajeExito}</p>
            <p className="text-xs text-[#958677]">Ingresando a la plataforma...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Tu Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#958677]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ej. Valeria Justiniano"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#DAD6D4] focus:border-[#00B0B0] focus:ring-2 focus:ring-[#00B0B0]/20 text-[#181611] text-sm outline-none transition-all placeholder:text-[#B0AFAD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#958677]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@gmail.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#DAD6D4] focus:border-[#00B0B0] focus:ring-2 focus:ring-[#00B0B0]/20 text-[#181611] text-sm outline-none transition-all placeholder:text-[#B0AFAD]"
                />
              </div>
              <p className="text-[11px] text-[#958677] mt-1.5">
                Tu correo se usa para identificar tus reservas y recompensas de planes.
              </p>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#00B0B0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{cargando ? 'Guardando...' : 'Continuar a Planéa'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-[#958677] hover:text-[#181611] transition-colors"
              >
                Cerrar y continuar como invitado
              </button>
            )}
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#E9E5DF] text-center">
          <p className="text-[11px] text-[#958677]">
            Al continuar aceptas vivir la experiencia sin el estrés de organizar. ✨
          </p>
        </div>
      </div>
    </div>
  );
};
