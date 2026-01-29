
import React, { useEffect, useState } from 'react';
import { analytics } from '@/services/analyticsService';
import { RetentionCohortRow } from '@/types/analytics';
import { Loader2, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const RetentionGrid = () => {
    const [cohorts, setCohorts] = useState<RetentionCohortRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await analytics.getRetentionCohorts();
        setCohorts(data);
        setLoading(false);
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    // Process Data: Group by cohort_date
    const cohortMap = new Map<string, { size: number, weeks: Record<number, number> }>();
    let maxWeeks = 0;

    cohorts.forEach(row => {
        if (!cohortMap.has(row.cohort_date)) {
            cohortMap.set(row.cohort_date, { size: row.cohort_size, weeks: {} });
        }
        const cohort = cohortMap.get(row.cohort_date)!;
        cohort.weeks[row.weeks_after] = row.active_users;
        if (row.weeks_after > maxWeeks) maxWeeks = row.weeks_after;
    });

    // Sort dates descending
    const sortedDates = Array.from(cohortMap.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Color scale helper
    const getBgColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-emerald-600 text-white';
        if (percentage >= 60) return 'bg-emerald-500 text-white';
        if (percentage >= 40) return 'bg-emerald-400 text-slate-900';
        if (percentage >= 20) return 'bg-emerald-200 text-slate-900';
        if (percentage > 0) return 'bg-emerald-100 text-slate-900';
        return 'bg-slate-50 text-slate-400';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-700 flex items-center justify-between">
                <span>User Retention by Cohort</span>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
                    <Users className="w-4 h-4" />
                    <span>Based on any activity</span>
                </div>
            </div>
            
            <div className="overflow-x-auto p-4">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-left text-slate-500 font-medium w-32">Cohort</th>
                            <th className="p-2 text-left text-slate-500 font-medium w-24">Users</th>
                            {Array.from({ length: Math.min(maxWeeks + 1, 12) }).map((_, i) => (
                                <th key={i} className="p-2 text-center text-slate-500 font-medium w-16">
                                    Week {i}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="space-y-1">
                        {sortedDates.map(date => {
                            const data = cohortMap.get(date)!;
                            return (
                                <tr key={date}>
                                    <td className="p-2 text-slate-900 font-medium whitespace-nowrap">
                                        {format(parseISO(date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="p-2 text-slate-600">
                                        {data.size}
                                    </td>
                                    {Array.from({ length: Math.min(maxWeeks + 1, 12) }).map((_, i) => {
                                        const active = data.weeks[i] || 0;
                                        const percentage = Math.round((active / data.size) * 100);
                                        const isFuture = false; // Logic to detect future weeks if needed

                                        return (
                                            <td key={i} className="p-1">
                                                <div 
                                                    className={`w-full h-8 flex items-center justify-center rounded text-xs font-semibold transition-all hover:scale-105 cursor-default ${getBgColor(percentage)}`}
                                                    title={`${active} users (${percentage}%)`}
                                                >
                                                    {i === 0 ? '100%' : (percentage > 0 ? `${percentage}%` : '-')}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
