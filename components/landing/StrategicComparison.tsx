import React from "react";
import { AlertTriangle, Check, Trophy, X } from "lucide-react";
import { translations } from "../../translations.ts";
import { AppLanguage } from "../../types.ts";

interface StrategicComparisonProps {
    language: AppLanguage;
}

const StrategicComparison: React.FC<StrategicComparisonProps> = (
    { language },
) => {
    const t = translations[language].strategicComparison;

    const renderValue = (val: string) => {
        if (val.includes("✅")) {
            return <Check className="w-5 h-5 text-green-500" />;
        }
        if (val.includes("❌")) return <X className="w-5 h-5 text-red-500" />;
        if (val.includes("⚠️")) {
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        }
        return <span className="text-sm font-medium text-slate-700">{val}
        </span>;
    };

    const competitors = [
        { key: "kolink", name: t.kolink, isKolink: true },
        { key: "taplio", name: t.taplio, isKolink: false },
        { key: "supergrow", name: t.supergrow, isKolink: false },
        { key: "authoredUp", name: t.authoredUp, isKolink: false },
    ];

    return (
        <section id="comparison" className="py-24 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
                        {t.title}
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl">
                        {t.subtitle}
                    </p>
                </div>

                <div className="card-premium rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-8 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        {t.features}
                                    </th>
                                    {competitors.map((comp) => (
                                        <th
                                            key={comp.key}
                                            className={`pt-12 pb-8 px-8 text-center border-b border-slate-100 min-w-[200px] relative ${
                                                comp.isKolink
                                                    ? "bg-brand-50/40"
                                                    : ""
                                            }`}
                                        >
                                            {comp.isKolink && (
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 border border-slate-800 whitespace-nowrap">
                                                    <Trophy className="w-3 h-3 text-yellow-400" />
                                                    {t.bestChoice}
                                                </div>
                                            )}
                                            <span
                                                className={`text-xl font-black ${
                                                    comp.isKolink
                                                        ? "text-brand-600"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {comp.name}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {t.rows.map((row: { name: string; values: { kolink: string; taplio: string; supergrow: string; authored: string } }, idx: number) => (
                                    <tr
                                        key={idx}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-8 text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                            {row.name}
                                        </td>
                                        <td className="p-8 text-center bg-brand-50/20 group-hover:bg-brand-50/30 transition-colors">
                                            <div className="flex flex-col items-center gap-2">
                                                {renderValue(row.values.kolink)}
                                                {row.values.kolink.length > 2 &&
                                                    (
                                                        <span className="text-[9px] font-black text-brand-600 uppercase tracking-tighter bg-brand-100/50 px-2 py-0.5 rounded-full">
                                                            {row.values.kolink
                                                                .replace(
                                                                    /✅|❌|⚠️|\(|\)/g,
                                                                    "",
                                                                ).trim()}
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="p-8 text-center group-hover:bg-slate-50/80 transition-colors">
                                            <div className="flex flex-col items-center gap-2">
                                                {renderValue(row.values.taplio)}
                                                {row.values.taplio.length > 2 &&
                                                    (
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            {row.values.taplio
                                                                .replace(
                                                                    /✅|❌|⚠️|\(|\)/g,
                                                                    "",
                                                                ).trim()}
                                                        </span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="p-8 text-center group-hover:bg-slate-50/80 transition-colors">
                                            <div className="flex flex-col items-center gap-2">
                                                {renderValue(
                                                    row.values.supergrow,
                                                )}
                                                {row.values.supergrow.length >
                                                        2 && (
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        {row.values.supergrow
                                                            .replace(
                                                                /✅|❌|⚠️|\(|\)/g,
                                                                "",
                                                            ).trim()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-8 text-center group-hover:bg-slate-50/80 transition-colors">
                                            <div className="flex flex-col items-center gap-2">
                                                {renderValue(
                                                    row.values.authored,
                                                )}
                                                {row.values.authored.length >
                                                        2 && (
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        {row.values.authored
                                                            .replace(
                                                                /✅|❌|⚠️|\(|\)/g,
                                                                "",
                                                            ).trim()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Hint */}
                <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
                    <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {language === "es"
                            ? "Desliza para comparar"
                            : "Swipe to compare"}
                    </p>
                    <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                </div>
            </div>
        </section>
    );
};

export default StrategicComparison;
