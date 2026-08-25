import React, { useState, useMemo } from 'react';
import { History, Trash2, ChevronRight, Search, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess } from "@/utils/toast";
import { Translation } from "@/utils/i18n";

interface HistoryItem {
  id: string;
  original: string;
  enhanced: string;
  techniques: string[];
  timestamp: number;
  tokenEstimate?: number;
}

interface PromptHistoryProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onDeleteItem?: (id: string) => void;
  onCopyItem?: (text: string) => void;
  t: Translation;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ 
  items, 
  onSelect, 
  onClear, 
  onDeleteItem, 
  onCopyItem,
  t 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.original.toLowerCase().includes(query) ||
      item.enhanced.toLowerCase().includes(query) ||
      item.techniques.some(tech => tech.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  if (items.length === 0) return null;

  const handleCopy = (text: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
    showSuccess(t.copied || "Copied");
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDeleteItem) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold">
          <History size={18} />
          <h2>{t.recentHistory}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Input
              placeholder={t.searchHistory || "Search history..."}
              className="h-8 text-xs rounded-xl border-slate-200 ps-8 focus:border-indigo-300 focus:ring-indigo-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={10} />
              </button>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear} 
            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} className="me-1" /> {t.clearAll}
          </Button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">
          {t.noResults || "No matching history found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary/30 hover:shadow-md transition-all relative"
            >
              <button
                onClick={() => onSelect(item)}
                className="flex-1 text-start cursor-pointer"
              >
                <div className="flex-1 min-w-0 pe-4">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    {item.original}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {item.tokenEstimate && (
                      <span className="text-[10px] text-slate-300">
                        ~{item.tokenEstimate} tokens
                      </span>
                    )}
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-1">
                {onCopyItem && (
                  <button
                    onClick={(e) => handleCopy(item.enhanced, e)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy enhanced"
                  >
                    <Copy size={12} />
                  </button>
                )}
                {onDeleteItem && (
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptHistory;