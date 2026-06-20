import React from 'react';
import { templates } from '../templates';
import { Layout, Check } from 'lucide-react';

export default function TemplateSelector({ selectedTemplateId, onSelectTemplate }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <Layout className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-200">Chọn mẫu giao diện (Template)</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5'
                  : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 rounded-bl-xl flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">{tpl.name}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed pr-4">
                  {tpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
