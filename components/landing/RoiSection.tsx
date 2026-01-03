import React from 'react';
import { PenLine, Users, LineChart, FileText, X as XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations } from '../../translations.ts';
import { AppLanguage } from '../../types.ts';

interface RoiSectionProps {
    language: AppLanguage;
}

const RoiSection: React.FC<RoiSectionProps> = ({ language }) => {
    const t = translations[language];

    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">{t.roi.title}</h2>
                    <p className="text-slate-500 text-lg">{t.roi.subtitle}</p>
                </div>

                <div className="card-premium p-2 shadow-xl">
                    <div className="bg-white rounded-[1.2rem] overflow-hidden">
                        {/* Expensive Items List */}
                        <div className="divide-y divide-slate-100">
                            <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                        <PenLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.roi.item1Title}</h4>
                                        <p className="text-xs text-slate-500">{t.roi.item1Desc}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900">{t.roi.item1Price}</span>
                            </div>

                            <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.roi.item2Title}</h4>
                                        <p className="text-xs text-slate-500">{t.roi.item2Desc}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900">{t.roi.item2Price}</span>
                            </div>

                            <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                        <LineChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.roi.item3Title}</h4>
                                        <p className="text-xs text-slate-500">{t.roi.item3Desc}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900">{t.roi.item3Price}</span>
                            </div>

                            <div className="p-5 md:p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{t.roi.item4Title}</h4>
                                        <p className="text-xs text-slate-500">{t.roi.item4Desc}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-900">{t.roi.item4Price}</span>
                            </div>
                        </div>

                        {/* Total Row */}
                        <div className="bg-red-50 p-6 flex items-center justify-between border-t border-red-100">
                            <div className="flex items-center gap-3 text-red-700 font-bold">
                                <XIcon className="w-5 h-5" />
                                {t.roi.totalLabel}
                            </div>
                            <span className="text-xl font-bold text-red-600 line-through decoration-red-400 decoration-2">{t.roi.totalPrice}</span>
                        </div>
                    </div>

                    {/* Kolink Offer */}
                    <div className="mt-2 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 text-center">
                            <p className="text-brand-100 font-medium mb-3">{t.roi.kolinkLabel}</p>
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <h3 className="text-2xl md:text-3xl font-display font-bold">{t.roi.kolinkPlan}</h3>
                                <span className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{t.roi.kolinkPrice}</span>
                            </div>
                            <Link to="/login" className="inline-block px-8 py-3 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                                {t.pricing.getStarted}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoiSection;
