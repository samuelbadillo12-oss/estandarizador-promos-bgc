import React from 'react';
import { X, Printer, Scissors, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs print:hidden animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-sky-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Guía de Uso e Impresión</h3>
              <p className="text-xs text-blue-100">Estandarizador de Promociones BGCPR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-sm text-slate-600">
          {/* Dimensiones Oficiales */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Medidas y Proporciones
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed">
              Para artes creados en <strong>Canva (8.5" × 11.0")</strong>, la medida recomendada es <strong className="text-blue-900">4.00" de ancho × 5.18" de alto</strong>.
              Esto garantiza que el flyer llene el espacio por completo, eliminando espacios blancos y haciendo que las líneas de corte queden exactamente en los bordes del arte.
              También puedes seleccionar <strong>Cuarto de Hoja (4.25" × 5.50")</strong> o la medida clásica <strong>3.89" × 5.19"</strong>.
            </p>
          </div>

          {/* Pasos */}
          <div className="space-y-3.5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">
              Flujo de Trabajo Rápido
            </h4>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-800 text-xs">Sube tu archivo o pégalo</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arrastra una imagen (PNG, JPG) o un documento PDF. También puedes presionar <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 text-[10px] font-mono">Ctrl+V</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 text-[10px] font-mono">Cmd+V</kbd> si copiaste la imagen de WhatsApp, Teams o correo.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-800 text-xs">Elige la cantidad de copias</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona de 1 a 4 copias. Al seleccionar 4, la hoja se llena automáticamente optimizando el uso de papel.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-800 text-xs">Imprime o Descarga el PDF</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Haz clic en <strong>"Imprimir Ahora"</strong> o descarga el PDF listo para enviar a cualquier impresora de la oficina.
                </p>
              </div>
            </div>
          </div>

          {/* Ajustes de Impresora Críticos */}
          <div className="border border-amber-200 bg-amber-50/70 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-amber-700" />
              Configuración Crítica de la Impresora
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Para garantizar que el tamaño físico sea exactamente 3.89" × 5.19", en la ventana de impresión de tu computadora asegúrate de:
            </p>
            <ul className="text-xs text-amber-900 space-y-1 list-disc pl-4">
              <li>
                Elegir papel <strong>Carta (US Letter / 8.5 × 11 pulg)</strong>.
              </li>
              <li>
                Seleccionar escala <strong>100% o "Tamaño Real / Actual Size"</strong> (NUNCA "Ajustar al área de impresión" o "Fit to Printable Area").
              </li>
              <li>
                Desmarcar la casilla de <strong>"Encabezados y pies de página"</strong>.
              </li>
            </ul>
          </div>

          {/* Cómo Cortar */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-slate-600" />
              Instrucciones de Corte con Guillotina
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Con la opción <strong>"Unidas al centro"</strong>, solo necesitas hacer:
            </p>
            <ol className="text-xs text-slate-700 space-y-1 list-decimal pl-4 mt-1">
              <li>1 corte recto por la línea central vertical.</li>
              <li>1 corte recto por la línea central horizontal.</li>
              <li>Recortar los bordes exteriores guiándote por las marcas de imprenta (crop marks).</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};
