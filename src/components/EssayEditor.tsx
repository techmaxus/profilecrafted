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
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ui-text-secondary"></div>
              <span className="hidden sm:inline">Regenerating...</span>
            </div>
          ) : (
            'Regenerate'
          )}
        </button>

        {/* Secondary Copy Button - Ghost Style */}
        <button
          onClick={handleCopy}
          className="btn-primary"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Secondary Email Button - Ghost Style */}
        <button
          onClick={() => {
            const email = prompt('Enter your email address:');
            if (email) onSendEmail(email);
          }}
          className="btn-primary"
        >
          Send Email
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
        >
          Download
        </button>
      </div>
    </div>
  );
}
