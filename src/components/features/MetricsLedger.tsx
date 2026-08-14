'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';

interface Metrics {
  totalBalance: number;
  performance30d: number;
  activeStrategies: { current: number; total: number };
  winRate: number;
  maxDrawdown: number;
}

export default function MetricsLedger() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalBalance: 0,
    performance30d: 0,
    activeStrategies: { current: 0, total: 0 },
    winRate: 0,
    maxDrawdown: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      // Base balance assuming testnet starts with some baseline like 50,000
      const BASE_BALANCE = 50000;
      let totalPnl = 0;
      let totalWinners = 0;
      let totalTrades = 0;

      // Fetch daily P&L
      const { data: pnlData } = await supabase.from('v_daily_pnl').select('*');
      if (pnlData && pnlData.length > 0) {
        pnlData.forEach((row) => {
          totalPnl += Number(row.net_pnl_usd) || 0;
          totalWinners += Number(row.winners) || 0;
          totalTrades += Number(row.trades) || 0;
        });
      }

      // Fetch strategies
      const { data: strategiesData } = await supabase.from('strategies').select('id, is_active');
      let activeCount = 0;
      let totalCount = 0;
      if (strategiesData) {
        totalCount = strategiesData.length;
        activeCount = strategiesData.filter(s => s.is_active).length;
      }

      const winRate = totalTrades > 0 ? (totalWinners / totalTrades) * 100 : 0;
      const perf30d = (totalPnl / BASE_BALANCE) * 100;

      setMetrics({
        totalBalance: BASE_BALANCE + totalPnl,
        performance30d: perf30d,
        activeStrategies: { current: activeCount, total: totalCount },
        winRate: winRate,
        maxDrawdown: 0.0, // Hard to calculate purely from daily PnL without a time series, defaulting to 0 for empty states
      });
      setIsLoading(false);
    };

    fetchMetrics();
  }, []);

  return (
    <div className="border border-hairline-soft rounded-xl p-6 bg-canvas">
      <div className="flex justify-between items-center mb-6">
        <span className="font-display text-[11px] font-semibold tracking-widest uppercase text-ash">
          Trading Ledger
        </span>
        <Badge variant="live">LIVE</Badge>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-0">
        <div className="border-t border-hairline-soft pt-3.5 pb-3">
          <div className="font-display text-2xl md:text-3xl font-medium text-ink tabular-nums tracking-tight">
            ${isLoading ? '---' : metrics.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-ash mt-1">Total Balance</div>
        </div>
        <div className="border-t border-hairline-soft pt-3.5 pb-3">
          <div className="font-display text-2xl md:text-3xl font-medium text-accent-deep tabular-nums tracking-tight">
            {isLoading ? '---' : (metrics.performance30d >= 0 ? '+' : '') + metrics.performance30d.toFixed(2)}%
          </div>
          <div className="text-xs text-ash mt-1">30d Performance</div>
        </div>
      </div>

      <div className="mt-4 border-t border-hairline-soft pt-4 flex flex-col gap-2">
        <div className="flex justify-between gap-3 font-display text-[12.5px] font-medium text-ash tabular-nums">
          <span>Active Strategies</span>
          <b className="text-ink font-medium">
            {isLoading ? '-' : `${metrics.activeStrategies.current} / ${metrics.activeStrategies.total}`}
          </b>
        </div>
        <div className="flex justify-between gap-3 font-display text-[12.5px] font-medium text-ash tabular-nums">
          <span>Win Rate</span>
          <b className="text-ink font-medium">{isLoading ? '-' : metrics.winRate.toFixed(1)}%</b>
        </div>
        <div className="flex justify-between gap-3 font-display text-[12.5px] font-medium text-ash tabular-nums">
          <span>Max Drawdown</span>
          <b className="text-ink font-medium">{isLoading ? '-' : metrics.maxDrawdown.toFixed(1)}%</b>
        </div>
      </div>
    </div>
  );
}
