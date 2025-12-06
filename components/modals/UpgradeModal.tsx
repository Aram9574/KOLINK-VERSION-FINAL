
import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types';
import { PLANS } from '../../constants';
import UpgradeHeader from './upgrade/UpgradeHeader';
import BillingToggle from './upgrade/BillingToggle';
import PlanCard from './upgrade/PlanCard';
import BaseModal from './BaseModal';
import { useUser } from '../../context/UserContext';
import { translations } from '../../translations';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (plan: SubscriptionPlan) => void;
    currentPlanId: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, currentPlanId }) => {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const { language } = useUser();
    const t = translations[language].app.upgrade;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <UpgradeHeader />

            <div className="p-6 lg:p-12 pt-0 lg:pt-0 text-center">
                <BillingToggle billingInterval={billingInterval} onChange={setBillingInterval} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {PLANS.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            currentPlanId={currentPlanId}
                            billingInterval={billingInterval}
                            onUpgrade={onUpgrade}
                        />
                    ))}
                </div>

                <p className="text-xs text-slate-400 mt-8 max-w-xl mx-auto">
                    {t.securePayment}
                </p>
            </div>
        </BaseModal>
    );
};

export default UpgradeModal;