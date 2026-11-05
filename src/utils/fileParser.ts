import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PromoItem } from './constants';

// Configurar el worker de PDF.js para Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/**
 * Lee y analiza un archivo de imagen o PDF y lo transforma en un PromoItem con dimensiones y preview.
 */
export async function parsePromoFile(file: File): Promise<PromoItem[]> {
  const fileType = file.type.toLowerCase();

  if (fileType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return parsePdfFile(file);
  }

  if (fileType.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i.test(file.name)) {
    const item = await parseImageFile(file);
    return [item];
  }

  throw new Error(`Formato no soportado (${file.name}). Por favor sube una imagen (PNG, JPG) o un documento PDF.`);
}

/**
 * Convierte un archivo de imagen en un PromoItem
 */
export function parseImageFile(file: File): Promise<PromoItem> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          id: `promo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          dataUrl,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height),
          type: 'image',
          rotation: 0,
        });
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen. El archivo puede estar dañado.'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Extrae las páginas de un archivo PDF y las convierte en imágenes de alta resolución
 */
export async function parsePdfFile(file: File): Promise<PromoItem[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const results: PromoItem[] = [];

  // Extraer hasta las primeras 4 páginas si el PDF es multipágina
  const pagesToLoad = Math.min(pdfDoc.numPages, 4);

  for (let pageNum = 1; pageNum <= pagesToLoad; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    
    // Usamos escala 3.0 para obtener excelente nitidez (equivalente a calidad de imprenta 300 DPI)
    const viewport = page.getViewport({ scale: 3.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('No se pudo inicializar el contexto gráfico para renderizar el PDF.');
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const dataUrl = canvas.toDataURL('image/png', 0.95);

    results.push({
      id: `promo-pdf-p${pageNum}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: pdfDoc.numPages > 1 ? `${file.name} (Pág. ${pageNum})` : file.name,
      dataUrl,
      width: viewport.width,
      height: viewport.height,
      aspectRatio: viewport.width / viewport.height,
      type: 'pdf',
      rotation: 0,
    });
  }

  return results;
}

/**
 * Rota un PromoItem en múltiplos de 90 grados y recalcula el aspect ratio
 */
export function rotatePromoItem(item: PromoItem, degrees: 90 | -90): Promise<PromoItem> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Si gira 90 o 270, se intercambian ancho y alto
      const is90or270 = Math.abs(degrees) === 90;
      canvas.width = is90or270 ? img.height : img.width;
      canvas.height = is90or270 ? img.width : img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedDataUrl = canvas.toDataURL('image/png');
      const newRotation = ((item.rotation + degrees) % 360 + 360) % 360;

      resolve({
        ...item,
        dataUrl: rotatedDataUrl,
        width: canvas.width,
        height: canvas.height,
        aspectRatio: canvas.width / canvas.height,
        rotation: newRotation,
      });
    };
    img.src = item.dataUrl;
  });
}

