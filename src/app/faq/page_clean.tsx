'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const FAQItem = ({ id, question, answer }: { id: string; question: string; answer: string }) => (
    <div style={{
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'white',
      marginBottom: '16px'
    }}>
      <button
        onClick={() => toggleItem(id)}
        style={{
          width: '100%',
          padding: '20px',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937'
        }}
      >
        {question}
        <span style={{
          transform: openItems[id] ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>▼</span>
      </button>
      {openItems[id] && (
        <div style={{
          padding: '0 20px 20px 20px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          background: '#f9fafb'
        }}>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            margin: '16px 0 0 0'
          }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 25%, #10b981 75%, #059669 100%)',
      padding: '0'
    }}>
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Link 
            href="/" 
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            ProfileCrafted
          </Link>
          <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
            <Link href="/about" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>About</Link>
            <Link href="/contact" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>Support</Link>
          </nav>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '32px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6b7280 0%, #10b981 50%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            textAlign: 'center'
          }}>Frequently Asked Questions</h1>
          
          <div style={{ maxWidth: 'none' }}>
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Getting Started</h2>
              
              <FAQItem
                id="formats"
                question="What file formats can I upload?"
                answer="ProfileCrafted supports PDF and DOCX (Microsoft Word) files up to 10MB in size. We recommend PDF format for the most accurate text extraction and analysis."
              />
              
              <FAQItem
                id="time"
                question="How long does the analysis take?"
                answer="Most resume analyses complete within 30-60 seconds. The process includes file upload, text extraction, AI analysis, and score calculation. Larger files may take slightly longer."
              />
              
              <FAQItem
                id="account"
                question="Do I need to create an account?"
                answer="No account required! ProfileCrafted works instantly - just upload your resume and get immediate analysis. Your results are displayed in your browser session only."
              />
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Analysis & Scoring</h2>
              
              <FAQItem
                id="scores"
                question="What do the scores mean?"
                answer="Scores range from 60-100 and represent your resume's alignment with APM role requirements: 60-70 (Entry-level), 70-80 (Good candidate), 80-90 (Strong candidate), 90-100 (Exceptional candidate)."
              />
              
              <FAQItem
                id="accuracy"
                question="How accurate is the AI analysis?"
                answer="Our AI is specifically trained for APM role evaluation using industry best practices. While highly accurate for identifying key competencies, it should supplement professional career advice rather than replace it."
              />
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Privacy & Security</h2>
              
              <FAQItem
                id="security"
                question="Is my resume data secure?"
                answer="Absolutely! Your resume files are processed securely and stored on Cloudflare R2 with enterprise-grade encryption for up to 30 days to enable re-analysis, then automatically deleted. We use HTTPS encryption and follow strict privacy practices."
              />
              
              <FAQItem
                id="sharing"
                question="Do you share data with third parties?"
                answer="We only share resume text with OpenAI for AI analysis (as disclosed in our privacy policy). We never share, sell, or distribute your personal information or resume content to other parties."
              />
            </div>
          </div>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <Link 
              href="/" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: '#059669',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              ← Back to ProfileCrafted
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
