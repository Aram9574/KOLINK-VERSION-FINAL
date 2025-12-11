import React, { useState } from 'react';
import { usePosts } from '../../../context/PostContext';
import { analyzeBrandVoice, BrandVoiceAnalysisResult } from '../../../services/geminiService';
import { AppLanguage, Post } from '../../../types';
import { translations } from '../../../translations';
import { Wand2, AlertCircle, Check, Loader2, FileText, History } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAnalyzerProps {
    language: AppLanguage;
    onAnalysisComplete: (result: BrandVoiceAnalysisResult) => void;
    onCancel: () => void;
}

const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ language, onAnalysisComplete, onCancel }) => {
    const { posts } = usePosts();
    const [mode, setMode] = useState<'history' | 'manual'>('history');
    const [manualText, setManualText] = useState('');
    const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Filter for posts that have substantial content (e.g. > 50 chars)
    const validPosts = posts.filter(p => p.content && p.content.length > 50).slice(0, 20); // Limit to recent 20

    const togglePostSelection = (postId: string) => {
        setSelectedPostIds(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : prev.length < 5 ? [...prev, postId] : prev
        );
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            let samples: string[] = [];

            if (mode === 'history') {
                if (selectedPostIds.length === 0) {
                    toast.error("Select at least one post");
                    setIsAnalyzing(false);
                    return;
                }
                samples = validPosts
                    .filter(p => selectedPostIds.includes(p.id))
                    .map(p => p.content);
            } else {
                if (manualText.length < 100) {
                    toast.error("Please provide at least 100 characters for analysis");
                    setIsAnalyzing(false);
                    return;
                }
                samples = [manualText];
            }

            const result = await analyzeBrandVoice({
                contentSamples: samples,
                language
            });

            onAnalysisComplete(result);
        } catch (error) {
            console.error(error);
            toast.error("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-brand-600" />
                {language === 'es' ? 'Analizador de Voz con IA' : 'AI Voice Analyzer'}
            </h3>

            <div className="flex gap-2 mb-4 bg-white p-1 rounded-lg border border-slate-200 w-fit">
                <button
                    onClick={() => setMode('history')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 ${mode === 'history' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <History className="w-4 h-4" />
                    {language === 'es' ? 'Desde Historial' : 'From History'}
                </button>
                <button
                    onClick={() => setMode('manual')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-2 ${mode === 'manual' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <FileText className="w-4 h-4" />
                    {language === 'es' ? 'Texto Manual' : 'Manual Text'}
                </button>
            </div>

            {mode === 'history' ? (
                <div className="space-y-3 mb-6">
                    <p className="text-sm text-slate-500">
                        {language === 'es'
                            ? 'Selecciona hasta 5 de tus mejores posts para que la IA aprenda tu estilo exacto.'
                            : 'Select up to 5 of your best posts for the AI to learn your exact style.'}
                    </p>

                    {validPosts.length === 0 ? (
                        <div className="text-center p-8 bg-white rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-400 text-sm">No recent posts found to analyze.</p>
                        </div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {validPosts.map(post => {
                                const isSelected = selectedPostIds.includes(post.id);
                                return (
                                    <div
                                        key={post.id}
                                        onClick={() => togglePostSelection(post.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all text-sm ${isSelected ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="line-clamp-2 text-slate-700">{post.content}</div>
                                        <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div className="text-xs text-slate-500 text-right">
                        {selectedPostIds.length}/5 selected
                    </div>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    <p className="text-sm text-slate-500">
                        {language === 'es'
                            ? 'Pega ejemplos de tu contenido, correos o artículos que representen tu voz.'
                            : 'Paste examples of your content, emails, or articles that represent your voice.'}
                    </p>
                    <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        className="w-full h-40 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        placeholder="..."
                    />
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || (mode === 'history' && selectedPostIds.length === 0) || (mode === 'manual' && manualText.length < 50)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4" />
                            {language === 'es' ? 'Analizar Voz' : 'Analyze Voice'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default VoiceAnalyzer;
