
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BrainCircuit, X, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { updateUserProfile } from '../../services/userRepository';

interface BrandVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
}

const BrandVoiceModal: React.FC<BrandVoiceModalProps> = ({ isOpen, onClose, language = 'es' }) => {
  const { user, setUser } = useUser();
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);

  const predefinedTones = [
    { id: 'professional', label: 'Profesional & Autoritario', desc: 'Directo, experto, sin rodeos.' },
    { id: 'casual', label: 'Casual & Amigable', desc: 'Cercano, usa emojis, fácil de leer.' },
    { id: 'storyteller', label: 'Storyteller & Emotivo', desc: 'Narrativo, inspirador, personal.' },
  ];

  const handleSave = async (selectedTone?: string) => {
    const finalTone = selectedTone || tone;
    if (!finalTone) return;

    setLoading(true);
    try {
      // Optimistic update
      setUser(prev => ({ ...prev, brandVoice: finalTone }));
      
      if (user.id) {
        await updateUserProfile(user.id, { brandVoice: finalTone });
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Configura tu Voz de Marca</h3>
                  <p className="text-xs text-slate-500">Para que la IA escriba como tú.</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Estilos Predefinidos</label>
                <div className="grid grid-cols-1 gap-3">
                  {predefinedTones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSave(t.label)}
                      className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm text-slate-300 group-hover:text-purple-500">
                        <Activity className="w-4 h-4" />
                      </div>
                       <div>
                         <p className="font-bold text-slate-800 text-sm">{t.label}</p>
                         <p className="text-xs text-slate-500 group-hover:text-slate-600">{t.desc}</p>
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform group-hover:text-purple-500" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">O escribe el tuyo</span>
                </div>
              </div>

              <div className="space-y-3">
                <textarea 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Ej: Soy un experto en finanzas que usa un tono serio pero accesible, con metáforas deportivas y un toque de humor irónico..."
                  className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm min-h-[100px] resize-none"
                />
                
                <button
                  onClick={() => handleSave()}
                  disabled={!tone.trim() || loading}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                  Guardar Voz de Marca
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BrandVoiceModal;
