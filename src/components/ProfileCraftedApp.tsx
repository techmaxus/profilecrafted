'use client';

import { useState } from 'react';
import { AppState } from '@/types';
import { api, APIError } from '@/lib/api';
import FileUpload from '@/components/FileUpload';
import ScoreCard from '@/components/ScoreCard';
import EssayEditor from '@/components/EssayEditor';
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
    { id: 'upload', label: 'Upload Resume', icon: '📤' },
    { id: 'analysis', label: 'APM Fit Score', icon: '📊' },
    { id: 'essay', label: 'AI Essay', icon: '✍️' },
    { id: 'export', label: 'Export & Share', icon: '🚀' },
  ];

  // const currentStepIndex = steps.findIndex(step => step.id === appState.currentStep);

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
      </header>

      {/* Main Content - Foundation: 1280px Centered Container with Fixed Header Padding */}
      <main style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '140px 32px 48px 32px' 
      }}>
        {renderCurrentStep()}
      </main>

      {/* Footer - Foundation: 1280px Centered Container */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center">
          <p className="text-gray-600 font-medium">
            Built for aspiring APMs • Powered by AI
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Vibe coded by{' '}
            <a 
              href="https://www.linkedin.com/in/techmaxus/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
            >
              Lakshay Kapoor
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
