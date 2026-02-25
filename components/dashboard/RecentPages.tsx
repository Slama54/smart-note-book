'use client';

import { useRouter } from 'next/navigation';
import { Page } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface RecentPagesProps {
  pages: Page[];
}

export function RecentPages({ pages }: RecentPagesProps) {
  const router = useRouter();
  const recent = pages.slice(0, 5);

  if (recent.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recently Added</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
        {recent.map((page) => (
          <button
            key={page.id}
            onClick={() => router.push(`/page/${page.id}`)}
            className="flex-shrink-0 w-24 cursor-pointer group"
          >
            <Card className="overflow-hidden h-32 group-hover:shadow-lg transition-shadow">
              <div className="relative w-full h-full bg-muted">
                <Image
                  src={page.imageUrl}
                  alt={page.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw"
                />
              </div>
            </Card>
            <p className="text-xs font-medium mt-2 truncate text-center">{`Page ${page.pageNumber}`}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
