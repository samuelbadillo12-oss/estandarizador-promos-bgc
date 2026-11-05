import { jsPDF } from 'jspdf';
import {
  PAGE_WIDTH_IN,
  PAGE_HEIGHT_IN,
  calculateSlotPositions,
  PromoItem,
  PrintSettings,
} from './constants';

/**
 * Prepara un Canvas con la imagen ajustada (contain/cover/fill) según las medidas exactas
 */
function prepareSlotCanvas(
  item: PromoItem,
  fitMode: PrintSettings['fitMode'],
  targetWidthPx: number = 3.89 * 300, // 300 DPI
  targetHeightPx: number = 5.19 * 300 // 300 DPI
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidthPx;
      canvas.height = targetHeightPx;
      const ctx = canvas.getContext('2d')!;

      // Fondo blanco limpio
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);

      const srcRatio = img.width / img.height;
      const targetRatio = targetWidthPx / targetHeightPx;

      if (fitMode === 'fill') {
        // Estirar para llenar
        ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);
      } else if (fitMode === 'cover') {
        // Llenar recortando bordes sobrantes
        let renderW = targetWidthPx;
        let renderH = targetHeightPx;
        let offsetX = 0;
        let offsetY = 0;

        if (srcRatio > targetRatio) {
          renderH = targetHeightPx;
          renderW = targetHeightPx * srcRatio;
          offsetX = (targetWidthPx - renderW) / 2;
        } else {
          renderW = targetWidthPx;
          renderH = targetWidthPx / srcRatio;
          offsetY = (targetHeightPx - renderH) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, targetWidthPx, targetHeightPx);
        ctx.clip();
        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
        ctx.restore();
      } else {
        // Contain: Proporción original con márgenes limpios
        let renderW = targetWidthPx;
        let renderH = targetHeightPx;
        let offsetX = 0;
        let offsetY = 0;

        if (srcRatio > targetRatio) {
          renderW = targetWidthPx;
          renderH = targetWidthPx / srcRatio;
          offsetY = (targetHeightPx - renderH) / 2;
        } else {
          renderH = targetHeightPx;
          renderW = targetHeightPx * srcRatio;
          offsetX = (targetWidthPx - renderW) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = item.dataUrl;
  });
}

/**
 * Genera un archivo PDF vectorial y rasterizado a 300 DPI con las dimensiones físicas exactas.
 */
export async function generatePrintPdf(
  items: (PromoItem | null)[],
  settings: PrintSettings
): Promise<jsPDF> {
  // Crear documento PDF tamaño Letter en pulgadas
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [PAGE_WIDTH_IN, PAGE_HEIGHT_IN],
    compress: true,
  });

  const slots = calculateSlotPositions(settings.spacingMode);
  const copiesCount = settings.copies;

  // Encabezado técnico en el margen superior (fuera de la zona de corte)
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(
    'Boys & Girls Clubs • Estandarizador de Promociones (3.89" × 5.19") • IMPORTANTE: Imprimir al 100% de escala (Tamaño Real)',
    PAGE_WIDTH_IN / 2,
    0.18,
    { align: 'center' }
  );

  // Renderizar cada slot ocupado
  for (let i = 0; i < copiesCount; i++) {
    const slot = slots[i];
    const item = items[i] || items[0]; // Si no hay en el slot i, usar el primero

    if (item) {
      const slotImageJpeg = await prepareSlotCanvas(item, settings.fitMode);
      doc.addImage(
        slotImageJpeg,
        'JPEG',
        slot.x,
        slot.y,
        slot.width,
        slot.height,
        undefined,
        'FAST'
      );
    } else {
      // Slot vacío: dibujar marco tenue
      doc.setDrawColor(226, 232, 240);
      doc.setLineDashPattern([0.05, 0.05], 0);
      doc.rect(slot.x, slot.y, slot.width, slot.height);
      doc.text('Slot Vacío', slot.x + slot.width / 2, slot.y + slot.height / 2, { align: 'center' });
    }
  }

  // Dibujar líneas y marcas de corte
  drawCutGuides(doc, slots, settings);

  return doc;
}

/**
 * Dibuja las marcas de corte profesionales (crop marks) y líneas guía de corte
 */
function drawCutGuides(
  doc: jsPDF,
  slots: ReturnType<typeof calculateSlotPositions>,
  settings: PrintSettings
) {
  const { cutLineStyle, spacingMode } = settings;
  if (cutLineStyle === 'none') return;

  const markLen = 0.20; // Longitud de marcas de corte en pulgadas
  const markOffset = 0.04; // Separación respecto al borde de la imagen

  doc.setLineWidth(0.006); // Línea fina de precisión (aprox 0.43 pt)
  doc.setDrawColor(148, 163, 184); // slate-400

  // 1. Marcas de corte tipo imprenta en los márgenes exteriores (Crop Marks)
  if (cutLineStyle === 'crop-marks' || cutLineStyle === 'both') {
    doc.setLineDashPattern([], 0); // Línea sólida continua

    // Recolectar todas las coordenadas de corte únicas X e Y
    const xCoords = new Set<number>();
    const yCoords = new Set<number>();

    slots.slice(0, settings.copies).forEach((s) => {
      xCoords.add(s.x);
      xCoords.add(s.x + s.width);
      yCoords.add(s.y);
      yCoords.add(s.y + s.height);
    });

    // Ticks verticales en bordes superior e inferior
    xCoords.forEach((x) => {
      // Arriba
      doc.line(x, Math.max(0.05, slots[0].y - markOffset - markLen), x, slots[0].y - markOffset);
      // Abajo
      const bottomY = slots[2]?.y ? slots[2].y + slots[2].height : slots[0].y + slots[0].height;
      doc.line(x, bottomY + markOffset, x, Math.min(PAGE_HEIGHT_IN - 0.05, bottomY + markOffset + markLen));
    });

    // Ticks horizontales en bordes izquierdo y derecho
    yCoords.forEach((y) => {
      // Izquierda
      doc.line(Math.max(0.05, slots[0].x - markOffset - markLen), y, slots[0].x - markOffset, y);
      // Derecha
      const rightX = slots[1]?.x ? slots[1].x + slots[1].width : slots[0].x + slots[0].width;
      doc.line(rightX + markOffset, y, Math.min(PAGE_WIDTH_IN - 0.05, rightX + markOffset + markLen), y);
    });

    // Si están unidas al centro ('flush'), dibujar marcas en la cruz central
    if (spacingMode === 'flush' && settings.copies >= 2) {
      const centerX = PAGE_WIDTH_IN / 2;
      const centerY = PAGE_HEIGHT_IN / 2;

      // Línea central de guillotina vertical en márgenes
      doc.line(centerX, 0.05, centerX, slots[0].y - markOffset);
      doc.line(centerX, slots[2].y + slots[2].height + markOffset, centerX, PAGE_HEIGHT_IN - 0.05);

      if (settings.copies >= 3) {
        // Línea central horizontal en márgenes
        doc.line(0.05, centerY, slots[0].x - markOffset, centerY);
        doc.line(slots[1].x + slots[1].width + markOffset, centerY, PAGE_WIDTH_IN - 0.05, centerY);
      }
    }
  }

  // 2. Líneas punteadas perimetrales alrededor de cada promo (ideal para tijeras)
  if (cutLineStyle === 'dashed-border' || cutLineStyle === 'both') {
    doc.setLineDashPattern([0.04, 0.04], 0); // Punteado suave
    doc.setDrawColor(180, 190, 205); // Gris suave tenue

    slots.slice(0, settings.copies).forEach((s) => {
      doc.rect(s.x, s.y, s.width, s.height);
    });
  }
}
