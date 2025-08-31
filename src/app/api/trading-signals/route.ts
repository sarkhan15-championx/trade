import { NextRequest, NextResponse } from 'next/server';
import { 
  analyzeMultiTimeframe,
  generateTradingSignal,
  MultiTimeframeAnalysis,
  CandlestickData
} from '@/lib/tradingSignals';
import { getStockPrice, StockPrice } from '@/lib/stockService';

// Fetch real chart data from Yahoo Finance or similar API
async function fetchRealChartData(symbol: string, timeframe: string): Promise<CandlestickData[]> {
  try {
    // Convert timeframe to Yahoo Finance intervals
    const intervalMap: Record<string, string> = {
      '15m': '15m',
      '30m': '30m', 
      '1h': '1h',
      '4h': '4h',
      '1d': '1d'
    };
    
    const interval = intervalMap[timeframe] || '1h';
    const range = timeframe === '15m' || timeframe === '30m' ? '5d' : 
                  timeframe === '1h' || timeframe === '4h' ? '60d' : '1y';
    
    // Use Yahoo Finance API
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
    
    console.log(`Fetching real chart data for ${symbol} ${timeframe}: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
      throw new Error('Invalid chart data structure');
    }
    
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    const volumes = result.indicators.quote[0].volume;
    
    const candles: CandlestickData[] = [];
    
    for (let i = 0; i < timestamps.length; i++) {
      if (quote.open[i] !== null && quote.high[i] !== null && 
          quote.low[i] !== null && quote.close[i] !== null) {
        candles.push({
          time: timestamps[i],
          open: quote.open[i],
          high: quote.high[i],
          low: quote.low[i],
          close: quote.close[i],
          volume: volumes[i] || 0
        });
      }
    }
    
    console.log(`✅ Fetched ${candles.length} real candles for ${symbol} ${timeframe}`);
    return candles;
    
  } catch (error) {
    console.error(`❌ Failed to fetch real chart data for ${symbol} ${timeframe}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbol } = await request.json();

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Get current stock price
    const stockPrice = await getStockPrice(symbol);
    
    if (!stockPrice) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // Generate chart data for all timeframes
    const timeframes = ['15m', '30m', '1h', '4h', '1d'];
    const chartDataByTimeframe: Record<string, any[]> = {};
    
    for (const timeframe of timeframes) {
      // Fetch real chart data - no fallback to mock data
      try {
        const realChartData = await fetchRealChartData(stockPrice.symbol, timeframe);
        chartDataByTimeframe[timeframe] = realChartData;
      } catch (error) {
        console.error(`Failed to fetch real data for ${timeframe}:`, error);
        // Skip this timeframe if real data is not available
        continue;
      }
    }

    // Only proceed if we have data for at least one timeframe
    if (Object.keys(chartDataByTimeframe).length === 0) {
      return NextResponse.json(
        { error: 'Unable to fetch chart data for any timeframe' },
        { status: 503 }
      );
    }

    // Analyze all timeframes
    const analysis: MultiTimeframeAnalysis = await analyzeMultiTimeframe(stockPrice, chartDataByTimeframe);
    
    return NextResponse.json({
      success: true,
      data: {
        stock: stockPrice,
        analysis: analysis
      }
    });

  } catch (error) {
    console.error('Trading signals API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate trading signals' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Get current stock price
    const stockPrice = await getStockPrice(symbol);
    
    if (!stockPrice) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // Generate chart data for all timeframes
    const timeframes = ['15m', '30m', '1h', '4h', '1d'];
    const chartDataByTimeframe: Record<string, any[]> = {};
    
    for (const timeframe of timeframes) {
      // Fetch real chart data - no fallback to mock data
      try {
        const realChartData = await fetchRealChartData(stockPrice.symbol, timeframe);
        chartDataByTimeframe[timeframe] = realChartData;
      } catch (error) {
        console.error(`Failed to fetch real data for ${timeframe}:`, error);
        // Skip this timeframe if real data is not available
        continue;
      }
    }

    // Only proceed if we have data for at least one timeframe
    if (Object.keys(chartDataByTimeframe).length === 0) {
      return NextResponse.json(
        { error: 'Unable to fetch chart data for any timeframe' },
        { status: 503 }
      );
    }

    // Analyze all timeframes
    const analysis: MultiTimeframeAnalysis = await analyzeMultiTimeframe(stockPrice, chartDataByTimeframe);
    
    return NextResponse.json({
      success: true,
      data: {
        stock: stockPrice,
        analysis: analysis
      }
    });

  } catch (error) {
    console.error('Trading signals API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate trading signals' },
      { status: 500 }
    );
  }
}
