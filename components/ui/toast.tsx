
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const variants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const styles = {
  success: 'border-emerald-500/50 bg-emerald-50/50 text-emerald-900',
  error: 'border-rose-500/50 bg-rose-50/50 text-rose-900',
  warning: 'border-amber-500/50 bg-amber-50/50 text-amber-900',
  info: 'border-blue-500/50 bg-blue-50/50 text-blue-900',
};

const Toast: React.FC<ToastProps> = ({ id, type, title, message, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative w-full max-w-sm p-4 rounded-2xl shadow-soft-glow backdrop-blur-xl border flex gap-3 items-start pointer-events-auto overflow-hidden ${styles[type]}`}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      <div className="shrink-0 mt-0.5 relative z-10">{icons[type]}</div>
      <div className="flex-1 relative z-10">
        {title && <h4 className="text-sm font-bold tracking-tight mb-1">{title}</h4>}
        <p className="text-sm opacity-90 leading-relaxed font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="relative z-10 p-1 rounded-full hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 opacity-60" />
      </button>
    </motion.div>
  );
};

export default Toast;
