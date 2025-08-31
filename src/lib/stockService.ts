// Stock service for managing stock data and prices
import { fetchAllIndianStocks, IndianStock, StockCache } from './indianStocksFetcher';

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  sector?: string;
  marketCap?: number;
}

export interface StockPrice {
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

// Cache for all Indian stocks
let cachedIndianStocks: Stock[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Get all stocks from API (cached)
export async function getAllStocks(): Promise<Stock[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedIndianStocks && (now - lastFetchTime) < CACHE_DURATION) {
    console.log(`📋 Returning ${cachedIndianStocks.length} cached stocks`);
    return cachedIndianStocks;
  }
  
  try {
    console.log('🔄 Fetching fresh stock data...');
    const indianStocks = await fetchAllIndianStocks();
    
    // Convert to Stock interface
    cachedIndianStocks = indianStocks.map((stock: IndianStock): Stock => ({
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      sector: stock.sector,
      marketCap: stock.marketCap
    }));
    
    lastFetchTime = now;
    console.log(`✅ Cached ${cachedIndianStocks.length} Indian stocks`);
    return cachedIndianStocks;
  } catch (error) {
    console.error('❌ Failed to fetch stocks:', error);
    
    // Return empty array if no cached data available
    if (!cachedIndianStocks) {
      return [];
    }
    
    // Return stale cached data if fetch fails
    console.log('⚠️ Using stale cached data due to fetch failure');
    return cachedIndianStocks;
  }
}

// Search stocks by name or symbol
export async function searchStocks(query: string): Promise<Stock[]> {
  const allStocks = await getAllStocks();
  const searchTerm = query.toLowerCase();
  
  return allStocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm) ||
    stock.symbol.toLowerCase().includes(searchTerm)
  );
}

// Get current price for a single stock or index
export async function getStockPrice(symbol: string): Promise<StockPrice | null> {
  try {
    // Handle Indian indices (starting with ^)
    if (symbol.startsWith('^')) {
      const indexPrice = await getIndexPrice(symbol);
      if (indexPrice) {
        return indexPrice;
      }
    }
    
    // For Indian stocks (.NS suffix), get real data only
    if (symbol.endsWith('.NS')) {
      const allStocks = await getAllStocks();
      const stock = allStocks.find(s => s.symbol === symbol);
      if (stock) {
        // Only try to get real data - no fallback to mock
        const realPrice = await getRealTimePrice(symbol);
        if (realPrice) {
          return realPrice;
        }
        
        // If real data fails, return null instead of mock data
        console.log(`Real-time data unavailable for ${symbol}`);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

// Helper function to get index display name
function getIndexName(symbol: string): string {
  const indexNames = {
    '^NSEI': 'Nifty 50',
    '^BSESN': 'Sensex',
    '^NSEBANK': 'Nifty Bank',
    '^CNXMID': 'Nifty Midcap 100',
    '^CNXSC': 'Nifty Smallcap 100',
    '^CNXFMCG': 'Nifty FMCG',
    '^CNXIT': 'Nifty IT',
    '^CNXREALTY': 'Nifty Realty'
  };
  
  return indexNames[symbol as keyof typeof indexNames] || symbol;
}

// Get real-time index price (for indices like ^NSEI, ^BSESN)
async function getIndexPrice(symbol: string): Promise<StockPrice | null> {
  // Try Yahoo Finance first for indices
  try {
    const yahooSymbol = symbol; // Indices already have correct format with ^
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.chart?.result?.[0]?.meta) {
        const meta = data.chart.result[0].meta;
        return {
          symbol: symbol,
          name: getIndexName(symbol),
          price: meta.regularMarketPrice || meta.previousClose || 0,
          change: (meta.regularMarketPrice || 0) - (meta.previousClose || 0),
          changePercent: meta.regularMarketChangePercent || 0,
          volume: 0,
          marketCap: 0,
          currency: 'INR',
          exchange: 'NSE',
          lastUpdated: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.log(`Yahoo Finance failed for index ${symbol}:`, error);
  }

  // Try NSE API for Indian indices
  try {
    // Convert index symbols to NSE format
    let nseSymbol = symbol;
    if (symbol === '^NSEI') nseSymbol = 'NIFTY 50';
    else if (symbol === '^BSESN') nseSymbol = 'SENSEX';
    else if (symbol === '^NSEBANK') nseSymbol = 'NIFTY BANK';
    else if (symbol === '^CNXMID') nseSymbol = 'NIFTY MIDCAP 100';
    else if (symbol === '^CNXSC') nseSymbol = 'NIFTY SMALLCAP 100';
    
    const response = await fetch(
      `https://www.nseindia.com/api/allIndices`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const indexData = data.data?.find((index: any) => 
        index.indexName === nseSymbol || index.indexSymbol === nseSymbol
      );
      
      if (indexData) {
        return {
          symbol: symbol,
          name: getIndexName(symbol),
          price: parseFloat(indexData.last) || 0,
          change: parseFloat(indexData.change) || 0,
          changePercent: parseFloat(indexData.percentChange) || 0,
          volume: 0,
          marketCap: 0,
          currency: 'INR',
          exchange: 'NSE',
          lastUpdated: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.log(`NSE API failed for index ${symbol}:`, error);
  }

  return null;
}

// Get real-time price from multiple sources
async function getRealTimePrice(symbol: string): Promise<StockPrice | null> {
  try {
    // Try multiple real-time data sources in order of preference
    
    // 1. Try Yahoo Finance first (most reliable for Indian stocks)
    const yahooPrice = await getYahooFinancePrice(symbol);
    if (yahooPrice) {
      return yahooPrice;
    }
    
    // 2. Try NSE API (if available)
    const nsePrice = await getNSEPrice(symbol);
    if (nsePrice) {
      return nsePrice;
    }
    
    // 3. Try Alpha Vantage as last resort
    const alphaPrice = await getAlphaVantagePrice(symbol);
    if (alphaPrice) {
      return alphaPrice;
    }
    
    console.log(`No real-time data available for ${symbol} from any source`);
    return null;
  } catch (error) {
    console.error(`Error fetching real-time price for ${symbol}:`, error);
    return null;
  }
}

// NSE India API (simplified approach)
async function getNSEPrice(symbol: string): Promise<StockPrice | null> {
  try {
    // Remove .NS suffix for NSE API
    const nseSymbol = symbol.replace('.NS', '');
    
    // Try to fetch from NSE (this is a simplified example)
    // In practice, you might need proper authentication
    const response = await fetch(`https://www.nseindia.com/api/quote-equity?symbol=${nseSymbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.priceInfo) {
      const currentPrice = data.priceInfo.lastPrice;
      const previousClose = data.priceInfo.close;
      const change = data.priceInfo.change;
      const changePercent = data.priceInfo.pChange;
      
      const allStocks = await getAllStocks();
      const stock = allStocks.find(s => s.symbol === symbol);
      
      console.log(`Successfully fetched NSE real-time price for ${symbol}: ₹${currentPrice}`);
      
      return {
        symbol,
        name: stock?.name || data.info?.companyName || symbol,
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: data.priceInfo?.totalTradedVolume || 0,
        marketCap: Math.floor((currentPrice * 1000000) / 10000000), // Estimated
        currency: 'INR',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error(`NSE API error for ${symbol}:`, error);
    return null;
  }
}

// Yahoo Finance API
async function getYahooFinancePrice(symbol: string): Promise<StockPrice | null> {
  try {
    // Convert .NS to .BO for Yahoo Finance (BSE listing)
    // Also try .NS directly for NSE listing
    const yahooSymbols = [
      symbol.replace('.NS', '.BO'), // BSE
      symbol.replace('.NS', '.NS'),  // NSE
      symbol.replace('.NS', '')      // Without exchange
    ];
    
    for (const yahooSymbol of yahooSymbols) {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          continue; // Try next symbol variant
        }
        
        const data = await response.json();
        
        if (data.chart?.result?.[0]?.meta) {
          const meta = data.chart.result[0].meta;
          
          const currentPrice = meta.regularMarketPrice || meta.previousClose;
          const previousClose = meta.previousClose;
          
          if (!currentPrice || currentPrice <= 0) {
            continue; // Try next symbol variant
          }
          
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;
          
          const allStocks = await getAllStocks();
          const stock = allStocks.find(s => s.symbol === symbol);
          
          console.log(`Successfully fetched real-time price for ${symbol}: ₹${currentPrice}`);
          
          return {
            symbol,
            name: stock?.name || meta.longName || symbol,
            price: Math.round(currentPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            volume: meta.regularMarketVolume || 0,
            marketCap: Math.floor((currentPrice * (meta.sharesOutstanding || 1000000)) / 10000000),
            currency: 'INR',
            exchange: meta.exchangeName || 'NSE',
            lastUpdated: new Date().toISOString()
          };
        }
      } catch (symbolError) {
        console.log(`Failed to fetch ${yahooSymbol}, trying next variant`);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Yahoo Finance error for ${symbol}:`, error);
    return null;
  }
}

// Alpha Vantage API for Indian stocks
async function getAlphaVantagePrice(symbol: string): Promise<StockPrice | null> {
  try {
    // Remove .NS suffix for Alpha Vantage
    const alphaSymbol = symbol.replace('.NS', '');
    
    // Try with NSE exchange
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaSymbol}.NSE&apikey=DEMO`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      const currentPrice = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      const volume = parseInt(quote['06. volume']) || 0;
      
      const allStocks = await getAllStocks();
      const stock = allStocks.find(s => s.symbol === symbol);
      
      return {
        symbol,
        name: stock?.name || quote['01. symbol'] || symbol,
        price: Math.round(currentPrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume,
        marketCap: Math.floor((currentPrice * 1000000) / 10000000), // Estimated
        currency: 'INR',
        exchange: 'NSE',
        lastUpdated: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Alpha Vantage error for ${symbol}:`, error);
    return null;
  }
}

// Get prices for multiple stocks (parallel processing for better performance)
export async function getMultipleStockPrices(symbols: string[]): Promise<StockPrice[]> {
  console.log(`Fetching real-time prices for symbols:`, symbols);
  
  // Process in parallel for better performance
  const pricePromises = symbols.map(symbol => getStockPrice(symbol));
  const results = await Promise.allSettled(pricePromises);
  
  const prices: StockPrice[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      prices.push(result.value);
    } else {
      console.log(`Failed to get price for ${symbols[index]}`);
    }
  });
  
  return prices;
}

// Get market overview with top gainers, losers, and most active
export async function getMarketOverview(market: 'India' | 'both' = 'India'): Promise<{
  gainers: StockPrice[];
  losers: StockPrice[];
  mostActive: StockPrice[];
}> {
  console.log(`Fetching market overview for 15 popular stocks`);
  
  // Reduced list for faster response
  const popularStocks = [
    'TCS.NS', 'RELIANCE.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'SBIN.NS', 'BHARTIARTL.NS', 'KOTAKBANK.NS', 'ITC.NS', 'LT.NS',
    'AXISBANK.NS', 'MARUTI.NS', 'ASIANPAINT.NS', 'NESTLEIND.NS', 'TATAMOTORS.NS'
  ];
  
  try {
    // Use Promise.allSettled with timeout for faster parallel processing
    const timeoutPromise = new Promise<StockPrice[]>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 10000); // 10 second timeout
    });
    
    const dataPromise = getMultipleStockPrices(popularStocks);
    const prices = await Promise.race([dataPromise, timeoutPromise]) as StockPrice[];
    
    // Filter out invalid results
    const validPrices = prices.filter(price => 
      price !== null && 
      price.price > 0 && 
      !isNaN(price.changePercent) && 
      isFinite(price.changePercent)
    );
    
    console.log(`Got real-time data for ${validPrices.length} out of ${popularStocks.length} stocks`);
    
    // Always supplement with mock data for better UI experience
    console.log('Adding mock data to supplement real data');
    const mockData = generateMockMarketData();
    const allData = [...validPrices, ...mockData];
    
    // Sort by change percentage for gainers (highest first)
    const gainers = [...allData]
      .filter(p => p.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 8);
      
    // Sort by change percentage for losers (lowest first)
    const losers = [...allData]
      .filter(p => p.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 8);
      
    // Sort by volume for most active
    const mostActive = [...allData]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8);
    
    return { gainers, losers, mostActive };
    
  } catch (error) {
    console.log('Market overview timed out or failed, using mock data only');
    // If all fails, return pure mock data
    const mockData = generateMockMarketData();
    
    const gainers = mockData
      .filter(p => p.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 8);
      
    const losers = mockData
      .filter(p => p.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 8);
      
    const mostActive = mockData
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 8);
    
    return { gainers, losers, mostActive };
  }
}

// Helper function to generate mock market data when needed
function generateMockMarketData(): StockPrice[] {
  const mockStocks = [
    { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', basePrice: 6500, change: 2.5 },
    { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', basePrice: 1680, change: -1.8 },
    { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', basePrice: 4800, change: 1.2 },
    { symbol: 'CIPLA.NS', name: 'Cipla', basePrice: 1450, change: -0.5 },
    { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', basePrice: 4200, change: 3.1 },
    { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', basePrice: 2800, change: -2.3 },
    { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', basePrice: 650, change: 1.7 },
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', basePrice: 2400, change: -1.1 },
    { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', basePrice: 920, change: 2.8 },
    { symbol: 'SHREECEM.NS', name: 'Shree Cement', basePrice: 26000, change: -0.8 }
  ];
  
  return mockStocks.map(stock => {
    const changePercent = stock.change;
    const price = stock.basePrice * (1 + changePercent / 100);
    const change = price - stock.basePrice;
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
      currency: 'INR',
      exchange: 'NSE',
      lastUpdated: new Date().toISOString()
    };
  });
}

// Get stocks by sector
export async function getStocksBySector(sector: string): Promise<Stock[]> {
  const allStocks = await getAllStocks();
  return allStocks.filter(stock => 
    stock.sector?.toLowerCase() === sector.toLowerCase()
  );
}

// Get all available sectors
export async function getAllSectors(): Promise<string[]> {
  const allStocks = await getAllStocks();
  const sectors = [...new Set(allStocks
    .map(stock => stock.sector)
    .filter((sector): sector is string => !!sector))];
  
  return sectors.sort();
}
