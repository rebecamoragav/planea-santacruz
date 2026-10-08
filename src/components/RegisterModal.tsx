import React, { useState, useEffect } from 'react';
import { Usuario } from '../types';
import { 
  registrarUsuario, 
  getUsuarios, 
  setUsuarioActual, 
  getUsuarioRecordado, 
  buscarUsuarioPorCorreo 
} from '../services/storage';
import { Sparkles, Mail, User, Phone, ArrowRight, CheckCircle2, X, LogIn, UserCheck } from 'lucide-react';

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
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [usuarioRecordado, setUsuarioRecordado] = useState<Usuario | null>(null);
  const [usuarioDetectado, setUsuarioDetectado] = useState<Usuario | null>(null);

  // Al abrir el modal, verificar si hay un usuario previo recordado en este dispositivo
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setMensajeExito(null);
      setCargando(false);
      setUsuarioDetectado(null);

      const recordado = getUsuarioRecordado();
      setUsuarioRecordado(recordado);

      if (recordado) {
        setCorreo(recordado.correo);
        setNombre(recordado.nombre);
        setTelefono(recordado.telefono || '');
        setUsuarioDetectado(recordado);
      } else {
        setNombre('');
        setCorreo('');
        setTelefono('');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Si escribe un correo que ya existe, auto-detectarlo amistosamente tanto en local como en Firestore
  const handleCorreoChange = async (val: string) => {
    setCorreo(val);
    setError(null);

    const correoLimpio = val.trim().toLowerCase();
    if (correoLimpio && correoLimpio.includes('@')) {
      // 1. Detección rápida local
      const usuarios = getUsuarios();
      const matchLocal = usuarios.find(u => u.correo && u.correo.toLowerCase() === correoLimpio);
      if (matchLocal) {
        setUsuarioDetectado(matchLocal);
        if (!nombre || nombre === '') {
          setNombre(matchLocal.nombre);
        }
        if (matchLocal.telefono && (!telefono || telefono === '')) {
          setTelefono(matchLocal.telefono);
        }
        return;
      }

      // 2. Detección en Firestore si tiene formato de email completo
      if (correoLimpio.includes('.')) {
        try {
          const matchRemoto = await buscarUsuarioPorCorreo(correoLimpio);
          if (matchRemoto) {
            setUsuarioDetectado(matchRemoto);
            if (!nombre || nombre === '') {
              setNombre(matchRemoto.nombre);
            }
            if (matchRemoto.telefono && (!telefono || telefono === '')) {
              setTelefono(matchRemoto.telefono);
            }
            return;
          }
        } catch {
          // Ignorar fallos de red en autocompletado
        }
      }
    } else {
      setUsuarioDetectado(null);
    }
  };

  const handleIngresarDirecto = (user: Usuario) => {
    setError(null);
    setCargando(true);
    setMensajeExito(`¡Qué gusto verte de nuevo, ${user.nombre}!`);

    // Sincronizar de forma segura
    const { usuario } = registrarUsuario(user.nombre, user.correo, user.telefono);

    setTimeout(() => {
      setCargando(false);
      setMensajeExito(null);
      onSuccess(usuario);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const correoLimpio = correo.trim().toLowerCase();
    let nombreLimpio = nombre.trim();
    const telefonoLimpio = telefono.trim();

    if (!correoLimpio || !correoLimpio.includes('@') || !correoLimpio.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido (ej. tu_correo@gmail.com).');
      return;
    }

    setCargando(true);

    try {
      // 1. Buscar si el usuario ya ingresó antes (en memoria local, recordado o Firestore)
      let usuarioExistente = usuarioDetectado;
      if (!usuarioExistente) {
        usuarioExistente = await buscarUsuarioPorCorreo(correoLimpio);
      }

      // Si ya existía antes:
      if (usuarioExistente) {
        const nombreFinal = nombreLimpio || usuarioExistente.nombre || 'Usuario Planéa';
        const telefonoFinal = telefonoLimpio || usuarioExistente.telefono;

        const { usuario } = registrarUsuario(nombreFinal, correoLimpio, telefonoFinal || undefined);
        setMensajeExito(`¡Qué gusto verte de nuevo, ${usuario.nombre}!`);

        setTimeout(() => {
          setCargando(false);
          setMensajeExito(null);
          onSuccess(usuario);
        }, 500);
        return;
      }

      // 2. Si es un nuevo usuario sin cuenta previa, requerir el nombre
      if (!nombreLimpio) {
        setError('Por favor ingresa tu nombre para crear tu perfil y guardar tus puntos.');
        setCargando(false);
        return;
      }

      const { usuario, esNuevo } = registrarUsuario(nombreLimpio, correoLimpio, telefonoLimpio || undefined);

      if (esNuevo) {
        setMensajeExito(`¡Bienvenido a Planéa, ${usuario.nombre}!`);
      } else {
        setMensajeExito(`¡Qué gusto verte de nuevo, ${usuario.nombre}!`);
      }

      setTimeout(() => {
        setCargando(false);
        setMensajeExito(null);
        onSuccess(usuario);
      }, 500);
    } catch (err) {
      console.error('Error seguro en ingreso:', err);
      // Fallback a prueba de fallos: registrar usuario localmente para que nunca se bloquee
      const fallbackNombre = nombreLimpio || 'Usuario Planéa';
      const { usuario } = registrarUsuario(fallbackNombre, correoLimpio, telefonoLimpio || undefined);
      setMensajeExito(`¡Bienvenido, ${usuario.nombre}!`);
      setTimeout(() => {
        setCargando(false);
        setMensajeExito(null);
        onSuccess(usuario);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FCFBF6] rounded-3xl shadow-2xl border border-[#E9E5DF] overflow-hidden p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre superior si se puede cerrar */}
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#958677] hover:text-[#181611] hover:bg-[#F0EAE3] transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Encabezado */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00B0B0] to-[#4EBAA4] text-white shadow-lg shadow-[#00B0B0]/25 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#181611]">
            Iniciar Sesión en <span className="text-[#00B0B0]">Planéa</span>
          </h2>
          <p className="text-sm text-[#5F7E7C] mt-1.5">
            Ingresa tu correo para reservar tus experiencias y acumular puntos en Santa Cruz.
          </p>
        </div>

        {/* Notificación si ya ingresaste antes en este dispositivo (Te recuerda) */}
        {usuarioRecordado && !mensajeExito && (
          <div className="p-3.5 rounded-2xl bg-white border border-[#00B0B0]/30 shadow-xs flex items-center justify-between mb-5 animate-in fade-in">
            <div className="flex items-center gap-2.5 overflow-hidden pr-2">
              <div className="w-9 h-9 rounded-full bg-[#00B0B0]/15 text-[#00B0B0] font-bold text-xs flex items-center justify-center shrink-0">
                {usuarioRecordado.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-bold text-xs text-[#181611] leading-tight truncate">
                  ¿Eres {usuarioRecordado.nombre.split(' ')[0]}?
                </p>
                <p className="text-[10px] text-[#958677] truncate">{usuarioRecordado.correo}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleIngresarDirecto(usuarioRecordado)}
              disabled={cargando}
              className="px-3 py-1.5 rounded-xl bg-[#00B0B0] hover:bg-[#309A9E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {mensajeExito ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#4EBAA4] mx-auto animate-bounce" />
            <p className="font-heading font-bold text-lg text-[#181611]">{mensajeExito}</p>
            <p className="text-xs text-[#958677]">Ingresando a la plataforma...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold animate-in fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Correo Electrónico *
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
                  onChange={(e) => handleCorreoChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#DAD6D4] focus:border-[#00B0B0] focus:ring-2 focus:ring-[#00B0B0]/20 text-[#181611] text-sm outline-none transition-all placeholder:text-[#B0AFAD]"
                />
              </div>

              {/* Mensaje de reconocimiento automático si el correo ya ingresó antes */}
              {usuarioDetectado ? (
                <div className="mt-2 px-3 py-2 rounded-xl bg-[#00B0B0]/10 border border-[#00B0B0]/20 flex items-center gap-2 text-xs text-[#008282] font-medium animate-in fade-in">
                  <UserCheck className="w-4 h-4 text-[#00B0B0] shrink-0" />
                  <span>
                    ¡Bienvenido de nuevo, <strong>{usuarioDetectado.nombre}</strong>! Tu cuenta ha sido detectada.
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-[#958677] mt-1.5">
                  Si ya tienes reservas o cuenta previa, te recordará automáticamente.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Tu Nombre {usuarioDetectado ? '(Registrado)' : '*'}</span>
                {usuarioDetectado && (
                  <span className="text-[10px] text-[#00B0B0] font-normal">Detectado automáticamente</span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#958677]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required={!usuarioDetectado}
                  placeholder="Ej. Valeria Justiniano"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#DAD6D4] focus:border-[#00B0B0] focus:ring-2 focus:ring-[#00B0B0]/20 text-[#181611] text-sm outline-none transition-all placeholder:text-[#B0AFAD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#181611] uppercase tracking-wider mb-1.5">
                Teléfono / WhatsApp (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#958677]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  placeholder="Ej. 78100777"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[#DAD6D4] focus:border-[#00B0B0] focus:ring-2 focus:ring-[#00B0B0]/20 text-[#181611] text-sm outline-none transition-all placeholder:text-[#B0AFAD]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#00B0B0] hover:bg-[#309A9E] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-[#00B0B0]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {cargando 
                  ? 'Ingresando...' 
                  : usuarioDetectado 
                    ? `Ingresar como ${usuarioDetectado.nombre.split(' ')[0]}` 
                    : 'Iniciar Sesión'}
              </span>
            </button>

            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-semibold text-[#958677] hover:text-[#181611] transition-colors cursor-pointer"
              >
                Cerrar y continuar explorando
              </button>
            )}
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#E9E5DF] text-center">
          <p className="text-[11px] text-[#958677]">
            Tus datos se guardan de forma segura para tus reservas en Santa Cruz. ✨
          </p>
        </div>
      </div>
    </div>
  );
};
