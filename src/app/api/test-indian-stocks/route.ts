import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the stocks API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stocks?limit=10`);
    const data = await response.json();
    
    return NextResponse.json({
      message: 'Stocks API Test',
      apiWorking: response.ok,
      stocksCount: data.total || 0,
      sampleStocks: data.data?.slice(0, 5) || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Indian Stocks API Test Failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
