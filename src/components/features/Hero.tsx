"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="pt-16 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto relative">
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

        {/* Visual Column - The Isometric Stack */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center perspective-[2000px] group mt-12 lg:mt-16">
          <motion.div 
            className="relative w-[280px] h-[280px]"
            style={{ 
              transformStyle: 'preserve-3d', 
              rotateX: 60,
              rotateZ: 45
            }}
          >
            {/* The Layers */}
            {[
              { id: 0, leftText: 'IaaS', rightText: 'RPC & NODE INFRASTRUCTURE', isTop: false },
              { id: 1, leftText: 'DATA LAYER', rightText: 'REAL-TIME AGGREGATION', isTop: false },
              { id: 2, leftText: 'RISK ENGINE', rightText: 'LIVE POSITION MANAGEMENT', isTop: false },
              { id: 3, leftText: 'INTELLIGENCE', rightText: 'AI REASONING MODELS', isTop: false },
              { id: 4, leftText: 'AGENT', rightText: 'AUTONOMOUS EXECUTION', isTop: true },
            ].map((layer, idx) => (
              <motion.div 
                key={layer.id}
                initial={{ z: idx * 45, x: 0, y: 0 }}
                // x: -40, y: 40 translates to straight LEFT visually due to isometric projection
                whileHover={{ x: -30, y: 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Top Face */}
                <div className={`absolute inset-0 border-[1.5px] flex items-center justify-center transition-colors duration-300
                  ${layer.isTop ? 'bg-accent border-[#00a86b]' : 'bg-white border-zinc-300 hover:bg-zinc-50'}
                `}>
                  {layer.isTop && (
                    <div className="transform -rotate-45 font-display text-5xl font-bold tracking-tighter text-ink opacity-90 pointer-events-none">
                      mythos.
                    </div>
                  )}
                </div>

                {/* Left Visible Face (Bottom edge of X-Y plane) */}
                <div 
                  className={`absolute flex items-center px-4 overflow-hidden border-[1.5px] transition-colors duration-300
                    ${layer.isTop ? 'bg-[#00d084] border-[#00a86b]' : 'bg-zinc-100 border-zinc-300'}
                  `}
                  style={{ 
                    width: '280px', height: '40px',
                    transformOrigin: 'top', transform: 'translateY(280px) rotateX(-90deg)' 
                  }}
                >
                  <span className={`font-mono text-[10px] tracking-[0.2em] uppercase font-semibold ${layer.isTop ? 'text-ink/70' : 'text-ash'}`}>
                    {layer.leftText}
                  </span>
                </div>

                {/* Right Visible Face (Right edge of X-Y plane) */}
                <div 
                  className={`absolute flex items-center justify-center overflow-hidden border-[1.5px] transition-colors duration-300
                    ${layer.isTop ? 'bg-[#00e691] border-[#00a86b]' : 'bg-zinc-200/80 border-zinc-300'}
                  `}
                  style={{ 
                    width: '40px', height: '280px',
                    transformOrigin: 'left', transform: 'translateX(280px) rotateY(90deg)' 
                  }}
                >
                  <span 
                    className={`font-display text-[11px] tracking-[0.15em] font-bold whitespace-nowrap ${layer.isTop ? 'text-ink/80' : 'text-stone'}`} 
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    {layer.rightText}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
