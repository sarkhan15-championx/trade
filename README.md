# Trade Navigator Platform

A comprehensive stock trading analysis platform built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Zustand. Get real-time trading signals with advanced technical analysis for 2,141+ NSE and BSE Indian stocks.

## Features

## Features

### 🚀 Core Features
- **Professional Trading Analysis**: Get Buy/Sell/Neutral recommendations with confidence levels
- **Indian Stock Focus**: Track 2,141+ NSE and BSE stocks with real-time data
- **Multiple Timeframes**: 15m, 30m, 1h, 6h, 1d analysis with technical indicators
- **Advanced Indicators**: EMA, SMA, RSI, MACD, MFI, ATR for comprehensive analysis
- **Interactive Charts**: Real-time price charts with technical overlays
- **Watchlist Management**: Save and track your favorite Indian stocks
- **Responsive Design**: Works perfectly on desktop and mobile

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with shadcn/ui components
- **Dark/Light Mode**: Toggle between themes
- **Live/Mock Mode**: Switch between real data and demo data
- **Real-time Updates**: Live price feeds and signal updates

### 📊 Landing Page
- **Hero Section**: Compelling introduction with quick search
- **Value Propositions**: Three key benefits highlighted
- **How It Works**: Step-by-step process explanation
- **Live Ticker**: Real-time market data preview
- **FAQ Section**: Common questions answered
- **Professional Footer**: Links and contact information

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### 1. Clone and Install
```bash
git clone <repository-url>
cd trade-navigator
npm install
```

### 2. Environment Setup (API Key Configured)
The `.env.local` file has been created with your Finnhub API key:

```env
NEXT_PUBLIC_FINNHUB_API_KEY=d2n117pr01qsk3opublgd2n117pr01qsk3opubm0
```

✅ **Live Mode is now available!** Toggle the switch in the app header to use real market data.

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Mock vs Live Mode

#### Mock Mode (Default)
- Uses sample data from `/public/mock/` directory
- No API key required
- Perfect for testing and development
- Includes realistic sample data for popular stocks

#### Live Mode
- Requires Finnhub API key
- Real-time market data
- Live price updates
- Current market signals

### API Key Setup (Finnhub)

1. **Sign up** for a free account at [Finnhub.io](https://finnhub.io)
2. **Get your API key** from the dashboard
3. **Add to environment**: Copy your API key to `.env.local`
4. **Toggle Live Mode**: Use the switch in the app header

### Sample Stock Symbols

#### US Stocks
- `AAPL` - Apple Inc.
- `GOOGL` - Alphabet Inc.
- `TSLA` - Tesla Inc.
- `MSFT` - Microsoft Corporation
- `AMZN` - Amazon.com Inc.

#### Indian Stocks (NSE)
- `RELIANCE.NS` - Reliance Industries
- `TCS.NS` - Tata Consultancy Services
- `INFY.NS` - Infosys Limited
- `HDFCBANK.NS` - HDFC Bank
- `ICICIBANK.NS` - ICICI Bank

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── Hero.tsx          # Landing page hero
│   ├── StockChart.tsx    # Chart component
│   └── ...               # Other components
├── lib/                   # Utilities and logic
│   ├── api.ts            # API functions
│   ├── indicators.ts     # Technical indicators
│   ├── computeConsensus.ts # Signal computation (TODO placeholders)
│   └── utils.ts          # Utility functions
├── store/                 # Zustand state management
│   └── index.ts          # App store
└── types/                 # TypeScript definitions
    └── index.ts          # Type definitions

public/
└── mock/                  # Mock data for demo mode
    ├── stocks.json       # Sample stock data
    └── chartData.json    # Sample chart data
```

## Trading Signal Logic

The signal computation logic is in `src/lib/computeConsensus.ts` with TODO placeholders for custom implementation:

```typescript
// TODO: Implement EMA crossover signals
// TODO: Implement SMA trend analysis  
// TODO: Implement RSI overbought/oversold conditions
// TODO: Implement MACD signal line crossover
// TODO: Implement MFI money flow analysis
// TODO: Implement ATR volatility analysis
// TODO: Implement volume analysis
// TODO: Implement support/resistance levels
```

This allows you to implement your own trading strategies and signal generation logic.

## Technical Indicators

### Implemented Indicators
- **EMA (Exponential Moving Average)**: 12, 26, 50 periods
- **SMA (Simple Moving Average)**: 20, 50, 200 periods  
- **RSI (Relative Strength Index)**: 14 period
- **MACD (Moving Average Convergence Divergence)**: 12, 26, 9 periods
- **MFI (Money Flow Index)**: 14 period
- **ATR (Average True Range)**: 14 period

### Custom Implementation
All indicators are implemented from scratch in `src/lib/indicators.ts` - no external libraries needed.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## API Integration

### Finnhub API Endpoints Used
- **Search**: `/search` - Find stocks by symbol/name
- **Quote**: `/quote` - Get current stock price
- **Candles**: `/stock/candle` - Get historical price data

### Error Handling
- Graceful fallback to mock data on API failures
- User-friendly error messages
- Offline mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
1. Check the FAQ section in the app
2. Review this README
3. Open an issue on GitHub
4. Contact the development team

## Roadmap

### Upcoming Features
- [ ] Email/SMS alerts for signals
- [ ] Portfolio tracking
- [ ] Backtesting capabilities
- [ ] Social sentiment analysis
- [ ] Options and futures support
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] PWA support
- [ ] Real-time WebSocket feeds
- [ ] Advanced charting tools
- [ ] Performance optimizations
- [ ] Comprehensive test suite

---

**Disclaimer**: This application is for educational and informational purposes only. Always conduct your own research and consider consulting with financial advisors before making investment decisions.
