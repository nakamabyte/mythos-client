"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { X, TrendingUp, TrendingDown, CheckCircle2, Info } from "lucide-react";
import { AppNotification } from "./NavNotifications";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener("click", initAudio, { once: true });
    return () => window.removeEventListener("click", initAudio);
  }, []);

  const playSound = (type: string) => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();

    try {
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);

      const now = audioCtxRef.current.currentTime;

      if (type === "TRADE_OPEN") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      } else {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.15);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      }
    } catch (err) {
      console.error("Audio playback failed", err);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("toast_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "system_logs",
          filter: "module=eq.notification"
        },
        (payload) => {
          const newNotif = payload.new as AppNotification;
          setToasts((prev) => [...prev, newNotif]);
          playSound(newNotif.details?.type || "SYSTEM");

          // Auto dismiss
          setTimeout(() => {
            setToasts((prev) => prev.filter((n) => n.id !== newNotif.id));
          }, 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-16 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const type = toast.details?.type || 'SYSTEM';
          const isProfit = type === 'TRADE_CLOSE' && toast.details?.pnl >= 0;
          const title = toast.message.split(' - ')[0];
          const msg = toast.message.split(' - ')[1] || toast.message;
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex w-80 bg-white border border-hairline-soft shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl overflow-hidden backdrop-blur-md"
            >
              {/* Colored Side Bar */}
              <div 
                className={`w-1.5 shrink-0 ${
                  type === 'TRADE_OPEN' ? 'bg-blue-500' :
                  isProfit ? 'bg-[#00a86b]' : 'bg-red-500'
                }`} 
              />
              
              <div className="flex-1 p-4 flex gap-4">
                {/* Icon */}
                <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  type === 'TRADE_OPEN' ? 'bg-zinc-100 text-stone' :
                  isProfit ? 'bg-[#00d084]/20 text-[#00a86b]' : 'bg-red-100 text-red-600'
                }`}>
                  {type === 'TRADE_OPEN' ? <TrendingUp size={16} strokeWidth={2.5} /> :
                   type === 'TRADE_CLOSE' ? <CheckCircle2 size={16} strokeWidth={2.5} /> :
                   <Info size={16} strokeWidth={2.5} />}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-ash uppercase font-semibold">
                      {type.replace('_', ' ')}
                    </span>
                    <button 
                      onClick={() => removeToast(toast.id)}
                      className="text-stone hover:text-ink transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="font-display font-bold text-ink text-sm">
                    {title}
                  </div>
                  
                  <div className="text-xs text-stone font-medium mt-1 leading-snug">
                    {msg}
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
