import React, { useState } from 'react';
import { Camera, Check, Copy, Sparkles, MapPin, Share2 } from 'lucide-react';
import { Spot, StampRecord } from '../types';

interface SpotCardProps {
  spot: Spot;
  stamp?: StampRecord;
  onOpenModal: (spot: Spot) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, stamp, onOpenModal }) => {
  const [copied, setCopied] = useState(false);
  const isStamped = !!stamp;

  const handleCopyHashtags = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = spot.hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = stamp
    ? new Date(stamp.stampedAt).toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      id={`spot-card-${spot.id}`}
      className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-sm hover:shadow-md ${
        isStamped
          ? 'border-emerald-200/90 ring-1 ring-emerald-200/50 bg-gradient-to-b from-white to-emerald-50/20'
          : 'border-slate-200/80 hover:border-orange-300'
      }`}
    >
      {/* Photo Header */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden group">
        <img
          src={stamp?.photoDataUrl || spot.imageUrl}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Spot Category Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange-500" />
            {spot.category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-500 text-white shadow-xs">
            No.{spot.recommendedOrder}
          </span>
        </div>

        {/* Stamped Badge if earned */}
        {isStamped && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-md border border-emerald-300 animate-pulse">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>スタンプ獲得済み！</span>
          </div>
        )}

        {/* Spot Title inside image overlay for clean modern look */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-black text-base sm:text-lg drop-shadow-md leading-snug">
            {spot.name}
          </h3>
          <p className="text-xs text-amber-200 font-medium line-clamp-1 drop-shadow-xs">
            {spot.subtitle}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between gap-3">
        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed">
          {spot.description}
        </p>

        {/* Tuk-Tuk Highlights */}
        <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2 text-slate-700">
          <span className="text-base shrink-0 select-none">🛺</span>
          <div className="text-[11px] leading-relaxed">
            <strong className="text-orange-700 font-bold">トゥクトゥク爽快ポイント：</strong>
            <span>{spot.tukTukTip}</span>
          </div>
        </div>

        {/* Hashtags with copy button */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <Share2 className="w-3 h-3 text-orange-500" />
              SNS投稿用ハッシュタグ
            </span>
            <button
              id={`copy-hashtags-${spot.id}`}
              type="button"
              onClick={handleCopyHashtags}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                copied
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-700'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>コピー完了！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>タグをコピー</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {spot.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: Stamp GET */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          {isStamped ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {formattedDate ? `${formattedDate} にGET` : 'スタンプ獲得完了'}
              </span>
              <button
                type="button"
                onClick={() => onOpenModal(spot)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                提出内容を確認
              </button>
            </div>
          ) : (
            <button
              id={`stamp-get-btn-${spot.id}`}
              type="button"
              onClick={() => onOpenModal(spot)}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>SNS投稿画像を提出してスタンプGET！</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
