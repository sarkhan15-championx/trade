import { NextResponse } from 'next/server';
import { getAllStocks } from '@/lib/stockService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sector = searchParams.get('sector');
    
    console.log(`🔄 API: Fetching stocks with limit=${limit}, offset=${offset}, sector=${sector}`);
    
    let allStocks = await getAllStocks();
    
    // Filter by sector if specified
    if (sector) {
      allStocks = allStocks.filter(stock => 
        stock.sector?.toLowerCase() === sector.toLowerCase()
      );
    }
    
    // Apply pagination
    const totalCount = allStocks.length;
    const paginatedStocks = allStocks.slice(offset, offset + limit);
    
    console.log(`✅ API: Returning ${paginatedStocks.length} stocks out of ${totalCount} total`);
    
    return NextResponse.json({
      stocks: paginatedStocks,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        source: 'Live API Data'
      }
    });
  } catch (error) {
    console.error('❌ Error in all stocks API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch stocks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
