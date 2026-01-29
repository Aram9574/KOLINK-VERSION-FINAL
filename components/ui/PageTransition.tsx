import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1], // Cubic bezier for smooth premium feel
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: 'blur(5px)',
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className={`w-full h-full ${className || ''}`}
        >
            {children}
        </motion.div>
    );
};
