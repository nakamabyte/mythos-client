'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, Crosshair, ShieldAlert, Target } from 'lucide-react';

interface RadarState {
  symbol: string;
  phase: 'IDLE' | 'SEARCHING_WALL' | 'TARGET_LOCKED';
  message: string;
  details: any;
  updated_at: string;
}

export default function SniperRadar() {
  const [radarStates, setRadarStates] = useState<Record<string, RadarState>>({});
  const [activeTrades, setActiveTrades] = useState<Record<string, any>>({});

  useEffect(() => {
    // Initial fetch
    const fetchInitial = async () => {
      // Fetch open positions
      const { data: trades } = await supabase
        .from('trade_logs')
        .select('*')
        .eq('status', 'RUNNING');
      
      if (trades) {
        const tradesMap: Record<string, any> = {};
        trades.forEach(t => tradesMap[t.symbol] = t);
        setActiveTrades(tradesMap);
      }

      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('module', 'sniper_radar')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && !error) {
        const initialStates: Record<string, RadarState> = {};
        // Process from oldest to newest to keep the latest per symbol
        data.reverse().forEach((log) => {
          initialStates[log.details?.symbol || 'UNKNOWN'] = {
            symbol: log.details?.symbol || 'UNKNOWN',
            phase: log.details?.phase || 'IDLE',
            message: log.message,
            details: log.details?.details,
            updated_at: log.created_at
          };
        });
        setRadarStates(initialStates);
      }
    };
    
    fetchInitial();

    const channel = supabase
      .channel('sniper_radar_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_logs', filter: `module=eq.sniper_radar` },
        (payload) => {
          const log = payload.new;
          const symbol = log.details?.symbol;
          if (symbol) {
            setRadarStates(prev => ({
              ...prev,
              [symbol]: {
                symbol,
                phase: log.details?.phase || 'IDLE',
                message: log.message,
                details: log.details?.details,
                updated_at: log.created_at
              }
            }));
          }
        }
      )
      .subscribe();

    const tradesChannel = supabase
      .channel('sniper_radar_trades')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trade_logs' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const trade = payload.new;
            if (trade.status === 'RUNNING') {
              setActiveTrades(prev => ({ ...prev, [trade.symbol]: trade }));
            } else {
              setActiveTrades(prev => {
                const next = { ...prev };
                delete next[trade.symbol];
                return next;
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(tradesChannel);
    };
  }, []);

  const getPhaseConfig = (phase: string) => {
    switch(phase) {
      case 'TARGET_LOCKED':
        return { 
          color: 'text-[#00ff88]', 
          bg: 'bg-[#00ff88]/10', 
          border: 'border-[#00ff88]/30', 
          icon: <Target className="w-4 h-4 animate-pulse" />,
          label: 'LOCKED'
        };
      case 'SEARCHING_WALL':
        return { 
          color: 'text-amber-400', 
          bg: 'bg-amber-400/10', 
          border: 'border-amber-400/30', 
          icon: <ShieldAlert className="w-4 h-4" />,
          label: 'ZONE INTRUSION'
        };
      case 'IDLE':
      default:
        return { 
          color: 'text-white/40', 
          bg: 'bg-white/5', 
          border: 'border-white/10', 
          icon: <Crosshair className="w-4 h-4 opacity-50" />,
          label: 'SCANNING'
        };
    }
  };

  const symbols = Object.keys(radarStates);

  return (
    <div className="border border-white/10 rounded-xl bg-black overflow-hidden flex flex-col shadow-2xl relative">
      {/* Sleek Header */}
      <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-black to-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <Crosshair className="w-4 h-4 text-white/50" />
          <h3 className="text-xs font-display font-semibold tracking-[0.2em] text-white/80 uppercase">Tactical Radar</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping opacity-75"></div>
          <span className="text-[9px] font-mono text-white/30 tracking-widest">SMC-SNIPER-003</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-3 bg-[url('/noise.png')] bg-repeat opacity-95 min-h-[120px]">
        {symbols.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs font-mono text-white/30 animate-pulse">Initializing surveillance...</span>
          </div>
        ) : (
          <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {symbols.map(sym => {
              const state = radarStates[sym];
              const activeTrade = activeTrades[sym];
              
              let config = getPhaseConfig(state.phase);
              let message = state.message;
              let details = state.details;

              if (activeTrade) {
                config = {
                  color: activeTrade.side === 'LONG' ? 'text-[#00a86b]' : 'text-red-500',
                  bg: activeTrade.side === 'LONG' ? 'bg-[#00a86b]/10' : 'bg-red-500/10',
                  border: activeTrade.side === 'LONG' ? 'border-[#00a86b]/30' : 'border-red-500/30',
                  icon: <Activity className="w-4 h-4 animate-pulse" />,
                  label: 'ACTIVE'
                };
                message = `In ${activeTrade.side} position. Entry: $${activeTrade.entry_price.toFixed(4)}. Managing position...`;
                details = null;
              }
              
              return (
                <div key={sym} className={`flex-1 min-w-[220px] max-w-[300px] p-3 rounded-lg border ${config.border} ${config.bg} backdrop-blur-sm transition-all duration-500`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-display font-bold text-sm tracking-wide text-white`}>{sym}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-sm border ${config.border} ${config.color} bg-black/50`}>
                      {config.icon}
                      <span className="text-[9px] font-mono font-bold tracking-wider">{config.label}</span>
                    </div>
                  </div>
                  
                  <div className="text-[10px] font-mono leading-relaxed text-white/60 min-h-[30px]">
                    {state.message}
                  </div>
                  
                  {/* Micro Details (e.g. OB levels or Wall price) */}
                  {state.details && (
                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                      {state.details.top && state.details.bottom ? (
                        <div className="flex gap-3 text-[9px] font-mono">
                          <span className="text-white/40">OB: <span className="text-white/70">{state.details.bottom.toFixed(1)} - {state.details.top.toFixed(1)}</span></span>
                        </div>
                      ) : <span />}
                      
                      {state.details.wallPrice && (
                        <div className="text-[9px] font-mono text-white/40">
                          WALL: <span className="text-amber-400 font-bold">{state.details.wallPrice}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Scanline Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-10">
        <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.1)_51%)] bg-[length:100%_4px]"></div>
      </div>
    </div>
  );
}
