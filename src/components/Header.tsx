import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, FileCode2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  stampCount: number;
  totalRequired: number;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTicket: () => void;
  onOpenCodeExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stampCount,
  totalRequired,
  onReset,
  soundEnabled,
  onToggleSound,
  onOpenTicket,
  onOpenCodeExport,
}) => {
  const isTicketReady = stampCount >= totalRequired;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 text-white shadow-md">
      {/* Top micro announcement */}
      <div className="bg-black/15 px-3 py-1 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 backdrop-blur-xs">
        <span className="inline-block px-1.5 py-0.5 rounded bg-white/25 text-[10px] font-bold">高校生応援</span>
        <span>🌴 日南の魅力をSNSで発信！5スタンプで1回乗車無料 🛺</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white text-orange-600 shadow-sm flex items-center justify-center text-2xl shrink-0 transform -rotate-3 border-2 border-orange-200">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight drop-shadow-xs">
                日南トゥクトゥク巡り
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600/70 border border-emerald-300/40 text-emerald-100 hidden sm:inline-block">
                Navi
              </span>
            </div>
            <p className="text-[11px] text-amber-100/90 font-medium">
              Nichinan TukTuk SNS Stamp Rally
            </p>
          </div>
        </div>

        {/* Action Controls & Stamp status */}
        <div className="flex items-center gap-2">
          {/* Stamp pill */}
          <button
            id="header-stamp-pill"
            type="button"
            onClick={onOpenTicket}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-xs transition-transform active:scale-95 ${
              isTicketReady
                ? 'bg-amber-100 text-orange-700 ring-2 ring-amber-300 animate-pulse'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
            }`}
          >
            {isTicketReady ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>無料券GET!</span>
              </>
            ) : (
              <>
                <span>⭐</span>
                <span>
                  {stampCount} / {totalRequired}
                </span>
              </>
            )}
          </button>

          {/* Code Export button */}
          {onOpenCodeExport && (
            <button
              id="header-code-export-btn"
              type="button"
              onClick={onOpenCodeExport}
              title="単一HTMLコードの取得"
              aria-label="単一HTMLコードの取得"
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <FileCode2 className="w-4 h-4" />
            </button>
          )}

          {/* Sound toggle */}
          <button
            id="header-sound-toggle"
            type="button"
            onClick={onToggleSound}
            aria-label="効果音の切り替え"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/60" />
            )}
          </button>

          {/* Reset progress */}
          <button
            id="header-reset-btn"
            type="button"
            onClick={onReset}
            title="データをリセット"
            aria-label="スタンプのリセット"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
