import React, { useState } from 'react';
import { Lock, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Eye, RefreshCw, ShoppingBag, Store, Tag } from 'lucide-react';
import { TicketData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { DriverModal } from './DriverModal';

interface TicketViewProps {
  stampCount: number;
  totalRequired: number;
  ticket: TicketData;
  onConfirmUseTicket: () => void;
  onNavigateHome: () => void;
  onReset?: () => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  stampCount,
  totalRequired,
  ticket,
  onConfirmUseTicket,
  onNavigateHome,
  onReset,
}) => {
  const { lang, t } = useLanguage();
  const [showDriverModal, setShowDriverModal] = useState(false);
  const remaining = Math.max(0, totalRequired - stampCount);
  const isUnlocked = ticket.isUnlocked || stampCount >= totalRequired;
  const isUsed = ticket.isUsed;

  const localeCode = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-TW' : lang === 'ko' ? 'ko-KR' : 'ja-JP';

  const formattedUsedDate = ticket.usedAt
    ? new Date(ticket.usedAt).toLocaleString(localeCode, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="text-center space-y-1">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-rose-500 border border-pink-200">
          {t('voucherSuperTitle')}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          {t('voucherMainTitle')}
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          {t('voucherSubtitle')}
        </p>
      </div>

      {/* STATE 1: LOCKED (stampCount < 5) */}
      {!isUnlocked && !isUsed && (
        <div className="bg-white/95 rounded-[32px] p-6 border-2 border-dashed border-pink-200 text-center space-y-4 shadow-sm shadow-pink-100 relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 text-rose-400 mx-auto flex items-center justify-center text-2xl shadow-inner border border-pink-100">
            <Lock className="w-7 h-7 text-pink-300" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-700">
              {t('lockedTitle')}
            </h3>
            <p className="text-xs text-rose-400 font-bold">
              {t('lockedRemaining', { remaining })}
            </p>
          </div>

          {/* Voucher preview dummy */}
          <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-pink-100 text-left opacity-80 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-2">
              <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" />
                NICHINAN 1,000 YEN VOUCHER
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-rose-400">
                LOCKED
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-400 font-mono">¥1,000</span>
              <span className="text-xs font-black text-slate-600">{t('lockedPreviewName')}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-relaxed">
              {t('lockedPreviewDesc')}
            </p>
          </div>

          <button
            id="ticket-go-stamp-btn"
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-black shadow-md shadow-pink-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>{t('goToStampBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATE 2: UNLOCKED & ACTIVE (Ready to use) */}
      {isUnlocked && !isUsed && (
        <div className="space-y-4">
          {/* Active Voucher Card with Cutouts & Radiant Gift Style */}
          <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 rounded-[32px] p-5 sm:p-6 text-white shadow-xl shadow-pink-300/40 relative overflow-hidden border-2 border-white/60">
            {/* Ticket side cutouts */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFF8F5] border border-pink-200 shadow-inner" />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FFF8F5] border border-pink-200 shadow-inner" />

            {/* Glowing background circles */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/30 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                <div>
                  <span className="text-[10px] tracking-widest text-pink-100 font-black block">
                    {t('activeVoucherTag')}
                  </span>
                  <span className="text-xs font-black text-white">{t('activeVoucherHeader')}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-rose-500 text-xs font-black shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {t('activeAvailable')}
              </span>
            </div>

            {/* Prominent Value Banner */}
            <div className="bg-white/95 rounded-2xl p-4 text-slate-800 shadow-sm border border-white/60 text-center my-3 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-pink-100/60 rounded-full blur-md" />
              <div className="flex items-center justify-center gap-2">
                <Tag className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black text-rose-500 tracking-wider">{t('activeSpecialCoupon')}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 my-1">
                <span className="text-base font-black text-rose-400">¥</span>
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-800">
                  {t('activeVoucherValue')}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-pink-200">
                  {t('activeVoucherUnit')}
                </span>
              </div>
              <p className="text-xs font-black text-slate-700">
                {t('voucherMainTitle')}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {t('activeVoucherStores')}
              </p>
            </div>

            {/* Voucher Details Bar */}
            <div className="bg-black/15 backdrop-blur-md rounded-2xl p-3.5 grid grid-cols-2 gap-2 text-xs border border-white/20 mb-4">
              <div>
                <span className="text-[10px] text-pink-200 block font-bold">{t('couponNumberLabel')}</span>
                <span className="font-mono font-black tracking-wider text-sm">{ticket.ticketCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-pink-200 block font-bold">{t('termsLabel')}</span>
                <span className="font-black text-sm">{t('termsValue')}</span>
              </div>
            </div>

            {/* Action Button: Present to Store Staff at Cashier */}
            <button
              id="present-to-driver-btn"
              type="button"
              onClick={() => setShowDriverModal(true)}
              className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-pink-50 text-rose-500 font-black text-sm sm:text-base shadow-lg shadow-pink-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5 text-rose-400" />
              <span>{t('presentToCashierBtn')}</span>
              <ArrowRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          {/* Usage Instructions Card */}
          <div className="bg-white/95 rounded-2xl p-4 border border-pink-100 text-xs text-slate-600 space-y-2 shadow-2xs">
            <h4 className="font-black text-slate-700 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              {t('howToUseTitle')}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-500 leading-relaxed font-medium">
              <li>{t('howToUse1')}</li>
              <li>{t('howToUse2')}</li>
              <li>{t('howToUse3')}</li>
              <li>{t('howToUse4')}</li>
            </ul>
          </div>
        </div>
      )}

      {/* STATE 3: USED (使用済み) */}
      {isUsed && (
        <div className="bg-white/95 rounded-[32px] p-6 border-2 border-pink-100 text-center space-y-4 shadow-sm relative overflow-hidden">
          {/* Stamped Watermark */}
          <div className="w-20 h-20 rounded-full border-4 border-rose-300 text-rose-400 mx-auto flex flex-col items-center justify-center transform -rotate-12 select-none shadow-sm bg-pink-50/50">
            <CheckCircle2 className="w-6 h-6 mb-0.5 text-rose-400" />
            <span className="text-[11px] font-black tracking-wider uppercase">{t('usedWatermark')}</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-700">
              {t('usedTitle')}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {t('usedDesc')}
            </p>
            {formattedUsedDate && (
              <p className="text-xs text-rose-400 font-mono mt-1 font-bold">
                {t('usedAtLabel', { date: formattedUsedDate })}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-left text-xs text-slate-600 leading-relaxed font-medium">
            <p className="font-black text-rose-500 mb-1 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-rose-400" />
              {t('usedThankYouTitle')}
            </p>
            <p className="text-slate-500">
              {t('usedThankYouDesc')}
            </p>
          </div>

          {onReset && (
            <button
              id="ticket-reset-btn"
              type="button"
              onClick={onReset}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-pink-200 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4 animate-spin-once" />
              <span>{t('resetTourBtn')}</span>
            </button>
          )}
        </div>
      )}

      {/* Modal: Present to Store Staff at Cashier */}
      {showDriverModal && (
        <DriverModal
          ticket={ticket}
          onClose={() => setShowDriverModal(false)}
          onConfirmUse={() => {
            onConfirmUseTicket();
            setShowDriverModal(false);
          }}
        />
      )}
    </div>
  );
};
