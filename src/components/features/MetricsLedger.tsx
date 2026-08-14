import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { MOCK_METRICS } from '@/data/mock';

export default function MetricsLedger() {
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
            ${MOCK_METRICS.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-ash mt-1">Total Balance</div>
        </div>
        <div className="border-t border-hairline-soft pt-3.5 pb-3">
          <div className="font-display text-2xl md:text-3xl font-medium text-accent-deep tabular-nums tracking-tight">
            +{MOCK_METRICS.performance30d}%
          </div>
          <div className="text-xs text-ash mt-1">30d Performance</div>
        </div>
      </div>

      <div className="mt-4 border-t border-hairline-soft pt-4 flex flex-col gap-2">
        <div className="flex justify-between gap-3 font-display text-[12.5px] font-medium text-ash tabular-nums">
          <span>Active Strategies</span>
          <b className="text-ink font-medium">{MOCK_METRICS.activeStrategies.current} / {MOCK_METRICS.activeStrategies.total}</b>
        </div>
        <div className="flex justify-between gap-3 font-display text-[12.5px] font-medium text-ash tabular-nums">
          <span>Win Rate</span>
          <b className="text-ink font-medium">{MOCK_METRICS.winRate}%</b>
        </div>
        <div className="flex justify-between gap-3 font-display text-[12.5px] font-medium text-ash tabular-nums">
          <span>Max Drawdown</span>
          <b className="text-ink font-medium">{MOCK_METRICS.maxDrawdown}%</b>
        </div>
      </div>
    </div>
  );
}
