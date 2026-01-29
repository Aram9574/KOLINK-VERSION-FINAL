import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: 'online' | 'processing' | 'error' | 'success' | 'neutral';
    text?: string;
    className?: string;
    animate?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    text,
    className,
    animate = true
}) => {
    const styles = {
        online: "bg-emerald-50 text-emerald-700 border-emerald-200",
        processing: "bg-brand-50 text-brand-700 border-brand-200",
        error: "bg-red-50 text-red-700 border-red-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        neutral: "bg-slate-50 text-slate-700 border-slate-200"
    };

    const dotStyles = {
        online: "bg-emerald-500",
        processing: "bg-brand-500",
        error: "bg-red-500",
        success: "bg-emerald-500",
        neutral: "bg-slate-400"
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium",
            styles[status],
            className
        )}>
            <span className="relative flex h-2 w-2">
                {animate && (['online', 'processing'].includes(status)) && (
                    <span className={cn(
                        "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                        dotStyles[status]
                    )} />
                )}
                <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    dotStyles[status]
                )} />
            </span>
            {text || status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
    );
};
