"use client";

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Shield, Zap } from 'lucide-react';

const valueProps = [
  {
    icon: TrendingUp,
    title: 'Advanced Technical Analysis',
    description: 'Powered by multiple indicators including EMA, SMA, RSI, MACD, MFI, and ATR for comprehensive market analysis.',
  },
  {
    icon: Shield,
    title: 'Risk-Aware Signals',
    description: 'Every signal comes with confidence levels and detailed reasoning to help you make informed trading decisions.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant signals across multiple timeframes (15m, 30m, 1h, 4h, 1d) for Indian NSE & BSE markets.',
  },
];

export default function ValueProps() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Trade Navigator?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional-grade analysis tools designed for both beginners and experienced traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {valueProps.map((prop, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <prop.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {prop.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {prop.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
