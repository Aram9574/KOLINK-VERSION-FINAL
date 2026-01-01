import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Check if we have a session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session) {
                    console.log("AuthCallback: Session found, redirecting to dashboard");
                    // Successful authentication
                    toast.success('Successfully verified account!');
                    navigate('/dashboard', { replace: true });
                } else {
                    // No session found, maybe wait for onAuthStateChange or just redirect to login
                    // Usually getSession works if the hash is present and valid
                     console.log("AuthCallback: No session found immediately.");
                     
                     // Fallback: Listener might catch it
                }
            } catch (error: any) {
                console.error('Error during auth callback:', error);
                toast.error(error.message || 'Authentication failed');
                navigate('/login', { replace: true });
            }
        };

        handleAuthCallback();

        // Also listen for the event, just in case getSession processes it async
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
             if (event === 'SIGNED_IN' && session) {
                 console.log("AuthCallback: SIGNED_IN event caught");
                 navigate('/dashboard', { replace: true });
             }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
                <p className="text-slate-600 font-medium">Verifying your account...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
