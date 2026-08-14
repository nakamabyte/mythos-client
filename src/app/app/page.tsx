'use client';

import React, { useEffect, useState } from 'react';
import MetricsLedger from "@/components/features/MetricsLedger";
import AgentLogs from "@/components/features/AgentLogs";
import SystemLogs from "@/components/features/SystemLogs";
import { Badge } from '@/components/ui/Badge';
import { Power, Terminal, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Strategy {
  id: string;
  name: string;
  status: string;
  execution_mode: string;
  is_active: boolean;
  market_type: string;
}

export default function DashboardPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      const { data } = await supabase
        .from('strategies')
        .select('id, name, status, execution_mode, is_active, market_type');
      if (data) setStrategies(data);
      setIsLoading(false);
    };
    
    fetchStrategies();
    
    const channel = supabase
      .channel('strategies_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'strategies' }, fetchStrategies)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const activeFleet = strategies.filter(s => s.is_active || s.status === 'sandbox');

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col p-2 gap-2 bg-zinc-50/50">
      
      {/* Top Ribbon: Metrics */}
      <div className="flex-none">
        <MetricsLedger />
      </div>

      {/* Main Terminal Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0">
        
        {/* Left Column: Management (Strategies & Agents) */}
        <div className="lg:col-span-3 flex flex-col gap-2 min-h-0">
          
          {/* Strategies Panel */}
          <div className="flex-1 border border-hairline-soft bg-white rounded-xl flex flex-col min-h-0 overflow-hidden">
            <div className="bg-zinc-50 border-b border-hairline-soft px-4 py-2 flex justify-between items-center">
              <h2 className="font-display text-[10px] uppercase tracking-widest font-semibold text-ash">Vaults & Strategies</h2>
              <span className="text-[10px] font-mono text-stone">{strategies.length} TOTAL</span>
            </div>
            <div className="p-2 overflow-y-auto flex-1 space-y-2">
              {isLoading ? (
                <div className="text-xs text-ash text-center mt-4">Loading real data...</div>
              ) : strategies.length === 0 ? (
                <div className="text-xs text-ash text-center mt-4">No strategies found</div>
              ) : strategies.map(strat => (
                <div key={strat.id} className="border border-hairline rounded-lg p-3 hover:border-hairline-soft transition-colors cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-display text-sm font-semibold text-ink">{strat.name}</div>
                      <div className="text-[9px] text-stone font-mono uppercase">{strat.id.split('-')[0]}...</div>
                    </div>
                    <Badge variant="outline" className="scale-90 origin-top-right uppercase">{strat.status}</Badge>
                  </div>
                  <div className="flex justify-between text-xs mt-3 pt-3 border-t border-hairline border-dashed">
                    <span className="text-ash font-mono text-[10px] uppercase">Market: {strat.market_type}</span>
                    <span className="text-accent-deep font-mono font-medium text-[10px] uppercase">Mode: {strat.execution_mode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agents Panel */}
          <div className="flex-1 border border-hairline-soft bg-white rounded-xl flex flex-col min-h-0 overflow-hidden">
            <div className="bg-zinc-50 border-b border-hairline-soft px-4 py-2 flex justify-between items-center">
              <h2 className="font-display text-[10px] uppercase tracking-widest font-semibold text-ash">Active Fleet</h2>
              <span className="text-[10px] font-mono text-stone">{activeFleet.length} NODES</span>
            </div>
            <div className="p-2 overflow-y-auto flex-1 space-y-2">
              {isLoading ? (
                <div className="text-xs text-ash text-center mt-4">Loading fleet...</div>
              ) : activeFleet.length === 0 ? (
                <div className="text-xs text-ash text-center mt-4">No active agents</div>
              ) : activeFleet.map(agent => (
                <div key={agent.id} className="border border-hairline rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-display text-sm font-semibold text-ink">Node: {agent.name}</div>
                      <div className="text-[9px] text-stone font-mono uppercase">{agent.id.split('-')[0]}...</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-accent-deep shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                  </div>
                  <div className="text-[10px] text-ash font-light mb-3 uppercase">
                    Executing Strategy: {agent.name}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 h-6 bg-zinc-50 border border-hairline rounded text-[10px] font-medium text-ink hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1">
                      <Terminal size={10} /> LOGS
                    </button>
                    <button className="flex-1 h-6 bg-zinc-50 border border-hairline rounded text-[10px] font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-1">
                      <Power size={10} /> HALT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Middle Column: Trade Execution Logs */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <AgentLogs />
        </div>

        {/* Right Column: System Logs */}
        <div className="lg:col-span-4 flex flex-col min-h-0">
          <SystemLogs />
        </div>

      </div>
    </div>
  );
}
