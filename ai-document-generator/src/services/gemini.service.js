import { GoogleGenAI } from '@google/genai';

/**
 * Converts a browser File object to a base64 string suitable for the Google GenAI API.
 * @param {File} file 
 * @returns {Promise<string>} base64 string without data prefix
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove prefix (e.g. "data:image/png;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uses Gemini 2.5 Flash to OCR and extract structured key-value data from a document file or raw text.
 * @param {Object} input - Input containing file, rawText, supplementaryText, and inputMode
 * @param {File} [input.file] - The uploaded file (image or PDF)
 * @param {string} [input.rawText] - Pasted plain text document
 * @param {string} [input.supplementaryText] - Extra user instructions for the document
 * @param {string} input.inputMode - Current input source ('file' | 'text')
 * @param {Array<string>} fields - List of fields to extract
 * @param {string} apiKey - Google Gemini API Key
 * @returns {Promise<Object>} The extracted structured data
 */
export async function extractDocumentData({ file, rawText, supplementaryText, inputMode }, fields, apiKey) {
  if (!apiKey) {
    throw new Error('Vui lòng cung cấp Gemini API Key.');
  }
  if (!fields || fields.length === 0) {
    throw new Error('Vui lòng chọn hoặc thêm ít nhất một trường dữ liệu cần trích xuất.');
  }

  // 1. Initialize GoogleGenAI client
  const ai = new GoogleGenAI({ apiKey });

  // 2. Build dynamic response schema
  const properties = {};
  const required = [];

  fields.forEach(field => {
    if (field === 'items') {
      properties[field] = {
        type: 'array',
        description: 'Danh sách các mặt hàng, sản phẩm hoặc hạng mục dịch vụ chi tiết được liệt kê trong tài liệu (List of item rows containing description, quantity, price, and total).',
        items: {
          type: 'object',
          properties: {
            description: { type: 'string', description: 'Mô tả chi tiết hạng mục hoặc tên sản phẩm/dịch vụ' },
            quantity: { type: 'string', description: 'Số lượng (ví dụ: 1, 2...)' },
            price: { type: 'string', description: 'Đơn giá của hạng mục này' },
            total: { type: 'string', description: 'Thành tiền của hạng mục này (bắt buộc phải có)' },
          },
          required: ['description', 'total'],
        },
      };
    } else {
      properties[field] = {
        type: 'string',
        description: `Extract the value for '${field}' from the document. If it represents a date, format it as DD/MM/YYYY. If it represents a price/amount, keep currency formatting. If not present in the document, return an empty string.`,
      };
    }
    required.push(field);
  });

  const responseSchema = {
    type: 'object',
    properties,
    required,
  };

  // 3. Set up content parts based on the input mode
  let contents = [];

  if (inputMode === 'file') {
    if (!file) {
      throw new Error('Vui lòng chọn tài liệu để tải lên.');
    }
    const base64Data = await fileToBase64(file);
    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    });

    let prompt = 'Analyze this document. Perform high-accuracy OCR and extract the requested fields strictly in JSON format. Maintain natural Vietnamese values where appropriate.';
    if (supplementaryText && supplementaryText.trim()) {
      prompt += `\n\nLưu ý đặc biệt từ người dùng (Special instructions from user): "${supplementaryText.trim()}"`;
    }
    contents.push(prompt);
  } else if (inputMode === 'text') {
    if (!rawText || !rawText.trim()) {
      throw new Error('Vui lòng nhập hoặc dán nội dung văn bản cần trích xuất.');
    }
    contents.push(
      `Dưới đây là nội dung văn bản của tài liệu (Here is the raw text of the document):\n---\n${rawText}\n---\n\n` +
      `Hãy phân tích văn bản trên và trích xuất các trường dữ liệu được yêu cầu theo định dạng JSON.`
    );
  } else {
    throw new Error('Chế độ đầu vào không hợp lệ.');
  }

  // 4. Call API
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error('Không nhận được phản hồi từ Gemini.');
    }

    // 5. Parse response
    const parsedData = JSON.parse(response.text);
    return parsedData;
  } catch (err) {
    console.error('Gemini API Error:', err);
    throw new Error(err.message || 'Lỗi trong quá trình trích xuất dữ liệu bằng Gemini.');
  }
}
