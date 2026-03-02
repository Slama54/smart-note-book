'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { NotebookCarousel } from '@/components/dashboard/NotebookCarousel';
import { RecentPages } from '@/components/dashboard/RecentPages';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/hooks/use-auth';
import { usePullToRefresh } from '@/lib/hooks';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { user, notebooks, pages, searchPages, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPages, setFilteredPages] = useState(pages);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/auth/login');
    }
  }, [authUser, authLoading, router]);

  const isRefreshing = usePullToRefresh(async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  useEffect(() => {
    if (searchQuery) {
      setFilteredPages(searchPages(searchQuery));
    } else {
      setFilteredPages(pages);
    }
  }, [searchQuery, pages, searchPages]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  if (loading || authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user && authUser) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your notebooks...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'Welcome'}`}
        subtitle={dateStr}
        rightAction={{
          icon: <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />,
          onClick: () => window.location.reload(),
          label: 'Refresh',
        }}
      />

      <div className="space-y-6 p-4">
        <SearchBar
          placeholder="Search notes..."
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <QuickActions />

        {notebooks.length > 0 && <NotebookCarousel notebooks={notebooks} />}

        {filteredPages.length > 0 && <RecentPages pages={filteredPages} />}
      </div>
    </MainLayout>
  );
}
