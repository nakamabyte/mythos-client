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
}

export default function AgentLogs() {
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial data
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('trade_logs')
        .select('id, symbol, side, status, entry_price, position_size, entry_time, exit_time, exit_reason, net_pnl_usd')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setLogs(data);
      }
      setIsLoading(false);
    };

    fetchLogs();

    // 2. Set up realtime subscription
    const channel = supabase
      .channel('trade_logs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trade_logs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLogs((current) => [payload.new as TradeLog, ...current].slice(0, 10));
          } else if (payload.eventType === 'UPDATE') {
            setLogs((current) => current.map(log => log.id === payload.new.id ? { ...log, ...payload.new } as TradeLog : log));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Pending';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              return (
              <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold text-ink">{log.symbol}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${log.net_pnl_usd === null ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse' : 'bg-stone/10 text-stone border border-stone/20'}`}>
                        {log.net_pnl_usd === null ? 'RUNNING' : formatExitReason(log.exit_reason)}
                      </span>
                    </div>
                    <div className="text-[11px] text-ash mt-0.5">{formatTime(log.entry_time)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-display text-sm font-medium text-ink tabular-nums">
                      {log.position_size || 0} @ {log.entry_price ? `$${log.entry_price}` : 'MKT'}
                    </div>
                    {log.net_pnl_usd !== null && log.net_pnl_usd !== undefined ? (
                      <div className={`text-[11.5px] font-bold tabular-nums mt-0.5 ${log.net_pnl_usd >= 0 ? 'text-accent-deep' : 'text-red-500'}`}>
                        PnL: {formatCurrency(log.net_pnl_usd)}
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
      
      {logs.length > 0 && (
        <div className="px-6 py-3 border-t border-hairline-soft bg-zinc-50/50 text-center">
          <Link href="/app/ledger" className="font-display text-xs font-semibold text-accent-deep hover:underline">
            View Full Ledger &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
