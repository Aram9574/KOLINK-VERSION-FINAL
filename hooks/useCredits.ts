
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";

export const useCredits = () => {
    const { user, refreshUser } = useUser();
    const toast = useToast();
    
    const credits = user?.credits || 0;

    const hasCredits = (cost: number = 1): boolean => {
        return credits >= cost;
    };

    const checkCredits = (cost: number = 1): boolean => {
        if (!hasCredits(cost)) {
            toast.error("Créditos insuficientes. Por favor recarga.", "Sin Créditos");
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
