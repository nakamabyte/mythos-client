'use client';

import React, { useEffect, useState } from 'react';
import MetricsLedger from "@/components/features/MetricsLedger";
import SniperRadar from "@/components/features/SniperRadar";
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

  const activeFleet = strategies.filter(s => s.is_active);

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col p-2 gap-2 bg-zinc-50/50">
      
      {/* Top Ribbon: Metrics */}
      <div className="flex-none">
        <MetricsLedger />
      </div>

      {/* Tactical Radar (Moved above Vaults & Terminal as requested) */}
      <div className="flex-none">
        <SniperRadar />
      </div>

      {/* Main Terminal Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0">
        
        {/* Left Column: Command Center */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          
          <div className="flex-1 border border-hairline-soft bg-white rounded-xl flex flex-col min-h-0 overflow-hidden shadow-sm">
            <div className="bg-zinc-50 border-b border-hairline-soft px-4 py-3 flex justify-between items-center">
              <h2 className="font-display text-[11px] uppercase tracking-[0.2em] font-semibold text-ash">Command Center</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-stone">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-deep" />
                  {activeFleet.length} ACTIVE
                </span>
              </div>
            </div>
            
            <div className="p-3 overflow-y-auto flex-1 space-y-3">
              {isLoading ? (
                <div className="text-xs text-ash text-center mt-4 font-mono">Initializing systems...</div>
              ) : strategies.length === 0 ? (
                <div className="text-xs text-ash text-center mt-4 font-mono">No strategies deployed.</div>
              ) : strategies.map(strat => {
                const isActive = strat.is_active;
                return (
                  <div key={strat.id} className={`border rounded-lg p-3 transition-all duration-300 ${
                    isActive 
                      ? 'border-accent-deep/30 bg-accent-deep/5 shadow-[0_0_15px_rgba(45,212,191,0.05)]' 
                      : 'border-hairline bg-white hover:border-hairline-soft'
                  }`}>
                    
                    {/* Header: Name & Status */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className={`font-display text-sm font-semibold ${isActive ? 'text-accent-deep' : 'text-ink'}`}>
                          {strat.name}
                        </div>
                        <div className="text-[9px] text-stone font-mono uppercase mt-0.5 tracking-wider">
                          {strat.id.split('-')[0]} • {strat.market_type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-accent-deep shadow-[0_0_8px_rgba(45,212,191,0.6)] animate-pulse" />
                        )}
                        <Badge variant="outline" className={`scale-90 origin-top-right uppercase ${
                          isActive ? 'border-accent-deep/50 text-accent-deep bg-accent-deep/10' : 'text-stone'
                        }`}>
                          {isActive ? 'ACTIVE' : strat.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className={`mt-3 pt-3 border-t border-dashed ${
                      isActive ? 'border-accent-deep/20' : 'border-hairline'
                    }`}>
                      <span className={`font-mono font-medium text-[10px] uppercase tracking-wider ${
                        isActive ? 'text-accent-deep' : 'text-ash'
                      }`}>
                        Mode: {strat.execution_mode}
                      </span>
                    </div>
                    
                  </div>
                );
              })}
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
