import React, { useState } from 'react';
import { AuditService } from '../../../services/AuditService';
import { AuditResult } from '../../../types';
import { AuditDashboard } from './AuditDashboard';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import Skeleton from '../../ui/Skeleton';

const AuditPage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AuditResult | null>(null);

    const handleAudit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.includes('linkedin.com/in/')) {
            toast.error("Please enter a valid LinkedIn Profile URL");
            return;
        }

        setLoading(true);
        try {
            const data = await AuditService.analyzeProfile(url);
            setResult(data);
            toast.success("Profile analysis complete!");
        } catch (error: any) {
            toast.error(error.message || "Failed to analyze profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Profile Auditor</h1>
                <p className="text-slate-500">Get a 360° professional review of your LinkedIn profile powered by AI.</p>
            </div>

            {/* Input Section - Hide if result shown? Or keep for re-audit? Keep. */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/60/60 mb-8">
                <form onSubmit={handleAudit} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="https://www.linkedin.com/in/your-profile" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-medium"
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !url}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-brand-200 hover:shadow-brand-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center min-w-[160px]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
                                <span className="animate-pulse">Analyzing...</span>
                            </div>
                        ) : (
                            'Audit Profile'
                        )}
                    </button>
                </form>
                {loading && (
                    <div className="mt-8 space-y-8 animate-in fade-in duration-700">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-64 rounded-3xl" />
                            <Skeleton className="h-48 rounded-3xl" />
                        </div>
                        <div className="text-center text-sm text-slate-400 font-medium">
                            Nexus AI is performing a deep scan of your professional identity...
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {result && <AuditDashboard result={result} />}
        </div>
    );
};

export default AuditPage;
