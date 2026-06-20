import React from 'react';

export default function TemplateB({ data = {} }) {
  const {
    name = '',
    address = '',
    phone = '',
    date = '',
    amount = '',
    invoice_number = '',
    merchant = '',
    items = [],
    ...rest
  } = data;

  const customFields = Object.entries(rest).filter(
    ([key, val]) => val !== undefined && val !== null && val !== '' && key !== 'items'
  );

  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between text-slate-800 bg-slate-50 font-mono text-xs leading-relaxed box-border">
      {/* Receipt body container */}
      <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col flex-grow">
        {/* Merchant Header */}
        <div className="text-center pb-6 border-b border-dashed border-slate-300">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
            {merchant || 'BIÊN LAI BÁN LẺ'}
          </h1>
          <p className="text-slate-500 mt-1">Mã GD: {invoice_number || 'TXN-' + Math.floor(100000 + Math.random() * 900000)}</p>
          <p className="text-slate-400">Thời gian: {date || '01/01/2026'}</p>
        </div>

        {/* Customer Content */}
        <div className="my-5 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Khách hàng:</span>
            <span className="font-semibold text-slate-800 text-right">{name || 'Khách vãng lai'}</span>
          </div>
          {phone && (
            <div className="flex justify-between">
              <span className="text-slate-400">Số điện thoại:</span>
              <span className="text-slate-800">{phone}</span>
            </div>
          )}
          {address && (
            <div className="flex justify-between items-start">
              <span className="text-slate-400 min-w-[80px]">Địa chỉ:</span>
              <span className="text-slate-800 text-right max-w-[70%] truncate">{address}</span>
            </div>
          )}
        </div>

        {/* Dashed Separator */}
        <div className="border-b border-dashed border-slate-300 my-1"></div>

        {/* Items Details */}
        <div className="my-3 flex-grow">
          {hasItems ? (
            <div className="space-y-3">
              <div className="flex justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                <span>HẠNG MỤC</span>
                <span>TỔNG</span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-medium text-slate-800">
                    <span>{item.description || 'Hạng mục #' + (idx + 1)}</span>
                    <span>{item.total || '0 đ'}</span>
                  </div>
                  {(item.quantity || item.price) && (
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>
                        SL: {item.quantity || '1'} x {item.price || '—'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex justify-between font-bold text-slate-900 mb-2">
                <span>MÔ TẢ</span>
                <span>TỔNG</span>
              </div>
              <div className="flex justify-between text-slate-700 py-1">
                <span>Thanh toán dịch vụ trích xuất</span>
                <span>{amount || '0 đ'}</span>
              </div>
            </div>
          )}

          {customFields.length > 0 && (
            <>
              <div className="border-b border-dashed border-slate-200 my-4"></div>
              <div className="space-y-1">
                {customFields.map(([key, val]) => (
                  <div key={key} className="flex justify-between text-slate-400 text-[10px]">
                    <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-slate-700">{val}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Total and Tax info */}
        <div className="border-t-2 border-double border-slate-300 pt-4 mt-auto">
          <div className="flex justify-between items-center font-bold text-lg text-slate-900">
            <span>TỔNG CỘNG:</span>
            <span>{amount || '0 đ'}</span>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-6 space-y-1">
            <p>Xin cảm ơn quý khách. Hẹn gặp lại!</p>
            <p className="font-sans">Tạo bởi AI Document Generator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
