"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

export default function StatsSection() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-24 px-12 max-w-[1200px] mx-auto border-t border-hairline-soft bg-zinc-50/30 relative overflow-hidden">
      {/* Glossy background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-light text-ink tracking-tight mb-4"
        >
          Proven Performance at Scale
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-ash font-light max-w-2xl mx-auto"
        >
          Our autonomous agents operate 24/7, parsing on-chain metrics, sentiment, and order book data to deliver consistent alpha in volatile markets.
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
      >
        {[
          { label: "Total Volume Traded", value: "$1.2B+" },
          { label: "Average 30D ROI", value: "14.2%" },
          { label: "Active Strategies", value: "12" },
          { label: "System Uptime", value: "99.99%" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={item}
            whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)" }}
            className="flex flex-col items-center justify-center p-8 bg-white/60 backdrop-blur-xl border border-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] rounded-2xl text-center relative overflow-hidden group"
          >
            {/* Hover glare effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="font-display text-4xl font-medium text-ink tracking-tight mb-2 relative z-10">
              {stat.value}
            </div>
            <div className="text-[13px] font-medium text-ash uppercase tracking-widest relative z-10">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
