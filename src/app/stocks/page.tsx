"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Search, Download } from 'lucide-react';

interface IndianStock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector?: string;
  marketCap?: number;
  lastPrice?: number;
}

export default function StocksAdminPage() {
  const [stocks, setStocks] = useState<IndianStock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<IndianStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExchange, setSelectedExchange] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, nse: 0, bse: 0, withSector: 0 });

  const fetchStocks = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const url = `/api/stocks${forceRefresh ? '?refresh=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setStocks(data.data);
        setFilteredStocks(data.data);
        
        // Calculate stats
        const nseCount = data.data.filter((s: IndianStock) => s.exchange === 'NSE').length;
        const bseCount = data.data.filter((s: IndianStock) => s.exchange === 'BSE').length;
        const withSectorCount = data.data.filter((s: IndianStock) => s.sector).length;
        
        setStats({
          total: data.data.length,
          nse: nseCount,
          bse: bseCount,
          withSector: withSectorCount
        });
      }
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    let filtered = stocks;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by exchange
    if (selectedExchange !== 'all') {
      filtered = filtered.filter(stock => stock.exchange === selectedExchange);
    }
    
    setFilteredStocks(filtered);
  }, [searchTerm, selectedExchange, stocks]);

  const downloadCSV = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Exchange', 'Sector', 'Market Cap'],
      ...filteredStocks.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        stock.exchange,
        stock.sector || '',
        stock.marketCap || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stocks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          📈 Indian Stocks Database
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive database of NSE & BSE listed stocks with real-time API integration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Stocks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">NSE Stocks</p>
                <p className="text-3xl font-bold text-green-600">{stats.nse.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                🏛️
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">BSE Stocks</p>
                <p className="text-3xl font-bold text-purple-600">{stats.bse.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                🏢
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">With Sector Info</p>
                <p className="text-3xl font-bold text-orange-600">{stats.withSector.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                🏭
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by symbol, name, or sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="all">All Exchanges</option>
              <option value="NSE">NSE Only</option>
              <option value="BSE">BSE Only</option>
            </select>
            
            <Button
              onClick={() => fetchStocks(true)}
              disabled={loading}
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
            
            <Button onClick={downloadCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Stocks ({filteredStocks.length.toLocaleString()} results)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Symbol</th>
                    <th className="text-left py-3 px-2">Company Name</th>
                    <th className="text-left py-3 px-2">Exchange</th>
                    <th className="text-left py-3 px-2">Sector</th>
                    <th className="text-left py-3 px-2">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.slice(0, 100).map((stock, index) => (
                    <tr key={stock.symbol} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-2">
                        <span className="font-mono font-medium">{stock.symbol}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-medium">{stock.name}</span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={stock.exchange === 'NSE' ? 'default' : 'secondary'}>
                          {stock.exchange}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-gray-600 dark:text-gray-300">
                          {stock.sector || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {stock.marketCap ? (
                          <span className="font-medium">
                            ₹{(stock.marketCap / 10000000).toFixed(0)}Cr
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredStocks.length > 100 && (
                <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Showing first 100 results. Use search to find specific stocks.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
