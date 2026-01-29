import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface MagicButtonProps extends HTMLMotionProps<"button"> {
    children?: React.ReactNode;
    className?: string;
    loading?: boolean;
    icon?: React.ReactNode;
}

export const MagicButton: React.FC<MagicButtonProps> = ({
    children,
    className,
    loading = false,
    icon,
    disabled,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ y: -2, boxShadow: "0 10px 20px -10px rgba(10, 102, 194, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            disabled={disabled || loading}
            className={cn(
                "btn-nexus-primary relative overflow-hidden flex items-center justify-center gap-2",
                loading && "opacity-80 cursor-wait",
                className
            )}
            {...props}
        >
            {loading && (
                <div className="absolute inset-0 bg-white/20 shimmer-bg" />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                    icon || <Sparkles className="w-4 h-4" />
                )}
                {children || "Magic Action"}
            </span>
        </motion.button>
    );
};
