import React from 'react';
import { CarouselSlide, CarouselDesign } from '@/types/carousel';
import { AutoTypography } from './AutoTypography';
import { Quote, MessageCircle, Heart, Repeat, Share, CheckCircle, Terminal, ArrowRight, XCircle, User, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { InteractiveElement } from './InteractiveElement';

interface SlideRendererProps {
  slide: CarouselSlide;
  design: CarouselDesign;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  scale?: number;
  isActive?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = React.memo(({ 
  slide, 
  design, 
  author,
  scale = 1,
  isActive = false 
}) => {
  // Dimensions based on aspect ratio
  const dimensions = {
    '1:1': { w: 1080, h: 1080 },
    '4:5': { w: 1080, h: 1350 },
    '9:16': { w: 1080, h: 1920 },
  };
  
  const { w, h } = dimensions[design.aspectRatio] || dimensions['4:5'];
  const { primary, secondary, accent, background, text } = design.colorPalette;
  const { heading, body } = design.fonts;

  // Render content based on slide type & layout variant
  const renderContent = () => {
    // ----------------------------------------------------------------------
    // GLOBAL VARIANTS (Explicit Layout Choice)
    // ----------------------------------------------------------------------

    if (slide.layoutVariant === 'big-number') {
       return (
           <div className="flex flex-col h-full items-center justify-center p-16 text-center relative z-10 w-full overflow-hidden">
               <InteractiveElement elementId="title" slideId={slide.id} isActiveSlide={isActive}>
                 <div 
                    className="text-[14rem] font-black leading-none tracking-tighter mb-8 opacity-90" 
                    style={{ 
                        color: slide.elementOverrides?.['title']?.color || accent, 
                        fontFamily: heading,
                        fontSize: slide.elementOverrides?.['title']?.fontSize ? `${slide.elementOverrides['title'].fontSize}px` : undefined
                    }}
                 >
                    {slide.content.title}
                 </div>
               </InteractiveElement>

               <InteractiveElement elementId="subtitle" slideId={slide.id} isActiveSlide={isActive}>
                   <AutoTypography 
                      content={slide.content.subtitle || ""}
                      fontFamily={body}
                      baseSize={40}
                      className="mb-8 font-bold uppercase tracking-widest"
                      color={slide.elementOverrides?.['subtitle']?.color || primary}
                      overrideFontSize={slide.elementOverrides?.['subtitle']?.fontSize}
                   />
               </InteractiveElement>

               <InteractiveElement elementId="body" slideId={slide.id} isActiveSlide={isActive}>
                   <AutoTypography 
                      content={slide.content.body || ""}
                      fontFamily={body}
                      baseSize={32}
                      className="max-w-2xl mx-auto opacity-80"
                      color={slide.elementOverrides?.['body']?.color || text}
                      overrideFontSize={slide.elementOverrides?.['body']?.fontSize}
                   />
               </InteractiveElement>
           </div>
       );
    }

    if (slide.layoutVariant === 'quote') {
        return (
           <div className="flex flex-col h-full justify-center p-20 text-center relative z-10 w-full overflow-hidden">
               <Quote className="w-20 h-20 mx-auto mb-12 text-brand-500 opacity-20" style={{ color: accent }} />
               <InteractiveElement elementId="body" slideId={slide.id} isActiveSlide={isActive}>
                   <AutoTypography 
                       content={`"${slide.content.body || slide.content.title}"`}
                       fontFamily="Playfair Display"
                       baseSize={56}
                       className="italic leading-relaxed mb-12"
                       color={slide.elementOverrides?.['body']?.color || primary}
                       overrideFontSize={slide.elementOverrides?.['body']?.fontSize}
                   />
               </InteractiveElement>
               <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: accent }} />
               <InteractiveElement elementId="subtitle" slideId={slide.id} isActiveSlide={isActive}>
                   <AutoTypography 
                       content={slide.content.subtitle || "Author Name"}
                       fontFamily={body}
                       baseSize={24}
                       className="font-bold uppercase tracking-wider"
                       color={slide.elementOverrides?.['subtitle']?.color || text}
                       overrideFontSize={slide.elementOverrides?.['subtitle']?.fontSize}
                   />
               </InteractiveElement>
           </div>
        );
    }

    if (slide.layoutVariant === 'checklist') {
        const items = slide.content.body?.split('\n').filter(line => line.trim().length > 0) || [];
        return (
           <div className="flex flex-col h-full p-16 relative z-10 w-full overflow-hidden">
               <div className="mb-12">
                    <AutoTypography 
                        content={slide.content.title || ""}
                        fontFamily={heading}
                        baseSize={56}
                        color={primary}
                        className="font-bold leading-tight"
                    />
               </div>
               <div className="flex-1 space-y-6 flex flex-col justify-center">
                   {items.map((item, i) => (
                       <div key={i} className="flex items-start gap-4">
                           <div className="mt-1 flex-shrink-0">
                                <CheckCircle className="w-8 h-8" style={{ color: accent }} />
                           </div>
                           <AutoTypography 
                               content={item.replace(/^[-*•]\s*/, '')}
                               fontFamily={body}
                               baseSize={32}
                               color={text}
                           />
                       </div>
                   ))}
               </div>
           </div>
        );
    }

    if (slide.layoutVariant === 'comparison') {
        return (
           <div className="flex flex-col h-full relative z-10 w-full overflow-hidden">
               <div className="p-10 pb-6 text-center border-b border-slate-100/10">
                  <AutoTypography 
                      content={slide.content.title || "Don't do this, do this"}
                      fontFamily={heading}
                      baseSize={40}
                      color={primary}
                      className="font-bold"
                  />
               </div>
               <div className="flex-1 grid grid-cols-2 divide-x divide-slate-200/20">
                   {/* Left Side (Bad) */}
                   <div className="p-10 pt-12 flex flex-col items-center text-center bg-red-50/50">
                      <div className="mb-6 px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold uppercase tracking-widest">Mistake</div>
                      <XCircle className="w-16 h-16 text-red-500 mb-8" />
                      <AutoTypography 
                           content={slide.content.body?.split('VS')[0] || "Common mistake..."}
                           fontFamily={body}
                           baseSize={28}
                           color={text}
                      />
                   </div>
                   {/* Right Side (Good) */}
                   <div className="p-10 pt-12 flex flex-col items-center text-center bg-green-50/50">
                      <div className="mb-6 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-widest">Better Way</div>
                      <CheckCircle className="w-16 h-16 text-green-500 mb-8" />
                      <AutoTypography 
                           content={slide.content.body?.split('VS')[1] || slide.content.subtitle || "The solution..."}
                           fontFamily={body}
                           baseSize={28}
                           color={text}
                      />
                   </div>
               </div>
           </div>
        );
    }
    
    if (slide.layoutVariant === 'image-full' && slide.content.image_url) {
        return (
            <div className="absolute inset-0 z-10 overflow-hidden group">
                <img src={slide.content.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-16 text-white flex flex-col gap-6">
                    <AutoTypography 
                        content={slide.content.title || ""}
                        fontFamily={heading}
                        baseSize={56}
                        color="white"
                        className="font-bold leading-tight drop-shadow-md"
                    />
                    <div className="w-20 h-1 bg-white/50 rounded-full" style={{ backgroundColor: accent }} />
                    <AutoTypography 
                        content={slide.content.body || ""}
                        fontFamily={body}
                        baseSize={32}
                        color="white"
                        className="opacity-90 font-medium drop-shadow-sm"
                    />
                </div>
            </div>
        );
    }
    
    if (slide.layoutVariant === 'code') {
         return (
            <div className="flex flex-col h-full p-16 relative z-10 w-full overflow-hidden">
                <div className="mb-8">
                    <AutoTypography 
                        content={slide.content.title || "Code Example"}
                        fontFamily={heading}
                        baseSize={48}
                        color={primary}
                        className="font-bold"
                    />
                </div>
                <div className="flex-1 bg-[#1e1e1e] rounded-3xl p-10 shadow-2xl overflow-hidden font-mono text-left relative ring-4 ring-black/5">
                    <div className="absolute top-6 right-6 flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
                       <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
                       <div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
                    </div>
                    <div className="mt-8 h-full overflow-auto">
                        <AutoTypography 
                            content={slide.content.body || "// Code goes here"}
                            fontFamily="monospace"
                            baseSize={24}
                            color="#a9b7c6"
                            className="text-left w-full"
                            as="div"
                        />
                    </div>
                    <div className="absolute bottom-6 right-8 text-slate-500 text-sm flex items-center gap-2 bg-white/5 px-3 py-1 rounded-md">
                       <Terminal className="w-4 h-4" />
                       <span>typescript</span>
                    </div>
                </div>
            </div>
         );
    }

    // ----------------------------------------------------------------------
    // DEFAULT TYPE-BASED RENDERING
    // ----------------------------------------------------------------------
    switch (slide.type) {
      case 'intro':
        return (
          <div className="flex flex-col h-full justify-center p-20 text-center relative z-10 w-full overflow-hidden">
             {slide.content.subtitle && (
               <div className="mb-8">
                   <InteractiveElement elementId="subtitle" slideId={slide.id} isActiveSlide={isActive}>
                       <AutoTypography 
                         content={slide.content.subtitle}
                         fontFamily={body}
                         baseSize={28}
                         color={slide.elementOverrides?.['subtitle']?.color || secondary}
                         className="font-bold uppercase tracking-[0.25em]"
                         overrideFontSize={slide.elementOverrides?.['subtitle']?.fontSize}
                       />
                   </InteractiveElement>
               </div>
             )}
              <InteractiveElement elementId="title" slideId={slide.id} isActiveSlide={isActive}>
                 <AutoTypography 
                   content={slide.content.title || "Carousel Title"}
                   fontFamily={heading}
                   baseSize={84}
                   color={slide.elementOverrides?.['title']?.color || primary}
                   className="font-black leading-[1.1] mb-12 tracking-tight"
                   overrideFontSize={slide.elementOverrides?.['title']?.fontSize}
                 />
              </InteractiveElement>
             
             {slide.content.cta_text && (
                 <div className="mt-12 flex items-center justify-center gap-3 opacity-90 animate-pulse">
                      <span className="text-xl font-bold" style={{ color: text }}>{slide.content.cta_text}</span>
                      <ArrowRight className="w-5 h-5" style={{ color: text }} />
                 </div>
             )}
          </div>
        );
      
       case 'outro':
        return (
           <div className="flex flex-col h-full justify-center items-center p-20 text-center relative z-10 w-full overflow-hidden">
              <div className="mb-12 w-full">
                  <AutoTypography 
                     content={slide.content.title || "Thanks for reading!"}
                     fontFamily={heading}
                     baseSize={64}
                     color={primary}
                     className="font-bold"
                  />
              </div>
              
              <div 
                className="w-48 h-48 rounded-full mb-10 border-[6px] shadow-2xl overflow-hidden bg-slate-100 relative group"
                style={{ borderColor: accent }}
              >
                  {author.avatarUrl ? (
                      <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                          <User className="w-24 h-24" />
                      </div>
                  )}
              </div>
              
              <div className="mb-2">
                 <AutoTypography 
                    content={author.name}
                    fontFamily={heading}
                    baseSize={36}
                    color={text}
                    className="font-bold tracking-tight"
                 />
              </div>
              <div className="text-xl opacity-60 mb-12" style={{ fontFamily: body, color: text }}>{author.handle}</div>
              
              {slide.content.cta_text && (
                  <div className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold shadow-lg transform hover:scale-105 transition-transform" style={{ backgroundColor: primary }}>
                     {slide.content.cta_text}
                  </div>
              )}
           </div>
        );
      
       default: // 'content' (Default Layout)
          return (
             <div className="flex flex-col h-full p-20 relative z-10 w-full overflow-hidden">
                 <div className="mb-10 pb-10 border-b border-slate-100/10">
                     <InteractiveElement elementId="title" slideId={slide.id} isActiveSlide={isActive}>
                         <AutoTypography 
                             content={slide.content.title || ""}
                             fontFamily={heading}
                             baseSize={52}
                             color={slide.elementOverrides?.['title']?.color || primary}
                             className="font-bold leading-tight"
                             overrideFontSize={slide.elementOverrides?.['title']?.fontSize}
                         />
                     </InteractiveElement>
                 </div>
                 
                 {slide.content.image_url && (
                    <div className="w-full h-[350px] mb-10 rounded-2xl overflow-hidden shadow-lg bg-slate-100 flex-shrink-0">
                       <img src={slide.content.image_url} alt="Slide Visual" className="w-full h-full object-cover" />
                    </div>
                 )}
                 
                 <div className="flex-1 flex flex-col justify-center">
                      <InteractiveElement elementId="body" slideId={slide.id} isActiveSlide={isActive}>
                          <AutoTypography 
                              content={slide.content.body || ""}
                              fontFamily={body}
                              baseSize={36}
                              color={slide.elementOverrides?.['body']?.color || text}
                              className="font-medium leading-relaxed opacity-90"
                              overrideFontSize={slide.elementOverrides?.['body']?.fontSize}
                          />
                      </InteractiveElement>
                 </div>
                 
                 <div className="h-2 w-24 rounded-full mt-auto opacity-50" style={{ backgroundColor: accent }} />
             </div>
         );
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-white shadow-2xl transition-all duration-300",
        isActive ? "opacity-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]" : "opacity-90 hover:opacity-100 shadow-xl"
      )}
      style={{
        width: w,
        height: h,
        backgroundColor: background || design.background.value,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
        borderRadius: design.layout.cornerRadius === 'none' ? 0 : design.layout.cornerRadius === 'full' ? 0 : 32 
      }}
    >
      {/* Background Handling */}
      {slide.content.background_override ? (
         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.content.background_override})` }} />
      ) : (
         <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {design.background.patternType === 'dots' && (
                <div 
                   className="absolute inset-0" 
                   style={{ 
                      backgroundImage: `radial-gradient(${design.background.patternColor || '#000'} 1.5px, transparent 1.5px)`, 
                      backgroundSize: '32px 32px',
                      opacity: design.background.patternOpacity 
                   }} 
                />
            )}
            {design.background.patternType === 'grid' && (
                <div 
                   className="absolute inset-0" 
                   style={{ 
                      backgroundImage: `linear-gradient(${design.background.patternColor || '#000'} 1px, transparent 1px), linear-gradient(90deg, ${design.background.patternColor || '#000'} 1px, transparent 1px)`, 
                      backgroundSize: '64px 64px',
                      opacity: design.background.patternOpacity 
                   }} 
                />
            )}
         </div>
      )}
      
      {/* Dark Overlay for legibility if background image is present */}
      {slide.content.background_override && (
          <div className="absolute inset-0 bg-black/40" />
      )}

      {renderContent()}

      {/* Creator Profile Header/Footer */}
      {design.layout.showCreatorProfile && (
         <div className="absolute top-10 left-12 flex items-center gap-3 z-30 opacity-60 mix-blend-multiply">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
               {author.avatarUrl ? (
                 <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                    {author.name.charAt(0)}
                 </div>
               )}
            </div>
            <div className="flex flex-col">
               <span className="font-bold text-sm leading-none" style={{ color: text, fontFamily: heading }}>{author.handle}</span>
            </div>
         </div>
      )}

      {/* Page Number */}
      {design.layout.showSteppers && (
         <div className="absolute bottom-10 right-10 text-xl font-bold opacity-30 z-30" style={{ color: text, fontFamily: heading }}>
             <span className="tabular-nums">00</span>
         </div>
      )}

      {/* Swipe Indicator (only for Intro) */}
      {design.layout.showSwipeIndicator && slide.type === 'intro' && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full z-30 border border-black/5 animate-bounce">
              <span className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: text }}>Swipe</span>
              <ArrowRight className="w-3 h-3 opacity-60" style={{ color: text }} />
          </div>
      )}
    </div>
  );
});

SlideRenderer.displayName = 'SlideRenderer';
