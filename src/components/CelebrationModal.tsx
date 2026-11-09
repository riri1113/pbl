import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface CelebrationModalProps {
  onGoToTicket: () => void;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  onGoToTicket,
  onClose,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        id="celebration-modal-container"
        className="bg-white w-full max-w-sm rounded-[36px] overflow-hidden shadow-2xl border-4 border-pink-150 text-center relative p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-300"
      >
        {/* Confetti / Badge graphics */}
        <div className="w-22 h-22 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 text-white mx-auto flex items-center justify-center text-5xl shadow-xl shadow-pink-300/50 animate-bounce">
          🎉
        </div>

        <div className="space-y-1.5">
          <span className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-rose-500 text-xs font-black tracking-wider uppercase border border-pink-200">
            {t('celebBadge')}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight whitespace-pre-line">
            {t('celebTitle')}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium pt-1">
            {t('celebDesc')}
          </p>
        </div>

        {/* Mini voucher card preview */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 text-white p-4 rounded-2xl shadow-md shadow-pink-200 space-y-1 text-left relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-black opacity-95">
            <span className="flex items-center gap-1">
              <span>🛍️</span>
              <span>NICHINAN 1,000 YEN VOUCHER</span>
            </span>
            <span className="bg-white/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px]">{t('activeAvailable')}</span>
          </div>
          <p className="text-sm font-black drop-shadow-xs">{t('celebVoucherTitle')}</p>
          <p className="text-[10px] text-pink-100 font-medium">{t('celebVoucherSub')}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            id="celebration-view-ticket-btn"
            type="button"
            onClick={() => {
              sounds.playClick();
              onGoToTicket();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm shadow-md shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>{t('celebViewTicket')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
