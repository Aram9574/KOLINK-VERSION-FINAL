import React, { useState } from "react";
import { SubscriptionPlan } from "../../types";
import { PLANS } from "../../constants";
import UpgradeHeader from "./upgrade/UpgradeHeader";
import BillingToggle from "./upgrade/BillingToggle";
import PlanCard from "./upgrade/PlanCard";
import BaseModal from "./BaseModal";
import { useUser } from "../../context/UserContext";
import { translations } from "../../translations";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (plan: SubscriptionPlan) => void;
    currentPlanId: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = (
    { isOpen, onClose, onUpgrade, currentPlanId },
) => {
    const [billingInterval, setBillingInterval] = useState<
        "monthly" | "yearly"
    >("monthly");
    const { language } = useUser();
    const t = translations[language].app.upgrade;

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
            <div className="overflow-y-auto max-h-[85vh]">
                <UpgradeHeader />

                <div className="p-4 md:p-6 pt-0 text-center">
                    <BillingToggle
                        billingInterval={billingInterval}
                        onChange={setBillingInterval}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left pb-8">
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

                    <p className="text-[10px] md:text-xs text-slate-400 mt-4 md:mt-8 max-w-xl mx-auto pb-6">
                        {t.securePayment}
                    </p>
                </div>
            </div>
        </BaseModal>
    );
};

export default UpgradeModal;
