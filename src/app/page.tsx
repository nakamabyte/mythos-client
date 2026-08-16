import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopBar from "@/components/layout/TopBar";
import Hero from "@/components/features/Hero";
import MarketTicker from "@/components/features/MarketTicker";

import HowItWorks from "@/components/features/HowItWorks";
import SecuritySection from "@/components/features/SecuritySection";
import FaqSection from "@/components/features/FaqSection";
import CtaSection from "@/components/features/CtaSection";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <TopBar />
      <main className="flex-1 w-full bg-canvas">
        <Hero />
        <MarketTicker />
        
        {/* Features / Principles Section */}
        <section className="py-24 px-12 max-w-[1200px] mx-auto border-t border-hairline-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-t border-hairline pt-6">
              <div className="font-display text-sm font-semibold text-accent-deep tracking-widest uppercase mb-3">01</div>
              <h3 className="font-display text-xl font-semibold mb-3 text-ink">Data Engine</h3>
              <p className="text-sm font-light leading-relaxed text-ash">
                Injesting millions of data points from CEX and on-chain sources in real-time. Processed via Rust and Python pipelines.
              </p>
            </div>
            <div className="border-t border-hairline pt-6">
              <div className="font-display text-sm font-semibold text-accent-deep tracking-widest uppercase mb-3">02</div>
              <h3 className="font-display text-xl font-semibold mb-3 text-ink">AI Models</h3>
              <p className="text-sm font-light leading-relaxed text-ash">
                Using cutting-edge LLMs (Claude, Grok) for real-time risk assessment, rapid sentiment analysis, and robust portfolio building.
              </p>
            </div>
            <div className="border-t border-hairline pt-6">
              <div className="font-display text-sm font-semibold text-accent-deep tracking-widest uppercase mb-3">03</div>
              <h3 className="font-display text-xl font-semibold mb-3 text-ink">Execution</h3>
              <p className="text-sm font-light leading-relaxed text-ash">
                Slippage-aware trade execution via CCXT across Binance, OKX, and Bybit. Hardcoded safety invariants ensure capital protection.
              </p>
            </div>
          </div>
        </section>



        <HowItWorks />
        <SecuritySection />
        <FaqSection />
        <CtaSection />
        
      </main>
      
      <footer className="bg-ink text-stone py-12 px-12 w-full border-t border-white/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-light">
          <div className="font-display font-medium text-white text-lg">mythos.</div>
          <div className="flex items-center gap-8">
            <a href="https://x.com/MythosAgent7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Twitter / X
            </a>
            <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
