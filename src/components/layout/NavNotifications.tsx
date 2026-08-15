"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Check, TrendingUp, TrendingDown, Info } from "lucide-react";

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
      case 'TRADE_OPEN': return <TrendingUp size={16} className="text-stone" />;
      case 'TRADE_CLOSE': return isProfit ? <Check size={16} className="text-[#00a86b]" /> : <TrendingDown size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-hairline-soft shadow-xl rounded-xl overflow-hidden z-50 flex flex-col">
          <div className="flex justify-between items-center p-3 border-b border-hairline-soft bg-zinc-50">
            <span className="font-display font-semibold text-sm">Notifications</span>
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
                    className={`p-3 border-b border-hairline-soft flex gap-3 transition-colors ${notif.is_read ? 'bg-white opacity-80' : 'bg-blue-50/30'}`}
                  >
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      type === 'TRADE_OPEN' ? 'bg-zinc-100' :
                      type === 'TRADE_CLOSE' ? (isProfit ? 'bg-[#00d084]/20' : 'bg-red-100') :
                      'bg-blue-100'
                    }`}>
                      {getIcon(type, isProfit)}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs text-ink">{title}</span>
                      </div>
                      <span className="text-[11px] text-stone mt-0.5 leading-snug">
                        {msg}
                      </span>
                      <span className="text-[9px] text-mute mt-2">
                        {new Date(notif.created_at).toLocaleTimeString()}
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
