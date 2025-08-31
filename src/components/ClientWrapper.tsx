"use client";

import { useState, useEffect } from 'react';
import LegalNotice from './LegalNotice';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [showLegalNotice, setShowLegalNotice] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged the legal notice
    const hasAcknowledged = localStorage.getItem('tradeNavigatorLegalAcknowledged');
    if (!hasAcknowledged) {
      // Delay showing the notice by 1 second to let the page load
      const timer = setTimeout(() => {
        setShowLegalNotice(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setShowLegalNotice(false);
  };

  const handleDecline = () => {
    setShowLegalNotice(false);
    // Optionally redirect user away from the site
    window.location.href = 'https://www.google.com';
  };

  return (
    <>
      {children}
      {showLegalNotice && (
        <LegalNotice 
          onAccept={handleAccept} 
          onDecline={handleDecline} 
        />
      )}
    </>
  );
}
