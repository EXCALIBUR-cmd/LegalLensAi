'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface DocumentUploadProps {
  onUploadComplete?: (documentId: string) => void;
}

export default function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setError('');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
      setError('');
    }
  }, [title]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file || !title) {
      setError('Please select a file and provide a title');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Upload failed');
      }
      setFile(null);
      setTitle('');
      
      if (onUploadComplete) {
        onUploadComplete(data.document.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document. Please try again.';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        {!file ? (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop your legal document here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/jpg,image/png"
              />
              Browse Files
            </label>
            <p className="text-xs text-gray-500 mt-2">Supported: TXT, PDF, DOC, DOCX, JPG, JPEG, PNG</p>
          </>
        ) : (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Document Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document title"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
