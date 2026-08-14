"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, FileSearch, Server } from 'lucide-react';

export default function SecuritySection() {
  const securityFeatures = [
    {
      title: "Hardcoded Risk Invariants",
      icon: Lock,
      desc: "Our engine enforces strict drawdown limits and maximum position sizing at the core level. If market volatility triggers a threshold, trading is instantly halted."
    },
    {
      title: "Real-Time Auditing",
      icon: FileSearch,
      desc: "Every LLM inference, API call, and order execution is logged immutably. Gain complete transparency into why the agent took a specific position."
    },
    {
      title: "Latency-Optimized Infra",
      icon: Server,
      desc: "Execution nodes are co-located near major exchange servers. We ensure minimal slippage and mitigate MEV front-running on decentralized venues."
    }
  ];

  return (
    <section className="py-32 px-12 max-w-[1200px] mx-auto border-t border-hairline-soft relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
        <div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-8 shadow-2xl"
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-light text-ink tracking-tight mb-6"
          >
            Institutional-Grade Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ash font-light leading-relaxed"
          >
            Security is not an afterthought; it is embedded into the core logic of the Mythos trading engine.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`bg-white border border-hairline-soft rounded-2xl p-8 shadow-sm ${i === 2 ? 'md:col-span-2' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-charcoal" />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-3">{feature.title}</h3>
                <p className="text-ash font-light text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
