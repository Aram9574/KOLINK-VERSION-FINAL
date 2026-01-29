import React from "react";

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
    return (
        <div
            className={`shimmer-bg bg-slate-200/50 dark:bg-slate-800/50 rounded-md relative overflow-hidden ${className}`}
        />
    );
};

export default Skeleton;
