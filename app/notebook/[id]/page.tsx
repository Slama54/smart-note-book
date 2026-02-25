'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { ChapterItem } from '@/components/notebooks/ChapterItem';
import { EmptyState } from '@/components/common/EmptyState';
import { CreateChapterModal } from '@/components/notebooks/CreateChapterModal';
import { useApp } from '@/lib/AppContext';
import { useLocalStorage } from '@/lib/hooks';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotebookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const notebookId = params.id as string;

  const { getNotebookById, getChaptersByNotebook, getPagesByChapter } = useApp();
  const [expandedChapters, setExpandedChapters] = useLocalStorage<string[]>(
    `expanded-chapters-${notebookId}`,
    []
  );
  const [modalOpen, setModalOpen] = useState(false);

  const notebook = getNotebookById(notebookId);
  const chapters = getChaptersByNotebook(notebookId);

  if (!notebook) {
    return (
      <MainLayout>
        <Header title="Notebook not found" />
        <div className="p-4">
          <EmptyState
            icon={BookOpen}
            title="Notebook not found"
            description="This notebook doesn't exist or has been deleted."
            action={{
              label: 'Go back',
              onClick: () => router.back(),
            }}
          />
        </div>
      </MainLayout>
    );
  }

  const toggleChapter = (id: string) => {
    setExpandedChapters(
      expandedChapters.includes(id)
        ? expandedChapters.filter(c => c !== id)
        : [...expandedChapters, id]
    );
  };

  const [isLoaded] = useLocalStorage('placeholder', '');

  return (
    <MainLayout>
      <Header
        title={notebook.name}
        subtitle={`${notebook.pageCount} pages`}
        action={{
          icon: <Plus className="w-5 h-5" />,
          onClick: () => setModalOpen(true),
          label: 'Add chapter',
        }}
      />

      <div className="space-y-4 p-4">
        {chapters.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                pages={getPagesByChapter(chapter.id)}
                isExpanded={expandedChapters.includes(chapter.id)}
                onToggle={toggleChapter}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No chapters yet"
            description="Add your first chapter to organize your notes"
            action={{
              label: 'Create Chapter',
              onClick: () => setModalOpen(true),
            }}
          />
        )}
      </div>

      <CreateChapterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        notebookId={notebookId}
      />
    </MainLayout>
  );
}
