/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New UI/UX Design System - "Intelligent Partner" Philosophy
        'ui-bg': '#F9FAFB',              // Soft off-white background
        'ui-card': '#FFFFFF',            // Pure white cards with shadows
        'ui-border': '#E5E7EB',          // Light grey borders/dividers
        'ui-text': '#111827',            // Dark charcoal primary text
        'ui-text-secondary': '#6B7280',  // Medium grey secondary text
        'ui-hover': '#F3F4F6',           // Subtle hover states
        
        // Primary accent gradient (blue to purple)
        'primary-blue': '#4F46E5',       // Primary brand blue
        'primary-purple': '#7C3AED',     // Primary brand purple
        'accent-blue': '#3B82F6',        // Interactive blue
        'accent-purple': '#8B5CF6',      // Interactive purple
        'accent-green': '#10B981',       // Success states
        'accent-orange': '#F59E0B',      // Warning states
        
        // Legacy light theme support (for gradual migration)
        'light-bg': '#F7FAFC',
        'light-card': '#FFFFFF',
        'light-border': '#E2E8F0',
        'light-text': '#1A202C',
        'light-text-secondary': '#718096',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'light-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'light-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'light-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'light-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'score-count': 'scoreCount 1.5s ease-out',
        'skeleton-pulse': 'skeletonPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scoreCount: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        skeletonPulse: {
          '0%': { backgroundColor: '#E5E7EB' },
          '50%': { backgroundColor: '#D1D5DB' },
          '100%': { backgroundColor: '#E5E7EB' },
        },
        scoreCount: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        skeletonPulse: {
          '0%': { backgroundColor: '#E5E7EB' },
          '50%': { backgroundColor: '#D1D5DB' },
          '100%': { backgroundColor: '#E5E7EB' },
        },
      },
      spacing: {
        '18': '4.5rem',   // 72px for 8pt grid system
        '22': '5.5rem',   // 88px for 8pt grid system
      },
    },
  },
  plugins: [],
}
