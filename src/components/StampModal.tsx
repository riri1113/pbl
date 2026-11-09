import React, { useState, useRef } from 'react';
import { X, Copy, Check, Upload, Sparkles, Instagram, Twitter, AlertCircle, Navigation } from 'lucide-react';
import { Spot, StampRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { sounds } from '../utils/audio';

interface StampModalProps {
  spot: Spot | null;
  stamp?: StampRecord;
  onClose: () => void;
  onSubmitStamp: (spotId: string, photoDataUrl: string) => void;
}

export const StampModal: React.FC<StampModalProps> = ({
  spot,
  stamp,
  onClose,
  onSubmitStamp,
}) => {
  const { lang, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(stamp?.photoDataUrl || null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!spot) return null;

  const isAlreadyStamped = !!stamp;

  const handleCopyTags = () => {
    const text = spot.hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg(t('fileError'));
        return;
      }
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Demo auto-fill helper for instant testing
  const handleUseDemoScreenshot = () => {
    setSelectedImage(spot.imageUrl);
    setErrorMsg(null);
    sounds.playClick();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setErrorMsg(t('noImageError'));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitStamp(spot.id, selectedImage);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const localeCode = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-TW' : lang === 'ko' ? 'ko-KR' : 'ja-JP';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="stamp-modal-container"
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-amber-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-2xl shadow-2xs border border-white/30 select-none">
              {spot.stampIcon}
            </span>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight tracking-tight flex items-center gap-1.5">
                <span>{isAlreadyStamped ? t('modalStatusTitle') : t('modalMissionTitle')}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/30 text-white">
                  {spot.stampShort}
                </span>
              </h3>
              <p className="text-xs text-pink-100 font-bold">
                {spot.name}
              </p>
            </div>
          </div>

          <button
            id="modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick "そこに行く！" Google Maps Navigation Banner */}
          <a
            id="modal-map-navigation-btn"
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.mapQuery || `${spot.name} 日南市`)}`}
            target="_blank"
            rel="noopener noreferrer"
            title={t('goThereTooltip')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border-2 border-amber-200/90 shadow-2xs transition-all active:scale-98 group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Navigation className="w-4 h-4 fill-white" />
              </span>
              <div>
                <span className="font-black text-xs sm:text-sm text-slate-800 flex items-center gap-1">
                  <span>{t('goThereBtn')}</span>
                  <span className="text-[11px] font-bold text-amber-700">（Googleマップ案内）</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  現在地から {spot.name.split('（')[0]} へのルートを開く
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-amber-700 bg-white/80 px-2.5 py-1 rounded-full border border-amber-200/60 shadow-2xs shrink-0">
              案内開始 🗺️
            </span>
          </a>

          {/* If already stamped message with Spot's Characteristic Stamp */}
          {isAlreadyStamped && (
            <div className="p-4 rounded-2xl bg-[#FFF6F8] border-2 border-dashed border-rose-200 flex items-center gap-3.5">
              <div
                className="w-14 h-14 rounded-full border-2 border-rose-400 flex flex-col items-center justify-center p-1 shrink-0 -rotate-6 shadow-sm"
                style={{ backgroundColor: `${spot.stampColor || '#E11D48'}15`, borderColor: spot.stampColor || '#E11D48' }}
              >
                <span className="text-2xl">{spot.stampIcon}</span>
                <span className="text-[8px] font-black line-clamp-1" style={{ color: spot.stampColor }}>{spot.stampShort}</span>
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-black text-rose-500 flex items-center gap-1.5">
                  <span>{spot.stampName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-600 font-bold">獲得済 ✓</span>
                </p>
                <p className="text-slate-500 font-medium">
                  {t('modalAlreadyEarnedTitle')}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {t('modalSubmittedAt', { date: new Date(stamp.stampedAt).toLocaleString(localeCode) })}
                </p>
              </div>
            </div>
          )}

          {/* 3 Step Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 tracking-wider">
              {isAlreadyStamped ? t('stepHeaderSubmitted') : t('stepHeaderActive')}
            </h4>

            {/* STEP 1: Copy Hashtags */}
            <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-pink-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-500 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-400 text-white flex items-center justify-center text-[11px] font-black">
                    1
                  </span>
                  {t('step1Title')}
                </span>

                <button
                  id="modal-copy-hashtags-btn"
                  type="button"
                  onClick={handleCopyTags}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all active:scale-95 ${
                    copied
                      ? 'bg-rose-400 text-white'
                      : 'bg-rose-400 hover:bg-rose-500 text-white shadow-xs'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t('step1CopyDone')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('step1CopyAll')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {spot.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-400 border border-pink-200/80 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* STEP 2: Post to SNS */}
            <div className="p-4 rounded-2xl bg-white border border-pink-100 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  {t('step2Title')}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded-full bg-pink-50 text-rose-500 text-[10px] font-black flex items-center gap-0.5">
                    <Instagram className="w-3 h-3" />
                  </span>
                  <span className="p-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black flex items-center gap-0.5">
                    <Twitter className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t('step2Desc')}
              </p>
            </div>

            {/* STEP 3: Upload Screenshot */}
            <div className="p-4 rounded-2xl bg-white border border-pink-100 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-400 text-white flex items-center justify-center text-[11px] font-black">
                    3
                  </span>
                  {t('step3Title')}
                </span>

                {/* Quick demo helper */}
                {!isAlreadyStamped && (
                  <button
                    type="button"
                    onClick={handleUseDemoScreenshot}
                    className="text-[10px] text-rose-500 hover:text-rose-600 font-black underline flex items-center gap-1"
                  >
                    <span>{t('step3DemoBtn')}</span>
                  </button>
                )}
              </div>

              {/* Upload Input Area */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="screenshot-file-input"
              />

              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-pink-300 bg-slate-900 group">
                  <img
                    src={selectedImage}
                    alt="Submission screenshot preview"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-black text-xs shadow-md"
                    >
                      {t('step3ChangeImage')}
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 text-rose-500 text-[10px] font-black backdrop-blur-xs flex items-center gap-1">
                    <Check className="w-3 h-3 text-rose-500 stroke-[3]" />
                    <span>{t('step3ImageSelected')}</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-pink-200 hover:border-pink-300 rounded-2xl p-6 text-center bg-[#FFFDFC] cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-rose-400 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-black text-slate-700 mb-1">
                    {t('step3TapToUpload')}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t('step3UploadHint')}
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-pink-100 bg-[#FFFDFC] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            {t('close')}
          </button>

          {!isAlreadyStamped && (
            <button
              id="submit-stamp-btn"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-black shadow-md shadow-pink-200 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className="text-base select-none">{spot.stampIcon}</span>
              <span>{isSubmitting ? t('submitting') : `${spot.stampShort} スタンプを捺す♡`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
