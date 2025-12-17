import React from "react";
import {
    Bot,
    ChevronDown,
    Fingerprint,
    History,
    LayoutGrid,
    Lightbulb,
    MessageCircle,
    Play,
    Repeat,
    Send,
    Settings as SettingsIcon,
    Sparkles,
    Star,
    ThumbsUp,
    TrendingUp,
    Wand2,
} from "lucide-react";
import { APP_DOMAIN } from "../../constants";
import { translations } from "../../translations";
import { AppLanguage, UserProfile } from "../../types";
import LogoCarousel from "./LogoCarousel";
import DemoGeneratorView from "./demo/DemoGeneratorView";

interface HeroSectionProps {
    language: AppLanguage;
    user?: UserProfile;
    mockContent: any;
    scrollToSection: (
        e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
        id: string,
    ) => void;
}

const HeroSection: React.FC<HeroSectionProps> = (
    { language, user, mockContent, scrollToSection },
) => {
    const t = translations[language];

    return (
        <section className="pt-14 pb-16 lg:pt-20 lg:pb-24 px-6 relative">
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 mb-8 tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    {t.hero.titleLine1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 animate-gradient-x">
                        {t.hero.titleLine2}
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
                    {t.hero.subtitle}
                </p>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <LogoCarousel language={language} />
                </div>
            </div>

            {/* Advanced Hero Visual - Realistic App Preview */}
            <div
                id="demo"
                className="mt-20 md:mt-32 relative max-w-6xl mx-auto perspective-1000 group z-10 px-4 sm:px-6"
            >
                {/* Floating Feature Card - Left (Voice) */}
                <div className="absolute -left-12 top-1/4 z-20 hidden xl:block animate-float-slow will-change-transform">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 max-w-[240px]">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Fingerprint className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {mockContent.voiceCardTitle}
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                {mockContent.voiceCardVal}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floating Feature Card - Right (Viral) */}
                <div className="absolute -right-12 bottom-1/3 z-20 hidden xl:block animate-float-delayed will-change-transform">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 max-w-[240px]">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {mockContent.viralCardTitle}
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                {mockContent.viralCardVal}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-700">
                </div>

                <DemoGeneratorView language={language} />
            </div>
        </section>
    );
};

export default HeroSection;
