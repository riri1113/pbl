import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const handleConfirm = () => {
    sounds.playStampSound();
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-[36px] overflow-hidden shadow-2xl border-2 border-pink-100 flex flex-col p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-rose-500 flex items-center justify-center shadow-xs">
            <RotateCcw className="w-6 h-6 animate-spin-once" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-800">
            {t('resetDialogTitle')}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {t('resetDialogDesc')}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-medium">{t('resetDialogWarning')}</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black shadow-md shadow-pink-200 active:scale-95 transition-all"
          >
            {t('confirmReset')}
          </button>
        </div>
      </div>
    </div>
  );
};
