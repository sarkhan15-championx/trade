import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LegalNoticeProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function LegalNotice({ onAccept, onDecline }: LegalNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged the legal notice
    const hasAcknowledged = localStorage.getItem('tradeNavigatorLegalAcknowledged');
    if (!hasAcknowledged) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tradeNavigatorLegalAcknowledged', 'true');
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    setIsVisible(false);
    onDecline?.();
    // Optionally redirect user away from the site
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Important Legal Notice
            </h2>
          </div>
          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Educational Purpose Only
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              Trade Navigator provides educational content and analysis tools. This is not investment advice. 
              All trading involves risk and you should consult with a qualified financial advisor.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              By using Trade Navigator, you acknowledge that:
            </h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>This platform is for educational and informational purposes only</li>
              <li>No content constitutes investment advice or recommendations</li>
              <li>Past performance does not guarantee future results</li>
              <li>Trading involves substantial risk of loss</li>
              <li>You should conduct your own research and due diligence</li>
              <li>You understand the risks associated with trading</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Risk Warning
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Trading in stocks, derivatives, and other financial instruments involves substantial risk. 
              You may lose some or all of your investment. Only trade with money you can afford to lose.
            </p>
          </div>

          <div className="text-center space-x-4">
            <Link 
              href="/disclaimer" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm underline"
              target="_blank"
            >
              Read Full Disclaimer
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/risk-disclosure" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm underline"
              target="_blank"
            >
              Risk Disclosure
            </Link>
            <span className="text-gray-400">•</span>
            <Link 
              href="/terms" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm underline"
              target="_blank"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            I Do Not Agree
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
}
