import React from 'react';
import { Scissors, FileQuestion } from 'lucide-react';
import {
  PromoItem,
  PrintSettings,
  calculateSlotPositions,
  PAGE_WIDTH_IN,
  PAGE_HEIGHT_IN,
} from '../utils/constants';

interface SheetPreviewProps {
  items: (PromoItem | null)[];
  settings: PrintSettings;
  onSlotClick?: (slotIndex: number) => void;
}

export const SheetPreview: React.FC<SheetPreviewProps> = ({
  items,
  settings,
  onSlotClick,
}) => {
  const slots = calculateSlotPositions(settings.spacingMode);
  const { copies, fitMode, cutLineStyle, spacingMode } = settings;

  // Obtenemos el item principal de respaldo si un slot no tiene su propio item
  const primaryItem = items[0] || null;

  return (
    <div className="flex flex-col items-center">
      {/* Indicador superior de hoja */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <span className="font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Vista Previa de Hoja Carta (8.5" × 11")</span>
        </span>
        <span className="text-slate-400 font-mono text-[11px]">
          Escala Proporcional en Pantalla
        </span>
      </div>

      {/* Contenedor de la Hoja de Papel con aspect ratio 8.5 / 11 */}
      <div
        className="w-full max-w-[480px] bg-white rounded-lg shadow-xl border border-slate-300 relative overflow-hidden transition-all select-none print:hidden"
        style={{ aspectRatio: `${PAGE_WIDTH_IN} / ${PAGE_HEIGHT_IN}` }}
      >
        {/* Encabezado técnico miniatura */}
        <div className="absolute top-1 left-0 right-0 text-center text-[7px] text-slate-400 font-mono tracking-tight pointer-events-none">
          Boys & Girls Clubs • Hoja de Impresión Carta (8.5" × 11") • Promos 3.89" × 5.19"
        </div>

        {/* Guías de corte centrales tipo guillotina (si están unidas al centro) */}
        {spacingMode === 'flush' && cutLineStyle !== 'none' && copies >= 2 && (
          <>
            {/* Línea vertical central */}
            <div
              className="absolute top-0 bottom-0 left-1/2 w-px border-l border-slate-300 border-dashed pointer-events-none z-10"
              style={{ transform: 'translateX(-50%)' }}
            >
              {settings.showScissorIcons && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-400 bg-white/90 p-0.5 rounded">
                  <Scissors className="w-2.5 h-2.5 rotate-90" />
                </div>
              )}
            </div>

            {/* Línea horizontal central */}
            {copies >= 3 && (
              <div
                className="absolute left-0 right-0 top-1/2 h-px border-t border-slate-300 border-dashed pointer-events-none z-10"
                style={{ transform: 'translateY(-50%)' }}
              >
                {settings.showScissorIcons && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 bg-white/90 p-0.5 rounded">
                    <Scissors className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 4 Slots de Promos */}
        {slots.map((slot, index) => {
          const isActive = index < copies;
          const slotItem = items[index] || primaryItem;

          // Conversión de pulgadas a porcentajes relativos de la hoja
          const leftPct = (slot.x / PAGE_WIDTH_IN) * 100;
          const topPct = (slot.y / PAGE_HEIGHT_IN) * 100;
          const widthPct = (slot.width / PAGE_WIDTH_IN) * 100;
          const heightPct = (slot.height / PAGE_HEIGHT_IN) * 100;

          const showDashed = cutLineStyle === 'dashed-border' || cutLineStyle === 'both';

          return (
            <div
              key={index}
              onClick={() => onSlotClick && onSlotClick(index)}
              className={`absolute transition-all ${
                isActive
                  ? showDashed
                    ? 'border border-dashed border-slate-400/90'
                    : 'border border-slate-200'
                  : 'border border-dashed border-slate-200/80 bg-slate-50/40 opacity-40'
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${widthPct}%`,
                height: `${heightPct}%`,
              }}
            >
              {/* Marcas de corte en las 4 esquinas de cada tarjeta */}
              {(cutLineStyle === 'crop-marks' || cutLineStyle === 'both') && isActive && (
                <>
                  {/* Esquina Sup Izq */}
                  <div className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t border-l border-slate-500 pointer-events-none" />
                  {/* Esquina Sup Der */}
                  <div className="absolute -top-1.5 -right-1.5 w-2 h-2 border-t border-r border-slate-500 pointer-events-none" />
                  {/* Esquina Inf Izq */}
                  <div className="absolute -bottom-1.5 -left-1.5 w-2 h-2 border-b border-l border-slate-500 pointer-events-none" />
                  {/* Esquina Inf Der */}
                  <div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b border-r border-slate-500 pointer-events-none" />
                </>
              )}

              {/* Contenido del Slot */}
              {isActive ? (
                slotItem ? (
                  <div className="w-full h-full relative overflow-hidden bg-white group cursor-pointer">
                    <img
                      src={slotItem.dataUrl}
                      alt={`Promo Copia ${index + 1}`}
                      className={`w-full h-full ${
                        fitMode === 'cover'
                          ? 'object-cover'
                          : fitMode === 'fill'
                          ? 'object-fill'
                          : 'object-contain'
                      }`}
                    />

                    {/* Badge de Copia */}
                    <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[8px] font-semibold px-1 py-0.5 rounded shadow-xs">
                      #{index + 1}
                    </div>

                    {/* Medida fija oficial */}
                    <div className="absolute bottom-1 right-1 bg-white/90 text-slate-700 text-[8px] font-mono px-1 py-0.2 rounded shadow-2xs">
                      3.89" × 5.19"
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-400 bg-slate-50/60">
                    <FileQuestion className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-medium text-center">Sin arte cargado</span>
                    <span className="text-[8px] text-slate-400">3.89" × 5.19"</span>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-300">
                  <span className="text-[8px] font-medium text-center">Espacio {index + 1} vacío</span>
                  <span className="text-[7px] text-slate-300">(No se imprimirá)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda inferior */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
          <span>Espacios a imprimir: <strong>{copies}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm border border-dashed border-slate-400 bg-white"></span>
          <span>Líneas de corte incluidas</span>
        </div>
      </div>
    </div>
  );
};
