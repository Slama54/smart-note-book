'use client';

import { useState } from 'react';
import { Chapter, Page } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface ChapterItemProps {
  chapter: Chapter;
  pages: Page[];
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export function ChapterItem({ chapter, pages, isExpanded, onToggle }: ChapterItemProps) {
  const router = useRouter();
  const { deleteChapter } = useApp();
  const displayPages = pages.slice(0, 3);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => onToggle(chapter.id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
      >
        <div className="flex-1 text-left">
          <h3 className="font-semibold">{chapter.name}</h3>
          <p className="text-sm text-muted-foreground">{pages.length} pages</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this chapter? Pages will be removed.')) {
                deleteChapter(chapter.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {displayPages.map((page) => (
              <button
                key={page.id}
                onClick={() => router.push(`/page/${page.id}`)}
                className="flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group relative"
              >
                <Image
                  src={page.imageUrl}
                  alt={page.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="80px"
                />
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>

          {pages.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/notebook/${chapter.notebookId}?chapter=${chapter.id}`)}
            >
              View all {pages.length} pages
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
