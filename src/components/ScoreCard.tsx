'use client';

import { ScoreWithTips } from '@/types';
import { useState, useEffect } from 'react';

interface ScoreCardProps {
  scores: ScoreWithTips;
  onGenerateEssay: () => void;
  isGenerating: boolean;
}

export default function ScoreCard({ scores, onGenerateEssay, isGenerating }: ScoreCardProps) {
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  
  const categories = [
    { key: 'technicalFluency', label: 'Technical Fluency', color: 'from-primary-blue to-accent-blue' },
    { key: 'productThinking', label: 'Product Thinking', color: 'from-accent-green to-emerald-500' },
    { key: 'curiosityCreativity', label: 'Curiosity & Creativity', color: 'from-primary-purple to-accent-purple' },
    { key: 'communicationClarity', label: 'Communication Clarity', color: 'from-accent-orange to-yellow-500' },
    { key: 'leadershipTeamwork', label: 'Leadership & Teamwork', color: 'from-pink-500 to-rose-500' },
  ];

  // Animate scores from 0 to final value
  useEffect(() => {
    const animateScore = (key: string, finalScore: number) => {
      let currentScore = 0;
      const increment = finalScore / 60; // 60 frames for smooth animation
      
      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= finalScore) {
          currentScore = finalScore;
          clearInterval(timer);
        }
        setAnimatedScores(prev => ({ ...prev, [key]: Math.round(currentScore) }));
      }, 25); // 25ms intervals for smooth 60fps animation
    };

    // Animate overall score
    animateScore('overall', scores.overall);
    
    // Animate category scores with staggered delays
    categories.forEach((category, index) => {
      setTimeout(() => {
        const score = scores[category.key as keyof ScoreWithTips] as number;
        animateScore(category.key, score);
      }, index * 200); // 200ms stagger between categories
    });
  }, [scores]);

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      {/* Overall Score - Inline with Text and Score Ring */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '64px',
        gap: '32px',
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Your APM Fit Score
          </h2>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            color: '#2563eb',
            marginBottom: '8px'
          }}>
            {animatedScores.overall || 0}<span style={{ fontSize: '24px', color: '#6b7280' }}>/100</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '18px', margin: '0' }}>Based on your resume analysis</p>
        </div>
        
        {/* Score Ring on Right */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 100 100" 
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={
                (animatedScores.overall || 0) >= 80 ? '#10b981' : 
                (animatedScores.overall || 0) >= 60 ? '#2563eb' : 
                (animatedScores.overall || 0) >= 40 ? '#f59e0b' : '#ef4444'
              }
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - (animatedScores.overall || 0) / 100)}`}
              style={{ transition: 'all 1s ease-out' }}
            />
          </svg>
        </div>
      </div>

      {/* Category Scores - Fully Responsive Grid Layout */}
      <div 
        className="score-cards-responsive"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px', 
          marginBottom: '64px',
          justifyContent: 'center'
        }}
      >
        {categories.map((category, index) => {
          const score = animatedScores[category.key] || 0;
          const tip = scores.tips[category.key as keyof typeof scores.tips] || 'Keep improving your skills in this area.';
          
          return (
            <div 
              key={category.key}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                minWidth: '200px',
                flex: '1'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              {/* Category Header - Centered */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  {category.label}
                </h3>
                
                {/* Score Display - Single Line */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  marginBottom: '16px' 
                }}>
                  <span style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    color: '#2563eb' 
                  }}>
                    {score}
                  </span>
                  <span style={{ 
                    fontSize: '24px', 
                    color: '#6b7280' 
                  }}>
                    /100
                  </span>
                </div>
                
                {/* Animated Progress Ring */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '16px' 
                }}>
                  <svg 
                    width="64" 
                    height="64" 
                    viewBox="0 0 100 100" 
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                      style={{ transition: 'all 1s ease-out' }}
                    />
                  </svg>
                </div>
              </div>
              
              {/* Tip - No Space Between Score and Remark */}
              <p style={{ 
                fontSize: '16px', 
                lineHeight: '1.6', 
                color: '#6b7280', 
                textAlign: 'center',
                margin: '0'
              }}>
                {tip}
              </p>
            </div>
          );
        })}
      </div>

      {/* Generate Essay Button - Center Aligned */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '48px',
        marginBottom: '32px'
      }}>
        <button
          onClick={onGenerateEssay}
          disabled={isGenerating}
          className="btn-primary btn-large"
          onMouseEnter={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }
          }}
        >
          {isGenerating ? 'Generating Essay...' : 'Generate My Essay'}
        </button>
      </div>
    </div>
  );
}
