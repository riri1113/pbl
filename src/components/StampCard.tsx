import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Spot, StampRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StampCardProps {
  stamps: StampRecord[];
  spots: Spot[];
  totalRequired: number;
  onNavigateTicket: () => void;
  onSelectSpot: (spot: Spot) => void;
  onQuickDemoAdd?: () => void;
}

export const StampCard: React.FC<StampCardProps> = ({
  stamps,
  spots,
  totalRequired,
  onNavigateTicket,
  onSelectSpot,
  onQuickDemoAdd,
}) => {
  const { t } = useLanguage();
  const currentCount = stamps.length;
  const progressPercent = Math.min(100, (currentCount / totalRequired) * 100);
  const isComplete = currentCount >= totalRequired;

  return (
    <div className="bg-white/95 rounded-[32px] p-5 sm:p-6 shadow-sm shadow-pink-100/60 border-2 border-pink-100/90 relative overflow-hidden backdrop-blur-xs">
      {/* Background cute pastel blobs */}
      <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-gradient-to-br from-pink-100/60 via-purple-100/40 to-amber-100/30 -z-0 pointer-events-none blur-md" />
      <div className="absolute top-2 right-4 text-3xl opacity-20 pointer-events-none select-none">
        ✨
      </div>

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-sm font-black shadow-xs shadow-pink-200">
              🏷️
            </span>
            <div>
              <h2 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-1.5">
                <span>{t('stampCardTitle')}</span>
                <span className="text-xs font-normal text-rose-400 tracking-wider">♡ STAMP RALLY</span>
              </h2>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-pink-50 text-rose-500 border border-pink-200/80 shadow-2xs">
            {t('stampCardBadge', { count: currentCount, total: totalRequired })}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
          {t('stampCardDesc')}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 font-medium">
              {isComplete ? (
                <span className="text-emerald-500 flex items-center gap-1 font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('stampCompleted')}
                </span>
              ) : (
                <span className="text-rose-500 font-bold flex items-center gap-1">
                  <span>🐾</span>
                  <span>{t('stampRemaining', { remaining: totalRequired - currentCount })}</span>
                </span>
              )}
            </span>
            <span className="text-rose-400 font-black">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3.5 w-full bg-pink-50 rounded-full overflow-hidden p-0.5 border border-pink-200/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stamp slots (5 cute Korean sticker card slots) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 my-2">
          {Array.from({ length: totalRequired }).map((_, index) => {
            const stamp = stamps[index];
            const spot = stamp ? spots.find((s) => s.id === stamp.spotId) : null;
            const isFilled = !!stamp;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5"
                onClick={() => {
                  if (spot) {
                    onSelectSpot(spot);
                  }
                }}
              >
                <div
                  className={`w-13 h-14 sm:w-16 sm:h-18 rounded-[20px] flex flex-col items-center justify-center transition-all duration-300 relative ${
                    isFilled
                      ? 'bg-gradient-to-b from-rose-400 to-pink-500 text-white shadow-md shadow-pink-300/40 ring-2 ring-pink-200 transform scale-100 cursor-pointer hover:scale-105 hover:-rotate-2'
                      : 'border-2 border-dashed border-pink-200 bg-white/70 text-pink-300 hover:border-pink-300 hover:bg-pink-50/40'
                  }`}
                  title={isFilled ? `${spot?.name ?? t('stampedBadge')} - ${spot?.stampName ?? ''} (${t('stampSlotDetailsHint')})` : `${t('stampSlotSpot')} ${index + 1}`}
                >
                  {isFilled ? (
                    <div className="text-center p-1 flex flex-col items-center w-full">
                      <div className="relative">
                        <span className="text-xl sm:text-2xl drop-shadow-xs select-none">
                          {spot?.stampIcon || '⭐'}
                        </span>
                        <div className="absolute -bottom-1 -right-1 bg-yellow-300 text-yellow-900 text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-2xs">
                          ★
                        </div>
                      </div>
                      <span className="text-[9px] font-black tracking-tight line-clamp-1 mt-0.5 text-yellow-100 max-w-[54px] truncate">
                        {spot?.stampShort || t('stampSlotCleared')}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-xs font-black text-pink-300/80">
                        0{index + 1}
                      </span>
                      <span className="block text-[8px] font-bold text-pink-300/80">
                        {t('stampSlotWaiting')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Spot Mini Label */}
                <span className="text-[10px] text-center font-bold text-slate-600 line-clamp-1 max-w-[62px]">
                  {spot ? spot.name.split('（')[0].split('(')[0] : `${t('stampSlotSpot')} ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Congratulations Banner or Ticket Action */}
        {isComplete ? (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-2 border-pink-200 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center text-xl shrink-0 shadow-sm shadow-pink-300 animate-bounce">
                🛍️
              </div>
              <div>
                <p className="text-xs font-black text-rose-600">
                  {t('homeCongratsTitle')}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {t('homeCongratsSubtitle')}
                </p>
              </div>
            </div>

            <button
              id="stamp-card-ticket-btn"
              type="button"
              onClick={onNavigateTicket}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-pink-200 active:scale-95 transition-all shrink-0"
            >
              <span>{t('useVoucherBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-pink-100/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              {t('chooseSpotsHint')}
            </span>
            {onQuickDemoAdd && currentCount < totalRequired && (
              <button
                type="button"
                onClick={onQuickDemoAdd}
                className="text-[10px] text-rose-400 hover:text-rose-500 font-bold underline cursor-pointer"
              >
                {t('quickDemoAdd')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
