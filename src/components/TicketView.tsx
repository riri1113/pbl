import React, { useState } from 'react';
import { Ticket, Lock, Sparkles, CheckCircle2, QrCode, AlertCircle, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { TicketData } from '../types';
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
  const [showDriverModal, setShowDriverModal] = useState(false);
  const remaining = Math.max(0, totalRequired - stampCount);
  const isUnlocked = ticket.isUnlocked || stampCount >= totalRequired;
  const isUsed = ticket.isUsed;

  const formattedUsedDate = ticket.usedAt
    ? new Date(ticket.usedAt).toLocaleString('ja-JP', {
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
        <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-700 border border-orange-200">
          高校生特典チケット
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          乗車無料チケット
        </h2>
        <p className="text-xs text-slate-500">
          5つのスタンプを集めると使える、トゥクトゥク1回無料チケットです
        </p>
      </div>

      {/* STATE 1: LOCKED (stampCount < 5) */}
      {!isUnlocked && !isUsed && (
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-300 text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl shadow-inner">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-700">
              チケットはまだロックされています
            </h3>
            <p className="text-xs text-orange-600 font-bold">
              あと <span className="text-base font-black text-orange-600">{remaining}</span> 個のスタンプで解除されます！
            </p>
          </div>

          {/* Ticket preview dummy */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left opacity-75">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
              <span className="text-xs font-bold text-slate-400">日南トゥクトゥク</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-500">
                LOCKED
              </span>
            </div>
            <p className="text-sm font-black text-slate-600">
              日南市内 1回乗車無料券（通常 500円〜1,000円）
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              鵜戸神宮、サンメッセ日南、飫肥城下町など人気エリア間の移動で使えます
            </p>
          </div>

          <button
            id="ticket-go-stamp-btn"
            type="button"
            onClick={onNavigateHome}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>スタンプを集めに行く</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATE 2: UNLOCKED & ACTIVE (Ready to use) */}
      {isUnlocked && !isUsed && (
        <div className="space-y-4">
          {/* Active Ticket Card with Cutouts & Radiant Style */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden border-2 border-amber-300">
            {/* Ticket side cutouts */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-50/40 border border-orange-300 shadow-inner" />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-50/40 border border-orange-300 shadow-inner" />

            {/* Glowing background circles */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/25 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛺</span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-100 font-black block">
                    HIGH SCHOOL SPECIAL PASS
                  </span>
                  <span className="text-xs font-bold">日南トゥクトゥク観光推進協議会</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                利用可能
              </span>
            </div>

            {/* Body */}
            <div className="space-y-2 my-4">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm">
                日南トゥクトゥク 1回乗車無料券
              </h3>
              <p className="text-xs text-amber-100 leading-relaxed">
                おめでとうございます！SNSスタンプラリー5スポット達成により付与された乗車チケットです。
              </p>
            </div>

            {/* Ticket Details Bar */}
            <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs border border-white/10 mb-4">
              <div>
                <span className="text-[10px] text-amber-200 block">チケットID</span>
                <span className="font-mono font-bold tracking-wider">{ticket.ticketCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-200 block">有効区間</span>
                <span className="font-bold">日南市内 トゥクトゥク全線</span>
              </div>
            </div>

            {/* Action Button: Present to Driver */}
            <button
              id="present-to-driver-btn"
              type="button"
              onClick={() => setShowDriverModal(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-amber-50 text-orange-600 font-black text-sm sm:text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5 text-orange-500" />
              <span>乗車時にドライバーに見せる</span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </button>
          </div>

          {/* Usage Instructions Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              チケットの使い方・注意点
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-500 leading-relaxed">
              <li>トゥクトゥク乗車時に「ドライバーに見せる」ボタンを押してください。</li>
              <li>不正利用防止のため、動く認証画面が表示されます。</li>
              <li>ドライバーの確認後に「使用完了」ボタンを押してください。</li>
              <li>乗車1回分（1名様）が無料になります。</li>
            </ul>
          </div>
        </div>
      )}

      {/* STATE 3: USED (使用済み) */}
      {isUsed && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 text-center space-y-4 shadow-sm relative overflow-hidden">
          {/* Stamped Watermark */}
          <div className="w-20 h-20 rounded-full border-4 border-slate-400 text-slate-400 mx-auto flex flex-col items-center justify-center transform -rotate-12 select-none">
            <CheckCircle2 className="w-6 h-6 mb-0.5 text-slate-400" />
            <span className="text-[11px] font-black tracking-wider uppercase">USED</span>
            <span className="text-[8px] font-bold">使用済み</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-700">
              チケットは使用済みです
            </h3>
            <p className="text-xs text-slate-500">
              日南トゥクトゥクをご利用いただきありがとうございました！
            </p>
            {formattedUsedDate && (
              <p className="text-xs text-slate-400 font-mono mt-1">
                使用日時: {formattedUsedDate}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-orange-800 mb-1">
              🌴 日南の旅の思い出をシェアしてくれてありがとう！
            </p>
            <p className="text-slate-600">
              引き続き「スポットガイド」から日南の他の絶景やグルメをチェックして、最高の高校生活の思い出を作ってくださいね。
            </p>
          </div>

          {onReset && (
            <button
              id="ticket-reset-btn"
              type="button"
              onClick={onReset}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>もう一度最初から巡る（データをリセット）</span>
            </button>
          )}
        </div>
      )}

      {/* Modal: Present to Driver */}
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
