import { StockData } from '@/types';

export interface IndianStock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector?: string;
  marketCap?: number;
  lastPrice?: number;
  isin?: string;
}

// NSE official symbols list
const NSE_SYMBOLS_API = 'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv';

// Yahoo Finance screener for Indian stocks
const YAHOO_SCREENER_API = 'https://query1.finance.yahoo.com/v1/finance/screener';

// Alpha Vantage listing (if you have API key)
const ALPHA_VANTAGE_LISTING = (apiKey: string) => 
  `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`;

/**
 * Fetch all NSE stocks from official NSE website
 */
export async function fetchNSEStocks(): Promise<IndianStock[]> {
  try {
    // Method 1: Try NSE official CSV
    const response = await fetch(NSE_SYMBOLS_API, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/csv,application/csv,text/plain',
      }
    });

    if (response.ok) {
      const csvText = await response.text();
      const lines = csvText.split('\n').slice(1); // Skip header
      
      const stocks: IndianStock[] = lines
        .filter(line => line.trim())
        .map(line => {
          const [symbol, name, series, dateListing, paidUpValue, marketLot, isin, faceValue] = line.split(',');
          
          return {
            symbol: `${symbol?.trim()}.NS`,
            name: name?.trim().replace(/"/g, ''),
            exchange: 'NSE' as const,
            isin: isin?.trim(),
          };
        })
        .filter(stock => stock.symbol && stock.name);

      console.log(`✅ Fetched ${stocks.length} NSE stocks from official API`);
      return stocks;
    }
  } catch (error) {
    console.warn('NSE official API failed:', error);
  }

  return [];
}

/**
 * Fetch Indian stocks using Yahoo Finance screener
 */
export async function fetchYahooIndianStocks(): Promise<IndianStock[]> {
  try {
    const response = await fetch(YAHOO_SCREENER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        size: 2500,
        offset: 0,
        sortField: "marketcap",
        sortType: "desc",
        quoteType: "EQUITY",
        query: {
          operator: "and",
          operands: [
            { operator: "eq", operands: ["region", "in"] },
            { operator: "or", operands: [
              { operator: "eq", operands: ["exchange", "NSI"] },
              { operator: "eq", operands: ["exchange", "BSE"] }
            ]}
          ]
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const quotes = data?.finance?.result?.[0]?.quotes || [];
      
      const stocks: IndianStock[] = quotes.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || quote.symbol,
        exchange: quote.exchange === 'NSI' ? 'NSE' : 'BSE',
        sector: quote.sector,
        marketCap: quote.marketCap,
        lastPrice: quote.regularMarketPrice
      }));

      console.log(`✅ Fetched ${stocks.length} Indian stocks from Yahoo Finance`);
      return stocks;
    }
  } catch (error) {
    console.warn('Yahoo Finance API failed:', error);
  }

  return [];
}

/**
 * Get fallback stocks from your local JSON file
 */
export async function getFallbackStocks(): Promise<IndianStock[]> {
  try {
    const response = await fetch('http://localhost:3000/data/stocks.json');
    const data = await response.json();
    
    // Flatten all Indian stocks from different categories
    const allStocks: IndianStock[] = [];
    
    if (data.India) {
      Object.values(data.India).forEach((category: any) => {
        if (Array.isArray(category)) {
          category.forEach((stock: any) => {
            allStocks.push({
              symbol: stock.symbol,
              name: stock.name,
              exchange: stock.exchange || 'NSE'
            });
          });
        }
      });
    }

    // Remove duplicates
    const uniqueStocks = allStocks.filter((stock, index, self) => 
      index === self.findIndex(s => s.symbol === stock.symbol)
    );

    console.log(`📂 Loaded ${uniqueStocks.length} stocks from fallback JSON`);
    return uniqueStocks;
  } catch (error) {
    console.error('Failed to load fallback stocks:', error);
    return [];
  }
}

/**
 * Main function to fetch all Indian stocks with multiple fallbacks
 */
export async function fetchAllIndianStocks(): Promise<IndianStock[]> {
  console.log('🚀 Starting to fetch Indian stocks...');
  
  let allStocks: IndianStock[] = [];

  // Try multiple sources in order of preference
  const sources = [
    { name: 'Yahoo Finance', fetcher: fetchYahooIndianStocks },
    { name: 'NSE Official', fetcher: fetchNSEStocks },
    { name: 'Local JSON', fetcher: getFallbackStocks }
  ];

  for (const source of sources) {
    try {
      console.log(`🔄 Trying ${source.name}...`);
      const stocks = await source.fetcher();
      
      if (stocks.length > 0) {
        allStocks = [...allStocks, ...stocks];
        console.log(`✅ ${source.name} provided ${stocks.length} stocks`);
      }
    } catch (error) {
      console.warn(`❌ ${source.name} failed:`, error);
    }
  }

  // Remove duplicates and sort by market cap
  const uniqueStocks = allStocks
    .filter((stock, index, self) => 
      index === self.findIndex(s => s.symbol === stock.symbol)
    )
    .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));

  console.log(`🎯 Final result: ${uniqueStocks.length} unique Indian stocks`);
  return uniqueStocks;
}

/**
 * Get popular Indian stocks for display
 */
export function getPopularIndianStocks(): string[] {
  return [
    // Nifty 50 top stocks
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS',
    'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'ASIANPAINT.NS',
    'MARUTI.NS', 'LT.NS', 'KOTAKBANK.NS', 'AXISBANK.NS', 'BAJFINANCE.NS',
    'WIPRO.NS', 'NESTLEIND.NS', 'ULTRACEMCO.NS', 'TITAN.NS', 'SUNPHARMA.NS',
    'POWERGRID.NS', 'NTPC.NS', 'TECHM.NS', 'HCLTECH.NS', 'COALINDIA.NS',
    'TATAMOTORS.NS', 'TATASTEEL.NS', 'ONGC.NS', 'INDUSINDBK.NS', 'BAJAJFINSV.NS',
    
    // Additional popular stocks
    'ADANIPORTS.NS', 'ADANIENT.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 'GRASIM.NS',
    'HEROMOTOCO.NS', 'HINDALCO.NS', 'JSWSTEEL.NS', 'M&M.NS', 'BRITANNIA.NS',
    'CIPLA.NS', 'DIVISLAB.NS', 'SHREECEM.NS', 'TATACONSUM.NS', 'BPCL.NS',
    'UPL.NS', 'APOLLOHOSP.NS', 'LTIM.NS', 'SBILIFE.NS', 'BAJAJ-AUTO.NS'
  ];
}

/**
 * Cache management for better performance
 */
export class StockCache {
  private static cache: Map<string, { data: IndianStock[], timestamp: number }> = new Map();
  private static CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  static async get(key: string): Promise<IndianStock[] | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log(`📋 Using cached data for ${key}`);
      return cached.data;
    }
    return null;
  }

  static set(key: string, data: IndianStock[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    console.log(`💾 Cached ${data.length} stocks for ${key}`);
  }

  static clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }
}
