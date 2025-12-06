import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { UserProfile } from '../../../types';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

interface OnboardingFlowProps {
  user: UserProfile;
  onComplete: (updatedUser: Partial<UserProfile>) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const { language } = useUser();
  const t = translations[language].onboarding;

  // Step 1 Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState(''); // Maps to headline

  // Step 2 Data
  const [usageIntent, setUsageIntent] = useState<string[]>([]);

  // Step 3 Data
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const handleNextStep = () => {
    if (step === 1) {
      if (!firstName || !lastName || !jobTitle) return;
      setStep(2);
    } else if (step === 2) {
      if (usageIntent.length === 0) return;
      setStep(3);
    } else {
      // Finish
      onComplete({
        name: `${firstName} ${lastName}`,
        headline: jobTitle, // Using job title as initial headline
        hasOnboarded: true
      });
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

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-xl p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 my-auto">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 1 ? 'bg-brand-600' : 'bg-slate-100'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 2 ? 'bg-brand-600' : 'bg-slate-100'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 3 ? 'bg-brand-600' : 'bg-slate-100'}`} />
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <OnboardingStep1
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            onNext={handleNextStep}
          />
        )}

        {/* Step 2: Usage Intent */}
        {step === 2 && (
          <OnboardingStep2
            usageIntent={usageIntent}
            toggleUsage={toggleUsage}
            onNext={handleNextStep}
          />
        )}

        {/* Step 3: Attribution */}
        {step === 3 && (
          <OnboardingStep3
            selectedSources={selectedSources}
            toggleSource={toggleSource}
            onNext={handleNextStep}
          />
        )}

        {/* Footer Disclaimer */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            {t.footer}
          </p>
        </div>

      </div>
    </div>
  );
};

export default OnboardingFlow;
