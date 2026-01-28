import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { translations } from "../../translations";
import { AppLanguage } from "../../types";

interface FooterProps {
    language: AppLanguage;
    scrollToSection: (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string,
    ) => void;
}

const Footer: React.FC<FooterProps> = ({ language, scrollToSection }) => {
    const t = translations[language];
    const footer = t.footer;

    const socialLinks = [
        { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter" },
        {
            icon: <Linkedin className="w-5 h-5" />,
            href: "https://www.linkedin.com/company/kolink-ai/",
            name: "LinkedIn",
        },
        { icon: <Facebook className="w-5 h-5" />, href: "#", name: "Facebook" },
        { icon: <Youtube className="w-5 h-5" />, href: "#", name: "YouTube" },
    ];

    return (
        <footer className="bg-transparent pt-24 pb-12 border-t border-slate-100 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3 font-display font-bold text-2xl text-slate-900 group cursor-pointer">
                            <div className="w-10 h-10 transition-transform duration-500 group-hover:rotate-[360deg]">
                                <img
                                    src="/logo.png"
                                    alt="Kolink Logo"
                                    className="w-full h-full object-cover scale-110 rounded-xl shadow-lg shadow-brand-500/10"
                                />
                            </div>
                            <span>Kolink</span>
                        </div>
                        <p className="text-slate-500 text-base leading-relaxed max-w-sm">
                            {footer.description}
                        </p>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex flex-col items-center gap-1 group">
                                <div className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center bg-white shadow-sm transition-all duration-300 group-hover:border-brand-200 group-hover:shadow-md">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 flex flex-col items-center justify-center text-[8px] text-white font-bold leading-none transform transition-transform group-hover:scale-110">
                                            <span className="mb-0.5">ISO</span>
                                            <span>27001</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {footer.verifiedLabel}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1 group">
                                <div className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center bg-white shadow-sm transition-all duration-300 group-hover:border-blue-200 group-hover:shadow-md">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex flex-col items-center justify-center bg-[#003399] transform transition-transform group-hover:scale-110">
                                        <div className="flex items-center gap-[1px] mb-0.5">
                                            {[...Array(6)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-[1.5px] h-[1.5px] bg-yellow-400 rotate-45"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[8px] text-white font-bold tracking-tighter">
                                            GDPR
                                        </span>
                                        <div className="flex items-center gap-[1px] mt-0.5">
                                            {[...Array(6)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-[1.5px] h-[1.5px] bg-yellow-400 rotate-45"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {footer.compliantLabel}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Object.entries(footer.columns).map((
                            [key, column]: [string, any],
                        ) => (
                            <div key={key} className="flex flex-col gap-6">
                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                                    {column.title}
                                </h4>
                                <ul className="flex flex-col gap-4">
                                    {column.links.map((
                                        link: any,
                                        idx: number,
                                    ) => (
                                        <li key={idx}>
                                            {link.href.startsWith("/#")
                                                ? (
                                                    <a
                                                        href={link.href}
                                                        onClick={(e) =>
                                                            scrollToSection(
                                                                e,
                                                                link.href.split(
                                                                    "#",
                                                                )[1],
                                                            )}
                                                        className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium"
                                                    >
                                                        {link.label}
                                                    </a>
                                                )
                                                : link.href.startsWith("/")
                                                ? (
                                                    <Link
                                                        to={link.href}
                                                        className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                )
                                                : (
                                                    <a
                                                        href={link.href}
                                                        className="text-slate-500 hover:text-brand-600 transition-colors text-sm font-medium"
                                                    >
                                                        {link.label}
                                                    </a>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-100">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                                {footer.disclaimer}
                            </p>
                            <div className="flex items-center gap-5">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all duration-300"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm border-t border-slate-50 pt-8">
                            <p>{footer.rights}</p>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy</Link>
                                <span className="text-slate-300">•</span>
                                <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
                                <span className="text-slate-300">•</span>
                                <Link to="/trust" className="hover:text-brand-600 transition-colors">Trust</Link>
                                <span className="text-slate-300">•</span>
                                <p className="font-medium">
                                    {footer.madeWith}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
