import { cn } from '@/lib/utils';

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-muted animate-pulse p-4">
      <div className="h-40 bg-muted-foreground/20 rounded mb-3" />
      <div className="h-4 bg-muted-foreground/20 rounded mb-2 w-3/4" />
      <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn('h-4 bg-muted-foreground/20 rounded animate-pulse', className)} />;
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
