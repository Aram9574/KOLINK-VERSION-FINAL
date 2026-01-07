import React from 'react';
import { CarouselSlide, CarouselDesign } from '../../types/carousel';

import { Quote, MessageCircle, Heart, Repeat, Share, CheckCircle, Terminal, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideRendererProps {
  slide: CarouselSlide;
  design: CarouselDesign;
  scale?: number;
  isActive?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  design, 
  scale = 1,
  isActive = false 
}) => {
  // Dimensions based on aspect ratio
  const dimensions = {
    '1:1': { w: 1080, h: 1080 },
    '4:5': { w: 1080, h: 1350 },
    '9:16': { w: 1080, h: 1920 },
  };
  
  const { w, h } = dimensions[design.aspectRatio];
  const { primary, secondary, accent, background, text } = design.colorPalette;
  const { heading, body } = design.fonts;

  // Helper to parse **text** as highlighted span
  const parseText = (text: string | undefined, font: string) => {
      if (!text) return null;
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return (
          <span style={{ fontFamily: font }}>
              {parts.map((part, index) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                          <span key={index} style={{ color: accent }}>
                              {part.slice(2, -2)}
                          </span>
                      );
                  }
                  return part;
              })}
          </span>
      );
  };

  // Render content based on slide type
  const renderContent = () => {
    // ----------------------------------------------------------------------
    // GLOBAL VARIANTS (Override Type-Specific Layouts)
    // ----------------------------------------------------------------------

    // 4. Variant: Tweet
    if (slide.content.variant === 'tweet') {
      return (
         <div className="flex flex-col h-full justify-center p-12 relative z-10">
             <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                 <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                         {/* Avatar Placeholder */}
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User`} alt="avatar" />
                     </div>
                     <div>
                         <div className="font-bold text-slate-900">User Name</div>
                         <div className="text-slate-500 text-sm">@username</div>
                     </div>
                 </div>
                 <div className="text-lg text-slate-800 leading-relaxed mb-4 font-normal" style={{ fontFamily: body }}>
                     {parseText(slide.content.body || slide.content.title, body)}
                 </div>
                 <div className="text-slate-400 text-sm mb-4">10:42 AM · {new Date().toLocaleDateString()}</div>
                 <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-slate-400">
                       <div className="flex gap-1"><MessageCircle className="w-4 h-4"/> 24</div>
                       <div className="flex gap-1"><Repeat className="w-4 h-4"/> 5</div>
                       <div className="flex gap-1"><Heart className="w-4 h-4"/> 112</div>
                       <div className="flex gap-1"><Share className="w-4 h-4"/></div>
                 </div>
             </div>
         </div>
      );
    }
    
    // 5. Variant: Quote
    if (slide.content.variant === 'quote') {
      return (
         <div className="flex flex-col h-full justify-center p-20 text-center relative z-10">
             <Quote className="w-16 h-16 mx-auto mb-8 text-brand-500 opacity-80" />
             <h2 className="text-4xl font-serif italic leading-relaxed mb-8" style={{ color: primary, fontFamily: 'Playfair Display' }}>
                 "{parseText(slide.content.body || slide.content.title, 'Playfair Display')}"
             </h2>
             <div className="w-16 h-1 mx-auto bg-brand-500 mb-4" />
             <p className="text-xl font-bold uppercase tracking-wider" style={{ color: text }}>
                 {slide.content.subtitle || "Author Name"}
             </p>
         </div>
      );
    }

    // 6. Variant: Image Full
    if (slide.content.variant === 'image-full' && slide.content.image_url) {
       return (
           <div className="absolute inset-0 z-10">
               <img src={slide.content.image_url} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                   <h2 className="text-4xl font-bold mb-4">{parseText(slide.content.title, heading)}</h2>
                   <p className="text-xl opacity-90">{parseText(slide.content.body, body)}</p>
               </div>
           </div>
       );
    }

    // 7. Variant: Big Number / Statistic
    if (slide.content.variant === 'big-number') {
       return (
           <div className="flex flex-col h-full items-center justify-center p-16 text-center relative z-10">
               <div className="text-[12rem] font-black leading-none tracking-tighter mb-4" style={{ color: accent, fontFamily: heading }}>
                  {slide.content.title}
               </div>
               <h3 className="text-4xl font-bold uppercase tracking-widest mb-8" style={{ color: primary, fontFamily: body }}>
                  {parseText(slide.content.subtitle, body)}
               </h3>
               <p className="text-2xl opacity-80 max-w-2xl mx-auto" style={{ color: text, fontFamily: body }}>
                  {parseText(slide.content.body, body)}
               </p>
           </div>
       );
    }

    // 8. Variant: Checklist
    if (slide.content.variant === 'checklist') {
        const items = slide.content.body?.split('\n').filter(line => line.trim().length > 0) || [];
        return (
           <div className="flex flex-col h-full p-16 relative z-10">
               <h2 className="text-5xl font-bold mb-12" style={{ color: primary, fontFamily: heading }}>
                   {parseText(slide.content.title, heading)}
               </h2>
               <div className="flex-1 space-y-6">
                   {items.map((item, i) => (
                       <div key={i} className="flex items-start gap-4">
                           <CheckCircle className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: accent }} />
                           <p className="text-3xl font-medium" style={{ color: text, fontFamily: body }}>
                               {parseText(item, body)}
                           </p>
                       </div>
                   ))}
               </div>
           </div>
        );
    }

    // 9. Variant: Code Snippet
    if (slide.content.variant === 'code') {
        return (
           <div className="flex flex-col h-full p-16 relative z-10">
               <h2 className="text-4xl font-bold mb-8" style={{ color: primary, fontFamily: heading }}>
                   {parseText(slide.content.title, heading)}
               </h2>
               <div className="flex-1 bg-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden font-mono text-left relative group">
                   <div className="absolute top-4 right-4 flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"/>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                      <div className="w-3 h-3 rounded-full bg-green-500"/>
                   </div>
                   <pre className="text-green-400 text-xl leading-relaxed whitespace-pre-wrap mt-8">
                       <code>{slide.content.body}</code>
                   </pre>
                   <div className="absolute bottom-4 right-4 text-slate-500 text-sm flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>bash</span>
                   </div>
               </div>
           </div>
        );
    }

    // 10. Variant: Comparison (A vs B)
    if (slide.content.variant === 'comparison') {
        return (
           <div className="flex flex-col h-full relative z-10">
               <div className="p-10 pb-4 text-center">
                  <h2 className="text-4xl font-bold" style={{ color: primary, fontFamily: heading }}>
                      {parseText(slide.content.title, heading)}
                  </h2>
               </div>
               <div className="flex-1 grid grid-cols-2 divide-x divide-slate-200">
                   {/* Left Side */}
                   <div className="p-10 pt-4 flex flex-col items-center text-center bg-green-50/50">
                      <div className="mb-4 text-2xl font-bold text-green-700 uppercase tracking-wider">DO THIS</div>
                      <CheckCircle className="w-12 h-12 text-green-500 mb-6" />
                      <p className="text-2xl font-medium whitespace-pre-wrap" style={{ color: text, fontFamily: body }}>
                           {parseText(slide.content.body, body)}
                      </p>
                   </div>
                   {/* Right Side */}
                   <div className="p-10 pt-4 flex flex-col items-center text-center bg-red-50/50">
                      <div className="mb-4 text-2xl font-bold text-red-700 uppercase tracking-wider">NOT THIS</div>
                      <XCircle className="w-12 h-12 text-red-500 mb-6" />
                      <p className="text-2xl font-medium whitespace-pre-wrap" style={{ color: text, fontFamily: body }}>
                           {parseText(slide.content.subtitle || "Second option goes here...", body)}
                      </p>
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
          <div className="flex flex-col h-full justify-center p-20 text-center relative z-10">
            {slide.content.subtitle && (
              <h3 
                className="text-2xl font-bold uppercase tracking-widest mb-6"
                style={{ color: secondary, fontFamily: body }}
              >
                {parseText(slide.content.subtitle, body)}
              </h3>
            )}
            <h1 
              className="text-7xl font-extrabold leading-tight mb-8"
              style={{ color: primary, fontFamily: heading }}
            >
              {parseText(slide.content.title, heading)}
            </h1>
            {slide.content.cta_text && (
                <div className="mt-12 flex items-center justify-center gap-2 text-2xl font-bold" style={{ color: text }}>
                     {parseText(slide.content.cta_text, body)} 
                     <span className="text-3xl">→</span>
                </div>
            )}
          </div>
        );
      
       case 'outro':
        return (
           <div className="flex flex-col h-full justify-center items-center p-20 text-center relative z-10">
              <h2 className="text-6xl font-bold mb-12" style={{ color: primary, fontFamily: heading }}>
                 {parseText(slide.content.title, heading)}
              </h2>
              <div 
                className="w-32 h-32 rounded-full mb-8 border-4 shadow-xl overflow-hidden"
                style={{ borderColor: accent }}
              >
                  {/* Placeholder Avatar */}
                  <div className="w-full h-full bg-slate-200" /> 
              </div>
              <p className="text-3xl font-medium" style={{ color: text, fontFamily: body }}>
                 {parseText(slide.content.cta_text, body)}
              </p>
           </div>
        );
      
       default: // 'content' (Default Layout)
          return (
             <div className="flex flex-col h-full p-20 relative z-10">
                 <h2 className="text-5xl font-bold mb-12" style={{ color: primary, fontFamily: heading }}>
                     {parseText(slide.content.title, heading)}
                 </h2>
                 {slide.content.image_url && (
                    <div className="w-full h-64 mb-8 rounded-2xl overflow-hidden shadow-sm bg-slate-100 flex-shrink-0">
                       <img src={slide.content.image_url} alt="Slide Visual" className="w-full h-full object-cover" />
                    </div>
                 )}
                 <div className="flex-1">
                     <p className="text-3xl leading-relaxed whitespace-pre-wrap" style={{ color: text, fontFamily: body }}>
                         {parseText(slide.content.body, body)}
                     </p>
                 </div>
                 <div className="h-2 w-24 rounded-full mt-auto" style={{ backgroundColor: accent }} />
             </div>
         );
    }
  };

  return (
    <div 
      className={`relative overflow-hidden shadow-2xl transition-all duration-300 ${isActive ? 'ring-4 ring-blue-500/50 scale-[1.02]' : 'opacity-90 hover:opacity-100'}`}
      style={{
        width: w,
        height: h,
        backgroundColor: background || design.background.value,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: design.layout.cornerRadius === 'none' ? 0 : 32 // 32px is roughly 'md' for this canvas size
      }}
    >
      {/* Background Handling */}
      {slide.content.background_override ? (
         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.content.background_override})` }} />
      ) : (
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
         />
      )}
      
      {/* Dark Overlay for legibility if background image is present */}
      {slide.content.background_override && (
          <div className="absolute inset-0 bg-black/40" />
      )}

      {renderContent()}

      {/* Footer / Page Number */}
      {design.layout.showSteppers && (
         <div className="absolute bottom-8 right-8 text-2xl font-bold opacity-50" style={{ color: text }}>
            {/* Logic for page number would need index pass-through */}
         </div>
      )}
    </div>
  );
};
