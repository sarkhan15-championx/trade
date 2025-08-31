import { getChartData } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
  
  try {
    console.log('Testing chart data for symbol:', symbol);
    const result = await getChartData(symbol, '1d');
    
    return NextResponse.json({
      success: result.success,
      dataLength: result.data?.length || 0,
      firstDataPoint: result.data?.[0] || null,
      lastDataPoint: result.data?.[result.data?.length - 1] || null,
      error: result.error || null
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
