import React, { useState } from 'react';
import { Camera, Sparkles, Navigation, Copy, Check, Compass, MapPin } from 'lucide-react';
import { Spot, StampRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatDistance } from '../utils/distance';

interface SpotGuideViewProps {
  spots: Spot[];
  stamps: StampRecord[];
  onSelectSpotToStamp: (spot: Spot) => void;
}

export const SpotGuideView: React.FC<SpotGuideViewProps> = ({
  spots,
  stamps,
  onSelectSpotToStamp,
}) => {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'gourmet' | 'sightseeing' | 'sea'>('all');

  const handleCopy = (spotId: string, hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopiedId(spotId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stampedIds = new Set(stamps.map((s) => s.spotId));

  const filteredSpots = spots.filter((spot) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'gourmet') {
      return (
        spot.id === 'aburatsu-coffee' ||
        spot.id === 'bibinya' ||
        spot.id === 'obiten-kura' ||
        spot.id === 'iina-pudding'
      );
    }
    if (activeCategory === 'sightseeing') {
      return (
        spot.id === 'udo-jingu' ||
        spot.id === 'sunmesse' ||
        spot.id === 'obi-castle' ||
        spot.id === 'aburatsu-shotengai' ||
        spot.id === 'aburatsu-redbrick'
      );
    }
    if (activeCategory === 'sea') {
      return (
        spot.id === 'michi-no-eki-nango' ||
        spot.id === 'sakaematsu-beach' ||
        spot.id === 'futo-beach' ||
        spot.id === 'futo-totoro'
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Guide Header Banner */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 rounded-[32px] p-5 sm:p-6 text-white shadow-md shadow-pink-200/50 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-xs font-black border border-white/30">
            <Compass className="w-3.5 h-3.5 text-white" />
            {t('guideBannerBadge')}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-xs">
            {t('guideBannerTitle')}
          </h2>
          <p className="text-xs text-pink-100 font-medium leading-relaxed max-w-lg">
            {t('guideBannerDesc')}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 select-none">
          🌴
        </div>
      </div>

      {/* Nichinan Emo Travel Special Tips Card */}
      <div className="bg-white/95 rounded-[28px] p-4 sm:p-5 border-2 border-pink-100 shadow-sm shadow-pink-50 space-y-3">
        <h3 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <span className="w-8 h-8 rounded-2xl bg-pink-100 text-rose-500 flex items-center justify-center text-base font-black">
            🌴
          </span>
          {t('guideTipsCardTitle')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FFF6F3] border border-pink-100">
            <span className="font-black text-rose-500 block mb-1">{t('guidePoint1Title')}</span>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t('guidePoint1Desc')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F9F4] border border-emerald-100">
            <span className="font-black text-emerald-600 block mb-1">{t('guidePoint2Title')}</span>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t('guidePoint2Desc')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-sky-100">
            <span className="font-black text-sky-600 block mb-1">{t('guidePoint3Title')}</span>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t('guidePoint3Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Spots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-rose-400" />
            {t('guideSpotsHeader')}
          </h3>
          <span className="text-xs text-rose-400 font-bold">{t('spotsListTitle', { count: spots.length })}</span>
        </div>

        {/* Filter Pills in Guide */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            {t('categoryAll', { count: spots.length })}
          </button>
          <button
            onClick={() => setActiveCategory('gourmet')}
            className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 flex items-center gap-1 ${
              activeCategory === 'gourmet'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            {t('categoryGourmet')}
          </button>
          <button
            onClick={() => setActiveCategory('sightseeing')}
            className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 flex items-center gap-1 ${
              activeCategory === 'sightseeing'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            {t('categorySightseeing')}
          </button>
          <button
            onClick={() => setActiveCategory('sea')}
            className={`px-3.5 py-1.5 rounded-full font-black transition-all shrink-0 flex items-center gap-1 ${
              activeCategory === 'sea'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            {t('categorySea')}
          </button>
        </div>

        <div className="space-y-4">
          {filteredSpots.map((spot) => {
            const isStamped = stampedIds.has(spot.id);
            const isCopied = copiedId === spot.id;

            return (
              <div
                key={spot.id}
                id={`guide-spot-${spot.id}`}
                className="bg-white rounded-[28px] overflow-hidden border-2 border-pink-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Photo Section */}
                  <div className="md:col-span-5 relative h-52 md:h-auto min-h-[200px]">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/70 via-slate-900/20 to-transparent" />

                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white/95 text-slate-800 shadow-xs border border-pink-100">
                        {spot.category}
                      </span>
                      {spot.distanceKm !== undefined && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-white/95 backdrop-blur-md text-rose-600 shadow-xs flex items-center gap-1 border border-rose-200">
                          <MapPin className="w-3 h-3 text-rose-500 fill-rose-100" />
                          <span>{t('distanceFromCurrent', { distance: formatDistance(spot.distanceKm) })}</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <div className="text-[10px] font-black uppercase text-pink-200">
                        Spot {spot.recommendedOrder}
                      </div>
                      <h4 className="text-base sm:text-lg font-black leading-snug drop-shadow-sm">
                        {spot.name}
                      </h4>
                    </div>
                  </div>

                  {/* Guide Info Section */}
                  <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {spot.description}
                    </p>

                    {/* Photo Technique Tip */}
                    <div className="p-3 rounded-2xl bg-[#FCF8FF] border border-purple-100 text-purple-900 text-xs flex items-start gap-2">
                      <Camera className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-black text-purple-800 block mb-0.5">
                          {t('guidePhotoAngleTitle')}
                        </strong>
                        <span className="text-slate-600 leading-relaxed font-medium">
                          {spot.photoTip}
                        </span>
                      </div>
                    </div>

                    {/* Nichinan Emo highlights */}
                    <div className="p-3 rounded-2xl bg-[#FFF6F3] border border-pink-100 text-slate-700 text-xs flex items-start gap-2">
                      <span className="text-base shrink-0">✨</span>
                      <div>
                        <strong className="font-black text-rose-500 block mb-0.5">
                          {t('jrAccessPoint')}
                        </strong>
                        <span className="leading-relaxed text-slate-600 font-medium">
                          {spot.jrTip}
                        </span>
                      </div>
                    </div>

                    {/* Hashtags & Actions */}
                    <div className="pt-2 border-t border-pink-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          id={`guide-copy-${spot.id}`}
                          type="button"
                          onClick={() => handleCopy(spot.id, spot.hashtags)}
                          className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                            isCopied
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-pink-50 hover:bg-pink-100 text-pink-500 border border-pink-200/60'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                              <span>{t('copiedSuccess')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t('copyTags')}</span>
                            </>
                          )}
                        </button>

                        {/* "そこに行く！" Google Maps Link */}
                        <a
                          id={`guide-map-btn-${spot.id}`}
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.mapQuery || `${spot.name} 日南市`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t('goThereTooltip')}
                          className="px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 shadow-2xs transition-all active:scale-95"
                        >
                          <Navigation className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                          <span>{t('goThereBtn')}</span>
                          {spot.distanceKm !== undefined && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-200/70 px-1.5 py-0.5 rounded-full">
                              {formatDistance(spot.distanceKm)}
                            </span>
                          )}
                          <span className="text-[10px]">🗺️</span>
                        </a>
                      </div>

                      {isStamped ? (
                        <span className="text-xs font-black text-rose-500 flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200">
                          <span className="text-sm select-none">{spot.stampIcon}</span>
                          <span>{spot.stampShort} スタンプ獲得済 ♡</span>
                        </span>
                      ) : (
                        <button
                          id={`guide-stamp-jump-${spot.id}`}
                          type="button"
                          onClick={() => onSelectSpotToStamp(spot)}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-pink-200 active:scale-95 transition-all"
                        >
                          <span className="text-sm select-none">{spot.stampIcon}</span>
                          <span>{spot.stampShort} スタンプGETへ</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
