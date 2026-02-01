import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, Trophy } from 'lucide-react';
import { UserProfile } from '../../../types';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../services/userRepository';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingFlowProps {
  user: UserProfile;
  onComplete?: (updatedUser: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'kolink_onboarding_data';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const { language, setUser } = useUser();
  const navigate = useNavigate();
  const t = translations[language].onboarding;

  // Form States
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [usageIntent, setUsageIntent] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.fullName) setFullName(data.fullName);
        if (data.jobTitle) setJobTitle(data.jobTitle);
        if (data.usageIntent) setUsageIntent(data.usageIntent);
        if (data.selectedSources) setSelectedSources(data.selectedSources);
        if (data.step) setStep(data.step);
      } catch (e) {
        console.error("Failed to parse onboarding data", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    const data = { fullName, jobTitle, usageIntent, selectedSources, step };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [fullName, jobTitle, usageIntent, selectedSources, step]);

  const handleNextStep = async () => {
    if (step === 1) {
      if (!fullName || !jobTitle) return;
      setStep(2);
    } else if (step === 2) {
      if (usageIntent.length === 0) return;
      setStep(3);
    } else {
      const updates = {
        name: fullName,
        headline: jobTitle,
        hasOnboarded: true,
      };

      try {
        if (user.id) {
          await updateUserProfile(user.id, updates);
        }
        
        setUser(prev => ({ ...prev, ...updates }));
        
        // Clear persistence
        localStorage.removeItem(STORAGE_KEY);

        navigate(`/dashboard?action=first-post&topic=${encodeURIComponent(jobTitle)}&ref=onboarding`);
      } catch (error) {
        console.error("Onboarding Save Error:", error);
      }
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleUsage = (id: string) => {
    setUsageIntent(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const progressPercentage = (step / 3) * 100;
  const progressLabels = [
    "Identidad",
    "Tu Objetivo",
    "Descubrimiento"
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/60 w-full max-w-xl p-8 rounded-3xl shadow-[0_20px_70px_-15px_rgba(0,0,0,0.12)] relative z-10 my-auto sm:min-h-[600px] flex flex-col">
        
        {/* Motivational Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 flex items-center gap-1.5 bg-brand-50 px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              {progressLabels[step - 1]}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {Math.round(progressPercentage)}% completado
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
            <motion.div 
              className="h-full bg-gradient-to-right from-brand-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
          {step === 3 && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-3 text-xs font-medium text-emerald-600 flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-3 h-3" />
              ¡Casi listo para dominar LinkedIn!
            </motion.p>
          )}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <OnboardingStep1
                  fullName={fullName}
                  setFullName={setFullName}
                  jobTitle={jobTitle}
                  setJobTitle={setJobTitle}
                  onNext={handleNextStep}
                />
              )}

              {step === 2 && (
                <OnboardingStep2
                  usageIntent={usageIntent}
                  toggleUsage={toggleUsage}
                  onNext={handleNextStep}
                />
              )}

              {step === 3 && (
                <OnboardingStep3
                  selectedSources={selectedSources}
                  toggleSource={toggleSource}
                  onNext={handleNextStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 opacity-50" />
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
