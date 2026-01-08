
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
  success: 'bg-white border-l-4 border-l-emerald-500',
  error: 'bg-white border-l-4 border-l-rose-500',
  warning: 'bg-white border-l-4 border-l-amber-500',
  info: 'bg-white border-l-4 border-l-blue-500',
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
      className={`relative w-full max-w-sm p-4 rounded-lg shadow-xl border border-slate-100 flex gap-3 items-start pointer-events-auto ${styles[type]}`}
    >
      <div className="shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-bold text-slate-900">{title}</h4>}
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
