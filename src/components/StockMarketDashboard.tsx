"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import TradingSignalsPanel from '@/components/TradingSignalsPanel';

interface Stock {
  symbol: string;
  name: string;
  exchange: string;
}

interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  currency: string;
  exchange: string;
  lastUpdated: string;
}

interface MarketOverview {
  gainers: StockPrice[];
  losers: StockPrice[];
  mostActive: StockPrice[];
}

export default function StockMarketDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<StockPrice[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signalsPanelOpen, setSignalsPanelOpen] = useState(false);
  const [selectedStockForSignals, setSelectedStockForSignals] = useState<StockPrice | null>(null);

  // Load market overview on component mount
  useEffect(() => {
    loadMarketOverview();
  }, []);

  // Auto-refresh selected stocks prices every 30 seconds
  useEffect(() => {
    if (selectedStocks.length === 0) return;

    const refreshPrices = async () => {
      try {
        const symbols = selectedStocks.map(s => s.symbol);
        const response = await fetch('/api/stocks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbols }),
        });

        if (response.ok) {
          const updatedPrices = await response.json();
          setSelectedStocks(updatedPrices);
        }
      } catch (error) {
        console.error('Error refreshing stock prices:', error);
      }
    };

    // Refresh immediately
    refreshPrices();

    // Set up interval for auto-refresh every 30 seconds
    const interval = setInterval(refreshPrices, 30000);

    return () => clearInterval(interval);
  }, [selectedStocks.length]);

  const loadMarketOverview = async () => {
    try {
      const response = await fetch('/api/market-overview?market=India');
      if (response.ok) {
        const data = await response.json();
        setMarketOverview(data);
      }
    } catch (error) {
      console.error('Error loading market overview:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = async (stock: Stock) => {
    try {
      // Check if stock is already selected
      if (selectedStocks.find(s => s.symbol === stock.symbol)) {
        return;
      }

      setIsLoading(true);
      
      const response = await fetch('/api/stocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols: [stock.symbol] }),
      });

      if (response.ok) {
        const prices = await response.json();
        if (prices.length > 0 && prices[0].price > 0) {
          setSelectedStocks(prev => [...prev, prices[0]]);
        } else {
          // Show error if no real-time data available
          alert(`Sorry, real-time data is currently unavailable for ${stock.name}. Please try another stock.`);
        }
      } else {
        alert(`Failed to fetch real-time data for ${stock.name}. Please try again later.`);
      }
    } catch (error) {
      console.error('Error getting stock price:', error);
      alert(`Error fetching data for ${stock.name}. Please check your connection and try again.`);
    } finally {
      setIsLoading(false);
    }

    // Clear search
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks(prev => prev.filter(s => s.symbol !== symbol));
  };

  const openTradingSignals = (stock: StockPrice) => {
    setSelectedStockForSignals(stock);
    setSignalsPanelOpen(true);
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency === 'INR' ? '₹' : '$'}${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number, currency: string) => {
    const sign = change >= 0 ? '+' : '';
    const priceChange = `${sign}${currency === 'INR' ? '₹' : '$'}${change.toFixed(2)}`;
    const percentChange = `${sign}${changePercent.toFixed(2)}%`;
    return `${priceChange} (${percentChange})`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Indian Stock Market Dashboard</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>Live Prices</span>
          </div>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Indian Stocks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Search stocks by name or symbol (e.g., TCS, Reliance, HDFC)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-700">Search Results:</h4>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {searchResults.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleStockSelect(stock)}
                    >
                      <div>
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-gray-500">{stock.symbol} • {stock.exchange}</div>
                      </div>
                      <Button size="sm" variant="outline">Add</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Stocks - Main Dashboard */}
        {selectedStocks.length > 0 ? (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl">My Selected Stocks ({selectedStocks.length})</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Live Prices in INR
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedStocks.map((stock) => (
                  <div key={stock.symbol} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow relative">
                    <button
                      onClick={() => removeStock(stock.symbol)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 text-lg font-bold"
                      title="Remove from watchlist"
                    >
                      ×
                    </button>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-lg text-gray-900">{stock.name}</div>
                        <div className="text-sm text-gray-500 flex items-center justify-between">
                          <span>{stock.symbol}</span>
                          <Badge variant="outline" className="text-xs">{stock.exchange}</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-gray-900">
                          ₹{stock.price.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                        
                        <div className={`text-lg font-semibold flex items-center ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {formatChange(stock.change, stock.changePercent, stock.currency)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
                        <div>
                          <div className="text-gray-500">Volume</div>
                          <div className="font-medium">{stock.volume.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Market Cap</div>
                          <div className="font-medium">₹{stock.marketCap.toLocaleString('en-IN')} Cr</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 flex items-center justify-between pt-2 border-t">
                        <span>Last updated: {new Date(stock.lastUpdated).toLocaleTimeString('en-IN')}</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live</span>
                          </div>
                          {/* Real data indicator */}
                          <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                            Real-time
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Trading Signals Button */}
                      <Button 
                        onClick={() => openTradingSignals(stock)}
                        className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Trading Signals
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700">
                  <strong>💡 Tip:</strong> Prices refresh automatically every 30 seconds. All prices are shown in Indian Rupees (INR).
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200 bg-gray-50/30">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="text-6xl">📈</div>
                <div className="text-xl font-semibold text-gray-600">No Stocks Selected</div>
                <div className="text-gray-500 max-w-md mx-auto">
                  Search for Indian stocks above and click "Add" to track their live prices in INR. 
                  Your selected stocks will appear here with real-time updates.
                </div>
                <div className="text-sm text-gray-400">
                  Try searching: TCS, Reliance, HDFC Bank, Infosys, Tata Motors
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Overview */}
        {marketOverview && (
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Top Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  <span>Top Gainers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketOverview.gainers.map((stock) => (
                    <div key={stock.symbol} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{stock.symbol}</div>
                          <div className="text-xs text-gray-500 truncate">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            {formatPrice(stock.price, stock.currency)}
                          </div>
                          <div className="text-xs text-green-600 font-medium">
                            +{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => openTradingSignals(stock)}
                        className="w-full mt-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                        size="sm"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Signals
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <TrendingDown className="w-5 h-5" />
                  <span>Top Losers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketOverview.losers.map((stock) => (
                    <div key={stock.symbol} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{stock.symbol}</div>
                          <div className="text-xs text-gray-500 truncate">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            {formatPrice(stock.price, stock.currency)}
                          </div>
                          <div className="text-xs text-red-600 font-medium">
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => openTradingSignals(stock)}
                        className="w-full mt-2 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Signals
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Active */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <Activity className="w-5 h-5" />
                  <span>Most Active</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketOverview.mostActive.map((stock) => (
                    <div key={stock.symbol} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{stock.symbol}</div>
                          <div className="text-xs text-gray-500 truncate">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            {formatPrice(stock.price, stock.currency)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Vol: {(stock.volume / 1000).toFixed(0)}K
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => openTradingSignals(stock)}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        size="sm"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Signals
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
      
      {/* Trading Signals Panel */}
      {selectedStockForSignals && (
        <TradingSignalsPanel
          stockPrice={selectedStockForSignals}
          isOpen={signalsPanelOpen}
          onClose={() => {
            setSignalsPanelOpen(false);
            setSelectedStockForSignals(null);
          }}
        />
      )}
    </div>
  );
}
