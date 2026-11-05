/**
 * Dimensiones y constantes para el estandarizador de promociones de Boys & Girls Clubs.
 * Soporta proporción exacta de flyers de Canva (8.5 × 11), cuarto de hoja y medida clásica BGC.
 */

export const PAGE_WIDTH_IN = 8.5;
export const PAGE_HEIGHT_IN = 11.0;

// Puntos tipográficos (1 pulgada = 72 pt)
export const POINTS_PER_INCH = 72;
export const PAGE_WIDTH_PT = PAGE_WIDTH_IN * POINTS_PER_INCH; // 612 pt
export const PAGE_HEIGHT_PT = PAGE_HEIGHT_IN * POINTS_PER_INCH; // 792 pt

// Milímetros (1 pulgada = 25.4 mm)
export const MM_PER_INCH = 25.4;

export type FitMode = 'contain' | 'cover' | 'fill';
export type CutLineStyle = 'crop-marks' | 'dashed-border' | 'both' | 'none';
export type SpacingMode = 'flush' | 'separated';
export type PresetId = 'canva' | 'quarter' | 'classic';

export interface SizePreset {
  id: PresetId;
  name: string;
  badge: string;
  description: string;
  width: number;
  height: number;
}

export const SIZE_PRESETS: SizePreset[] = [
  {
    id: 'canva',
    name: 'Canva 8.5×11 (Recomendado)',
    badge: '4.00" × 5.18"',
    description: 'Proporción idéntica a Canva. Líneas de corte pegadas al arte, cero espacio blanco.',
    width: 4.00,
    height: 5.18,
  },
  {
    id: 'quarter',
    name: 'Cuarto de Hoja Completo',
    badge: '4.25" × 5.50"',
    description: 'Divide la hoja carta en 4 partes iguales de borde a borde (2 cortes centrales).',
    width: 4.25,
    height: 5.50,
  },
  {
    id: 'classic',
    name: 'BGC Clásico',
    badge: '3.89" × 5.19"',
    description: 'Medida histórica anterior de 3.89" × 5.19".',
    width: 3.89,
    height: 5.19,
  },
];

export interface PromoItem {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  type: 'image' | 'pdf';
  rotation: number; // 0, 90, 180, 270
}

export interface PrintSettings {
  copies: 1 | 2 | 3 | 4;
  fitMode: FitMode;
  cutLineStyle: CutLineStyle;
  spacingMode: SpacingMode;
  showScissorIcons: boolean;
  highQualityPdf: boolean;
  presetId: PresetId;
  cardWidth: number;
  cardHeight: number;
}

export const DEFAULT_SETTINGS: PrintSettings = {
  copies: 4,
  fitMode: 'contain',
  cutLineStyle: 'both',
  spacingMode: 'flush',
  showScissorIcons: true,
  highQualityPdf: true,
  presetId: 'canva',
  cardWidth: 4.00,
  cardHeight: 5.18,
};

/**
 * Calcula las coordenadas exactas de los 4 slots en la página carta en pulgadas.
 * @param cardWidth Ancho de la tarjeta en pulgadas (default 4.00)
 * @param cardHeight Alto de la tarjeta en pulgadas (default 5.18)
 * @param spacingMode 'flush' (unidas al centro) o 'separated' (con separación)
 */
export function calculateSlotPositions(
  cardWidth: number = 4.00,
  cardHeight: number = 5.18,
  spacingMode: SpacingMode = 'flush'
) {
  const gap = spacingMode === 'separated' ? 0.12 : 0; // 0.12 pulg (~3 mm) de separación
  
  const totalGridWidth = 2 * cardWidth + gap;
  const totalGridHeight = 2 * cardHeight + gap;
  
  const marginLeft = (PAGE_WIDTH_IN - totalGridWidth) / 2;
  const marginTop = (PAGE_HEIGHT_IN - totalGridHeight) / 2;

  return [
    // Slot 0: Arriba Izquierda
    {
      col: 0,
      row: 0,
      x: marginLeft,
      y: marginTop,
      width: cardWidth,
      height: cardHeight,
    },
    // Slot 1: Arriba Derecha
    {
      col: 1,
      row: 0,
      x: marginLeft + cardWidth + gap,
      y: marginTop,
      width: cardWidth,
      height: cardHeight,
    },
    // Slot 2: Abajo Izquierda
    {
      col: 0,
      row: 1,
      x: marginLeft,
      y: marginTop + cardHeight + gap,
      width: cardWidth,
      height: cardHeight,
    },
    // Slot 3: Abajo Derecha
    {
      col: 1,
      row: 1,
      x: marginLeft + cardWidth + gap,
      y: marginTop + cardHeight + gap,
      width: cardWidth,
      height: cardHeight,
    },
  ];
}
