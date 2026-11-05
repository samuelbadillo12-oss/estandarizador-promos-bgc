import React from 'react';
import {
  Printer,
  Download,
  Scissors,
  Maximize2,
  Grid,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  PrintSettings,
  CutLineStyle,
  SIZE_PRESETS,
} from '../utils/constants';

interface ControlPanelProps {
  settings: PrintSettings;
  onUpdateSettings: (newSettings: Partial<PrintSettings>) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  hasItem: boolean;
  isGeneratingPdf: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onUpdateSettings,
  onPrint,
  onDownloadPdf,
  hasItem,
  isGeneratingPdf,
}) => {
  const copiesOptions: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-6">
      {/* 1. Selector de Copias */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-blue-600" />
            <span>2. Cantidad de Copias en Hoja Carta</span>
          </label>
          <span className="text-xs text-slate-500 font-medium">
            {settings.copies} de 4 espacios
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {copiesOptions.map((num) => {
            const isSelected = settings.copies === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onUpdateSettings({ copies: num })}
                className={`py-2.5 px-3 rounded-xl text-center font-medium text-xs transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-sm font-bold">{num}</span>
                <span className="text-[10px] opacity-90">
                  {num === 1 ? 'Copia' : num === 4 ? 'Llenar Hoja' : 'Copias'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tamaño y Proporción de los Mini Flyers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>3. Tamaño y Proporción</span>
          </label>
          <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {settings.cardWidth.toFixed(2)}" × {settings.cardHeight.toFixed(2)}"
          </span>
        </div>

        <div className="space-y-1.5">
          {SIZE_PRESETS.map((preset) => {
            const isSelected = settings.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    presetId: preset.id,
                    cardWidth: preset.width,
                    cardHeight: preset.height,
                  })
                }
                className={`w-full p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{preset.name}</span>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {preset.badge}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Modo de Ajuste del Arte */}
      <div>
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
          <span>4. Ajuste de Imagen</span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onUpdateSettings({ fitMode: 'contain' })}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              settings.fitMode === 'contain'
                ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Ajustar Completo (Contain)</span>
              {settings.fitMode === 'contain' && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              No corta nada del contenido original. Recomendado para no perder textos ni fechas.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ fitMode: 'cover' })}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              settings.fitMode === 'cover'
                ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Llenar Todo (Cover)</span>
              {settings.fitMode === 'cover' && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Llena todo el espacio sin bordes blancos, recortando excesos proporcionales.
            </p>
          </button>
        </div>
      </div>

      {/* 4. Guías de Corte y Guillotina */}
      <div>
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Scissors className="w-3.5 h-3.5 text-blue-600" />
          <span>5. Líneas y Marcas de Corte</span>
        </label>

        <div className="space-y-2">
          {/* Estilo de guías */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'both', label: 'Marcas + Punteado', desc: 'Guillotina y tijeras' },
              { id: 'crop-marks', label: 'Marcas de Imprenta', desc: 'Guías en márgenes' },
              { id: 'dashed-border', label: 'Línea Punteada', desc: 'Contorno de corte' },
              { id: 'none', label: 'Sin Líneas', desc: 'Arte limpio' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onUpdateSettings({ cutLineStyle: opt.id as CutLineStyle })}
                className={`px-3 py-2 rounded-lg text-left text-xs border transition-all ${
                  settings.cutLineStyle === opt.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-medium'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{opt.label}</span>
                  {settings.cutLineStyle === opt.id && <Check className="w-3 h-3 text-blue-600" />}
                </div>
                <span className="text-[10px] text-slate-500">{opt.desc}</span>
              </button>
            ))}
          </div>

          {/* Espaciado entre tarjetas */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Distribución de corte:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => onUpdateSettings({ spacingMode: 'flush' })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  settings.spacingMode === 'flush'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Unidas al centro: 1 corte recto divide ambas filas y columnas"
              >
                Unidas al centro (Guillotina)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ spacingMode: 'separated' })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  settings.spacingMode === 'separated'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Con pequeña separación individual"
              >
                Separadas (3 mm)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Botones de Acción de Impresión */}
      <div className="pt-3 border-t border-slate-200 space-y-2.5">
        <button
          type="button"
          disabled={!hasItem}
          onClick={onPrint}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
            hasItem
              ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99] cursor-pointer shadow-blue-500/20 ring-2 ring-blue-500/30'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Printer className="w-5 h-5" />
          <span>Imprimir Ahora (100% Escala)</span>
        </button>

        <button
          type="button"
          disabled={!hasItem || isGeneratingPdf}
          onClick={onDownloadPdf}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all border ${
            hasItem && !isGeneratingPdf
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-slate-400 shadow-2xs'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          {isGeneratingPdf ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Generando PDF Alta Resolución...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-600" />
              <span>Descargar PDF Listo para Imprenta (Carta 300 DPI)</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          💡 En el diálogo de impresión, asegúrate de elegir <strong>Tamaño Carta (US Letter)</strong> y escala <strong>100% (Tamaño Real)</strong>.
        </p>
      </div>
    </div>
  );
};
