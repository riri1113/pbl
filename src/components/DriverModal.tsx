import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { TicketData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface DriverModalProps {
  ticket: TicketData;
  onClose: () => void;
  onConfirmUse: () => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  ticket,
  onClose,
  onConfirmUse,
}) => {
  const { lang, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Live anti-counterfeit animated clock showing milliseconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleTriggerConfirm = () => {
    sounds.playClick();
    setShowConfirmDialog(true);
  };

  const handleFinalUse = () => {
    sounds.playStampSound();
    onConfirmUse();
  };

  const localeCode = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-TW' : lang === 'ko' ? 'ko-KR' : 'ja-JP';

  const timeString = currentTime.toLocaleTimeString(localeCode, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const msString = Math.floor(currentTime.getMilliseconds() / 100);
  const dateString = currentTime.toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="driver-modal-container"
        className="bg-white w-full max-w-md rounded-[36px] overflow-hidden shadow-2xl border-4 border-pink-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Security Strip */}
        <div className="bg-gradient-to-r from-rose-300 via-pink-300 to-amber-200 py-1.5 px-4 text-[10px] font-black tracking-widest text-slate-800 flex items-center justify-between uppercase overflow-hidden">
          <span className="flex items-center gap-1 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            {t('cashierSecurityHeader')}
          </span>
          <span className="font-mono text-rose-700">{ticket.ticketCode}</span>
        </div>

        {/* Modal Top Close */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 p-4 text-white relative">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white text-rose-500 flex items-center justify-center text-2xl shadow-md border-2 border-pink-100 animate-bounce">
              🛍️
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wider">
                {t('cashierBadge')}
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow-xs">
                {t('cashierModalTitle')}
              </h3>
            </div>
          </div>
        </div>

        {/* Dynamic Verification Content */}
        <div className="p-5 space-y-4 bg-gradient-to-b from-[#FFF8F5] to-white">
          {/* Anti-Fraud Real-Time Animated Security Clock */}
          <div className="bg-slate-900 text-white rounded-[24px] p-4 text-center shadow-inner relative overflow-hidden border border-slate-800">
            {/* Moving background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-pulse pointer-events-none" />

            <div className="flex items-center justify-center gap-1.5 text-xs text-pink-300 font-black mb-1">
              <Clock className="w-3.5 h-3.5 text-pink-300" />
              <span>{t('cashierAntiCounterfeit')}</span>
            </div>

            <p className="text-xs text-slate-400 mb-0.5 font-medium">{dateString}</p>

            <div className="font-mono text-3xl sm:text-4xl font-black tracking-wider text-pink-300 drop-shadow-sm flex items-center justify-center gap-1">
              <span>{timeString}</span>
              <span className="text-xl text-yellow-300">.{msString}</span>
            </div>

            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-400/50 text-[11px] text-pink-200 font-black">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              <span>{t('cashierValidNotice')}</span>
            </div>
          </div>

          {/* Ticket Information Card */}
          <div className="p-4 rounded-2xl bg-white border-2 border-pink-100 shadow-sm space-y-2.5">
            <div className="flex justify-between items-center border-b border-pink-100 pb-2">
              <span className="text-xs font-bold text-slate-400">{t('cashierBenefitLabel')}</span>
              <span className="text-xs font-black text-rose-500 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                {t('cashierDiscountAmount')}
              </span>
            </div>

            <div className="text-center py-1">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-rose-500 font-mono">
                <span>¥1,000</span>
                <span className="text-xs text-slate-600 font-bold">OFF</span>
              </div>
              <h4 className="text-base font-black text-slate-800">
                {t('voucherMainTitle')}
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {t('cashierSubtext')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-pink-100">
              <div className="bg-[#FFF9F6] p-2.5 rounded-xl border border-pink-100/60">
                <span className="text-slate-400 block font-bold">{t('couponNumberLabel')}</span>
                <span className="font-mono font-black text-slate-700">{ticket.ticketCode}</span>
              </div>
              <div className="bg-[#FFF9F6] p-2.5 rounded-xl border border-pink-100/60">
                <span className="text-slate-400 block font-bold">{t('termsLabel')}</span>
                <span className="font-black text-slate-700">{t('cashierStoreNoticeTarget')}</span>
              </div>
            </div>
          </div>

          {/* Store Clerk Guidance Box (Japanese prompt prominent so local staff can read it immediately + translated helper) */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium space-y-1">
              <p>
                <strong className="font-black">{t('cashierClerkNoticeTitle')}</strong>
                {t('cashierClerkNoticeBody')}
              </p>
              {lang !== 'ja' && (
                <p className="text-[11px] text-amber-700 font-bold border-t border-amber-200/60 pt-1">
                  {t('cashierClerkSubtitle')}
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-1">
            <button
              id="confirm-use-ticket-btn"
              type="button"
              onClick={handleTriggerConfirm}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm sm:text-base shadow-md shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-white" />
              <span>{t('cashierCompleteBtn')}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium mt-1.5">
              {t('cashierWarningTap')}
            </p>
          </div>
        </div>

        {/* Double-Check Confirmation Overlay Dialog */}
        {showConfirmDialog && (
          <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-[32px] p-5 max-w-xs w-full text-center shadow-2xl border-2 border-pink-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-rose-500 mx-auto flex items-center justify-center text-2xl">
                🛍️
              </div>
              <h4 className="font-black text-base text-slate-800">
                {t('confirmDialogTitle')}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t('confirmDialogDesc')}
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="dialog-confirm-final-use"
                  type="button"
                  onClick={handleFinalUse}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs shadow-md shadow-pink-200"
                >
                  {t('confirmDialogYes')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                >
                  {t('confirmDialogNo')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
