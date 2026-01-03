import React, { useState } from "react";
import { AppLanguage } from "../../types";
import { supabase } from "../../services/supabaseClient";
import ReasonStep from "./cancellation/ReasonStepV2";
import OfferStep from "./cancellation/OfferStep";
import ConfirmStep from "./cancellation/ConfirmStep";
import BaseModal from "./BaseModal";

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    language: AppLanguage;
    subscriptionId?: string;
    onCancelSuccess?: () => void;
    planPrice: number;
    userCreatedAt?: string;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen,
    onClose,
    userEmail,
    language,
    subscriptionId,
    onCancelSuccess,
    planPrice,
    userCreatedAt,
}) => {
    const [step, setStep] = useState<"reason" | "offer" | "confirm">("reason");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [discountType, setDiscountType] = useState<"30" | "50">("30");

    // Reset step when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setStep("reason");
            setReason("");
        }
    }, [isOpen]);

    const handleApplyCoupon = async () => {
        setLoading(true);
        try {
            const couponId = discountType === "30" ? "SAVE30" : "SAVE50";
            const { error } = await supabase.functions.invoke(
                "manage-subscription",
                {
                    body: { action: "apply_coupon", subscriptionId, couponId },
                },
            );

            if (error) throw error;
            onClose();
        } catch (err) {
            console.error("Error applying coupon:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.functions.invoke(
                "manage-subscription",
                {
                    body: { action: "cancel", subscriptionId, reason },
                },
            );

            if (error) throw error;
            if (error) throw error;
            if (onCancelSuccess) onCancelSuccess();
            onClose();
        } catch (err) {
            console.error("Error cancelling subscription:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case "reason":
                return (
                    <ReasonStep
                        reason={reason}
                        setReason={setReason}
                        onNext={() => {
                            // Determine discount based on reason severity or random logic
                            if (
                                reason === "too_expensive" ||
                                reason === "not_using_enough"
                            ) {
                                setDiscountType("50");
                            } else {
                                setDiscountType("30");
                            }
                            setStep("offer");
                        }}
                        language={language}
                        onClose={onClose}
                    />
                );
            case "offer":
                return (
                    <OfferStep
                        discountType={discountType}
                        onApplyCoupon={handleApplyCoupon}
                        onReject={() => setStep("confirm")}
                        isLoading={loading}
                        language={language}
                        planPrice={planPrice}
                    />
                );
            case "confirm":
                return (
                    <ConfirmStep
                        onConfirm={handleCancelSubscription}
                        onClose={() => setStep("offer")}
                        isLoading={loading}
                        language={language}
                        userCreatedAt={userCreatedAt}
                    />
                );
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
            <div className="bg-white rounded-xl overflow-hidden">
                <div className="p-1">
                    {renderStep()}
                </div>
            </div>
        </BaseModal>
    );
};

export default CancellationModal;
