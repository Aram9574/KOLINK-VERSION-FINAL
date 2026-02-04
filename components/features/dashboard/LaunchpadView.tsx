import React, { Suspense } from 'react';
import { 
    PenSquare,
} from 'lucide-react';
import { UserProfile, AppTab } from '../../../types';
import { ExpandableTabs } from '../../ui/expandable-tabs';
// Lazy load modals
const HelpModal = React.lazy(() => import('../../modals/HelpModal'));
const FeedbackModal = React.lazy(() => import('../../modals/FeedbackModal').then(module => ({ default: module.FeedbackModal })));
import { OnboardingChecklist } from '../onboarding/OnboardingChecklist';
import { LaunchpadHeader } from './launchpad/LaunchpadHeader';
import { GamificationCard } from './GamificationCard';
import { ToolsGrid } from './launchpad/ToolsGrid';
import { MissionLog } from './launchpad/MissionLog';
import { InsightWidget } from './launchpad/InsightWidget';
import { AccountWidget } from './launchpad/AccountWidget';
import { useLaunchpad } from '../../../hooks/useLaunchpad';
import { OnboardingTour } from '../onboarding/OnboardingTour';

interface LaunchpadProps {
    user: UserProfile;
    onSelectTool: (tab: AppTab) => void;
}

const LaunchpadView: React.FC<LaunchpadProps> = ({ 
    user,
    onSelectTool 
}) => {
    const {
        language,
        logout,
        t,
        showHelp,
        setShowHelp,
        isFeedbackOpen,
        setIsFeedbackOpen,
        isLoading,
        shortcuts,
        stats,
        tools
    } = useLaunchpad({ user, onSelectTool });

    return (
        <div className="min-h-screen flex flex-col p-6 lg:p-12">
            {/* Hero Section */}
            <LaunchpadHeader 
                user={user} 
                language={language} 
                t={t} 
                onSelectTool={onSelectTool} 
            />

            {/* Launch Grid */}
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                         <span className="w-2 h-6 bg-brand-500 rounded-full" />
                         Centro de Comando
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                             <span>C: Crear</span>
                             <span className="text-slate-300">|</span>
                             <span>H: Inicio</span>
                             <span className="text-slate-300">|</span>
                             <span>S: Ajustes</span>
                        </div>
                        <ExpandableTabs 
                            tabs={shortcuts} 
                            activeColor="text-brand-600"
                            className="border-slate-200/60 bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                <ToolsGrid 
                    tools={tools} 
                    isLoading={isLoading} 
                    user={user}
                    language={language}
                    onFeedbackOpen={() => setIsFeedbackOpen(true)}
                />
            </div>

            {/* Gamification & Progress */}
            <div className="mb-10">
                <GamificationCard user={user} language={language} />
            </div>

            {/* Activation Checklist */}
            <div className="mb-10">
                <OnboardingChecklist 
                    user={user} 
                    onSelectTool={onSelectTool} 
                />
            </div>

            {/* Bottom Section: Recent Work & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                
                {/* Recent Activities */}
                <MissionLog onSelectTool={onSelectTool} />

                {/* Engagement / Insight Widget */}
                {/* Insight Widget */}
                <InsightWidget 
                    isLoading={isLoading}
                    language={language}
                    onSelectTool={onSelectTool}
                    postsThisWeek={stats.postsThisWeek}
                    weeklyGoal={stats.weeklyGoal}
                    nextMilestone={stats.nextMilestone}
                />

                {/* Session Logout Action/Account */}
                <AccountWidget user={user} logout={logout} />
            </div>

            {/* Onboarding Tour */}
            <OnboardingTour />

            {/* Modals */}
            {/* Modals with Suspense */}
            <Suspense fallback={null}>
                <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
                <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
            </Suspense>
        </div>
    );
};

export default LaunchpadView;
