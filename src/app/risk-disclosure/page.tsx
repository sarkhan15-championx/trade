import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingDown, DollarSign, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Risk Disclosure - Trade Navigator',
  description: 'Important risk warnings and disclosures for trading and investing',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Risk Disclosure Statement
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Important information about trading and investment risks
          </p>
        </div>

        {/* Critical Risk Warning */}
        <Card className="border-red-500 bg-red-50 dark:bg-red-950 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="h-8 w-8" />
              <span className="text-2xl">Critical Risk Warning</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-700 dark:text-red-300">
            <div className="space-y-4 text-lg">
              <p className="font-bold">
                Trading in stock markets, derivatives, or cryptocurrencies carries a high level of risk 
                and may not be suitable for all investors.
              </p>
              <p>
                <strong>You may sustain a partial or complete loss of your invested capital.</strong> 
                You should only trade with money you can afford to lose completely.
              </p>
              <p>
                Before deciding to trade, you should carefully consider your investment objectives, 
                level of experience, and risk appetite.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* General Investment Risks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-6 w-6 text-red-600" />
              <span>General Investment Risks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Market Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Stock prices can fluctuate widely due to market conditions</li>
              <li>Economic factors, political events, and global crises can impact markets</li>
              <li>Market sentiment can change rapidly and unpredictably</li>
              <li>Bull markets can turn into bear markets without warning</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Company-Specific Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Individual companies may face operational challenges</li>
              <li>Management decisions can significantly impact stock performance</li>
              <li>Earnings reports may not meet market expectations</li>
              <li>Regulatory changes can affect specific sectors or companies</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">3. Liquidity Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Some stocks may have limited trading volume</li>
              <li>You may not be able to sell your holdings when desired</li>
              <li>Low liquidity can lead to wider bid-ask spreads</li>
              <li>Emergency exits may result in significant losses</li>
            </ul>
          </CardContent>
        </Card>

        {/* Trading-Specific Risks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-orange-600" />
              <span>Trading-Specific Risks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Technical Analysis Limitations</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Technical indicators are based on historical data and may not predict future movements</li>
              <li>False signals can occur, leading to unprofitable trades</li>
              <li>Market conditions can change faster than technical indicators can adapt</li>
              <li>Over-reliance on technical analysis can lead to significant losses</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Timing Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Attempting to time the market is extremely difficult</li>
              <li>Early entries or late exits can result in losses</li>
              <li>Market gaps can occur overnight or during non-trading hours</li>
              <li>Stop-loss orders may not execute at intended prices</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">3. Leverage and Margin Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Leverage amplifies both gains and losses</li>
              <li>Margin calls can force liquidation at unfavorable prices</li>
              <li>Interest costs on borrowed funds can accumulate quickly</li>
              <li>High leverage can lead to total capital loss</li>
            </ul>
          </CardContent>
        </Card>

        {/* Psychological and Behavioral Risks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Psychological and Behavioral Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Emotional Trading</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fear and greed can lead to poor decision-making</li>
              <li>FOMO (Fear of Missing Out) can result in impulsive trades</li>
              <li>Loss aversion may prevent cutting losses early</li>
              <li>Overconfidence can lead to excessive risk-taking</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Cognitive Biases</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Confirmation bias may lead to ignoring contrary information</li>
              <li>Anchoring bias can affect entry and exit decisions</li>
              <li>Recency bias may overweight recent market performance</li>
              <li>Overconfidence bias can result in inadequate risk management</li>
            </ul>
          </CardContent>
        </Card>

        {/* Technology and Data Risks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Technology and Data Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Data Accuracy</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Real-time data feeds may have delays or errors</li>
              <li>Historical data may contain inaccuracies</li>
              <li>Third-party data providers may experience outages</li>
              <li>Price discrepancies between different sources can occur</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Platform Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Trading platforms may experience technical failures</li>
              <li>Internet connectivity issues can prevent trading</li>
              <li>System maintenance may limit access during critical times</li>
              <li>Mobile apps may have limitations compared to desktop platforms</li>
            </ul>
          </CardContent>
        </Card>

        {/* Regulatory and Legal Risks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regulatory and Legal Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Regulatory Changes</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>New regulations may affect trading strategies</li>
              <li>Tax laws can change and impact investment returns</li>
              <li>SEBI guidelines may introduce new restrictions</li>
              <li>Global regulatory changes can affect Indian markets</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Compliance Risk</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Investors are responsible for compliance with all applicable laws</li>
              <li>Tax obligations must be met regardless of trading outcomes</li>
              <li>Documentation and record-keeping requirements may apply</li>
              <li>Penalties for non-compliance can be substantial</li>
            </ul>
          </CardContent>
        </Card>

        {/* Risk Management Guidelines */}
        <Card className="mb-8 bg-green-50 dark:bg-green-950 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
              <Shield className="h-6 w-6" />
              <span>Risk Management Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-green-700 dark:text-green-300">
            <h4 className="font-semibold text-lg">Essential Risk Management Practices:</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Never invest more than you can afford to lose completely</strong></li>
              <li>Diversify your portfolio across different assets and sectors</li>
              <li>Set stop-loss levels before entering any position</li>
              <li>Use position sizing to limit exposure to any single trade</li>
              <li>Maintain an emergency fund separate from trading capital</li>
              <li>Continuously educate yourself about markets and risk management</li>
              <li>Consider consulting with qualified financial professionals</li>
              <li>Keep detailed records of all trades and their rationale</li>
            </ul>
          </CardContent>
        </Card>

        {/* Professional Advice Recommendation */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">
              Professional Financial Advice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-blue-700 dark:text-blue-300">
            <p className="font-semibold">
              We strongly recommend consulting with SEBI-registered financial advisors before making any investment decisions.
            </p>
            <p>
              Professional advisors can help you:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Assess your risk tolerance and investment objectives</li>
              <li>Develop a suitable investment strategy</li>
              <li>Understand tax implications of your investments</li>
              <li>Create a diversified portfolio appropriate for your situation</li>
              <li>Monitor and adjust your investments over time</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-lg mb-4 text-center text-yellow-800 dark:text-yellow-200">
              Risk Acknowledgment
            </h4>
            <p className="text-center text-yellow-700 dark:text-yellow-300 mb-4">
              By using Trade Navigator, you acknowledge that you have read, understood, and accepted 
              all the risks outlined in this disclosure statement. You confirm that you are prepared 
              for the possibility of financial loss and will not hold Trade Navigator responsible 
              for any trading losses you may incur.
            </p>
            <div className="text-center space-x-4">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Return to Home
              </Link>
              <span className="text-gray-400">|</span>
              <Link 
                href="/disclaimer" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                View Disclaimer
              </Link>
              <span className="text-gray-400">|</span>
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Terms & Conditions
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
