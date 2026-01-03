import React from "react";
import {
    PiFilesDuotone,
    PiLightningDuotone,
    PiMagicWandDuotone,
    PiMagnifyingGlassDuotone,
    PiPencilSimpleDuotone,
    PiRocketLaunchDuotone,
} from "react-icons/pi";
import { AppLanguage } from "../../types";
import { translations } from "../../translations";
import Section from "@/components/ui/Section";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

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
            icon: PiLightningDuotone,
            title: t.features.tools.nexus.title,
            desc: t.features.tools.nexus.desc,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "group-hover:border-amber-200",
        },
        {
            icon: PiPencilSimpleDuotone,
            title: t.features.tools.editor.title,
            desc: t.features.tools.editor.desc,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "group-hover:border-indigo-200",
        },
        {
            icon: PiFilesDuotone,
            title: t.features.tools.carousel.title,
            desc: t.features.tools.carousel.desc,
            color: "text-pink-600",
            bg: "bg-pink-50",
            border: "group-hover:border-pink-200",
        },
        {
            icon: PiRocketLaunchDuotone,
            title: t.features.tools.autopost.title,
            desc: t.features.tools.autopost.desc,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "group-hover:border-orange-200",
        },
        {
            icon: PiMagnifyingGlassDuotone,
            title: t.features.tools.audit.title,
            desc: t.features.tools.audit.desc,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "group-hover:border-purple-200",
        },
    ];

    return (
        <Section id="tools" className="bg-transparent">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                    {t.features.tools.title}
                </h2>
                <p className="text-slate-500 text-lg md:text-xl">
                    {t.features.tools.subtitle}
                </p>
            </div>

            <BentoGrid className="max-w-6xl mx-auto">
                {tools.map((tool, index) => (
                    <BentoGridItem
                        key={index}
                        title={tool.title}
                        description={tool.desc}
                        header={
                             <div
                                className={`w-14 h-14 ${tool.bg} rounded-xl flex items-center justify-center ${tool.color} mb-6`}
                            >
                                <tool.icon className="w-8 h-8" />
                            </div>
                        }
                        className={index === 0 || index === 3 || index === 5 ? "md:col-span-2" : ""}
                    />
                ))}
            </BentoGrid>
        </Section>
    );
};

export default ToolsSection;
