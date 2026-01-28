
import React from 'react';
import { motion } from 'framer-motion';
import { 
    Layout, Type, Image as ImageIcon, Smile, 
    MoreHorizontal, Send, Wand2, ChevronLeft, 
    Battery, Signal, Wifi, Smartphone, MessageSquare
} from 'lucide-react';

export const PostEditorMockup: React.FC = () => {
    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none" />

            {/* Main Window Interface */}
            <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200/60 flex overflow-hidden aspect-[16/10] sm:aspect-[16/9]"
            >
                {/* Sidebar (Tools) */}
                <div className="w-16 sm:w-20 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-6 gap-6 hidden sm:flex">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-600 flex items-center justify-center transition-all cursor-pointer">
                            <Layout className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-600 flex items-center justify-center transition-all cursor-pointer">
                            <Type className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-600 flex items-center justify-center transition-all cursor-pointer">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-600 flex items-center justify-center transition-all cursor-pointer">
                            <Smile className="w-5 h-5" />
                        </div>
                    </div>
                     <div className="w-8 h-8 rounded-full bg-slate-200" />
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Toolbar */}
                    <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-white">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-slate-400">Draft /</span>
                             <span className="text-sm font-bold text-slate-900">Viral Post #3</span>
                        </div>
                         <div className="flex items-center gap-3">
                             <div className="text-xs font-bold text-slate-400 px-3 py-1.5 bg-slate-50 rounded-lg">Draft</div>
                             <button className="bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-brand-500/20">
                                <Wand2 className="w-3 h-3" />
                                Improve
                             </button>
                         </div>
                    </div>

                    {/* Text Input */}
                    <div className="flex-1 p-6 sm:p-8 bg-white overflow-hidden relative group cursor-text">
                        <div className="space-y-4 max-w-2xl">
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight"
                             >
                                 La mayoría de la gente usa LinkedIn mal.
                             </motion.div>
                             <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="text-base sm:text-lg text-slate-600 space-y-4"
                             >
                                <p>Creen que se trata de impresionar a su jefe.</p>
                                <p>Pero la realidad es diferente:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-brand-500">
                                    <li>Se trata de construir autoridad.</li>
                                    <li>Se trata de atraer oportunidades.</li>
                                    <li>Se trata de ser dueño de tu audiencia.</li>
                                </ul>
                                <p className="font-medium text-brand-600">Aquí está mi framework de 3 pasos para cambiar esto 👇</p>
                             </motion.div>
                        </div>
                        {/* Cursor */}
                        <motion.div 
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="absolute mt-1 ml-0.5 w-[2px] h-5 bg-brand-600 inline-block"
                        />
                    </div>
                </div>

                {/* Preview Area (Right) */}
                <div className="w-[300px] border-l border-slate-100 bg-slate-50 hidden md:flex flex-col items-center py-8">
                     <div className="w-[260px] h-[500px] bg-white rounded-[2rem] border-[6px] border-slate-900 shadow-xl overflow-hidden relative transform scale-95 origin-top">
                        {/* Phone Header */}
                         <div className="bg-slate-900 h-6 w-full absolute top-0 flex justify-between px-4 items-center z-10">
                            <div className="text-[10px] text-white font-medium">9:41</div>
                            <div className="flex gap-1">
                                <Signal className="w-3 h-3 text-white" />
                                <Wifi className="w-3 h-3 text-white" />
                                <Battery className="w-3 h-3 text-white" />
                            </div>
                         </div>
                         
                         {/* LinkedIn App Header */}
                         <div className="mt-6 h-12 bg-white border-b border-slate-100 flex items-center px-3 gap-3">
                             <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold overflow-hidden">
                                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 bg-slate-100 h-8 rounded-md flex items-center px-3 text-xs text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
                                 Buscar
                             </div>
                             <MessageSquare className="w-5 h-5 text-slate-500" />
                         </div>

                         {/* Feed Post */}
                         <div className="p-3">
                             <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                                 {/* Post Header */}
                                 <div className="flex gap-2 mb-2">
                                     <div className="w-8 h-8 rounded-full bg-brand-100 overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                         <div className="text-xs font-bold text-slate-900">User Name</div>
                                         <div className="text-[10px] text-slate-500">Founder @ Tech • 2h • 🌐</div>
                                     </div>
                                 </div>
                                 {/* Post Body (Miniature) */}
                                 <div className="text-[11px] leading-relaxed text-slate-800 space-y-1.5">
                                      <p className="font-medium">La mayoría de la gente usa LinkedIn mal.</p>
                                      <p>Creen que se trata de impresionar...</p>
                                      <p className="text-slate-400 text-[10px] pt-1 cursor-pointer">...ver más</p>
                                 </div>
                                 {/* Post Actions */}
                                 <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between">
                                     <div className="w-4 h-4 bg-slate-100 rounded-full" />
                                     <div className="w-4 h-4 bg-slate-100 rounded-full" />
                                     <div className="w-4 h-4 bg-slate-100 rounded-full" />
                                     <div className="w-4 h-4 bg-slate-100 rounded-full" />
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </motion.div>
        </div>
    );
};
