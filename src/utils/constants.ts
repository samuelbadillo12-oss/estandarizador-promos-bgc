/**
 * Dimensiones y constantes para el estandarizador de promociones de Boys & Girls Clubs.
 * Dimensiones oficiales: 3.89 pulgadas de ancho por 5.19 pulgadas de alto en papel Carta (8.5 x 11 pulgadas).
 */

export const CARD_WIDTH_IN = 3.89;
export const CARD_HEIGHT_IN = 5.19;

export const PAGE_WIDTH_IN = 8.5;
export const PAGE_HEIGHT_IN = 11.0;

// Puntos tipográficos (1 pulgada = 72 pt)
export const POINTS_PER_INCH = 72;
export const CARD_WIDTH_PT = CARD_WIDTH_IN * POINTS_PER_INCH; // 280.08 pt
export const CARD_HEIGHT_PT = CARD_HEIGHT_IN * POINTS_PER_INCH; // 373.68 pt
export const PAGE_WIDTH_PT = PAGE_WIDTH_IN * POINTS_PER_INCH; // 612 pt
export const PAGE_HEIGHT_PT = PAGE_HEIGHT_IN * POINTS_PER_INCH; // 792 pt

// Milímetros (1 pulgada = 25.4 mm)
export const MM_PER_INCH = 25.4;
export const CARD_WIDTH_MM = CARD_WIDTH_IN * MM_PER_INCH; // ~98.81 mm
export const CARD_HEIGHT_MM = CARD_HEIGHT_IN * MM_PER_INCH; // ~131.83 mm

// Proporción de aspecto (Aspect Ratio)
export const CARD_ASPECT_RATIO = CARD_WIDTH_IN / CARD_HEIGHT_IN; // ~0.7495

export type FitMode = 'contain' | 'cover' | 'fill';
export type CutLineStyle = 'crop-marks' | 'dashed-border' | 'both' | 'none';
export type SpacingMode = 'flush' | 'separated';

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
}

export const DEFAULT_SETTINGS: PrintSettings = {
  copies: 4,
  fitMode: 'contain',
  cutLineStyle: 'both',
  spacingMode: 'flush',
  showScissorIcons: true,
  highQualityPdf: true,
};

/**
 * Calcula las coordenadas exactas de los 4 slots en la página carta en pulgadas.
 * @param spacingMode 'flush' (unidas al centro) o 'separated' (con separación)
 */
export function calculateSlotPositions(spacingMode: SpacingMode = 'flush') {
  const gap = spacingMode === 'separated' ? 0.12 : 0; // 0.12 pulg (~3 mm) de separación
  
  const totalGridWidth = 2 * CARD_WIDTH_IN + gap;
  const totalGridHeight = 2 * CARD_HEIGHT_IN + gap;
  
  const marginLeft = (PAGE_WIDTH_IN - totalGridWidth) / 2;
  const marginTop = (PAGE_HEIGHT_IN - totalGridHeight) / 2;

  return [
    // Slot 0: Arriba Izquierda
    {
      col: 0,
      row: 0,
      x: marginLeft,
      y: marginTop,
      width: CARD_WIDTH_IN,
      height: CARD_HEIGHT_IN,
    },
    // Slot 1: Arriba Derecha
    {
      col: 1,
      row: 0,
      x: marginLeft + CARD_WIDTH_IN + gap,
      y: marginTop,
      width: CARD_WIDTH_IN,
      height: CARD_HEIGHT_IN,
    },
    // Slot 2: Abajo Izquierda
    {
      col: 0,
      row: 1,
      x: marginLeft,
      y: marginTop + CARD_HEIGHT_IN + gap,
      width: CARD_WIDTH_IN,
      height: CARD_HEIGHT_IN,
    },
    // Slot 3: Abajo Derecha
    {
      col: 1,
      row: 1,
      x: marginLeft + CARD_WIDTH_IN + gap,
      y: marginTop + CARD_HEIGHT_IN + gap,
      width: CARD_WIDTH_IN,
      height: CARD_HEIGHT_IN,
    },
  ];
}

