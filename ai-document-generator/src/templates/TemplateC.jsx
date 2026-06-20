import React from 'react';

export default function TemplateC({ data = {} }) {
  const {
    name = '',
    address = '',
    phone = '',
    date = '',
    amount = '',
    invoice_number = '',
    title = '',
    items = [],
    ...rest
  } = data;

  const customFields = Object.entries(rest).filter(
    ([key, val]) => val !== undefined && val !== null && val !== '' && key !== 'items'
  );

  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="w-full h-full p-12 bg-white flex flex-col justify-between text-slate-800 font-serif box-border relative">
      {/* Decorative Border */}
      <div className="absolute inset-6 border-4 border-double border-indigo-900 pointer-events-none"></div>
      <div className="absolute inset-8 border border-amber-600/40 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mt-10 z-10">
        <h1 className="text-2xl font-bold tracking-widest text-indigo-950 uppercase">
          {title || 'Báo Cáo Xác Nhận Báo Giá'}
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-amber-600 font-sans mt-1.5">
          Hệ thống AI Document OCR & Extraction
        </p>
      </div>

      {/* Customer Info Card */}
      <div className="grid grid-cols-2 gap-4 text-left font-sans text-xs bg-slate-50 p-4 border border-slate-100 rounded-lg mx-6 mt-6 z-10">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Khách hàng</span>
          <p className="font-bold text-slate-800 text-sm">{name || '—'}</p>
          {phone && <p className="text-slate-500 mt-1">SĐT: {phone}</p>}
        </div>
        <div className="border-l border-slate-200 pl-4">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-1">Tham chiếu</span>
          <p className="text-slate-700 font-mono">Mã số: {invoice_number || 'QD-26-889'}</p>
          <p className="text-slate-500 mt-0.5">Ngày: {date || '01/01/2026'}</p>
        </div>
      </div>

      {/* Detailed Items List */}
      <div className="my-4 px-6 z-10 flex-grow flex flex-col justify-center">
        <div className="w-full font-sans text-[11px] space-y-2 max-h-[300px] overflow-y-auto">
          {hasItems ? (
            <div className="space-y-1.5">
              <div className="grid grid-cols-12 font-bold text-indigo-950 uppercase border-b border-indigo-100 pb-1.5 text-[9px] tracking-wider">
                <span className="col-span-7">Danh mục hạng mục chi tiết</span>
                <span className="col-span-2 text-center">SL</span>
                <span className="col-span-3 text-right">Thành tiền</span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 text-slate-700 py-1.5 border-b border-slate-50 hover:bg-slate-50/30">
                  <span className="col-span-7 font-medium leading-relaxed">
                    {item.description || 'Hạng mục chi tiết #' + (idx + 1)}
                  </span>
                  <span className="col-span-2 text-center text-slate-500">
                    {item.quantity || '1'}
                  </span>
                  <span className="col-span-3 text-right font-semibold font-mono text-slate-800">
                    {item.total || '0 đ'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-between border-b border-indigo-100 pb-2 text-slate-750">
              <span className="font-semibold">Chi tiết dịch vụ tổng hợp</span>
              <span className="font-bold text-indigo-900">{amount || '0 đ'}</span>
            </div>
          )}
        </div>

        {/* Custom fields in details */}
        {customFields.length > 0 && (
          <div className="text-left font-sans text-[10px] border-t border-dashed border-slate-200 pt-3 mt-4">
            <h4 className="font-bold text-indigo-900 mb-1.5 uppercase text-[9px] tracking-wider">Các thông tin khác:</h4>
            <div className="grid grid-cols-2 gap-2">
              {customFields.map(([key, val]) => (
                <div key={key} className="flex justify-between bg-slate-50/50 p-1 rounded">
                  <span className="text-slate-400 capitalize truncate pr-2">{key.replace(/_/g, ' ')}</span>
                  <span className="text-slate-700 font-medium truncate">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Signature block */}
      <div className="flex justify-between items-end px-10 mt-auto mb-6 z-10 font-sans text-xs">
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Tổng báo giá được xác nhận</p>
          <p className="text-xl font-black text-indigo-950 mt-1 font-serif">{amount || '0 đ'}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400">Đơn vị phê duyệt</p>
          <div className="h-8 flex items-center justify-center">
            <span className="text-[9px] font-mono border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded bg-indigo-50/50 uppercase">
              AI SECURE
            </span>
          </div>
          <p className="font-bold text-slate-750">{date || '01/01/2026'}</p>
        </div>
      </div>
    </div>
  );
}
