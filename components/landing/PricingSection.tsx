import React from 'react';
import { Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLANS } from '../../constants';
import { translations } from '../../translations';
import { AppLanguage } from '../../types';

interface PricingSectionProps {
    language: AppLanguage;
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
    const t = translations[language];

    return (
        <section id="pricing" className="py-32 bg-white border-t border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.pricing.title}</h2>
                    <p className="text-slate-500 text-xl">{t.pricing.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-3xl p-8 border flex flex-col h-full transition-all duration-300
                    ${plan.highlight
                                    ? 'bg-brand-700 text-white border-brand-600 shadow-2xl scale-110 z-10 py-12 ring-4 ring-brand-500/20'
                                    : 'bg-white text-slate-900 border-slate-200 hover:border-brand-300 hover:shadow-xl'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg shadow-brand-500/30 uppercase tracking-wider flex items-center gap-1.5">
                                    <Star className="w-4 h-4 fill-current" /> {t.pricing.mostPopular}
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                                <p className={`text-sm ${plan.highlight ? 'text-brand-100' : 'text-slate-500'}`}>{plan.description}</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-display font-bold tracking-tight">€{plan.price}</span>
                                <span className={`text-lg font-medium ${plan.highlight ? 'text-brand-200' : 'text-slate-400'}`}>/mo</span>
                            </div>
                            <div className="space-y-5 mb-10 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 p-0.5 rounded-full flex-shrink-0 ${plan.highlight ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>
                                            <Check className="w-3 h-3 stroke-[4]" />
                                        </div>
                                        <span className={`text-base ${plan.highlight ? 'text-white' : 'text-slate-600'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to="/login"
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 block text-center
                        ${plan.highlight
                                        ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-lg hover:-translate-y-1'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900 hover:-translate-y-1'
                                    }`}
                            >
                                {plan.price === 0 ? t.pricing.startFree : t.pricing.getStarted}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
