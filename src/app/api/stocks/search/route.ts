import { NextResponse } from 'next/server';
import { searchStocks } from '@/lib/stockService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }
    
    const results = await searchStocks(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error in stock search API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
