import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowRight, Sparkles, Layout, Zap, UserCheck, MessageSquare, 
    Lightbulb, Building2, Scale, Rocket, Megaphone, HeartPulse,
    Rss, HelpCircle, PlayCircle, Info, CreditCard, Users,
    Globe
} from "lucide-react";
import { APP_DOMAIN } from "../../constants.ts";
import { translations } from "../../translations.ts";
import { AppLanguage, UserProfile } from "../../types.ts";
import MegaMenu from "./MegaMenu.tsx";

interface NavbarProps {
    language: AppLanguage;
    setLanguage: (lang: AppLanguage) => void;
    user?: UserProfile;
    activeSection: string;
    scrollToSection: (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string,
    ) => void;
}

const Navbar: React.FC<NavbarProps> = (
    { language, setLanguage, user, activeSection, scrollToSection },
) => {
    const t = translations[language as AppLanguage];
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const featureItems = [
        { icon: <Sparkles className="w-5 h-5" />, title: t.nav.items.postEditor.title, desc: t.nav.items.postEditor.desc, href: "#hero", onClick: (e: any) => scrollToSection(e, "hero") },
        { icon: <Layout className="w-5 h-5" />, title: t.nav.items.carouselStudio.title, desc: t.nav.items.carouselStudio.desc, href: "#tools", onClick: (e: any) => scrollToSection(e, "tools") },
        { icon: <Zap className="w-5 h-5" />, title: t.nav.items.autoPilot.title, desc: t.nav.items.autoPilot.desc, href: "#howitworks", onClick: (e: any) => scrollToSection(e, "howitworks") },
        { icon: <UserCheck className="w-5 h-5" />, title: t.nav.items.profileAudit.title, desc: t.nav.items.profileAudit.desc, href: "#tools", onClick: (e: any) => scrollToSection(e, "tools") },
        { icon: <MessageSquare className="w-5 h-5" />, title: t.nav.items.insightResponder.title, desc: t.nav.items.insightResponder.desc, href: "#tools", onClick: (e: any) => scrollToSection(e, "tools") },
        { icon: <Lightbulb className="w-5 h-5" />, title: t.nav.items.ideas.title, desc: t.nav.items.ideas.desc, href: "#tools", onClick: (e: any) => scrollToSection(e, "tools") },
    ];

    const solutionItems = [
        { icon: <Building2 className="w-5 h-5" />, title: t.nav.items.nicheRealEstate.title, desc: t.nav.items.nicheRealEstate.desc, href: "/tools/agentes-inmobiliarios" },
        { icon: <Rocket className="w-5 h-5" />, title: t.nav.items.nicheSaaS.title, desc: t.nav.items.nicheSaaS.desc, href: "/tools/fundadores-saas" },
        { icon: <Scale className="w-5 h-5" />, title: t.nav.items.nicheLawyers.title, desc: t.nav.items.nicheLawyers.desc, href: "/tools/abogados-y-legal" },
        { icon: <Megaphone className="w-5 h-5" />, title: t.nav.items.nicheMarketing.title, desc: t.nav.items.nicheMarketing.desc, href: "/tools/especialistas-marketing" },
        { icon: <HeartPulse className="w-5 h-5" />, title: t.nav.items.nicheHealth.title, desc: t.nav.items.nicheHealth.desc, href: "/tools/doctores-y-salud" },
        { icon: <Globe className="w-5 h-5" />, title: "Ver todos", desc: "Explora todos los sectores disponibles", href: "/tools" },
    ];

    const resourceItems = [
        { icon: <Rss className="w-5 h-5" />, title: t.nav.items.blog.title, desc: t.nav.items.blog.desc, href: "#tools", onClick: (e: any) => scrollToSection(e, "tools") },
        { icon: <HelpCircle className="w-5 h-5" />, title: t.nav.items.helpCenter.title, desc: t.nav.items.helpCenter.desc, href: "#faq", onClick: (e: any) => scrollToSection(e, "faq") },
        { icon: <PlayCircle className="w-5 h-5" />, title: t.nav.items.videoDemo.title, desc: t.nav.items.videoDemo.desc, href: "#demo", onClick: (e: any) => scrollToSection(e, "demo") },
        { icon: <Info className="w-5 h-5" />, title: t.nav.items.commonFaq.title, desc: t.nav.items.commonFaq.desc, href: "#faq", onClick: (e: any) => scrollToSection(e, "faq") },
    ];

    const companyItems = [
        { icon: <Users className="w-5 h-5" />, title: t.nav.items.about.title, desc: t.nav.items.about.desc, href: "/about" },
        { icon: <CreditCard className="w-5 h-5" />, title: t.nav.items.prices.title, desc: t.nav.items.prices.desc, href: "#pricing", onClick: (e: any) => scrollToSection(e, "pricing") },
        { icon: <Rocket className="w-5 h-5" />, title: t.nav.items.affiliate.title, desc: t.nav.items.affiliate.desc, href: "mailto:info@kolink.es?subject=Affiliate Program" },
        { icon: <Globe className="w-5 h-5" />, title: t.nav.items.socials.title, desc: t.nav.items.socials.desc, href: "https://linkedin.com/company/kolink", external: true },
    ];

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 px-4">
            <div className="max-w-fit mx-auto glass border border-slate-200/60 rounded-full pr-1.5 pl-6 py-1.5 flex items-center gap-4 lg:gap-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-300">
                <div
                    className="flex items-center gap-2 font-display font-bold text-slate-900 tracking-tight cursor-pointer group"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                        <img
                            src="/logo.png"
                            alt="Kolink Logo"
                            className="w-full h-full object-cover scale-110 rounded-lg shadow-md shadow-brand-500/10"
                        />
                    </div>
                    <span className="font-display font-bold text-lg text-slate-900 tracking-tight ml-1 hidden sm:inline">
                        Kolink
                    </span>
                </div>

                <div className="hidden lg:flex items-center bg-slate-50/50 rounded-full p-1 border border-slate-100">
                    <MegaMenu 
                        title={t.nav.features} 
                        items={featureItems} 
                        isOpen={openMenu === "features"}
                        onMouseEnter={() => setOpenMenu("features")}
                        onMouseLeave={() => setOpenMenu(null)}
                    />
                    <MegaMenu 
                        title={t.nav.solutions} 
                        items={solutionItems} 
                        isOpen={openMenu === "solutions"}
                        onMouseEnter={() => setOpenMenu("solutions")}
                        onMouseLeave={() => setOpenMenu(null)}
                    />
                    <MegaMenu 
                        title={t.nav.resources} 
                        items={resourceItems} 
                        isOpen={openMenu === "resources"}
                        onMouseEnter={() => setOpenMenu("resources")}
                        onMouseLeave={() => setOpenMenu(null)}
                    />
                    <MegaMenu 
                        title={t.nav.company} 
                        items={companyItems} 
                        isOpen={openMenu === "company"}
                        onMouseEnter={() => setOpenMenu("company")}
                        onMouseLeave={() => setOpenMenu(null)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setLanguage(language === "en" ? "es" : "en")}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors uppercase"
                    >
                        {language}
                    </button>
                    
                    {user?.id && !user.id.startsWith("mock-")
                        ? (
                            <Link
                                to="/dashboard"
                                className="group bg-brand-600 text-white pl-5 pr-4 py-2 rounded-full font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:shadow-nexus hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm"
                            >
                                Dashboard
                                <div className="p-1 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        )
                        : (
                            <Link
                                to="/login"
                                className="group bg-brand-600 text-white pl-5 pr-4 py-2 rounded-full font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 hover:shadow-nexus hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm whitespace-nowrap"
                            >
                                {t.nav.login}
                                <div className="p-1 bg-white/20 rounded-full group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Link>
                        )}
                    
                    <button 
                        className="lg:hidden p-2 text-slate-600 hover:text-brand-600 transition-colors"
                        onClick={() => setOpenMenu(openMenu === "mobile" ? null : "mobile")}
                    >
                        {openMenu === "mobile" ? <Zap className="w-6 h-6 rotate-45" /> : <Layout className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {openMenu === "mobile" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden mt-4 mx-4 glass border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl"
                    >
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 transition-all">{t.nav.features}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {featureItems.map((item, i) => (
                                        <Link key={i} to={item.href} onClick={(e) => { item.onClick?.(e); setOpenMenu(null); }} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 text-[13px] font-medium text-slate-700">
                                            <div className="text-brand-600">{item.icon}</div>
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t.nav.solutions}</h3>
                                <div className="space-y-2">
                                    {solutionItems.slice(0, 4).map((item, i) => (
                                        <Link key={i} to={item.href} onClick={() => setOpenMenu(null)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-[13px] font-medium text-slate-700">
                                            <div className="text-slate-400">{item.icon}</div>
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
