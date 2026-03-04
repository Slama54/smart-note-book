'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { NotebookCard } from '@/components/notebooks/NotebookCard';
import { CreateNotebookModal } from '@/components/notebooks/CreateNotebookModal';
import { EmptyState } from '@/components/common/EmptyState';
import { useApp } from '@/lib/AppContext';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotebooksPage() {
  const { notebooks, searchNotebooks } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredNotebooks = useMemo(() => {
    if (!searchQuery) return notebooks;
    return searchNotebooks(searchQuery);
  }, [searchQuery, notebooks, searchNotebooks]);

  return (
    <MainLayout>
      <Header
        title="Notebooks"
        action={{
          icon: <Plus className="w-5 h-5" />,
          onClick: () => setModalOpen(true),
          label: 'Create notebook',
        }}
      />

      <div className="space-y-4 p-4">
        <SearchBar
          placeholder="Search notebooks..."
          onSearch={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {filteredNotebooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredNotebooks.map((notebook) => (
              <NotebookCard key={notebook.id} notebook={notebook} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={searchQuery ? 'No notebooks found' : 'No notebooks yet'}
            description={
              searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first notebook to get started'
            }
            action={{
              label: 'Create Notebook',
              onClick: () => setModalOpen(true),
            }}
          />
        )}
      </div>

      <CreateNotebookModal open={modalOpen} onOpenChange={setModalOpen} />
    </MainLayout>
  );
}
