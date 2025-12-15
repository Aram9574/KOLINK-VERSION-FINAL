import React from 'react';
import { Crown } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

const UpgradeHeader: React.FC = () => {
    const { language } = useUser();
    const t = translations[language].app.upgrade;

    return (
        <div className="p-6 pb-2 text-center">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-300 to-orange-400 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                <Crown className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-2">{t.title}</h3>
            <p className="text-slate-500 mb-6 text-base max-w-2xl mx-auto">
                {t.subtitle}
            </p>
        </div>
    );
};

export default UpgradeHeader;
