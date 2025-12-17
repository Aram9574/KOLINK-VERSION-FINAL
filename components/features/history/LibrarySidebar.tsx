import React from "react";
import {
    Clock,
    FileText,
    Filter,
    FolderOpen,
    Search,
    Star,
    Tag,
} from "lucide-react";
import { AppLanguage } from "../../../types";
import { translations } from "../../../translations";
import { FRAMEWORKS, TONES } from "../../../constants";

interface LibrarySidebarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTone: string;
    setSelectedTone: (tone: string) => void;
    selectedFramework: string;
    setSelectedFramework: (fw: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
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
        },
        {
            id: "published",
            label: t.navPublished,
            icon: FileText,
        },
        {
            id: "scheduled",
            label: t.navScheduled,
            icon: Clock,
        },
        {
            id: "draft",
            label: t.navDrafts,
            icon: FileText,
        },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Search */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm transition-all"
                />
            </div>

            {/* Navigation / Status Filters */}
            <div className="space-y-1">
                <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {t.libraryTitle}
                </h3>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() =>
                            setSelectedStatus(
                                item.id === "all" ? "all" : item.id,
                            )}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            (selectedStatus === item.id ||
                                    (selectedStatus === "all" &&
                                        item.id === "all"))
                                ? "bg-brand-50 text-brand-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                        <item.icon
                            className={`w-4 h-4 ${
                                (selectedStatus === item.id ||
                                        (selectedStatus === "all" &&
                                            item.id === "all"))
                                    ? "text-brand-600"
                                    : "text-slate-400"
                            }`}
                        />
                        {item.label}
                    </button>
                ))}

                <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors mt-2 ${
                        showFavorites
                            ? "bg-amber-50 text-amber-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                    <Star
                        className={`w-4 h-4 ${
                            showFavorites
                                ? "fill-current text-amber-500"
                                : "text-slate-400"
                        }`}
                    />
                    {t.favorites}
                </button>
            </div>

            {/* Filters */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t.filtersTitle}
                </h3>

                <div className="space-y-3 px-1">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 px-2">
                            {t.toneLabel}
                        </label>
                        <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        >
                            <option value="all">{t.filterAll}</option>
                            {TONES.map((tone) => (
                                <option key={tone.value} value={tone.value}>
                                    {tConstants.tones[tone.value]?.label ||
                                        tone.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 px-2">
                            {t.frameworkLabel}
                        </label>
                        <select
                            value={selectedFramework}
                            onChange={(e) =>
                                setSelectedFramework(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
                        >
                            <option value="all">
                                {t.filterAllFrameworks}
                            </option>
                            {FRAMEWORKS.map((fw) => (
                                <option key={fw.value} value={fw.value}>
                                    {tConstants.frameworks[fw.value]?.label ||
                                        fw.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibrarySidebar;
