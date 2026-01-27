import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/react";
import { PostHogProvider } from "posthog-js/react";
import { initAnalytics } from "./services/analytics";

const posthogClient = initAnalytics();

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PostHogProvider client={posthogClient}>
          <HelmetProvider>
            <BrowserRouter>
              <UserProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </UserProvider>
            </BrowserRouter>
          </HelmetProvider>
        </PostHogProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
