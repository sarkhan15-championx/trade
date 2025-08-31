import { NextResponse } from 'next/server';
import { getMultipleStockPrices, getStockPrice } from '@/lib/stockService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (symbol) {
      // Get single stock price
      const price = await getStockPrice(symbol);
      if (price) {
        return NextResponse.json(price);
      } else {
        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in stocks API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbols } = body;
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: 'Symbols array required' }, { status: 400 });
    }
    
    console.log('Fetching real-time prices for symbols:', symbols);
    const prices = await getMultipleStockPrices(symbols);
    
    // Filter out null results (stocks with no real-time data)
    const validPrices = prices.filter(price => price !== null && price.price > 0);
    
    if (validPrices.length === 0) {
      return NextResponse.json({ error: 'No real-time data available for requested stocks' }, { status: 404 });
    }
    
    return NextResponse.json(validPrices);
  } catch (error) {
    console.error('Error fetching multiple stock prices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
