// Real-time news analysis for trading signals
import { StockPrice } from './stockService';

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relevance: number; // 0-100
  keywords: string[];
}

export interface NewsAnalysis {
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number; // -100 to +100
  impactLevel: 'high' | 'medium' | 'low';
  shortTermBias: 'positive' | 'negative' | 'neutral';
  longTermBias: 'positive' | 'negative' | 'neutral';
  newsItems: NewsItem[];
  reasoning: string[];
}

// RSS Feed URLs
const RSS_FEEDS = [
  {
    url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms',
    source: 'Economic Times',
    weight: 0.3
  },
  {
    url: 'https://www.livemint.com/rss/markets',
    source: 'Live Mint',
    weight: 0.25
  },
  {
    url: 'https://www.equitymaster.com/rss/todays-markets.asp',
    source: 'Equity Master Markets',
    weight: 0.2
  },
  {
    url: 'https://www.equitymaster.com/rss/views-on-news.asp',
    source: 'Equity Master Views',
    weight: 0.15
  },
  {
    url: 'https://pulse.zerodha.com/feed.php',
    source: 'Zerodha Pulse',
    weight: 0.1
  }
];

// Market sentiment keywords
const SENTIMENT_KEYWORDS = {
  bullish: [
    'rally', 'surge', 'gains', 'uptrend', 'bullish', 'positive', 'growth', 'expansion',
    'profit', 'earnings beat', 'upgrade', 'buy', 'outperform', 'strong results',
    'record high', 'breakout', 'momentum', 'optimistic', 'recovery', 'boost',
    'dividend', 'bonus', 'merger', 'acquisition', 'partnership', 'contract win',
    'order book', 'expansion plan', 'capacity addition', 'new product launch'
  ],
  bearish: [
    'fall', 'decline', 'crash', 'bear', 'negative', 'loss', 'weak', 'downtrend',
    'sell', 'downgrade', 'underperform', 'miss', 'disappointing', 'concern',
    'risk', 'volatility', 'correction', 'pressure', 'slowdown', 'recession',
    'inflation', 'interest rate hike', 'regulatory action', 'investigation',
    'lawsuit', 'debt', 'liquidity crisis', 'bankruptcy', 'layoffs', 'closure'
  ],
  neutral: [
    'stable', 'unchanged', 'flat', 'sideways', 'consolidation', 'range-bound',
    'mixed', 'cautious', 'wait and watch', 'neutral', 'balanced'
  ]
};

// High impact keywords for urgent news
const HIGH_IMPACT_KEYWORDS = [
  'rbi', 'reserve bank', 'interest rate', 'monetary policy', 'budget', 'union budget',
  'sebi', 'regulatory', 'policy change', 'tax', 'gst', 'crude oil', 'inflation',
  'gdp', 'fiscal deficit', 'current account deficit', 'foreign investment',
  'global markets', 'fed decision', 'geopolitical', 'election', 'covid',
  'lockdown', 'emergency', 'crisis', 'scandal', 'fraud', 'investigation'
];

// Stock-specific keywords for relevance scoring
const getStockKeywords = (stockPrice: StockPrice): string[] => {
  const companyName = stockPrice.name.toLowerCase();
  const symbol = stockPrice.symbol.toLowerCase().replace('.ns', '').replace('.bo', '');
  
  // Extract company keywords
  const keywords = [symbol, companyName];
  
  // Add sector-specific keywords based on common Indian stocks
  const sectorKeywords: Record<string, string[]> = {
    'tcs': ['it', 'software', 'technology', 'tata consultancy'],
    'reliance': ['oil', 'petrochemical', 'telecom', 'jio', 'retail'],
    'hdfcbank': ['banking', 'finance', 'hdfc', 'loan', 'credit'],
    'infy': ['infosys', 'it', 'software', 'technology'],
    'icicibank': ['banking', 'finance', 'icici', 'loan', 'credit'],
    'sbin': ['sbi', 'state bank', 'banking', 'psu bank'],
    'bhartiartl': ['airtel', 'telecom', 'mobile', 'bharti'],
    'kotakbank': ['kotak', 'banking', 'finance'],
    'itc': ['cigarette', 'tobacco', 'fmcg', 'hotels'],
    'maruti': ['automobile', 'car', 'auto', 'suzuki'],
    'tatamotors': ['tata motors', 'automobile', 'car', 'commercial vehicle'],
    'axisbank': ['axis', 'banking', 'finance'],
    'asianpaint': ['paint', 'asian paints', 'home improvement'],
    'nestleind': ['nestle', 'fmcg', 'food', 'maggi'],
    'wipro': ['it', 'software', 'technology'],
    'ongc': ['oil', 'gas', 'petroleum', 'psu'],
    'ntpc': ['power', 'electricity', 'thermal', 'psu'],
    'powergrid': ['power', 'transmission', 'electricity', 'psu'],
    'coalindia': ['coal', 'mining', 'psu'],
    'hindalco': ['aluminium', 'metal', 'mining'],
    'tatasteel': ['steel', 'metal', 'tata'],
    'jswsteel': ['steel', 'metal', 'jsw'],
    'vedl': ['vedanta', 'mining', 'metal', 'oil'],
    'adaniports': ['adani', 'port', 'logistics', 'infrastructure'],
    'adanigreen': ['adani', 'renewable', 'solar', 'green energy'],
    'bajfinance': ['bajaj finance', 'nbfc', 'finance', 'loan'],
    'hcltech': ['hcl', 'it', 'software', 'technology'],
    'techm': ['tech mahindra', 'it', 'software', 'technology'],
    'ltim': ['lti mindtree', 'it', 'software', 'technology'],
    'dmart': ['retail', 'avenue supermarts', 'grocery'],
    'zomato': ['food delivery', 'restaurant', 'online'],
    'paytm': ['fintech', 'payments', 'digital'],
    'nykaa': ['beauty', 'cosmetics', 'e-commerce']
  };
  
  // Add sector keywords if available
  if (sectorKeywords[symbol]) {
    keywords.push(...sectorKeywords[symbol]);
  }
  
  return keywords;
};

// RSS feed parser (requires real implementation with RSS parsing library)
async function fetchRSSFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
  try {
    // TODO: Implement real RSS parsing with a library like rss-parser
    // For now, return empty array since we're removing all mock data
    console.warn(`RSS parsing not implemented for ${source}. Real implementation needed.`);
    return [];
  } catch (error) {
    console.error(`Error fetching RSS feed from ${source}:`, error);
    return [];
  }
}

// Analyze sentiment of news text
function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // Count positive keywords
  SENTIMENT_KEYWORDS.bullish.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 1;
    }
  });
  
  // Count negative keywords
  SENTIMENT_KEYWORDS.bearish.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score -= 1;
    }
  });
  
  // Determine sentiment
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 0) sentiment = 'positive';
  else if (score < 0) sentiment = 'negative';
  
  return { sentiment, score };
}

// Calculate relevance of news to specific stock
function calculateRelevance(newsItem: NewsItem, stockKeywords: string[]): number {
  const text = (newsItem.title + ' ' + newsItem.description).toLowerCase();
  let relevance = 0;
  
  // Check for exact stock keyword matches
  stockKeywords.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      relevance += 20; // High weight for direct mentions
    }
  });
  
  // Check for high impact general market keywords
  HIGH_IMPACT_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      relevance += 10; // Medium weight for market-wide impact
    }
  });
  
  // Base relevance for market news
  if (relevance === 0) {
    relevance = 30; // All market news has some relevance
  }
  
  return Math.min(relevance, 100);
}

// Determine impact level of news
function determineImpact(newsItem: NewsItem): 'high' | 'medium' | 'low' {
  const text = (newsItem.title + ' ' + newsItem.description).toLowerCase();
  
  // High impact keywords
  const hasHighImpact = HIGH_IMPACT_KEYWORDS.some(keyword => text.includes(keyword));
  if (hasHighImpact) return 'high';
  
  // Medium impact for earnings, results, etc.
  const mediumImpactKeywords = ['earnings', 'results', 'guidance', 'profit', 'revenue', 'merger', 'acquisition'];
  const hasMediumImpact = mediumImpactKeywords.some(keyword => text.includes(keyword));
  if (hasMediumImpact) return 'medium';
  
  return 'low';
}

// Main function to analyze news for a specific stock
export async function analyzeNewsForStock(stockPrice: StockPrice): Promise<NewsAnalysis> {
  const stockKeywords = getStockKeywords(stockPrice);
  let allNews: NewsItem[] = [];
  
  // Fetch news from all RSS feeds
  for (const feed of RSS_FEEDS) {
    try {
      const feedNews = await fetchRSSFeed(feed.url, feed.source);
      allNews = allNews.concat(feedNews);
    } catch (error) {
      console.error(`Error fetching from ${feed.source}:`, error);
    }
  }
  
  // Process each news item
  const processedNews: NewsItem[] = allNews.map(item => {
    const sentimentAnalysis = analyzeSentiment(item.title + ' ' + item.description);
    const relevance = calculateRelevance(item, stockKeywords);
    const impact = determineImpact(item);
    
    return {
      ...item,
      sentiment: sentimentAnalysis.sentiment,
      impact,
      relevance,
      keywords: extractKeywords(item.title + ' ' + item.description)
    };
  });
  
  // Filter for relevant news (relevance > 40)
  const relevantNews = processedNews.filter(item => item.relevance > 40);
  
  // Calculate overall sentiment
  let totalSentimentScore = 0;
  let totalWeight = 0;
  
  relevantNews.forEach(item => {
    const weight = item.relevance / 100 * (item.impact === 'high' ? 3 : item.impact === 'medium' ? 2 : 1);
    const sentimentValue = item.sentiment === 'positive' ? 1 : item.sentiment === 'negative' ? -1 : 0;
    
    totalSentimentScore += sentimentValue * weight;
    totalWeight += weight;
  });
  
  const avgSentimentScore = totalWeight > 0 ? (totalSentimentScore / totalWeight) * 100 : 0;
  
  // Determine overall sentiment
  let overallSentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (avgSentimentScore > 20) overallSentiment = 'bullish';
  else if (avgSentimentScore < -20) overallSentiment = 'bearish';
  
  // Determine bias for short-term and long-term
  const shortTermBias = Math.abs(avgSentimentScore) > 30 
    ? (avgSentimentScore > 0 ? 'positive' : 'negative') 
    : 'neutral';
  
  const longTermBias = Math.abs(avgSentimentScore) > 50 
    ? (avgSentimentScore > 0 ? 'positive' : 'negative') 
    : 'neutral';
  
  // Determine impact level
  const hasHighImpactNews = relevantNews.some(item => item.impact === 'high');
  const impactLevel = hasHighImpactNews ? 'high' : 
                     relevantNews.some(item => item.impact === 'medium') ? 'medium' : 'low';
  
  // Generate reasoning
  const reasoning: string[] = [];
  
  if (relevantNews.length === 0) {
    reasoning.push("📰 No significant news found for this stock in recent feeds");
  } else {
    reasoning.push(`📊 Analyzed ${relevantNews.length} relevant news items from ${RSS_FEEDS.length} sources`);
    
    if (overallSentiment === 'bullish') {
      reasoning.push(`📈 POSITIVE NEWS SENTIMENT: Overall bullish tone in recent coverage (${avgSentimentScore.toFixed(1)}% positive)`);
    } else if (overallSentiment === 'bearish') {
      reasoning.push(`📉 NEGATIVE NEWS SENTIMENT: Overall bearish tone in recent coverage (${avgSentimentScore.toFixed(1)}% negative)`);
    } else {
      reasoning.push(`⚖️ NEUTRAL NEWS SENTIMENT: Mixed or balanced coverage in recent news`);
    }
    
    if (shortTermBias !== 'neutral') {
      reasoning.push(`⚡ SHORT-TERM BIAS: ${shortTermBias.toUpperCase()} - Recent news likely to impact immediate price action`);
    }
    
    if (longTermBias !== 'neutral') {
      reasoning.push(`🎯 LONG-TERM BIAS: ${longTermBias.toUpperCase()} - Fundamental news supporting longer-term trend`);
    }
    
    // Add specific news impact points
    const highImpactNews = relevantNews.filter(item => item.impact === 'high');
    if (highImpactNews.length > 0) {
      reasoning.push(`🚨 HIGH IMPACT: ${highImpactNews.length} major market-moving news items detected`);
    }
    
    // Add top news headlines for context
    const topNews = relevantNews
      .sort((a, b) => (b.relevance * (b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1)) - 
                     (a.relevance * (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1)))
      .slice(0, 2);
    
    topNews.forEach(item => {
      reasoning.push(`📄 "${item.title}" - ${item.sentiment.toUpperCase()} impact from ${item.source}`);
    });
  }
  
  return {
    overallSentiment,
    sentimentScore: avgSentimentScore,
    impactLevel,
    shortTermBias,
    longTermBias,
    newsItems: relevantNews,
    reasoning
  };
}

// Helper function to extract keywords
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const keywords: string[] = [];
  
  // Extract all sentiment keywords found
  [...SENTIMENT_KEYWORDS.bullish, ...SENTIMENT_KEYWORDS.bearish, ...HIGH_IMPACT_KEYWORDS].forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}
