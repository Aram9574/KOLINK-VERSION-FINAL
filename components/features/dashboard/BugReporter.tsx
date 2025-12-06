
import React, { useState } from 'react';
import { Bug, X, Send, MessageSquareWarning, CheckCircle2 } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface BugReporterProps {
  language: AppLanguage;
}

const BugReporter: React.FC<BugReporterProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[language].bugReport || {
    title: "Report Bug",
    subtitle: "Found an issue?",
    placeholder: "Describe what happened...",
    cancel: "Cancel",
    send: "Send",
    sending: "Sending...",
    success: "Thanks!",
    buttonLabel: "Report Bug"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.trim()) return;

    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setReport('');

      // Auto close after success
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => setIsSuccess(false), 300); // Reset success state after close
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-end pointer-events-none">

      {/* The Form Modal */}
      <div className={`pointer-events-auto mb-4 w-80 bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-2xl transform transition-all duration-300 origin-bottom-right overflow-hidden
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none h-0'}
      `}>
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">{t.success}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-brand-600">
                <MessageSquareWarning className="w-5 h-5" />
                <h3 className="font-bold text-sm">{t.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">{t.subtitle}</p>

            <textarea
              className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none resize-none placeholder-slate-400 mb-4"
              placeholder={t.placeholder}
              value={report}
              onChange={(e) => setReport(e.target.value)}
              autoFocus={isOpen}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={!report.trim() || isSending}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    {t.send}
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* The Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto group relative w-12 h-12 rounded-full shadow-lg shadow-brand-900/10 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95
            ${isOpen ? 'bg-slate-100 text-slate-600 rotate-90' : 'bg-white text-slate-400 hover:text-brand-600'}
        `}
        title={t.buttonLabel}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bug className="w-5 h-5" />}

        {/* Pulse effect when closed to draw attention occasionally */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default BugReporter;
