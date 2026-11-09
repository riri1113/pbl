import React from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Spot } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface StampSuccessModalProps {
  spot: Spot;
  totalStamps: number;
  totalRequired: number;
  onClose: () => void;
  onGoToTicket?: () => void;
}

export const StampSuccessModal: React.FC<StampSuccessModalProps> = ({
  spot,
  totalStamps,
  totalRequired,
  onClose,
  onGoToTicket,
}) => {
  const { lang, t } = useLanguage();
  const isComplete = totalStamps >= totalRequired;
  const remaining = Math.max(0, totalRequired - totalStamps);
  const localeCode = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-TW' : lang === 'ko' ? 'ko-KR' : 'ja-JP';
  const currentDate = new Date().toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="stamp-success-modal"
        className="bg-white w-full max-w-sm rounded-[36px] overflow-hidden shadow-2xl border-4 border-pink-200 p-6 text-center space-y-4 relative animate-in zoom-in-90 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cute Top Ribbon */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-rose-500 text-xs font-black tracking-wide border border-pink-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 fill-rose-400" />
          <span>˗ˏˋ スタンプポンッ！GET ˎˊ˗</span>
        </div>

        {/* Spot Characteristic Rubber Stamp Badge (The visual stamp that represents the spot!) */}
        <div className="py-2 flex justify-center">
          <div
            className="w-36 h-36 rounded-full border-4 border-dashed p-2 flex flex-col items-center justify-center shadow-lg relative transform -rotate-3 transition-transform hover:rotate-0"
            style={{
              borderColor: spot.stampColor || '#E11D48',
              backgroundColor: `${spot.stampColor || '#E11D48'}0D`,
            }}
          >
            {/* Inner Ring */}
            <div
              className="w-full h-full rounded-full border-2 flex flex-col items-center justify-center p-2 relative"
              style={{
                borderColor: spot.stampColor || '#E11D48',
              }}
            >
              <span className="text-[9px] font-black tracking-wider uppercase opacity-80" style={{ color: spot.stampColor }}>
                NICHINAN EMO TRIP
              </span>
              <div className="text-4xl my-1 filter drop-shadow-xs animate-bounce">
                {spot.stampIcon}
              </div>
              <span className="text-[11px] font-black line-clamp-1" style={{ color: spot.stampColor }}>
                {spot.stampShort}
              </span>
              <span className="text-[8px] font-bold opacity-75 font-mono" style={{ color: spot.stampColor }}>
                {currentDate}
              </span>

              {/* Ink verified mark */}
              <div
                className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-xs"
                style={{ backgroundColor: spot.stampColor || '#E11D48' }}
              >
                済 ★
              </div>
            </div>
          </div>
        </div>

        {/* Spot & Characteristic Description */}
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
            {spot.name}
          </h3>
          <p className="text-xs font-black text-rose-500 flex items-center justify-center gap-1">
            <span>特徴：</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
              {spot.stampName}
            </span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium pt-1">
            {isComplete
              ? '🎉 5つのスタンプが全て集まりました！1,000円商品券が解放されました！'
              : `🐾 スタンプ獲得！あと ${remaining} 個集めると日南のお店で使える商品券1,000円分GET！`}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 space-y-2">
          {isComplete && onGoToTicket ? (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onGoToTicket();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm shadow-md shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>1,000円商品券を受け取る ♡</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm shadow-md shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>スタンプ帳を見る ♡</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
