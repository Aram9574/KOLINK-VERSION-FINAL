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
import { toast } from "sonner";

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
import { supabase } from "./services/supabaseClient";

// Mobile specific initialization
if (Capacitor.isNativePlatform()) {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack) {
            CapacitorApp.exitApp();
        } else {
            window.history.back();
        }
    });

    const handleAuthURL = async (urlString: string) => {
        console.log("Processing Auth URL:", urlString);
        try {
            const url = new URL(urlString);
            const hash = url.hash.substring(1);
            const search = url.search.substring(1);
            const params = new URLSearchParams(hash || search);

            const access_token = params.get("access_token");
            const refresh_token = params.get("refresh_token");
            const provider_token = params.get("provider_token");
            const code = params.get("code");

            if (provider_token) {
                console.log("Found provider_token in URL, storing...");
                localStorage.setItem("linkedin_provider_token", provider_token);
            }

            if (access_token && refresh_token) {
                toast.info("Iniciando sesión...");
                console.log(
                    "Direct tokens found. Has access_token:",
                    !!access_token,
                    "Has provider_token (URL):",
                    !!provider_token,
                );

                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });
                if (error) throw error;
                toast.success("¡Sesión iniciada!");
            } else if (code) {
                toast.info("Canjeando código de acceso...");
                const { data, error } = await supabase.auth
                    .exchangeCodeForSession(code);
                if (error) throw error;

                // Capture provider_token from exchange if available
                if (data?.session?.provider_token) {
                    console.log(
                        "Found provider_token in code exchange, storing...",
                    );
                    localStorage.setItem(
                        "linkedin_provider_token",
                        data.session.provider_token,
                    );
                }

                toast.success("¡Acceso verificado!");
            }
        } catch (e: any) {
            console.error("Auth URL Error:", e);
            toast.error(
                "Error en la autenticación: " + (e.message || "URL no válida"),
            );
        }
    };

    // Handle Deep Links (App is already open)
    CapacitorApp.addListener("appUrlOpen", async (data: any) => {
        handleAuthURL(data.url);
    });

    // Handle Cold Start (App was closed)
    CapacitorApp.getLaunchUrl().then((data) => {
        if (data?.url) {
            handleAuthURL(data.url);
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
