import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Code, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DocumentInputPanel({
  file,
  fileName,
  fileType,
  filePreview,
  inputMode,
  setInputMode,
  rawText,
  setRawText,
  supplementaryText,
  setSupplementaryText,
  rawJsonText,
  setRawJsonText,
  onFileChange,
  onResetFile,
  onJsonSubmit,
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [jsonError, setJsonError] = useState('');
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChangeInternal = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (validTypes.includes(selectedFile.type)) {
      onFileChange(selectedFile);
    } else {
      alert('Vui lòng chỉ tải lên file ảnh JPG, PNG hoặc file PDF.');
    }
  };

  const handleJsonLoad = () => {
    setJsonError('');
    setJsonSuccess(false);
    try {
      if (!rawJsonText.trim()) {
        throw new Error('Vui lòng nhập nội dung JSON.');
      }
      const parsed = JSON.parse(rawJsonText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Dữ liệu phải là một đối tượng JSON (Object), ví dụ: { "key": "value" }.');
      }
      onJsonSubmit(parsed);
      setJsonSuccess(true);
      setTimeout(() => setJsonSuccess(false), 2000);
    } catch (err) {
      setJsonError(err.message || 'JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setInputMode('file')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            inputMode === 'file'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Tải File (Ảnh/PDF)
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            inputMode === 'text'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Văn Bản Thô
        </button>
        <button
          onClick={() => setInputMode('json')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
            inputMode === 'json'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Nhập JSON
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[140px]">
        {inputMode === 'file' && (
          <div className="space-y-3">
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChangeInternal}
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-xs font-medium text-slate-200 text-center">
                  Kéo thả hoặc click để chọn file ảnh/PDF
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Hỗ trợ tối đa 20MB
                </p>
              </div>
            ) : (
              <div className="border border-slate-700 rounded-xl bg-slate-800/50 p-4 flex items-center justify-between group">
                <div className="flex items-center space-x-3 min-w-0">
                  {fileType.startsWith('image/') ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate pr-2">{fileName}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">
                      {fileType.split('/')[1] || 'Unknown'} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={onResetFile}
                  className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors border border-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Supplementary instructions */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-400">
                Ghi chú/Mô tả bổ sung cho AI (Tùy chọn)
              </label>
              <textarea
                rows={2}
                value={supplementaryText}
                onChange={(e) => setSupplementaryText(e.target.value)}
                placeholder="Ví dụ: Dịch địa chỉ sang tiếng Anh, lấy thêm mã số thuế nếu có..."
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors text-xs resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {inputMode === 'text' && (
          <div className="space-y-2">
            <label className="block text-[10px] font-semibold text-slate-400">
              Nhập hoặc dán nội dung văn bản tài liệu
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Dán nội dung văn bản tại đây (Ví dụ: chi tiết hóa đơn copy từ email)..."
              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 transition-colors text-xs leading-relaxed"
            />
          </div>
        )}

        {inputMode === 'json' && (
          <div className="space-y-3">
            <label className="block text-[10px] font-semibold text-slate-400">
              Nhập hoặc dán chuỗi JSON của form
            </label>
            <textarea
              rows={5}
              value={rawJsonText}
              onChange={(e) => setRawJsonText(e.target.value)}
              placeholder='Ví dụ: { "name": "Nguyễn Văn A", "amount": "1.000.000đ" }'
              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-205 focus:outline-none focus:border-indigo-500 transition-colors text-xs font-mono leading-relaxed"
            />
            
            <button
              onClick={handleJsonLoad}
              className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                jsonSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {jsonSuccess ? 'Đã tải thành công!' : 'Đổ dữ liệu vào form & preview'}
            </button>

            {jsonError && (
              <div className="flex items-center space-x-1.5 text-red-400 text-[10px] bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
