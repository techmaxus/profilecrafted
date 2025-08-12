'use client';

import { useState } from 'react';
import { AppState } from '@/types';
import { api, APIError } from '@/lib/api';
import FileUpload from './FileUpload';
import ScoreCard from './ScoreCard';
import Footer from './Footer';
import EssayEditor from './EssayEditor';
import ExportPage from '@/components/ExportPage';

export default function ProfileCraftedApp() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 'upload',
    isLoading: false,
    scores: null,
    essay: '',
    sessionId: null,
    error: null,
  });

  const handleFileSelect = async (file: File) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Upload file to R2
      const uploadResponse = await api.uploadResume(file);
      console.log('✅ File uploaded successfully:', uploadResponse);
      
      // Step 2: Extract text from uploaded file and analyze
      try {
        let resumeText: string;
        
        if (file.type === 'application/pdf') {
          // Use backend PDF parsing service for production reliability
          const pdfParsingService = await import('../services/pdfParsingService');
          const parseResult = await pdfParsingService.default.parsePDF(file);
          
          if (!parseResult.success) {
            throw new Error(parseResult.error || 'Failed to parse PDF');
          }
          
          resumeText = parseResult.text || '';
          console.log('📄 PDF text extracted via backend:', {
            length: resumeText.length,
            pages: parseResult.metadata?.pages,
            fileName: parseResult.metadata?.fileName
          });
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Use backend DOCX parsing service for production reliability
          const docxParsingService = await import('../services/docxParsingService');
          const parseResult = await docxParsingService.default.parseDocx(file);
          
          if (!parseResult.success) {
            throw new Error(parseResult.error || 'Failed to parse DOCX');
          }
          
          resumeText = parseResult.text || '';
          console.log('📄 DOCX text extracted via backend:', {
            length: resumeText.length,
            method: parseResult.metadata?.parsingMethod,
            fileName: parseResult.metadata?.fileName
          });
        } else {
          // Fallback for other text-based files
          const fileReader = new FileReader();
          resumeText = await new Promise((resolve, reject) => {
            fileReader.onload = (e) => resolve(e.target?.result as string);
            fileReader.onerror = reject;
            fileReader.readAsText(file);
          });
        }
        
        // Validate extracted text
        if (!resumeText || resumeText.trim().length < 50) {
          throw new Error('Could not extract sufficient text from the file. Please ensure the file contains readable text.');
        }
        
        console.log('📄 Analyzing resume text, length:', resumeText?.length);
        
        // Step 3: Call analysis API
        const analysisResponse = await api.analyzeResume(resumeText, uploadResponse.key);
        console.log('🎯 Analysis completed:', analysisResponse);
        
        setAppState(prev => ({
          ...prev,
          isLoading: false,
          scores: analysisResponse.analysis,
          sessionId: uploadResponse.key, // Use file key as session ID
          currentStep: 'analysis',
        }));
      } catch (analysisError) {
        console.error('❌ Analysis failed:', analysisError);
        setAppState(prev => ({
          ...prev,
          isLoading: false,
          error: analysisError instanceof APIError ? analysisError.message : 'Analysis failed',
        }));
      }
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof APIError ? error.message : 'Upload failed',
      }));
    }
  };

  const handleGenerateEssay = async () => {
    if (!appState.scores || !appState.sessionId) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.generateEssay(appState.scores as unknown as Record<string, unknown>, appState.sessionId);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        essay: response.essay,
        currentStep: 'essay',
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof APIError ? error.message : 'Essay generation failed',
      }));
    }
  };

  const handleRegenerateEssay = async () => {
    if (!appState.scores || !appState.sessionId) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.regenerateEssay(appState.scores as unknown as Record<string, unknown>, appState.sessionId, 'User requested regeneration');
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        essay: response.essay,
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof APIError ? error.message : 'Essay regeneration failed',
      }));
    }
  };

  const handleSendEmail = async (email: string) => {
    if (!appState.essay) return;

    setAppState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await api.sendEmail(email, appState.essay);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        currentStep: 'export',
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof APIError ? error.message : 'Email sending failed',
      }));
    }
  };

  const renderCurrentStep = () => {
    switch (appState.currentStep) {
      case 'upload':
        return (
          <FileUpload
            onFileSelect={handleFileSelect}
            isLoading={appState.isLoading}
            error={appState.error}
          />
        );
      case 'analysis':
        return appState.scores ? (
          <ScoreCard
            scores={appState.scores}
            onGenerateEssay={handleGenerateEssay}
            isGenerating={appState.isLoading}
          />
        ) : null;
      case 'essay':
        return (
          <EssayEditor
            essay={appState.essay}
            onEssayChange={(essay) => setAppState(prev => ({ ...prev, essay }))}
            onRegenerate={handleRegenerateEssay}
            onSendEmail={handleSendEmail}
            isLoading={appState.isLoading}
            error={appState.error}
          />
        );
      case 'export':
        return (
          <ExportPage
            essay={appState.essay}
            onStartOver={() => setAppState({
              currentStep: 'upload',
              isLoading: false,
              scores: null,
              essay: '',
              sessionId: null,
              error: null,
            })}
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    { id: 'upload', label: 'Analyzing Resume', icon: '📄', description: 'Processing your resume file' },
    { id: 'analysis', label: 'Extracting Keywords', icon: '🔍', description: 'Identifying key skills and experiences' },
    { id: 'analysis', label: 'Benchmarking with APM', icon: '📊', description: 'Comparing against APM job descriptions' },
    { id: 'analysis', label: 'Generating APM Fit Score', icon: '🎯', description: 'Calculating your APM compatibility score' },
    { id: 'essay', label: 'Analyzing Improvement Scope', icon: '🔧', description: 'Identifying areas for enhancement' },
    { id: 'export', label: 'Publishing APM Fit Results', icon: '🚀', description: 'Finalizing your comprehensive analysis' },
  ];

  const getCurrentStepIndex = () => {
    switch (appState.currentStep) {
      case 'upload': return appState.isLoading ? 0 : -1;
      case 'analysis': return appState.isLoading ? Math.min(3, Math.floor(Date.now() / 1000) % 4) : 3;
      case 'essay': return 4;
      case 'export': return 5;
      default: return -1;
    }
  };

  const renderProgressBar = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex === -1) return null;

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        margin: '0 0 32px 0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '1',
                minWidth: '120px',
                opacity: index <= currentIndex ? 1 : 0.4,
                transition: 'opacity 0.3s ease'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: index <= currentIndex 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: index <= currentIndex ? 'white' : '#9ca3af',
                marginBottom: '8px',
                boxShadow: index === currentIndex ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none',
                transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                {step.icon}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: index <= currentIndex ? '#1f2937' : '#9ca3af',
                textAlign: 'center',
                marginBottom: '4px'
              }}>
                {step.label}
              </div>
              <div style={{
                fontSize: '10px',
                color: index <= currentIndex ? '#6b7280' : '#d1d5db',
                textAlign: 'center',
                lineHeight: '1.3'
              }}>
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header - Static Blue-Purple Gradient Banner */}
      <header style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '50',
        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '24px 32px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                ProfileCrafted<span style={{ opacity: '0.9' }}>.com</span>
              </h1>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '18px',
                fontWeight: '500',
                margin: '0'
              }}>
                Your intelligent partner for APM application success
              </p>
            </div>
            
            {/* Navigation Links - Responsive */}
            <nav style={{ 
              display: 'flex', 
              gap: '20px', 
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a 
                href="/about" 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  textDecoration: 'none', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.color = 'white';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.9)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                About
              </a>
              <a 
                href="/faq" 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  textDecoration: 'none', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.color = 'white';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.9)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                FAQ
              </a>
              <a 
                href="/contact" 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  textDecoration: 'none', 
                  fontSize: '15px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLElement).style.color = 'white';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.9)';
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Support
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Foundation: 1280px Centered Container with Fixed Header Padding */}
      <main style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '140px 32px 48px 32px' 
      }}>
        {renderProgressBar()}
        {renderCurrentStep()}
      </main>

      {/* Footer with comprehensive navigation links */}
      <Footer />
    </div>
  );
}
