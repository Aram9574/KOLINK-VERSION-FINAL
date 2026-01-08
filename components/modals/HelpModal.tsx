import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Mail, Book, MessageSquare } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white rounded-2xl shadow-2xl p-6 z-50 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Ayuda y Recursos</h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <a href="mailto:soporte@kolink.ai" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">Contactar Soporte</h3>
                                    <p className="text-sm text-slate-500">¿Tienes un problema? Escríbenos.</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                            </a>

                            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-70">
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <Book className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">Documentación (Pronto)</h3>
                                    <p className="text-sm text-slate-500">Guías detalladas y tutoriales.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-brand-50 rounded-xl border border-brand-100 flex items-start gap-3">
                             <MessageSquare className="w-5 h-5 text-brand-600 mt-0.5" />
                             <div>
                                 <p className="text-sm font-bold text-brand-700"> Consejo Pro</p>
                                 <p className="text-sm text-brand-600 mt-1">Usa al <strong>Estratega Personal IA</strong> para preguntas rápidas sobre cómo mejorar tu perfil.</p>
                             </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HelpModal;
