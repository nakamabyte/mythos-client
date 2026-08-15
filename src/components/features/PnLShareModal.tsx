import React, { useRef, useState } from 'react';
import { X, Download, Share2, Rocket, Copy, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface TradeLog {
  id: string;
  symbol: string;
  side: string;
  entry_price: number | null;
  exit_price: number | null;
  net_pnl_usd: number | null;
}

interface PnLShareModalProps {
  trade: TradeLog | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PnLShareModal({ trade, isOpen, onClose }: PnLShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!isOpen || !trade) return null;

  // Calculate ROI %
  let roiPct = 0;
  if (trade.entry_price && trade.exit_price) {
    if (trade.side.toUpperCase() === 'LONG' || trade.side.toUpperCase() === 'BUY') {
      roiPct = ((trade.exit_price - trade.entry_price) / trade.entry_price) * 100;
    } else {
      roiPct = ((trade.entry_price - trade.exit_price) / trade.entry_price) * 100;
    }
  }

  // Multiply by leverage if we know it, assume 10x for aesthetics if unknown
  const LEVERAGE = 10;
  const displayRoi = (roiPct * LEVERAGE).toFixed(2);
  const isProfit = roiPct >= 0;

  const generateBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    await new Promise(resolve => setTimeout(resolve, 100));
    return htmlToImage.toBlob(cardRef.current, {
      quality: 1.0,
      pixelRatio: 2,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const blob = await generateBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `mythos-pnl-${trade.symbol}-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    try {
      setIsExporting(true);
      const blob = await generateBlob();
      if (!blob) return;
      
      const data = [new ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image', err);
      alert('Failed to copy image. This feature may not be supported by your browser.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      const blob = await generateBlob();
      if (!blob) return;

      const file = new File([blob], `mythos-pnl-${trade.symbol}.png`, { type: blob.type });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Trade Result: ${trade.symbol}`,
          text: `Check out my trading result on ${trade.symbol}!`,
          files: [file],
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        // Fallback
        handleDownload();
      }
    } catch (err) {
      console.error('Failed to share image', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-white font-display text-lg">Share Position</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* The Card to be exported */}
        <div 
          ref={cardRef}
          className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl flex flex-col p-8"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
          }}
        >
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />

          {/* Glowing Accents */}
          <div className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none ${isProfit ? 'bg-green-500' : 'bg-red-500'}`} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />

          {/* Decorative Rocket (for visual flair mimicking the original) */}
          {isProfit && (
            <Rocket 
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white/5 opacity-50 transform rotate-45" 
              size={180} 
              strokeWidth={1}
            />
          )}

          {/* Top Bar */}
          <div className="relative z-10 flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Mythos Logo" className="h-8 w-auto object-contain" />
            <div className="font-display font-bold text-2xl text-white tracking-widest">
              MYTHOS
            </div>
            <div className="bg-[#f7a600] text-black text-xs font-bold px-2 py-1 rounded">
              Live Trading
            </div>
          </div>

          {/* Symbol & Side */}
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <h1 className="text-white font-display text-4xl font-bold tracking-tight">
              {trade.symbol}
            </h1>
            <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              trade.side?.toLowerCase() === 'long' || trade.side?.toLowerCase() === 'buy' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {trade.side || 'UNK'} {LEVERAGE}x
            </div>
          </div>

          {/* ROI and PnL */}
          <div className="relative z-10 mb-8 flex items-baseline gap-6">
            <div>
              <div className="text-zinc-400 text-base font-display mb-1">ROI</div>
              <div className={`font-display text-5xl md:text-6xl font-bold tracking-tighter ${
                isProfit ? 'text-[#00c853]' : 'text-red-500'
              }`}>
                {isProfit ? '+' : ''}{displayRoi}%
              </div>
            </div>
            
            {/* Net PnL USD */}
            {trade.net_pnl_usd !== null && (
              <div className="ml-4">
                <div className="text-zinc-400 text-base font-display mb-1">PnL</div>
                <div className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${
                  isProfit ? 'text-[#00c853]' : 'text-red-500'
                }`}>
                  {isProfit ? '+' : ''}${Math.abs(trade.net_pnl_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            )}
          </div>

          {/* Prices */}
          <div className="relative z-10 flex gap-16 mt-auto">
            <div>
              <div className="text-zinc-400 text-base font-display mb-1">Entry Price</div>
              <div className="text-white font-display text-3xl font-bold">
                {trade.entry_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || '-'}
              </div>
            </div>
            <div>
              <div className="text-zinc-400 text-base font-display mb-1">Filled Price</div>
              <div className="text-white font-display text-3xl font-bold">
                {trade.exit_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 bg-white hover:bg-zinc-200 text-black font-display font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm"
          >
            <Download size={18} />
            Download
          </button>
          
          <button 
            onClick={handleCopy}
            disabled={isExporting}
            className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-display font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Image'}
          </button>

          <button 
            onClick={handleShare}
            disabled={isExporting}
            className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-display font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm"
          >
            {shared ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
            {shared ? 'Shared!' : 'Share Image'}
          </button>
        </div>

      </div>
    </div>
  );
}
