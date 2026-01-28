import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, CheckCircle2, XCircle, ChevronRight, PieChart } from 'lucide-react';

export const JobMatcherMockup: React.FC = () => {
    const [activeJob, setActiveJob] = useState(0);

    const jobs = [
        {
            title: "Senior Product Designer",
            company: "Stripe",
            match: 94,
            skills: ["Figma", "React", "Systems Thinking"],
            missing: []
        },
        {
            title: "UX Researcher",
            company: "Spotify",
            match: 65,
            skills: ["User Testing", "Data Analysis"],
            missing: ["SQL", "Python"]
        }
    ];

    return (
        <div className="bg-white w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-xl border border-slate-200 font-sans">
            <div className="w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-700">Job Matches</h3>
                    <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full">Live Feed</span>
                </div>

                {jobs.map((job, idx) => (
                    <motion.div
                        key={idx}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        onClick={() => setActiveJob(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${activeJob === idx ? 'bg-white border-brand-500 shadow-lg ring-1 ring-brand-100' : 'bg-slate-50 border-slate-200 hover:border-brand-200'}`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-slate-900">{job.title}</h4>
                                <p className="text-sm text-slate-500">{job.company}</p>
                            </div>
                            <div className={`flex flex-col items-end`}>
                                <div className={`text-lg font-bold ${job.match > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {job.match}%
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Match</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {activeJob === idx && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-3 border-t border-slate-100 space-y-3">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase">You Have</span>
                                            <div className="flex flex-wrap gap-1">
                                                {job.skills.map(skill => (
                                                    <span key={skill} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-100 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {job.missing.length > 0 && (
                                            <div className="space-y-1">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Missing</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {job.missing.map(skill => (
                                                        <span key={skill} className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-md border border-red-100 flex items-center gap-1">
                                                            <XCircle className="w-3 h-3" /> {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button className="w-full mt-2 py-2 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors">
                                            Optimize Resume for this Role
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
