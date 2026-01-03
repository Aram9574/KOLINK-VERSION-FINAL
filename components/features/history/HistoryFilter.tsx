import React from "react";
import { Filter, Search, Zap } from "lucide-react";
import { AppLanguage } from "../../../types";
import { translations } from "../../../translations";
import { FRAMEWORKS, TONES } from "../../../constants";

interface HistoryFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedTone: string;
    setSelectedTone: (tone: string) => void;
    selectedFramework: string;
    setSelectedFramework: (fw: string) => void;
    language: AppLanguage;
}

const HistoryFilter: React.FC<HistoryFilterProps> = ({
    searchTerm,
    setSearchTerm,
    selectedTone,
    setSelectedTone,
    selectedFramework,
    setSelectedFramework,
    language,
}) => {
    const t = translations[language].app.history;
    const tConstants = translations[language].app.constants;

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200/60/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm transition-all"
                />
            </div>

            {/* Tone Filter */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Filter className="w-4 h-4" />
                </div>
                <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-white border border-slate-200/60/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm appearance-none cursor-pointer hover:border-brand-300 transition-all"
                >
                    <option value="all">{t.filterAll}</option>
                    {TONES.map((tone) => (
                        <option key={tone.value} value={tone.value}>
                            {tConstants.tones[tone.value]?.label || tone.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Framework Filter */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Zap className="w-4 h-4" />
                </div>
                <select
                    value={selectedFramework}
                    onChange={(e) => setSelectedFramework(e.target.value)}
                    className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-white border border-slate-200/60/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm font-medium shadow-sm appearance-none cursor-pointer hover:border-brand-300 transition-all"
                >
                    <option value="all">{t.filterAllFrameworks}</option>
                    {FRAMEWORKS.map((fw) => (
                        <option key={fw.value} value={fw.value}>
                            {tConstants.frameworks[fw.value]?.label || fw.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default HistoryFilter;
