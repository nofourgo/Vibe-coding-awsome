import React, { useState } from 'react';
import { Database, Trash2, ListPlus } from 'lucide-react';

// Helpers for auto-calculating values
const parseNumber = (str) => {
  if (!str) return 0;
  if (typeof str === 'number') return str;
  const cleaned = str.toString().replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
};

const parseQuantity = (str) => {
  if (!str) return 1;
  if (typeof str === 'number') return str;
  const normalized = str.toString().replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
};

const formatCurrency = (num) => {
  return Math.round(num).toLocaleString('vi-VN') + ' đ';
};

export default function DataFormEditor({ documentData, onDataChange }) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddField, setShowAddField] = useState(false);

  const keys = Object.keys(documentData);

  const handleFieldChange = (key, value) => {
    onDataChange({
      ...documentData,
      [key]: value,
    });
  };

  const handleRemoveField = (key) => {
    const updated = { ...documentData };
    delete updated[key];
    onDataChange(updated);
  };

  const handleAddNewField = (e) => {
    e.preventDefault();
    const formattedKey = newKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (formattedKey) {
      onDataChange({
        ...documentData,
        [formattedKey]: newValue,
      });
      setNewKey('');
      setNewValue('');
      setShowAddField(false);
    }
  };

  // Helper to calculate total quote sum from items
  const calculateAndSetTotal = (itemsArray) => {
    let sum = 0;
    itemsArray.forEach(item => {
      sum += parseNumber(item.total);
    });
    return sum > 0 ? formatCurrency(sum) : '';
  };

  // Line item handlers
  const handleItemFieldChange = (index, itemField, val) => {
    const updatedItems = [...(documentData.items || [])];
    const currentItem = {
      ...updatedItems[index],
      [itemField]: val
    };

    const qty = parseQuantity(itemField === 'quantity' ? val : currentItem.quantity);
    const priceVal = parseNumber(itemField === 'price' ? val : currentItem.price);
    const totalVal = parseNumber(itemField === 'total' ? val : currentItem.total);

    if (itemField === 'quantity') {
      if (priceVal > 0) {
        currentItem.total = formatCurrency(qty * priceVal);
      } else if (totalVal > 0 && qty > 0) {
        currentItem.price = formatCurrency(totalVal / qty);
      }
    } else if (itemField === 'price') {
      if (qty > 0) {
        currentItem.total = formatCurrency(qty * priceVal);
      }
    } else if (itemField === 'total') {
      if (qty > 0) {
        currentItem.price = formatCurrency(totalVal / qty);
      }
    }

    updatedItems[index] = currentItem;

    // Calculate sum of totals
    const newAmount = calculateAndSetTotal(updatedItems);
    
    const updatedData = {
      ...documentData,
      items: updatedItems,
    };
    if (newAmount) {
      updatedData.amount = newAmount;
    }

    onDataChange(updatedData);
  };

  const handleAddItemRow = () => {
    const updatedItems = [
      ...(documentData.items || []),
      { description: '', quantity: '1', price: '', total: '' }
    ];
    onDataChange({
      ...documentData,
      items: updatedItems
    });
  };

  const handleRemoveItemRow = (index) => {
    const updatedItems = (documentData.items || []).filter((_, idx) => idx !== index);
    const newAmount = calculateAndSetTotal(updatedItems);
    
    const updatedData = {
      ...documentData,
      items: updatedItems,
    };
    if (newAmount) {
      updatedData.amount = newAmount;
    } else {
      updatedData.amount = '';
    }
    
    onDataChange(updatedData);
  };

  // Helper to check if a value is long (deserves a textarea)
  const isLongValue = (val) => {
    if (typeof val !== 'string') return false;
    return val.length > 50 || val.includes('\n');
  };

  // Helper to format field labels
  const formatLabel = (key) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full border border-slate-700 bg-slate-800/20 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            4. Hiệu chỉnh dữ liệu trích xuất
          </h3>
        </div>
        {keys.length > 0 && (
          <button
            onClick={() => setShowAddField(!showAddField)}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showAddField ? 'Hủy' : '+ Thêm trường'}
          </button>
        )}
      </div>

      {/* Add New Key Inline Form */}
      {showAddField && (
        <form onSubmit={handleAddNewField} className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Tên trường (ví dụ: email)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
              required
            />
            <input
              type="text"
              placeholder="Giá trị (ví dụ: user@test.com)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Xác nhận thêm
          </button>
        </form>
      )}

      {/* Fields List */}
      {keys.length > 0 ? (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {keys.map((key) => {
            const val = documentData[key];
            const label = formatLabel(key);

            // SPECIAL CASE: Detailed Line Items Table/List
            if (key === 'items' && Array.isArray(val)) {
              return (
                <div key={key} className="space-y-3 border border-slate-800/80 bg-slate-900/10 p-3.5 rounded-xl relative group">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      {label} <span className="text-[9px] text-slate-600">({key})</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleAddItemRow}
                        className="text-[9px] font-bold bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                      >
                        <ListPlus className="w-3 h-3" /> Dòng mới
                      </button>
                      <button
                        onClick={() => handleRemoveField(key)}
                        className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10"
                        title="Gỡ danh sách hạng mục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {val.map((item, idx) => (
                      <div key={idx} className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 relative group/row">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="absolute top-2 right-2 text-slate-600 hover:text-red-400 transition-colors p-1 rounded opacity-0 group-hover/row:opacity-100"
                          title="Xóa dòng"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <div className="space-y-2">
                          {/* Item description */}
                          <div className="space-y-0.5 pr-6">
                            <span className="block text-[8px] text-slate-500 font-mono">Mô tả hạng mục</span>
                            <input
                              type="text"
                              value={item.description || ''}
                              onChange={(e) => handleItemFieldChange(idx, 'description', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-slate-700/60 rounded-md text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                              placeholder="Mô tả sản phẩm / dịch vụ..."
                            />
                          </div>

                          {/* Quantity, price, total grid */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-0.5">
                              <span className="block text-[8px] text-slate-500 font-mono">Số lượng</span>
                              <input
                                type="text"
                                value={item.quantity || ''}
                                onChange={(e) => handleItemFieldChange(idx, 'quantity', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-900 border border-slate-700/60 rounded-md text-slate-200 text-xs text-center focus:outline-none focus:border-indigo-500"
                                placeholder="1"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] text-slate-500 font-mono">Đơn giá</span>
                              <input
                                type="text"
                                value={item.price || ''}
                                onChange={(e) => handleItemFieldChange(idx, 'price', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-900 border border-slate-700/60 rounded-md text-slate-205 text-xs focus:outline-none focus:border-indigo-500"
                                placeholder="đ"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[8px] text-slate-500 font-mono">Thành tiền</span>
                              <input
                                type="text"
                                value={item.total || ''}
                                onChange={(e) => handleItemFieldChange(idx, 'total', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-900 border border-slate-700/60 rounded-md text-slate-200 text-xs font-semibold text-indigo-400 focus:outline-none focus:border-indigo-500"
                                placeholder="đ"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {val.length === 0 && (
                      <p className="text-[10px] text-slate-500 italic text-center py-2">
                        Chưa có dòng hạng mục nào.
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            // Normal inputs
            const valStr = val || '';
            return (
              <div key={key} className="space-y-1 relative group">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-medium text-slate-400 font-mono">
                    {label} <span className="text-[9px] text-slate-600">({key})</span>
                  </label>
                  <button
                    onClick={() => handleRemoveField(key)}
                    className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Xóa trường này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLongValue(valStr) ? (
                  <textarea
                    rows={3}
                    value={valStr}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors text-xs resize-none leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={valStr}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors text-xs"
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-xl">
          <p className="text-xs text-slate-500 leading-relaxed italic">
            Chưa có dữ liệu trích xuất. Tải lên tài liệu và chạy OCR bằng Gemini để hiển thị biểu mẫu hiệu chỉnh.
          </p>
        </div>
      )}
    </div>
  );
}
