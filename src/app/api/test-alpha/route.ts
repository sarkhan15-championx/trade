import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';
  
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
    );
    
    const data = await response.json();
    
    return NextResponse.json({
      apiKey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
      responseKeys: Object.keys(data),
      fullResponse: data,
      hasTimeSeries: !!data['Time Series (Daily)'],
      errorMessage: data['Error Message'] || data['Note'] || null
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
