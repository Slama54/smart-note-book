'use client';

import { Notebook } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, BookOpen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';

interface NotebookCardProps {
  notebook: Notebook;
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

  return <div style={{ backgroundColor: color }} className="w-full h-full" />;
}

export function NotebookCard({ notebook }: NotebookCardProps) {
  const router = useRouter();
  const { deleteNotebook } = useApp();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <button
          onClick={() => router.push(`/notebook/${notebook.id}`)}
          className="w-full"
        >
          <div className="w-full h-32 bg-muted">
            <NotebookCoverPattern pattern={notebook.coverPattern} color={notebook.coverColor} />
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/notebook/${notebook.id}`)}>
              <BookOpen className="w-4 h-4 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Are you sure you want to delete this notebook?')) {
                  deleteNotebook(notebook.id);
                }
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-3">
        <h3 className="font-semibold truncate">{notebook.name}</h3>
        <p className="text-sm text-muted-foreground">{notebook.pageCount} pages</p>
      </div>
    </Card>
  );
}
