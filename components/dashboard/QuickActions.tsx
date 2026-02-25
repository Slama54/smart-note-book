'use client';

import { useRouter } from 'next/navigation';
import { Camera, Plus, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: Camera,
      label: 'Scan Page',
      description: 'Capture a new page',
      onClick: () => router.push('/scan'),
    },
    {
      icon: Plus,
      label: 'New Chapter',
      description: 'Create a chapter',
      onClick: () => {
        // This would typically open a modal
      },
    },
    {
      icon: Share2,
      label: 'Share',
      description: 'Share notes',
      onClick: () => {
        if (navigator.share) {
          navigator.share({
            title: 'Smart Notebook',
            text: 'Check out my notes!',
          });
        }
      },
    },
    {
      icon: BookOpen,
      label: 'Browse All',
      description: 'View all notebooks',
      onClick: () => router.push('/notebooks'),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 text-center p-4 rounded-xl border bg-card text-card-foreground hover:bg-accent transition-colors shadow-sm"
          >
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
