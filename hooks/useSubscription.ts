import { useToasts } from '../components/ui/toast';
import { supabase } from '../services/supabaseClient';
import { SubscriptionPlan } from '../types';

export const useSubscription = () => {
    const toasts = useToasts();
    const handleUpgrade = async (plan: SubscriptionPlan) => {
        console.log("handleUpgrade called for:", plan);
        if (plan.id === 'free') return;

        const toastId = toasts.message({ text: "Iniciando pasarela de pago...", preserve: true });

        try {
            console.log("Invoking create-checkout-session with priceId:", plan.stripePriceId);

            // Add timeout to prevent hanging
            const invokePromise = supabase.functions.invoke('create-checkout-session', {
                body: { priceId: plan.stripePriceId }
            });

            const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), 30000)
            );

            const { data, error } = await Promise.race([invokePromise, timeoutPromise]);

            console.log("Checkout session response:", { data, error });

            if (error) throw error;

            if (data?.error) {
                throw new Error(data.error);
            }

            if (data?.url) {
                console.log("Redirecting to Stripe:", data.url);
            toasts.dismiss(toastId); // Clear toast before redirect
                window.location.href = data.url;
            } else {
                throw new Error("No URL returned from checkout session");
            }
        } catch (e: any) {
            console.error("Checkout failed", e);
            toasts.dismiss(toastId);
            toasts.error("Error al iniciar pago: " + (e.message || "Desconocido"));
        }
    };

    return { handleUpgrade };
};
