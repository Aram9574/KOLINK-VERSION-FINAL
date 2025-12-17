import React, { useState } from 'react';
import { AuditService } from '../../../services/AuditService';
import { AuditResult } from '../../../types';
import { AuditDashboard } from './AuditDashboard';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';

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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <form onSubmit={handleAudit} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="https://www.linkedin.com/in/your-profile" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !url}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-brand-200 hover:shadow-brand-300 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Analyzing...
                            </>
                        ) : (
                            'Audit Profile'
                        )}
                    </button>
                </form>
                {loading && (
                    <div className="mt-4 text-center text-sm text-slate-500 animate-pulse">
                        This might take a minute. We are gathering data and running a deep analysis...
                    </div>
                )}
            </div>

            {/* Results */}
            {result && <AuditDashboard result={result} />}
        </div>
    );
};

export default AuditPage;
