'use client';

import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { useApp } from '@/lib/AppContext';
import { BookOpen, Download, Share2, Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function PagePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const { getPageById, getChapterById, toggleFavorite, deletePage } = useApp();
  const page = getPageById(pageId);
  const chapter = page ? getChapterById(page.chapterId) : null;

  if (!page) {
    return (
      <MainLayout>
        <Header title="Page Not Found" />
        <div className="p-4">
          <EmptyState
            icon={BookOpen}
            title="Page not found"
            description="This page doesn't exist or has been deleted."
            action={{
              label: 'Go back',
              onClick: () => router.back(),
            }}
          />
        </div>
      </MainLayout>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this page?')) {
      deletePage(page.id);
      toast.success('Page deleted');
      router.back();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        text: `Check out this page from my notebook: ${page.title}`,
      });
    } else {
      toast.error('Share not supported on this device');
    }
  };

  return (
    <MainLayout>
      <Header
        title={`Page ${page.pageNumber}`}
        subtitle={chapter?.name}
        rightAction={{
          icon: <Edit className="w-5 h-5" />,
          onClick: () => router.push(`/page/edit/${page.id}`),
          label: 'Edit',
        }}
      />

      <div className="p-4 pb-24 space-y-4">
        {/* Full Page Image */}
        <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
          <Image
            src={page.imageUrl}
            alt={page.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw"
          />
        </div>

        {/* Page Info */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold">{page.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {chapter?.name} • Page {page.pageNumber}
            </p>
          </div>

          {/* Tags */}
          {page.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {page.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* QR Code */}
          {page.qrCodeValue && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                QR Code: <code className="text-xs bg-muted p-1 rounded">{page.qrCodeValue}</code>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => toggleFavorite(page.id)}
            className={page.isFavorite ? 'text-yellow-500' : ''}
          >
            <Star
              className={`w-4 h-4 mr-2 ${page.isFavorite ? 'fill-current' : ''}`}
            />
            {page.isFavorite ? 'Favorited' : 'Favorite'}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button variant="outline" onClick={() => toast.info('Download coming soon')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
