"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/data/mock';
import { Menu, X, Activity, Briefcase, Command, Settings } from 'lucide-react';
import NavNotifications from './NavNotifications';

const IconMap: Record<string, React.ElementType> = {
  Activity, Briefcase, Command, Settings
};

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isApp = pathname?.startsWith('/app');

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center justify-between sticky top-0 z-50 h-14 bg-canvas border-b border-hairline-soft px-6 md:px-12">
      <div className="flex items-center gap-7">
        <Link href="/" className="font-display font-semibold text-ink text-lg tracking-tight hover:text-accent-deep relative z-50 flex items-center gap-2">
          <img src="/logo.png" alt="Mythos Logo" className="h-7 w-auto object-contain" />
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
        {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS && (
          <div 
            className="hidden lg:inline-flex items-center gap-2 bg-canvas border border-hairline rounded-md px-2.5 h-8 font-display text-charcoal cursor-pointer hover:border-ink hover:text-ink transition-colors"
            onClick={() => {
              const ca = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
              if (ca) navigator.clipboard.writeText(ca);
            }}
            title="Click to copy CA"
          >
            <Badge>CA</Badge>
            <span className="font-mono text-xs whitespace-nowrap">
              {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
            </span>
          </div>
        )}
        
        <NavNotifications />

        {!isApp && (
          <Link href="/app" className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-[15px] font-medium tracking-wide transition-all cursor-pointer bg-accent text-ink hover:bg-accent-deep hover:shadow-[0_0_15px_var(--accent)] hover:scale-105 border-none h-10 px-5 no-underline relative z-50">
            Launch App
          </Link>
        )}
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden relative z-50 p-2 -mr-2 text-ink hover:text-accent-deep transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-canvas/95 backdrop-blur-md z-40 flex flex-col pt-20 px-6 md:hidden">
          <div className="flex flex-col gap-6">
            {SITE_CONFIG.navLinks.main.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="font-display text-2xl font-medium text-ink hover:text-accent-deep"
              >
                {link.label}
              </Link>
            ))}
            {!isApp && (
              <Link 
                href="/app" 
                className="mt-4 inline-flex items-center justify-center rounded-lg font-display text-lg font-medium tracking-wide transition-all bg-accent text-ink h-14 w-full"
              >
                Launch App
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
