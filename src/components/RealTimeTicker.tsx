"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getRealTimePrices } from '@/lib/api';
import { StockData } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RealTimeTicker() {
  const { watchlist } = useAppStore();
  const [tickerData, setTickerData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (watchlist.length === 0) {
      setTickerData([]);
      return;
    }

    const updateTicker = async () => {
      setIsLoading(true);
      try {
        const symbols = watchlist.map(item => item.symbol);
        const result = await getRealTimePrices(symbols);
        
        if (result.success && result.data) {
          const data = Object.values(result.data);
          setTickerData(data);
        }
      } catch (error) {
        console.error('Error updating ticker:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Update immediately
    updateTicker();

    // Update every 10 seconds for real-time feel
    const interval = setInterval(updateTicker, 10000);

    return () => clearInterval(interval);
  }, [watchlist]);

  const formatPrice = (price: number, symbol: string) => {
    const isIndianStock = symbol.includes('.NS') || symbol.includes('.BO');
    const currency = isIndianStock ? '₹' : '$';
    return `${currency}${price.toFixed(2)}`;
  };

  if (watchlist.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="flex items-center space-x-8 animate-scroll">
        {/* Real-time indicator */}
        <div className="flex items-center space-x-2 text-green-400 min-w-max">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">LIVE</span>
        </div>

        {/* Ticker items */}
        {tickerData.length > 0 ? (
          tickerData.map((stock, index) => (
            <div key={`${stock.symbol}-${index}`} className="flex items-center space-x-2 min-w-max">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-gray-300">{formatPrice(stock.price, stock.symbol)}</span>
              <div className={`flex items-center space-x-1 ${
                stock.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span className="text-sm">{stock.changePercent.toFixed(2)}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center space-x-2 text-gray-400 min-w-max">
            {isLoading ? (
              <>
                <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
                <span className="text-sm">Loading watchlist data...</span>
              </>
            ) : (
              <span className="text-sm">Add stocks to watchlist to see live ticker</span>
            )}
          </div>
        )}

        {/* Repeat for seamless scroll */}
        {tickerData.length > 0 && tickerData.map((stock, index) => (
          <div key={`repeat-${stock.symbol}-${index}`} className="flex items-center space-x-2 min-w-max">
            <span className="font-medium">{stock.symbol}</span>
            <span className="text-gray-300">{formatPrice(stock.price, stock.symbol)}</span>
            <div className={`flex items-center space-x-1 ${
              stock.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stock.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="text-sm">{stock.changePercent.toFixed(2)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
