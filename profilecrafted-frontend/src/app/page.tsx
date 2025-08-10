'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Completely disable SSR to prevent hydration issues
export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading ProfileCrafted...</p>
        </div>
      </div>
    );
  }

  // Dynamic import only on client side
  const ProfileCraftedApp = dynamic(() => import('@/components/ProfileCraftedApp'), {
    ssr: false
  });
  return <ProfileCraftedApp />;
}
