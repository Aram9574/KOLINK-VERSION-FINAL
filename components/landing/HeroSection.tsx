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
            <div className="mt-20 md:mt-32 relative max-w-6xl mx-auto perspective-1000 group z-10 px-4 sm:px-6">
                {/* Floating Feature Card - Left (Voice) */}
                <div className="absolute -left-12 top-1/4 z-20 hidden xl:block animate-float-slow">
                    <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 max-w-[240px]">
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
                <div className="absolute -right-12 bottom-1/3 z-20 hidden xl:block animate-float-delayed">
                    <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-4 max-w-[240px]">
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
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2.5rem] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700">
                </div>

                <div className="relative bg-slate-900/5 rounded-3xl p-2 ring-1 ring-slate-900/10 shadow-2xl transform rotate-x-6 group-hover:rotate-x-2 transition-transform duration-1000 ease-out backdrop-blur-sm">
                    {/* App Window Frame */}
                    <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] relative flex border border-slate-200 shadow-inner">
                        {/* APP SIDEBAR MOCK */}
                        <div className="hidden md:flex w-64 border-r border-slate-200 bg-white flex-col flex-shrink-0">
                            {/* Logo */}
                            <div className="p-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">
                                    K
                                </div>
                                <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
                                    Kolink
                                </span>
                            </div>

                            {/* Gamification Widget Mock - CHANGED FROM BLACK TO BRAND GRADIENT */}
                            <div className="px-4 mb-2">
                                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-3 text-white relative overflow-hidden border border-indigo-500/50 shadow-md">
                                    <div className="flex items-center justify-between mb-2 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Star className="w-3 h-3 text-white fill-white" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold uppercase text-indigo-200">
                                                    {mockContent.level}
                                                </p>
                                                <p className="text-xs font-bold text-white">
                                                    {mockContent.creator}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-indigo-900/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-1/3">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu */}
                            <div className="px-4 space-y-1 mt-2">
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-semibold border border-brand-100 shadow-sm">
                                    <LayoutGrid className="w-4 h-4" />{" "}
                                    {mockContent.studio}
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                    <Lightbulb className="w-4 h-4" />{" "}
                                    {mockContent.ideas}
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                    <Bot className="w-4 h-4" />{" "}
                                    {mockContent.autopilot}
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                    <History className="w-4 h-4" />{" "}
                                    {mockContent.history}
                                </div>
                                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 text-sm font-semibold hover:bg-slate-50">
                                    <SettingsIcon className="w-4 h-4" />{" "}
                                    {mockContent.settings}
                                </div>
                            </div>

                            {/* User Footer */}
                            <div className="mt-auto p-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://picsum.photos/seed/alex/150/150"
                                        className="w-9 h-9 rounded-full border border-slate-200"
                                        alt="User"
                                    />
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">
                                            Alex Rivera
                                        </div>
                                        <div className="text-xs text-brand-600 font-bold">
                                            {mockContent.credits}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* APP MAIN CONTENT MOCK */}
                        <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-hidden flex flex-col md:flex-row gap-6 lg:gap-8">
                            {/* Generator Column */}
                            <div className="flex-1 max-w-lg space-y-5 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-display font-bold text-slate-900">
                                        {mockContent.studio}
                                    </h2>
                                    <div className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />{" "}
                                        {mockContent.credits}
                                    </div>
                                </div>

                                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 shadow-sm space-y-4 flex-1 overflow-y-auto no-scrollbar">
                                    {/* Topic */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 ml-1">
                                            {mockContent.topicLabel}
                                        </label>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 h-20 shadow-inner text-opacity-80 font-medium">
                                            {mockContent.topicValue}
                                        </div>
                                    </div>
                                    {/* Audience */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 ml-1">
                                            {mockContent.audienceLabel}
                                        </label>
                                        <input
                                            disabled
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium"
                                            value={mockContent.audienceValue}
                                        />
                                    </div>
                                    {/* Grid Config */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700">
                                                {mockContent.toneLabel}
                                            </label>
                                            <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex justify-between items-center shadow-sm">
                                                {mockContent.toneValue}{" "}
                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700">
                                                {mockContent.structureLabel}
                                            </label>
                                            <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 flex justify-between items-center shadow-sm">
                                                PAS{" "}
                                                <ChevronDown className="w-3 h-3 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Creativity */}
                                    <div className="space-y-1 pt-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-700">
                                            <span>
                                                {mockContent.creativityLabel}
                                            </span>
                                            <span className="text-brand-600">
                                                {mockContent.creativityValue}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full w-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-brand-500">
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 text-sm mt-auto">
                                        <Wand2 className="w-4 h-4" />{" "}
                                        {mockContent.generate}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Column (Hidden on smaller screens within mock) */}
                            <div className="hidden lg:block flex-1 max-w-md pt-0 md:pt-8 overflow-y-auto no-scrollbar">
                                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-0 overflow-hidden transform scale-100 origin-top-left w-full">
                                    {/* LinkedIn Header */}
                                    <div className="p-4 pb-2 flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <img
                                                src="https://picsum.photos/seed/alex/150/150"
                                                className="w-10 h-10 rounded-full border border-slate-100"
                                                alt="User"
                                            />
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer">
                                                    Alex Rivera
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {mockContent.postHeader}
                                                    {" "}
                                                    • 1h • 🌐
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-brand-600 font-bold text-sm hover:bg-blue-50 px-3 py-1 rounded-full">
                                            + Follow
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <div className="px-4 py-2 text-sm text-slate-900 space-y-3 leading-relaxed font-normal whitespace-pre-wrap">
                                        {mockContent.postContent.split("\n\n")
                                            .map((para: string, i: number) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        <p className="text-brand-600 hover:underline cursor-pointer">
                                            {mockContent.postTags}
                                        </p>
                                    </div>

                                    {/* Engagement */}
                                    <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100">
                                        <div className="flex items-center gap-1">
                                            <div className="flex -space-x-1">
                                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">
                                                    👍
                                                </div>
                                                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[8px] text-white">
                                                    ❤️
                                                </div>
                                                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">
                                                    👏
                                                </div>
                                            </div>
                                            <span className="hover:text-blue-600 hover:underline">
                                                1,243
                                            </span>
                                        </div>
                                        <div className="hover:text-blue-600 hover:underline">
                                            89 comments
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="px-2 py-1 flex justify-between">
                                        <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                            <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {" "}
                                            Like
                                        </button>
                                        <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {" "}
                                            Comment
                                        </button>
                                        <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                            <Repeat className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {" "}
                                            Repost
                                        </button>
                                        <button className="flex-1 py-3 hover:bg-slate-100 rounded-lg text-slate-500 font-semibold text-xs flex items-center justify-center gap-2 group">
                                            <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {" "}
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
