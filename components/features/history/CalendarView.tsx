import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Post, AppLanguage } from '../../../types';
import { ChevronLeft, ChevronRight, FileText, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

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
        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 capitalize leading-tight">
                            {format(currentDate, 'MMMM yyyy', { locale })}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Content Schedule</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/40">
                        <button 
                            onClick={prevMonth} 
                            className="p-2 hover:bg-white hover:text-brand-600 hover:shadow-sm rounded-lg text-slate-500 transition-all duration-200"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={nextMonth} 
                            className="p-2 hover:bg-white hover:text-brand-600 hover:shadow-sm rounded-lg text-slate-500 transition-all duration-200"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        {language === 'es' ? 'Hoy' : 'Today'}
                    </button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm">
                {weekDays.map(day => (
                    <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-100 gap-px">
                <AnimatePresence mode="wait">
                    {days.map((day, idx) => {
                        const dayPosts = getPostsForDay(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <motion.div
                                key={day.toISOString()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.01 }}
                                className={cn(
                                    "min-h-[120px] bg-white p-3 flex flex-col gap-2 transition-all group overflow-hidden relative",
                                    !isCurrentMonth ? "bg-slate-50/30 text-slate-300" : "text-slate-700",
                                    isToday ? "bg-brand-50/20" : ""
                                )}
                            >
                                <div className="flex items-center justify-between mb-1 relative z-10">
                                    <span className={cn(
                                        "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-all",
                                        isToday 
                                            ? "bg-brand-600 text-white shadow-lg shadow-brand-200 scale-110" 
                                            : "text-slate-600 group-hover:bg-slate-50",
                                        !isCurrentMonth && "text-slate-300 pointer-events-none"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {dayPosts.length > 0 && isCurrentMonth && (
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                            {dayPosts.length}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5 overflow-y-auto max-h-[120px] scrollbar-hide relative z-10 pb-2">
                                    {dayPosts.map(post => (
                                        <button
                                            key={post.id}
                                            onClick={() => onSelectPost(post)}
                                            className="w-full text-left p-2 rounded-xl bg-white/60 hover:bg-white border border-slate-100 hover:border-brand-200/50 hover:shadow-md hover:shadow-slate-200/40 text-slate-600 text-xs transition-all flex flex-col gap-1 active:scale-[0.97]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                                    post.viralScore && post.viralScore > 80 ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-slate-300'
                                                )} />
                                                <span className="font-bold truncate text-[11px] tracking-tight">{post.params.topic}</span>
                                            </div>
                                            <p className="line-clamp-1 opacity-60 text-[10px] italic">
                                                {post.content.substring(0, 30)}...
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                
                                {isToday && (
                                    <div className="absolute top-0 right-0 p-1 opacity-20">
                                        <Zap className="w-12 h-12 text-brand-600 rotate-12" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CalendarView;
