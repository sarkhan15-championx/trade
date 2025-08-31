export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  high52Week?: number;
  low52Week?: number;
}

export interface TechnicalIndicators {
  ema: { [key: string]: number };
  sma: { [key: string]: number };
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  mfi: number;
  atr: number;
}

export interface TradingSignal {
  symbol: string;
  timeframe: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  indicators: TechnicalIndicators;
  reasons: string[];
  timestamp: number;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type TimeFrame = '15m' | '30m' | '1h' | '4h' | '1d';

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: number;
}
