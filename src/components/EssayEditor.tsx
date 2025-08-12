'use client';

import { useState, useEffect } from 'react';

interface EssayEditorProps {
  essay: string;
  onEssayChange: (essay: string) => void;
  onRegenerate: () => void;
  onSendEmail: (email: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function EssayEditor({ 
  essay, 
  onEssayChange, 
  onRegenerate, 
  onSendEmail, 
  isLoading 
}: EssayEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const words = essay.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essay]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(essay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            ✍️
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            🎯
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            📝
          </div>
        </div>
        <h2 className="text-4xl font-semibold text-ui-text mb-3">Your APM Essay</h2>
        <p className="text-ui-text-secondary text-lg">Edit and perfect your application essay</p>
      </div>

      {/* Essay Text Area - Light Purple Theme */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '900px',
        margin: '0 auto 32px auto'
      }}>
        <textarea
          value={essay}
          onChange={(e) => onEssayChange(e.target.value)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #f3e8ff, #faf5ff)',
            color: '#111827',
            border: '2px solid #e879f9',
            borderRadius: '12px',
            padding: '24px',
            fontSize: '18px',
            lineHeight: '1.6',
            fontWeight: '400',
            minHeight: '350px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s ease',
            margin: '0 16px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#c084fc';
            e.target.style.boxShadow = '0 0 0 3px rgba(196, 132, 252, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e879f9';
            e.target.style.boxShadow = 'none';
          }}
          placeholder="Your essay will appear here..."
        />
        
        {/* Word Counter - Updated Styling */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb',
          margin: '24px 16px 0 16px'
        }}>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>
            <span style={{ fontWeight: '600', color: '#111827', fontSize: '18px' }}>{wordCount}</span> words
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
            Recommended: 350-450 words
          </div>
        </div>
      </div>

      {/* Action Buttons - Export Page Theme */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '16px', 
        marginBottom: '32px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Primary Regenerate Button - Blue-Purple Gradient */}
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ui-text-secondary"></div>
              <span className="hidden sm:inline">Regenerating...</span>
            </div>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Regenerate</span>
            </>
          )}
        </button>

        {/* Secondary Copy Button - Ghost Style */}
        <button
          onClick={handleCopy}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {copied ? (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Secondary Email Button - Ghost Style */}
        <button
          onClick={() => {
            const email = prompt('Enter your email address:');
            if (email) onSendEmail(email);
          }}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Send Email</span>
        </button>

        {/* Secondary Download Button - Ghost Style */}
        <button
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([essay], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = 'apm-essay.txt';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
