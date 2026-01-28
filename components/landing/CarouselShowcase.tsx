import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const templates = [
  {
    id: "viral-hook",
    title: "Viral Hook Framework",
    description: "The exact structure used by top creators to stop the scroll.",
    score: 98,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", 
    color: "bg-purple-500",
    tags: ["Growth", "Personal Brand"]
  },
  {
    id: "checklist-manifesto", 
    title: "Checklist Manifesto",
    description: "Turn any process into a high-value, saveable checklist.",
    score: 95,
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000&auto=format&fit=crop",
    color: "bg-blue-500",
    tags: ["Education", "SaaS"]
  },
  {
    id: "contrarian-take",
    title: "The Contrarian Take",
    description: "Challenge status quo to spark debate and massive engagement.",
    score: 92,
    image: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1000&auto=format&fit=crop",
    color: "bg-orange-500",
    tags: ["Opinion", "Thought Leadership"]
  }
];

export const CarouselShowcase = () => {
    const navigate = useNavigate();
    const { language } = useUser();
    
    // Simple translation logic just for this component for now
    const t = language === 'es' ? {
        badge: "INSPIRACIÓN DIARIA",
        title: "Carruseles del Día",
        subtitle: "Clona estas plantillas de alto rendimiento y hazlas tuyas en segundos.",
        score: "Puntaje Viral",
        clone: "Clonar Plantilla",
        viewAll: "Ver Biblioteca Completa"
    } : {
        badge: "DAILY INSPIRATION",
        title: "Carousels of the Day",
        subtitle: "Clone these high-performing templates and make them yours in seconds.",
        score: "Viral Score",
        clone: "Clone Template",
        viewAll: "View Final Library"
    };

    const handleClone = (templateId: string) => {
        navigate(`/studio?template=${templateId}`);
    };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -left-40 top-40 w-80 h-80 bg-brand-50 rounded-full blur-3xl opacity-50" />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              {t.badge}
           </div>
           <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
             {t.title}
           </h2>
           <p className="text-lg text-slate-600 leading-relaxed">
             {t.subtitle}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {templates.map((template, index) => (
                <motion.div 
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 overflow-hidden flex flex-col"
                >
                    {/* Image Preview Area */}
                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                        <div className={`absolute inset-0 opacity-10 ${template.color}`} />
                        {/* Placeholder for actual carousel preview - using generic image for now */}
                        <img 
                            src={template.image} 
                            alt={template.title}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Floating Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-100 shadow-sm flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-slate-800">{template.score}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-medium">{t.score}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex gap-2 mb-3">
                            {template.tags.map(tag => (
                                <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                            {template.title}
                        </h3>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                            {template.description}
                        </p>
                        
                        <div className="mt-auto">
                             <Button 
                                onClick={() => handleClone(template.id)}
                                className="w-full bg-white text-slate-700 border border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all group/btn"
                            >
                                <LayoutTemplate className="w-4 h-4 mr-2 text-slate-400 group-hover/btn:text-brand-500" />
                                {t.clone}
                             </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
