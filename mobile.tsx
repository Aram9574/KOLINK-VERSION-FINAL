import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { UserProvider } from "./context/UserContext";
import MobileApp from "./MobileApp"; // Points to the new MobileApp component
import "./index.css";
import * as Sentry from "@sentry/react";
import { PostHogProvider } from "posthog-js/react";
import { initAnalytics } from "./services/analytics";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

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

// Mobile specific initialization
if (Capacitor.isNativePlatform()) {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack) {
            CapacitorApp.exitApp();
        } else {
            window.history.back();
        }
    });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <PostHogProvider client={posthogClient}>
                <HelmetProvider>
                    <BrowserRouter>
                        <UserProvider>
                            <MobileApp />
                        </UserProvider>
                    </BrowserRouter>
                </HelmetProvider>
            </PostHogProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
