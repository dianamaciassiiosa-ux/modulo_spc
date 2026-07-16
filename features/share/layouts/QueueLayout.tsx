import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';


interface QueueLayoutProps {
  header?: ReactNode;
  alarmBanner?: ReactNode;
  offlineBanner?: ReactNode;
  toolbar?: ReactNode;
  kpis?: ReactNode;
  master: ReactNode;
  detailPanel?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function QueueLayout({
  header,
  alarmBanner,
  offlineBanner,
  toolbar,
  kpis,
  master,
  detailPanel,
  actions,
  className,
}: QueueLayoutProps) {
  const showDetail = Boolean(detailPanel);

  return (
    <div className={cn('flex flex-col min-h-full supervision-stagger', className)}>
      {header && <div className="px-4 md:px-6 pt-4 pb-3">{header}</div>}

      {offlineBanner}
      {alarmBanner}

      {toolbar && (
        <div className="px-4 md:px-6 py-2 border-y border-border/40 bg-muted/20">
          {toolbar}
        </div>
      )}

      {kpis && <div className="px-4 md:px-6 py-3">{kpis}</div>}

      <div
        className={cn(
          'flex-1 px-4 md:px-6 pb-4',
          showDetail
            ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]'
            : '',
        )}
      >
        <div className="min-w-0">{master}</div>
        {showDetail && <aside className="min-w-0">{detailPanel}</aside>}
      </div>

      {actions && (
        <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur px-4 md:px-6 py-3 flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
