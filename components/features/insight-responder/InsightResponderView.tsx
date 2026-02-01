import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ImageIcon, ScanLine } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { useInsightResponder } from '../../../hooks/useInsightResponder';
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";
import { InsightStudioLayout } from './InsightStudioLayout';
import InputSection from './InputSection';
import TacticsPanel from './TacticsPanel';
import ResultsArea from './ResultsArea';
import { toast } from 'sonner';

const InsightResponderView: React.FC = () => {
    const { user, language } = useUser();
    const {
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
    } = useInsightResponder(user, language);

    if (!user.isPremium) {
        return <PremiumLockOverlay title={t.title} description={t.subtitle} icon={<MessageCircle className="w-8 h-8" />} />;
    }

    // Editor Zone (Left Panel)
    const editorZone = (
        <div className="h-full flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="p-2 bg-blue-50 rounded-xl">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        {t.title}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {t.subtitle}
                    </p>
                </div>

                {/* Mode Selector */}
                <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-inner">
                    {[
                        { id: 'image', icon: ImageIcon, label: t.modes.image },
                        { id: 'text', icon: ScanLine, label: t.modes.text }
                    ].map((mode) => (
                        <button 
                            key={mode.id}
                            onClick={() => setInputMode(mode.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${inputMode === mode.id ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <mode.icon className="w-3.5 h-3.5" />
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Section */}
            <InputSection 
                inputMode={inputMode}
                imagePreview={imagePreview}
                textContent={textContent}
                setTextContent={setTextContent}
                onImageSelect={handleImageSelect}
                onClearImage={clearImage}
                dragActive={dragActive}
                setDragActive={setDragActive}
                isGenerating={isGenerating}
                translations={t}
            />

            {/* Tactics Panel */}
            <TacticsPanel 
                intent={intent}
                setIntent={setIntent}
                tone={tone}
                setTone={setTone}
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
                canGenerate={!!(inputMode === 'image' ? imagePreview : textContent.trim())}
                translations={t}
            />
        </div>
    );

    // Preview Zone (Right Panel)
    const previewZone = (
        <ResultsArea 
            isGenerating={isGenerating}
            replies={replies}
            activeReply={activeReply}
            onCopy={() => toast.success("Copiado con Autoridad 🛡️")}
        />
    );

    return (
        <div className="h-full w-full bg-slate-50 relative overflow-hidden flex flex-col">
             {/* Background Grid */}
             <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
            />

            <InsightStudioLayout 
                editorZone={editorZone}
                previewZone={previewZone}
                hasResults={replies.length > 0 || isGenerating}
            />
        </div>
    );
};

export default InsightResponderView;
