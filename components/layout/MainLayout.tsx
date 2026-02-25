'use client';

import { useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { useOffline } from '@/lib/hooks';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isOffline = useOffline();

  useEffect(() => {
    // Register service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {isOffline && (
        <Alert className="rounded-none border-x-0 border-t-0 bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-100">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}

      <main className="flex-1 overflow-y-auto pb-20 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl w-full">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
