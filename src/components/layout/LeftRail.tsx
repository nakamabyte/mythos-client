"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Briefcase, Command, Settings } from 'lucide-react';
import { SITE_CONFIG } from '@/data/mock';

const IconMap: Record<string, React.ElementType> = {
  Activity,
  Briefcase,
  Command,
  Settings,
};

export default function LeftRail() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-14 bottom-0 w-[248px] bg-[#f5f6f7] border-r border-hairline-soft px-5 py-5 overflow-y-auto z-40">
      <Link href="/" className="font-display font-semibold text-ink text-lg tracking-tight mb-8">
        {SITE_CONFIG.name}
      </Link>

      {SITE_CONFIG.sidebar.map((section, idx) => (
        <div key={section.group} className={`flex flex-col gap-1.5 ${idx > 0 ? 'mt-8' : ''}`}>
          <span className="font-display text-[10.5px] font-semibold tracking-widest uppercase text-stone mb-2">
            {section.group}
          </span>
          
          {section.items.map((item) => {
            const Icon = IconMap[item.icon];
            const isActive = pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
            
            return (
              <Link 
                key={item.label}
                href={item.href} 
                className={`group flex flex-col gap-2 bg-canvas border rounded-xl p-3 no-underline cursor-pointer transition-transform hover:-translate-y-px ${
                  isActive ? 'border-ink shadow-[0_3px_14px_rgba(0,0,0,0.07)]' : 'border-transparent hover:border-hairline'
                }`}
              >
                {Icon && <Icon className={`w-6 h-6 ${isActive ? 'text-accent-deep' : 'text-ink group-hover:text-accent-deep'}`} />}
                <span className="font-display text-[11.5px] font-semibold tracking-widest uppercase text-ink leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
      
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <div className="text-[10.5px] leading-relaxed text-mute">
          Mythos Engine {SITE_CONFIG.version}<br/>
          Status: <span className="text-accent-deep font-medium">{SITE_CONFIG.status}</span>
        </div>
      </div>
    </aside>
  );
}
