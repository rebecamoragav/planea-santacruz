import React, { useState } from 'react';
import { Usuario } from '../types';
import { Sparkles, Phone, MessageCircle, Shield, Award, User, LogOut, CalendarCheck } from 'lucide-react';
import { registrarEvento } from '../services/storage';

interface HeaderProps {
  usuario: Usuario | null;
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  onOpenBookings: () => void;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  usuario,
  onOpenRegister,
  onOpenAdmin,
  onOpenBookings,
  onLogout,
  onGoHome,
}) => {
  const [showSupportMenu, setShowSupportMenu] = useState(false);

  const handleSupportClick = (tipo: 'llamada' | 'whatsapp') => {
    registrarEvento('clic_soporte', `Soporte ${tipo}`, 'header', 'Tel: 78100777');
    setShowSupportMenu(false);
    if (tipo === 'llamada') {
      window.location.href = 'tel:78100777';
    } else {
      const mensaje = encodeURIComponent('Hola, necesito ayuda con mi reserva en Planéa.');
      window.open(`https://wa.me/59178100777?text=${mensaje}`, '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFBF6]/90 backdrop-blur-md border-b border-[#E9E5DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo de Planéa */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00B0B0] via-[#309A9E] to-[#4EBAA4] flex items-center justify-center text-white shadow-md shadow-[#00B0B0]/20 group-hover:shadow-lg transition-all">
            <span className="font-heading font-black text-2xl tracking-tighter">P</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-2xl tracking-tight text-[#181611]">
                Plan<span className="text-[#00B0B0]">éa</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E] uppercase tracking-wider">
                SCZ
              </span>
            </div>
            <p className="text-xs text-[#73ADB9] font-medium hidden sm:block">
              Descubre, Planéa y Vive
            </p>
          </div>
        </button>

        {/* Acciones principales */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Soporte 78100777 */}
          <div className="relative">
            <button
              onClick={() => setShowSupportMenu(!showSupportMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F0EAE3] hover:bg-[#E9E5DF] text-[#181611] text-xs sm:text-sm font-semibold transition-all border border-[#DAD6D4]/50"
              title="Soporte y atención al cliente"
            >
              <Phone className="w-4 h-4 text-[#00B0B0]" />
              <span className="hidden md:inline font-mono">78100777</span>
              <span className="md:hidden">Ayuda</span>
            </button>

            {showSupportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E9E5DF] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-[#F0EAE3]">
                  <p className="text-xs font-bold text-[#181611]">Centro de Ayuda Planéa</p>
                  <p className="text-[11px] text-[#958677]">Santa Cruz de la Sierra · 78100777</p>
                </div>
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => handleSupportClick('whatsapp')}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#D3E6E8]/40 text-[#181611] text-xs font-medium text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#4EBAA4]/20 text-[#00B0B0] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-[#00B0B0]" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Escribir por WhatsApp</p>
                      <p className="text-[10px] text-[#958677]">Respuesta en minutos</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSupportClick('llamada')}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F0EAE3] text-[#181611] text-xs font-medium text-left transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#00B0B0]/15 text-[#309A9E] flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#309A9E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs">Llamar a 78100777</p>
                      <p className="text-[10px] text-[#958677]">Atención directa</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Usuario / Sesión */}
          {usuario ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={onOpenBookings}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E9E5DF] hover:border-[#00B0B0]/40 shadow-xs transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#00B0B0]/10 text-[#00B0B0] flex items-center justify-center font-bold text-xs">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-[#181611] leading-tight truncate max-w-[100px]">
                    {usuario.nombre.split(' ')[0]}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#309A9E] font-semibold">
                    <Award className="w-3 h-3 text-[#00B0B0]" />
                    <span>{usuario.puntos || 0} pts</span>
                  </div>
                </div>
              </button>

              <button
                onClick={onOpenBookings}
                className="p-2 rounded-xl text-[#5F7E7C] hover:text-[#00B0B0] hover:bg-[#F0EAE3] transition-colors"
                title="Mis Reservas"
              >
                <CalendarCheck className="w-5 h-5" />
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-[#958677] hover:text-red-500 hover:bg-[#F0EAE3] transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00B0B0] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-[#309A9E] transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Registrarme</span>
            </button>
          )}

          {/* Acceso Admin */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-[#958677] hover:text-[#181611] hover:bg-[#F0EAE3] transition-colors"
            title="Panel de Administración"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
