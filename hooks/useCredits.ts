
import { useUser } from "../context/UserContext";
import { toast } from "sonner";

export const useCredits = () => {
    const { user, refreshUser } = useUser();
    
    const credits = user?.credits || 0;

    const hasCredits = (cost: number = 1): boolean => {
        return credits >= cost;
    };

    const checkCredits = (cost: number = 1): boolean => {
        if (!hasCredits(cost)) {
            toast.error("Créditos insuficientes. Por favor recarga.", {
                action: {
                    label: "Recargar",
                    onClick: () => window.location.href = '/plans' // Or trigger modal
                }
            });
            return false;
        }
        return true;
    };

    return {
        credits,
        hasCredits,
        checkCredits,
        refreshUser
    };
};
