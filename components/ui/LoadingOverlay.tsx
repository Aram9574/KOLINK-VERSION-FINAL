
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullscreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = "Loading...", fullscreen = false }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`
            flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50
            ${fullscreen ? 'fixed inset-0' : 'absolute inset-0 rounded-inherit'}
          `}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-xl border border-slate-100"
          >
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
