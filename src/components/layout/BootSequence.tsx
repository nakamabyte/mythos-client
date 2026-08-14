'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/data/mock';

export default function BootSequence() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING KERNEL...");

  useEffect(() => {
    // Start sequence on route change or initial load
    setIsLoading(true);
    setProgress(0);
    setStatus("INITIALIZING KERNEL...");
    
    // Disable body scroll when loading
    document.body.style.overflow = 'hidden';
    
    // Slower countdown
    const duration = 2000; // 2 seconds
    const interval = 20; // ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        
        // Update status messages based on progress
        if (next > 20 && prev <= 20) setStatus("SYNCING BLOCKCHAIN DATA...");
        if (next > 45 && prev <= 45) setStatus("CALIBRATING ALGORITHMS...");
        if (next > 75 && prev <= 75) setStatus("SECURING CONNECTIONS...");
        if (next >= 95 && prev < 95) setStatus("SYSTEM READY");

        if (next >= 100) {
          clearInterval(timer);
          // Small delay at 100% before fading out
          setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = '';
          }, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col justify-center px-8 md:px-16 font-display text-ink select-none pointer-events-auto overflow-hidden">
      
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex flex-col">
          <div className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-ink">
            {SITE_CONFIG.name}
          </div>
          <div className="flex items-center gap-3 mt-4 text-xs md:text-sm font-mono text-ash uppercase tracking-widest">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-deep opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-deep"></span>
            </span>
            {status}
          </div>
        </div>
        
        <div className="text-4xl md:text-6xl lg:text-8xl font-bold text-accent-deep tabular-nums tracking-tighter">
          {Math.floor(progress).toString().padStart(3, '0')}%
        </div>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-accent-deep transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
    </div>
  );
}
