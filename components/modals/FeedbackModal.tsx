import React, { useState } from 'react';
import { X, MessageSquare, Bug, Lightbulb, Send } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../context/UserContext';
import { toast } from 'sonner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [type, setType] = useState<'bug' | 'suggestion' | 'other'>('suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (!user) {
      toast.error('Debes iniciar sesión para enviar feedback.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id,
        type,
        message,
        status: 'open'
      });

      if (error) throw error;

      toast.success('¡Gracias por tu feedback!', {
        description: 'Hemos recibido tus comentarios correctamente.'
      });
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error al enviar feedback', {
        description: error.message || 'Por favor intenta de nuevo más tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-brand-500" />
              Enviar Feedback
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => setType('suggestion')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                  type === 'suggestion' 
                    ? 'bg-white text-brand-600 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Idea
              </button>
              <button
                type="button"
                onClick={() => setType('bug')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                  type === 'bug' 
                    ? 'bg-white text-red-600 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Bug className="w-4 h-4" />
                Error
              </button>
              <button
                type="button"
                onClick={() => setType('other')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                  type === 'other' 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Otro
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === 'bug' 
                    ? "Describe el error que encontraste..." 
                    : "Cuéntanos tu sugerencia..."
                }
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none resize-none text-slate-700 placeholder:text-slate-400 transition-all font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Enviando...' : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Comentarios
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
