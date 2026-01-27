
import React from "react";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";

const PressSection = () => {
    const { language } = useUser();
    const t = translations[language].about.press;

    return (
        <section className="py-20 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-12">{t.title}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                    {t.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">{item.name}</h3>
                            <p className="text-slate-600 italic text-lg opacity-80">"{item.quote.replace(/'/g, '')}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PressSection;
