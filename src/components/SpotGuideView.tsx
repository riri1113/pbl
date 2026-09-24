import React, { useState } from 'react';
import { MapPin, Camera, Sparkles, Navigation, Copy, Check, Compass, Heart, Share2 } from 'lucide-react';
import { Spot, StampRecord } from '../types';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (spotId: string, hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(' '));
    setCopiedId(spotId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stampedIds = new Set(stamps.map((s) => s.spotId));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Guide Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black">
            <Compass className="w-3.5 h-3.5" />
            日南トゥクトゥク観光ガイド
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            高校生のための日南映えスポット巡り 🛺
          </h2>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-lg">
            潮風をあびながらオープンエアのトゥクトゥクで日南海岸や城下町を爽快ドライブ！おすすめ撮影アングルと移動のコツをまとめたよ。
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 select-none">
          🌴
        </div>
      </div>

      {/* Tuk-Tuk Special Travel Tips Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-3">
        <h3 className="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-black">
            🛺
          </span>
          トゥクトゥク乗車のキホン＆おすすめルート
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <span className="font-bold text-orange-800 block mb-1">🌊 海風オープンエア</span>
            <p className="text-slate-600 leading-relaxed">
              窓がないので日南海岸の絶景パノラマと心地よい潮風をダイレクトに体感できます！
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
            <span className="font-bold text-emerald-800 block mb-1">📸 移動中も撮影OK</span>
            <p className="text-slate-600 leading-relaxed">
              ヤシの木並木や海沿いロードを走るトゥクトゥクの車窓動画はSNSでもバズり度満点！
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/60">
            <span className="font-bold text-sky-800 block mb-1">🍱 食べ歩きも身軽に</span>
            <p className="text-slate-600 leading-relaxed">
              小回りが利くので、飫肥城下町の小路や油津商店街のカフェ巡りも歩き疲れ知らず！
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Spots List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            日南スポット詳細＆撮影テクニック
          </h3>
          <span className="text-xs text-slate-400 font-medium">全 {spots.length} スポット</span>
        </div>

        <div className="space-y-4">
          {spots.map((spot) => {
            const isStamped = stampedIds.has(spot.id);
            const isCopied = copiedId === spot.id;

            return (
              <div
                key={spot.id}
                id={`guide-spot-${spot.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  {/* Photo Section */}
                  <div className="md:col-span-5 relative h-48 md:h-auto min-h-[180px]">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/10 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                        {spot.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[10px] font-black uppercase text-amber-300">
                        Spot {spot.recommendedOrder}
                      </div>
                      <h4 className="text-base sm:text-lg font-black leading-snug">
                        {spot.name}
                      </h4>
                    </div>
                  </div>

                  {/* Guide Info Section */}
                  <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {spot.description}
                    </p>

                    {/* Photo Technique Tip */}
                    <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/60 text-purple-900 text-xs flex items-start gap-2">
                      <Camera className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-purple-800 block mb-0.5">
                          おすすめ撮影スポット＆アングル：
                        </strong>
                        <span className="text-slate-700 leading-relaxed">
                          {spot.photoTip}
                        </span>
                      </div>
                    </div>

                    {/* Tuk-Tuk travel tip */}
                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-slate-700 text-xs flex items-start gap-2">
                      <span className="text-base shrink-0">🛺</span>
                      <div>
                        <strong className="font-bold text-orange-800 block mb-0.5">
                          トゥクトゥク移動のポイント：
                        </strong>
                        <span className="leading-relaxed">
                          {spot.tukTukTip}
                        </span>
                      </div>
                    </div>

                    {/* Hashtags & Actions */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          id={`guide-copy-${spot.id}`}
                          type="button"
                          onClick={() => handleCopy(spot.id, spot.hashtags)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            isCopied
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-700'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>タグコピー完了</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>ハッシュタグをコピー</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isStamped ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          スタンプ獲得済み
                        </span>
                      ) : (
                        <button
                          id={`guide-stamp-jump-${spot.id}`}
                          type="button"
                          onClick={() => onSelectSpotToStamp(spot)}
                          className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                          <span>SNS画像を提出する</span>
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
