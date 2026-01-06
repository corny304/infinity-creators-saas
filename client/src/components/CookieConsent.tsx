import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const CONSENT_KEY = 'infinity-creators-cookie-consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
  };

  const handleClose = () => {
    // Treat close as "necessary only"
    handleAcceptNecessary();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500">
      <Card className="bg-slate-900 border-slate-700 shadow-2xl">
        <CardContent className="p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Schließen"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-4">
            <Cookie className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Cookie-Einstellungen
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Wir nutzen Cookies, um die Nutzererfahrung zu verbessern und anonyme Statistiken zu erfassen. 
                Ihre Daten werden nicht an Dritte weitergegeben.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              onClick={handleAcceptAll}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              Alle akzeptieren
            </Button>
            <Button
              onClick={handleAcceptNecessary}
              variant="outline"
              className="flex-1 border-slate-600 text-white hover:bg-slate-800"
            >
              Nur notwendige
            </Button>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Weitere Informationen in unserer{' '}
            <a href="/datenschutz" className="text-yellow-400 hover:underline">
              Datenschutzerklärung
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
