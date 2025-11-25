


import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ExternalLink, Lightbulb, Loader2, Sliders, Hash, Globe, Filter, ChevronUp, ChevronDown, RotateCcw, Link as LinkIcon, Image as ImageIcon, FileText, X, Plus, Cloud } from 'lucide-react';
import { UserProfile, AppLanguage, CustomSource } from '../types';
import { generatePostIdeas, IdeaResult, IdeaParams } from '../services/geminiService';
import { translations } from '../translations';
import Tooltip from './Tooltip';

declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

interface IdeaGeneratorProps {
    user: UserProfile;
    language: AppLanguage;
    onSelectIdea: (idea: string) => void;
}

const STORAGE_KEY = 'kolink_idea_cache';

const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ user, language, onSelectIdea }) => {
    const [ideas, setIdeas] = useState<IdeaResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Configuration State
    const [niche, setNiche] = useState(user.headline || "");
    const [style, setStyle] = useState<IdeaParams['style']>('trending');
    const [source, setSource] = useState<IdeaParams['source']>('news');
    const [count, setCount] = useState(4);

    // Custom Context State
    const [customContext, setCustomContext] = useState<CustomSource[]>([]);
    const [tempLink, setTempLink] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [tempText, setTempText] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Google Picker State
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [pickerInited, setPickerInited] = useState(false);

    // UI State
    const [isConfigExpanded, setIsConfigExpanded] = useState(true);

    const t = translations[language].app.ideas;
    const tPreview = translations[language].app.preview;

    // Load cached ideas on mount
    useEffect(() => {
        try {
            const cachedData = sessionStorage.getItem(STORAGE_KEY);
            if (cachedData) {
                const parsed = JSON.parse(cachedData);
                setIdeas(parsed);
                setIsConfigExpanded(false); // Auto-collapse if we have cached data
            }

            // Load cached context (Text/Links only)
            const cachedContext = sessionStorage.getItem(STORAGE_KEY + '_context');
            if (cachedContext) {
                const parsedCtx = JSON.parse(cachedContext);
                setCustomContext(parsedCtx);
            }

        } catch (e) {
            console.warn("Failed to load ideas from cache", e);
        }
    }, []);

    // Save context changes (excluding images to avoid storage quota limits)
    useEffect(() => {
        const safeContext = customContext.filter(c => c.type !== 'image' && c.type !== 'drive');
        if (safeContext.length > 0) {
            sessionStorage.setItem(STORAGE_KEY + '_context', JSON.stringify(safeContext));
        }
    }, [customContext]);

    // Initialize Google API and Identity Services
    useEffect(() => {
        const initializeGoogle = () => {
            // Ensure all required Google objects are present
            if (!window.google || !window.google.accounts || !window.google.accounts.oauth2 || !window.gapi) {
                return;
            }

            const clientId = process.env.GOOGLE_CLIENT_ID;

            // CRITICAL FIX: Prevent crash if ID is missing or invalid
            if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
                console.warn("Google Client ID is missing or empty. Drive integration disabled.");
                return;
            }

            try {
                // Initialize Identity Services (for Token)
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'https://www.googleapis.com/auth/drive.readonly',
                    callback: (response: any) => {
                        if (response.error !== undefined) {
                            console.error("Auth Error:", response);
                            return;
                        }
                        createPicker(response.access_token);
                    },
                });
                setTokenClient(client);

                // Load Picker API
                window.gapi.load('picker', () => {
                    setPickerInited(true);
                });
            } catch (e) {
                console.error("Error initializing Google Auth:", e);
            }
        };

        // Check if scripts are loaded, if not, wait for window load
        if (document.readyState === 'complete') {
            initializeGoogle();
        } else {
            window.addEventListener('load', initializeGoogle);
        }

        // Attempt immediate init in case we mounted after load event or scripts loaded async
        const timer = setTimeout(initializeGoogle, 1000);

        return () => {
            window.removeEventListener('load', initializeGoogle);
            clearTimeout(timer);
        };
    }, []);

    const createPicker = (accessToken: string) => {
        if (!pickerInited || !process.env.GOOGLE_CLIENT_ID) {
            console.warn("Picker API not loaded or Client ID missing");
            return;
        }

        const pickerCallback = (data: any) => {
            if (data.action === window.google.picker.Action.PICKED) {
                const file = data.docs[0];
                const fileId = file.id;
                const name = file.name;
                const mimeType = file.mimeType;

                // Ideally we fetch content here. For now, we simulate success and add metadata.
                // In production, use fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`, ...)
                fetchDriveFileContent(fileId, accessToken, mimeType, name);
            }
        };

        const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
        const picker = new window.google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(accessToken)
            .setDeveloperKey(process.env.GOOGLE_API_KEY || '') // Required for Picker
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    };

    const fetchDriveFileContent = async (fileId: string, accessToken: string, mimeType: string, name: string) => {
        // Logic to attempt to get text content from the file to pass to Gemini
        let content = `File ID: ${fileId}`;

        try {
            let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

            // If it's a Google Doc, we need to export it
            if (mimeType === 'application/vnd.google-apps.document') {
                url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (res.ok) {
                content = await res.text();
            }
        } catch (e) {
            console.warn("Could not fetch drive content, using metadata only", e);
        }

        setCustomContext(prev => [...prev, {
            id: fileId,
            type: 'drive',
            content: content,
            name: name,
            mimeType: mimeType
        }]);
    };

    const handleDriveClick = () => {
        const clientId = process.env.GOOGLE_CLIENT_ID;

        // Explicit check before trying to use tokenClient
        if (!clientId || clientId.trim() === '') {
            const msg = language === 'es'
                ? "Error: Falta configurar el GOOGLE_CLIENT_ID en el entorno."
                : "Error: GOOGLE_CLIENT_ID is missing in environment variables.";
            alert(msg);
            return;
        }

        if (!tokenClient) {
            const msg = language === 'es'
                ? "La integración de Drive se está cargando o ha fallado. Revisa la consola."
                : "Drive integration is loading or failed. Check console.";
            alert(msg);
            return;
        }
        // Trigger Auth Flow
        tokenClient.requestAccessToken({ prompt: 'consent' });
    };

    const handleGenerate = async () => {
        setLoading(true);

        try {
            const result = await generatePostIdeas(user, language, {
                niche,
                style,
                source,
                count,
                customContext: customContext
            });

            setIdeas(result);
            setIsConfigExpanded(false); // Auto-collapse to show results

            // Save results to session storage
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
            } catch (e) {
                console.warn("Failed to save ideas to cache", e);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            // Remove data url prefix for API consumption later, but keep it for preview if needed
            // Actually Gemini needs pure base64 for inlineData.
            // Format: data:image/jpeg;base64,.....
            const rawBase64 = base64String.split(',')[1];

            setCustomContext([...customContext, {
                id: Date.now().toString(),
                type: 'image',
                content: rawBase64,
                name: file.name // Store name for UI
            }]);
        };
        reader.readAsDataURL(file);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeContextItem = (id: string) => {
        setCustomContext(customContext.filter(c => c.id !== id));
    };

    return (
        <div className="w-full h-full flex flex-col relative">

            {/* Sticky Configuration Header */}
            <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">

                    {/* Header Top Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                                <Lightbulb className="w-5 h-5 fill-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-display font-bold text-slate-900 leading-tight">{t.title}</h1>
                                {!isConfigExpanded && (
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
                            {!isConfigExpanded && (
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="hidden sm:flex px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                                    {t.generateBtn}
                                </button>
                            )}

                            <button
                                onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors flex items-center gap-1 text-xs font-bold"
                            >
                                {isConfigExpanded ? tPreview.cancel : t.configTitle}
                                {isConfigExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Expanded Configuration Panel */}
                    <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isConfigExpanded ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm max-h-[70vh] overflow-y-auto">
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
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium transition-all"
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
                                            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium appearance-none cursor-pointer"
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
                                            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm font-medium appearance-none cursor-pointer"
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
                                        min="3"
                                        max="10"
                                        step="1"
                                        value={count}
                                        onChange={(e) => setCount(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
                                    />
                                </div>
                            </div>

                            {/* NEW SECTION: Context Sources */}
                            <div className="border-t border-slate-100 pt-5">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                        {t.contextLabel}
                                        <Tooltip>{t.contextTooltip}</Tooltip>
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <button onClick={() => setShowLinkInput(!showLinkInput)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-1.5">
                                        <LinkIcon className="w-3.5 h-3.5" /> {t.addLink}
                                    </button>
                                    <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-1.5">
                                        <ImageIcon className="w-3.5 h-3.5" /> {t.addImage}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    <button onClick={handleDriveClick} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-1.5">
                                        <Cloud className="w-3.5 h-3.5" /> {t.addDrive}
                                    </button>
                                    <button onClick={() => setShowTextInput(!showTextInput)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all flex items-center gap-1.5">
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
                                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
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
                                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none h-16 resize-none"
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
                                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleGenerate}
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

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex-1 w-full">
                {loading && !ideas && (
                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse flex flex-col justify-center p-6 space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 rounded w-full"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                <div className="mt-auto h-10 bg-slate-100 rounded-xl w-full"></div>
                            </div>
                        ))}
                    </div>
                )}

                {ideas && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-500 pb-20">
                        <div className="grid md:grid-cols-2 gap-6">
                            {ideas.ideas.map((idea, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="mb-6 relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                {t.angle} {idx + 1}
                                            </span>
                                        </div>
                                        <p className="text-lg font-medium text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors">
                                            "{idea.replace(/"/g, '')}"
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onSelectIdea(idea)}
                                        className="w-full py-3.5 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        {t.useThis}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Grounding Sources - Only show if available */}
                        {ideas.sources && ideas.sources.length > 0 && (
                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden">

                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">{t.sources}</h4>
                                        <p className="text-[10px] text-slate-500">{t.realTimeData}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                                    {ideas.sources.map((source, idx) => (
                                        <a
                                            key={idx}
                                            href={source.uri}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all h-full"
                                        >
                                            <span className="text-xs font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                                {source.title}
                                            </span>
                                            <span className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-auto pt-2">
                                                <ExternalLink className="w-3 h-3" />
                                                {new URL(source.uri).hostname}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdeaGenerator;