'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
  };
}

export function Header({ title, subtitle, action, rightAction }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-4 max-w-md mx-auto sm:max-w-2xl lg:max-w-4xl">
        <div className="flex-1">
          <h1 className="font-semibold text-lg leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {action && (
            <Button
              variant="ghost"
              size="icon"
              onClick={action.onClick}
              aria-label={action.label}
            >
              {action.icon}
            </Button>
          )}

          {rightAction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={rightAction.onClick}
              aria-label={rightAction.label}
            >
              {rightAction.icon}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
