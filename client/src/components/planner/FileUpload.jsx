import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function FileUpload({ onFileChange }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setContent(''); // clear text if file is chosen
    onFileChange({ file: selectedFile, content: '' });

    if (selectedFile.type === 'application/pdf') {
      setPreview('PDF file');
    } else if (
      selectedFile.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setPreview('DOCX file');
    } else {
      setPreview(selectedFile.name);
    }
  };

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    setFile(null); // clear file if text is typed
    onFileChange({ file: null, content: text });
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'upload'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'paste'
              ? 'bg-violet-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Type/Paste Text
        </button>
      </div>

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <div className="border border-gray-300 rounded-xl p-6 text-center space-y-4 bg-white shadow-sm">
          <UploadCloud className="mx-auto text-gray-400" size={32} />
          <p className="text-gray-600">Drop your PDF here or click to browse</p>
          <p className="text-sm text-gray-400">Supports PDF files up to 10MB</p>

          <div>
            <label className="inline-block bg-violet-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-violet-700">
              Choose File
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
                className="sr-only"
              />
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-500">{preview}</p>
            )}
          </div>
        </div>
      )}

      {/* Paste Section */}
      {activeTab === 'paste' && (
        <textarea
          rows={6}
          placeholder="Paste your syllabus text here..."
          value={content}
          onChange={handleContentChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      )}
    </div>
  );
}
