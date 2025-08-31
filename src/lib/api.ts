import { StockData, ChartData, ApiResponse, TimeFrame } from '@/types';

const FINNHUB_API_BASE = 'https://finnhub.io/api/v1';
const ALPHA_VANTAGE_API_BASE = 'https://www.alphavantage.co/query';

/**
 * Get Finnhub API key from environment or return empty string for mock mode
 */
function getApiKey(): string {
  return process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
}

/**
 * Get Alpha Vantage API key (fallback for chart data)
 */
function getAlphaVantageKey(): string {
  return process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
}

/**
 * Convert timeframe to Finnhub resolution
 */
function timeframeToResolution(timeframe: TimeFrame): string {
  const mapping = {
    '15m': '15',
    '30m': '30',
    '1h': '60',
    '4h': '240',
    '1d': 'D'
  };
  return mapping[timeframe] || 'D';
}

/**
 * Convert timeframe to Alpha Vantage function
 */
function timeframeToAlphaVantageFunction(timeframe: TimeFrame): string {
  const mapping = {
    '15m': 'TIME_SERIES_INTRADAY',
    '30m': 'TIME_SERIES_INTRADAY',
    '1h': 'TIME_SERIES_INTRADAY',
    '4h': 'TIME_SERIES_DAILY',
    '1d': 'TIME_SERIES_DAILY'
  };
  return mapping[timeframe] || 'TIME_SERIES_DAILY';
}

/**
 * Get Alpha Vantage interval parameter
 */
function getAlphaVantageInterval(timeframe: TimeFrame): string {
  const mapping = {
    '15m': '15min',
    '30m': '30min',
    '1h': '60min',
    '4h': 'daily',
    '1d': 'daily'
  };
  return mapping[timeframe] || 'daily';
}

/**
 * Search stocks using Finnhub API
 */
export async function searchStocks(query: string): Promise<ApiResponse<StockData[]>> {
  // Use Finnhub API for live data
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Finnhub API key not configured' };
  }

  try {
    const response = await fetch(
      `${FINNHUB_API_BASE}/search?q=${encodeURIComponent(query)}&token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform Finnhub search response to our format
    const stocks: StockData[] = data.result?.slice(0, 10).map((item: any) => ({
      symbol: item.symbol,
      name: item.description || item.symbol,
      price: 0, // Will be fetched separately
      change: 0,
      changePercent: 0,
      volume: 0,
    })) || [];

    // Get current prices for the search results
    const stocksWithPrices = await Promise.all(
      stocks.map(async (stock) => {
        const quoteResult = await getStockQuote(stock.symbol);
        if (quoteResult.success && quoteResult.data) {
          return {
            ...stock,
            price: quoteResult.data.price,
            change: quoteResult.data.change,
            changePercent: quoteResult.data.changePercent,
            volume: quoteResult.data.volume,
            high52Week: quoteResult.data.high52Week,
            low52Week: quoteResult.data.low52Week,
          };
        }
        return stock;
      })
    );

    return { success: true, data: stocksWithPrices };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get stock quote using Finnhub API
 */
export async function getStockQuote(symbol: string): Promise<ApiResponse<StockData>> {
  // Use Finnhub API for live data
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Finnhub API key not configured' };
  }

  try {
    // For Indian stocks, we might need to try different symbol formats
    let searchSymbol = symbol;
    if (symbol.includes('.NS') || symbol.includes('.BO')) {
      // Keep the original format for Indian stocks
      searchSymbol = symbol;
    }

    const response = await fetch(
      `${FINNHUB_API_BASE}/quote?symbol=${encodeURIComponent(searchSymbol)}&token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (data.c === 0 && data.d === 0 && data.dp === 0) {
      return { success: false, error: 'No data available for this symbol' };
    }
    
    const stock: StockData = {
      symbol,
      name: symbol, // Finnhub quote doesn't include company name
      price: data.c || 0,
      change: data.d || 0,
      changePercent: data.dp || 0,
      volume: 0, // Not provided in quote endpoint
      high52Week: data.h || 0,
      low52Week: data.l || 0,
    };

    return { success: true, data: stock };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get historical chart data using Alpha Vantage API as fallback
 */
async function getChartDataFromAlphaVantage(
  symbol: string, 
  timeframe: TimeFrame
): Promise<ApiResponse<ChartData[]>> {
  const apiKey = getAlphaVantageKey();
  const func = timeframeToAlphaVantageFunction(timeframe);
  const interval = getAlphaVantageInterval(timeframe);
  
  try {
    let url = `${ALPHA_VANTAGE_API_BASE}?function=${func}&symbol=${symbol}&apikey=${apiKey}`;
    
    if (['15m', '30m', '1h'].includes(timeframe)) {
      url += `&interval=${interval}`;
    }
    
    console.log('Fetching from Alpha Vantage:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      return { success: false, error: data['Error Message'] };
    }
    
    if (data['Note']) {
      console.warn('Alpha Vantage API limit reached for', symbol);
      return { success: false, error: 'API rate limit exceeded' };
    }
    
    // Extract time series data
    let timeSeries: any = null;
    const keys = Object.keys(data);
    for (const key of keys) {
      if (key.includes('Time Series')) {
        timeSeries = data[key];
        break;
      }
    }
    
    if (!timeSeries) {
      console.warn('No time series data found for', symbol);
      return { success: false, error: 'No chart data available' };
    }
    
    const chartData: ChartData[] = [];
    Object.entries(timeSeries).forEach(([dateStr, values]: [string, any]) => {
      chartData.push({
        timestamp: new Date(dateStr).getTime(),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'] || '0'),
      });
    });
    
    // Sort by timestamp
    chartData.sort((a, b) => a.timestamp - b.timestamp);
    
    // Limit data points based on timeframe
    const maxPoints = timeframe === '1d' ? 252 : 100;
    const limitedData = chartData.slice(-maxPoints);
    
    console.log('Alpha Vantage returned', limitedData.length, 'data points for', symbol);
    return { success: true, data: limitedData };
    
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get historical chart data using Finnhub API with Alpha Vantage fallback
 */
export async function getChartData(
  symbol: string, 
  timeframe: TimeFrame
): Promise<ApiResponse<ChartData[]>> {
  // First try Finnhub API
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log('No Finnhub API key, using Alpha Vantage fallback');
    return getChartDataFromAlphaVantage(symbol, timeframe);
  }

  try {
    const resolution = timeframeToResolution(timeframe);
    const to = Math.floor(Date.now() / 1000);
    
    // Adjust the time range based on timeframe
    // Note: Finnhub free tier has limitations on intraday data
    let from: number;
    switch (timeframe) {
      case '15m':
      case '30m':
      case '1h':
        // For intraday data, use shorter periods as free tier might be limited
        from = to - (5 * 24 * 60 * 60); // 5 days for intraday
        break;
      case '4h':
        from = to - (30 * 24 * 60 * 60); // 30 days for 4h
        break;
      case '1d':
        from = to - (365 * 24 * 60 * 60); // 1 year for daily
        break;
      default:
        from = to - (30 * 24 * 60 * 60); // Default 30 days
    }
    
    const url = `${FINNHUB_API_BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
    console.log('Fetching chart data for:', symbol, 'URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Chart data response for', symbol, ':', data);
    
    if (data.s !== 'ok') {
      console.error('Finnhub failed for symbol:', symbol, 'trying Alpha Vantage fallback');
      return getChartDataFromAlphaVantage(symbol, timeframe);
    }
    
    if (!data.t || data.t.length === 0) {
      console.error('Empty data from Finnhub for symbol:', symbol, 'trying Alpha Vantage fallback');
      return getChartDataFromAlphaVantage(symbol, timeframe);
    }
    
    const chartData: ChartData[] = [];
    for (let i = 0; i < data.t.length; i++) {
      chartData.push({
        timestamp: data.t[i] * 1000, // Convert to milliseconds
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
      });
    }

    // Sort by timestamp to ensure chronological order
    chartData.sort((a, b) => a.timestamp - b.timestamp);
    
    console.log('Successfully processed', chartData.length, 'data points for', symbol);
    return { success: true, data: chartData };
    
  } catch (error) {
    console.error('Finnhub API error for', symbol, ':', error);
    console.log('Falling back to Alpha Vantage for', symbol);
    return getChartDataFromAlphaVantage(symbol, timeframe);
  }
}

/**
 * Get company profile using Finnhub API
 */
export async function getCompanyProfile(symbol: string): Promise<ApiResponse<{name: string}>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'Finnhub API key not configured' };
  }

  try {
    const response = await fetch(
      `${FINNHUB_API_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return { 
      success: true, 
      data: { 
        name: data.name || data.finnhubIndustry || symbol 
      } 
    };
  } catch (error) {
    return { success: true, data: { name: symbol } }; // Fallback to symbol
  }
}

/**
 * Get real-time price updates for multiple symbols
 */
export async function getRealTimePrices(symbols: string[]): Promise<ApiResponse<{[symbol: string]: StockData}>> {
  // Get real quotes using live API
  const results: {[symbol: string]: StockData} = {};
  const promises = symbols.map(async (symbol) => {
    const result = await getStockQuote(symbol);
    if (result.success && result.data) {
      results[symbol] = result.data;
    }
  });

  await Promise.all(promises);
  return { success: true, data: results };
}
