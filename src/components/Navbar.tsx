import React from 'react';
import { Printer, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHelp }) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center shadow-inner">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                Estandarizador de Promociones
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                BGCPR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tamaño Oficial: <span className="text-sky-300 font-semibold">3.89" × 5.19"</span> (Papel Carta 8.5" × 11")
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
            title="Instrucciones de uso e impresión"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Guía de Impresión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

