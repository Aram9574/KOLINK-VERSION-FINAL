import React, { useState } from 'react';
import { AuditResult, AuditSection } from '../../../types';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Award, BookOpen, Briefcase, User, Lightbulb } from 'lucide-react';

interface AuditDashboardProps {
  result: AuditResult;
}

const ScoreBadge = ({ score }: { score: number }) => {
  let color = 'bg-red-100 text-red-700 border-red-200';
  if (score >= 8) color = 'bg-green-100 text-green-700 border-green-200';
  else if (score >= 5) color = 'bg-yellow-100 text-yellow-700 border-yellow-200';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${color}`}>
      {score}/10
    </span>
  );
};

const SectionCard = ({ title, icon: Icon, section }: { title: string, icon: any, section: AuditSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
            <Icon size={20} />
          </div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <ScoreBadge score={section.score} />
      </div>
      
      <p className="text-sm text-slate-600 mb-4">{section.feedback}</p>

      {section.suggestion && (
        <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-sm">
          <p className="font-semibold text-indigo-700 flex items-center gap-2 mb-1">
             <Lightbulb size={14} /> AI Recommendation:
          </p>
          <p className="text-indigo-800 italic">"{section.suggestion}"</p>
        </div>
      )}

      {section.improvements_per_job && section.improvements_per_job.length > 0 && (
         <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Improvements</h4>
            <ul className="space-y-2">
                {section.improvements_per_job.map((imp, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <TrendingUp size={14} className="mt-0.5 text-green-500 shrink-0" />
                        {imp}
                    </li>
                ))}
            </ul>
         </div>
      )}

    {section.missing_critical_skills && section.missing_critical_skills.length > 0 && (
         <div className="mt-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Missing Skills</h4>
            <div className="flex flex-wrap gap-2">
                {section.missing_critical_skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-medium">
                        {skill}
                    </span>
                ))}
            </div>
         </div>
      )}
    </div>
  );
};

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-xl p-6 text-white text-center">
            <h2 className="text-sm font-medium opacity-80 uppercase tracking-wide">Global Score</h2>
            <div className="text-5xl font-bold mt-2">{result.global_score}</div>
            <div className="mt-4 text-xs bg-white/20 inline-block px-3 py-1 rounded-full">
                {result.industry_detected}
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 col-span-2">
             <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <Award className="text-brand-600" size={20}/> Brand Consistency
             </h3>
             <p className="text-slate-600 leading-relaxed">{result.brand_consistency}</p>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Immediate Action Plan
        </h3>
        <div className="space-y-3">
            {result.action_plan.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                    <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{step}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard 
            title="Headline & Intro" 
            icon={User} 
            section={result.sections_audit.headline} 
        />
        <SectionCard 
            title="About Section" 
            icon={BookOpen} 
            section={result.sections_audit.about} 
        />
        <SectionCard 
            title="Experience Impact" 
            icon={Briefcase} 
            section={result.sections_audit.experience} 
        />
        <SectionCard 
            title="Skills & Keywords" 
            icon={TrendingUp} 
            section={result.sections_audit.skills_languages} 
        />
      </div>
    </div>
  );
};
