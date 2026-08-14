"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Data Ingestion",
      desc: "Real-time streaming from top CEXs and on-chain nodes. Filtering noise to extract pure signal."
    },
    {
      num: "02",
      title: "AI Analysis",
      desc: "Advanced LLMs and statistical models evaluate market conditions, identifying asymmetric risk-reward setups."
    },
    {
      num: "03",
      title: "Risk Management",
      desc: "Monte Carlo simulations run in milliseconds to size positions dynamically based on portfolio volatility."
    },
    {
      num: "04",
      title: "Autonomous Execution",
      desc: "High-frequency engines route orders with minimal slippage, entirely hands-free and auditable."
    }
  ];

  return (
    <section className="py-32 px-12 max-w-[1200px] mx-auto border-t border-hairline-soft relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-light text-ink tracking-tight mb-6"
          >
            How Mythos Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ash font-light mb-10 leading-relaxed"
          >
            We don't just provide signals. Mythos is a complete, end-to-end trading factory that removes human emotion and latency from the equation.
          </motion.p>
          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex gap-6 group cursor-default"
              >
                <div className="font-display text-2xl font-bold text-transparent text-stroke-hairline group-hover:text-accent transition-all duration-300">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-ink mb-1 group-hover:translate-x-1 transition-transform duration-300">{step.title}</h3>
                  <p className="text-ash font-light text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Abstract Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100/50 rounded-3xl border border-hairline-soft p-8 overflow-hidden flex items-center justify-center shadow-inner"
        >
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent"></div>
           
           <div className="relative w-full h-full border border-white/60 bg-white/30 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              {/* Animated abstract nodes */}
              <div className="flex gap-4">
                {[0, 200, 400].map((delay, idx) => (
                  <motion.div 
                    key={idx}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, delay: delay / 1000, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-white border border-hairline shadow-md flex items-center justify-center relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-50"></div>
                     <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--accent)] animate-pulse" style={{ animationDelay: `${delay}ms` }}></div>
                  </motion.div>
                ))}
              </div>

              <div className="w-[2px] h-12 bg-gradient-to-b from-hairline to-accent-deep/50 relative">
                <motion.div 
                  className="absolute top-0 left-[-1px] w-1 h-4 bg-accent rounded-full blur-[2px]"
                  animate={{ y: [0, 48, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-36 h-12 bg-ink text-white rounded-xl flex items-center justify-center font-mono text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.15)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                Engine Core
              </motion.div>

              <div className="w-[2px] h-12 bg-gradient-to-b from-accent-deep/50 to-hairline relative">
                <motion.div 
                  className="absolute top-0 left-[-1px] w-1 h-4 bg-accent-deep rounded-full blur-[2px]"
                  animate={{ y: [0, 48, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <motion.div 
                animate={{ boxShadow: ["0 4px 20px rgba(0,0,0,0.05)", "0 10px 40px rgba(0,0,0,0.1)", "0 4px 20px rgba(0,0,0,0.05)"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-64 h-24 bg-white/80 backdrop-blur-md border border-white rounded-xl flex flex-col justify-center px-6 relative"
              >
                 <div className="flex justify-between items-center mb-3">
                   <span className="text-[10px] text-ash font-mono uppercase">Portfolio Status</span>
                   <span className="text-[11px] text-accent-deep font-mono font-bold">+1.24%</span>
                 </div>
                 <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "66%" }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent-deep rounded-full"
                    ></motion.div>
                 </div>
              </motion.div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
