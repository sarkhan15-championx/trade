import { NextResponse } from 'next/server';
import { getMarketOverview } from '@/lib/stockService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') as 'India' | 'both' || 'India';
    
    console.log(`Fetching market overview for ${market === 'India' ? '40' : '50'} stocks`);
    const overview = await getMarketOverview(market);
    
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching market overview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
