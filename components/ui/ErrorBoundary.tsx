import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analytics } from '../../services/analyticsService';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    variant?: 'full' | 'minimal';
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    // ... (inside class)

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        
        // Analytics Tracking
        analytics.track('client_error', {
            message: error.message,
            stack: error.stack?.substring(0, 500), // Truncate
            componentStack: errorInfo.componentStack?.substring(0, 500)
        });

        // Fire and forget logging
        this.logErrorToSupabase(error, errorInfo);
    }

    private async logErrorToSupabase(error: Error, errorInfo: ErrorInfo) {
        try {
            // @ts-ignore
            const { data: { session } } = await supabase.auth.getSession();
            
            await supabase.functions.invoke('log-error', {
                body: {
                    error_message: error.message,
                    stack_trace: error.stack + "\n\nComponent Stack:\n" + errorInfo.componentStack,
                    component: "ErrorBoundary",
                    user_id: session?.user?.id,
                    metadata: {
                        url: window.location.href,
                        userAgent: navigator.userAgent,
                        resolution: `${window.innerWidth}x${window.innerHeight}`
                    }
                }
            });
        } catch (loggingError) {
            console.error("Failed to send error log:", loggingError);
        }
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            if (this.props.variant === 'minimal') {
                return (
                    <div className="p-6 rounded-2xl border border-red-100 bg-red-50/30 flex flex-col items-center justify-center text-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900">Algo falló aquí</p>
                            <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">Este módulo no pudo cargar, pero el resto funciona bien.</p>
                        </div>
                        <button 
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Reintentar
                        </button>
                    </div>
                );
            }

            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-slate-100">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Algo salió mal</h1>
                        <p className="text-slate-500 mb-6">
                            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado automáticamente.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left overflow-auto max-h-32">
                            <code className="text-xs text-slate-600 font-mono">
                                {this.state.error?.message}
                                {this.state.error?.stack && (
                                    <div className="mt-2 pt-2 border-t border-slate-200 whitespace-pre-wrap">
                                        {this.state.error.stack.split('\n')[0]}
                                    </div>
                                )}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Recargar Aplicación
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
