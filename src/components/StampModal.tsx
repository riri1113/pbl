import React, { useState, useRef } from 'react';
import { X, Copy, Check, Upload, Camera, Sparkles, Instagram, Twitter, AlertCircle } from 'lucide-react';
import { Spot, StampRecord } from '../types';
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
        setErrorMsg('画像ファイル（PNG/JPEG等）を選択してください');
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
      setErrorMsg('SNS投稿のスクリーンショットを選択またはアップロードしてください');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitStamp(spot.id, selectedImage);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

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
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
              🛺
            </span>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                {isAlreadyStamped ? 'スタンプ獲得状況' : 'スタンプGETミッション'}
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                {spot.name}
              </p>
            </div>
          </div>

          <button
            id="modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* If already stamped message */}
          {isAlreadyStamped && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shrink-0">
                ✓
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-900">
                  このスポットのスタンプは獲得済みです！
                </p>
                <p className="text-emerald-700">
                  提出日時: {new Date(stamp.stampedAt).toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          )}

          {/* 3 Step Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-500 tracking-wider">
              {isAlreadyStamped ? '提出されたステップ' : 'スタンプ獲得までの3ステップ'}
            </h4>

            {/* STEP 1: Copy Hashtags */}
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[11px] font-black">
                    1
                  </span>
                  ハッシュタグをコピー
                </span>

                <button
                  id="modal-copy-hashtags-btn"
                  type="button"
                  onClick={handleCopyTags}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>コピー完了！</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>全タグをコピー</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {spot.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white text-orange-700 border border-orange-200 shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* STEP 2: Post to SNS */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  Instagram / X に写真を投稿！
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold flex items-center gap-0.5">
                    <Instagram className="w-3 h-3" />
                  </span>
                  <span className="p-1 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center gap-0.5">
                    <Twitter className="w-3 h-3" />
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                撮影した素敵な写真に、STEP 1でコピーしたハッシュタグをつけてフィードやストーリーズ等にシェアしてね！
              </p>
            </div>

            {/* STEP 3: Upload Screenshot */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">
                    3
                  </span>
                  投稿スクリーンショットを提出
                </span>

                {/* Quick demo helper for rapid testing without files */}
                {!isAlreadyStamped && (
                  <button
                    type="button"
                    onClick={handleUseDemoScreenshot}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-bold underline flex items-center gap-1"
                  >
                    <span>テスト用スクショを適用</span>
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
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 bg-slate-900 group">
                  <img
                    src={selectedImage}
                    alt="投稿スクリーンショットプレビュー"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs shadow-md"
                    >
                      画像を変更
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] backdrop-blur-xs flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>画像選択完了</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-orange-400 rounded-2xl p-6 text-center bg-white cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 mb-1">
                    ここをタップしてスクリーンショットを選択
                  </p>
                  <p className="text-[10px] text-slate-400">
                    SNS投稿画面のキャプチャ画像（PNG / JPG）
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            閉じる
          </button>

          {!isAlreadyStamped && (
            <button
              id="submit-stamp-btn"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isSubmitting ? 'スタンプ押印中...' : '送信してスタンプGET！'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
