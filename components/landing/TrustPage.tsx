import React from 'react';
import { Shield, Lock, CreditCard, Server, CheckCircle, FileText } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useUser } from '../../context/UserContext';
import { translations } from "../../translations";

const TrustPage: React.FC = () => {
    const { language } = useUser();
    const t = translations[language].trustPage;
    
    const sections = [
        {
            icon: Lock,
            title: t.cards.encryption.title,
            desc: t.cards.encryption.desc
        },
        {
            icon: CreditCard,
            title: t.cards.payment.title,
            desc: t.cards.payment.desc
        },
        {
            icon: Shield,
            title: t.cards.privacy.title,
            desc: t.cards.privacy.desc
        },
        {
            icon: Server,
            title: t.cards.uptime.title,
            desc: t.cards.uptime.desc
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar language={language} scrollToSection={() => {}} />
            
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-full mb-6">
                        <Shield className="w-8 h-8 text-brand-600" />
                    </div>
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-brand-600 uppercase bg-brand-50 rounded-full">
                        {t.hero.badge}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">{t.hero.title}</h1>
                    <p className="text-xl text-slate-600">{t.hero.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {sections.map((section, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-brand-50 rounded-lg shrink-0">
                                    <section.icon className="w-6 h-6 text-brand-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{section.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
                    <h3 className="text-2xl font-bold mb-6">{t.certifications}</h3>
                    <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholder Badges - Text for now */}
                        <div className="flex items-center gap-2 border px-4 py-2 rounded">
                            <Lock size={16} /> {t.badges.ssl}
                        </div>
                        <div className="flex items-center gap-2 border px-4 py-2 rounded">
                            <CheckCircle size={16} /> {t.badges.gdpr}
                        </div>
                        <div className="flex items-center gap-2 border px-4 py-2 rounded">
                            <CreditCard size={16} /> {t.badges.pci}
                        </div>
                    </div>
                </div>
            </div>

            <Footer language={language} scrollToSection={() => {}} />
        </div>
    );
};

export default TrustPage;
