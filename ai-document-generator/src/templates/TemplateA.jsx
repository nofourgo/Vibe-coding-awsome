import React from 'react';

export default function TemplateA({ data = {} }) {
  const {
    name = '',
    address = '',
    phone = '',
    date = '',
    amount = '',
    invoice_number = '',
    email = '',
    company = '',
    items = [],
    ...rest
  } = data;

  // Filter out other metadata to list in addition details if needed
  const customFields = Object.entries(rest).filter(
    ([key, val]) => val !== undefined && val !== null && val !== '' && key !== 'items'
  );

  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="w-full h-full p-12 flex flex-col justify-between text-slate-800 bg-white font-sans text-sm leading-relaxed box-border">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900 uppercase">
              Báo Giá / Hóa Đơn
            </h1>
            <p className="text-slate-500 mt-1">Số tham chiếu: {invoice_number || 'QD-2026-001'}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-slate-800">{company || 'CÔNG TY TNHH VIBE CODING'}</h2>
            <p className="text-slate-500">Ngày lập: {date || '01/01/2026'}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 my-8">
          <div>
            <h3 className="font-bold text-indigo-900 uppercase tracking-wider text-xs mb-2">
              Khách hàng / Đối tác
            </h3>
            <p className="font-semibold text-slate-800 text-base">{name || '—'}</p>
            {phone && <p className="text-slate-600 mt-0.5">SĐT: {phone}</p>}
            {email && <p className="text-slate-600">Email: {email}</p>}
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 uppercase tracking-wider text-xs mb-2">
              Địa chỉ ghi nhận
            </h3>
            <p className="text-slate-600 whitespace-pre-line text-xs">{address || '—'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              {hasItems ? (
                <tr className="border-b-2 border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-2.5 w-[45%]">Hạng mục chi tiết</th>
                  <th className="py-2.5 text-center w-[15%]">Số lượng</th>
                  <th className="py-2.5 text-right w-[20%]">Đơn giá</th>
                  <th className="py-2.5 text-right w-[20%]">Thành tiền</th>
                </tr>
              ) : (
                <tr className="border-b-2 border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-2.5">Mô tả dịch vụ</th>
                  <th className="py-2.5 text-right">Tổng thành tiền</th>
                </tr>
              )}
            </thead>
            <tbody>
              {hasItems ? (
                items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3.5 font-medium text-slate-850 text-xs">
                      {item.description || 'Hạng mục #' + (idx + 1)}
                    </td>
                    <td className="py-3.5 text-center text-slate-600 text-xs">
                      {item.quantity || '1'}
                    </td>
                    <td className="py-3.5 text-right text-slate-600 text-xs font-mono">
                      {item.price || '—'}
                    </td>
                    <td className="py-3.5 text-right font-semibold text-slate-850 text-xs font-mono">
                      {item.total || '0 đ'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-slate-100">
                  <td className="py-4 font-medium text-slate-850">
                    Chi phí dịch vụ trích xuất dữ liệu tổng hợp
                  </td>
                  <td className="py-4 text-right font-semibold text-indigo-900">
                    {amount || '0 đ'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Meta Fields */}
        {customFields.length > 0 && (
          <div className="mt-8 pt-4 border-t border-dashed border-slate-105">
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2">Thông tin bổ sung</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
              {customFields.map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-slate-700 font-mono font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Total */}
      <div className="border-t border-slate-200 pt-6 mt-auto">
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-400 max-w-[60%]">
            Cảm ơn quý khách đã tin tưởng dịch vụ của chúng tôi. Báo cáo báo giá được tạo tự động bằng AI Document Generator.
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-indigo-900/50 uppercase tracking-wider">
              Tổng giá trị báo giá
            </p>
            <p className="text-2xl font-black text-indigo-900 mt-1">
              {amount || '0 đ'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
