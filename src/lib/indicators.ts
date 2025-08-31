import { ChartData, TechnicalIndicators } from '@/types';

/**
 * Calculate Simple Moving Average (SMA)
 */
export function calculateSMA(data: number[], period: number): number[] {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function calculateEMA(data: number[], period: number): number[] {
  const ema = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA value is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  ema.push(sum / period);
  
  // Calculate subsequent EMA values
  for (let i = period; i < data.length; i++) {
    const current: number = data[i] * multiplier + ema[ema.length - 1] * (1 - multiplier);
    ema.push(current);
  }
  
  return ema;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50; // Default neutral value
  
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  const macdLine = [];
  const minLength = Math.min(fastEMA.length, slowEMA.length);
  
  for (let i = 0; i < minLength; i++) {
    macdLine.push(fastEMA[fastEMA.length - minLength + i] - slowEMA[slowEMA.length - minLength + i]);
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine.slice(-signalLine.length).map((macd, i) => macd - signalLine[i]);
  
  return {
    macd: macdLine[macdLine.length - 1] || 0,
    signal: signalLine[signalLine.length - 1] || 0,
    histogram: histogram[histogram.length - 1] || 0,
  };
}

/**
 * Calculate Money Flow Index (MFI)
 */
export function calculateMFI(chartData: ChartData[], period: number = 14): number {
  if (chartData.length < period + 1) return 50; // Default neutral value
  
  const typicalPrices = chartData.map(d => (d.high + d.low + d.close) / 3);
  const moneyFlows = [];
  
  for (let i = 1; i < chartData.length; i++) {
    const currentTypical = typicalPrices[i];
    const previousTypical = typicalPrices[i - 1];
    const volume = chartData[i].volume;
    
    if (currentTypical > previousTypical) {
      moneyFlows.push(currentTypical * volume); // Positive money flow
    } else if (currentTypical < previousTypical) {
      moneyFlows.push(-(currentTypical * volume)); // Negative money flow
    } else {
      moneyFlows.push(0);
    }
  }
  
  const recentFlows = moneyFlows.slice(-period);
  const positiveFlow = recentFlows.filter(f => f > 0).reduce((a, b) => a + b, 0);
  const negativeFlow = Math.abs(recentFlows.filter(f => f < 0).reduce((a, b) => a + b, 0));
  
  if (negativeFlow === 0) return 100;
  
  const moneyFlowRatio = positiveFlow / negativeFlow;
  return 100 - (100 / (1 + moneyFlowRatio));
}

/**
 * Calculate Average True Range (ATR)
 */
export function calculateATR(chartData: ChartData[], period: number = 14): number {
  if (chartData.length < 2) return 0;
  
  const trueRanges = [];
  
  for (let i = 1; i < chartData.length; i++) {
    const current = chartData[i];
    const previous = chartData[i - 1];
    
    const tr1 = current.high - current.low;
    const tr2 = Math.abs(current.high - previous.close);
    const tr3 = Math.abs(current.low - previous.close);
    
    trueRanges.push(Math.max(tr1, tr2, tr3));
  }
  
  const recentTRs = trueRanges.slice(-period);
  return recentTRs.reduce((a, b) => a + b, 0) / recentTRs.length;
}

/**
 * Calculate all technical indicators for a stock
 */
export function calculateTechnicalIndicators(chartData: ChartData[]): TechnicalIndicators {
  const closePrices = chartData.map(d => d.close);
  
  return {
    ema: {
      '12': calculateEMA(closePrices, 12).slice(-1)[0] || 0,
      '26': calculateEMA(closePrices, 26).slice(-1)[0] || 0,
      '50': calculateEMA(closePrices, 50).slice(-1)[0] || 0,
    },
    sma: {
      '20': calculateSMA(closePrices, 20).slice(-1)[0] || 0,
      '50': calculateSMA(closePrices, 50).slice(-1)[0] || 0,
      '200': calculateSMA(closePrices, 200).slice(-1)[0] || 0,
    },
    rsi: calculateRSI(closePrices),
    macd: calculateMACD(closePrices),
    mfi: calculateMFI(chartData),
    atr: calculateATR(chartData),
  };
}
