import React from 'react';
import { Crown } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

const UpgradeHeader: React.FC = () => {
    const { language } = useUser();
    const t = translations[language].app.upgrade;

    return (
        <div className="p-6 lg:p-12 pb-0 lg:pb-0 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-300 to-orange-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                <Crown className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-3">{t.title}</h3>
            <p className="text-slate-500 mb-8 text-lg max-w-2xl mx-auto">
                {t.subtitle}
            </p>
        </div>
    );
};

export default UpgradeHeader;
