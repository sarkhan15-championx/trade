import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer - Trade Navigator',
  description: 'Important disclaimer and risk warning for Trade Navigator trading signals platform',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Disclaimer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Important information about using Trade Navigator
          </p>
        </div>

        {/* Risk Warning Banner */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-6 w-6" />
              <span>Risk Warning</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-700 dark:text-red-300">
            <p className="text-lg font-semibold mb-2">
              Trading and investing in financial markets involves substantial risk and may not be suitable for all investors.
            </p>
            <p>
              You could sustain a loss of some or all of your initial investment. Only invest money you can afford to lose.
            </p>
          </CardContent>
        </Card>

        {/* Main Disclaimer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-6 w-6 text-blue-600" />
              <span>General Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              The information, tools, signals, and resources provided on the Trade Navigator website are for 
              <strong> educational and informational purposes only</strong>. We are not SEBI-registered investment 
              advisors or brokers. Nothing on this website constitutes financial, investment, legal, or trading advice.
            </p>
            
            <p>
              You should not rely solely on the information provided here for making investment decisions. 
              Trading and investing in financial markets involves risk, including the possible loss of principal.
            </p>
            
            <p>
              By using this website, you agree that all trading decisions are made at your own risk, and the 
              website owners, developers, or affiliates shall not be held liable for any losses or damages 
              arising directly or indirectly from the use of our content.
            </p>
          </CardContent>
        </Card>

        {/* Educational Purpose */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Educational Purpose Only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <ul className="list-disc list-inside space-y-2">
              <li>All content, including buy/sell signals, charts, and analyses, is for educational purposes</li>
              <li>No content should be interpreted as a recommendation to buy, sell, or hold any security</li>
              <li>Technical analysis and signals are provided for learning market behavior patterns</li>
              <li>Users should conduct their own research and analysis before making any investment decisions</li>
            </ul>
          </CardContent>
        </Card>

        {/* No Guarantees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>No Guarantees or Warranties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <ul className="list-disc list-inside space-y-2">
              <li>We make no guarantee of accuracy, completeness, or future performance of any signals</li>
              <li>Past results do not indicate future outcomes</li>
              <li>Market conditions can change rapidly and unpredictably</li>
              <li>Technical indicators may produce false signals</li>
              <li>No trading system or methodology is foolproof</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Responsibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <ul className="list-disc list-inside space-y-2">
              <li>You are solely responsible for your investment and trading decisions</li>
              <li>Always consult a SEBI-registered financial advisor before making investment decisions</li>
              <li>Verify all information independently before acting upon it</li>
              <li>Understand the risks associated with your chosen investment strategy</li>
              <li>Never invest more than you can afford to lose</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-gray-600" />
              <span>Limitation of Liability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              To the fullest extent permitted by law, Trade Navigator, its owners, employees, affiliates, 
              and partners shall not be liable for any direct, indirect, incidental, consequential, or 
              punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Loss of profits or revenue</li>
              <li>Loss of data or information</li>
              <li>Business interruption</li>
              <li>Trading losses</li>
              <li>Investment losses</li>
            </ul>
            <p>
              This limitation applies regardless of the cause of action, whether in contract, tort, 
              negligence, or otherwise, even if we have been advised of the possibility of such damages.
            </p>
          </CardContent>
        </Card>

        {/* Compliance Note */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <ul className="list-disc list-inside space-y-2">
              <li>This website is not affiliated with SEBI, NSE, BSE, or any financial regulator</li>
              <li>We are not licensed to provide investment advice or portfolio management services</li>
              <li>All services are provided on an "as-is" basis, without warranties</li>
              <li>Users should comply with all applicable laws and regulations in their jurisdiction</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 dark:text-gray-300">
              By using Trade Navigator, you acknowledge that you have read, understood, and agreed to this disclaimer.
            </p>
            <div className="text-center mt-4">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
