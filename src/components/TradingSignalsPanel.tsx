"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  DollarSign,
  Clock,
  BarChart3,
  Volume2,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { StockPrice } from '@/lib/stockService';
import { 
  TradingSignal, 
  MultiTimeframeAnalysis, 
  analyzeMultiTimeframe 
} from '@/lib/tradingSignals';

interface TradingSignalsPanelProps {
  stockPrice: StockPrice;
  isOpen: boolean;
  onClose: () => void;
}

export default function TradingSignalsPanel({ stockPrice, isOpen, onClose }: TradingSignalsPanelProps) {
  const [analysis, setAnalysis] = useState<MultiTimeframeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && stockPrice) {
      generateAnalysis();
    }
  }, [isOpen, stockPrice]);

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      // Fetch real trading signals from API
      const response = await fetch(`/api/trading-signals?symbol=${stockPrice.symbol}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.analysis) {
          setAnalysis(data.data.analysis);
          return;
        }
      }
      
      // If API fails, show error message instead of fallback
      throw new Error('Unable to fetch real trading data');
      
    } catch (error) {
      console.error('Error generating trading analysis:', error);
      setAnalysis({
        signals: [],
        overallSignal: 'NEUTRAL',
        confidence: 0,
        summary: 'Unable to fetch real market data. Please try again later.',
        newsImpact: 'No data available'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalIcon = (signal: 'BUY' | 'SELL' | 'NEUTRAL') => {
    switch (signal) {
      case 'BUY':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'SELL':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: 'BUY' | 'SELL' | 'NEUTRAL') => {
    switch (signal) {
      case 'BUY':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SELL':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{stockPrice.name}</h2>
            <p className="text-gray-500">{stockPrice.symbol} • Multi-Timeframe Analysis</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing market structure across all timeframes...</p>
          </div>
        ) : analysis ? (
          <div className="p-6 space-y-6">
            
            {/* Overall Signal Summary */}
            <Card className={`border-2 ${
              analysis.overallSignal === 'BUY' ? 'border-green-200 bg-green-50' :
              analysis.overallSignal === 'SELL' ? 'border-red-200 bg-red-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  {getSignalIcon(analysis.overallSignal)}
                  <span>Overall Signal: {analysis.overallSignal}</span>
                  <Badge className={getSignalColor(analysis.overallSignal)}>
                    {analysis.confidence}% Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{analysis.summary}</p>
                
                {/* News Impact Section */}
                {analysis.newsImpact && analysis.newsImpact !== 'No significant news impact detected' && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">{analysis.newsImpact}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Current Price:</span>
                    <span className="font-semibold">{formatPrice(stockPrice.price)}</span>
                  </div>
                  
                  {analysis.overallSignal !== 'NEUTRAL' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-600">Target:</span>
                        <span className="font-semibold text-green-600">
                          {formatPrice(analysis.signals.find(s => s.signal === analysis.overallSignal)?.target || stockPrice.price)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        <span className="text-sm text-gray-600">Stop Loss:</span>
                        <span className="font-semibold text-red-600">
                          {formatPrice(analysis.signals.find(s => s.signal === analysis.overallSignal)?.stopLoss || stockPrice.price)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeframe Signals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analysis.signals.map((signal) => (
                <Card key={signal.timeframe} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-lg">{signal.timeframe.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSignalIcon(signal.signal)}
                        <Badge className={getSignalColor(signal.signal)}>
                          {signal.signal}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Confidence and Entry */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className={`font-semibold ${getConfidenceColor(signal.confidence)}`}>
                        {signal.signal === 'NEUTRAL' ? 'N/A' : `${signal.confidence}%`}
                      </span>
                    </div>
                    
                    {signal.signal !== 'NEUTRAL' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Entry:</span>
                          <span className="font-semibold">{formatPrice(signal.entry || stockPrice.price)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Target:</span>
                          <span className="font-semibold text-green-600">{formatPrice(signal.target || stockPrice.price)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Stop Loss:</span>
                          <span className="font-semibold text-red-600">{formatPrice(signal.stopLoss || stockPrice.price)}</span>
                        </div>
                      </>
                    )}

                    {/* Market Structure Indicators */}
                    <div className="space-y-2">
                      {signal.choch && (
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            {signal.choch.type.toUpperCase()} CHOCH ({signal.choch.strength}%)
                          </span>
                        </div>
                      )}
                      
                      {signal.bos && signal.bos.confirmed && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            {signal.bos.type.toUpperCase()} BOS Confirmed
                          </span>
                        </div>
                      )}
                      
                      {signal.volume && signal.volume.absorption !== 'none' && (
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">
                            {signal.volume.absorption.toUpperCase()} Volume Absorption
                          </span>
                        </div>
                      )}
                      
                      {signal.fakeout && signal.fakeout.detected && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">
                            {signal.fakeout.type.replace('_', ' ').toUpperCase()} Detected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reasoning */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600 font-medium mb-1">Analysis:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {signal.reason.slice(0, 3).map((reason, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Risk Disclaimer */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Risk Disclaimer:</p>
                    <p>
                      This analysis is based on technical indicators and market structure patterns. 
                      Trading involves substantial risk and is not suitable for all investors. 
                      Past performance does not guarantee future results. Please conduct your own research 
                      and consider consulting with a financial advisor before making investment decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">No analysis available. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
