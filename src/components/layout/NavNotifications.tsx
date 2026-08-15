"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Target, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export type AppNotification = {
  id: string;
  created_at: string;
  message: string;
  details: any;
  is_read?: boolean;
};

export default function NavNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mythos_last_read_timestamp');
    if (saved) setLastReadTimestamp(Number(saved));

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('system_logs')
        .select('*')
        .eq('module', 'notification')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        setNotifications(data.map(n => ({
          ...n,
          is_read: new Date(n.created_at).getTime() <= Number(saved || 0)
        })));
      }
    };
    fetchNotifications();

    const channel = supabase
      .channel('nav_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_logs', filter: "module=eq.notification" },
        (payload) => {
          setNotifications((prev) => {
            const newNotif = { ...payload.new as AppNotification, is_read: false };
            return [newNotif, ...prev].slice(0, 20);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllAsRead = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    localStorage.setItem('mythos_last_read_timestamp', now.toString());
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const getIcon = (type: string, isProfit?: boolean) => {
    switch (type) {
      case 'TRADE_OPEN': return <Target size={14} strokeWidth={2.5} className="text-stone" />;
      case 'TRADE_CLOSE': return isProfit ? <ArrowUpRight size={15} strokeWidth={2.5} className="text-[#00a86b]" /> : <ArrowDownRight size={15} strokeWidth={2.5} className="text-red-500" />;
      default: return <Activity size={14} strokeWidth={2.5} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) markAllAsRead();
        }}
        className="relative p-2 text-charcoal hover:text-ink transition-colors flex items-center justify-center rounded-lg hover:bg-zinc-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-deep rounded-full border-2 border-canvas" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-[340px] bg-white/90 backdrop-blur-xl border border-hairline-soft shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl overflow-hidden z-50 flex flex-col">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-hairline-soft/50 bg-zinc-50/50">
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.2em] text-ink/70">Execution Feed</span>
          </div>
          
          <div className="flex-1 max-h-[400px] overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-stone text-xs">No notifications yet.</div>
            ) : (
              notifications.map((notif) => {
                const type = notif.details?.type || 'SYSTEM';
                const isProfit = type === 'TRADE_CLOSE' && notif.details?.pnl >= 0;
                const title = notif.message.split(' - ')[0];
                const msg = notif.message.split(' - ')[1] || notif.message;
                
                return (
                  <div 
                    key={notif.id}
                    className={`px-5 py-4 border-b border-hairline-soft/30 flex gap-3.5 transition-colors ${notif.is_read ? 'hover:bg-zinc-50/50' : 'bg-accent/5 hover:bg-accent/10'}`}
                  >
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${
                      type === 'TRADE_OPEN' ? 'bg-zinc-50 border-zinc-200' :
                      type === 'TRADE_CLOSE' ? (isProfit ? 'bg-[#00a86b]/5 border-[#00a86b]/20 shadow-[#00a86b]/5' : 'bg-red-500/5 border-red-500/20 shadow-red-500/5') :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      {getIcon(type, isProfit)}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-display font-semibold text-[13px] text-ink">{title}</span>
                        <span className="text-[10px] text-mute font-mono whitespace-nowrap">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[12px] text-stone mt-1 leading-relaxed">
                        {msg}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
