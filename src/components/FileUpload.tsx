'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export default function FileUpload({ onFileSelect, isLoading, error }: FileUploadProps) {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    disabled: isLoading
  });

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '900px', 
      margin: '0 auto',
      padding: '0 24px'
    }}>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 bg-white shadow-lg
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 shadow-xl transform scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:shadow-xl hover:transform hover:-translate-y-1'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            padding: '48px 24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            {/* Enhanced Loading Spinner */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '64px',
                height: '64px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '64px',
                height: '64px',
                border: '4px solid transparent',
                borderRight: '4px solid #7c3aed',
                borderRadius: '50%',
                animation: 'spin 1.5s linear infinite reverse'
              }}></div>
            </div>
            
            {/* Loading Text with Better Styling */}
            <div style={{ textAlign: 'center', gap: '16px', display: 'flex', flexDirection: 'column' }}>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#2563eb',
                margin: '0'
              }}>
                Analyzing your resume...
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  height: '12px',
                  background: '#e5e7eb',
                  borderRadius: '6px',
                  width: '200px',
                  margin: '0 auto',
                  animation: 'pulse 2s infinite'
                }}></div>
                <div style={{
                  height: '12px',
                  background: '#e5e7eb',
                  borderRadius: '6px',
                  width: '140px',
                  margin: '0 auto',
                  animation: 'pulse 2s infinite',
                  animationDelay: '0.5s'
                }}></div>
              </div>
            </div>
            
            {/* Progress Component */}
            <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '14px', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                <span>Processing...</span>
                <span>Please wait</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                  borderRadius: '4px',
                  width: '70%',
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 mx-auto mb-4">
              <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-3">
                {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p className="text-gray-600 text-lg mb-6">
                Drag and drop your file here, or{' '}
                <span className="text-blue-600 font-semibold hover:text-purple-600 transition-colors cursor-pointer">browse files</span>
              </p>
              <p className="text-base text-gray-600 font-medium">
                Supports PDF and DOCX files up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-light-sm">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
