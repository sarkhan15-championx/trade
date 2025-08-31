// Advanced trading signal analysis based on market structure, volume, and candlestick patterns
import { StockPrice } from './stockService';
import { analyzeNewsForStock, NewsAnalysis } from './newsAnalysis';

export interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CHOCHPattern {
  type: 'bullish' | 'bearish';
  strength: number;
  timeframe: string;
  level: number;
  aggressiveness: number;
}

export interface BOSPattern {
  type: 'bullish' | 'bearish';
  confirmed: boolean;
  timeframe: string;
  level: number;
}

export interface VolumeAnalysis {
  absorption: 'buy' | 'sell' | 'none';
  divergence: 'bullish' | 'bearish' | 'none';
  climax: boolean;
  fakeout: boolean;
}

export interface FakeoutSignal {
  detected: boolean;
  type: 'breakout_failure' | 'inside_candle' | 'spring' | 'volume_climax';
  confidence: number;
}

export interface TradingSignal {
  timeframe: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  reason: string[];
  choch?: CHOCHPattern;
  bos?: BOSPattern;
  volume?: VolumeAnalysis;
  fakeout?: FakeoutSignal;
  newsAnalysis?: NewsAnalysis;
  entry?: number;
  stopLoss?: number;
  target?: number;
  indicators?: {
    rsi: number;
    rsiSignal: 'BUY' | 'SELL' | 'NEUTRAL';
    ema9: number;
    ema21: number;
    ema90: number;
    emaSignal: 'BUY' | 'SELL' | 'NEUTRAL';
  };
}

export interface MultiTimeframeAnalysis {
  signals: TradingSignal[];
  overallSignal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  summary: string;
  newsImpact: string;
}

// Market structure analysis
export function detectCHOCH(candles: CandlestickData[], timeframe: string): CHOCHPattern | null {
  if (candles.length < 20) return null;

  const recent = candles.slice(-20);
  
  // Find recent swing highs and lows
  const swingHighs = findSwingPoints(recent, 'high');
  const swingLows = findSwingPoints(recent, 'low');

// Helper functions for finding swing points
function findSwingPoints(candles: CandlestickData[], type: 'high' | 'low'): Array<{index: number, value: number}> {
  const points: Array<{index: number, value: number}> = [];
  const period = 3;
  
  for (let i = period; i < candles.length - period; i++) {
    const current = type === 'high' ? candles[i].high : candles[i].low;
    let isSwingPoint = true;
    
    for (let j = i - period; j <= i + period; j++) {
      if (j === i) continue;
      const compare = type === 'high' ? candles[j].high : candles[j].low;
      
      if (type === 'high' && compare >= current) {
        isSwingPoint = false;
        break;
      } else if (type === 'low' && compare <= current) {
        isSwingPoint = false;
        break;
      }
    }
    
    if (isSwingPoint) {
      points.push({ index: i, value: current });
    }
  }
  
  return points;
}

// Calculate aggressiveness of price movement
function calculateAggressiveness(candles: CandlestickData[], type: 'bullish' | 'bearish'): number {
  const recent = candles.slice(-10);
  let aggressiveness = 0;
  
  for (const candle of recent) {
    const bodySize = Math.abs(candle.close - candle.open);
    const totalRange = candle.high - candle.low;
    const bodyPercent = bodySize / totalRange;
    
    if (type === 'bullish' && candle.close > candle.open) {
      aggressiveness += bodyPercent * 10;
    } else if (type === 'bearish' && candle.close < candle.open) {
      aggressiveness += bodyPercent * 10;
    }
  }
  
  return Math.min(25, aggressiveness);
}

// CHOCH Detection with enhanced overlapping analysis
  if (swingHighs.length >= 3 && swingLows.length >= 3) {
    const recentHighs = swingHighs.slice(-3);
    const recentLows = swingLows.slice(-3);
    
    // 1. Check for CHOCH overlaps - sign of trend strength
    let chochOverlaps = 0;
    let dominantDirection: 'bullish' | 'bearish' | null = null;
    
    // Analyze overlapping CHOCHs
    const [prevHigh, midHigh, lastHigh] = recentHighs;
    const [prevLow, midLow, lastLow] = recentLows;
    
    // Check if we have overlapping CHOCH patterns
    const bigBullishChoch = lastHigh.value > prevHigh.value && lastLow.value > prevLow.value;
    const bigBearishChoch = lastHigh.value < prevHigh.value && lastLow.value < prevLow.value;
    
    const smallBullishChoch = midHigh.value > prevHigh.value && midLow.value > prevLow.value;
    const smallBearishChoch = midHigh.value < prevHigh.value && midLow.value < prevLow.value;
    
    if (bigBullishChoch && smallBullishChoch) {
      // Big bullish CHOCH with small bullish CHOCH inside = strong upward trend
      chochOverlaps = 1;
      dominantDirection = 'bullish';
    } else if (bigBearishChoch && smallBearishChoch) {
      // Big bearish CHOCH with small bearish CHOCH inside = strong downward trend
      chochOverlaps = 1;
      dominantDirection = 'bearish';
    } else if (bigBullishChoch && smallBearishChoch) {
      // Mixed signals - check which is more aggressive (upper vs lower)
      const upperRange = lastHigh.value - prevHigh.value;
      const lowerRange = Math.abs(lastLow.value - prevLow.value);
      chochOverlaps = 0.5;
      dominantDirection = upperRange > lowerRange ? 'bullish' : 'bearish';
    } else if (bigBearishChoch && smallBullishChoch) {
      // Mixed signals - check which is more aggressive (lower vs upper)
      const upperRange = Math.abs(lastHigh.value - prevHigh.value);
      const lowerRange = prevLow.value - lastLow.value;
      chochOverlaps = 0.5;
      dominantDirection = lowerRange > upperRange ? 'bearish' : 'bullish';
    }
    
    if (dominantDirection && chochOverlaps > 0) {
      const baseStrength = 75 + (chochOverlaps * 20);
      const aggressiveness = calculateAggressiveness(recent, dominantDirection);
      
      return {
        type: dominantDirection,
        strength: Math.min(95, baseStrength + aggressiveness),
        timeframe,
        level: dominantDirection === 'bullish' ? lastHigh.value : lastLow.value,
        aggressiveness: aggressiveness + (chochOverlaps * 15)
      };
    }
  }
  
  // Standard CHOCH detection if no overlaps found
  if (swingHighs.length >= 2 && swingLows.length >= 2) {
    const lastHigh = swingHighs[swingHighs.length - 1];
    const prevHigh = swingHighs[swingHighs.length - 2];
    const lastLow = swingLows[swingLows.length - 1];
    const prevLow = swingLows[swingLows.length - 2];
    
    // Bullish CHOCH: Higher high and higher low
    if (lastHigh.value > prevHigh.value && lastLow.value > prevLow.value) {
      const aggressiveness = calculateAggressiveness(recent, 'bullish');
      return {
        type: 'bullish',
        strength: Math.min(95, 70 + aggressiveness),
        timeframe,
        level: lastHigh.value,
        aggressiveness
      };
    }
    
    // Bearish CHOCH: Lower high and lower low
    if (lastHigh.value < prevHigh.value && lastLow.value < prevLow.value) {
      const aggressiveness = calculateAggressiveness(recent, 'bearish');
      return {
        type: 'bearish',
        strength: Math.min(95, 70 + aggressiveness),
        timeframe,
        level: lastLow.value,
        aggressiveness
      };
    }
  }
  
  return null;
}

export function detectBOS(candles: CandlestickData[], choch: CHOCHPattern | null, timeframe: string): BOSPattern | null {
  if (!choch || candles.length < 10) return null;
  
  const recent = candles.slice(-10);
  const currentPrice = recent[recent.length - 1].close;
  
  if (choch.type === 'bullish') {
    // Look for break above previous resistance
    const resistance = Math.max(...recent.slice(0, -3).map(c => c.high));
    if (currentPrice > resistance) {
      return {
        type: 'bullish',
        confirmed: true,
        timeframe,
        level: resistance
      };
    }
  } else {
    // Look for break below previous support
    const support = Math.min(...recent.slice(0, -3).map(c => c.low));
    if (currentPrice < support) {
      return {
        type: 'bearish',
        confirmed: true,
        timeframe,
        level: support
      };
    }
  }
  
  return null;
}

export function analyzeVolume(candles: CandlestickData[]): VolumeAnalysis {
  if (candles.length < 20) {
    return { absorption: 'none', divergence: 'none', climax: false, fakeout: false };
  }
  
  const recent = candles.slice(-20);
  const avgVolume = recent.reduce((sum, c) => sum + c.volume, 0) / recent.length;
  const lastCandle = recent[recent.length - 1];
  const prevCandle = recent[recent.length - 2];
  
  // Enhanced Volume absorption analysis based on your research
  let absorption: 'buy' | 'sell' | 'none' = 'none';
  
  // 1. High Sell Volume + Small Price Drop = Buyers are absorbing → Support Zone
  const redCandleVolume = lastCandle.close < lastCandle.open ? lastCandle.volume : 0;
  const priceDrop = lastCandle.close < lastCandle.open ? lastCandle.open - lastCandle.close : 0;
  const candleRange = lastCandle.high - lastCandle.low;
  
  if (redCandleVolume > avgVolume * 1.8 && 
      priceDrop > 0 && 
      priceDrop < candleRange * 0.4) {
    // Sellers very active but price not falling much → buyers absorbing
    absorption = 'buy'; // Support zone, expect bounce upward
  }
  
  // 2. High Buy Volume + Small Price Rise = Sellers are absorbing → Resistance Zone
  const greenCandleVolume = lastCandle.close > lastCandle.open ? lastCandle.volume : 0;
  const priceRise = lastCandle.close > lastCandle.open ? lastCandle.close - lastCandle.open : 0;
  
  if (greenCandleVolume > avgVolume * 1.8 && 
      priceRise > 0 && 
      priceRise < candleRange * 0.4) {
    // Buyers aggressive but price only rises a little → sellers stopping move
    absorption = 'sell'; // Resistance zone, expect reversal or stall
  }
  
  // Volume divergence analysis - enhanced for early reversal detection
  let divergence: 'bullish' | 'bearish' | 'none' = 'none';
  
  if (recent.length >= 10) {
    const firstHalf = recent.slice(0, 10);
    const secondHalf = recent.slice(10);
    
    const firstHighs = firstHalf.map(c => c.high);
    const secondHighs = secondHalf.map(c => c.high);
    const firstLows = firstHalf.map(c => c.low);
    const secondLows = secondHalf.map(c => c.low);
    
    const firstMaxHigh = Math.max(...firstHighs);
    const secondMaxHigh = Math.max(...secondHighs);
    const firstMinLow = Math.min(...firstLows);
    const secondMinLow = Math.min(...secondLows);
    
    const firstVolAvg = firstHalf.reduce((sum, c) => sum + c.volume, 0) / firstHalf.length;
    const secondVolAvg = secondHalf.reduce((sum, c) => sum + c.volume, 0) / secondHalf.length;
    
    // Price makes higher highs but volume falls = Bearish divergence
    if (secondMaxHigh > firstMaxHigh && secondVolAvg < firstVolAvg * 0.8) {
      divergence = 'bearish'; // Trend losing strength, hidden reversal signal
    }
    
    // Price makes lower lows but volume falls = Bullish divergence  
    if (secondMinLow < firstMinLow && secondVolAvg < firstVolAvg * 0.8) {
      divergence = 'bullish'; // Trend losing strength, hidden reversal signal
    }
  }
  
  // Volume climax detection - sudden huge spike
  const climax = lastCandle.volume > avgVolume * 3;
  
  // 3. Low Volume + Big Price Move = Weak Move, Fakeout potential
  const bigPriceMove = Math.abs(lastCandle.close - lastCandle.open) > candleRange * 0.7;
  const lowVolume = lastCandle.volume < avgVolume * 0.6;
  
  // 4. Low Volume + Big Red Candle = Stop-Hunt or Liquidity Grab
  const bigRedCandle = lastCandle.close < lastCandle.open && 
                      priceDrop > candleRange * 0.6;
  
  const fakeout = (bigPriceMove && lowVolume) || (bigRedCandle && lowVolume);
  
  return { absorption, divergence, climax, fakeout };
}

export function detectFakeout(candles: CandlestickData[]): FakeoutSignal {
  if (candles.length < 5) {
    return { detected: false, type: 'breakout_failure', confidence: 0 };
  }
  
  const recent = candles.slice(-5);
  const [candle1, candle2, candle3, candle4, candle5] = recent;
  
  // Helper functions
  const getCandleBodySize = (candle: CandlestickData) => Math.abs(candle.close - candle.open);
  const getCandleRange = (candle: CandlestickData) => candle.high - candle.low;
  const isRedCandle = (candle: CandlestickData) => candle.close < candle.open;
  const isGreenCandle = (candle: CandlestickData) => candle.close > candle.open;
  const getUpperWick = (candle: CandlestickData) => candle.high - Math.max(candle.open, candle.close);
  const getLowerWick = (candle: CandlestickData) => Math.min(candle.open, candle.close) - candle.low;
  const avgVolume = recent.slice(0, 4).reduce((sum, c) => sum + c.volume, 0) / 4;

  // 1. Inside Candle Fakeout
  if (recent.length >= 3) {
    const [first, second, third] = [candle3, candle4, candle5];
    
    // First candle = Big Red → sets range (high & low)
    if (isRedCandle(first) && getCandleBodySize(first) > getCandleRange(first) * 0.7) {
      // Second candle = Green, completely inside red candle, with lower volume → compression
      if (isGreenCandle(second) && 
          second.high <= first.high && 
          second.low >= first.low &&
          second.volume < first.volume * 0.8) {
        
        // Entry trigger = Next candle breaks above green high with volume → BUY
        if (third.high > second.high && third.volume > second.volume * 1.2) {
          return {
            detected: false, // This is actually a valid breakout signal
            type: 'inside_candle',
            confidence: 85
          };
        }
      }
    }
  }

  // 2. Bearish Engulfing with Volume
  if (recent.length >= 3) {
    const [green, red1, red2] = [candle3, candle4, candle5];
    
    // A red candle fully engulfs green candle, with high volume
    if (isGreenCandle(green) && 
        isRedCandle(red1) &&
        red1.open >= green.high &&
        red1.close <= green.low &&
        red1.volume > green.volume * 1.5) {
      
      // Followed by another red candle = confirms sellers in control
      if (isRedCandle(red2)) {
        return {
          detected: false, // This is a valid bearish signal
          type: 'inside_candle',
          confidence: 90
        };
      }
    }
  }

  // 3. Volume Climax + Wick Reversal
  const lastCandle = candle5;
  const upperWick = getUpperWick(lastCandle);
  const lowerWick = getLowerWick(lastCandle);
  const candleRange = getCandleRange(lastCandle);
  
  if (lastCandle.volume > avgVolume * 2) { // Huge volume spike
    // Long upper wick rejection (wick > 50% of range)
    if (upperWick > candleRange * 0.5) {
      return {
        detected: true,
        type: 'volume_climax',
        confidence: 80
      };
    }
    
    // Long lower wick rejection (wick > 50% of range)
    if (lowerWick > candleRange * 0.5) {
      return {
        detected: true,
        type: 'volume_climax',
        confidence: 80
      };
    }
  }

  // 4. Low Volume Breakout = Fakeout
  const prevHigh = Math.max(...recent.slice(0, 4).map(c => c.high));
  const prevLow = Math.min(...recent.slice(0, 4).map(c => c.low));
  
  if (lastCandle.high > prevHigh && lastCandle.volume < avgVolume * 0.8) {
    return {
      detected: true,
      type: 'breakout_failure',
      confidence: 75
    };
  }
  
  if (lastCandle.low < prevLow && lastCandle.volume < avgVolume * 0.8) {
    return {
      detected: true,
      type: 'breakout_failure',
      confidence: 75
    };
  }

  // 5. Inside Candle + Volume Drop
  if (recent.length >= 2) {
    const prev = candle4;
    const current = candle5;
    
    // Price compression inside bar + falling volume → expect breakout with volume spike
    if (current.high <= prev.high && 
        current.low >= prev.low && 
        current.volume < prev.volume * 0.7) {
      return {
        detected: false, // Compression, expect breakout
        type: 'inside_candle',
        confidence: 60
      };
    }
  }

  // 6. Volume Divergence
  if (recent.length >= 4) {
    const highs = recent.map(c => c.high);
    const volumes = recent.map(c => c.volume);
    
    // Price makes higher highs but volume falls = Bearish divergence
    if (highs[3] > highs[1] && highs[3] > highs[0] && 
        volumes[3] < volumes[1] && volumes[3] < volumes[0]) {
      return {
        detected: true,
        type: 'breakout_failure',
        confidence: 70
      };
    }
    
    const lows = recent.map(c => c.low);
    // Price makes lower lows but volume falls = Bullish divergence
    if (lows[3] < lows[1] && lows[3] < lows[0] && 
        volumes[3] < volumes[1] && volumes[3] < volumes[0]) {
      return {
        detected: true,
        type: 'breakout_failure',
        confidence: 70
      };
    }
  }

  // 7. Spring / Shakeout (Fake Breakdown + Recovery)
  if (recent.length >= 3) {
    const [support, breakdown, recovery] = [candle3, candle4, candle5];
    
    // Price breaks support/resistance with high volume → immediately reverses
    if (breakdown.low < support.low && 
        breakdown.volume > avgVolume * 1.5 &&
        recovery.close > breakdown.high &&
        recovery.close > support.low) {
      return {
        detected: true,
        type: 'spring',
        confidence: 85
      };
    }
    
    // Similar logic for resistance test
    if (breakdown.high > support.high && 
        breakdown.volume > avgVolume * 1.5 &&
        recovery.close < breakdown.low &&
        recovery.close < support.high) {
      return {
        detected: true,
        type: 'spring',
        confidence: 85
      };
    }
  }

  return { detected: false, type: 'breakout_failure', confidence: 0 };
}

// Calculate Average True Range (ATR) for realistic targets
function calculateATR(candles: CandlestickData[]): number {
  if (candles.length < 2) return candles[0]?.high - candles[0]?.low || 1;
  
  let atrSum = 0;
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];
    
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    
    atrSum += tr;
  }
  
  return atrSum / (candles.length - 1);
}

// Calculate RSI (Relative Strength Index)
function calculateRSI(candles: CandlestickData[], period: number = 14): number {
  debugger;
  console.log("=== RSI CALCULATION DEBUG ===");
  console.log("Input candles length:", candles.length);
  console.log("Period:", period);
  console.log("First 5 candles:", candles.slice(0, 5));
  console.log("Last 5 candles:", candles.slice(-5));
  if (candles.length < period + 1) return 50; // Neutral if not enough data
  
  let gains = 0;
  let losses = 0;
  console.log("candles",candles);
  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = candles[i].close - candles[i - 1].close;
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
    console.log("Initial Average Gain:", avgGain.toFixed(4));
  console.log("Initial Average Loss:", avgLoss.toFixed(4));
    console.log("=== WILDER'S SMOOTHING ===");

  // Continue with Wilder's smoothing for remaining data
  for (let i = period + 1; i < candles.length; i++) {
    const change = candles[i].close - candles[i - 1].close;
    
    if (change > 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = ((avgLoss * (period - 1)) + Math.abs(change)) / period;
    }
  }
  
  if (avgLoss === 0) return 100; // Prevent division by zero
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
    console.log("Final RS (Relative Strength):", rs.toFixed(4));
  console.log("Final RSI:", rsi.toFixed(2));
  console.log("=== END RSI CALCULATION ===");

  return Math.round(rsi * 100) / 100;
}

// Calculate Exponential Moving Average (EMA)
function calculateEMA(candles: CandlestickData[], period: number): number {
  if (candles.length < period) return candles[candles.length - 1]?.close || 0;
  
  const multiplier = 2 / (period + 1);
  let ema = candles[period - 1].close; // Start with SMA for first EMA value
  
  // Calculate SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  ema = sum / period;
  
  // Calculate EMA for remaining values
  for (let i = period; i < candles.length; i++) {
    ema = (candles[i].close * multiplier) + (ema * (1 - multiplier));
  }
  
  return Math.round(ema * 100) / 100;
}

// Analyze technical indicators (RSI + EMA)
function analyzeTechnicalIndicators(candles: CandlestickData[]): {
  rsi: number;
  rsiSignal: 'BUY' | 'SELL' | 'NEUTRAL';
  ema9: number;
  ema21: number;
  ema90: number;
  emaSignal: 'BUY' | 'SELL' | 'NEUTRAL';
  combinedSignal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  reasons: string[];
} {
  console.log("🔍 analyzeTechnicalIndicators called with", candles.length, "candles");
  const reasons: string[] = [];
  
  // Calculate RSI
  const rsi = calculateRSI(candles, 14);
  let rsiSignal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  
  if (rsi < 30) {
    rsiSignal = 'BUY';
    reasons.push(`📉 RSI OVERSOLD: ${rsi.toFixed(1)} - Strong BUY signal`);
  } else if (rsi > 70) {
    rsiSignal = 'SELL';
    reasons.push(`📈 RSI OVERBOUGHT: ${rsi.toFixed(1)} - Strong SELL signal`);
  } else {
    reasons.push(`📊 RSI NEUTRAL: ${rsi.toFixed(1)} - No clear signal`);
  }
  
  // Calculate EMAs
  const ema9 = calculateEMA(candles, 9);
  const ema21 = calculateEMA(candles, 21);
  const ema90 = calculateEMA(candles, 90);
  
  let emaSignal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  
  if (ema9 > ema21 && ema21 > ema90) {
    emaSignal = 'BUY';
    reasons.push(`🚀 EMA UPTREND: 9(₹${ema9.toFixed(2)}) > 21(₹${ema21.toFixed(2)}) > 90(₹${ema90.toFixed(2)})`);
  } else if (ema9 < ema21 && ema21 < ema90) {
    emaSignal = 'SELL';
    reasons.push(`📉 EMA DOWNTREND: 9(₹${ema9.toFixed(2)}) < 21(₹${ema21.toFixed(2)}) < 90(₹${ema90.toFixed(2)})`);
  } else {
    reasons.push(`➡️ EMA MIXED: No clear trend - 9(₹${ema9.toFixed(2)}) 21(₹${ema21.toFixed(2)}) 90(₹${ema90.toFixed(2)})`);
  }
  
  // Combine RSI and EMA signals
  let combinedSignal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let confidence = 50;
  
  if (rsiSignal === 'BUY' && emaSignal === 'BUY') {
    combinedSignal = 'BUY';
    confidence = 85;
    reasons.push(`🔥 STRONG BUY: RSI + EMA both bullish`);
  } else if (rsiSignal === 'SELL' && emaSignal === 'SELL') {
    combinedSignal = 'SELL';
    confidence = 85;
    reasons.push(`🔥 STRONG SELL: RSI + EMA both bearish`);
  } else if (rsiSignal !== 'NEUTRAL' && emaSignal === 'NEUTRAL') {
    combinedSignal = rsiSignal;
    confidence = 65;
    reasons.push(`⚖️ MODERATE ${rsiSignal}: RSI signal with neutral EMA`);
  } else if (rsiSignal === 'NEUTRAL' && emaSignal !== 'NEUTRAL') {
    combinedSignal = emaSignal;
    confidence = 65;
    reasons.push(`⚖️ MODERATE ${emaSignal}: EMA signal with neutral RSI`);
  } else if (rsiSignal !== 'NEUTRAL' && emaSignal !== 'NEUTRAL' && rsiSignal !== emaSignal) {
    combinedSignal = 'NEUTRAL';
    confidence = 40;
    reasons.push(`⚠️ CONFLICTING: RSI says ${rsiSignal}, EMA says ${emaSignal}`);
  }
  
  return {
    rsi,
    rsiSignal,
    ema9,
    ema21,
    ema90,
    emaSignal,
    combinedSignal,
    confidence,
    reasons
  };
}

// Calculate realistic entry, target, and stop-loss based on timeframe and volatility
function calculateEntryTargetStopLoss(
  signal: 'BUY' | 'SELL' | 'NEUTRAL',
  currentPrice: number,
  timeframe: string,
  candles: CandlestickData[]
): { entry: number; target: number; stopLoss: number } {
  if (signal === 'NEUTRAL' || candles.length < 20) {
    return { entry: currentPrice, target: currentPrice, stopLoss: currentPrice };
  }

  // Calculate recent volatility (ATR - Average True Range)
  const atr = calculateATR(candles.slice(-14)); // 14-period ATR
  
  // Calculate recent support/resistance levels
  const recentData = candles.slice(-20);
  const highs = recentData.map(d => d.high);
  const lows = recentData.map(d => d.low);
  const resistance = Math.max(...highs);
  const support = Math.min(...lows);
  
  // Timeframe-based multipliers for realistic targets
  const timeframeMultipliers = {
    '15m': { target: 0.5, stopLoss: 0.3 }, // Tight for scalping
    '30m': { target: 0.7, stopLoss: 0.4 }, // Short-term swings
    '1h': { target: 1.0, stopLoss: 0.5 },  // Intraday trades
    '4h': { target: 1.5, stopLoss: 0.8 },  // Swing trades
    '1d': { target: 2.0, stopLoss: 1.0 }   // Position trades
  };

  const multiplier = timeframeMultipliers[timeframe as keyof typeof timeframeMultipliers] || 
                   timeframeMultipliers['1h'];

  if (signal === 'BUY') {
    // For BUY signals
    const entry = currentPrice;
    
    // Target: Use ATR-based calculation with timeframe adjustment
    const targetDistance = atr * multiplier.target;
    let target = entry + targetDistance;
    
    // Don't set target beyond nearby resistance
    if (target > resistance && resistance > entry) {
      target = resistance * 0.98; // 2% below resistance for safety
    }
    
    // Stop Loss: Below recent support or ATR-based
    const stopLossDistance = atr * multiplier.stopLoss;
    let stopLoss = entry - stopLossDistance;
    
    // Use support level if it's closer and makes sense
    if (support < entry && (entry - support) < stopLossDistance) {
      stopLoss = support * 0.98; // 2% below support
    }
    
    return {
      entry: Math.round(entry * 100) / 100,
      target: Math.round(target * 100) / 100,
      stopLoss: Math.round(stopLoss * 100) / 100
    };
  } 
  
  if (signal === 'SELL') {
    // For SELL signals
    const entry = currentPrice;
    
    // Target: Use ATR-based calculation with timeframe adjustment
    const targetDistance = atr * multiplier.target;
    let target = entry - targetDistance;
    
    // Don't set target beyond nearby support
    if (target < support && support < entry) {
      target = support * 1.02; // 2% above support for safety
    }
    
    // Stop Loss: Above recent resistance or ATR-based
    const stopLossDistance = atr * multiplier.stopLoss;
    let stopLoss = entry + stopLossDistance;
    
    // Use resistance level if it's closer and makes sense
    if (resistance > entry && (resistance - entry) < stopLossDistance) {
      stopLoss = resistance * 1.02; // 2% above resistance
    }
    
    return {
      entry: Math.round(entry * 100) / 100,
      target: Math.round(target * 100) / 100,
      stopLoss: Math.round(stopLoss * 100) / 100
    };
  }

  return { entry: currentPrice, target: currentPrice, stopLoss: currentPrice };
}

export async function generateTradingSignal(
  candles: CandlestickData[], 
  timeframe: string,
  stockPrice: StockPrice
): Promise<TradingSignal> {
  
  console.log("🚀 GENERATE TRADING SIGNAL CALLED!");
  console.log("Stock:", stockPrice.symbol, "Timeframe:", timeframe);
  console.log("Candles length:", candles.length);
  console.log("First few candles:", candles.slice(0, 3));
  
  // STEP 1: TECHNICAL ANALYSIS ONLY (Chart-based signals)
  let technicalSignal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let technicalConfidence = 50;
  const reasons: string[] = [];
  
  // Market structure analysis with real data
  const choch = detectCHOCH(candles, timeframe);
  const bos = detectBOS(candles, choch, timeframe);
  const volume = analyzeVolume(candles);
  const fakeout = detectFakeout(candles);
  
  // Technical BUY Logic - Based on CHOCH, BOS, Volume, Fakeouts
  if (choch?.type === 'bullish') {
    if (choch.aggressiveness > 15) {
      reasons.push(`🚀 STRONG BULLISH CHOCH: ${choch.strength}% strength - aggressive uptrend`);
      technicalConfidence += 25;
    } else {
      reasons.push(`🟢 Bullish CHOCH: ${choch.strength}% strength - higher highs confirmed`);
      technicalConfidence += 20;
    }
    
    if (bos?.type === 'bullish' && bos.confirmed) {
      reasons.push(`✅ BULLISH BOS: Resistance broken at ₹${bos.level.toFixed(2)}`);
      technicalConfidence += 15;
    }
    
    if (volume.absorption === 'buy') {
      reasons.push(`📈 BUYING ABSORPTION: Smart money accumulating`);
      technicalConfidence += 12;
    }
    
    if (volume.divergence === 'bullish') {
      reasons.push(`📊 BULLISH DIVERGENCE: Volume increasing with price`);
      technicalConfidence += 10;
    }
    
    if (technicalConfidence >= 70) {
      technicalSignal = 'BUY';
    }
  }
  
  // Technical SELL Logic
  if (choch?.type === 'bearish') {
    if (choch.aggressiveness > 15) {
      reasons.push(`🔴 STRONG BEARISH CHOCH: ${choch.strength}% strength - aggressive downtrend`);
      technicalConfidence += 25;
    } else {
      reasons.push(`🔻 Bearish CHOCH: ${choch.strength}% strength - lower lows confirmed`);
      technicalConfidence += 20;
    }
    
    if (bos?.type === 'bearish' && bos.confirmed) {
      reasons.push(`❌ BEARISH BOS: Support broken at ₹${bos.level.toFixed(2)}`);
      technicalConfidence += 15;
    }
    
    if (volume.absorption === 'sell') {
      reasons.push(`📉 SELLING ABSORPTION: Smart money distributing`);
      technicalConfidence += 12;
    }
    
    if (volume.divergence === 'bearish') {
      reasons.push(`📊 BEARISH DIVERGENCE: Volume declining with price rise`);
      technicalConfidence += 10;
    }
    
    if (technicalConfidence >= 70) {
      technicalSignal = 'SELL';
    }
  }
  
  // Fakeout adjustments
  if (fakeout.detected && fakeout.confidence > 75) {
    if (fakeout.type === 'breakout_failure') {
      if (technicalSignal === 'BUY') {
        technicalSignal = 'SELL';
        reasons.push(`🔄 FAKEOUT REVERSAL: Breakout failed - now SELL`);
      } else if (technicalSignal === 'SELL') {
        technicalSignal = 'BUY';
        reasons.push(`🔄 FAKEOUT REVERSAL: Breakdown failed - now BUY`);
      }
    }
  }

  // STEP 1.5: TECHNICAL INDICATORS ANALYSIS (RSI + EMA)
  console.log("🔍 About to call analyzeTechnicalIndicators with", candles.length, "candles");
  const indicators = analyzeTechnicalIndicators(candles);
  console.log("✅ analyzeTechnicalIndicators completed, got:", indicators);
  reasons.push(...indicators.reasons);
  
  // Combine chart analysis with technical indicators
  let combinedTechnicalSignal = technicalSignal;
  let combinedTechnicalConfidence = technicalConfidence;
  
  if (technicalSignal === indicators.combinedSignal) {
    // Both agree - strengthen the signal
    combinedTechnicalConfidence = Math.min(95, technicalConfidence + 15);
    reasons.push(`💪 CONFLUENCE: Chart + Indicators both agree on ${technicalSignal}`);
  } else if (technicalSignal === 'NEUTRAL' && indicators.combinedSignal !== 'NEUTRAL') {
    // Chart neutral but indicators have signal
    combinedTechnicalSignal = indicators.combinedSignal;
    combinedTechnicalConfidence = indicators.confidence;
    reasons.push(`📊 INDICATOR DRIVEN: Chart neutral, following ${indicators.combinedSignal} indicators`);
  } else if (technicalSignal !== 'NEUTRAL' && indicators.combinedSignal === 'NEUTRAL') {
    // Chart has signal but indicators neutral - reduce confidence
    combinedTechnicalConfidence = Math.max(40, technicalConfidence - 10);
    reasons.push(`⚖️ WEAK SIGNAL: Chart ${technicalSignal} but indicators neutral`);
  } else if (technicalSignal !== 'NEUTRAL' && indicators.combinedSignal !== 'NEUTRAL' && 
             technicalSignal !== indicators.combinedSignal) {
    // Conflicting signals - go neutral
    combinedTechnicalSignal = 'NEUTRAL';
    combinedTechnicalConfidence = 45;
    reasons.push(`⚠️ CONFLICT: Chart says ${technicalSignal}, Indicators say ${indicators.combinedSignal} - staying NEUTRAL`);
  }

  // STEP 2: NEWS ANALYSIS (Only if available)
  let finalSignal = combinedTechnicalSignal;
  let finalConfidence = combinedTechnicalConfidence;
  
  try {
    const newsAnalysis = await analyzeNewsForStock(stockPrice);
    
    if (newsAnalysis && newsAnalysis.overallSentiment !== 'neutral') {
      reasons.push(`📰 NEWS DETECTED: ${newsAnalysis.overallSentiment.toUpperCase()} sentiment (${newsAnalysis.sentimentScore.toFixed(1)}%)`);
      
      // Apply logic: Combined Technical (Chart + Indicators) + News
      if (combinedTechnicalSignal === 'BUY' && newsAnalysis.overallSentiment === 'bullish') {
        finalSignal = 'BUY';
        finalConfidence = Math.min(95, combinedTechnicalConfidence + 15);
        reasons.push(`🔥 STRONG BUY: Technical BUY + Positive News = Strong BUY`);
        
      } else if (combinedTechnicalSignal === 'BUY' && newsAnalysis.overallSentiment === 'bearish') {
        finalSignal = 'NEUTRAL';
        finalConfidence = 50;
        reasons.push(`⚠️ NEUTRAL: Technical BUY + Negative News = Avoid`);
        
      } else if (combinedTechnicalSignal === 'SELL' && newsAnalysis.overallSentiment === 'bearish') {
        finalSignal = 'SELL';
        finalConfidence = Math.min(95, combinedTechnicalConfidence + 15);
        reasons.push(`🔥 STRONG SELL: Technical SELL + Negative News = Strong SELL`);
        
      } else if (combinedTechnicalSignal === 'SELL' && newsAnalysis.overallSentiment === 'bullish') {
        finalSignal = 'NEUTRAL';
        finalConfidence = 50;
        reasons.push(`⚠️ NEUTRAL: Technical SELL + Positive News = Avoid`);
        
      } else if (combinedTechnicalSignal === 'NEUTRAL' && newsAnalysis.overallSentiment === 'bullish') {
        finalSignal = 'BUY';
        finalConfidence = 60;
        reasons.push(`📈 MILD BUY: Technical Neutral + Positive News = Mild BUY`);
        
      } else if (combinedTechnicalSignal === 'NEUTRAL' && newsAnalysis.overallSentiment === 'bearish') {
        finalSignal = 'SELL';
        finalConfidence = 60;
        reasons.push(`📉 MILD SELL: Technical Neutral + Negative News = Mild SELL`);
      }
    } else {
      reasons.push(`📊 NO NEWS: Using technical analysis (Chart + Indicators) only`);
    }
    
  } catch (error) {
    // If news fails, keep technical analysis
    reasons.push(`📊 NO NEWS AVAILABLE: Using technical analysis (Chart + Indicators) only`);
  }
  
  // Calculate entry, stop loss, and target prices using ATR and timeframe-based logic
  const currentPrice = stockPrice.price;
  const { entry, target, stopLoss } = calculateEntryTargetStopLoss(
    finalSignal,
    currentPrice,
    timeframe,
    candles
  );
  
  return {
    timeframe,
    signal: finalSignal,
    confidence: Math.min(95, Math.max(10, finalConfidence)),
    reason: reasons,
    entry,
    stopLoss,
    target,
    choch: choch || undefined,
    bos: bos || undefined,
    volume,
    fakeout,
    indicators: {
      rsi: indicators.rsi,
      rsiSignal: indicators.rsiSignal,
      ema9: indicators.ema9,
      ema21: indicators.ema21,
      ema90: indicators.ema90,
      emaSignal: indicators.emaSignal
    }
  };
}

// Multi-timeframe analysis
export async function analyzeMultiTimeframe(
  stockPrice: StockPrice,
  chartDataByTimeframe: Record<string, CandlestickData[]>
): Promise<MultiTimeframeAnalysis> {
  const timeframes = ['15m', '30m', '1h', '4h', '1d'];
  const signals: TradingSignal[] = [];
  
  // Generate signals for each timeframe
  for (const timeframe of timeframes) {
    const candles = chartDataByTimeframe[timeframe];
    if (candles && candles.length > 0) {
      const signal = await generateTradingSignal(candles, timeframe, stockPrice);
      signals.push(signal);
    } else {
      // Create neutral signal if no data available
      signals.push({
        timeframe,
        signal: 'NEUTRAL',
        confidence: 0,
        reason: ['No chart data available'],
        entry: stockPrice.price,
        stopLoss: stockPrice.price,
        target: stockPrice.price
      });
    }
  }
  
  // Calculate overall signal based on timeframe weights
  const timeframeWeights: Record<string, number> = {
    '15m': 0.1,
    '30m': 0.15,
    '1h': 0.2,
    '4h': 0.25,
    '1d': 0.5
  };
  
  let buyScore = 0;
  let sellScore = 0;
  let totalWeight = 0;
  
  for (const signal of signals) {
    const weight = timeframeWeights[signal.timeframe] || 0.1;
    
    // Only include non-neutral signals in weight calculation
    if (signal.signal === 'BUY') {
      totalWeight += weight;
      buyScore += weight * (signal.confidence / 100);
    } else if (signal.signal === 'SELL') {
      totalWeight += weight;
      sellScore += weight * (signal.confidence / 100);
    }
    // Skip NEUTRAL signals - don't add to totalWeight
  }
  
  // Determine overall signal
  let overallSignal: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
  let confidence = 50;
  
  // Only calculate confidence if we have non-neutral signals
  if (totalWeight > 0) {
    if (buyScore > sellScore && buyScore > 0.4) {
      overallSignal = 'BUY';
      confidence = Math.min(95, Math.round((buyScore / totalWeight) * 100));
    } else if (sellScore > buyScore && sellScore > 0.4) {
      overallSignal = 'SELL';
      confidence = Math.min(95, Math.round((sellScore / totalWeight) * 100));
    }
  }
  // If totalWeight is 0 (all neutral), keep default NEUTRAL with 50% confidence
  
  // Generate summary
  const buySignals = signals.filter(s => s.signal === 'BUY').length;
  const sellSignals = signals.filter(s => s.signal === 'SELL').length;
  const neutralSignals = signals.filter(s => s.signal === 'NEUTRAL').length;
  
  // Calculate news impact summary from all signals
  const newsImpacts = signals
    .filter(s => s.newsAnalysis)
    .map(s => s.newsAnalysis!)
    .filter(n => n.overallSentiment !== 'neutral');
  
  let newsImpact = 'No significant news impact detected';
  
  if (newsImpacts.length > 0) {
    const avgSentiment = newsImpacts.reduce((sum, news) => sum + news.sentimentScore, 0) / newsImpacts.length;
    const highImpactNews = newsImpacts.filter(news => news.impactLevel === 'high').length;
    
    if (highImpactNews > 0) {
      if (avgSentiment > 20) {
        newsImpact = `📈 POSITIVE NEWS IMPACT: ${highImpactNews} high-impact bullish news affecting signals`;
      } else if (avgSentiment < -20) {
        newsImpact = `📉 NEGATIVE NEWS IMPACT: ${highImpactNews} high-impact bearish news affecting signals`;
      } else {
        newsImpact = `📊 MIXED NEWS IMPACT: Conflicting news sentiment affecting market direction`;
      }
    } else {
      newsImpact = `📰 MODERATE NEWS IMPACT: News sentiment providing directional bias`;
    }
  }
  
  let summary = `${buySignals} BUY, ${sellSignals} SELL, ${neutralSignals} NEUTRAL signals detected. `;
  
  if (overallSignal === 'BUY') {
    summary += 'Bullish consensus across timeframes suggests upward momentum.';
  } else if (overallSignal === 'SELL') {
    summary += 'Bearish consensus across timeframes suggests downward pressure.';
  } else {
    summary += 'Mixed signals suggest market indecision or consolidation.';
  }
  
  return {
    signals,
    overallSignal,
    confidence,
    summary,
    newsImpact
  };
}
