import React, { useMemo } from 'react';
import { QrCode, Copy, Check, ShieldCheck } from 'lucide-react';

interface QrReferenciaProps {
  idReserva: string;
  montoBs: number;
  nombrePlan: string;
  titular?: string;
}

export const QrReferencia: React.FC<QrReferenciaProps> = ({
  idReserva,
  montoBs,
  nombrePlan,
  titular = 'Planéa Santa Cruz SRL',
}) => {
  const [copiado, setCopiado] = React.useState(false);

  // Generador de matriz determinista para el QR basado en el ID y monto
  const qrMatrix = useMemo(() => {
    const size = 21;
    const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

    // Función para dibujar los 3 marcadores de posición en las esquinas
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 || // Marco exterior
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)     // Centro sólido
          ) {
            matrix[startY + r][startX + c] = true;
          }
        }
      }
    };

    drawFinder(0, 0);         // Arriba izquierda
    drawFinder(size - 7, 0);  // Arriba derecha
    drawFinder(0, size - 7);  // Abajo izquierda

    // Barras de sincronización
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Patrón pseudo-aleatorio basado en el ID para simular los datos del QR de Bolivia
    let hash = 0;
    const str = `${idReserva}-${montoBs}-PLANEASCZ`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Evitar esquinas protegidas
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= size - 8;
        const inBottomLeft = r >= size - 8 && c < 8;
        const inCenterLogo = r >= 8 && r <= 12 && c >= 8 && c <= 12;

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenterLogo) {
          const bit = Math.abs(Math.sin((r * size + c) + hash)) > 0.48;
          matrix[r][c] = bit;
        }
      }
    }

    return matrix;
  }, [idReserva, montoBs]);

  const handleCopiarGlosa = () => {
    navigator.clipboard.writeText(`Reserva ${idReserva}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E9E5DF] shadow-sm text-center">
      
      {/* Encabezado QR Simple */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE3] mb-4">
        <div className="flex items-center gap-2 text-left">
          <div className="w-7 h-7 rounded-lg bg-[#00B0B0]/15 text-[#00B0B0] flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#181611] block leading-tight">
              QR Referencial de Pago
            </span>
            <span className="text-[10px] text-[#5F7E7C]">Simple · Interoperable Bolivia</span>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D3E6E8] text-[#309A9E]">
          Banca Móvil
        </span>
      </div>

      {/* Contenedor del QR Visual */}
      <div className="relative inline-block p-4 rounded-2xl bg-[#FCFBF6] border-2 border-dashed border-[#00B0B0]/40 shadow-inner my-1">
        <svg 
          viewBox="0 0 21 21" 
          className="w-40 h-40 mx-auto text-[#181611]" 
          shapeRendering="crispEdges"
        >
          {qrMatrix.map((row, r) =>
            row.map((active, c) =>
              active ? (
                <rect 
                  key={`${r}-${c}`} 
                  x={c} 
                  y={r} 
                  width="1" 
                  height="1" 
                  fill="currentColor" 
                />
              ) : null
            )
          )}
        </svg>

        {/* Insignia central de Planéa */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-lg bg-[#00B0B0] text-white flex items-center justify-center font-heading font-black text-xs shadow-md border-2 border-white">
            P
          </div>
        </div>
      </div>

      {/* Datos del pago referencial */}
      <div className="mt-3.5 space-y-1.5 text-xs text-[#5F7E7C] bg-[#FCFBF6] p-3 rounded-2xl border border-[#E9E5DF]">
        <div className="flex justify-between items-center">
          <span className="text-[#958677]">Monto a cancelar:</span>
          <span className="font-heading font-black text-base text-[#00B0B0]">
            Bs {montoBs}
          </span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[#958677]">Destinatario:</span>
          <span className="font-semibold text-[#181611]">{titular}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#F0EAE3]">
          <span className="text-[#958677]">Glosa / Ref:</span>
          <button
            type="button"
            onClick={handleCopiarGlosa}
            className="flex items-center gap-1 font-mono font-bold text-[#181611] hover:text-[#00B0B0] transition-colors"
            title="Copiar glosa"
          >
            <span>{idReserva}</span>
            {copiado ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#958677]" />}
          </button>
        </div>
      </div>

      <p className="text-[10px] text-[#958677] mt-2.5 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#4EBAA4]" />
        <span>Válido para BCP, BNB, Mercantil, Unión, Ganadero, GanaMóvil y Fassil</span>
      </p>

    </div>
  );
};
