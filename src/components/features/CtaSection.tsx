"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="py-32 px-12 border-t border-hairline-soft bg-ink text-white relative overflow-hidden">
      {/* Animated abstract background decoration */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.05, 0.1, 0.05],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1], 
          opacity: [0.03, 0.08, 0.03],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none"
      />
      
      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl font-light tracking-tight mb-6"
        >
          Ready to deploy capital into the future of algorithmic trading?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-stone font-light text-lg mb-10 max-w-2xl mx-auto"
        >
          Join early access to allocate funds directly into Mythos' top-performing autonomous strategies. Transparency and absolute returns, driven by AI.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link href="/app" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-lg font-medium tracking-wide transition-all cursor-pointer bg-accent text-ink hover:bg-accent-deep hover:shadow-[0_0_25px_var(--accent)] hover:-translate-y-1 h-14 px-8 no-underline">
            Connect Wallet
          </Link>
          <Link href="#" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-lg font-medium tracking-wide transition-all cursor-pointer bg-transparent text-white border border-stone/50 hover:bg-white/10 hover:-translate-y-1 h-14 px-8 no-underline">
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
