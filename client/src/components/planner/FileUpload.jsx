import { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileUpload({ onFileChange }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setFile(selectedFile);
    setContent('');
    onFileChange({ file: selectedFile, content: '' });
  };

  const handleFileInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileChange({ file: null, content: '' });
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setFile(null);
    onFileChange({ file: null, content: text });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'docx': return <FileText className="text-blue-500" />;
      case 'txt': return <FileText className="text-gray-500" />;
      default: return <FileText className="text-violet-500" />;
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if leaving the drop zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'upload' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'paste' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Type/Paste Text
        </button>
      </div>

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <div className="space-y-4" ref={dropZoneRef}>
          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 text-center space-y-4 transition-all ${
              isDragging 
                ? 'border-violet-500 bg-violet-50 scale-[1.01] shadow-sm' 
                : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Overlay that covers entire drop zone during drag */}
            {isDragging && (
              <div className="absolute inset-0 bg-violet-50/50 rounded-xl flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-md border border-violet-200">
                  <UploadCloud className="mx-auto text-violet-500 animate-bounce" size={32} />
                  <p className="text-violet-600 font-medium mt-2">Drop your file here</p>
                </div>
              </div>
            )}

            <UploadCloud className={`mx-auto ${isDragging ? 'text-violet-500' : 'text-gray-400'}`} size={32} />
            <p className={`${isDragging ? 'text-violet-600 font-medium' : 'text-gray-600'}`}>
              {isDragging ? 'Drop your file here' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-sm text-gray-400">Supports PDF, DOCX, TXT files up to 10MB</p>

            <div>
              <label className="inline-flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-violet-700 transition-colors">
                <UploadCloud size={16} />
                Choose File
                <input
                  type="file"
                  onChange={handleFileInputChange}
                  accept=".pdf,.docx,.txt"
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* File Preview Card */}
          {file && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getFileIcon(file.name)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-[500px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paste Section */}
      {activeTab === 'paste' && (
        <textarea
          rows={6}
          placeholder="Paste your syllabus text here..."
          value={content}
          onChange={handleContentChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      )}
    </div>
  );
}