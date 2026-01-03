import React from "react";

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div
            className={`animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-md relative overflow-hidden ${className}`}
        >
            <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] ease-in-out"
                style={{
                    backgroundImage:
                        "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)", // Polished metal shine
                }}
            />
        </div>
    );
};

export default Skeleton;
