export interface APMScore {
  overall: number;
  technicalFluency: number;
  productThinking: number;
  curiosityCreativity: number;
  communicationClarity: number;
  leadershipTeamwork: number;
}

export interface ScoreWithTips extends APMScore {
  tips: {
    technicalFluency: string;
    productThinking: string;
    curiosityCreativity: string;
    communicationClarity: string;
    leadershipTeamwork: string;
  };
}

export interface AnalysisResponse {
  success: boolean;
  analysis: ScoreWithTips;
  sessionId: string;
}

export interface EssayResponse {
  success: boolean;
  essay: string;
  wordCount: number;
}

export interface AppState {
  currentStep: 'upload' | 'analysis' | 'essay' | 'export';
  isLoading: boolean;
  scores: ScoreWithTips | null;
  essay: string;
  sessionId: string | null;
  error: string | null;
}
