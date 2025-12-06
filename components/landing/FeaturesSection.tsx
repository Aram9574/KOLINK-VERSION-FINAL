import React from 'react';
import { translations } from '../../translations';
import { AppLanguage } from '../../types';
import FeatureFrameworks from './features/FeatureFrameworks';
import FeatureViralScore from './features/FeatureViralScore';
import FeatureBrandVoice from './features/FeatureBrandVoice';
import FeatureWorkflow from './features/FeatureWorkflow';

interface FeaturesSectionProps {
    language: AppLanguage;
    mockContent?: any;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ language, mockContent }) => {
    const t = translations[language];

    return (
        <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">{t.features.title}</h2>
                    <p className="text-slate-500 text-xl">{t.features.subtitle}</p>
                </div>

                <div className="grid grid-cols-12 gap-6 md:gap-8">
                    <FeatureFrameworks language={language} />
                    <FeatureViralScore language={language} />
                    <FeatureBrandVoice language={language} />
                    <FeatureWorkflow language={language} />
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
