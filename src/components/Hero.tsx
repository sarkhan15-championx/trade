"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { TrendingUp, Moon, Sun, TrendingDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { getRealTimePrices } from '@/lib/api';
import { StockData } from '@/types';

export default function Hero() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Featured Indian stocks to display
  const featuredStocks = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS'];

  // Fetch real-time data for featured stocks
  useEffect(() => {
    const fetchStockData = async () => {
      if (!mounted) return;
      
      setIsLoading(true);
      try {
        const result = await getRealTimePrices(featuredStocks);
        if (result.success && result.data) {
          const data = Object.values(result.data);
          setStockData(data);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-16 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Trade Navigator
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="relative"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Real-Time Stock
            <span className="text-blue-600 dark:text-blue-400"> Analysis</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Professional trading signals and technical analysis for NSE & BSE stocks. 
            Navigate 2,141+ Indian stocks with confidence-rated recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Trading Analysis
              </Button>
            </Link>
          </div>

          {/* Real-time Indian Stock Data Display */}
          <div className="max-w-4xl mx-auto mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Live Indian Market Data
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stockData.map((stock, index) => (
                  <div key={stock.symbol} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{stock.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{stock.name}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full animate-pulse ${stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(stock.price)}
                      </div>
                      <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Change: {stock.change >= 0 ? '+' : ''}{formatPrice(Math.abs(stock.change))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">95%</div>
            <div className="text-gray-600 dark:text-gray-300">Signal Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2000+</div>
            <div className="text-gray-600 dark:text-gray-300">Indian Stocks Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Real-time NSE/BSE Data</div>
          </div>
        </div>
      </div>
    </div>
  );
}
