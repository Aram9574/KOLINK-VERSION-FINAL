import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Monitor, Smartphone, Layout, Clock, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

import { GenerationParams, AppLanguage } from '../../../types';
import { usePostGenerator } from '../../../hooks/usePostGenerator';
import { useUser } from '../../../context/UserContext';
import { usePosts } from '../../../context/PostContext';
import { ALGORITHM_TIPS_CONTENT } from '../../../constants';

import GeneratorForm from './GeneratorForm';
import LinkedInPreview from './LinkedInPreview';

interface PostGeneratorProps {
  onGenerate: (params: GenerationParams) => void;
  isGenerating: boolean;
  credits: number;
  language: AppLanguage;
  showCreditDeduction?: boolean;
  initialTopic?: string;
  initialParams?: GenerationParams | null;
  isCancelled?: boolean;
}

const PostGenerator: React.FC<PostGeneratorProps> = ({
  onGenerate,
  isGenerating,
  credits,
  language,
  showCreditDeduction,
  initialTopic = '',
  initialParams = null,
  isCancelled = false
}) => {
  const { user } = useUser();
  const { params, updateParams } = usePostGenerator({ initialTopic, initialParams });
  const { currentPost, updatePost } = usePosts();

  // Legacy Tip Logic
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ALGORITHM_TIPS_CONTENT[language].length);
    }, 10000);
    return () => clearInterval(interval);
  }, [language]);

  const activeTipContent = ALGORITHM_TIPS_CONTENT[language][currentTipIndex];
  const activeTipIcon = [<Clock className="w-4 h-4" />, <TrendingUp className="w-4 h-4" />, <AlertTriangle className="w-4 h-4" />, <Lightbulb className="w-4 h-4" />][currentTipIndex % 4];


  // UI State for Preview Toggle
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor'); // For mobile only

  const handleGenerate = () => {
    onGenerate(params);
    if (window.innerWidth < 1024) {
      setActiveView('preview'); // Switch to preview on mobile after generate
    }
  };

  // Auto-switch to preview if content exists (e.g. from history)
  useEffect(() => {
    if (currentPost?.content && window.innerWidth < 1024) {
      setActiveView('preview');
    }
  }, [currentPost?.id]);

  // AutoPilot: Check for redirected content
  const location = useLocation();
  useEffect(() => {
    if (location.state?.initialContent && location.state?.fromAutoPilot) {
      // Delay slightly to ensure context is ready
      setTimeout(() => {
        updatePost({
          id: Date.now().toString(), // temporary ID
          content: location.state.initialContent,
          params: params, // use current default params or passed ones
          createdAt: Date.now(),
          likes: 0,
          views: 0,
          isAutoPilot: true
        });
        // Clear state to prevent loop if desired, though navigation usually clears it on refresh
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);

  const handleUpdateContent = (newContent: string) => {
    if (currentPost) {
      updatePost({ ...currentPost, content: newContent });
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">

      {/* Mobile-Only Header Toggle (Visible only on small screens) */}
      <div className="lg:hidden flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full mb-4">
        <button
          onClick={() => setActiveView('editor')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${activeView === 'editor'
            ? 'bg-white text-brand-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <Layout className="w-4 h-4" />
          {language === 'es' ? 'Editor' : 'Editor'}
        </button>
        <button
          onClick={() => setActiveView('preview')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all ${activeView === 'preview'
            ? 'bg-white text-brand-600 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <Monitor className="w-4 h-4" />
          {language === 'es' ? 'Vista Previa' : 'Preview'}
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Left Column: Title, Form, Tips (lg:col-span-6) */}
        <div className={`lg:col-span-6 space-y-6 ${activeView === 'preview' ? 'hidden lg:block' : 'block'}`}>

          {/* Title - Restored from Legacy */}
          <div className="space-y-2 mb-4">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              {language === 'es' ? 'Estudio' : 'Studio'}
            </h1>
            <p className="text-slate-500">
              {language === 'es' ? 'Diseña tu próximo éxito viral.' : 'Design your next viral hit.'}
            </p>
          </div>

          <GeneratorForm
            params={params}
            onUpdateParams={updateParams}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            credits={credits}
            language={language}
            showCreditDeduction={showCreditDeduction}
            isCancelled={isCancelled}
          />

          {/* Tip Widget - Restored from Legacy */}
          <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 text-sm text-indigo-900/80 backdrop-blur-sm transition-all duration-500 relative overflow-hidden group hover:bg-indigo-50 hover:shadow-sm">
            <div key={currentTipIndex} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="font-bold mb-1 flex items-center gap-2 text-indigo-700">
                <div className="p-1 bg-indigo-200 rounded-md">
                  {activeTipIcon}
                </div>
                Hack #{currentTipIndex + 1}: {activeTipContent.title}
              </div>
              <p className="opacity-90 leading-relaxed pl-8">
                {activeTipContent.desc}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-200 w-full">
              <div className="h-full bg-indigo-500 animate-[progress_10s_linear_infinite] origin-left"></div>
            </div>
            <style>{`
                @keyframes progress {
                    0% { width: 0% }
                    100% { width: 100% }
                }
            `}</style>
          </div>
        </div>

        {/* Right Column: Toggle, Preview (lg:col-span-6) */}
        <div className={`lg:col-span-6 flex flex-col h-full ${activeView === 'editor' ? 'hidden lg:flex' : 'flex'}`}>

          {/* View Toggle - Restored Location */}
          <div className="bg-slate-200/50 backdrop-blur-md p-1 rounded-xl mb-6 inline-flex self-center lg:self-end gap-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'desktop'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-500 hover:bg-white/50'
                }`}
            >
              <Monitor className="w-3 h-3" />
              Escritorio
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'mobile'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-500 hover:bg-white/50'
                }`}
            >
              <Smartphone className="w-3 h-3" />
              Móvil
            </button>
          </div>

          <div className={`transition-all duration-500 ease-in-out mx-auto w-full ${viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-2xl'
            }`}>
            <LinkedInPreview
              content={currentPost?.content || ''}
              user={user}
              isLoading={isGenerating}
              language={language}
              onUpdate={handleUpdateContent}
              viralScore={currentPost?.viralScore}
              viralAnalysis={currentPost?.viralAnalysis}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;