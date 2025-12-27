import { useState, useRef } from 'react';
import { uploadCSV } from '../services/api';

function FileUpload({ onUploadSuccess, onError }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      onError('Please select a CSV file');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      onError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (event) => {
    handleFileChange(event.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      const response = await uploadCSV(file);
      onUploadSuccess(response.data);
      
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-modern">
      <h2>📁 Upload Your Data</h2>
      <p className="upload-subtitle">Drag and drop or click to browse</p>
      
      <div 
        className={`dropzone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {!file ? (
          <div className="dropzone-content">
            <div className="upload-icon">📤</div>
            <p className="dropzone-text">Drop your CSV file here</p>
            <p className="dropzone-subtext">or click to browse</p>
            <div className="file-types">Supports: .csv (Max 10MB)</div>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
            </div>
            <button 
              className="file-remove"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`upload-button-modern ${uploading ? 'uploading' : ''}`}
      >
        {uploading ? (
          <>
            <span className="spinner"></span>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span>Upload & Analyze</span>
          </>
        )}
      </button>
    </div>
  );
}

export default FileUpload;                  