'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/lib/AppContext';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export default function PageEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const { getPageById, addPage, updatePage, getChaptersByNotebook, getNotebookById } = useApp();
  const [title, setTitle] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [tags, setTags] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [notebookId, setNotebookId] = useState('');
  const [chapters, setChapters] = useState<any[]>([]);

  const isNew = id === 'new';
  const page = !isNew ? getPageById(id) : null;

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setPageNumber(String(page.pageNumber));
      setTags(page.tags.join(', '));
      setChapterId(page.chapterId);
      setNotebookId(page.notebookId);
    } else if (isNew) {
      const pageNum = searchParams.get('pageNum');
      const notebookId = searchParams.get('notebookId') || 'nb-1';
      setPageNumber(pageNum || '');
      setNotebookId(notebookId);
      setChapters(getChaptersByNotebook(notebookId));
      const firstChapter = getChaptersByNotebook(notebookId)[0];
      if (firstChapter) {
        setChapterId(firstChapter.id);
      }
    }
  }, [page, isNew, searchParams, getChaptersByNotebook]);

  useEffect(() => {
    if (notebookId && chapters.length === 0) {
      const notebookChapters = getChaptersByNotebook(notebookId);
      setChapters(notebookChapters);
    }
  }, [notebookId, getChaptersByNotebook, chapters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !chapterId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t);

    if (isNew) {
      const notebookId = chapters[0]?.notebookId || 'nb-1';
      addPage({
        pageNumber: Number(pageNumber) || 0,
        title: title.trim(),
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400',
        chapterId,
        notebookId,
        isFavorite: false,
        tags: tagArray,
        qrCodeValue: `QR-${Date.now()}`,
      });
    } else if (page) {
      updatePage(page.id, {
        title: title.trim(),
        tags: tagArray,
      });
    }

    toast.success(isNew ? 'Page created' : 'Page updated');
    router.back();
  };

  const notebook = getNotebookById(notebookId);

  return (
    <MainLayout>
      <Header
        title={isNew ? 'New Page' : 'Edit Page'}
        rightAction={{
          icon: <X className="w-5 h-5" />,
          onClick: () => router.back(),
          label: 'Close',
        }}
      />

      <div className="p-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Page Preview */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Page Preview</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Page Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Quantum Mechanics Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pageNumber">Page Number</Label>
            <Input
              id="pageNumber"
              type="number"
              placeholder="e.g., 42"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notebook">Notebook</Label>
            <div className="text-sm text-muted-foreground">
              {notebook?.name || 'Select a chapter first'}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapter">Chapter *</Label>
            <Select value={chapterId} onValueChange={setChapterId}>
              <SelectTrigger id="chapter">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., physics, important, notes"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
