import React from "react";
import { Link } from "react-router-dom";
import { translations } from "../../translations";
import { AppLanguage } from "../../types";

interface FooterProps {
    language: AppLanguage;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
    const t = translations[language];

    return (
        <footer className="bg-slate-50 py-16 border-t border-slate-200 text-sm text-slate-500">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2 font-display font-bold text-xl text-slate-900">
                        <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
                            K
                        </div>
                        Kolink
                    </div>
                    <p className="max-w-xs text-center md:text-left">
                        {t.footer.description}
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-medium">
                    <Link
                        to="/privacy"
                        className="hover:text-brand-600 transition-colors"
                    >
                        {t.footer.privacy}
                    </Link>
                    <Link
                        to="/cookies"
                        className="hover:text-brand-600 transition-colors"
                    >
                        {language === "es" ? "Cookies" : "Cookies"}
                    </Link>
                    <Link
                        to="/terms"
                        className="hover:text-brand-600 transition-colors"
                    >
                        {t.footer.terms}
                    </Link>
                    <a
                        href="https://www.linkedin.com/company/kolink-ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-600 transition-colors"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="mailto:info@kolink.es"
                        className="hover:text-brand-600 transition-colors"
                    >
                        {t.footer.contact}
                    </a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>{t.footer.rights.replace("2024", "2025")}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500">
                            </span>
                            GDPR Compliant
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                            <svg
                                className="w-3 h-3 text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            SSL Secure
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
