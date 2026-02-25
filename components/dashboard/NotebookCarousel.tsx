'use client';

import { useRouter } from 'next/navigation';
import { Notebook } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface NotebookCarouselProps {
  notebooks: Notebook[];
  showViewAll?: boolean;
}

function NotebookCoverPattern({ pattern, color }: { pattern?: string; color: string }) {
  if (pattern === 'grid') {
    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <rect fill={color} width="100" height="100" />
        <line x1="25" y1="0" x2="25" y2="100" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <line x1="75" y1="0" x2="75" y2="100" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="white" strokeWidth="0.5" opacity="0.3" />
      </svg>
    );
  }
  if (pattern === 'lines') {
    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <rect fill={color} width="100" height="100" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={10 + i * 10}
            x2="100"
            y2={10 + i * 10}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}
      </svg>
    );
  }
  if (pattern === 'dots') {
    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <rect fill={color} width="100" height="100" />
        {Array.from({ length: 25 }).map((_, i) => (
          <circle
            key={i}
            cx={(i % 5) * 25 + 12.5}
            cy={Math.floor(i / 5) * 25 + 12.5}
            r="2"
            fill="white"
            opacity="0.3"
          />
        ))}
      </svg>
    );
  }

  return <div style={{ backgroundColor: color }} className="w-full h-full" />;
}

export function NotebookCarousel({ notebooks, showViewAll = true }: NotebookCarouselProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Notebooks</h2>
        {showViewAll && (
          <button
            onClick={() => router.push('/notebooks')}
            className="flex items-center text-sm text-primary hover:underline"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
        {notebooks.map((notebook) => (
          <button
            key={notebook.id}
            onClick={() => router.push(`/notebook/${notebook.id}`)}
            className="flex-shrink-0 w-32 cursor-pointer group"
          >
            <Card className="overflow-hidden h-44 group-hover:shadow-lg transition-shadow">
              <div className="w-full h-40">
                <NotebookCoverPattern pattern={notebook.coverPattern} color={notebook.coverColor} />
              </div>
              <div className="p-2 text-center">
                <p className="text-xs font-medium truncate">{notebook.name}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
