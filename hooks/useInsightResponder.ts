import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { generateInsightReply } from '../services/geminiService';
import { useCredits } from '../hooks/useCredits';
import { translations } from '../translations';
import { AppLanguage } from '../types';

export const useInsightResponder = (user: any, language: string) => {
    const t = translations[language as AppLanguage].app.sidebar.insight;
    const { checkCredits } = useCredits();

    const [inputMode, setInputMode] = useState<'image' | 'text'>('image');
    const [dragActive, setDragActive] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [textContent, setTextContent] = useState('');
    const [intent, setIntent] = useState('');
    const [tone, setTone] = useState(t.tones.technical);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Results
    const [replies, setReplies] = useState<any[]>([]);
    const [activeReply, setActiveReply] = useState<any | null>(null);

    // Paste Handler
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    if (blob) {
                        setInputMode('image');
                        handleImageSelect(blob);
                        toast.success("¡Imagen pegada del portapapeles!");
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageSelect = async (file: File) => {
        if (file.size > 10 * 1024 * 1024) { 
            toast.error("Imagen muy pesada. Máx 10MB.");
            return;
        }

        const toastId = toast.loading("Procesando imagen...");
        try {
            const compressedBase64 = await compressImage(file);
            setImagePreview(compressedBase64);
            setImageFile(file);
            toast.dismiss(toastId);
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la imagen.");
            toast.dismiss(toastId);
        }
    };

    const handleGenerate = async () => {
        const hasContent = inputMode === 'image' ? imagePreview : textContent.trim();
        if (!hasContent && !intent.trim()) {
            toast.error("Por favor ingresa contenido o describe tu intención.");
            return;
        }

        if (!checkCredits(1)) return;

        setIsGenerating(true);
        setReplies([]);
        setActiveReply(null);

        const resultsSection = document.getElementById('ai-suggestions-results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        try {
            const payload: any = {
                userIntent: intent,
                tone, 
                textContext: inputMode === 'text' ? textContent : undefined
            };

            if (inputMode === 'image' && imagePreview) {
                payload.imageBase64 = imagePreview;
            }

            const results = await generateInsightReply(payload);
            
            if (results && results.length > 0) {
                setReplies(results);
                setActiveReply(results[0]);
                toast.success("¡Insights generados con éxito! ✨");
            } else {
                toast.error("No se recibieron sugerencias. Inténtalo de nuevo.");
            }
        } catch (error: any) {
            console.error("Generation Error:", error);
            toast.error(error.message || "Error al generar insights.");
        } finally {
            setIsGenerating(false);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageFile(null);
        setImagePreview(null);
    };

    return {
        inputMode, setInputMode,
        dragActive, setDragActive,
        imagePreview,
        textContent, setTextContent,
        intent, setIntent,
        tone, setTone,
        isGenerating,
        replies, activeReply,
        handleImageSelect,
        handleGenerate,
        clearImage,
        t
    };
};
