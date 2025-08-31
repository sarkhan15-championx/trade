"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Brush,
  ComposedChart,
  Bar
} from 'recharts';
import { getChartData, getStockQuote } from '@/lib/api';
import { ChartData, TimeFrame } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, BarChart3, LineChart as LineChartIcon, Activity } from 'lucide-react';

interface StockChartProps {
  symbol: string;
  timeframe: TimeFrame;
}

interface CandlestickData extends ChartData {
  formattedTime: string;
  index: number;
  bodyHeight: number;
  isPositive: boolean;
  wickTop: number;
  wickBottom: number;
}

export default function StockChart({ symbol, timeframe }: StockChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area' | 'candlestick'>('area');
  const [showVolume, setShowVolume] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Real-time data fetching
  const fetchChartData = useCallback(async () => {
    try {
      const result = await getChartData(symbol, timeframe);
      if (result.success && result.data) {
        setChartData(result.data);
        setLastUpdate(new Date());
      } else {
        console.error('Failed to load chart data:', result.error);
      }
    } catch (error) {
      console.error('Chart data error:', error);
    }
  }, [symbol, timeframe]);

  // Update latest price for real-time feel
  const updateLatestPrice = useCallback(async () => {
    if (chartData.length === 0) return;
    
    try {
      const quoteResult = await getStockQuote(symbol);
      if (quoteResult.success && quoteResult.data) {
        setChartData(prevData => {
          const newData = [...prevData];
          if (newData.length > 0) {
            // Update the latest candle with current price
            const latestIndex = newData.length - 1;
            newData[latestIndex] = {
              ...newData[latestIndex],
              close: quoteResult.data!.price,
              high: Math.max(newData[latestIndex].high, quoteResult.data!.price),
              low: Math.min(newData[latestIndex].low, quoteResult.data!.price)
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
        // For longer timeframes, just refresh the data occasionally
        fetchChartData();
      } else {
        // For shorter timeframes, update the latest price more frequently
        updateLatestPrice();
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [fetchChartData, updateLatestPrice, timeframe]);

  // Calculate price statistics
  const priceStats = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const prices = chartData.map(d => d.close);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    
    return {
      firstPrice,
      lastPrice,
      change,
      changePercent,
      high,
      low,
      isPositive: change >= 0
    };
  }, [chartData]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '15m':
      case '30m':
      case '1h':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        });
      case '4h':
      case '1d':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      default:
        return date.toLocaleDateString();
    }
  };

  const formatPrice = (price: number) => {
    // Format based on symbol - Indian stocks typically have higher values
    const isIndianStock = symbol.includes('.NS') || symbol.includes('.BO');
    const currency = isIndianStock ? '₹' : '$';
    const decimals = isIndianStock ? 2 : 2;
    
    return `${currency}${price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading chart data...</p>
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

  const chartDataFormatted: CandlestickData[] = chartData.map((d, index) => {
    const isPositive = d.close >= d.open;
    return {
      ...d,
      formattedTime: formatDate(d.timestamp),
      index,
      bodyHeight: Math.abs(d.close - d.open),
      isPositive,
      wickTop: d.high,
      wickBottom: d.low
    };
  });

  // Custom Candlestick Component
  const Candlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const data = payload as CandlestickData;
    const candleWidth = Math.max(width * 0.6, 2);
    const wickWidth = 1;
    const centerX = x + width / 2;
    
    // Calculate positions
    const highY = y + height * (1 - (data.high - Math.min(...chartData.map(d => d.low))) / (Math.max(...chartData.map(d => d.high)) - Math.min(...chartData.map(d => d.low))));
    const lowY = y + height * (1 - (data.low - Math.min(...chartData.map(d => d.low))) / (Math.max(...chartData.map(d => d.high)) - Math.min(...chartData.map(d => d.low))));
    const openY = y + height * (1 - (data.open - Math.min(...chartData.map(d => d.low))) / (Math.max(...chartData.map(d => d.high)) - Math.min(...chartData.map(d => d.low))));
    const closeY = y + height * (1 - (data.close - Math.min(...chartData.map(d => d.low))) / (Math.max(...chartData.map(d => d.high)) - Math.min(...chartData.map(d => d.low))));
    
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(openY - closeY);
    const color = data.isPositive ? '#10b981' : '#ef4444';
    
    return (
      <g>
        {/* Upper wick */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={bodyTop}
          stroke={color}
          strokeWidth={wickWidth}
        />
        {/* Lower wick */}
        <line
          x1={centerX}
          y1={bodyTop + bodyHeight}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={wickWidth}
        />
        {/* Body */}
        <rect
          x={centerX - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={Math.max(bodyHeight, 1)}
          fill={data.isPositive ? color : 'transparent'}
          stroke={color}
          strokeWidth={data.isPositive ? 0 : 1}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
          <div className="space-y-1">
            {chartType === 'candlestick' && data.open && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Open: </span>
                  <span className="font-medium">{formatPrice(data.open)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">High: </span>
                  <span className="font-medium">{formatPrice(data.high)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Low: </span>
                  <span className="font-medium">{formatPrice(data.low)}</span>
                </p>
              </>
            )}
            <p className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Close: </span>
              <span className="font-medium">{formatPrice(data.close)}</span>
            </p>
            {data.high && chartType !== 'candlestick' && (
              <>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">High: </span>
                  <span className="font-medium">{formatPrice(data.high)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Low: </span>
                  <span className="font-medium">{formatPrice(data.low)}</span>
                </p>
              </>
            )}
            {data.volume && showVolume && (
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Volume: </span>
                <span className="font-medium">{formatVolume(data.volume)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

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
                variant={chartType === 'area' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('area')}
              >
                <Activity className="h-4 w-4 mr-1" />
                Area
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

      {/* Main Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'candlestick' ? (
            <ComposedChart data={chartDataFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-20" 
                stroke="currentColor"
              />
              <XAxis 
                dataKey="formattedTime"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatPrice(value).split(/[₹$]/)[1]}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="close" 
                shape={<Candlestick />}
                fill="transparent"
              />
              {showVolume && (
                <Bar
                  dataKey="volume"
                  yAxisId="volume"
                  fill="#6b7280"
                  opacity={0.3}
                />
              )}
              {showVolume && (
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatVolume(value)}
                  width={50}
                />
              )}
              {priceStats && (
                <ReferenceLine 
                  y={priceStats.firstPrice} 
                  stroke="#6b7280" 
                  strokeDasharray="2 2" 
                  strokeOpacity={0.5}
                />
              )}
              {chartDataFormatted.length > 20 && (
                <Brush 
                  dataKey="formattedTime" 
                  height={30} 
                  stroke="#6b7280"
                  fill="rgba(107, 114, 128, 0.1)"
                />
              )}
            </ComposedChart>
          ) : chartType === 'area' ? (
            <AreaChart data={chartDataFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={priceStats?.isPositive ? "#10b981" : "#ef4444"} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={priceStats?.isPositive ? "#10b981" : "#ef4444"} 
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-20" 
                stroke="currentColor"
              />
              <XAxis 
                dataKey="formattedTime"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatPrice(value).split(/[₹$]/)[1]}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke={priceStats?.isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: priceStats?.isPositive ? "#10b981" : "#ef4444",
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              {priceStats && (
                <ReferenceLine 
                  y={priceStats.firstPrice} 
                  stroke="#6b7280" 
                  strokeDasharray="2 2" 
                  strokeOpacity={0.5}
                />
              )}
              {chartDataFormatted.length > 20 && (
                <Brush 
                  dataKey="formattedTime" 
                  height={30} 
                  stroke="#6b7280"
                  fill="rgba(107, 114, 128, 0.1)"
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={chartDataFormatted} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-20"
                stroke="currentColor"
              />
              <XAxis 
                dataKey="formattedTime"
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatPrice(value).split(/[₹$]/)[1]}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke={priceStats?.isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: priceStats?.isPositive ? "#10b981" : "#ef4444",
                  stroke: '#fff',
                  strokeWidth: 2
                }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              {priceStats && (
                <ReferenceLine 
                  y={priceStats.firstPrice} 
                  stroke="#6b7280" 
                  strokeDasharray="2 2" 
                  strokeOpacity={0.5}
                />
              )}
              {chartDataFormatted.length > 20 && (
                <Brush 
                  dataKey="formattedTime" 
                  height={30} 
                  stroke="#6b7280"
                  fill="rgba(107, 114, 128, 0.1)"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
