import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, FileCode2, Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';
import { SupportedLang } from '../types';

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
  const { lang, setLang, t, languages } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const isTicketReady = stampCount >= totalRequired;

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isLangMenuOpen]);

  const handleSelectLang = (code: SupportedLang) => {
    sounds.playClick();
    setLang(code);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 text-white shadow-md shadow-pink-200/40">
      {/* Top micro announcement */}
      <div className="bg-white/20 px-3 py-1 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 backdrop-blur-md border-b border-white/20">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-rose-500 text-[10px] font-black shadow-xs">
          <span>🎀</span>
          <span>{t('announcementBadge')}</span>
        </span>
        <span className="text-white text-[11px] drop-shadow-xs font-bold">
          {t('announcementText')}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2.5">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-white/95 text-rose-500 shadow-sm flex items-center justify-center text-2xl shrink-0 transform -rotate-3 border-2 border-white">
            🌴
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-sm sm:text-base tracking-tight leading-tight text-white drop-shadow-xs truncate">
                {t('appTitle')}
              </h1>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-white text-rose-500 shadow-xs shrink-0 hidden xs:inline-block">
                {t('appBadge')}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-pink-100 font-bold tracking-wider truncate">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Controls & Stamp status */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Stamp pill */}
          <button
            id="header-stamp-pill"
            type="button"
            onClick={onOpenTicket}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full font-black text-xs shadow-xs transition-transform active:scale-95 ${
              isTicketReady
                ? 'bg-white text-rose-500 ring-2 ring-yellow-200 animate-pulse'
                : 'bg-white/25 text-white hover:bg-white/35 backdrop-blur-md border border-white/30'
            }`}
          >
            {isTicketReady ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="text-[11px] sm:text-xs">{t('voucherBadgeUnlocked')}</span>
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

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              id="header-lang-btn"
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsLangMenuOpen((prev) => !prev);
              }}
              title={t('language')}
              aria-label={t('language')}
              aria-haspopup="true"
              aria-expanded={isLangMenuOpen}
              className="h-8 px-2 rounded-full bg-white/20 hover:bg-white/30 flex items-center gap-1 text-white text-xs font-bold transition-all border border-white/25 active:scale-95 backdrop-blur-xs"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline font-bold">{currentLangObj.nativeLabel}</span>
              <Globe className="w-3.5 h-3.5 opacity-80 sm:hidden" />
            </button>

            {isLangMenuOpen && (
              <div
                id="lang-dropdown-menu"
                className="absolute right-0 top-10 z-50 w-44 bg-white rounded-2xl shadow-xl border-2 border-pink-100 py-1.5 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-1 text-[10px] font-black text-rose-400 uppercase tracking-wider border-b border-pink-50">
                  {t('selectLanguage')}
                </div>
                {languages.map((item) => {
                  const isSelected = item.code === lang;
                  return (
                    <button
                      key={item.code}
                      id={`lang-option-${item.code}`}
                      type="button"
                      onClick={() => handleSelectLang(item.code)}
                      className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-pink-50 text-rose-500 font-black'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <div>
                          <span>{item.nativeLabel}</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            ({item.label})
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-rose-500 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Code Export button */}
          {onOpenCodeExport && (
            <button
              id="header-code-export-btn"
              type="button"
              onClick={onOpenCodeExport}
              title={t('codeExportTooltip')}
              aria-label={t('codeExportTooltip')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20"
            >
              <FileCode2 className="w-4 h-4" />
            </button>
          )}

          {/* Sound toggle */}
          <button
            id="header-sound-toggle"
            type="button"
            onClick={onToggleSound}
            aria-label={t('soundToggleTooltip')}
            title={t('soundToggleTooltip')}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20"
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
            title={t('resetTooltip')}
            aria-label={t('resetTooltip')}
            className="h-8 px-2 sm:px-2.5 rounded-full bg-white/20 hover:bg-white/30 flex items-center gap-1 text-white hover:text-white transition-colors text-xs font-bold border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('reset')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
