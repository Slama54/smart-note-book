'use client';

import { useState } from 'react';
import { Heart, Share2, Download, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { pages } = useApp();
  const [favorites, setFavorites] = useState(pages.filter(p => p.isFavorite));

  const handleRemoveFavorite = (pageId: string) => {
    setFavorites(favorites.filter(p => p.id !== pageId));
    toast.success('Removed from favorites');
  };

  const handleShare = (page: typeof pages[0]) => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        text: page.content.substring(0, 100),
      });
    } else {
      toast.error('Share not supported on this device');
    }
  };

  const handleDownload = (page: typeof pages[0]) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(page.content));
    element.setAttribute('download', `${page.title}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded');
  };

  return (
    <MainLayout>
      <Header title="Favorites" subtitle={`${favorites.length} pages`} />
      
      <div className="px-4 py-6 space-y-4">
        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No Favorites Yet"
            description="Mark pages as favorite to access them quickly"
          />
        ) : (
          <div className="space-y-3">
            {favorites.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{page.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Heart className="w-5 h-5 fill-destructive text-destructive flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground line-clamp-2">{page.content}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(page)}
                      className="flex-1"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(page)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFavorite(page.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
