import React, { useState } from 'react';
import { AuditResult, AuditSection } from '../../../types';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Award, BookOpen, Briefcase, User, Lightbulb } from 'lucide-react';

interface AuditDashboardProps {
  result: AuditResult;
}

const ScoreBadge = ({ score }: { score: number }) => {
  let color = 'bg-red-50 text-red-600 border-red-100/50';
  if (score >= 8) color = 'bg-brand-50 text-brand-600 border-brand-100/50';
  else if (score >= 5) color = 'bg-amber-50 text-amber-600 border-amber-100/50';

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${color}`}>
      {score}/10
    </span>
  );
};

const SectionCard = ({ title, icon: Icon, section }: { title: string, icon: any, section: AuditSection }) => {
  return (
    <div className="relative overflow-hidden glass-surface p-6 hover:soft-glow-blue group transition-all duration-300">
      {/* Bento Corner Light */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100/50 rounded-xl text-slate-600 group-hover:bg-brand-500/10 group-hover:text-brand-600 transition-colors">
              <Icon strokeWidth={1.5} size={20} />
            </div>
            <h3 className="font-bold text-slate-900 tracking-tight">{title}</h3>
          </div>
          <ScoreBadge score={section.score} />
        </div>
        
        <p className="text-sm text-slate-600 mb-4">{section.feedback}</p>

        {section.suggestion && (
          <div className="mt-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 text-sm">
            <p className="font-bold text-slate-900 flex items-center gap-2 mb-1">
               <Lightbulb strokeWidth={1.5} size={14} className="text-amber-500" /> AI Recommendation
            </p>
            <p className="text-slate-600 italic leading-relaxed">"{section.suggestion}"</p>
          </div>
        )}

        {section.improvements_per_job && section.improvements_per_job.length > 0 && (
           <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Improvements</h4>
              <ul className="space-y-2">
                  {section.improvements_per_job.map((imp, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <TrendingUp strokeWidth={1.5} size={14} className="mt-0.5 text-emerald-500 shrink-0" />
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
                      <span key={idx} className="px-2 py-1 bg-red-50 text-red-600 border border-red-100/50 rounded text-xs font-medium">
                          {skill}
                      </span>
                  ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export const AuditDashboard: React.FC<AuditDashboardProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-slate-950 rounded-xl p-8 text-white text-center shadow-2xl group transition-all duration-300 hover:shadow-brand-500/10">
            {/* Corner Light */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-[10px] font-bold opacity-60 uppercase tracking-widest relative z-10">Global Score</h2>
            <div className="text-7xl font-black mt-2 tracking-tighter relative z-10">{result.global_score}</div>
            <div className="mt-4 text-[10px] bg-white/10 inline-block px-3 py-1 rounded-full font-bold uppercase tracking-wider relative z-10">
                {result.industry_detected}
            </div>
        </div>
        
        <div className="relative overflow-hidden glass-surface p-8 col-span-2 group hover:soft-glow-blue transition-all">
             {/* Corner Light */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <h3 className="font-bold text-xl text-slate-900 mb-3 flex items-center gap-2 tracking-tight relative z-10">
                <Award strokeWidth={1.5} className="text-brand-600" size={24}/> Brand Consistency
             </h3>
             <p className="text-slate-600 leading-relaxed font-medium relative z-10 text-lg">{result.brand_consistency}</p>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-blue-50/30 rounded-2xl border border-blue-100 p-6">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 tracking-tight">
            <AlertTriangle size={20} className="text-blue-600" /> Immediate Action Plan
        </h3>
        <div className="grid gap-3">
            {result.action_plan.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100/50 shadow-sm transition-all hover:translate-x-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-blue-200">
                        {idx + 1}
                    </div>
                    <span className="text-slate-800 text-sm font-semibold tracking-tight">{step}</span>
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
