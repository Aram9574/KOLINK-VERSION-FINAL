import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Post, AppLanguage } from '../../../types';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface CalendarViewProps {
    posts: Post[];
    language: AppLanguage;
    onSelectPost: (post: Post) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ posts, language, onSelectPost }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const locale = language === 'es' ? es : enUS;

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    const weekDays = language === 'es'
        ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getPostsForDay = (day: Date) => {
        return posts.filter(post => isSameDay(new Date(post.createdAt), day));
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="bg-white rounded-xl border border-slate-200/60/60 shadow-sm overflow-hidden animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60/60">
                <h2 className="text-xl font-bold text-slate-900 capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale })}
                </h2>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                        {language === 'es' ? 'Hoy' : 'Today'}
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-200/60/60 bg-slate-50">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
                {days.map(day => {
                    const dayPosts = getPostsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div
                            key={day.toISOString()}
                            className={`
                                min-h-[120px] bg-white p-3 flex flex-col gap-2 transition-colors
                                ${!isCurrentMonth ? 'bg-slate-50/50' : ''}
                                ${isToday ? 'bg-brand-50/30' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`
                                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                    ${isToday ? 'bg-brand-600 text-white shadow-md' : 'text-slate-700'}
                                    ${!isCurrentMonth ? 'text-slate-400' : ''}
                                `}>
                                    {format(day, 'd')}
                                </span>
                                {dayPosts.length > 0 && (
                                    <span className="text-xs font-bold text-slate-400">
                                        {dayPosts.length} posts
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-slate-200">
                                {dayPosts.map(post => (
                                    <button
                                        key={post.id}
                                        onClick={() => onSelectPost(post)}
                                        className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-600 text-xs transition-all group border border-slate-200/60/60 hover:border-brand-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${post.viralScore && post.viralScore > 80 ? 'bg-green-500' : 'bg-slate-300'}`} />
                                            <span className="font-semibold truncate">{post.params.topic}</span>
                                        </div>
                                        <p className="line-clamp-2 opacity-70 text-[10px] leading-relaxed">
                                            {post.content}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
