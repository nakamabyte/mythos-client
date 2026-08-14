import React from 'react';
import { Badge } from '@/components/ui/Badge';

export default function StrategiesPage() {
  const activeStrategies = [
    {
      id: "strat_dn_01",
      name: "Delta Neutral Arb",
      status: "Active",
      allocated: "$450,210.00",
      pnl30d: "+12.4%",
      pnlUsd: "+$55,826.04",
      risk: "Low",
      tradesCount: 1204
    },
    {
      id: "strat_hft_02",
      name: "High-Frequency Momentum",
      status: "Active",
      allocated: "$1,200,000.00",
      pnl30d: "+45.2%",
      pnlUsd: "+$542,400.00",
      risk: "Medium",
      tradesCount: 45201
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1200px] w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">Vaults & Strategies</h1>
          <p className="text-sm text-ash font-light">Monitor and allocate capital to active autonomous strategies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeStrategies.map(strat => (
          <div key={strat.id} className="bg-white border border-hairline-soft rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink mb-1">{strat.name}</h2>
                <div className="text-xs text-stone font-mono">{strat.id}</div>
              </div>
              <Badge>{strat.status}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-zinc-50 rounded-xl border border-hairline">
                <div className="text-[10px] uppercase tracking-widest text-stone font-semibold mb-1">Allocated Capital</div>
                <div className="font-display text-xl font-medium text-ink">{strat.allocated}</div>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-hairline">
                <div className="text-[10px] uppercase tracking-widest text-stone font-semibold mb-1">30D PNL</div>
                <div className="font-display text-xl font-medium text-accent-deep">{strat.pnl30d}</div>
                <div className="text-xs text-ash mt-1">{strat.pnlUsd}</div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm border-t border-hairline-soft pt-4 mt-auto">
              <div className="flex gap-4">
                <span className="text-ash"><span className="text-ink font-medium">Risk:</span> {strat.risk}</span>
                <span className="text-ash"><span className="text-ink font-medium">Trades:</span> {strat.tradesCount.toLocaleString()}</span>
              </div>
              <button className="text-xs font-semibold text-accent-deep hover:text-ink transition-colors uppercase tracking-widest">
                Manage &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
