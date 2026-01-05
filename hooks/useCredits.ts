
import { useUser } from "../context/UserContext";
import { useToasts } from "../components/ui/toast";

export const useCredits = () => {
    const { user, refreshUser } = useUser();
    const toasts = useToasts();
    
    const credits = user?.credits || 0;

    const hasCredits = (cost: number = 1): boolean => {
        return credits >= cost;
    };

    const checkCredits = (cost: number = 1): boolean => {
        if (!hasCredits(cost)) {
            toasts.error("Créditos insuficientes. Por favor recarga.", {
                action: "Recargar",
                onAction: () => window.location.href = '/plans'
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
