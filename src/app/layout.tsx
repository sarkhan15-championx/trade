import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Trade Navigator - Real-Time Indian Stock Trading Signals',
  description: 'Get real-time trading signals and technical analysis for NSE & BSE stocks. Professional stock market analysis with confidence-rated buy/sell recommendations for 2,141+ Indian stocks.',
  keywords: 'NSE stocks, BSE stocks, Indian stock market, trading signals, technical analysis, stock trading, market analysis, real-time quotes, stock charts, investment advice',
  authors: [{ name: 'Trade Navigator' }],
  creator: 'Trade Navigator',
  publisher: 'Trade Navigator',
  metadataBase: new URL('https://trade-navigator.com'),
  alternates: {
    canonical: '/',
  },
    icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trade-navigator.com',
    title: 'Trade Navigator - Real-Time Indian Stock Trading Signals',
    description: 'Get real-time trading signals and technical analysis for NSE & BSE stocks. Professional stock market analysis with confidence-rated recommendations.',
    siteName: 'Trade Navigator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trade Navigator - Indian Stock Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Navigator - Real-Time Indian Stock Trading Signals',
    description: 'Professional trading signals for NSE & BSE stocks with technical analysis and confidence ratings.',
    images: ['/twitter-image.jpg'],
    creator: '@tradenavigator',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
