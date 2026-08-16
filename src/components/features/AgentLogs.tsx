'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { Activity } from 'lucide-react';
import Link from 'next/link';

interface TradeLog {
  id: string;
  symbol: string;
  side: string;
  entry_price: number | null;
  position_size: number | null;
  entry_time: string | null;
  exit_time: string | null;
  exit_reason: string | null;
  net_pnl_usd: number | null;
  status?: string;
}

export default function AgentLogs() {
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchLogs = async (isInitial = true) => {
      const { data, error } = await supabase
        .from('trade_logs')
        .select('id, symbol, side, status, entry_price, position_size, entry_time, exit_time, exit_reason, net_pnl_usd')
        .eq('status', 'RUNNING')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error && data) {
        setLogs(prev => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          return data;
        });
      }
      if (isInitial) setIsLoading(false);
    };

    fetchLogs(true);

    const interval = setInterval(() => fetchLogs(false), 5000);

    return () => clearInterval(interval);
  }, []);

  // Poll for real-time prices
  useEffect(() => {
    const fetchPrices = async () => {
      if (logs.length === 0) return;
      const symbols = Array.from(new Set(logs.map(l => l.symbol)));
      
      try {
        const promises = symbols.map(async sym => {
          // Using Bybit Testnet API since the trading agent is on Testnet
          const res = await fetch(`https://api-demo.bybit.com/v5/market/tickers?category=linear&symbol=${sym}`);
          const data = await res.json();
          if (data?.result?.list?.[0]?.markPrice) {
            return { symbol: sym, price: parseFloat(data.result.list[0].markPrice) };
          }
          return { symbol: sym, price: NaN };
        });
        const results = await Promise.all(promises);
        const newPrices: Record<string, number> = {};
        results.forEach(r => { if (r.price && !isNaN(r.price)) newPrices[r.symbol] = r.price; });
        setCurrentPrices(newPrices);
      } catch (e) {
        // silent catch
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, [logs]);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Pending';
    const date = new Date(isoString);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatExitReason = (reason: string | null) => {
    if (!reason) return 'CLOSED';
    if (reason === 'take_profit') return 'TP';
    if (reason === 'stop_loss') return 'SL';
    if (reason === 'strategy_reversal') return 'REVERSAL';
    return reason.toUpperCase();
  };

  return (
    <div className="border border-hairline-soft rounded-xl bg-canvas overflow-hidden flex flex-col h-full">
      <div className="bg-zinc-50 border-b border-hairline-soft px-4 py-2 flex justify-between items-center">
        <h2 className="font-display text-[10px] uppercase tracking-widest font-semibold text-ash">Live Execution Feed</h2>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-deep animate-pulse"></span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-stone">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-deep mb-4"></div>
            <p className="font-mono text-xs uppercase tracking-widest">Connecting to Agent...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-stone p-6 text-center">
            <Activity size={32} className="mb-3 text-hairline-soft" />
            <p className="font-display text-sm font-medium text-charcoal mb-1">Awaiting Signals</p>
            <p className="text-xs">The autonomous agent is currently scanning the market. Executions will appear here automatically.</p>
          </div>
        ) : (
          <div className="divide-y divide-hairline-soft">
            {logs.map((log) => {
              const isLong = log.side?.toLowerCase() === 'long' || log.side?.toLowerCase() === 'buy';
              const currentPrice = currentPrices[log.symbol];
              let livePnl: number | null = null;
              
              if (currentPrice && log.entry_price && log.position_size) {
                const diff = isLong ? (currentPrice - log.entry_price) : (log.entry_price - currentPrice);
                livePnl = diff * log.position_size;
              }

              return (
              <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold text-ink">{log.symbol}</span>
                      {log.status === 'RUNNING' ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-accent-deep/30 bg-accent-deep/5 text-accent-deep text-[10px] font-bold uppercase tracking-wider font-display">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-deep animate-pulse"></div>
                          Running
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 py-1 rounded-md border border-hairline-soft bg-zinc-50 text-ash text-[10px] font-bold uppercase tracking-wider font-display">
                          Closed
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-ash mt-0.5">{formatTime(log.entry_time)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-display text-sm font-medium text-ink tabular-nums">
                      {log.position_size || 0} @ {log.entry_price ? `$${log.entry_price.toFixed(4)}` : 'MKT'}
                    </div>
                    {livePnl !== null ? (
                      <div className={`text-[11.5px] font-bold tabular-nums mt-0.5 flex items-center justify-end gap-1 ${livePnl >= 0 ? 'text-accent-deep' : 'text-red-500'}`}>
                        {livePnl >= 0 ? '+$' : '-$'}{Math.abs(livePnl).toFixed(4)}
                        <span className="text-[9px] font-mono opacity-60">LIVE</span>
                      </div>
                    ) : (
                      <div className="text-[11.5px] font-medium tabular-nums mt-0.5 text-ash">
                        Open Position
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end w-16">
                    <div className={`w-2.5 h-2.5 rounded-full ${isLong ? 'bg-[#00a86b]' : 'bg-red-500'}`}></div>
                    <span className={`font-display text-xs font-bold tracking-widest uppercase ${isLong ? 'text-[#00a86b]' : 'text-red-500'}`}>
                      {log.side || 'UNK'}
                    </span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer link to Ledger */}
      <div className="px-6 py-3 border-t border-hairline-soft bg-zinc-50/50 text-center">
        <Link href="/app/ledger" className="font-display text-xs font-semibold text-accent-deep hover:underline">
          Full History &rarr;
        </Link>
      </div>
    </div>
  );
}
