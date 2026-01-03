import React, { useState, useRef } from 'react';
import { Sliders, Hash, Filter, Globe, ChevronUp, ChevronDown, Loader2, RotateCcw, Link as LinkIcon, Image as ImageIcon, FileText, Cloud, Plus, X, Sparkles } from 'lucide-react';
import { AppLanguage, CustomSource } from '../../../../types';
import { IdeaParams } from '../../../../services/geminiService';
import { translations } from '../../../../translations';
import Tooltip from '../../../ui/Tooltip';
import { useGoogleDrive } from '../../../../hooks/useGoogleDrive';

interface IdeaConfigurationPanelProps {
    language: AppLanguage;
    niche: string;
    setNiche: (niche: string) => void;
    style: IdeaParams['style'];
    setStyle: (style: IdeaParams['style']) => void;
    source: IdeaParams['source'];
    setSource: (source: IdeaParams['source']) => void;
    count: number;
    setCount: (count: number) => void;
    customContext: CustomSource[];
    setCustomContext: React.Dispatch<React.SetStateAction<CustomSource[]>>;
    onGenerate: () => void;
    loading: boolean;
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
}

const IdeaConfigurationPanel: React.FC<IdeaConfigurationPanelProps> = ({
    language,
    niche,
    setNiche,
    style,
    setStyle,
    source,
    setSource,
    count,
    setCount,
    customContext,
    setCustomContext,
    onGenerate,
    loading,
    isExpanded,
    setIsExpanded
}) => {
    const t = translations[language].app.ideas;
    const tPreview = translations[language].app.preview;

    const [tempLink, setTempLink] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [tempText, setTempText] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleDriveClick } = useGoogleDrive({
        language: language === 'es' ? 'es' : 'en',
        onFileSelected: (file) => setCustomContext(prev => [...prev, file])
    });

    const handleAddLink = () => {
        if (!tempLink) return;
        setCustomContext([...customContext, { id: Date.now().toString(), type: 'link', content: tempLink }]);
        setTempLink('');
        setShowLinkInput(false);
    };

    const handleAddText = () => {
        if (!tempText) return;
        setCustomContext([...customContext, { id: Date.now().toString(), type: 'text', content: tempText }]);
        setTempText('');
        setShowTextInput(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const rawBase64 = base64String.split(',')[1];

            setCustomContext([...customContext, {
                id: Date.now().toString(),
                type: 'image',
                content: rawBase64,
                name: file.name
            }]);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeContextItem = (id: string) => {
        setCustomContext(customContext.filter(c => c.id !== id));
    };

    return (
        <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/60/60 shadow-sm transition-all duration-300">
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
                {/* Header Top Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                            <React.Fragment>
                                {/* Using simple Lightbulb icon here as it was in original */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-white"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                            </React.Fragment>
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold text-slate-900 leading-tight">{t.title}</h1>
                            {!isExpanded && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 animate-in fade-in slide-in-from-left-2">
                                    <span className="font-semibold text-slate-700">{niche}</span>
                                    <span>•</span>
                                    <span>{t.styles[style]}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Compact Generate Button (Visible when collapsed) */}
                        {!isExpanded && (
                            <button
                                onClick={onGenerate}
                                disabled={loading}
                                className="hidden sm:flex px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                {t.generateBtn}
                            </button>
                        )}

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors flex items-center gap-1 text-xs font-bold"
                        >
                            {isExpanded ? tPreview.cancel : t.configTitle}
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Expanded Configuration Panel */}
                <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="bg-white rounded-xl border border-slate-200/60/60 p-5 shadow-sm max-h-[70vh] overflow-y-auto">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5" />
                            {t.configTitle}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

                            {/* 1. Niche Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                    {t.nicheLabel}
                                    <Tooltip>{t.nicheTooltip}</Tooltip>
                                </label>
                                <div className="relative group">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200/60/60 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium transition-all"
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        placeholder={t.nichePlaceholder}
                                    />
                                </div>
                            </div>

                            {/* 2. Style Select */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                    {t.styleLabel}
                                </label>
                                <div className="relative group">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                    <select
                                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200/60/60 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium appearance-none cursor-pointer"
                                        value={style}
                                        onChange={(e) => setStyle(e.target.value as any)}
                                    >
                                        <option value="trending">{t.styles.trending}</option>
                                        <option value="contrarian">{t.styles.contrarian}</option>
                                        <option value="educational">{t.styles.educational}</option>
                                        <option value="story">{t.styles.story}</option>
                                        <option value="predictions">{t.styles.predictions}</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Source Select */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                    {t.sourceLabel}
                                </label>
                                <div className="relative group">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                    <select
                                        className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200/60/60 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium appearance-none cursor-pointer"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value as any)}
                                    >
                                        <option value="news">{t.sourcesOpts.news}</option>
                                        <option value="evergreen">{t.sourcesOpts.evergreen}</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Count Slider */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <label className="text-xs font-bold text-slate-700">{t.countLabel}</label>
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">{count}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="1"
                                    value={count}
                                    onChange={(e) => setCount(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
                                />
                            </div>
                        </div>

                        {/* NEW SECTION: Context Sources */}
                        <div className="border-t border-slate-200/60/60 pt-5">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                    {t.contextLabel}
                                    <Tooltip>{t.contextTooltip}</Tooltip>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <button onClick={() => setShowLinkInput(!showLinkInput)} className="px-3 py-1.5 bg-slate-50 border border-slate-200/60/60 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-1.5">
                                    <LinkIcon className="w-3.5 h-3.5" /> {t.addLink}
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-slate-50 border border-slate-200/60/60 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5" /> {t.addImage}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <button onClick={handleDriveClick} className="px-3 py-1.5 bg-slate-50 border border-slate-200/60/60 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1.5">
                                    <Cloud className="w-3.5 h-3.5" /> {t.addDrive}
                                </button>
                                <button onClick={() => setShowTextInput(!showTextInput)} className="px-3 py-1.5 bg-slate-50 border border-slate-200/60/60 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5" /> {t.addText}
                                </button>
                            </div>

                            {/* Input Areas */}
                            {showLinkInput && (
                                <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        type="text"
                                        value={tempLink}
                                        onChange={(e) => setTempLink(e.target.value)}
                                        placeholder={t.linkPlaceholder}
                                        className="flex-1 px-3 py-2 bg-white border border-slate-200/60/60 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                                        autoFocus
                                    />
                                    <button onClick={handleAddLink} className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"><Plus className="w-4 h-4" /></button>
                                </div>
                            )}
                            {showTextInput && (
                                <div className="flex gap-2 mb-3 animate-in fade-in slide-in-from-top-2">
                                    <textarea
                                        value={tempText}
                                        onChange={(e) => setTempText(e.target.value)}
                                        placeholder={t.pastePlaceholder}
                                        className="flex-1 px-3 py-2 bg-white border border-slate-200/60/60 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none h-16 resize-none"
                                        autoFocus
                                    />
                                    <button onClick={handleAddText} className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 h-16"><Plus className="w-4 h-4" /></button>
                                </div>
                            )}

                            {/* Context List */}
                            {customContext.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {customContext.map((ctx) => (
                                        <div key={ctx.id} className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg max-w-[200px] relative group">
                                            {ctx.type === 'link' && <LinkIcon className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
                                            {ctx.type === 'text' && <FileText className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
                                            {ctx.type === 'drive' && <Cloud className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                                            {ctx.type === 'image' && (
                                                <div className="w-6 h-6 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                                                    <img src={`data:image/jpeg;base64,${ctx.content}`} alt="preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            <span className="text-xs text-slate-700 truncate font-medium">
                                                {ctx.type === 'link' ? new URL(ctx.content).hostname : (ctx.name || (ctx.content.substring(0, 15) + '...'))}
                                            </span>

                                            <button
                                                onClick={() => removeContextItem(ctx.id)}
                                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-slate-200/60/60 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200/60/60 flex justify-end">
                            <button
                                onClick={onGenerate}
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t.generating}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 fill-white" />
                                        {t.generateBtn}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaConfigurationPanel;
