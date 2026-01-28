import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CarouselSlide, CarouselDesign } from '@/types/carousel';
import { SlideRenderer } from './SlideRenderer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Repeat, Send, Globe, MoreHorizontal, X } from "lucide-react";
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';
import { translations } from '@/translations';

interface LinkedInPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: CarouselSlide[];
  design: CarouselDesign;
  author: { name: string; handle: string; avatarUrl?: string };
}

export const LinkedInPreviewModal: React.FC<LinkedInPreviewModalProps> = ({
  isOpen,
  onClose,
  slides,
  design,
  author
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const { user, profile, language } = useUser();
  const t = translations[language].carouselStudio.canvas; // Reusing canvas translations or add specific ones

  // Mock data falling back to user profile if available
  const displayName = author?.name || profile?.full_name || 'User Name';
  const displayHandle = author?.handle || (profile?.full_name?.toLowerCase().replace(/\s/g, '')) || 'username';
  const displayAvatar = author?.avatarUrl || profile?.avatar_url || '';
  const displayHeadline = profile?.headline || 'Creator at Kolink • AI Enthusiast';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 bg-slate-100 overflow-hidden flex flex-col">
        {/* Header - Preview Controls */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
             <div className="font-semibold text-slate-700">LinkedIn Preview</div>
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    onClick={() => setDevice('mobile')}
                    className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-all",
                        device === 'mobile' ? "bg-white shadow text-brand-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Mobile
                </button>
                <button
                    onClick={() => setDevice('desktop')}
                    className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-all",
                        device === 'desktop' ? "bg-white shadow text-brand-600" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Desktop
                </button>
             </div>
             <Button variant="ghost" size="icon" onClick={onClose}>
                 <X className="w-5 h-5 text-slate-500" />
             </Button>
        </div>

        {/* Scrollable Feed Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start custom-scrollbar">
            {/* The "Phone" or "Browser" Frame */}
            <div 
                className={cn(
                    "bg-white shadow-xl border border-slate-200 overflow-hidden transition-all duration-300",
                    device === 'mobile' ? "w-[375px] rounded-lg" : "w-[560px] rounded-lg"
                )}
            >
                {/* LinkedIn Post Header */}
                <div className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <Avatar className="w-12 h-12 rounded-full border border-slate-100">
                                <AvatarImage src={displayAvatar} />
                                <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-slate-900 text-sm">{displayName}</span>
                                    <span className="text-slate-500 text-xs">• 1st</span>
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1">{displayHeadline}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <span>2h</span>
                                    <span>•</span>
                                    <Globe className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </div>
                    {/* Post Text */}
                    <div className="mt-3 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                        Here is a preview of my latest carousel created with Kolink AI. 🚀
                        {"\n\n"}
                        The design is clean, the hooks are optimized, and it's ready to go viral.
                        {"\n\n"}
                        #LinkedInGrowth #PersonalBranding #AI
                    </div>
                </div>

                {/* Carousel Viewer Area */}
                <div className="bg-slate-50 w-full overflow-hidden relative group">
                    {/* Native Horizontal Scroll Container mimicking LinkedIn PDF viewer */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        {slides.map((slide, i) => (
                             <div 
                                key={slide.id} 
                                className="snap-center shrink-0" 
                                style={{ 
                                    width: '100%', 
                                    aspectRatio: design.aspectRatio === '1:1' ? '1/1' : design.aspectRatio === '16:9' ? '16/9' : '4/5' 
                                }}
                             >
                                 <SlideRenderer 
                                    slide={slide} 
                                    design={design} 
                                    author={author} 
                                    isActive={false} // Static view
                                 />
                             </div>
                        ))}
                    </div>
                    {/* Navigation Arrows Overlay (Desktop style) */}
                    <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <X className="w-4 h-4 rotate-45" /> {/* Placeholder arrow for visual */}
                    </div>
                     <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <X className="w-4 h-4 rotate-45" /> 
                    </div>
                    
                    {/* Page count overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                        1 / {slides.length}
                    </div>
                </div>

                 {/* Action Bar */}
                 <div className="px-4 py-2 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <div className="bg-blue-500 p-1 rounded-full"><ThumbsUp className="w-2 h-2 text-white fill-current" /></div>
                        <span className="text-xs text-slate-500 hover:text-blue-500 hover:underline cursor-pointer">124</span>
                    </div>
                    <div className="text-xs text-slate-500 hover:underline cursor-pointer">
                        45 comments • 12 reposts
                    </div>
                 </div>

                 <div className="px-2 py-1 border-t border-slate-100 flex justify-between">
                     <Button variant="ghost" className="flex-1 gap-2 text-slate-600 font-semibold text-sm hover:bg-slate-100">
                         <ThumbsUp className="w-5 h-5" /> Like
                     </Button>
                     <Button variant="ghost" className="flex-1 gap-2 text-slate-600 font-semibold text-sm hover:bg-slate-100">
                         <MessageSquare className="w-5 h-5" /> Comment
                     </Button>
                     <Button variant="ghost" className="flex-1 gap-2 text-slate-600 font-semibold text-sm hover:bg-slate-100">
                         <Repeat className="w-5 h-5" /> Repost
                     </Button>
                     <Button variant="ghost" className="flex-1 gap-2 text-slate-600 font-semibold text-sm hover:bg-slate-100">
                         <Send className="w-5 h-5" /> Send
                     </Button>
                 </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
