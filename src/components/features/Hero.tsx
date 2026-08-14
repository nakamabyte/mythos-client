"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="pt-16 pb-20 px-12 max-w-[1200px] mx-auto relative">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
        
        {/* Text Column */}
        <div className="max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(34px,4vw,56px)] font-light leading-[1.05] tracking-tight mb-7 text-ink"
          >
            Autonomous <em className="not-italic bg-accent text-ink px-1.5 rounded box-decoration-clone font-medium relative inline-block">
              Trading Agents
              <motion.span 
                className="absolute inset-0 bg-white mix-blend-overlay rounded"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.5, 0], scaleX: [0, 1, 1] }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              />
            </em> built for the new economy.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18px] font-light leading-[1.55] text-ash mb-9 max-w-lg"
          >
            Mythos runs an AI trading factory: a full stack from raw data processing to executed orders. Fully automated, transparent, and built to capture alpha.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-3 flex-wrap"
          >
            <Link href="/app" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-base font-medium tracking-wide transition-all cursor-pointer bg-accent text-ink hover:bg-accent-deep hover:shadow-[0_0_20px_var(--accent)] hover:scale-105 h-12 px-6 no-underline">
              Launch Dashboard
            </Link>
            <Link href="/docs" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-base font-medium tracking-wide transition-colors cursor-pointer bg-canvas text-ink border border-hairline hover:border-ink hover:bg-zinc-50 h-12 px-6 no-underline">
              Read the Docs
            </Link>
          </motion.div>
        </div>

        {/* Visual Column - The Isometric "Cake" Graphic mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/3] bg-zinc-50/50 rounded-2xl border border-hairline-soft overflow-hidden flex items-center justify-center shadow-[inset_0_0_40px_rgba(0,0,0,0.02)]"
        >
          <div className="absolute top-6 left-6 text-stone font-display text-sm uppercase tracking-widest z-10">
            Agentic Engine
          </div>
          
          {/* Abstract background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>

          {/* Simplified interactive card instead of a full SVG for the mock */}
          <div className="absolute inset-0 flex items-center justify-center perspective-[1300px]">
             <motion.div 
                animate={{ rotateY: [-5, 5, -5], rotateX: [10, 15, 10], y: [-10, 10, -10] }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: [-15, 15, -15], 
                  rotateX: [5, 25, 5],
                  transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" } 
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-64 h-80 bg-gradient-to-br from-white/80 to-white/30 border border-white shadow-2xl backdrop-blur-md rounded-xl p-6 flex flex-col justify-between cursor-pointer"
              >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent rounded-xl pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-accent mb-4 shadow-[0_0_15px_var(--accent)] animate-pulse"></div>
                  <div className="h-2 w-24 bg-ink/20 rounded mb-2"></div>
                  <div className="h-2 w-32 bg-ink/10 rounded"></div>
                </div>
                <div className="relative z-10 bg-white/50 p-4 rounded-lg border border-white/50 backdrop-blur-sm">
                  <div className="text-[10px] font-mono text-ink/50 uppercase mb-1">Status</div>
                  <div className="font-display text-sm font-bold text-accent-deep flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]"></span>
                    EXECUTING TRADES
                  </div>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
