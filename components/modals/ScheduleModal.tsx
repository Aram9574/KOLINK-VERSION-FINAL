import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { AppLanguage } from '../../types';
import { translations } from '../../translations';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: Date) => void;
    language: AppLanguage;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onConfirm, language }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedDate || !selectedTime) return;

        const dateTime = new Date(`${selectedDate}T${selectedTime}`);
        onConfirm(dateTime);
        onClose();
    };

    // Get tomorrow's date for min attribute
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const t = {
        title: language === 'es' ? 'Programar Publicación' : 'Schedule Post',
        subtitle: language === 'es' ? 'Elige cuándo quieres que se publique tu contenido.' : 'Choose when you want your content to go live.',
        dateLabel: language === 'es' ? 'Fecha' : 'Date',
        timeLabel: language === 'es' ? 'Hora' : 'Time',
        cancel: language === 'es' ? 'Cancelar' : 'Cancel',
        confirm: language === 'es' ? 'Programar' : 'Schedule',
        warning: language === 'es' ? 'Nota: La publicación automática requiere que tu cuenta esté conectada.' : 'Note: Automatic publishing requires a connected account.'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-200/60/60 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-brand-600" />
                            {t.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">{t.dateLabel}</label>
                        <div className="relative">
                            <input
                                type="date"
                                min={minDate}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200/60 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all pl-10"
                            />
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">{t.timeLabel}</label>
                        <div className="relative">
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200/60 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all pl-10"
                            />
                            <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                    </div>

                    <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-100">
                        {t.warning}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-200/60/60 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedTime}
                        className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Clock className="w-4 h-4" />
                        {t.confirm}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleModal;
