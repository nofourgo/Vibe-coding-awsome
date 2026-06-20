import React, { useRef } from 'react';
import useDocumentData from './hooks/useDocumentData';
import { extractDocumentData } from './services/gemini.service';
import DocumentInputPanel from './components/DocumentInputPanel';
import AIExtractor from './components/AIExtractor';
import DataFormEditor from './components/DataFormEditor';
import TemplateSelector from './components/TemplateSelector';
import PreviewArea from './components/PreviewArea';
import ExportPDFButton from './components/ExportPDFButton';
import { Cpu, FileText } from 'lucide-react';

export default function App() {
  const {
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
    apiKey,
    setApiKey,
    selectedFields,
    handleAddField,
    handleRemoveField,
    documentData,
    setDocumentData,
    selectedTemplateId,
    setSelectedTemplateId,
    isLoading,
    setIsLoading,
    error,
    setError,
    handleFileChange,
    handleResetData,
  } = useDocumentData();

  const previewRef = useRef(null);

  const handleExtract = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await extractDocumentData(
        { file, rawText, supplementaryText, inputMode },
        selectedFields,
        apiKey
      );
      setDocumentData(data);
    } catch (err) {
      setError(err.message || 'Lỗi xảy ra trong quá trình xử lý tài liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJsonSubmit = (parsedJson) => {
    setDocumentData(parsedJson);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-900/30 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                AI Document Generator <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-normal">MVP</span>
              </h1>
              <p className="text-[10px] text-slate-500">OCR & Trích xuất dữ liệu thông minh qua Gemini 2.5 Flash</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Trạng thái: Hoạt động (Client-side)</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Input Panel (5/12 cols) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Section Step Indicators */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-6">
            <DocumentInputPanel
              file={file}
              fileName={fileName}
              fileType={fileType}
              filePreview={filePreview}
              inputMode={inputMode}
              setInputMode={setInputMode}
              rawText={rawText}
              setRawText={setRawText}
              supplementaryText={supplementaryText}
              setSupplementaryText={setSupplementaryText}
              rawJsonText={rawJsonText}
              setRawJsonText={setRawJsonText}
              onFileChange={handleFileChange}
              onResetFile={handleResetData}
              onJsonSubmit={handleJsonSubmit}
            />

            <AIExtractor
              apiKey={apiKey}
              setApiKey={setApiKey}
              selectedFields={selectedFields}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
              onExtract={handleExtract}
              isLoading={isLoading}
              inputMode={inputMode}
              hasFile={!!file}
              hasText={!!rawText.trim()}
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs leading-relaxed">
                {error}
              </div>
            )}
          </div>

          {/* Form Editor Section */}
          <DataFormEditor
            documentData={documentData}
            onDataChange={setDocumentData}
          />

          {/* Export Section */}
          {Object.keys(documentData).length > 0 && (
            <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                5. Xuất bản tài liệu
              </label>
              <ExportPDFButton
                previewRef={previewRef}
                documentName={documentData.name || fileName || 'van_ban_trich_xuat'}
              />
            </div>
          )}
        </section>

        {/* Right Column - Preview Area (7/12 cols) */}
        <section className="lg:col-span-7 flex flex-col space-y-6">
          {/* Template Selection */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5">
            <TemplateSelector
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />
          </div>

          {/* Real-time Preview Area */}
          <div className="flex-grow">
            <PreviewArea
              selectedTemplateId={selectedTemplateId}
              documentData={documentData}
              previewRef={previewRef}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-950 py-6 text-center text-xs text-slate-600 bg-slate-950">
        <p>© 2026 AI Document Generator. Powered by Google Gemini. Built in pair-programming with Antigravity.</p>
      </footer>
    </div>
  );
}
