import html2pdf from 'html2pdf.js';

/**
 * Exports a DOM element as a high-quality PDF.
 * @param {HTMLElement} element - The DOM element to render (e.g. #pdf-preview-area)
 * @param {string} [filename="document.pdf"] - The name of the exported file
 * @returns {Promise<void>}
 */
export async function exportToPDF(element, filename = 'document.pdf') {
  if (!element) {
    throw new Error('Không tìm thấy vùng dữ liệu để xuất PDF.');
  }

  const opt = {
    margin: 0, // Set to 0 to preserve the full-page template styling
    filename: filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', // Default to A4 as specified in requirements
      orientation: 'portrait' 
    }
  };

  try {
    return html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF Export Error:', err);
    throw new Error(err.message || 'Lỗi trong quá trình xuất file PDF.');
  }
}
