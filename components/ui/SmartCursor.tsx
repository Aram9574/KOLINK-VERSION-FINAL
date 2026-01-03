import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const SmartCursor: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring configuration for the "luxury" feel
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[9999] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
                x: cursorX,
                y: cursorY,
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
                filter: "blur(40px)",
            }}
        />
    );
};

export default SmartCursor;
