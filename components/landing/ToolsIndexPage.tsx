
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { NICHES } from "../../data/niches";
import { ArrowRight, Sparkles, TrendingUp, Users, Shield, Code, PenTool } from "lucide-react";
import { motion } from "framer-motion";

const ToolsIndexPage: React.FC = () => {
  // Group niches manually for better UX (or you could add a 'category' field to NicheData later)
  const categories = [
    {
      title: "Negocios & Consultoría",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      slugs: ["consultores-estrategicos", "vendedores-b2b", "coaches-negocios", "fundadores-saas", "ecommerce-owners"]
    },
    {
      title: "Salud & Bienestar",
      icon: <Users className="w-5 h-5 text-green-500" />,
      slugs: ["doctores-y-salud", "psicologos-terapeutas", "coaches-fitness", "fisioterapeutas"]
    },
    {
      title: "Tecnología & Ciberseguridad",
      icon: <Code className="w-5 h-5 text-purple-500" />,
      slugs: ["ingenieros-software", "ciberseguridad-ciso", "data-scientists", "desarrolladores-blockchain", "consultores-sap"]
    },
    {
      title: "Creativos & Marketing",
      icon: <PenTool className="w-5 h-5 text-pink-500" />,
      slugs: ["especialistas-marketing", "copywriters-creativos", "ux-ui-designers", "arquitectos-u-disenio", "organizadores-eventos"]
    },
    {
      title: "Servicios Profesionales",
      icon: <Shield className="w-5 h-5 text-amber-500" />,
      slugs: ["abogados-y-legal", "financieros-y-contadores", "agentes-inmobiliarios", "agentes-seguros", "directores-rrhh", "recruiters-hr", "project-managers", "educadores-formadores", "logistica-supply-chain"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100">
      <Helmet>
        <title>Herramientas de IA para LinkedIn por Sector | Kolink</title>
        <meta name="description" content="Directorio de generadores de contenido LinkedIn para 30+ profesiones. Encuentra la herramienta de IA específica para tu nicho." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Directorio de Herramientas IA</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Tu Experto de LinkedIn, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Entrenado para tu Profesión</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            No uses prompts genéricos. Hemos ajustado nuestros modelos de IA para 30+ industrias específicas. Encuentra tu sector abajo.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-6xl mx-auto space-y-16">
          {categories.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
                {category.icon}
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.slugs.map(slug => {
                  const niche = NICHES.find(n => n.slug === slug);
                  if (!niche) return null;
                  
                  return (
                    <Link to={`/tools/${slug}`} key={slug} className="group">
                      <motion.div 
                        whileHover={{ y: -4 }}
                        className="h-full glass-premium rounded-2xl p-6 hover:shadow-soft-glow transition-all duration-300 group relative"
                      >
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight">
                            {niche.title}
                          </h3>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium relative z-10">
                          {niche.metaDescription}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-2 relative z-10">
                          {niche.keywords.slice(0, 2).map(kw => (
                            <span key={kw} className="text-[10px] px-2.5 py-1 bg-white/50 border border-slate-100/50 text-slate-600 rounded-lg font-bold uppercase tracking-wider">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ToolsIndexPage;
