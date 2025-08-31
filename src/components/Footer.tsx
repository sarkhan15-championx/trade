"use client";

import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Trade Navigator</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Professional trading signals and technical analysis for NSE & BSE stocks. 
              Navigate the Indian stock market with confidence-rated recommendations 
              and real-time data.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/risk-disclosure" className="hover:text-white transition-colors">
                  Risk Disclosure
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Trade Navigator. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-xs text-gray-500">
              <Link href="/disclaimer" className="hover:text-gray-300 transition-colors">
                Disclaimer
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/risk-disclosure" className="hover:text-gray-300 transition-colors">
                Risk Disclosure
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-center text-xs text-gray-500 leading-relaxed">
              <strong>Educational Purpose Only:</strong> All information provided is for educational purposes only. 
              Not investment advice. Past performance does not guarantee future results. 
              Trading involves risk of loss. Please consult a financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
