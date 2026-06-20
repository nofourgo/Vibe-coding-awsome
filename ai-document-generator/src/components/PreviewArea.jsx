import React, { useRef, useState, useEffect } from 'react';
import { templates } from '../templates';
import { Eye, ZoomIn, ZoomOut } from 'lucide-react';

export default function PreviewArea({ selectedTemplateId, documentData, previewRef }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Find the selected template component
  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const TemplateComponent = activeTemplate.component;

  // Auto-scale the A4 page (794px width) to fit its parent container
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parentWidth = containerRef.current.clientWidth;
      // Leave some padding
      const newScale = Math.min((parentWidth - 32) / 794, 1);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Also use ResizeObserver for more reliable parent-width detection
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full space-y-3">
      {/* Header Controls */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">Bản xem trước A4 (Real-time Preview)</h3>
        </div>
        <div className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
          Tỷ lệ: {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Main Preview Wrapper */}
      <div
        ref={containerRef}
        className="w-full bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex justify-center items-center overflow-hidden min-h-[500px]"
      >
        {/* Scaling Container */}
        <div
          style={{
            width: '794px',
            height: '1123px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
            flexShrink: 0,
          }}
          className="bg-white text-black shadow-2xl relative rounded-sm"
        >
          {/* Target container for html2pdf.js */}
          <div id="pdf-preview-area" ref={previewRef} className="w-full h-full">
            <TemplateComponent data={documentData} />
          </div>
        </div>
      </div>
    </div>
  );
}
