'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { Terminal, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface SystemLog {
  id: string;
  level: string;
  module: string;
  message: string;
  details: any;
  created_at: string;
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch initial logs
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .neq('level', 'error')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setLogs(data.reverse()); // Reverse to put oldest at top, newest at bottom
      }
      setIsLoading(false);
    };

    fetchLogs();

    // 2. Set up realtime subscription
    const channel = supabase
      .channel('system_logs_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_logs' },
        (payload) => {
          const newLog = payload.new as SystemLog;
          if (newLog.level?.toLowerCase() !== 'error') {
            setLogs((current) => [...current, newLog].slice(-50));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (endOfLogsRef.current) {
      endOfLogsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return <AlertCircle size={14} className="text-red-500" />;
      case 'warn': return <AlertTriangle size={14} className="text-amber-500" />;
      case 'info':
      default: return <Info size={14} className="text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-red-500 bg-red-500/10';
      case 'warn': return 'text-amber-500 bg-amber-500/10';
      case 'info':
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="border border-hairline-soft rounded-xl bg-[#0c0c0c] overflow-hidden flex flex-col h-full font-mono">
      <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-[#111]">
        <div className="flex items-center gap-2 text-white/80">
          <Terminal size={16} />
          <h3 className="text-xs font-semibold tracking-wider uppercase">System Terminal</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] text-white/50 uppercase">Connected</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 text-[12px] leading-relaxed text-white/80 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
        {isLoading ? (
          <div className="text-white/40">Loading terminal history...</div>
        ) : logs.length === 0 ? (
          <div className="text-white/40">Waiting for incoming logs...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors group">
              <span className="text-white/30 shrink-0 select-none">[{formatTime(log.created_at)}]</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 self-start ${getLevelColor(log.level)}`}>
                {log.level}
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="break-words">
                  <span className="text-purple-400 font-semibold mr-2">[{log.module}]</span>
                  {log.message}
                </span>
                {log.details && (
                  <pre className="mt-1 text-[10px] text-white/40 bg-black/30 p-2 rounded overflow-x-auto border border-white/5">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
}
