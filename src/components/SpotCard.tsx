import React, { useState } from 'react';
import { Camera, Check, Copy, Sparkles, Share2, Navigation, MapPin } from 'lucide-react';
import { Spot, StampRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatDistance } from '../utils/distance';

interface SpotCardProps {
  spot: Spot;
  stamp?: StampRecord;
  onOpenModal: (spot: Spot) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, stamp, onOpenModal }) => {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const isStamped = !!stamp;

  const handleCopyHashtags = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = spot.hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const localeCode = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-TW' : lang === 'ko' ? 'ko-KR' : 'ja-JP';

  const formattedDate = stamp
    ? new Date(stamp.stampedAt).toLocaleDateString(localeCode, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const destinationQuery = spot.mapQuery || `${spot.name} 日南市`;
  const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationQuery)}`;

  return (
    <div
      id={`spot-card-${spot.id}`}
      className={`bg-white rounded-[28px] overflow-hidden border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
        isStamped
          ? 'border-pink-200 ring-2 ring-pink-100 bg-gradient-to-b from-white to-pink-50/20'
          : 'border-pink-100/80 hover:border-pink-200'
      }`}
    >
      {/* Photo Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden group">
        <img
          src={stamp?.photoDataUrl || spot.imageUrl}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Spot Category & Distance Badge */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 max-w-[70%]">
          <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white/95 backdrop-blur-md text-slate-700 shadow-xs flex items-center gap-1 border border-pink-100">
            <span className="text-rose-400">📍</span>
            {spot.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-xs">
            #{spot.recommendedOrder}
          </span>
          {spot.distanceKm !== undefined && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-white/95 backdrop-blur-md text-rose-600 shadow-xs flex items-center gap-1 border border-rose-200">
              <MapPin className="w-3 h-3 text-rose-500 fill-rose-100" />
              <span>{t('distanceFromCurrent', { distance: formatDistance(spot.distanceKm) })}</span>
            </span>
          )}
        </div>

        {/* Stamped Badge if earned */}
        {isStamped && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-rose-500 text-xs font-black shadow-md border-2 border-pink-200 animate-pulse">
            <span className="text-sm select-none">{spot.stampIcon}</span>
            <span>{spot.stampShort} スタンプGET済 ♡</span>
          </div>
        )}

        {/* Spot Title inside image overlay */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
          <h3 className="font-black text-lg sm:text-xl drop-shadow-md leading-snug tracking-tight">
            {spot.name}
          </h3>
          <p className="text-xs text-pink-200 font-bold line-clamp-1 drop-shadow-xs mt-0.5">
            {spot.subtitle}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 bg-white">
        {/* Description */}
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
          {spot.description}
        </p>

        {/* Nichinan Emo Highlights (Cute Pastel Bubble) */}
        <div className="p-3 rounded-2xl bg-[#FFF6F3] border border-pink-100 flex items-start gap-2.5 text-slate-700">
          <span className="text-lg shrink-0 select-none">✨</span>
          <div className="text-xs leading-relaxed">
            <strong className="text-rose-500 font-black">{t('jrAccessPoint')} </strong>
            <span className="text-slate-600 font-medium">{spot.jrTip}</span>
          </div>
        </div>

        {/* Hashtags with copy button */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1 font-bold text-slate-500">
              <Share2 className="w-3 h-3 text-pink-400" />
              {t('snsTags')}
            </span>
            <button
              id={`copy-hashtags-${spot.id}`}
              type="button"
              onClick={handleCopyHashtags}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                copied
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-pink-50 hover:bg-pink-100 text-pink-500 border border-pink-200/60'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-rose-600 stroke-[3]" />
                  <span>{t('copiedSuccess')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('copyTags')}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {spot.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: "そこに行く！" Google Map Directions + Stamp Actions */}
        <div className="pt-2 border-t border-pink-50">
          {isStamped ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
              <span className="text-[11px] text-rose-500 font-black flex items-center gap-1.5 shrink-0">
                <span className="text-sm select-none">{spot.stampIcon}</span>
                <span>{spot.stampShort} スタンプ獲得完了♡</span>
              </span>
              <div className="flex items-center gap-2">
                {/* "そこに行く！" Google Map Navigation Link */}
                <a
                  id={`spot-map-btn-${spot.id}`}
                  href={googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t('goThereTooltip')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 shadow-2xs active:scale-95 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>{t('goThereBtn')}</span>
                  {spot.distanceKm !== undefined && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded-full">
                      {formatDistance(spot.distanceKm)}
                    </span>
                  )}
                  <span className="text-[10px] opacity-75">🗺️</span>
                </a>
                <button
                  type="button"
                  onClick={() => onOpenModal(spot)}
                  className="px-3.5 py-2 rounded-full text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
                >
                  {t('checkDetails')}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              {/* "そこに行く！" Google Map Navigation Link */}
              <a
                id={`spot-map-btn-${spot.id}`}
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t('goThereTooltip')}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-200/90 font-black text-xs sm:text-sm active:scale-95 transition-all shadow-xs shrink-0"
              >
                <Navigation className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{t('goThereBtn')}</span>
                {spot.distanceKm !== undefined && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    {formatDistance(spot.distanceKm)}
                  </span>
                )}
                <span className="text-xs">🗺️</span>
              </a>

              {/* Submit SNS Stamp Button with spot's characteristic */}
              <button
                id={`stamp-get-btn-${spot.id}`}
                type="button"
                onClick={() => onOpenModal(spot)}
                className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-pink-200 active:scale-95 transition-all"
              >
                <span className="text-base select-none">{spot.stampIcon}</span>
                <span className="truncate">{spot.stampShort} スタンプGET♡</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-200 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
