import React, { useState } from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';

interface FloatingAiChatButtonProps {
  onClick: () => void;
}

export const FloatingAiChatButton: React.FC<FloatingAiChatButtonProps> = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* Speech bubble badge */}
      {showTooltip && (
        <div className="pointer-events-auto flex items-center gap-2 bg-[#121624] text-white px-3.5 py-2 rounded-2xl border border-red-500/50 shadow-xl animate-bounce shadow-black/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-300">Ask Maths Expert AI</span>
            <span className="text-zinc-400 hidden sm:inline"> • Instant Math Solver</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-zinc-400 hover:text-white p-0.5"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={onClick}
        className="pointer-events-auto group relative flex items-center gap-2.5 p-1.5 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-2xl shadow-red-950/80 border-2 border-red-400/60 transition-all transform hover:scale-105 active:scale-95"
        title="Open Maths Expert AI Doubt Solver"
      >
        {/* Real Photo Avatar */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-black shrink-0">
          <img
            src="/satyam_sir_real.jpg"
            alt="Satyam Sir Faculty"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/satyam_sir.jpg';
            }}
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121624] animate-pulse" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide">
            <span>Maths Expert</span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 text-[9px] text-amber-300 font-bold border border-amber-400/40">
              AI
            </span>
          </div>
          <span className="text-[11px] text-zinc-100 font-medium leading-none mt-0.5">
            Doubt Solver &amp; Demo
          </span>
        </div>
      </button>
    </div>
  );
};
