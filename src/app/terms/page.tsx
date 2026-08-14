import React from 'react';
import TopBar from '@/components/layout/TopBar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] text-ink flex flex-col font-sans">
      <TopBar />
      
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-20 md:py-32">
        <div className="bg-white border border-hairline-soft rounded-2xl shadow-sm p-8 md:p-16">
          <div className="mb-12 border-b border-hairline-soft pb-8">
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-ink mb-4">
              Terms of Service
            </h1>
            <p className="text-stone font-mono text-sm uppercase tracking-wider">
              Last Updated: August 14, 2026
            </p>
          </div>
          
          <div className="space-y-10 text-charcoal leading-relaxed text-[15px]">
            
            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-4 flex items-center gap-3">
                <span className="text-accent-deep text-sm">01.</span> Introduction
              </h2>
              <p className="mb-4">
                Welcome to Mythos. These Terms of Service ("Terms") govern your access to and use of the Mythos Platform ("Platform"), including the Mythos Client interface, the Autonomous AI Trading Factory, and all related services provided by Mythos Protocol ("we", "us", or "our").
              </p>
              <p>
                By accessing or using our Platform, you agree to be bound by these Terms and all of the terms incorporated herein by reference.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-4 flex items-center gap-3">
                <span className="text-accent-deep text-sm">02.</span> Risk Disclosure
              </h2>
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 text-red-900/80">
                <p className="mb-4 font-medium">
                  Algorithmic and AI-driven trading involves substantial risk of loss and is not suitable for every investor. The autonomous agents provided by Mythos execute trades in real-time based on probabilistic market conditions, and past performance is strictly not indicative of future results.
                </p>
                <p>
                  By using the Platform, you acknowledge that you may lose some or all of your deposited capital. We are not responsible for any financial losses, impermanent loss, slippage, or liquidation events incurred while using our strategies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-4 flex items-center gap-3">
                <span className="text-accent-deep text-sm">03.</span> Autonomous Agent Execution
              </h2>
              <p className="mb-4">
                You understand that the trading agents (including the Alpha Sentiment Engine, HFT Scalper Node, and Global Risk Monitor) operate autonomously. While we enforce hardcoded risk invariants, market volatility, liquidity crunches, and smart contract vulnerabilities on decentralized venues may result in unexpected execution prices.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-4 flex items-center gap-3">
                <span className="text-accent-deep text-sm">04.</span> User Responsibilities
              </h2>
              <p className="mb-4">
                You agree to use the Platform only for lawful purposes. You are strictly prohibited from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-stone">
                <li>Attempting to manipulate or exploit the AI agents.</li>
                <li>Reverse engineering the proprietary trading algorithms or LLM execution logic.</li>
                <li>Using the Platform to launder money or finance illegal activities.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-ink mb-4 flex items-center gap-3">
                <span className="text-accent-deep text-sm">05.</span> Non-Custodial Architecture
              </h2>
              <p>
                While our infrastructure interfaces with your funds to execute trades, you retain complete ownership of your underlying assets when deposited in the designated smart contract vaults. You are solely responsible for maintaining the security of your Web3 wallets and private keys.
              </p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
