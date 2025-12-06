import React from 'react';
import { Zap } from 'lucide-react';
import { AppLanguage } from '../../../types';
import { translations } from '../../../translations';

interface FeatureFrameworksProps {
    language: AppLanguage;
}

const FeatureFrameworks: React.FC<FeatureFrameworksProps> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl shadow-blue-900/20 ring-1 ring-white/10">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/30 border border-white/10 backdrop-blur-md">
                            <Zap className="w-8 h-8 fill-current text-yellow-300" />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">{t.features.f1Title}</h3>
                        <p className="text-blue-100/90 text-lg leading-relaxed max-w-xl mb-12">
                            {t.features.f1Desc}
                        </p>
                    </div>
                </div>

                {/* Dynamic Frameworks Visualization */}
                <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { ...t.features.frameworks.pas, color: 'bg-rose-500' },
                        { ...t.features.frameworks.bab, color: 'bg-blue-500' },
                        { ...t.features.frameworks.contrarian, color: 'bg-purple-500' },
                        { ...t.features.frameworks.listicle, color: 'bg-amber-500' }
                    ].map((fw, i) => (
                        <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md hover:bg-white/20 transition-all duration-300 cursor-default hover:-translate-y-1 group/card">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-2 h-2 rounded-full ${fw.color} shadow-lg shadow-white/20`}></div>
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{fw.desc}</span>
                            </div>
                            <p className="text-white font-bold text-sm md:text-base group-hover/card:text-blue-200 transition-colors">{fw.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureFrameworks;
