import React, { useState } from 'react';
import { Key, Plus, Sparkles, X, Eye, EyeOff } from 'lucide-react';

export default function AIExtractor({
  apiKey,
  setApiKey,
  selectedFields,
  onAddField,
  onRemoveField,
  onExtract,
  isLoading,
  inputMode,
  hasFile,
  hasText,
}) {
  const [newFieldName, setNewFieldName] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmitField = (e) => {
    e.preventDefault();
    if (newFieldName.trim()) {
      onAddField(newFieldName);
      setNewFieldName('');
    }
  };

  // If in JSON mode, AI extraction is bypassed, so we render a helpful informational note
  if (inputMode === 'json') {
    return (
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
        <p className="text-xs text-slate-400 leading-relaxed italic text-center">
          * Trong chế độ nhập JSON trực tiếp, bạn không cần dùng đến AI Extractor. Dữ liệu sẽ được nạp và hiển thị trực tiếp từ chuỗi JSON của bạn.
        </p>
      </div>
    );
  }

  // Determine if extraction button should be enabled
  const canExtract = apiKey && (inputMode === 'file' ? hasFile : hasText);

  return (
    <div className="w-full space-y-6">
      {/* API Key Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          2. Cấu hình Gemini API Key
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Key className="w-4 h-4" />
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-800/40 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
          * Khóa API được lưu cục bộ trên trình duyệt của bạn (localStorage) và gửi trực tiếp đến Google Gemini.
        </p>
      </div>

      {/* Target Fields Section */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          3. Chọn thông tin cần trích xuất
        </label>

        {/* Existing Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedFields.map((field) => (
            <span
              key={field}
              className="inline-flex items-center pl-2.5 pr-1.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold"
            >
              <span className="font-mono">{field}</span>
              <button
                type="button"
                onClick={() => onRemoveField(field)}
                className="ml-1.5 p-0.5 rounded hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {selectedFields.length === 0 && (
            <p className="text-xs text-slate-500 italic">Vui lòng nhập trường dữ liệu cần trích xuất...</p>
          )}
        </div>

        {/* Add custom field input */}
        <form onSubmit={handleSubmitField} className="flex gap-2">
          <input
            type="text"
            placeholder="Tên trường (ví dụ: vat_id, email, website...)"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className="flex-grow px-3 py-2 bg-slate-800/20 border border-slate-700/60 rounded-xl text-slate-205 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 transition-colors text-xs"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-xl transition-all font-medium text-xs flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm
          </button>
        </form>
      </div>

      {/* Trigger Extraction Button */}
      <button
        onClick={onExtract}
        disabled={isLoading || !canExtract}
        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
          isLoading
            ? 'bg-indigo-600/40 text-indigo-300 cursor-not-allowed border border-indigo-500/20'
            : !canExtract
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></span>
            Đang trích xuất OCR...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Trích xuất bằng Gemini 2.5 Flash
          </>
        )}
      </button>
    </div>
  );
}
