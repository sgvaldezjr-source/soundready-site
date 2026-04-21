import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedPreferences = localStorage.getItem("cookieConsent");
    if (!savedPreferences) {
      setShowBanner(true);
    } else {
      const prefs = JSON.parse(savedPreferences);
      setPreferences(prefs);
      // Load analytics if user consented
      if (prefs.analytics) {
        loadAnalytics();
      }
    }
  }, []);

  const loadAnalytics = () => {
    // This is where you would load your analytics script
    // For example, Google Analytics, Mixpanel, etc.
    console.log("Analytics loaded - user consented to tracking");
    
    // Example: Load Google Analytics
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
  };

  const handleAcceptAll = () => {
    const prefs = { analytics: true, marketing: true };
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    loadAnalytics();
  };

  const handleRejectAll = () => {
    const prefs = { analytics: false, marketing: false };
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowBanner(false);
    if (preferences.analytics) {
      loadAnalytics();
    }
  };

  const togglePreference = (key: "analytics" | "marketing") => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Cookie Preferences
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              We use cookies to enhance your experience, analyze site traffic, and serve personalized content. 
              By clicking "Accept All", you consent to our use of cookies. You can customize your preferences below.
            </p>
            
            {/* Cookie Options */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference("analytics")}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  <strong>Analytics Cookies</strong> - Help us understand how you use our site
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => togglePreference("marketing")}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  <strong>Marketing Cookies</strong> - Allow us to personalize ads and track conversions
                </span>
              </label>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                Learn more about our privacy practices
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectAll}
              className="text-xs sm:text-sm"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePreferences}
              className="text-xs sm:text-sm"
            >
              Save Preferences
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs sm:text-sm"
              style={{ backgroundColor: "#F4A261", color: "white" }}
            >
              Accept All
            </Button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleRejectAll}
            className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
