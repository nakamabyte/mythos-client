import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopBar from "@/components/layout/TopBar";
import Hero from "@/components/features/Hero";
import StatsSection from "@/components/features/StatsSection";
import StrategiesSection from "@/components/features/StrategiesSection";
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
                Using cutting-edge LLMs (Claude, Grok) with Monte Carlo simulations to assess risk and build robust portfolios.
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

        <StatsSection />
        <StrategiesSection />
        <HowItWorks />
        <SecuritySection />
        <FaqSection />
        <CtaSection />
        
      </main>
      
      <footer className="bg-ink text-stone py-12 px-12 w-full border-t border-white/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-light">
          <div className="font-display font-medium text-white text-lg">mythos.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://github.com/mythos" className="hover:text-white transition-colors">GitHub</a>
            <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
