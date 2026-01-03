import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, RefreshCcw, User, Zap } from 'lucide-react';
import { UserProfile, BrandVoice } from '../../../types';
import { useUser } from '../../../context/UserContext';

interface AuthorityGapProps {
    user: UserProfile;
    activeVoice: BrandVoice | undefined;
}

const AuthorityGap: React.FC<AuthorityGapProps> = ({ user, activeVoice }) => {
    const { language } = useUser();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{
        scores: { technical: number; empathy: number; aggression: number; clarity: number };
        gap: string;
        recommendation: string;
    } | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        // Simulate analysis delay
        await new Promise(r => setTimeout(r, 2000));
        
        // Mock Result (In production this calls Gemini)
        setResult({
            scores: { 
                technical: 85, 
                empathy: 60, 
                aggression: 40, 
                clarity: 90 
            },
            gap: "Moderate Gap",
            recommendation: "Your profile highlights Technical Expertise (85), but your new Voice DNA is highly Empathetic. Consider adding more 'soft skills' to your bio."
        });
        setIsAnalyzing(false);
    };

    // Radar Chart Logic (Simple SVG)
    const renderRadar = (scores: { technical: number; empathy: number; aggression: number; clarity: number }) => {
        const size = 200;
        const center = size / 2;
        const radius = 80;
        const points = [
            // Top (Technical)
            [center, center - (radius * scores.technical / 100)],
             // Right (Clarity)
            [center + (radius * scores.clarity / 100), center],
            // Bottom (Empathy)
            [center, center + (radius * scores.empathy / 100)],
            // Left (Aggression)
            [center - (radius * scores.aggression / 100), center],
        ].map(p => p.join(',')).join(' ');

        return (
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Grid */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
                <circle cx={center} cy={center} r={radius * 0.5} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" />
                
                {/* Axes */}
                <line x1={center} y1={center-radius} x2={center} y2={center+radius} stroke="#e2e8f0" />
                <line x1={center-radius} y1={center} x2={center+radius} y2={center} stroke="#e2e8f0" />
                
                {/* Data Polygon */}
                <motion.polygon 
                    initial={{ scale: 0, opacity: 0, originX: 0.5, originY: 0.5 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    points={points} 
                    fill="url(#grad1)" 
                    stroke="#2563eb"
                    strokeWidth="2"
                />
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    </linearGradient>
                </defs>
                
                {/* Labels */}
                <text x={center} y={center - radius - 10} textAnchor="middle" className="text-[10px] fill-slate-500 font-bold uppercase">Expertise</text>
                <text x={center + radius + 10} y={center} textAnchor="start" className="text-[10px] fill-slate-500 font-bold uppercase">Clarity</text>
                <text x={center} y={center + radius + 15} textAnchor="middle" className="text-[10px] fill-slate-500 font-bold uppercase">Empathy</text>
                <text x={center - radius - 10} y={center} textAnchor="end" className="text-[10px] fill-slate-500 font-bold uppercase">Aggression</text>
            </svg>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs uppercase tracking-wider">
                            <Zap className="w-4 h-4" />
                            Authority Scanner
                        </div>
                        <h2 className="text-2xl font-bold">
                             {user.name} vs. "{activeVoice?.name || 'Current Voice'}"
                        </h2>
                        <p className="text-indigo-100/80 leading-relaxed text-sm">
                            Analyze if your LinkedIn profile's history and bio effectively back up the authority claims extracted from your Brand Voice.
                        </p>
                        
                        {!result ? (
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !activeVoice}
                                className="mt-4 px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isAnalyzing ? 'Running Deep Analysis...' : 'Run Authority Scan'}
                            </button>
                        ) : (
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => setResult(null)} className="px-4 py-2 bg-indigo-800/50 rounded-lg text-sm hover:bg-indigo-800">
                                    Reset Scan
                                </button>
                                <div className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Scan Complete
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Visualizer */}
                    <div className="w-64 h-64 bg-white/5 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md relative">
                        {isAnalyzing && (
                             <motion.div 
                                className="absolute inset-0 border-t-2 border-indigo-500 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                             />
                        )}
                        {result ? renderRadar(result.scores) : <User className="w-16 h-16 text-white/20" />}
                    </div>
                </div>
            </div>

            {/* Results */}
            {result && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Impostor Warning: {result.gap}
                        </h3>
                        <p className="text-slate-600 text-sm">
                            {result.recommendation}
                        </p>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold uppercase text-slate-400">Authority Level</h4>
                             <span className="text-xs font-bold uppercase text-red-400">Impostor Index: {100 - 78}%</span>
                        </div>
                        <div className="flex items-end gap-2">
                             <span className="text-3xl font-bold text-slate-900">78</span>
                             <span className="text-sm text-slate-500 mb-1">/ 100</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                             {/* Authority Bar */}
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '78%' }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full absolute left-0 top-0 z-10"
                             />
                             {/* Impostor Zone */}
                             <div className="absolute right-0 top-0 h-full bg-red-400/30 w-[22%]" />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AuthorityGap;
