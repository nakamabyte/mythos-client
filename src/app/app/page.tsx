import React from 'react';
import MetricsLedger from "@/components/features/MetricsLedger";
import AgentLogs from "@/components/features/AgentLogs";
import SystemLogs from "@/components/features/SystemLogs";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10 p-4 md:p-8">
      <div className="flex items-end justify-between border-b border-hairline-soft pb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-light text-ink tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-sm font-light text-ash">
            Monitor agent performance and live execution data.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Top Row: Trading Ledger */}
        <MetricsLedger />

        {/* Bottom Row: Recent Executions & System Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[500px]">
          <div className="h-full flex flex-col min-h-0">
            <AgentLogs />
          </div>
          <div className="h-full flex flex-col min-h-0">
            <SystemLogs />
          </div>
        </div>
      </div>
    </div>
  );
}
