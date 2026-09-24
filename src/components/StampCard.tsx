import React from 'react';
import { Sparkles, CheckCircle2, Ticket, ArrowRight, Award } from 'lucide-react';
import { Spot, StampRecord } from '../types';

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
  const currentCount = stamps.length;
  const progressPercent = Math.min(100, (currentCount / totalRequired) * 100);
  const isComplete = currentCount >= totalRequired;

  // Find spots corresponding to collected stamps
  const stampedSpots = stamps.map((st) => spots.find((s) => s.id === st.spotId));

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-amber-100/80 relative overflow-hidden">
      {/* Background cute tropical palm & sun watermark */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-gradient-to-br from-amber-100/50 to-orange-100/30 -z-0 pointer-events-none blur-sm" />
      <div className="absolute top-2 right-4 text-4xl opacity-10 pointer-events-none select-none">
        🛺
      </div>

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black shadow-xs">
              <Award className="w-4 h-4 text-orange-500" />
            </span>
            <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
              日南SNSスタンプカード
            </h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            {currentCount} / {totalRequired} 達成
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          スポットでSNS（Instagram/X）にハッシュタグ投稿＆スクショを提出してスタンプを集めよう！5つ揃うと
          <strong className="text-orange-600 font-bold"> トゥクトゥク1回乗車無料券 </strong>
          を獲得！
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600">
              {isComplete ? (
                <span className="text-emerald-600 flex items-center gap-1 font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5スタンプコンプリート達成！🎉
                </span>
              ) : (
                <span className="text-orange-600">
                  あと {totalRequired - currentCount} 個で無料チケット獲得！🚗💨
                </span>
              )}
            </span>
            <span className="text-orange-500">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stamp slots (5 circular slots) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 my-2">
          {Array.from({ length: totalRequired }).map((_, index) => {
            const stamp = stamps[index];
            const spot = stamp ? spots.find((s) => s.id === stamp.spotId) : null;
            const isFilled = !!stamp;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1"
                onClick={() => {
                  if (spot) {
                    onSelectSpot(spot);
                  }
                }}
              >
                <div
                  className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative ${
                    isFilled
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-300 transform scale-100 cursor-pointer hover:scale-105'
                      : 'border-2 border-dashed border-slate-300 bg-slate-50/70 text-slate-400 hover:border-orange-300'
                  }`}
                  title={isFilled ? `${spot?.name ?? '獲得済み'} (クリックで詳細)` : `スタンプ ${index + 1}（未獲得）`}
                >
                  {isFilled ? (
                    <div className="text-center p-1">
                      {/* Red stamp seal look */}
                      <div className="relative">
                        <span className="text-xl sm:text-2xl drop-shadow-xs">🛺</span>
                        <div className="absolute -bottom-1 -right-1.5 bg-emerald-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                          ✓
                        </div>
                      </div>
                      <span className="text-[9px] font-black tracking-tight line-clamp-1 mt-0.5 text-amber-100">
                        GET!
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-400">
                        {index + 1}
                      </span>
                      <span className="block text-[8px] font-medium text-slate-400">
                        未獲得
                      </span>
                    </div>
                  )}
                </div>

                {/* Spot Mini Label */}
                <span className="text-[10px] text-center font-medium text-slate-600 line-clamp-1 max-w-[62px]">
                  {spot ? spot.name.split('（')[0] : `SPOT ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>

        {/* Congratulations Banner or Ticket Action */}
        {isComplete ? (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm animate-bounce">
                🎉
              </div>
              <div>
                <p className="text-xs font-black text-emerald-900">
                  おめでとう！無料乗車チケット獲得！
                </p>
                <p className="text-[11px] text-emerald-700">
                  ドライバーに見せて乗車できます
                </p>
              </div>
            </div>

            <button
              id="stamp-card-ticket-btn"
              type="button"
              onClick={onNavigateTicket}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>チケットを見る</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              下記のスポットからSNSに投稿してスタンプGET！
            </span>
            {onQuickDemoAdd && currentCount < totalRequired && (
              <button
                type="button"
                onClick={onQuickDemoAdd}
                className="text-[10px] text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
              >
                + デモ用1スタンプ追加
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
