'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { NotebookCarousel } from '@/components/dashboard/NotebookCarousel';
import { RecentPages } from '@/components/dashboard/RecentPages';
import { useApp } from '@/lib/AppContext';
import { usePullToRefresh } from '@/lib/hooks';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const { user, notebooks, pages, searchPages } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPages, setFilteredPages] = useState(pages);

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

  return (
    <MainLayout>
      <Header
        title={`${getGreeting()}, ${user.name.split(' ')[0]}`}
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
