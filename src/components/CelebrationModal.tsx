import React from 'react';
import { Sparkles, Ticket, CheckCircle, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CelebrationModalProps {
  onGoToTicket: () => void;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  onGoToTicket,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div
        id="celebration-modal-container"
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300 text-center relative p-6 space-y-4 animate-in zoom-in-95 duration-300"
      >
        {/* Confetti / Badge graphics */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-emerald-400 text-white mx-auto flex items-center justify-center text-4xl shadow-lg shadow-orange-500/30 animate-bounce">
          🎉
        </div>

        <div className="space-y-1.5">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black tracking-wider uppercase">
            MISSION COMPLETE!
          </span>
          <h3 className="text-xl font-black text-slate-900 leading-tight">
            スタンプ5つ達成！<br />無料乗車チケット獲得！
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            日南の素敵な観光スポットを巡って魅力を発信してくれてありがとう！「日南トゥクトゥク 1回無料乗車券」が自動発行されました。
          </p>
        </div>

        {/* Mini ticket card preview */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3.5 rounded-2xl shadow-sm space-y-1 text-left">
          <div className="flex items-center justify-between text-[11px] font-bold opacity-90">
            <span>🛺 日南トゥクトゥク</span>
            <span className="bg-white/25 px-2 py-0.5 rounded-full text-[10px]">有効</span>
          </div>
          <p className="text-sm font-black">1回乗車無料チケット（全区間）</p>
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
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>獲得したチケットを確認する</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
