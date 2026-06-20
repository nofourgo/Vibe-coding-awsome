import React, { useState } from 'react';
import { exportToPDF } from '../services/pdf.service';
import { FileDown, Check, AlertCircle } from 'lucide-react';

export default function ExportPDFButton({ previewRef, documentName }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    if (!previewRef.current) {
      setError('Không tìm thấy vùng dữ liệu bản xem trước.');
      return;
    }

    setIsExporting(true);
    setError('');
    setExportSuccess(false);

    try {
      // Create a nice file name based on document fields or a timestamp
      const sanitizedName = documentName 
        ? documentName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_')
        : 'tai_lieu_ai';
      const filename = `${sanitizedName}_${Date.now()}.pdf`;
      
      await exportToPDF(previewRef.current, filename);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000); // Reset success after 3 seconds
    } catch (err) {
      console.error(err);
      setError(err.message || 'Lỗi khi xuất PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
          isExporting
            ? 'bg-emerald-600/40 text-emerald-300 cursor-not-allowed border border-emerald-500/20'
            : exportSuccess
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98]'
        }`}
      >
        {isExporting ? (
          <>
            <span className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin"></span>
            Đang xuất PDF...
          </>
        ) : exportSuccess ? (
          <>
            <Check className="w-4 h-4" />
            Đã xuất PDF thành công!
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            Xuất File PDF Chất Lượng Cao
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-xs mt-1 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
