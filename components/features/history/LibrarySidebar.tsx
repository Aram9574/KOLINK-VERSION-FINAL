import React from "react";
import {
    Clock,
    FileText,
    Filter,
    FolderOpen,
    Search,
    Star,
    LayoutGrid,
    CheckCircle2,
    Zap,
    Tag
} from "lucide-react";
import { motion } from "framer-motion";
import { AppLanguage } from "../../../types";
import { translations } from "../../../translations";
import { FRAMEWORKS, TONES } from "../../../constants";
import { cn } from "../../../lib/utils";

interface LibrarySidebarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTone: string;
    setSelectedTone: (tone: string) => void;
    selectedFramework: string;
    setSelectedFramework: (fw: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    showFavorites: boolean;
    setShowFavorites: (show: boolean) => void;
    language: AppLanguage;
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({
    searchTerm,
    setSearchTerm,
    selectedTone,
    setSelectedTone,
    selectedFramework,
    setSelectedFramework,
    selectedStatus,
    setSelectedStatus,
    sortOrder,
    setSortOrder,
    showFavorites,
    setShowFavorites,
    language,
}) => {
    const t = translations[language].app.history;
    const tConstants = translations[language].app.constants;

    const navItems = [
        {
            id: "all",
            label: t.navAll,
            icon: FolderOpen,
            color: "text-slate-500",
            activeColor: "text-brand-600",
            bgColor: "bg-brand-50/50"
        },
        {
            id: "published",
            label: t.navPublished,
            icon: CheckCircle2,
            color: "text-slate-500",
            activeColor: "text-emerald-600",
            bgColor: "bg-emerald-50/50"
        },
        {
            id: "scheduled",
            label: t.navScheduled,
            icon: Clock,
            color: "text-slate-500",
            activeColor: "text-blue-600",
            bgColor: "bg-blue-50/50"
        },
        {
            id: "draft",
            label: t.navDrafts,
            icon: FileText,
            color: "text-slate-500",
            activeColor: "text-amber-600",
            bgColor: "bg-amber-50/50"
        },
    ];

    return (
        <div className="w-full space-y-8 py-2">
            {/* Search Section */}
            <div className="px-1">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500/50 focus:bg-white outline-none text-sm font-medium transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Content Explorer Section */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between px-3 mb-3">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        {t.libraryTitle}
                    </h3>
                </div>
                
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = (selectedStatus === item.id || (selectedStatus === "all" && item.id === "all"));
                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedStatus(item.id === "all" ? "all" : item.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive 
                                        ? cn(item.bgColor, item.activeColor, "shadow-sm border border-black/5") 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <item.icon className={cn("w-4 h-4 transition-colors", isActive ? item.activeColor : item.color)} />
                                    <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebar-active-pill" 
                                        className="absolute left-0 w-1 h-5 bg-current rounded-r-full"
                                    />
                                )}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mt-1",
                            showFavorites
                                ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-100/50"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <Star
                            className={cn(
                                "w-4 h-4 transition-all",
                                showFavorites ? "fill-amber-400 text-amber-500 scale-110" : "text-slate-400"
                            )}
                        />
                        <span className="text-sm font-semibold tracking-tight">{t.favorites}</span>
                    </button>
                </div>
            </div>

            {/* Smart Filters Section */}
            <div className="pt-6 border-t border-slate-100">
                <div className="px-3 mb-5">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        {t.filtersTitle}
                    </h3>
                </div>

                <div className="space-y-5 px-1">
                    {/* Sort Order */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                            <Clock className="w-3 h-3 opacity-70" />
                            {language === 'es' ? 'Ordenar por' : 'Sort by'}
                        </label>
                        <div className="relative">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full appearance-none px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all cursor-pointer hover:border-slate-300"
                            >
                                <option value="newest">{language === 'es' ? 'Más recientes' : 'Newest first'}</option>
                                <option value="oldest">{language === 'es' ? 'Más antiguos' : 'Oldest first'}</option>
                                <option value="viral">{language === 'es' ? 'Mejor rendimiento' : 'Best performance'}</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Filter className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                    {/* Tone Filter */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                            <Tag className="w-3 h-3 opacity-70" />
                            {t.toneLabel}
                        </label>
                        <div className="relative">
                            <select
                                value={selectedTone}
                                onChange={(e) => setSelectedTone(e.target.value)}
                                className="w-full appearance-none px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all cursor-pointer hover:border-slate-300"
                            >
                                <option value="all">{t.filterAll}</option>
                                {TONES.map((tone) => (
                                    <option key={tone.value} value={tone.value}>
                                        {tConstants.tones[tone.value]?.label || tone.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Filter className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    {/* Framework Filter */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wide">
                            <Zap className="w-3 h-3 opacity-70 text-amber-500" />
                            {t.frameworkLabel}
                        </label>
                        <div className="relative">
                            <select
                                value={selectedFramework}
                                onChange={(e) => setSelectedFramework(e.target.value)}
                                className="w-full appearance-none px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all cursor-pointer hover:border-slate-300"
                            >
                                <option value="all">{t.filterAllFrameworks}</option>
                                {FRAMEWORKS.map((fw) => (
                                    <option key={fw.value} value={fw.value}>
                                        {tConstants.frameworks[fw.value]?.label || fw.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <LayoutGrid className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Pro Tip Card */}
            <div className="px-1 pt-4">
                <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-amber-400 uppercase tracking-[0.1em] mb-1">Vault Tip</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">Use the <span className="text-white">Calendar View</span> to plan your content strategy weekly.</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <LayoutGrid className="w-20 h-20 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibrarySidebar;
