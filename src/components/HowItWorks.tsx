"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Search, BarChart3, Target, Eye } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search Stocks',
    description: 'Search for any stock symbol from NSE, BSE, or US markets using our intelligent search.',
    step: '01',
  },
  {
    icon: BarChart3,
    title: 'Analyze Signals',
    description: 'Our AI analyzes multiple technical indicators across different timeframes to generate signals.',
    step: '02',
  },
  {
    icon: Target,
    title: 'Get Recommendations',
    description: 'Receive Buy/Sell/Neutral signals with confidence percentages and detailed reasoning.',
    step: '03',
  },
  {
    icon: Eye,
    title: 'Track & Monitor',
    description: 'Add stocks to your watchlist and monitor signals in real-time across multiple timeframes.',
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Navigate the Indian stock market with Trade Navigator in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-4 left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6 mt-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flow arrows for larger screens */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="flex space-x-8 max-w-7xl w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 flex justify-end items-center">
                  <div className="w-8 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
                  <div className="w-0 h-0 border-l-4 border-l-blue-300 dark:border-l-blue-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
