"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

import { supabase } from '@/lib/supabase';

export default function StrategiesSection() {
  const [strategies, setStrategies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStrategies() {
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .eq('is_active', true);
        
        if (data) {
          setStrategies(data);
        }
      } catch (err) {
        console.error("Error fetching strategies", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStrategies();
  }, []);

  return (
    <section className="py-32 px-12 max-w-[1200px] mx-auto border-t border-hairline-soft relative">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="text-center mb-20 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-light text-ink tracking-tight mb-6"
        >
          Active Trading Strategies
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-ash font-light max-w-2xl mx-auto"
        >
          Deploy your capital into institutional-grade vaults. Our agentic systems automatically rebalance based on real-time market regimes.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-ash font-light">Loading strategies...</div>
        </div>
      ) : strategies.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-ash font-light">No active strategies found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {strategies.map((strat, i) => {
            const Icon = Activity; // Fallback icon
            return (
              <motion.div 
                key={strat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white/80 backdrop-blur-md border border-hairline-soft rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-accent-deep/30 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                {/* Glossy hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-hairline flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors">
                    <Icon className="w-6 h-6 text-ink group-hover:text-accent-deep transition-colors" />
                  </div>
                  <Badge>{strat.status === 'live_ready' || strat.status === 'validated' ? 'Low Risk' : 'Medium Risk'}</Badge>
                </div>

                <h3 className="font-display text-xl font-semibold text-ink mb-3 relative z-10">{strat.name}</h3>
                <p className="text-ash font-light text-sm leading-relaxed flex-1 mb-8 relative z-10">{strat.edge_thesis}</p>

                <div className="grid grid-cols-2 gap-4 border-t border-hairline-soft pt-6 relative z-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-stone font-semibold mb-1">Target APY</div>
                    <div className="font-display text-2xl font-semibold text-accent-deep">
                      {strat.params?.target_apy ? `${strat.params.target_apy}%` : 'TBD'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-stone font-semibold mb-1">Active TVL</div>
                    <div className="font-display text-xl font-medium text-ink mt-1">
                      {strat.params?.tvl ? `$${strat.params.tvl}` : 'TBD'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
