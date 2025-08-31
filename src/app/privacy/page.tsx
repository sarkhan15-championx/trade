import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, Database, Cookie, Shield, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Trade Navigator',
  description: 'How Trade Navigator collects, uses, and protects your personal information',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            How we protect and use your personal information
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: August 31, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-blue-600" />
              <span>Introduction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              At Trade Navigator, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, store, 
              and protect your information when you use our website and services.
            </p>
            <p>
              By using Trade Navigator, you consent to the data practices described in this policy. 
              If you do not agree with any part of this policy, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-green-600" />
              <span>Information We Collect</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Information You Provide</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Name, email address, phone number (if provided)</li>
              <li><strong>Profile Information:</strong> Investment preferences, experience level (if shared)</li>
              <li><strong>Communication:</strong> Messages, feedback, or support requests you send us</li>
              <li><strong>Payment Information:</strong> Billing details (if applicable for premium features)</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Information We Collect Automatically</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Location Data:</strong> General geographic location based on IP address</li>
              <li><strong>Technical Data:</strong> Session IDs, timestamps, error logs</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">3. Third-Party Data</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Market Data:</strong> Stock prices, financial information from data providers</li>
              <li><strong>Analytics:</strong> Website usage statistics (anonymized)</li>
              <li><strong>Security:</strong> Fraud prevention and security monitoring data</li>
            </ul>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-6 w-6 text-purple-600" />
              <span>How We Use Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Service Provision</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide access to trading signals and market analysis</li>
              <li>Customize content based on your preferences</li>
              <li>Process watchlist and portfolio tracking requests</li>
              <li>Send important service updates and notifications</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Communication</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Respond to your questions and support requests</li>
              <li>Send educational content and market insights (with consent)</li>
              <li>Notify you of important changes to our services</li>
              <li>Provide customer service and technical support</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">3. Service Improvement</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Analyze usage patterns to improve our platform</li>
              <li>Develop new features and services</li>
              <li>Monitor and ensure service quality and security</li>
              <li>Conduct research and analytics (anonymized data)</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">4. Legal and Security</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Comply with applicable laws and regulations</li>
              <li>Protect against fraud, abuse, and security threats</li>
              <li>Enforce our terms of service and policies</li>
              <li>Respond to legal requests and court orders</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cookie className="h-6 w-6 text-orange-600" />
              <span>Cookies and Tracking Technologies</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">1. Essential Cookies</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Website functionality and user preferences</li>
              <li>Load balancing and performance optimization</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">2. Analytics Cookies</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Website usage statistics and user behavior analysis</li>
              <li>Performance monitoring and error tracking</li>
              <li>Feature usage and engagement metrics</li>
              <li>A/B testing and service optimization</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">3. Cookie Management</h4>
            <p>
              You can control cookies through your browser settings. Note that disabling essential 
              cookies may affect website functionality. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>View and delete cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block third-party cookies</li>
              <li>Clear cookies when closing the browser</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200">
              <p className="font-semibold text-green-800 dark:text-green-200 mb-2">
                We do not sell, rent, or trade your personal information to third parties.
              </p>
            </div>

            <h4 className="font-semibold text-lg mt-6">We may share information in these limited cases:</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, analytics, support)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory request</li>
              <li><strong>Business Transfer:</strong> In case of merger, acquisition, or sale of business assets</li>
              <li><strong>Safety and Security:</strong> To protect our users and prevent fraud or abuse</li>
              <li><strong>With Consent:</strong> When you explicitly agree to share information</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">Data Minimization</h4>
            <p>
              We only share the minimum amount of information necessary for the specified purpose 
              and require all third parties to protect your information according to applicable laws.
            </p>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-600" />
              <span>Data Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">Security Measures</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Encryption:</strong> Data transmitted using SSL/TLS encryption</li>
              <li><strong>Access Controls:</strong> Limited access on a need-to-know basis</li>
              <li><strong>Regular Updates:</strong> Security patches and system updates</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and threat detection</li>
              <li><strong>Backup:</strong> Secure data backup and recovery procedures</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">Your Security Responsibilities</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use strong, unique passwords for your account</li>
              <li>Keep your login credentials confidential</li>
              <li>Log out from shared or public computers</li>
              <li>Report any suspicious activity immediately</li>
              <li>Keep your devices and browsers updated</li>
            </ul>

            <p className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> While we implement strong security measures, no system is 
              100% secure. Please report any security concerns immediately.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">Retention Periods</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>Usage Logs:</strong> Typically retained for 12 months</li>
              <li><strong>Communication Records:</strong> Retained for 3 years for support purposes</li>
              <li><strong>Financial Records:</strong> Retained as required by applicable laws</li>
              <li><strong>Legal Hold:</strong> Extended retention if required for legal proceedings</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">Data Deletion</h4>
            <p>
              When data is no longer needed, we securely delete or anonymize it. You can request 
              deletion of your personal data, subject to legal and operational requirements.
            </p>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <h4 className="font-semibold text-lg">You have the right to:</h4>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Restriction:</strong> Request limitation of data processing</li>
            </ul>

            <h4 className="font-semibold text-lg mt-6">Exercising Your Rights</h4>
            <p>
              To exercise these rights, please contact us using the information provided below. 
              We will respond to your request within 30 days and may require identity verification 
              for security purposes.
            </p>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly 
              collect personal information from children. If we become aware that we have collected 
              information from a child, we will take steps to delete it promptly.
            </p>
            <p>
              If you believe we have collected information from a child, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              Our services are primarily operated from India. If you access our services from other 
              countries, your information may be transferred to and processed in India or other 
              countries where our service providers operate.
            </p>
            <p>
              We ensure appropriate safeguards are in place to protect your information during 
              international transfers, in compliance with applicable data protection laws.
            </p>
          </CardContent>
        </Card>

        {/* Policy Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors. We will notify you of significant 
              changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Posting the updated policy on our website</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending email notifications for material changes (if applicable)</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
            <p>
              Your continued use of our services after policy updates constitutes acceptance of the 
              revised policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
              <Mail className="h-6 w-6" />
              <span>Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-blue-700 dark:text-blue-300">
            <p>
              If you have questions about this Privacy Policy or want to exercise your privacy rights, 
              please contact us:
            </p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p><strong>Trade Navigator Privacy Team</strong></p>
              <p>Email: privacy@trade-navigator.com</p>
              <p>Response Time: Within 30 days</p>
            </div>
            <div className="text-center space-x-4 mt-6">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Return to Home
              </Link>
              <span className="text-gray-400">|</span>
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Terms & Conditions
              </Link>
              <span className="text-gray-400">|</span>
              <Link 
                href="/disclaimer" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
              >
                Disclaimer
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
