import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WatchlistItem, StockData, TradingSignal, TimeFrame } from '@/types';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;

  // Current Stock
  currentStock: StockData | null;
  setCurrentStock: (stock: StockData | null) => void;

  // Trading Signals
  signals: { [symbol: string]: { [timeframe: string]: TradingSignal } };
  setSignal: (signal: TradingSignal) => void;
  getSignal: (symbol: string, timeframe: TimeFrame) => TradingSignal | null;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: StockData[];
  setSearchResults: (results: StockData[]) => void;

  // Loading States
  isLoadingSignals: boolean;
  setLoadingSignals: (loading: boolean) => void;
  isLoadingSearch: boolean;
  setLoadingSearch: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Watchlist
      watchlist: [],
      addToWatchlist: (item) =>
        set((state) => ({
          watchlist: state.watchlist.some((w) => w.symbol === item.symbol)
            ? state.watchlist
            : [...state.watchlist, item],
        })),
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
        })),
      isInWatchlist: (symbol) =>
        get().watchlist.some((w) => w.symbol === symbol),

      // Current Stock
      currentStock: null,
      setCurrentStock: (stock) => set({ currentStock: stock }),

      // Trading Signals
      signals: {},
      setSignal: (signal) =>
        set((state) => ({
          signals: {
            ...state.signals,
            [signal.symbol]: {
              ...state.signals[signal.symbol],
              [signal.timeframe]: signal,
            },
          },
        })),
      getSignal: (symbol, timeframe) => {
        const state = get();
        return state.signals[symbol]?.[timeframe] || null;
      },

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),

      // Loading States
      isLoadingSignals: false,
      setLoadingSignals: (loading) => set({ isLoadingSignals: loading }),
      isLoadingSearch: false,
      setLoadingSearch: (loading) => set({ isLoadingSearch: loading }),
    }),
    {
      name: 'trade-navigator-store',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        watchlist: state.watchlist,
      }),
    }
  )
);
