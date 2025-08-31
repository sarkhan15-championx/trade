"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store';
import { useTheme } from 'next-themes';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  StarOff, 
  Moon, 
  Sun,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { searchStocks, getStockQuote, getChartData, getCompanyProfile, getRealTimePrices } from '@/lib/api';
import { calculateTechnicalIndicators } from '@/lib/indicators';
import { computeConsensus } from '@/lib/computeConsensus';
import { StockData, TradingSignal, TimeFrame } from '@/types';
import StockChart from './StockChart';
import TradingViewChart from './TradingViewChart';
import AnimatedPrice from './AnimatedPrice';
import RealTimeTicker from './RealTimeTicker';

const timeframes: TimeFrame[] = ['15m', '30m', '1h', '4h', '1d'];

export default function Dashboard() {
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    currentStock,
    setCurrentStock,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    signals,
    setSignal,
    getSignal,
    isLoadingSignals,
    setLoadingSignals,
    isLoadingSearch,
    setLoadingSearch,
  } = useAppStore();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1d');

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial data
  useEffect(() => {
    if (mounted && !currentStock) {
      // Load a default Indian stock
      handleStockSelect('RELIANCE.NS', 'Reliance Industries Limited');
    }
  }, [mounted, currentStock]);

  // Real-time price updates with visual feedback
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!currentStock || !mounted) return;

    const updatePrices = async () => {
      setIsUpdating(true);
      try {
        const watchlistSymbols = watchlist.map(item => item.symbol);
        const symbolsToUpdate = [currentStock.symbol, ...watchlistSymbols];
        
        const result = await getRealTimePrices(symbolsToUpdate);
        if (result.success && result.data && result.data[currentStock.symbol]) {
          // Update current stock if it's in the results
          const updatedStock = result.data[currentStock.symbol];
          setCurrentStock({
            ...currentStock,
            ...updatedStock
          });
          setLastUpdateTime(new Date());
        }
      } catch (error) {
        console.error('Error updating real-time prices:', error);
      } finally {
        setIsUpdating(false);
      }
    };

    // Update immediately
    updatePrices();

    // Set up interval for real-time updates (every 15 seconds for better responsiveness)
    const interval = setInterval(updatePrices, 15000);

    return () => clearInterval(interval);
  }, [currentStock?.symbol, watchlist, mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoadingSearch(true);
    setSearchResults([]); // Clear previous results
    
    try {
      const result = await searchStocks(searchQuery);
      if (result.success && result.data) {
        setSearchResults(result.data);
        if (result.data.length === 0) {
          console.log('No stocks found for query:', searchQuery);
        }
      } else {
        console.error('Search failed:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleStockSelect = async (symbol: string, name: string) => {
    setLoadingSignals(true);
    try {
      // Get company profile for better name
      const profileResult = await getCompanyProfile(symbol);
      const companyName = profileResult.success && profileResult.data ? profileResult.data.name : name;

      // Get stock quote
      const quoteResult = await getStockQuote(symbol);
      if (quoteResult.success && quoteResult.data) {
        const stockData = { ...quoteResult.data, name: companyName };
        setCurrentStock(stockData);

        // Clear search results after selection
        setSearchResults([]);
        setSearchQuery('');

        // Generate signals for all timeframes (do this in background)
        Promise.all(
          timeframes.map(async (timeframe) => {
            try {
              const chartResult = await getChartData(symbol, timeframe);
              if (chartResult.success && chartResult.data) {
                const indicators = calculateTechnicalIndicators(chartResult.data);
                const signal = computeConsensus(stockData, indicators, chartResult.data, timeframe);
                setSignal(signal);
              }
            } catch (error) {
              console.error(`Error loading ${timeframe} data for ${symbol}:`, error);
            }
          })
        );
      } else {
        console.error('Failed to get stock quote:', quoteResult.error);
      }
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setLoadingSignals(false);
    }
  };

  const toggleWatchlist = (stock: StockData) => {
    if (isInWatchlist(stock.symbol)) {
      removeFromWatchlist(stock.symbol);
    } else {
      addToWatchlist({
        symbol: stock.symbol,
        name: stock.name,
        addedAt: Date.now(),
      });
    }
  };

  const getSignalColor = (signal: 'BUY' | 'SELL' | 'NEUTRAL') => {
    switch (signal) {
      case 'BUY': return 'bg-green-100 text-green-800 border-green-200';
      case 'SELL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const currentSignal = currentStock ? getSignal(currentStock.symbol, selectedTimeframe) : null;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  Trade Navigator
                </span>
              </Link>
              
              {currentStock && (
                <div className="hidden md:flex items-center space-x-4 ml-8">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentStock.symbol}
                  </span>
                  <AnimatedPrice
                    price={currentStock.price}
                    change={currentStock.change}
                    changePercent={currentStock.changePercent}
                    symbol={currentStock.symbol}
                    className="scale-75"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Search stocks... (e.g., AAPL, RELIANCE.NS)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-64"
                  disabled={isLoadingSearch}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isLoadingSearch || !searchQuery.trim()}
                  size="sm"
                >
                  {isLoadingSearch ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Real-time Status Indicator */}
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`flex items-center space-x-1 ${isUpdating ? 'text-blue-600' : 'text-green-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="hidden md:inline">
                      {isUpdating ? 'Updating...' : 'Live'}
                    </span>
                  </div>
                  {lastUpdateTime && !isUpdating && (
                    <span className="text-gray-500 text-xs hidden lg:inline">
                      Last: {lastUpdateTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Ticker */}
      <RealTimeTicker />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Results */}
            {searchQuery && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Search Results for "{searchQuery}"</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      Clear
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingSearch ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span className="ml-2">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((stock) => (
                        <div
                          key={stock.symbol}
                          className="stock-item flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
                          onClick={() => handleStockSelect(stock.symbol, stock.name)}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {stock.name}
                            </div>
                            {stock.price > 0 && (
                              <div className="text-sm text-gray-500">
                                {stock.symbol.includes('.NS') || stock.symbol.includes('.BO') ? '₹' : '$'}
                                {stock.price.toFixed(2)}
                                {stock.changePercent !== 0 && (
                                  <span className={`ml-2 ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWatchlist(stock);
                              }}
                            >
                              {isInWatchlist(stock.symbol) ? (
                                <Star className="h-4 w-4 fill-current text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery && !isLoadingSearch ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-lg mb-2">No stocks found</div>
                      <div className="text-sm">
                        Try searching for:
                        <br />
                        • US stocks: AAPL, GOOGL, TSLA, MSFT
                        <br />
                        • Indian stocks: RELIANCE.NS, TCS.NS, INFY.NS
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Chart */}
            {currentStock && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{currentStock.symbol}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWatchlist(currentStock)}
                      >
                        {isInWatchlist(currentStock.symbol) ? (
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </CardTitle>
                    <Tabs value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as TimeFrame)}>
                      <TabsList>
                        {timeframes.map((tf) => (
                          <TabsTrigger key={tf} value={tf}>{tf}</TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <TradingViewChart 
                    symbol={currentStock.symbol} 
                    timeframe={selectedTimeframe}
                  />
                </CardContent>
              </Card>
            )}

            {/* Signal Details */}
            {currentSignal && (
              <Card>
                <CardHeader>
                  <CardTitle>Signal Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Technical Indicators</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>RSI:</span>
                          <span>{currentSignal.indicators.rsi.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>MACD:</span>
                          <span>{currentSignal.indicators.macd.macd.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>EMA 12:</span>
                          <span>{currentSignal.indicators.ema['12'].toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SMA 50:</span>
                          <span>{currentSignal.indicators.sma['50'].toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Signal Reasons</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {currentSignal.reasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Signal */}
            {currentSignal && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Signal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 mb-4 ${getSignalColor(currentSignal.signal)}`}
                  >
                    {currentSignal.signal}
                  </Badge>
                  <div className="text-3xl font-bold mb-2">
                    {currentSignal.signal === 'NEUTRAL' ? 'N/A' : `${currentSignal.confidence}%`}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {currentSignal.signal === 'NEUTRAL' ? 'No Clear Signal' : 'Confidence Level'}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {selectedTimeframe} timeframe
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Timeframes */}
            {currentStock && (
              <Card>
                <CardHeader>
                  <CardTitle>All Timeframes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeframes.map((tf) => {
                      const signal = getSignal(currentStock.symbol, tf);
                      return (
                        <div key={tf} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{tf}</span>
                          {signal ? (
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline"
                                className={getSignalColor(signal.signal)}
                              >
                                {signal.signal}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {signal.signal === 'NEUTRAL' ? 'N/A' : `${signal.confidence}%`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Loading...</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Watchlist */}
            <Card>
              <CardHeader>
                <CardTitle>Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                {watchlist.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No stocks in watchlist
                  </p>
                ) : (
                  <div className="space-y-2">
                    {watchlist.map((item) => (
                      <div
                        key={item.symbol}
                        className="flex items-center justify-between p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleStockSelect(item.symbol, item.name)}
                      >
                        <div>
                          <div className="font-medium text-sm">{item.symbol}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            {item.name}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist(item.symbol);
                          }}
                        >
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
