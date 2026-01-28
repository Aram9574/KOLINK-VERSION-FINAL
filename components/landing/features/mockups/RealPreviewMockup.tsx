
import React from 'react';
import { motion } from 'framer-motion';
import { Signal, Wifi, Battery, MoreHorizontal, ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react';

export const RealPreviewMockup: React.FC = () => {
    return (
        <div className="w-full h-full min-h-[400px] bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="w-[280px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative"
            >
                {/* Status Bar */}
                <div className="bg-slate-900 h-7 w-full flex justify-between px-5 items-center z-10">
                    <div className="text-[10px] text-white font-medium">9:41</div>
                    <div className="flex gap-1.5">
                        <Signal className="w-3 h-3 text-white" />
                        <Wifi className="w-3 h-3 text-white" />
                        <Battery className="w-3 h-3 text-white" />
                    </div>
                </div>

                {/* App Content */}
                <div className="bg-slate-100 h-full pt-2 pb-8">
                    <div className="bg-white p-4 mb-2">
                        {/* User Info */}
                        <div className="flex gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                AR
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                    Alex Rivera
                                    <span className="text-slate-400 font-normal">• 1st</span>
                                </div>
                                <div className="text-[10px] text-slate-500 line-clamp-1">Founder @ Kolink • SaaS Growth Expert</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    2h • <span className="bg-slate-200 text-slate-600 rounded px-1 py-[0.5px] text-[8px] font-bold">Modificado</span>
                                </div>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="text-sm text-slate-900 leading-relaxed font-normal mb-2 space-y-2">
                            <p>El "Bloqueo del Escritor" es una mentira.</p>
                            <p>No te faltan ideas.</p>
                            <p className="font-semibold">Te faltan sistemas.</p>
                            <p>Cuando confías solo en la "inspiración", eres un amateur. Los profesionales tienen un proceso.</p>
                            <p className="text-blue-600 font-medium cursor-pointer">...ver más</p>
                        </div>

                        {/* Image/Media Placeholder */}
                        <div className="w-full aspect-video bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-center mb-3">
                            <span className="text-indigo-400 text-xs font-medium">Post Image / Carousel</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 mb-1">
                            <div className="flex items-center gap-1">
                                <div className="flex -space-x-1">
                                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[8px]">👍</div>
                                    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[8px]">❤️</div>
                                </div>
                                <span>148</span>
                            </div>
                            <div className="flex gap-2">
                                <span>42 comments</span>
                                <span>12 reposts</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between px-2 pt-2 border-t border-slate-100">
                            <div className="flex flex-col items-center gap-0.5 text-slate-500">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-[9px] font-medium">Like</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 text-slate-500">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-[9px] font-medium">Comment</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 text-slate-500">
                                <Share2 className="w-4 h-4" />
                                <span className="text-[9px] font-medium">Repost</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 text-slate-500">
                                <Send className="w-4 h-4" />
                                <span className="text-[9px] font-medium">Send</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
