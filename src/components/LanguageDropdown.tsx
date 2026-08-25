import React from 'react';
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Language } from "@/utils/i18n";

interface LanguageDropdownProps {
  current: Language;
  onSelect: (lang: Language) => void;
}

const languages: { id: Language; label: string; flag: string }[] = [
  { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', label: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', label: 'Português', flag: '🇵🇹' },
  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
  { id: 'ko', label: '한국어', flag: '🇰🇷' },
  { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { id: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { id: 'pl', label: 'Polski', flag: '🇵🇱' },
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ current, onSelect }) => {
  const activeLang = languages.find((l) => l.id === current);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors shadow-sm"
          aria-label={activeLang?.label}
        >
          <Globe size={16} />
          <span className="text-xs">{activeLang?.flag}</span>
          <span className="text-xs font-bold hidden sm:inline">{activeLang?.label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 max-h-[320px] overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            onClick={() => onSelect(lang.id)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              current === lang.id && "bg-indigo-50 text-indigo-700 font-bold"
            )}
          >
            <span>{lang.flag}</span>
            <span className="flex-1">{lang.label}</span>
            {current === lang.id && <Check size={14} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;