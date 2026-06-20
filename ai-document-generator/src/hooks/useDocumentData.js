import { useState, useEffect } from 'react';

const DEFAULT_FIELDS = ['name', 'address', 'phone', 'date', 'items', 'amount'];

export default function useDocumentData() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [filePreview, setFilePreview] = useState('');

  // Multi-input states
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'text' | 'json'
  const [rawText, setRawText] = useState(''); // pasted plain text
  const [supplementaryText, setSupplementaryText] = useState(''); // optional text notes for file upload
  const [rawJsonText, setRawJsonText] = useState(''); // pasted raw JSON data

  // Load API Key from localStorage on initial render
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS);
  const [documentData, setDocumentData] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState('template-a');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist API Key changes to localStorage
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }, [apiKey]);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileType(selectedFile.type);
    setError('');

    // Generate preview URL if it's an image
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreview(url);
    } else if (selectedFile.type === 'application/pdf') {
      setFilePreview('pdf-icon'); // Placeholder for PDF
    } else {
      setFilePreview('');
    }
  };

  const handleAddField = (newField) => {
    const formatted = newField.trim().toLowerCase().replace(/\s+/g, '_');
    if (formatted && !selectedFields.includes(formatted)) {
      setSelectedFields([...selectedFields, formatted]);
    }
  };

  const handleRemoveField = (fieldToRemove) => {
    setSelectedFields(selectedFields.filter(f => f !== fieldToRemove));
  };

  const handleResetData = () => {
    setFile(null);
    setFileName('');
    setFileType('');
    setFilePreview('');
    setRawText('');
    setSupplementaryText('');
    setRawJsonText('');
    setDocumentData({});
    setError('');
  };

  return {
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
    setSelectedFields,
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
  };
}
