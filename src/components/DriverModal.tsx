import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { TicketData } from '../types';
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

  const timeString = currentTime.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const msString = Math.floor(currentTime.getMilliseconds() / 100);
  const dateString = currentTime.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="driver-modal-container"
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Security Strip (Yellow/Black Caution Tape look or vibrant neon wave) */}
        <div className="bg-amber-400 py-1 px-4 text-[10px] font-black tracking-widest text-slate-900 flex items-center justify-between uppercase overflow-hidden">
          <span className="flex items-center gap-1 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            NICHINAN TUKTUK OFFICIAL PASS
          </span>
          <span className="font-mono">{ticket.ticketCode}</span>
        </div>

        {/* Modal Top Close */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 p-4 text-white relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-orange-600 flex items-center justify-center text-2xl shadow-md border-2 border-orange-200 animate-bounce">
              🛺
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                高校生限定 特典
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                ドライバー提示画面
              </h3>
            </div>
          </div>
        </div>

        {/* Dynamic Verification Content */}
        <div className="p-5 space-y-4 bg-gradient-to-b from-amber-50/50 to-white">
          {/* Anti-Fraud Real-Time Animated Security Clock */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center shadow-inner relative overflow-hidden border border-slate-700">
            {/* Moving background scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-pulse pointer-events-none" />

            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>リアルタイム認証中（スクリーンショット防止）</span>
            </div>

            <p className="text-xs text-slate-400 mb-0.5">{dateString}</p>

            <div className="font-mono text-3xl sm:text-4xl font-black tracking-wider text-emerald-400 drop-shadow-sm flex items-center justify-center gap-1">
              <span>{timeString}</span>
              <span className="text-xl text-amber-400">.{msString}</span>
            </div>

            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[11px] text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>有効なチケットです</span>
            </div>
          </div>

          {/* Ticket Information Card */}
          <div className="p-4 rounded-2xl bg-white border-2 border-orange-200 shadow-sm space-y-2.5">
            <div className="flex justify-between items-center border-b border-orange-100 pb-2">
              <span className="text-xs font-bold text-slate-500">特典内容</span>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                1乗車無料（全区間）
              </span>
            </div>

            <div className="text-center py-1">
              <h4 className="text-lg font-black text-slate-800">
                日南トゥクトゥク 1回乗車無料券
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                高校生SNSスタンプラリー 5スポット達成特典
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-orange-100">
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 block font-medium">チケット番号</span>
                <span className="font-mono font-bold text-slate-700">{ticket.ticketCode}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-400 block font-medium">利用可能人数</span>
                <span className="font-bold text-slate-700">ご本人様 1名</span>
              </div>
            </div>
          </div>

          {/* Caution box */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>ドライバーへの提示方法：</strong>
              トゥクトゥク乗車時にドライバーにこの画面をお見せください。確認が取れたら下のボタンを押して「使用完了」にしてください。
            </p>
          </div>

          {/* Driver Action Button */}
          <div className="pt-2">
            <button
              id="confirm-use-ticket-btn"
              type="button"
              onClick={handleTriggerConfirm}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              <span>乗車確認：使用完了にする</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              ※ ドライバーの前でタップしてください（1度完了すると再利用できません）
            </p>
          </div>
        </div>

        {/* Double-Check Confirmation Overlay Dialog */}
        {showConfirmDialog && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                チケットを使用済みにしますか？
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ドライバーへの提示はお済みですか？使用完了にすると元に戻せません。
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="dialog-confirm-final-use"
                  type="button"
                  onClick={handleFinalUse}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  はい、使用完了にする
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  まだ提示していない（戻る）
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
