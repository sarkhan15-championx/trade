"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnimatedPriceProps {
  price: number;
  change: number;
  changePercent: number;
  symbol: string;
  className?: string;
}

export default function AnimatedPrice({ 
  price, 
  change, 
  changePercent, 
  symbol, 
  className = '' 
}: AnimatedPriceProps) {
  const [isFlashing, setIsFlashing] = useState(false);
  const [previousPrice, setPreviousPrice] = useState(price);

  useEffect(() => {
    if (price !== previousPrice) {
      setIsFlashing(true);
      setPreviousPrice(price);
      
      // Stop flashing after animation
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [price, previousPrice]);

  const formatPrice = (price: number) => {
    const isIndianStock = symbol.includes('.NS') || symbol.includes('.BO');
    const currency = isIndianStock ? '₹' : '$';
    
    return `${currency}${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const isPositive = change >= 0;
  const isNeutral = change === 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Price with flash animation */}
      <span 
        className={`text-2xl font-bold transition-all duration-300 ${
          isFlashing 
            ? (isPositive ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900')
            : 'text-gray-900 dark:text-white'
        } ${isFlashing ? 'px-2 py-1 rounded' : ''}`}
      >
        {formatPrice(price)}
      </span>

      {/* Change indicator */}
      <div className={`flex items-center space-x-1 transition-all duration-200 ${
        isPositive ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-red-600'
      }`}>
        {isPositive ? (
          <TrendingUp className="h-5 w-5" />
        ) : isNeutral ? (
          <div className="h-5 w-5" />
        ) : (
          <TrendingDown className="h-5 w-5" />
        )}
        
        <div className="flex flex-col text-sm">
          <span className="font-medium">
            {isPositive ? '+' : ''}{formatPrice(Math.abs(change))}
          </span>
          <span className="text-xs">
            ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
