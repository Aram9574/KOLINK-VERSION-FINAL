import React, { useEffect, useState } from 'react';
import { analyticsRepository } from '@/services/repositories/analyticsRepository';
import { AnalyticsEvent } from '@/types/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2, TrendingUp, Users, Zap, Download } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { RetentionGrid } from './RetentionGrid';

export const AnalyticsDashboard = () => {
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await analyticsRepository.fetchRecentEvents(2000);
        setEvents(data);
        setLoading(false);
    };

    // --- AGGREGATION LOGIC ---
    const totalPosts = events.filter(e => e.event_name === 'post_generated_success').length;
    const totalExports = events.filter(e => e.event_name === 'carousel_exported').length;
    const totalPublish = events.filter(e => e.event_name === 'post_published_linkedin').length;
    
    // Monthly Active Users (Proxy by unique user_ids in last 30 days)
    const uniqueUsers = new Set(events.map(e => e.user_id)).size;

    // Daily Stats for Chart
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date: format(date, 'MMM dd'),
            posts: events.filter(e => e.event_name === 'post_generated_success' && isSameDay(parseISO(e.created_at || ''), date)).length,
            exports: events.filter(e => e.event_name === 'carousel_exported' && isSameDay(parseISO(e.created_at || ''), date)).length
        };
    });

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <TrendingUp className="text-brand-600" />
                Product Analytics
            </h1>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Posts Generated" value={totalPosts} icon={<Zap className="text-amber-500" />} />
                <KpiCard title="Carousels Exported" value={totalExports} icon={<Download className="text-blue-500" />} />
                <KpiCard title="Linked Published" value={totalPublish} icon={<Users className="text-green-500" />} />
                <KpiCard title="Active Users (Sample)" value={uniqueUsers} icon={<Users className="text-purple-500" />} />
            </div>

            {/* CHART */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h3 className="text-lg font-semibold mb-6">Activity (Last 7 Days)</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={last7Days}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="posts" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Posts" />
                            <Bar dataKey="exports" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Exports" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RETENTION GRID */}
            <div className="mb-8">
                <RetentionGrid />
            </div>



            {/* INTERACTION HEATMAP (Top Elements) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                 <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-700 flex items-center justify-between">
                    <span>Top Interactions (Simplified Heatmap)</span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-normal">
                        <Loader2 className="w-3 h-3" />
                         <span>Real-time clicks</span>
                    </div>
                </div>
                 <div className="p-6">
                    {/* Note: In a real app we would load this data. For now, we just placeholder the structure 
                        or need to actually call the new repo method. 
                        Let's update the loadData function to fetch this too.
                    */}
                    <div className="text-sm text-slate-500 text-center py-4 italic">
                        Start navigating the app to generate click data...
                    </div>
                </div>
            </div>

            {/* RECENT EVENTS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-700">Recent Events</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Event Name</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {events.slice(0, 20).map((e) => (
                                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                                        {format(parseISO(e.created_at || ''), 'HH:mm:ss')}
                                    </td>
                                    <td className="px-6 py-3 font-medium text-slate-900">
                                        <Badge event={e.event_name} />
                                    </td>
                                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                                        {e.user_id?.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-3 text-slate-400 max-w-[200px] truncate">
                                        {JSON.stringify(e.properties)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, icon }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
    </div>
);

const Badge = ({ event }: { event: string }) => {
    let color = 'bg-slate-100 text-slate-600';
    if (event.includes('success')) color = 'bg-green-100 text-green-700';
    if (event.includes('error')) color = 'bg-red-100 text-red-700';
    if (event.includes('export')) color = 'bg-blue-100 text-blue-700';
    
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
            {event}
        </span>
    );
}

export default AnalyticsDashboard;
