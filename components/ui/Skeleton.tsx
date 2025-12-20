import React from "react";

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div
            className={`animate-pulse bg-slate-200 rounded-md ${className}`}
            style={{
                backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                backgroundSize: "200% 100%",
                animation:
                    "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s infinite linear",
            }}
        />
    );
};

export default Skeleton;
