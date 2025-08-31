import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Trade Navigator',
  description: 'Terms of service and conditions for using Trade Navigator platform',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Please read these terms carefully before using Trade Navigator
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: August 31, 2025
          </p>
        </div>

        {/* Acceptance of Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span>Acceptance of Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              By accessing and using the Trade Navigator website ("Service"), you accept and agree to be 
              bound by the terms and provision of this agreement. If you do not agree to abide by the 
              above, please do not use this service.
            </p>
            <p>
              These terms constitute a legally binding agreement between you and Trade Navigator. We reserve 
              the right to modify these terms at any time without prior notice.
            </p>
          </CardContent>
        </Card>

        {/* Educational Purpose */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Educational Purpose and Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Educational Content Only</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All content, including buy/sell signals, charts, and analyses, is for educational purposes</li>
              <li>No content should be interpreted as a recommendation to buy, sell, or hold any security</li>
              <li>Information is provided to help users learn about market analysis techniques</li>
              <li>Users must make their own independent investment decisions</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Prohibited Uses</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Using the service for any unlawful purpose or in violation of applicable laws</li>
              <li>Attempting to gain unauthorized access to our systems or user accounts</li>
              <li>Redistributing or reselling our content without written permission</li>
              <li>Using automated systems to scrape or download content</li>
              <li>Impersonating any person or entity or misrepresenting your affiliation</li>
            </ul>
          </CardContent>
        </Card>

        {/* No Guarantees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>No Guarantees or Investment Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. No Financial Advice</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We are not SEBI-registered investment advisors or financial planners</li>
              <li>No content constitutes financial, investment, legal, or trading advice</li>
              <li>Always consult qualified professionals before making investment decisions</li>
              <li>We do not provide personalized investment recommendations</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. No Performance Guarantees</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We make no guarantee of accuracy, completeness, or future performance</li>
              <li>Past results do not indicate future outcomes</li>
              <li>Technical indicators may produce false or misleading signals</li>
              <li>Market conditions can change rapidly and unpredictably</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibility */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-green-600" />
              <span>User Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Investment Decisions</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You are solely responsible for your investment and trading decisions</li>
              <li>Perform your own due diligence and research before investing</li>
              <li>Understand the risks associated with your chosen investments</li>
              <li>Only invest money you can afford to lose</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Account Security</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintain the confidentiality of your account information</li>
              <li>Report any unauthorized use of your account immediately</li>
              <li>Use strong passwords and update them regularly</li>
              <li>Log out from shared or public computers</li>
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Our Content</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All website content (text, charts, signals, tools) is our intellectual property</li>
              <li>Content is protected by copyright, trademark, and other intellectual property laws</li>
              <li>Users may not copy, distribute, or resell content without written consent</li>
              <li>Personal use for educational purposes is permitted</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. User Content</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You retain ownership of any content you submit to our platform</li>
              <li>By submitting content, you grant us a license to use it for service improvement</li>
              <li>You are responsible for ensuring your content doesn't violate any rights</li>
              <li>We reserve the right to remove inappropriate content</li>
            </ul>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-purple-600" />
              <span>Service Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Service Uptime</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We strive to maintain service availability but cannot guarantee 100% uptime</li>
              <li>Maintenance, updates, or technical issues may cause temporary interruptions</li>
              <li>We are not liable for any losses due to service unavailability</li>
              <li>Users should not rely solely on our platform for time-sensitive decisions</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Data Accuracy</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We source data from third-party providers and cannot guarantee accuracy</li>
              <li>Real-time data may have delays or inaccuracies</li>
              <li>Users should verify critical information independently</li>
              <li>We are not responsible for decisions based on incorrect data</li>
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
              To the maximum extent permitted by law, Trade Navigator and its affiliates shall not be 
              liable for any direct, indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Trading or investment losses</li>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Business interruption or downtime</li>
              <li>Personal injury or property damage</li>
              <li>Third-party claims or actions</li>
            </ul>
            <p className="font-semibold mt-4">
              Your sole remedy for any dispute is to stop using our service.
            </p>
          </CardContent>
        </Card>

        {/* Indemnification */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              You agree to indemnify, defend, and hold harmless Trade Navigator and its affiliates from 
              and against any claims, damages, costs, and expenses (including reasonable attorneys' fees) 
              arising from or related to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your use of our service</li>
              <li>Your violation of these terms</li>
              <li>Your violation of any applicable laws</li>
              <li>Your infringement of any third-party rights</li>
              <li>Any content you submit to our platform</li>
            </ul>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. By You</h4>
            <p>You may terminate your use of the service at any time by ceasing to access the platform.</p>

            <h4 className="font-semibold text-lg mt-4">2. By Us</h4>
            <p>
              We reserve the right to terminate or suspend access to our service immediately, without 
              prior notice, for any reason, including breach of these terms.
            </p>

            <h4 className="font-semibold text-lg mt-4">3. Effect of Termination</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All rights and licenses granted to you will cease immediately</li>
              <li>You must stop using all content from our platform</li>
              <li>Provisions regarding liability and indemnification survive termination</li>
            </ul>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law and Jurisdiction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <ul className="list-disc list-inside space-y-2">
              <li>These terms are governed by the laws of India</li>
              <li>Any disputes shall be subject to the exclusive jurisdiction of Indian courts</li>
              <li>If any provision is found unenforceable, the remainder shall remain in effect</li>
              <li>These terms constitute the entire agreement between you and Trade Navigator</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-lg mb-4 text-center">Questions About These Terms?</h4>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about these Terms & Conditions, please contact us before using the service.
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
