import React from "react";
import { CarouselStudio as NewCarouselStudio } from "./carousel/CarouselStudio";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay"; // Can be removed later
import { useCarouselStore } from '@/lib/store/useCarouselStore';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, LogIn } from 'lucide-react';
import { useState } from 'react';

interface CarouselStudioProps {
    initialContent?: string;
    hideHeader?: boolean;
}

const CarouselStudio: React.FC<CarouselStudioProps> = ({ initialContent, hideHeader }) => {
    const { language, user } = useUser();
    const navigate = useNavigate();
    const { project, updateSettings } = useCarouselStore(); // Get project
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        // 1. Check Auth (Guest detection)
        const isGuest = !user?.id || user.id.startsWith('mock-');

        if (isGuest) {
            setShowAuthModal(true);
            return;
        }

        // 2. Save Logic
        setIsSaving(true);
        try {
            // Generate ID if new
            const projectId = project.id === 'new-project' ? crypto.randomUUID() : project.id;
            
            // Save to DB
            const { error } = await supabase
                .from('carousels') // Ensure table exists
                .upsert({
                    id: projectId,
                    user_id: user.id,
                    title: project.title,
                    content: project, // JSONB
                    updated_at: new Date().toISOString()
                });
             
             if (error) throw error;
             
             // Update store ID if it was new
             if (project.id === 'new-project') {
                 useCarouselStore.setState(state => ({ 
                     project: { ...state.project, id: projectId } 
                 }));
             }
             
             toast.success(language === 'es' ? '¡Proyecto guardado!' : 'Project saved!');
        } catch (e) {
             console.error("Save failed:", e);
             toast.error(language === 'es' ? 'Error al guardar' : 'Failed to save');
        } finally {
             setIsSaving(false);
        }
    };

    // Allow anonymous usage (Action 12)
    // if (!user.isPremium) { ... }

    return (
        <div className={`${hideHeader ? 'h-full' : 'h-screen'} flex flex-col bg-slate-50 overflow-hidden`}>
            {/* Minimalist Header for Standalone Route */}
            {!hideHeader && (
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{language === 'es' ? 'Volver' : 'Back'}</span>
                    </button>
                    <div className="h-6 w-px bg-slate-200" />
                    <h1 className="font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        {language === 'es' ? 'Estudio de Carruseles' : 'Carousel Studio'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={handleSave} 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-brand-200 text-brand-700 hover:bg-brand-50 hover:text-brand-800 hidden sm:flex"
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : (language === 'es' ? 'Guardar' : 'Save Project')}
                    </Button>
                </div>
                </header>
            )}

            <div className="flex-1 min-h-0 overflow-hidden">
                <NewCarouselStudio initialContent={initialContent} />
            </div>
            {/* Auth Trigger Modal */}
            <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{language === 'es' ? 'Guarda tu progreso' : 'Save your progress'}</DialogTitle>
                        <DialogDescription>
                            {language === 'es' 
                                ? 'Crea una cuenta gratuita para guardar tus carruseles y acceder a ellos desde cualquier lugar.' 
                                : 'Create a free account to save your carousels and access them from anywhere.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-4">
                        <Button onClick={() => navigate('/login?redirect=/carousel-studio')} className="w-full gap-2">
                            <LogIn className="w-4 h-4" />
                            {language === 'es' ? 'Iniciar Sesión / Registrarse' : 'Log In / Sign Up'}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowAuthModal(false)}>
                            {language === 'es' ? 'Continuar sin guardar' : 'Continue without saving'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CarouselStudio;
