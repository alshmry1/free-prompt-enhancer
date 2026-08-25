import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, BrainCircuit, Zap, Hash, AlertTriangle, X, Pencil, Download, RefreshCw } from "lucide-react";
import { showSuccess } from "@/utils/toast";
import { Translation } from "@/utils/i18n";
import { OutputFormat } from "@/utils/prompt-logic";

interface EnhancedResultProps {
  content: string;
  techniques: string[];
  t: Translation;
  tokenEstimate?: number;
  warnings?: string[];
  format?: OutputFormat;
  onRegenerate?: () => void;
}

const EnhancedResult: React.FC<EnhancedResultProps> = ({
  content,
  techniques,
  t,
  tokenEstimate,
  warnings,
  format = 'standard',
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  // Sync local edit buffer whenever a fresh result arrives (e.g. regenerate)
  useEffect(() => {
    setEditText(content);
    setIsEditing(false);
  }, [content]);

  const handleCopy = () => {
    if (!editText) return;
    navigator.clipboard.writeText(editText);
    setCopied(true);
    showSuccess(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!editText) return;
    const ext = format === 'markdown' ? 'md' : format === 'xml' ? 'xml' : 'txt';
    const blob = new Blob([editText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enhanced-prompt.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showSuccess(t.download);
  };

  const hasWarnings = warnings && warnings.length > 0 && !dismissedWarnings;

  if (!content) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-900/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.outputLog}</span>
            {tokenEstimate !== undefined && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/30">
                <Hash size={10} className="text-slate-500" />
                <span className="text-[10px] font-medium text-slate-400">~{tokenEstimate} tokens</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                title={t.regenerate}
                aria-label={t.regenerate}
                className="h-8 w-8 p-0 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-all duration-300 border border-white/5"
              >
                <RefreshCw size={14} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing((v) => !v)}
              title={isEditing ? t.save : t.edit}
              aria-label={isEditing ? t.save : t.edit}
              className="h-8 w-8 p-0 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-all duration-300 border border-white/5"
            >
              {isEditing ? <Check size={14} /> : <Pencil size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title={t.download}
              aria-label={t.download}
              className="h-8 w-8 p-0 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 transition-all duration-300 border border-white/5"
            >
              <Download size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-all duration-300 gap-2 border border-indigo-500/20 px-3"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">{copied ? t.copied : t.copyPrompt}</span>
            </Button>
          </div>
        </div>

        {hasWarnings && (
          <div className="px-6 py-3 bg-amber-500/5 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500/70" />
              <span className="text-xs text-amber-200/70">{warnings.join(' • ')}</span>
            </div>
            <button
              onClick={() => setDismissedWarnings(true)}
              className="p-1 hover:bg-amber-500/10 rounded transition-colors"
            >
              <X size={12} className="text-amber-500/50 hover:text-amber-500/70" />
            </button>
          </div>
        )}

        <div className="p-1">
          <div className="bg-slate-900 rounded-2xl p-6 md:p-10 max-h-[600px] overflow-y-auto custom-scrollbar">
            {isEditing ? (
              <Textarea
                dir="auto"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[360px] bg-transparent border-0 focus-visible:ring-0 text-sm md:text-base text-slate-200 font-mono leading-relaxed resize-y custom-scrollbar p-0 selection:bg-indigo-500/30"
              />
            ) : (
              <pre dir="auto" className="whitespace-pre-wrap text-sm md:text-base text-slate-300 font-mono leading-relaxed selection:bg-indigo-500/30">
                {editText}
              </pre>
            )}

            {techniques.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-indigo-400/60 font-bold text-[9px] uppercase tracking-[0.2em] mb-4">
                  <BrainCircuit size={12} />
                  {t.optSeq}
                </div>
                <div className="flex flex-wrap gap-2">
                  {techniques.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/50"
                    >
                      <Zap size={10} className="text-amber-500/50" />
                      <span className="text-[10px] font-medium text-slate-500">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedResult;