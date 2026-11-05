import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DropZone } from './components/DropZone';
import { ControlPanel } from './components/ControlPanel';
import { SheetPreview } from './components/SheetPreview';
import { PrintSheet } from './components/PrintSheet';
import { HelpModal } from './components/HelpModal';
import {
  PromoItem,
  PrintSettings,
  DEFAULT_SETTINGS,
} from './utils/constants';
import { parsePromoFile, rotatePromoItem } from './utils/fileParser';
import { generatePrintPdf } from './utils/pdfGenerator';
import { AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [items, setItems] = useState<(PromoItem | null)[]>([null, null, null, null]);
  const [settings, setSettings] = useState<PrintSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'controls' | 'preview'>('controls');

  const primaryItem = items[0] || null;

  // Actualizar configuraciones parciales
  const handleUpdateSettings = (newSettings: Partial<PrintSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Manejo de carga de archivos (imágenes o PDF)
  const handleFilesSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const allExtractedItems: PromoItem[] = [];

      for (const file of files) {
        const parsed = await parsePromoFile(file);
        allExtractedItems.push(...parsed);
      }

      if (allExtractedItems.length === 1) {
        // Un solo archivo: asignarlo a la posición principal
        setItems([allExtractedItems[0], null, null, null]);
      } else {
        // Múltiples páginas o múltiples imágenes: llenar hasta 4 slots
        const newSlots: (PromoItem | null)[] = [null, null, null, null];
        for (let i = 0; i < Math.min(allExtractedItems.length, 4); i++) {
          newSlots[i] = allExtractedItems[i];
        }
        setItems(newSlots);
        // Si hay más de 1 arte, ajustar copias al número de artes cargados
        setSettings((prev) => ({
          ...prev,
          copies: Math.min(allExtractedItems.length, 4) as 1 | 2 | 3 | 4,
        }));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error al procesar el archivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Escuchar evento global de pegar desde portapapeles (Ctrl+V / Cmd+V)
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const files: File[] = [];
    if (clipboardData.files && clipboardData.files.length > 0) {
      for (let i = 0; i < clipboardData.files.length; i++) {
        files.push(clipboardData.files[i]);
      }
    } else if (clipboardData.items) {
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) files.push(blob);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      handleFilesSelected(files);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Rotar el arte 90 grados
  const handleRotate = async () => {
    if (!primaryItem) return;
    try {
      setIsProcessing(true);
      const rotated = await rotatePromoItem(primaryItem, 90);
      setItems((prev) => [rotated, prev[1], prev[2], prev[3]]);
    } catch (err: any) {
      setErrorMessage('No se pudo rotar la imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quitar el arte cargado
  const handleRemove = () => {
    setItems([null, null, null, null]);
  };

  // Imprimir directo con el diálogo del navegador
  const handlePrint = () => {
    if (!primaryItem) return;
    window.print();
  };

  // Descargar PDF de alta resolución listo para imprenta
  const handleDownloadPdf = async () => {
    if (!primaryItem) return;

    try {
      setIsGeneratingPdf(true);
      const doc = await generatePrintPdf(items, settings);
      
      const cleanFileName = primaryItem.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      
      doc.save(`Promo_BGC_${cleanFileName}_3.89x5.19_Carta.pdf`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Error al generar el archivo PDF. Intenta imprimir directamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenHelp={() => setIsHelpOpen(true)}
        cardWidth={settings.cardWidth}
        cardHeight={settings.cardHeight}
      />

      {/* Alerta de Error si ocurre */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full print:hidden">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 hover:bg-red-100 rounded text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full print:hidden">
        {/* Selector de Pestañas en Móvil */}
        <div className="lg:hidden flex rounded-xl bg-slate-200/90 p-1 mb-5 shadow-inner">
          <button
            type="button"
            onClick={() => setMobileTab('controls')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mobileTab === 'controls'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ Ajustes y Archivo
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📄 Ver Hoja Carta</span>
            {primaryItem && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Carga y Controles */}
          <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'controls' ? 'block' : 'hidden lg:block'}`}>
            <DropZone
              primaryItem={primaryItem}
              onFilesSelected={handleFilesSelected}
              onRotate={handleRotate}
              onRemove={handleRemove}
              isProcessing={isProcessing}
            />

            <ControlPanel
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onPrint={handlePrint}
              onDownloadPdf={handleDownloadPdf}
              hasItem={Boolean(primaryItem)}
              isGeneratingPdf={isGeneratingPdf}
            />
          </div>

          {/* Columna Derecha: Previsualización de la Hoja */}
          <div className={`lg:col-span-6 lg:sticky lg:top-6 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-slate-200/60 rounded-2xl p-5 border border-slate-300/80 shadow-inner flex flex-col items-center">
              <SheetPreview
                items={items}
                settings={settings}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Hoja de Impresión Invisible en Pantalla pero Activa para @media print */}
      <PrintSheet items={items} settings={settings} />

      {/* Modal de Ayuda */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

