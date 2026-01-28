
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { NICHES } from "../../data/niches";
import { 
    ArrowRight, 
    Sparkles, 
    TrendingUp, 
    Users, 
    Shield, 
    Code, 
    PenTool, 
    Zap,
    Layout,
    CheckCircle,
    Building2,
    Clock,
    Scan,
    Anchor
} from "lucide-react";
import { motion } from "framer-motion";
import { SEO_TOOLS_CONFIG } from "@/lib/data/seo-tools-config";

import { useUser } from "@/context/UserContext";
import { translations } from "@/translations";

const ToolsIndexPage: React.FC = () => {
  const { language } = useUser();
  const t = translations[language];

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

      {/* Featured Tools */}
      <section className="px-6 mb-12">
        <div className="max-w-6xl mx-auto">
             <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-brand-500" />
                <h2 className="text-2xl font-bold">{t.toolsPage.common.popularTools || "Herramientas Populares (Gratis)"}</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/tools/headline-generator" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-brand-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-brand-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-brand-50 rounded-xl text-brand-600">
                                <Zap className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.headlineGenerator.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.headlineGenerator.desc}</p>
                    </motion.div>
                </Link>
                <Link to="/tools/bio-generator" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.bioGenerator.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.bioGenerator.desc}</p>
                    </motion.div>
                </Link>
                <Link to="/tools/viral-calculator" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-purple-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.viralCalculator.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.viralCalculator.desc}</p>
                    </motion.div>
                </Link>
                <Link to="/tools/best-time-to-post" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-green-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.bestTime.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.bestTime.desc}</p>
                    </motion.div>
                </Link>
                <Link to="/tools/profile-auditor" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-amber-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-amber-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                <Scan className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.profileAuditor.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.profileAuditor.desc}</p>
                    </motion.div>
                </Link>

                {/* Second Row */}

                <Link to="/hooks" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-pink-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-pink-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
                                <Anchor className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-pink-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.hooks.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.hooks.desc}</p>
                    </motion.div>
                </Link>

                 <Link to="/carousel-studio" className="group">
                    <motion.div whileHover={{ y: -4 }} className="h-full bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-500/10 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                <Code className="w-6 h-6" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-2">{t.nav.items.carouselStudio.title}</h3>
                        <p className="text-sm text-slate-500">{t.nav.items.carouselStudio.desc}</p>
                    </motion.div>
                </Link>
             </div>
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
      {/* All Tools Grid (Programmatic SEO) */}
      <section className="py-20 max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 border-b border-slate-100 pb-4">
              {t.toolsPage.common.moreTools || "Más Herramientas por Industria"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SEO_TOOLS_CONFIG.map((tool) => (
                  <Link to={`/tools/${tool.slug}`} key={tool.slug} className="group">
                       <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-500/5 transition-all shadow-sm group-hover:-translate-y-1">
                          <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                  <tool.icon className="w-6 h-6" />
                              </div>
                              <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
                                  Free
                              </div>
                          </div>
                          <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                              {tool.title}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2">
                              {tool.description}
                          </p>
                      </div>
                  </Link>
              ))}
          </div>
      </section>

                {/* Comparisons Section */}
                <div className="mt-24 border-t border-slate-200 pt-16 mb-20">
                    <h2 className="text-xl font-bold text-slate-900 mb-8">Compare Kolink</h2>
                    <div className="flex flex-wrap gap-6">
                        <Link to="/vs/taplio" className="text-slate-500 hover:text-brand-600 font-medium transition-colors">
                            Kolink vs Taplio
                        </Link>
                        <Link to="/vs/supergrow" className="text-slate-500 hover:text-brand-600 font-medium transition-colors">
                            Kolink vs Supergrow
                        </Link>
                    </div>
                </div>
    </div>
  );
};

export default ToolsIndexPage;
