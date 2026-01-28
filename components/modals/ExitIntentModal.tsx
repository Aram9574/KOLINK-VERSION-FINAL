import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, FileText, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ExitIntentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onClose();
            toast.success("¡Guía enviada a tu bandeja de entrada!", {
                description: "redireccionando al registro..."
            });
            // Redirect to signup with email pre-filled intent
            navigate(`/login?email=${encodeURIComponent(email)}&intent=checklist`);
        }, 800);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden border-0">
                <div className="bg-brand-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileText size={120} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">¡Espera! No te vayas con las manos vacías.</h2>
                        <p className="text-brand-100 mb-6">
                            Obtén nuestra **"Guía de Crecimiento en LinkedIn"** gratuita usada por los mejores creadores para alcanzar 10k seguidores.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white">
                    <div className="space-y-3 mb-6">
                         {[
                            "La Fórmula 'Hook-Body-CTA'",
                            "Mejores horarios para publicar (Datos 2025)",
                            "Auditoría de Optimización de Perfil"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                             <Input 
                                type="email" 
                                placeholder="Introduce tu email" 
                                className="h-11"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full h-11 text-base font-bold gap-2" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviarme la Guía'}
                            <ArrowRight size={18} />
                        </Button>
                    </form>
                    
                    <button 
                        onClick={onClose} 
                        className="w-full text-center text-xs text-slate-400 mt-4 hover:text-slate-600 hover:underline"
                    >
                        No gracias, prefiero no crecer.
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
