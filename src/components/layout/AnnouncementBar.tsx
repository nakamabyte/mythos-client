import React from 'react';
import { Badge } from '@/components/ui/Badge';

export default function AnnouncementBar() {
  return (
    <div className="w-full h-[var(--announce-h)] bg-accent text-ink flex items-center justify-center gap-3 px-11 relative z-50">
      <a href="#" className="inline-flex items-center gap-2.5 font-display text-[13px] font-medium tracking-wide">
        <Badge>NEW</Badge>
        <span className="truncate">
          <b>Mythos Client</b> is now live. Explore the trading agent dashboard.
        </span>
        <span className="text-ink shrink-0">&rarr;</span>
      </a>
    </div>
  );
}
