'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface ExportPageProps {
  essay: string;
  onStartOver: () => void;
}

export default function ExportPage({ essay, onStartOver }: ExportPageProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(essay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([essay], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'perplexity-apm-essay.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEmailSend = async () => {
    if (!email.trim()) return;
    
    try {
      await api.sendEmail(email, essay);
      setEmail('');
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = "Just crafted my APM application essay with ProfileCrafted.com! 🚀";
    const url = "https://profilecrafted.com";
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-ui-text mb-4">Export Your Essay</h2>
        <p className="text-ui-text-secondary text-xl">Save and share your application essay</p>
      </div>

      {/* Central Essay Display Box */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '48px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '800px',
        margin: '0 auto 48px auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Your APM Essay</h3>
          <p style={{ color: '#6b7280' }}>Ready for your application</p>
        </div>
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          maxHeight: '400px',
          overflowY: 'auto',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <div style={{
            color: '#111827',
            fontSize: '16px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontWeight: '400'
          }}>
            {essay}
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-ui-text-secondary font-medium">
            {essay.split(' ').length} words
          </span>
        </div>
      </div>

      {/* Export Actions - Purple Active Buttons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '16px', 
        marginBottom: '48px',
        maxWidth: '800px',
        margin: '0 auto 48px auto'
      }}>
        {/* Copy to Clipboard */}
        <button
          onClick={handleCopy}
          className="btn-primary"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Download as TXT */}
        <button
          onClick={handleDownload}
          className="btn-primary"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download</span>
        </button>

        {/* Email Button */}
        <button
          onClick={() => {
            const email = prompt('Enter your email address:');
            if (email) handleEmailSend();
          }}
          className="btn-primary"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Email</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => handleSocialShare('linkedin')}
          className="btn-primary"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* Social Sharing - Sage Green Theme */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h3 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#1f2937', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #6b7280 0%, #10b981 50%, #059669 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Share Your Success</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => handleSocialShare('twitter')}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#2563eb';
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#3b82f6';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialShare('linkedin')}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#1d4ed8',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#1e40af';
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialShare('facebook')}
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#2563eb',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
              (e.target as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#2563eb';
              (e.target as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Final Message - Premium Light Theme */}
      <div className="text-center bg-gradient-to-r from-accent-blue/5 to-accent-green/5 border border-accent-blue/20 rounded-xl p-8 shadow-light-md">
        <h3 className="text-2xl font-bold text-light-text mb-2">🎉 You&apos;re All Set!</h3>
        <p className="text-light-text-secondary text-lg">
          Good luck with your APM application!
        </p>
        <button
          onClick={onStartOver}
          className="mt-6 px-6 py-3 bg-light-card border border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white rounded-lg transition-all duration-300 shadow-light-sm hover:shadow-light-md font-semibold"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
