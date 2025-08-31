"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getRealTimePrices } from '@/lib/api';
import { StockData } from '@/types';

// Popular Indian stocks to show in the live ticker - now using hardcoded list to avoid API calls
const popularSymbols = [
  'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 
  'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'HINDUNILVR.NS', 'LT.NS',
  'ASIANPAINT.NS', 'MARUTI.NS', 'KOTAKBANK.NS', 'AXISBANK.NS', 'WIPRO.NS',
  'BAJFINANCE.NS', 'NESTLEIND.NS', 'ULTRACEMCO.NS', 'POWERGRID.NS', 'NTPC.NS',
  'TECHM.NS', 'TATAMOTORS.NS', 'TITAN.NS', 'ADANIPORTS.NS', 'COALINDIA.NS'
];

export default function LiveTicker() {
  const [tickers, setTickers] = useState<StockData[]>([]);
  const [flashingIndices, setFlashingIndices] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLiveData = async () => {
      setIsLoading(true);
      try {
        const result = await getRealTimePrices(popularSymbols);
        if (result.success && result.data) {
          const liveData = Object.values(result.data);
          setTickers(liveData);
        }
      } catch (error) {
        console.error('Error loading live ticker data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial data
    loadLiveData();

    // Update every 30 seconds for live data
    const interval = setInterval(loadLiveData, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, symbol: string) => {
    const isIndianStock = symbol.includes('.NS') || symbol.includes('.BO');
    const currency = isIndianStock ? '₹' : '$';
    return `${currency}${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toString();
  };

  const visibleTickers = tickers.slice(0, 6);

  if (isLoading && tickers.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Live Market Data
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Loading real-time stock prices from global markets...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live Market Data
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time Indian stock prices and signals from NSE & BSE markets. See our analysis in action.
          </p>
        </div>

        {/* Scrolling Ticker */}
        <div className="mb-12 overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 rounded-xl shadow-2xl border border-blue-500/20">
          <div className="flex animate-scroll whitespace-nowrap py-4 px-2">
            {/* Real-time indicator */}
            <div className="inline-flex items-center mx-8 text-emerald-400">
              <Activity className="h-5 w-5 mr-3 animate-pulse" />
              <span className="text-sm font-bold tracking-wide">🇮🇳 LIVE NSE/BSE MARKET DATA</span>
            </div>
            
            {/* Ticker items - duplicate for seamless loop */}
            {[...tickers, ...tickers].map((ticker, index) => (
              <div 
                key={`ticker-${index}`} 
                className="inline-flex items-center mx-8 transition-all duration-300 hover:scale-105"
              >
                <span className="font-bold text-white mr-3 text-lg">
                  {ticker.symbol.replace('.NS', '')}
                </span>
                <span className="text-gray-200 mr-3 font-semibold">
                  {formatPrice(ticker.price, ticker.symbol)}
                </span>
                <div className={`flex items-center mr-4 px-2 py-1 rounded-full text-sm font-medium ${
                  ticker.change >= 0 
                    ? 'text-emerald-300 bg-emerald-500/20' 
                    : 'text-red-300 bg-red-500/20'
                }`}>
                  {ticker.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {ticker.change >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                  </span>
                </div>
                {ticker.volume && (
                  <span className="text-blue-300 text-sm font-medium">
                    Vol: {formatVolume(ticker.volume)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {visibleTickers.map((ticker, index) => (
            <Card 
              key={`featured-${ticker.symbol}`} 
              className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 stock-item bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {ticker.symbol.replace('.NS', '').substring(0, 2)}
                    </div>
                    <div>
                      <span className="text-xl font-bold block">{ticker.symbol.replace('.NS', '')}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">NSE</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    <Badge variant="outline" className="text-xs font-semibold border-emerald-500 text-emerald-600 dark:text-emerald-400">
                      LIVE
                    </Badge>
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate font-medium">
                  {ticker.name || 'Indian Stock Exchange'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(ticker.price, ticker.symbol)}
                  </span>
                  <div className={`flex items-center px-3 py-2 rounded-lg font-semibold ${
                    ticker.change >= 0 
                      ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30' 
                      : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                  }`}>
                    {ticker.change >= 0 ? (
                      <TrendingUp className="h-5 w-5 mr-2" />
                    ) : (
                      <TrendingDown className="h-5 w-5 mr-2" />
                    )}
                    <span className="text-lg">
                      {ticker.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Day Change:</span>
                    <span className={`font-bold ${ticker.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {ticker.change >= 0 ? '+' : ''}{formatPrice(Math.abs(ticker.change), ticker.symbol)}
                    </span>
                  </div>
                  {ticker.volume && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Volume:</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {formatVolume(ticker.volume)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Market Sentiment:</span>
                    <Badge 
                      variant="outline" 
                      className={`font-semibold ${
                        ticker.change >= 0 
                          ? 'text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-300 dark:border-emerald-600 dark:bg-emerald-900/20' 
                          : 'text-red-700 border-red-300 bg-red-50 dark:text-red-300 dark:border-red-600 dark:bg-red-900/20'
                      }`}
                    >
                      {ticker.change >= 0 ? '🐂 Bullish' : '🐻 Bearish'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
