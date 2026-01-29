import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { Card } from '../../ui/card';

interface AffiliateTermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AffiliateTermsModal: React.FC<AffiliateTermsModalProps> = ({ isOpen, onClose }) => {
    const { language } = useUser();
    const t = translations[language].affiliatePage.terms;

    // Prevent scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
             document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={(e) => e.stopPropagation()} 
                    >
                         <Card className="w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border-slate-200">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold font-display text-slate-900">{t.title}</h3>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
                                <p className="text-slate-600 leading-relaxed font-medium bg-rose-50 p-4 rounded-xl border border-rose-100 text-sm">
                                    {t.intro}
                                </p>

                                <div className="space-y-8">
                                    {t.sections.map((section: any, index: number) => (
                                        <section key={index} className="space-y-2">
                                            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                                {section.title}
                                            </h4>
                                            <p className="text-slate-600 leading-relaxed text-sm text-justify">
                                                {section.content}
                                            </p>
                                        </section>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <button 
                                    onClick={onClose}
                                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all text-sm"
                                >
                                    {t.close}
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AffiliateTermsModal;
