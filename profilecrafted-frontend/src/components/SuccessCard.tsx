'use client';

interface SuccessCardProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionText?: string;
  illustration?: 'success' | 'email' | 'download' | 'complete';
}

export default function SuccessCard({ 
  title, 
  message, 
  onAction, 
  actionText = "Continue",
  illustration = 'success' 
}: SuccessCardProps) {
  
  const getIllustration = () => {
    switch (illustration) {
      case 'success':
        return (
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-green to-emerald-500 rounded-full opacity-10"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue to-primary-purple rounded-full opacity-10"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        );
      case 'download':
        return (
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-orange to-yellow-500 rounded-full opacity-10"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        );
      case 'complete':
        return (
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-purple to-pink-500 rounded-full opacity-10"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-ui-card border border-ui-border rounded-2xl p-8 shadow-xl text-center transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {getIllustration()}
        
        <h3 className="text-2xl font-semibold text-ui-text mb-4">{title}</h3>
        <p className="text-ui-text-secondary text-lg mb-6 leading-relaxed">{message}</p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:scale-105"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
