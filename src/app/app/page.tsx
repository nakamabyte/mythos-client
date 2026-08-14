import React from 'react';
import MetricsLedger from "@/components/features/MetricsLedger";
import AgentLogs from "@/components/features/AgentLogs";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
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

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
        <div className="flex flex-col gap-8">
          <MetricsLedger />
          
          <div className="border border-hairline-soft rounded-xl p-6 bg-canvas">
            <h3 className="font-display text-[13px] font-semibold tracking-widest uppercase text-ash mb-4">
              System Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11.5px] font-display font-medium text-ink mb-1.5">
                  <span>Data Ingestion</span>
                  <span className="text-accent-deep">100%</span>
                </div>
                <div className="h-1.5 w-full bg-hairline-soft rounded-full overflow-hidden">
                  <div className="h-full bg-accent-deep rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11.5px] font-display font-medium text-ink mb-1.5">
                  <span>LLM API Quota</span>
                  <span className="text-ink">45%</span>
                </div>
                <div className="h-1.5 w-full bg-hairline-soft rounded-full overflow-hidden">
                  <div className="h-full bg-ink rounded-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <AgentLogs />
        </div>
      </div>
    </div>
  );
}
