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
    a.download = 'nichinan_tuktuk_navi.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sounds.playClick();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-amber-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20 text-white">
              <Code className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-black text-base sm:text-lg">単一HTMLファイルの書き出し</h3>
              <p className="text-xs text-amber-100">HTML5 + TailWind CSS (CDN) + Vanilla JS (1ファイル完結)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-slate-700 leading-relaxed">
            ご指定の要件通り、<strong>外部依存をTailwind CDNとCDNスクリプトのみに集約した単一ファイル（HTML+CSS+JS完結）</strong>です。パソコンのブラウザでダブルクリックするだけですぐに動作します。
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'HTMLコードをコピー完了！' : '全HTMLコードをコピー'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>.htmlファイルをダウンロード</span>
            </button>

            <a
              href="/standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>別タブで単一HTMLを開く</span>
            </a>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-500">コードプレビュー（一部）：</span>
            <pre className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56">
              {htmlCode.slice(0, 1500)}...
            </pre>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors text-xs"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
