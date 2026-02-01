import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Users, 
  Share2, 
  ChevronRight, 
  Sparkles,
  Trophy,
  Copy,
  Mail,
  LucideIcon
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../services/supabaseClient";
import { toast } from "sonner";
import { Database } from "../../types";

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export const WaitlistPage: React.FC = () => {
  const { language } = useUser();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<Tables<'waitlist'> | null>(null);

  // Checks URL for referral code
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get("ref");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // 1. Get referrer ID if code exists
      let referredById = null;
      if (referralCode) {
        const { data: referrer } = await supabase
          .from("waitlist")
          .select("id")
          .eq("referral_code", referralCode)
          .single();
        referredById = referrer?.id;
      }

      // 2. Insert into waitlist
      const { data, error } = await supabase
        .from("waitlist")
        .insert([{ 
          email, 
          referred_by: referredById,
          referral_code: Math.random().toString(36).substring(2, 10).toUpperCase()
        }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // Already on waitlist, fetch data
          const { data: existing } = await supabase
            .from("waitlist")
            .select("*")
            .eq("email", email)
            .single();
          setUserData(existing);
          toast.success(language === 'es' ? "¡Ya estás en la lista!" : "You're already on the list!");
        } else {
          throw error;
        }
      } else {
        setUserData(data);
        toast.success(language === 'es' ? "¡Bienvenido a bordo! 🚀" : "Welcome aboard! 🚀");
      }
    } catch (error) {
      console.error("Waitlist error:", error);
      toast.error(language === 'es' ? "Error al unirse. Intenta de nuevo." : "Error joining. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/waitlist?ref=${userData.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success(language === 'es' ? "Enlace copiado" : "Link copied");
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 mb-8"
        >
          <Sparkles size={16} />
          <span className="text-xs font-bold uppercase tracking-widest leading-none pt-0.5">
            {language === 'es' ? 'Acceso Anticipado' : 'Early Access'}
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6"
        >
          {language === 'es' ? 'La Era de la Influencia' : 'The Influence Era'}
          <br />
          <span className="text-brand-600">{language === 'es' ? 'Estratégica.' : 'Strategic.'}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed"
        >
          {language === 'es' 
            ? "Conviértete en una autoridad en LinkedIn con IA Predictiva. Únete a la cola y desbloquea el acceso antes que el resto." 
            : "Become a LinkedIn authority with Predictive AI. Join the queue and unlock access before everyone else."}
        </motion.p>

        <AnimatePresence mode="wait">
          {!userData ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleJoin}
              className="w-full max-w-md flex flex-col gap-4"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder={language === 'es' ? "Tu mejor email..." : "Your best email..."}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-brand-500 focus:outline-none transition-all shadow-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {language === 'es' ? 'Reservar mi Lugar' : 'Reserve my Spot'}
                    <ChevronRight size={20} />
                  </>
                )}
              </motion.button>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                🔒 {language === 'es' ? 'Cero spam. Solo autoridad.' : 'Zero spam. Pure authority.'}
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-slate-200/50"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Ranking Card */}
                <div className="flex-1 flex flex-col items-center">
                   <div className="w-24 h-24 rounded-3xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
                      <Trophy size={48} />
                   </div>
                   <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">
                      {language === 'es' ? 'Tu Posición' : 'Your Position'}
                   </h3>
                   <div className="text-6xl font-black text-slate-900 mb-2">
                      #{userData.position}
                   </div>
                   <p className="text-xs text-slate-500 font-medium">
                      {language === 'es' 
                        ? `Has invitado a ${userData.total_referrals} personas` 
                        : `You've invited ${userData.total_referrals} people`}
                   </p>
                </div>

                {/* Referral Action */}
                <div className="flex-1 w-full pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-12 flex flex-col text-left">
                  <h3 className="text-xl font-black text-slate-900 mb-4">
                     {language === 'es' ? 'Sube en la lista 🔥' : 'Move up the list 🔥'}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                     {language === 'es' 
                        ? "Por cada persona que se una con tu link, subes 50 puestos automáticamente." 
                        : "For every person who joins with your link, you move up 50 spots automatically."}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <code className="text-[10px] font-bold text-slate-600 truncate mr-4">
                        {`${window.location.origin}/waitlist?ref=${userData.referral_code}`}
                      </code>
                      <button 
                        onClick={copyReferralLink}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-500 transition-all shadow-sm"
                      >
                         <Copy size={16} />
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={copyReferralLink}
                        className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                       >
                         <Share2 size={18} />
                         {language === 'es' ? 'Compartir Ahora' : 'Share Now'}
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits Grid */}
        <div className="mt-32 w-full grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Rocket, 
                title: language === 'es' ? 'Lanzamiento VIP' : 'VIP Launch',
                desc: language === 'es' ? 'Acceso 48h antes que el público general.' : 'Access 48h before general public.'
              },
              { 
                icon: Trophy, 
                title: language === 'es' ? 'Lifetime Deals' : 'Lifetime Deals',
                desc: language === 'es' ? 'Solo para los primeros 100 en la lista.' : 'Only for the first 100 in the list.'
              },
              { 
                icon: Users, 
                title: language === 'es' ? 'Comunidad Viral' : 'Viral Community',
                desc: language === 'es' ? 'Grupo privado de expertos en LinkedIn.' : 'Private group of LinkedIn experts.'
              }
            ].map((item: { icon: LucideIcon; title: string; desc: string }, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                key={i}
                className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:border-brand-100 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-50 transition-all shadow-sm">
                  <item.icon size={24} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2 truncate px-4">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">{item.desc}</p>
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default WaitlistPage;
