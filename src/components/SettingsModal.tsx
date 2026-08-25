"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Eye, EyeOff, Check, X, ExternalLink, Cpu } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { Translation, Language, isRTL } from "@/utils/i18n";

interface SettingsModalProps {
  t: Translation;
  lang: Language;
}

const GEMINI_KEY_URL = "https://aistudio.google.com/apikey";

const SettingsModal: React.FC<SettingsModalProps> = ({ t, lang }) => {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const STORAGE_KEY = "gemini_api_key";

  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      showError(t.emptyKeyError);
      return;
    }
    localStorage.setItem(STORAGE_KEY, apiKey.trim());
    showSuccess(t.saveSuccess);
    setOpen(false);
  };

  const handleClear = () => {
    setApiKey("");
    localStorage.removeItem(STORAGE_KEY);
    showSuccess(t.clearSuccess);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors shadow-sm"
          aria-label={t.settings}
        >
          <Settings size={18} />
        </button>
      </DialogTrigger>
      <DialogContent
        dir={isRTL(lang) ? 'rtl' : 'ltr'}
        className="sm:max-w-md bg-white border-slate-200 text-slate-800"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Settings size={18} className="text-indigo-500" />
            {t.settings}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* What is this key & why you need it */}
          <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-indigo-500 flex-shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900">
                {t.aiEnhance}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-indigo-900/70">
              {t.apiKeyDesc}
            </p>
            <a
              href={GEMINI_KEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
            >
              <ExternalLink size={12} />
              {t.getKey}
            </a>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.apiKey}
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder={t.apiKeyPlaceholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pe-10 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 end-2 flex items-center text-slate-400 hover:text-slate-600"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              {t.apiKeyHint}
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="flex-1 text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <X size={14} className="me-1" /> {t.clear}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Check size={14} className="me-1" /> {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;