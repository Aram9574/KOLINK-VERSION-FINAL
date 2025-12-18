import React from "react";
import {
    PiArrowRightBold,
    PiFingerprintDuotone,
    PiMagicWandDuotone,
    PiMagnifyingGlassDuotone,
    PiRocketLaunchDuotone,
} from "react-icons/pi";
import { AppLanguage } from "../../types";
import { translations } from "../../translations";

interface ToolsSectionProps {
    language: AppLanguage;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ language }) => {
    const t = translations[language];

    const tools = [
        {
            icon: PiMagicWandDuotone,
            title: t.features.tools.studio.title,
            desc: t.features.tools.studio.desc,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "group-hover:border-blue-200",
        },
        {
            icon: PiRocketLaunchDuotone,
            title: t.features.tools.autopilot.title,
            desc: t.features.tools.autopilot.desc,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "group-hover:border-amber-200",
        },
        {
            icon: PiMagnifyingGlassDuotone,
            title: t.features.tools.audit.title,
            desc: t.features.tools.audit.desc,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "group-hover:border-purple-200",
        },
        {
            icon: PiFingerprintDuotone,
            title: t.features.tools.brandVoice.title,
            desc: t.features.tools.brandVoice.desc,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "group-hover:border-rose-200",
        },
    ];

    return (
        <section id="tools" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                        {t.features.tools.title}
                    </h2>
                    <p className="text-slate-500 text-lg md:text-xl">
                        {t.features.tools.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => (
                        <div
                            key={index}
                            className={`group bg-slate-50 rounded-3xl p-8 border border-slate-100 ${tool.border} hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                        >
                            <div
                                className={`w-14 h-14 ${tool.bg} rounded-2xl flex items-center justify-center ${tool.color} mb-6 group-hover:scale-110 transition-transform duration-500`}
                            >
                                <tool.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {tool.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-sm mb-6">
                                {tool.desc}
                            </p>
                            <div
                                className={`flex items-center gap-2 text-sm font-bold ${tool.color} opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 duration-300`}
                            >
                                <span>Explorar</span>{" "}
                                <PiArrowRightBold className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ToolsSection;
