"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { SITE_CONFIG } from '@/data/mock';
import { Menu, X, Activity, Briefcase, Command, Settings } from 'lucide-react';

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
        <Link href="/" className="font-display font-semibold text-ink text-lg tracking-tight hover:text-accent-deep relative z-50">
          {SITE_CONFIG.name}
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {!isApp && SITE_CONFIG.navLinks.main.map((link) => (
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
            {isApp ? (
              // Dashboard Mobile Links
              <>
                <div className="font-display text-xs font-semibold tracking-widest uppercase text-stone mb-2 border-b border-hairline-soft pb-2">Dashboard Navigation</div>
                {SITE_CONFIG.sidebar.map(section => (
                  <div key={section.group} className="flex flex-col gap-4 mb-2">
                    {section.items.map(item => {
                      const Icon = IconMap[item.icon];
                      const active = pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
                      return (
                        <Link 
                          key={item.label} 
                          href={item.href}
                          className={`flex items-center gap-4 text-lg font-display font-medium ${active ? 'text-accent-deep' : 'text-ink'}`}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </>
            ) : (
              // Public Pages Mobile Links
              <>
                {SITE_CONFIG.navLinks.main.map((link) => (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    className="font-display text-2xl font-medium text-ink hover:text-accent-deep"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link 
                  href="/app" 
                  className="mt-4 inline-flex items-center justify-center rounded-lg font-display text-lg font-medium tracking-wide transition-all bg-accent text-ink h-14 w-full"
                >
                  Launch App
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
