"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineStyle, CrosshairMode, UTCTimestamp } from 'lightweight-charts';
import { getChartData, getStockQuote } from '@/lib/api';
import { ChartData, TimeFrame } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, BarChart3, LineChart as LineChartIcon, Activity, Volume2 } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
  timeframe: TimeFrame;
}

interface PriceStats {
  firstPrice: number;
  lastPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
}

export default function TradingViewChart({ symbol, timeframe }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [priceStats, setPriceStats] = useState<PriceStats | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280',
      },
      grid: {
        vertLines: { color: '#374151', style: LineStyle.Dotted },
        horzLines: { color: '#374151', style: LineStyle.Dotted },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#6b7280', labelBackgroundColor: '#1f2937' },
        horzLine: { color: '#6b7280', labelBackgroundColor: '#1f2937' },
      },
      rightPriceScale: {
        borderColor: '#374151',
        textColor: '#6b7280',
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  // Format price for display
  const formatPrice = (price: number) => {
    const isIndianStock = symbol.includes('.NS') || symbol.includes('.BO');
    const currency = isIndianStock ? '₹' : '$';
    const decimals = isIndianStock ? 2 : 2;
    
    return `${currency}${price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  };

  // Real-time data fetching
  const fetchChartData = useCallback(async () => {
    try {
      const result = await getChartData(symbol, timeframe);
      if (result.success && result.data) {
        setChartData(result.data);
        setLastUpdate(new Date());
        
        // Calculate price statistics
        const prices = result.data.map(d => d.close);
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const change = lastPrice - firstPrice;
        const changePercent = (change / firstPrice) * 100;
        const high = Math.max(...prices);
        const low = Math.min(...prices);
        
        setPriceStats({
          firstPrice,
          lastPrice,
          change,
          changePercent,
          high,
          low,
          isPositive: change >= 0
        });
      } else {
        console.error('Failed to load chart data:', result.error);
        setChartData([]);
        setPriceStats(null);
      }
    } catch (error) {
      console.error('Chart data error:', error);
      setChartData([]);
      setPriceStats(null);
    }
  }, [symbol, timeframe]);

  // Update chart series data
  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    // Clear existing series
    if (candlestickSeriesRef.current) {
      chartRef.current.removeSeries(candlestickSeriesRef.current);
      candlestickSeriesRef.current = null;
    }
    if (lineSeriesRef.current) {
      chartRef.current.removeSeries(lineSeriesRef.current);
      lineSeriesRef.current = null;
    }
    if (volumeSeriesRef.current) {
      chartRef.current.removeSeries(volumeSeriesRef.current);
      volumeSeriesRef.current = null;
    }

    // Prepare data with correct types
    const formattedData = chartData.map(d => ({
      time: (Math.floor(d.timestamp / 1000)) as UTCTimestamp,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const lineData = chartData.map(d => ({
      time: (Math.floor(d.timestamp / 1000)) as UTCTimestamp,
      value: d.close,
    }));

    const volumeData = chartData.map(d => ({
      time: (Math.floor(d.timestamp / 1000)) as UTCTimestamp,
      value: d.volume,
      color: d.close >= d.open ? '#10b981' : '#ef4444',
    }));

    // Add volume series first (background)
    if (showVolume) {
      const volumeSeries = chartRef.current.addHistogramSeries({
        color: '#6b7280',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });
      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;

      // Configure volume price scale
      chartRef.current.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });
    }

    // Add main price series
    if (chartType === 'candlestick') {
      const candlestickSeries = chartRef.current.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
      candlestickSeries.setData(formattedData);
      candlestickSeriesRef.current = candlestickSeries;
    } else {
      const lineSeries = chartRef.current.addLineSeries({
        color: priceStats?.isPositive ? '#10b981' : '#ef4444',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      });
      lineSeries.setData(lineData);
      lineSeriesRef.current = lineSeries;
    }

    // Fit content
    chartRef.current.timeScale().fitContent();

  }, [chartData, chartType, showVolume, priceStats]);

  // Update latest price for real-time feel
  const updateLatestPrice = useCallback(async () => {
    if (chartData.length === 0) return;
    
    try {
      const quoteResult = await getStockQuote(symbol);
      if (quoteResult.success && quoteResult.data) {
        const newPrice = quoteResult.data.price;
        
        setChartData(prevData => {
          const newData = [...prevData];
          if (newData.length > 0) {
            const latestIndex = newData.length - 1;
            newData[latestIndex] = {
              ...newData[latestIndex],
              close: newPrice,
              high: Math.max(newData[latestIndex].high, newPrice),
              low: Math.min(newData[latestIndex].low, newPrice)
            };
          }
          return newData;
        });
        
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to update latest price:', error);
    }
  }, [symbol, chartData]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchChartData().finally(() => setLoading(false));
  }, [fetchChartData]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeframe === '1d') {
        fetchChartData();
      } else {
        updateLatestPrice();
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [fetchChartData, updateLatestPrice, timeframe]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading TradingView chart...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <div className="h-96 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-lg mb-2">No chart data available</div>
          <div className="text-sm text-center">
            Try selecting a different timeframe or check your internet connection
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Chart Header with Stats */}
      {priceStats && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {symbol}
              </h3>
              <div className={`flex items-center space-x-1 ${priceStats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {priceStats.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : priceStats.change === 0 ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {formatPrice(Math.abs(priceStats.change))} ({priceStats.changePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <Activity className="h-3 w-3" />
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-4 w-4 mr-1" />
                Line
              </Button>
              <Button
                variant={chartType === 'candlestick' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('candlestick')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Candles
              </Button>
              <Button
                variant={showVolume ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowVolume(!showVolume)}
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Volume
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Current: </span>
              <span className="font-medium">{formatPrice(priceStats.lastPrice)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">High: </span>
              <span className="font-medium">{formatPrice(priceStats.high)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Low: </span>
              <span className="font-medium">{formatPrice(priceStats.low)}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Change: </span>
              <span className={`font-medium ${priceStats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {priceStats.isPositive ? '+' : ''}{formatPrice(priceStats.change)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TradingView Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="h-96 w-full border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </Card>
  );
}
