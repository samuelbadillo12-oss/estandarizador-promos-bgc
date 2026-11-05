import React, { useRef, useState } from 'react';
import { UploadCloud, FileImage, CheckCircle2, RotateCw, Trash2, Clipboard } from 'lucide-react';
import { PromoItem } from '../utils/constants';

interface DropZoneProps {
  primaryItem: PromoItem | null;
  onFilesSelected: (files: File[]) => void;
  onRotate: () => void;
  onRemove: () => void;
  isProcessing: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  primaryItem,
  onFilesSelected,
  onRotate,
  onRemove,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span>1. Subir Arte o Promoción</span>
          {primaryItem && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Listo
            </span>
          )}
        </h2>
        <span className="text-[11px] text-slate-500 font-normal">
          PDF, PNG, JPG, WEBP
        </span>
      </div>

      {!primaryItem ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-slate-50/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800">
                Arrastra tu archivo aquí o <span className="text-blue-600 underline">haz clic para buscar</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Soporta imágenes de cualquier tamaño o documentos PDF
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
              <Clipboard className="w-3 h-3 text-amber-600" />
              <span>Tip: También puedes presionar <strong>Ctrl+V</strong> o <strong>Cmd+V</strong> para pegar</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail */}
            <div className="w-14 h-18 bg-white rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 shadow-xs flex items-center justify-center relative">
              <img
                src={primaryItem.dataUrl}
                alt={primaryItem.name}
                className="w-full h-full object-contain p-0.5"
              />
              <span className="absolute bottom-0 right-0 bg-slate-800 text-white text-[9px] px-1 py-0.2 rounded-tl font-mono">
                {primaryItem.type.toUpperCase()}
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate" title={primaryItem.name}>
                {primaryItem.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Resolución: <span className="font-mono text-slate-700">{primaryItem.width} × {primaryItem.height} px</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Rotación actual: <span className="font-mono text-blue-700 font-medium">{primaryItem.rotation}°</span>
              </p>
            </div>
          </div>

          {/* Quick controls on file */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onRotate}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
              title="Girar imagen 90 grados a la derecha"
            >
              <RotateCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Girar 90°</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
              title="Cambiar archivo por otro"
            >
              <FileImage className="w-3.5 h-3.5 text-slate-500" />
              <span>Cambiar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.pdf"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <button
              onClick={onRemove}
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
              title="Quitar archivo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="mt-2 text-center text-xs text-blue-600 flex items-center justify-center gap-2 py-1">
          <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Procesando archivo en alta resolución...</span>
        </div>
      )}
    </div>
  );
};
