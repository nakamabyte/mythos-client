"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Mythos Agent differ from traditional trading bots?",
      a: "Traditional bots rely on hardcoded indicators (like RSI or Moving Averages) which fail when market regimes shift. Mythos uses Large Language Models to contextualize macro news and real-time sentiment, combined with a rust-based execution engine to adapt dynamically."
    },
    {
      q: "What is the minimum capital required?",
      a: "During the current early-access phase, there is no strict minimum. However, to effectively see the compounding benefits of our strategies and offset gas/execution fees, we recommend a minimum allocation of $1,000."
    },
    {
      q: "Can I withdraw my funds at any time?",
      a: "Yes. Our vaults are designed with deep liquidity in mind. Withdrawals are processed at the end of each daily epoch to ensure active trades are cleanly unwound without incurring unnecessary slippage."
    },
    {
      q: "What are the fees?",
      a: "We charge a standard 2% management fee annually, and a 20% performance fee only on generated profits (High-Water Mark). If we don't make you money, we don't take a performance cut."
    }
  ];

  return (
    <section className="py-32 px-12 max-w-[800px] mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-light text-ink tracking-tight mb-4"
        >
          Frequently Asked Questions
        </motion.h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-hairline-soft rounded-2xl bg-white overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-display text-lg font-medium text-ink pr-8">{faq.q}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-5 h-5 text-ash" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-ash font-light leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
