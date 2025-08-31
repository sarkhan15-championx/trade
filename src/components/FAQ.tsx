"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How accurate are your trading signals?',
    answer: 'Our signals are generated using advanced technical analysis combining multiple indicators. While we strive for high accuracy, remember that all trading involves risk and past performance doesn\'t guarantee future results.',
  },
  {
    question: 'What timeframes are available?',
    answer: 'We provide signals across 6 timeframes: 15 minutes, 30 minutes, 1 hour, 6 hours, 1 day, and 1 month. This allows both short-term and long-term trading strategies.',
  },
  {
    question: 'How do I interpret the confidence levels?',
    answer: 'Confidence levels (0-100%) indicate how strongly our analysis supports the signal. Higher confidence suggests stronger technical alignment, but always combine with your own analysis.',
  },
  {
    question: 'Can I track multiple stocks?',
    answer: 'Yes! Add stocks to your watchlist to monitor signals across all timeframes. Your watchlist is saved locally in your browser.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about Trade Navigator platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
