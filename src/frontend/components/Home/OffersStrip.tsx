import React, { useState, useEffect } from 'react';

interface OffersStripProps {
  className?: string;
}

export const OffersStrip: React.FC<OffersStripProps> = ({ className = '' }) => {
  const offers = [
    "🏠 Free home sample collection available",
    "💊 20% off on branded medicines",
    "🩺 Generic Medicines available - up to 80% off",
    "🧪 Lab tests up to 60% off",
    "📡 Scans up to 30% off",
    "👩‍⚕️ Get nursing services at home",
    "🍎 Diabetes Management plans available",
    "🏥 ఎన్టీఆర్ ఆరోగ్యశ్రీ లో ఉచితంగా వైద్య సేవలు",
    "🛡️ Best health insurance plans",
    "⚕️ Get Free Expert Opinion for any Surgeries",
    "👨‍⚕️ Free Doctor consultation on Packages",
    "🏠 Doctor HOME VISIT AVAILABLE"
  ];

  const [currentOffer, setCurrentOffer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [offers.length]);

  return (
    <div className={`bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-2 px-4 ${className}`}>
      <div className="container mx-auto text-center text-sm">
        <span className="animate-fade-in block transition-opacity duration-500">
          {offers[currentOffer]}
        </span>
      </div>
    </div>
  );
};