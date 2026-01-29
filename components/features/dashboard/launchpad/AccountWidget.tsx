import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, LogOut } from 'lucide-react';
import { UserProfile } from '../../../../types';

interface AccountWidgetProps {
    user: UserProfile;
    logout: () => void;
}

export const AccountWidget: React.FC<AccountWidgetProps> = ({ user, logout }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="card-nexus p-8 flex flex-col justify-between h-auto gap-6"
        >
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Fingerprint className="w-5 h-5" />
                    </div>
                    Cuenta
                </h3>
                <div className="pl-[52px]">
                        <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                        <p className="text-xs text-slate-400 font-medium">Plan {user?.isPremium ? 'Premium' : 'Gratuito'}</p>
                </div>
            </div>

            <button 
                onClick={logout}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
                Cerrar Sesión 
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};
