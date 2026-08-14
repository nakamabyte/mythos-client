"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X, TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";

type Notification = {
  id: string;
  type: "OPEN" | "CLOSE";
  symbol: string;
  side: "LONG" | "SHORT";
  price: number;
  qty: number;
  pnl?: number;
  timestamp: number;
};

export default function TradeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction to comply with browser autoplay policies
  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener("click", initAudio, { once: true });
    return () => window.removeEventListener("click", initAudio);
  }, []);

  const playSound = (type: "OPEN" | "CLOSE") => {
    if (!audioCtxRef.current) return;
    
    // Resume context if suspended (browser policy)
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    try {
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);

      const now = audioCtxRef.current.currentTime;

      if (type === "OPEN") {
        // High pitched "ping" for opening a position
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, now); // A5
        oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.1); // Slide up to A6
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      } else {
        // Low pitched "blip" for closing
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, now); // A4
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.15); // Slide down
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      }
    } catch (err) {
      console.error("Audio playback failed", err);
    }
  };

  const addNotification = (notif: Omit<Notification, "id" | "timestamp">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif = { ...notif, id, timestamp: Date.now() };
    
    setNotifications((prev) => [...prev, newNotif]);
    playSound(notif.type);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const channel = supabase
      .channel("trade_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trade_logs",
        },
        (payload) => {
          const newTrade = payload.new;
          if (newTrade.status === "RUNNING") {
            addNotification({
              type: "OPEN",
              symbol: newTrade.symbol,
              side: newTrade.side,
              price: newTrade.entry_price,
              qty: newTrade.position_size || 0,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "trade_logs",
        },
        (payload) => {
          const updatedTrade = payload.new;
          const oldTrade = payload.old;
          
          if (updatedTrade.status === "CLOSED" && oldTrade.status !== "CLOSED") {
            addNotification({
              type: "CLOSE",
              symbol: updatedTrade.symbol,
              side: updatedTrade.side,
              price: updatedTrade.exit_price || updatedTrade.entry_price,
              qty: updatedTrade.position_size || 0,
              pnl: updatedTrade.net_pnl_usd,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const isLong = notif.side === "LONG";
          const isOpen = notif.type === "OPEN";
          const isProfit = (notif.pnl || 0) >= 0;

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex w-80 bg-white border border-hairline-soft shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl overflow-hidden backdrop-blur-md"
            >
              {/* Colored Side Bar */}
              <div 
                className={`w-1.5 shrink-0 ${
                  isOpen 
                    ? (isLong ? "bg-[#00a86b]" : "bg-red-500") 
                    : (isProfit ? "bg-[#00a86b]" : "bg-red-500")
                }`} 
              />
              
              <div className="flex-1 p-4 flex gap-4">
                {/* Icon */}
                <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isOpen 
                    ? "bg-zinc-100 text-stone" 
                    : (isProfit ? "bg-[#00d084]/20 text-[#00a86b]" : "bg-red-100 text-red-600")
                }`}>
                  {isOpen ? (
                    isLong ? <TrendingUp size={16} strokeWidth={2.5} /> : <TrendingDown size={16} strokeWidth={2.5} />
                  ) : (
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-ash uppercase font-semibold">
                      {notif.type} POSITION
                    </span>
                    <button 
                      onClick={() => removeNotification(notif.id)}
                      className="text-stone hover:text-ink transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="font-display font-bold text-ink text-sm flex items-center gap-2">
                    <span className={isLong ? "text-[#00a86b]" : "text-red-500"}>
                      {notif.side}
                    </span>
                    {notif.symbol}
                  </div>
                  
                  <div className="text-xs text-stone font-medium flex items-center justify-between mt-1">
                    <span>
                      {notif.qty.toFixed(4)} @ ${notif.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </span>
                    {!isOpen && notif.pnl !== undefined && (
                      <span className={`font-mono font-bold ${isProfit ? "text-[#00a86b]" : "text-red-500"}`}>
                        {isProfit ? "+" : "-"}${Math.abs(notif.pnl).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
