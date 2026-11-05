import React from 'react';
import {
  PromoItem,
  PrintSettings,
  calculateSlotPositions,
  PAGE_WIDTH_IN,
  PAGE_HEIGHT_IN,
} from '../utils/constants';

interface PrintSheetProps {
  items: (PromoItem | null)[];
  settings: PrintSettings;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({ items, settings }) => {
  const slots = calculateSlotPositions(settings.spacingMode);
  const { copies, fitMode, cutLineStyle, spacingMode } = settings;
  const primaryItem = items[0] || null;

  return (
    <div
      id="printable-sheet"
      className="hidden print:block bg-white text-black relative overflow-hidden"
      style={{
        width: `${PAGE_WIDTH_IN}in`,
        height: `${PAGE_HEIGHT_IN}in`,
        margin: '0 auto',
        padding: 0,
        boxSizing: 'border-box',
        pageBreakAfter: 'avoid',
        pageBreakInside: 'avoid',
      }}
    >
      {/* Texto técnico tenue en el margen superior */}
      <div
        style={{
          position: 'absolute',
          top: '0.12in',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '7pt',
          color: '#94a3b8',
          fontFamily: 'sans-serif',
        }}
      >
        Boys & Girls Clubs • Estandarizador de Promociones (3.89" × 5.19") • Imprimir a escala 100% (Sin ajustar)
      </div>

      {/* Slots con imágenes y líneas de corte */}
      {slots.map((slot, index) => {
        if (index >= copies) return null;
        const slotItem = items[index] || primaryItem;
        if (!slotItem) return null;

        const showDashed = cutLineStyle === 'dashed-border' || cutLineStyle === 'both';

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${slot.x}in`,
              top: `${slot.y}in`,
              width: `${slot.width}in`,
              height: `${slot.height}in`,
              boxSizing: 'border-box',
              border: showDashed ? '0.5pt dashed #94a3b8' : 'none',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
            }}
          >
            <img
              src={slotItem.dataUrl}
              alt={`Promo ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: fitMode === 'cover' ? 'cover' : fitMode === 'fill' ? 'fill' : 'contain',
                display: 'block',
              }}
            />
          </div>
        );
      })}

      {/* Marcas de corte tipo imprenta (Crop Marks) en los márgenes exteriores */}
      {(cutLineStyle === 'crop-marks' || cutLineStyle === 'both') && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${PAGE_WIDTH_IN}in`,
            height: `${PAGE_HEIGHT_IN}in`,
            pointerEvents: 'none',
          }}
        >
          {/* Marcas para los slots activos */}
          {slots.slice(0, copies).map((slot, idx) => {
            const markLen = 0.18; // pulgadas
            const markOffset = 0.03; // separación del borde

            // Coordenadas
            const left = slot.x;
            const right = slot.x + slot.width;
            const top = slot.y;
            const bottom = slot.y + slot.height;

            return (
              <g key={`marks-${idx}`} stroke="#64748b" strokeWidth="0.5" strokeDasharray="none">
                {/* Esquina superior izquierda */}
                <line x1={`${left}in`} y1={`${top - markOffset - markLen}in`} x2={`${left}in`} y2={`${top - markOffset}in`} />
                <line x1={`${left - markOffset - markLen}in`} y1={`${top}in`} x2={`${left - markOffset}in`} y2={`${top}in`} />

                {/* Esquina superior derecha */}
                <line x1={`${right}in`} y1={`${top - markOffset - markLen}in`} x2={`${right}in`} y2={`${top - markOffset}in`} />
                <line x1={`${right + markOffset}in`} y1={`${top}in`} x2={`${right + markOffset + markLen}in`} y2={`${top}in`} />

                {/* Esquina inferior izquierda */}
                <line x1={`${left}in`} y1={`${bottom + markOffset}in`} x2={`${left}in`} y2={`${bottom + markOffset + markLen}in`} />
                <line x1={`${left - markOffset - markLen}in`} y1={`${bottom}in`} x2={`${left - markOffset}in`} y2={`${bottom}in`} />

                {/* Esquina inferior derecha */}
                <line x1={`${right}in`} y1={`${bottom + markOffset}in`} x2={`${right}in`} y2={`${bottom + markOffset + markLen}in`} />
                <line x1={`${right + markOffset}in`} y1={`${bottom}in`} x2={`${right + markOffset + markLen}in`} y2={`${bottom}in`} />
              </g>
            );
          })}

          {/* Línea central de guillotina para corte rápido si están unidas */}
          {spacingMode === 'flush' && copies >= 2 && (
            <g stroke="#64748b" strokeWidth="0.5">
              {/* Ticks superior e inferior del centro vertical */}
              <line
                x1={`${PAGE_WIDTH_IN / 2}in`}
                y1="0.05in"
                x2={`${PAGE_WIDTH_IN / 2}in`}
                y2={`${slots[0].y - 0.03}in`}
              />
              <line
                x1={`${PAGE_WIDTH_IN / 2}in`}
                y1={`${slots[2] ? slots[2].y + slots[2].height + 0.03 : slots[0].y + slots[0].height + 0.03}in`}
                x2={`${PAGE_WIDTH_IN / 2}in`}
                y2={`${PAGE_HEIGHT_IN - 0.05}in`}
              />

              {/* Ticks laterales del centro horizontal si hay 3 o 4 copias */}
              {copies >= 3 && (
                <>
                  <line
                    x1="0.05in"
                    y1={`${PAGE_HEIGHT_IN / 2}in`}
                    x2={`${slots[0].x - 0.03}in`}
                    y2={`${PAGE_HEIGHT_IN / 2}in`}
                  />
                  <line
                    x1={`${slots[1].x + slots[1].width + 0.03}in`}
                    y1={`${PAGE_HEIGHT_IN / 2}in`}
                    x2={`${PAGE_WIDTH_IN - 0.05}in`}
                    y2={`${PAGE_HEIGHT_IN / 2}in`}
                  />
                </>
              )}
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
