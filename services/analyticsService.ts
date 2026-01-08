export const AnalyticsService = {
  // Use a simple console logger for now, can be swapped for PostHog/Mixpanel later
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Event: ${eventName}`, properties);
    }
    // TODO: Send to external service
  },

  trackPageView: (pageName: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] PageView: ${pageName}`);
    }
     // TODO: Send to external service
  },

  identifyUser: (userId: string, traits?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] Identify: ${userId}`, traits);
    }
  }
};
