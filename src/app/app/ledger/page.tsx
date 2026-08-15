'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import Link from 'next/link';
import { PnLShareModal } from '@/components/features/PnLShareModal';

interface TradeLog {
  id: string;
  symbol: string;
  side: string;
  entry_price: number | null;
  position_size: number | null;
  entry_time: string | null;
  exit_price: number | null;
  exit_time: string | null;
  net_pnl_usd: number | null;
  net_pnl_pct: number | null;
  exit_reason: string | null;
  status?: string;
  reasons?: string[]; // we can parse this from signal_data or leave blank
  signal_data?: any;
}

export default function LedgerPage() {
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSymbol, setFilterSymbol] = useState('ALL');
  const [filterSide, setFilterSide] = useState('ALL');
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShareTrade, setSelectedShareTrade] = useState<TradeLog | null>(null);

  const handleShare = (trade: TradeLog) => {
    setSelectedShareTrade(trade);
    setIsShareModalOpen(true);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('trade_logs')
        .select('*')
        .order('status', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (!error && data) {
        setLogs(data);
      }
      setIsLoading(false);
    };

    fetchLogs();
  }, []);

  // Poll for real-time prices for RUNNING trades
  useEffect(() => {
    const fetchPrices = async () => {
      const runningLogs = logs.filter(l => l.status === 'RUNNING');
      if (runningLogs.length === 0) return;
      const symbols = Array.from(new Set(runningLogs.map(l => l.symbol)));
      
      try {
        const promises = symbols.map(async sym => {
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
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString([], { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const getReason = (log: TradeLog) => {
    if (log.exit_reason) return `Exit: ${log.exit_reason}`;
    if (log.signal_data?.reasons?.length > 0) return `Entry: ${log.signal_data.reasons[0]}`;
    return '-';
  };

  // Extract unique symbols for the filter dropdown
  const uniqueSymbols = Array.from(new Set(logs.map(l => l.symbol))).sort();

  // Apply filters
  const filteredLogs = logs.filter(log => {
    if (filterSymbol !== 'ALL' && log.symbol !== filterSymbol) return false;
    if (filterSide !== 'ALL' && log.side?.toUpperCase() !== filterSide) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-4">
        <Link href="/app" className="flex items-center gap-2 text-ash hover:text-ink transition-colors font-display text-sm">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        
        <div className="flex items-end justify-between border-b border-hairline-soft pb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-light text-ink tracking-tight mb-2">
              Full Ledger
            </h1>
            <p className="text-sm font-light text-ash">
              Complete history of all automated trades.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <select 
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
              className="bg-canvas border border-hairline-soft rounded-md px-3 py-1.5 text-xs font-display text-ink focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Pairs</option>
              {uniqueSymbols.map(sym => (
                <option key={sym} value={sym}>{sym}</option>
              ))}
            </select>

            <select 
              value={filterSide}
              onChange={(e) => setFilterSide(e.target.value)}
              className="bg-canvas border border-hairline-soft rounded-md px-3 py-1.5 text-xs font-display text-ink focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Sides</option>
              <option value="LONG">Long / Buy</option>
              <option value="SHORT">Short / Sell</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border border-hairline-soft rounded-xl bg-canvas overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#fbfcfd] text-ash font-display font-medium text-[13px] border-b border-hairline-soft">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Side</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Size</th>
                <th className="px-6 py-4 text-right">Entry Price</th>
                <th className="px-6 py-4 text-right">Exit Price</th>
                <th className="px-6 py-4 text-right">Net PnL</th>
                <th className="px-6 py-4">Reason / Notes</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-soft text-ink">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-ash">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-deep mb-4"></div>
                      <p className="font-mono text-xs uppercase tracking-widest">Loading ledger...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-ash font-display">
                    No trades match the selected filters.
                  </td>
                </tr>
              ) : (
                  filteredLogs.map((log) => {
                    const isLong = log.side?.toLowerCase() === 'long' || log.side?.toLowerCase() === 'buy';
                    const currentPrice = log.status === 'RUNNING' ? currentPrices[log.symbol] : null;
                    let livePnl: number | null = null;
                    
                    if (log.status === 'RUNNING' && currentPrice && log.entry_price && log.position_size) {
                      const diff = isLong ? (currentPrice - log.entry_price) : (log.entry_price - currentPrice);
                      livePnl = diff * log.position_size;
                    }

                    return (
                  <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 text-ash">{formatTime(log.entry_time)}</td>
                    <td className="px-6 py-4 font-semibold font-display">{log.symbol}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isLong ? 'bg-[#00a86b]' : 'bg-red-500'}`}></div>
                        <span className={`font-display text-xs font-bold tracking-widest uppercase ${isLong ? 'text-[#00a86b]' : 'text-red-500'}`}>
                          {log.side || 'UNK'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">{log.position_size || '-'}</td>
                    <td className="px-6 py-4 text-right tabular-nums">{log.entry_price ? `$${log.entry_price.toFixed(4)}` : '-'}</td>
                    <td className="px-6 py-4 text-right tabular-nums text-ash">
                      {log.exit_price ? `$${log.exit_price.toFixed(4)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.status === 'RUNNING' && livePnl !== null ? (
                        <span className={`font-medium tabular-nums flex items-center justify-end gap-1 ${livePnl >= 0 ? 'text-accent-deep' : 'text-red-500'}`}>
                          {livePnl > 0 ? '+' : ''}{formatCurrency(livePnl)}
                          <span className="text-[9px] font-mono opacity-60">LIVE</span>
                        </span>
                      ) : log.net_pnl_usd !== null ? (
                        <span className={`font-medium tabular-nums ${log.net_pnl_usd >= 0 ? 'text-accent-deep' : 'text-red-500'}`}>
                          {log.net_pnl_usd > 0 ? '+' : ''}{formatCurrency(log.net_pnl_usd)}
                        </span>
                      ) : (
                        <span className="text-ash">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-ash max-w-[200px] truncate" title={getReason(log)}>
                      {getReason(log)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(log.status === 'CLOSED' || log.status === 'RUNNING') && (log.net_pnl_usd !== null || livePnl !== null) && (
                        <button 
                          onClick={() => handleShare({...log, exit_price: log.exit_price || currentPrice, net_pnl_usd: log.net_pnl_usd || livePnl})}
                          className="p-1.5 text-ash hover:text-ink hover:bg-zinc-100 rounded-md transition-colors"
                          title="Share PnL Card"
                        >
                          <Share2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PnLShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        trade={selectedShareTrade} 
      />
    </div>
  );
}
