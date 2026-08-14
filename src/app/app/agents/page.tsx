"use client";

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import AgentLogs from '@/components/features/AgentLogs';
import { MOCK_AGENT_LOGS } from '@/data/mock';
import { Activity, Power, Terminal } from 'lucide-react';

export default function AgentsPage() {
  const agents = [
    {
      id: "agent_alpha_01",
      name: "Alpha Sentiment Engine",
      status: "Running",
      strategy: "Delta Neutral Arb",
      uptime: "99.99%",
      lastAction: "2 mins ago"
    },
    {
      id: "agent_hft_04",
      name: "HFT Scalper Node",
      status: "Running",
      strategy: "High-Frequency Momentum",
      uptime: "99.95%",
      lastAction: "12 secs ago"
    },
    {
      id: "agent_risk_mgr",
      name: "Global Risk Monitor",
      status: "Idle",
      strategy: "System Guard",
      uptime: "100%",
      lastAction: "1 hour ago"
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1200px] w-full flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Agent Fleet</h1>
        <p className="text-sm text-ash font-light">Monitor the status and real-time activities of all deployed autonomous agents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white border border-hairline-soft rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.status === 'Running' ? 'bg-accent/20 text-accent-deep' : 'bg-zinc-100 text-ash'}`}>
                  <Activity size={16} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink">{agent.name}</h3>
                  <div className="text-[10px] text-stone font-mono">{agent.id}</div>
                </div>
              </div>
              <Badge>{agent.status}</Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-ash font-light">Strategy</span>
                <span className="text-ink font-medium">{agent.strategy}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ash font-light">Uptime</span>
                <span className="text-ink font-medium">{agent.uptime}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ash font-light">Last Action</span>
                <span className="text-ink font-medium">{agent.lastAction}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex justify-center items-center gap-1 h-8 bg-zinc-50 border border-hairline rounded-md text-xs font-medium text-ink hover:bg-zinc-100 transition-colors">
                <Terminal size={12} /> Logs
              </button>
              <button className="flex-1 flex justify-center items-center gap-1 h-8 bg-zinc-50 border border-hairline rounded-md text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                <Power size={12} /> Halt
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Global Execution Feed</h2>
        {/* We reuse the AgentLogs component, passing the mock data */}
        <AgentLogs logs={MOCK_AGENT_LOGS} />
      </div>
    </div>
  );
}
