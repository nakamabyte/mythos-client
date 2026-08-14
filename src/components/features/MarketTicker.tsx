"use client";

import React from 'react';
import { motion } from 'framer-motion';

const markets = [
  {
    symbol: "BTCUSDT",
    baseCoin: "BTC",
    coinId: "bitcoin",
    logo: "https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png",
  },
  {
    symbol: "ETHUSDT",
    baseCoin: "ETH",
    coinId: "ethereum",
    logo: "https://coin-images.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    symbol: "SOLUSDT",
    baseCoin: "SOL",
    coinId: "solana",
    logo: "https://coin-images.coingecko.com/coins/images/4128/small/solana.png",
  },
  {
    symbol: "XRPUSDT",
    baseCoin: "XRP",
    coinId: "ripple",
    logo: "https://coin-images.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
  },
  {
    symbol: "DOGEUSDT",
    baseCoin: "DOGE",
    coinId: "dogecoin",
    logo: "https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png",
  },
  {
    symbol: "BNBUSDT",
    baseCoin: "BNB",
    coinId: "binancecoin",
    logo: "https://coin-images.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    symbol: "ADAUSDT",
    baseCoin: "ADA",
    coinId: "cardano",
    logo: "https://coin-images.coingecko.com/coins/images/975/small/cardano.png",
  },
  {
    symbol: "AVAXUSDT",
    baseCoin: "AVAX",
    coinId: "avalanche-2",
    logo: "https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  },
  {
    symbol: "LINKUSDT",
    baseCoin: "LINK",
    coinId: "chainlink",
    logo: "https://coin-images.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  },
  {
    symbol: "SUIUSDT",
    baseCoin: "SUI",
    coinId: "sui",
    logo: "https://coin-images.coingecko.com/coins/images/26375/small/sui_asset.jpeg",
  },
  {
    symbol: "TRXUSDT",
    baseCoin: "TRX",
    coinId: "tron",
    logo: "https://coin-images.coingecko.com/coins/images/1094/small/tron-logo.png",
  },
  {
    symbol: "PEPEUSDT",
    baseCoin: "PEPE",
    coinId: "pepe",
    logo: "https://coin-images.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
  },
];

export default function MarketTicker() {
  return (
    <div className="w-full border-b border-hairline-soft overflow-hidden bg-zinc-50/30 py-8">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
         <span className="text-xs font-mono tracking-widest text-ash whitespace-nowrap uppercase">
           Live Execution Markets
         </span>
         
         <div className="flex-1 overflow-hidden relative flex items-center [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div 
               animate={{ x: [0, -3000] }}
               transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
               className="flex gap-12 md:gap-24 items-center whitespace-nowrap"
            >
              {/* Render the list multiple times to create an infinite loop effect */}
              {[...markets, ...markets, ...markets].map((market, idx) => (
                <div key={idx} className="font-display font-bold text-xl md:text-2xl text-stone tracking-wider flex items-center gap-3 group/logo">
                  
                  {/* Real Logo Container */}
                  <div className="w-8 h-8 rounded-full border border-stone/20 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                    <img 
                      src={market.logo} 
                      alt={market.baseCoin} 
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        // Fallback letter if image is not uploaded yet
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-[10px] text-ash">${market.baseCoin.charAt(0)}</span>`;
                      }}
                    />
                  </div>

                  {market.symbol}
                </div>
              ))}
            </motion.div>
         </div>
      </div>
    </div>
  );
}
