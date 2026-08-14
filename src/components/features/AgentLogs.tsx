import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { MOCK_AGENT_LOGS } from '@/data/mock';

type LogData = typeof MOCK_AGENT_LOGS[0];

interface AgentLogsProps {
  logs?: LogData[];
}

export default function AgentLogs({ logs = MOCK_AGENT_LOGS }: AgentLogsProps) {
  return (
    <div className="border border-hairline-soft rounded-xl bg-canvas overflow-hidden">
      <div className="px-6 py-5 border-b border-hairline-soft flex justify-between items-center bg-[#fbfcfd]">
        <h3 className="font-display text-[15px] font-semibold text-ink">Recent Executions</h3>
        <Badge variant="outline">Last 24H</Badge>
      </div>
      <div className="divide-y divide-hairline-soft">
        {logs.map((log) => (
          <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-xs font-bold ${log.side === 'BUY' ? 'bg-accent/20 text-accent-deep' : 'bg-red-500/10 text-red-600'}`}>
                {log.side}
              </div>
              <div>
                <div className="font-display text-sm font-semibold text-ink">{log.pair}</div>
                <div className="text-[11px] text-ash mt-0.5">{log.time}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-display text-sm font-medium text-ink tabular-nums">
                {log.amount} @ ${log.price}
              </div>
              {log.pnl && (
                <div className={`text-[11.5px] font-medium tabular-nums mt-0.5 ${log.pnl.startsWith('+') ? 'text-accent-deep' : 'text-red-500'}`}>
                  PnL: {log.pnl}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t border-hairline-soft bg-zinc-50/50 text-center">
        <a href="#" className="font-display text-xs font-semibold text-accent-deep hover:underline">
          View All Logs &rarr;
        </a>
      </div>
    </div>
  );
}
