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
        <section className="pt-14 pb-8 lg:pt-20 lg:pb-12 px-6 relative">
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

            </div>

            {/* Social Proof Carousel - Wide Container */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 mb-12 mt-10 relative z-10">
                <LogoCarousel language={language} />
            </div>

            {/* Advanced Hero Visual - Realistic App Preview */}
            {/* <DemoGeneratorView /> removed as requested to be replaced by video section */ }
        </section>
    );
};

export default HeroSection;
