import React from 'react';
import TopBar from "@/components/layout/TopBar";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DocsPage() {
  return (
    <>
      <TopBar />
      <div className="bg-canvas min-h-[calc(100vh-56px)]">
        <div className="max-w-[800px] mx-auto px-8 py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-ash hover:text-ink font-display text-sm font-medium mb-12 transition-colors no-underline">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <article className="prose prose-zinc max-w-none">
            <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight text-ink mb-4">Mythos Whitepaper</h1>
            <p className="text-ash text-lg font-light mb-12">Version 1.0.0 &mdash; The Autonomous AI Trading Factory</p>
            
            <div className="space-y-12">
              <section>
                <h2 className="font-display text-2xl font-semibold text-ink mb-4">1. Introduction</h2>
                <p className="text-stone font-light leading-relaxed mb-4">
                  Mythos represents a paradigm shift in decentralized algorithmic trading. By leveraging a combination of 
                  real-time data pipelines (Rust), highly capable Large Language Models (LLMs), and strict risk-management engines, 
                  Mythos operates as an entirely autonomous hedge fund.
                </p>
                <p className="text-stone font-light leading-relaxed">
                  Unlike static grid bots or simple indicator-based scripts, Mythos is agentic. It forms a market thesis, 
                  validates it against Monte Carlo simulations, and executes with precision latency.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-ink mb-4">2. Core Architecture</h2>
                <div className="bg-zinc-50 border border-hairline-soft rounded-xl p-6 my-6">
                  <ul className="list-disc list-inside space-y-3 text-stone font-light">
                    <li><strong className="font-medium text-ink">Data Ingestion:</strong> Normalizing tick data, order book depth, and funding rates.</li>
                    <li><strong className="font-medium text-ink">LLM Synthesizer:</strong> Interpreting market sentiment, news, and technical patterns.</li>
                    <li><strong className="font-medium text-ink">Execution Engine:</strong> Routing orders via CCXT to minimize slippage.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-ink mb-4">3. Risk & Invariants</h2>
                <p className="text-stone font-light leading-relaxed">
                  Safety is hardcoded. The system operates with immutable invariants that prevent catastrophic drawdowns. 
                  Maximum position sizing is capped at 5% of AUM per trade, and a global stop-loss halts all activity 
                  if portfolio value drops by more than 10% in a 24-hour window.
                </p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
