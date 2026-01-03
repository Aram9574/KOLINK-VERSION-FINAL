export const hapticFeedback = {
  initial: { scale: 1, y: 0 },
  whileHover: { 
    y: -2,
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },
  whileTap: { 
    scale: 0.96,
    transition: { type: "spring", stiffness: 400, damping: 17 }
  }
};

// Keeping for backward compatibility but updating to match SOTA physics
export const hoverClick = hapticFeedback;

export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
