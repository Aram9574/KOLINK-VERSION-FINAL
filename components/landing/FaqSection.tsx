import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { translations } from '../../translations';
import { AppLanguage } from '../../types';

interface FaqSectionProps {
    language: AppLanguage;
}

const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const t = translations[language];

    const faqs = [
        { q: t.faq.q1, a: t.faq.a1 },
        { q: t.faq.q2, a: t.faq.a2 },
        { q: t.faq.q3, a: t.faq.a3 },
        { q: t.faq.q4, a: t.faq.a4 }
    ];

    return (
        <section id="faq" className="py-32 bg-transparent border-t border-slate-200">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-12 text-center">{t.faq.title}</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-brand-300 hover:shadow-md">
                            <button
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg text-slate-900">{faq.q}</span>
                                {openFaq === index
                                    ? <ChevronUp className="w-5 h-5 text-brand-600" />
                                    : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="p-6 pt-0 text-slate-500 leading-relaxed text-lg">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
