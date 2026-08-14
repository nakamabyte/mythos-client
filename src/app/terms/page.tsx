import React from 'react';
import TopBar from '@/components/layout/TopBar';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-canvas text-charcoal flex flex-col items-center">
      <TopBar />
      <div className="w-full max-w-[800px] px-6 py-20 md:py-32">
        <h1 className="font-display text-4xl md:text-5xl font-light text-ink tracking-tight mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-zinc prose-headings:font-display prose-headings:font-semibold prose-a:text-accent-deep max-w-none">
          <p><em>Last Updated: August 14, 2026</em></p>
          
          <hr className="my-8 border-hairline-soft" />

          <h2>1. Introduction</h2>
          <p>
            Welcome to Mythos. These Terms of Service ("Terms") govern your access to and use of the Mythos Platform ("Platform"), including the Mythos Client interface, the Autonomous AI Trading Factory, and all related services provided by Mythos Protocol ("we", "us", or "our").
          </p>

          <h2>2. Risk Disclosure</h2>
          <p>
            Algorithmic and AI-driven trading involves substantial risk of loss and is not suitable for every investor. The autonomous agents provided by Mythos execute trades in real-time based on probabilistic market conditions, and past performance is strictly not indicative of future results.
          </p>
          <p>
            By using the Platform, you acknowledge that you may lose some or all of your deposited capital. We are not responsible for any financial losses, impermanent loss, or liquidation events incurred while using our strategies.
          </p>

          <h2>3. Autonomous Agent Execution</h2>
          <p>
            You understand that the trading agents (including the Alpha Sentiment Engine, HFT Scalper Node, and Global Risk Monitor) operate autonomously. While we enforce hardcoded risk invariants, market volatility, liquidity crunches, and smart contract vulnerabilities on decentralized venues may result in unexpected execution prices.
          </p>

          <h2>4. User Responsibilities</h2>
          <p>
            You agree to use the Platform only for lawful purposes. You are strictly prohibited from:
          </p>
          <ul>
            <li>Attempting to manipulate or exploit the AI agents.</li>
            <li>Reverse engineering the proprietary trading algorithms or LLM execution logic.</li>
            <li>Using the Platform to launder money or finance illegal activities.</li>
          </ul>

          <h2>5. Non-Custodial Architecture</h2>
          <p>
            While our infrastructure interfaces with your funds to execute trades, you retain complete ownership of your underlying assets when deposited in the designated smart contract vaults. You are solely responsible for maintaining the security of your Web3 wallets and private keys.
          </p>

          <h2>6. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the Platform at any time, including the decommissioning of specific trading strategies or agents, without prior notice or liability.
          </p>
        </div>
      </div>
    </main>
  );
}
