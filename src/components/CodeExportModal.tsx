import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CodeExportModalProps {
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [htmlCode, setHtmlCode] = useState<string>('読み込み中...');

  useEffect(() => {
    fetch('/standalone.html')
      .then((res) => res.text())
      .then((data) => setHtmlCode(data))
      .catch(() => setHtmlCode('<!-- standalone.html の取得に失敗しました -->'));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    sounds.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nichinan_voucher_app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-[36px] overflow-hidden shadow-2xl border-2 border-pink-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-white/25 text-white backdrop-blur-xs border border-white/20">
              <Code className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-black text-base sm:text-lg">単一HTMLファイルの書き出し ♡</h3>
              <p className="text-xs text-pink-100 font-medium">HTML5 + TailWind CDN + Vanilla JS (1ファイル完結)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100 text-slate-700 leading-relaxed font-medium">
            ご指定の要件通り、<strong>外部依存をTailwind CDNとCDNスクリプトのみに集約した単一ファイル（HTML+CSS+JS完結）</strong>です。パソコンのブラウザでダブルクリックするだけですぐに動作します✨
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-black flex items-center gap-1.5 shadow-md shadow-pink-200 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'HTMLコードをコピー完了♡' : '全HTMLコードをコピー'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black flex items-center gap-1.5 shadow-md shadow-emerald-200 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>.htmlファイルをダウンロード</span>
            </button>

            <a
              href="/standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-pink-50 hover:text-rose-500 text-slate-700 font-black flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>別タブで開く</span>
            </a>
          </div>

          <div className="space-y-1">
            <span className="font-black text-slate-400">コードプレビュー（一部）：</span>
            <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56 border border-slate-800">
              {htmlCode.slice(0, 1500)}...
            </pre>
          </div>
        </div>

        <div className="p-4 border-t border-pink-100 bg-[#FFFDFC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors text-xs"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
