import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/data/mock';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between sticky top-0 z-40 h-14 bg-canvas border-b border-hairline-soft px-12">
      <div className="flex items-center gap-7">
        <Link href="/" className="font-display font-semibold text-ink text-lg tracking-tight hover:text-accent-deep">
          {SITE_CONFIG.name}
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {SITE_CONFIG.navLinks.main.map((link) => (
            <Link key={link.label} href={link.href} className="font-display text-sm font-medium text-charcoal hover:text-accent-deep">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden lg:inline-flex items-center gap-2 bg-canvas border border-hairline rounded-md px-2.5 h-8 font-display text-charcoal cursor-pointer hover:border-ink hover:text-ink transition-colors">
          <Badge>AGENT</Badge>
          <span className="font-mono text-xs whitespace-nowrap">0x8f...39a2</span>
        </div>
        <Link href="/app" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-[15px] font-medium tracking-wide transition-all cursor-pointer bg-accent text-ink hover:bg-accent-deep hover:shadow-[0_0_15px_var(--accent)] hover:scale-105 border-none h-10 px-5 no-underline">
          Launch App
        </Link>
      </div>
    </div>
  );
}
