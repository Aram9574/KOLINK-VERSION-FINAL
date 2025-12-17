import React, { useState, useRef } from 'react';
import { 
  Layout, 
  BookOpen, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Download, 
  Share2,
  ExternalLink,
  Target,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { AuditResult } from '../../../types';
import confetti from 'canvas-confetti';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

interface AuditResultsProps {
  data: AuditResult;
}

// Reuseable Components for Cleaner Code
const ScoreBadge = ({ score }: { score: number }) => {
    let color = 'bg-red-100 text-red-700 border-red-200';
    if (score >= 80) color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    else if (score >= 50) color = 'bg-amber-100 text-amber-700 border-amber-200';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
            {score}/100
        </span>
    );
};

const SectionCard = ({ title, icon: Icon, children, className = '' }: any) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-slate-500" />}
                    {title}
                </h3>
            </div>
        )}
        <div className="p-6">
            {children}
        </div>
    </div>
);

const AdviceAccordion = ({ title, children, defaultOpen = false }: any) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-3 bg-slate-50 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
            >
                <span className="font-medium text-slate-700 text-sm">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {isOpen && <div className="p-5 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
};

// [Smart Actions Helper]
const getTaskAction = (task: any) => {
    if (task.text.includes("URL")) {
        return (
            <a href="https://www.linkedin.com/in/" target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline px-3 py-1 bg-brand-50 rounded-lg">
               Ir a LinkedIn →
            </a>
        );
    }
    if (task.id.startsWith('f1') || task.id.startsWith('n1')) {
         return (
             <button className="ml-auto text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 bg-transparent rounded-lg transition-colors border border-purple-200">
                 Copiar Propuesta
             </button>
         );
    }
    return null;
};

const AuditResults: React.FC<AuditResultsProps> = ({ data }) => {
  const { language } = useUser();
  const { perfil_resumen, pilares, quick_wins } = data;
  const [activeTab, setActiveTab] = useState<'overview' | 'pilar1' | 'pilar2' | 'pilar3' | 'checklist'>('overview');
  
  // Initialize from LocalStorage or empty
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`audit_checklist_${perfil_resumen.nombre}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    } catch (e) {
        return [];
    }
  });

  // Effect: Save to LocalStorage
  React.useEffect(() => {
    localStorage.setItem(`audit_checklist_${perfil_resumen.nombre}`, JSON.stringify(completedTasks));
  }, [completedTasks, perfil_resumen.nombre]);

  // Generate all tasks first to count them
  const allTasks = [
      // Fundamento
      { id: 'f1', category: 'Fundamento', text: 'Actualizar Titular (Headline)', subtext: 'Implementa la fórmula: Rol | Especialidad | Valor', impact: 'High' },
      { id: 'f2', category: 'Fundamento', text: 'Revisar Foto y Banner', subtext: pilares.pilar_1_fundamento.foto_banner_check, impact: 'Medium' },
      { id: 'f3', category: 'Fundamento', text: 'Personalizar URL de LinkedIn', subtext: 'Asegura que tu URL sea limpia (linkedin.com/in/tu-nombre)', impact: 'Medium' },
      // Narrativa
      { id: 'n1', category: 'Narrativa', text: 'Reescribir el "Gancho" del Extracto', subtext: 'Las primeras 3 líneas deben vender tu valor inmediatamente.', impact: 'High' },
      ...pilares.pilar_2_narrativa.experiencia_mejoras.map((exp, i) => ({
          id: `n2-${i}`,
          category: 'Narrativa',
          text: `Optimizar experiencia en ${exp.empresa}`,
          subtext: 'Añadir métricas y logros cuantificables.',
          impact: 'High'
      })),
      // Visibilidad
      { id: 'v1', category: 'Visibilidad', text: 'Definir pilares de contenido', subtext: 'Elige 3 temas en los que quieras posicionarte como experto.', impact: 'Medium' },
      { id: 'v2', category: 'Visibilidad', text: 'Comentar en 5 perfiles top al día', subtext: 'Estrategia de networking para visibilidad rápida.', impact: 'Medium' },
      // Quick Wins
      ...quick_wins.map((win, i) => ({
          id: `qw-${i}`,
          category: 'Quick Wins',
          text: win,
          subtext: 'Victoria rápida detectada por la IA.',
          impact: 'High'
      }))
  ];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Target },
    { id: 'pilar1', label: '1. Fundamento', icon: Layout },
    { id: 'pilar2', label: '2. Narrativa', icon: BookOpen },
    { id: 'pilar3', label: '3. Visibilidad', icon: Users },
    { id: 'checklist', label: 'Plan de Acción', icon: CheckCircle2 },
  ];
  
  const toggleTask = (id: string) => {
    setCompletedTasks(prev => {
      const isCompleting = !prev.includes(id);
      const newDocs = isCompleting ? [...prev, id] : prev.filter(t => t !== id);
      
      if (isCompleting && newDocs.length === allTasks.length) {
          confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#34d399', '#f59e0b']
          });
      }
      return newDocs;
    });
  };

  const componentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!componentRef.current) return;
    setIsDownloading(true);

    const element = componentRef.current;
    
    // Opciones para el PDF
    const opt = {
      margin:       [5, 5],
      filename:     `Auditoria_Kolink_${perfil_resumen.nombre.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF descargado correctamente");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Hubo un error al generar el PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={componentRef} className="max-w-6xl mx-auto font-sans text-slate-900 animate-in fade-in duration-500 bg-white/50 p-4 sm:p-0 rounded-xl">
      
      {/* --- HEADER HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Auditoría de Perfil
                 </h1>
                 <span className="bg-brand-100 text-brand-700 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Expert Mode
                 </span>
              </div>
              <p className="text-slate-500 text-lg">
                 Análisis estratégico para <span className="font-semibold text-slate-900">{perfil_resumen.nombre}</span>
              </p>
          </div>
          <div className="flex gap-3" data-html2canvas-ignore>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <Share2 className="w-4 h-4" />
                  Compartir
              </button>
              <button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md disabled:opacity-70 disabled:cursor-wait"
              >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isDownloading ? 'Generando...' : 'Descargar PDF'}
              </button>
          </div>
      </div>

      {/* --- MAIN NAVIGATION TABS --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 sticky top-4 z-10 backdrop-blur-md bg-white/90 supports-[backdrop-filter]:bg-white/80">
          <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2.5 px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                          activeTab === tab.id
                              ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                      <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'}`} />
                      {tab.label}
                  </button>
              ))}
          </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[600px]">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                  {/* Left Column: Score & Summary */}
                  <div className="lg:col-span-2 space-y-6">
                      <SectionCard className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
                          <div className="flex flex-col sm:flex-row items-center gap-8">
                              <div className="relative shrink-0">
                                  <svg className="w-40 h-40 transform -rotate-90">
                                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                                      <circle 
                                          cx="80" cy="80" r="70" 
                                          stroke="currentColor" strokeWidth="10" fill="transparent" 
                                          strokeDasharray={440} 
                                          strokeDashoffset={440 - (440 * perfil_resumen.score_actual) / 100}
                                          className={`${perfil_resumen.score_actual >= 80 ? 'text-emerald-400' : perfil_resumen.score_actual >= 50 ? 'text-amber-400' : 'text-red-400'} transition-all duration-1000 ease-out`}
                                      />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-4xl font-bold">{perfil_resumen.score_actual}</span>
                                      <span className="text-xs uppercase tracking-widest opacity-70">Total</span>
                                  </div>
                              </div>
                              <div className="space-y-4 text-center sm:text-left">
                                  <div>
                                      <h2 className="text-2xl font-bold mb-1">Diagnóstico de Impacto</h2>
                                      <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                                          Tu perfil tiene un rendimiento del <span className="font-bold text-white">{perfil_resumen.score_actual}%</span>. 
                                          {perfil_resumen.score_actual < 50 ? " Se detectan fugas críticas de atención que están costando oportunidades." : " Tienes una base sólida, pero faltan ajustes estratégicos para convertir visitas en clientes."}
                                      </p>
                                  </div>
                                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                      <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
                                          <div className="text-xs text-slate-400 uppercase mb-1">Fundamento</div>
                                          <div className={`text-lg font-bold ${pilares.pilar_1_fundamento.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pilares.pilar_1_fundamento.score}%</div>
                                      </div>
                                      <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
                                          <div className="text-xs text-slate-400 uppercase mb-1">Narrativa</div>
                                          <div className={`text-lg font-bold ${pilares.pilar_2_narrativa.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pilares.pilar_2_narrativa.score}%</div>
                                      </div>
                                      <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm">
                                          <div className="text-xs text-slate-400 uppercase mb-1">Visibilidad</div>
                                          <div className={`text-lg font-bold ${pilares.pilar_3_visibilidad.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{pilares.pilar_3_visibilidad.score}%</div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </SectionCard>

                      <SectionCard title="Victorias Rápidas (Quick Wins)" icon={Sparkles}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {quick_wins.map((win, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-colors">
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                      <span className="text-slate-700 text-sm font-medium">{win}</span>
                                  </div>
                              ))}
                          </div>
                      </SectionCard>
                  </div>

                  {/* Right Column: Strategy Preview */}
                  <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                             <TrendingUp className="w-5 h-5 text-brand-600" />
                             Roadmap
                          </h3>
                          <div className="flex-1 relative pl-8 pb-8 border-l-2 border-slate-100 space-y-8">
                              <div className="relative">
                                  <div className="absolute -left-[39px] w-6 h-6 rounded-full bg-slate-900 border-4 border-white shadow-sm flex items-center justify-center text-[10px] text-white font-bold">1</div>
                                  <h4 className="text-sm font-semibold text-slate-900">Optimizar Fundamentos</h4>
                                  <p className="text-xs text-slate-500 mt-1">Mejora inmediata de SEO y Primera Impresión.</p>
                              </div>
                              <div className="relative">
                                  <div className="absolute -left-[39px] w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-[10px] text-slate-600 font-bold">2</div>
                                  <h4 className="text-sm font-semibold text-slate-900">Reescribir Narrativa</h4>
                                  <p className="text-xs text-slate-500 mt-1">Transformar "About" y Experiencia en ventas.</p>
                              </div>
                              <div className="relative">
                                  <div className="absolute -left-[39px] w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-[10px] text-slate-600 font-bold">3</div>
                                  <h4 className="text-sm font-semibold text-slate-900">Activar Visibilidad</h4>
                                  <p className="text-xs text-slate-500 mt-1">Estrategia de contenidos y networking.</p>
                              </div>
                          </div>
                          <button 
                             onClick={() => setActiveTab('pilar1')}
                             className="w-full mt-6 py-2.5 bg-brand-50 text-brand-700 font-medium rounded-lg text-sm hover:bg-brand-100 transition-colors flex items-center justify-center gap-2"
                          >
                              Comenzar Optimización <ArrowRight className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: PILAR 1 - FUNDAMENTO */}
          {activeTab === 'pilar1' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="lg:col-span-8 space-y-8">
                       <SectionCard title="Análisis de Titular (Headline)" icon={Target}>
                           <div className="bg-amber-50 border border-amber-100 rounded-lg p-5 mb-6">
                               <div className="flex gap-3">
                                   <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                   <div>
                                       <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-1">Diagnóstico Actual</h4>
                                       <p className="text-amber-800 text-sm italic">"{pilares.pilar_1_fundamento.analisis_titular}"</p>
                                   </div>
                               </div>
                           </div>

                           <div className="space-y-4">
                               <div className="group border border-slate-200 rounded-xl p-5 hover:border-brand-300 transition-colors">
                                   <div className="flex items-center justify-between mb-2">
                                       <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opción A: Conservadora</span>
                                   </div>
                                   <p className="text-lg font-medium text-slate-900">{pilares.pilar_1_fundamento.propuesta_titular_a}</p>
                               </div>

                               <div className="group border-2 border-brand-100 rounded-xl p-6 bg-brand-50/30 relative overflow-hidden">
                                   <div className="inline-block px-3 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">Recomendada</div>
                                   <p className="text-xl font-bold text-slate-900 mb-2">{pilares.pilar_1_fundamento.propuesta_titular_b}</p>
                                   <p className="text-sm text-slate-500">Optimizado para SEO y conversión de alto impacto.</p>
                               </div>
                           </div>
                       </SectionCard>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <SectionCard title="Foto & Banner" icon={Layout}>
                               <div className="flex items-start gap-3">
                                   <div className={`p-2 rounded-full ${pilares.pilar_1_fundamento.foto_banner_check.includes('Improve') ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                       {pilares.pilar_1_fundamento.foto_banner_check.includes('Improve') ? <AlertCircle className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
                                   </div>
                                   <p className="text-sm text-slate-600 leading-relaxed">{pilares.pilar_1_fundamento.foto_banner_check}</p>
                               </div>
                           </SectionCard>

                           <SectionCard title="URL Personalizada" icon={ExternalLink}>
                               <div className="flex items-start gap-3">
                                   <div className={`p-2 rounded-full ${pilares.pilar_1_fundamento.url_check.includes('Yes') || pilares.pilar_1_fundamento.url_check.includes('Sí') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                       <div className="w-4 h-4 rounded-full bg-current" />
                                   </div>
                                   <p className="text-sm text-slate-600 leading-relaxed">{pilares.pilar_1_fundamento.url_check}</p>
                               </div>
                           </SectionCard>
                       </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 sticky top-24">
                          <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Concepto Clave: LSO</h4>
                          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                              LSO (LinkedIn Search Optimization) es el SEO aplicado a LinkedIn. Tu titular y extracto deben contener las palabras clave por las que quieres ser encontrado por reclutadores.
                          </p>
                          <AdviceAccordion title="¿Por qué importa el banner?" defaultOpen>
                              El banner es el "Billboard" de tu perfil. Ocupa el 25% de la pantalla. Si está vacío, estás desperdiciando el espacio publicitario más valioso de tu marca personal.
                          </AdviceAccordion>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: PILAR 2 - NARRATIVA */}
          {activeTab === 'pilar2' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="lg:col-span-8 space-y-8">
                      {/* Hook Rewrite */}
                      <SectionCard title="El Gancho (The Hook)" icon={BookOpen}>
                          <div className="mb-6">
                              <h4 className="text-sm font-bold text-slate-700 mb-2">Análisis de tus primeras líneas</h4>
                              <p className="text-sm text-slate-600 italic border-l-4 border-slate-200 pl-4 py-1">
                                  {pilares.pilar_2_narrativa.gancho_analisis}
                              </p>
                          </div>
                          
                          <div className="bg-slate-900 text-slate-200 rounded-xl p-6 shadow-xl relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-6xl italic text-white pointer-events-none">"</div>
                               <h4 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-4">Reescritura de Alto Impacto</h4>
                               <p className="text-lg font-medium leading-relaxed whitespace-pre-line font-serif">
                                   {pilares.pilar_2_narrativa.redaccion_gancho_sugerida}
                               </p>
                               <div className="mt-4 flex justify-end">
                                   <button className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                                       Copiar texto <Share2 className="w-3 h-3" />
                                   </button>
                               </div>
                          </div>
                      </SectionCard>

                      {/* Experience Bullet Points */}
                      <div className="space-y-4">
                          <h3 className="text-lg font-bold text-slate-900 px-1">Transformación de Experiencia</h3>
                          {pilares.pilar_2_narrativa.experiencia_mejoras.map((item, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex flex-col md:flex-row gap-6">
                                      <div className="md:w-1/3">
                                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Empresa</div>
                                          <div className="font-bold text-slate-900">{item.empresa}</div>
                                      </div>
                                      <div className="md:w-2/3">
                                          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                              <TrendingUp className="w-3 h-3" /> Logro Cuantificable
                                          </div>
                                          <p className="text-slate-800 font-medium text-lg leading-snug">
                                              "{item.propuesta_metrica}"
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 sticky top-24">
                          <ScoreBadge score={pilares.pilar_2_narrativa.score} />
                          <h4 className="font-bold text-slate-900 mt-4 mb-2">Autoridad y Confianza</h4>
                          <p className="text-sm text-slate-600 mb-6">
                              Tu perfil debe pasar de ser un CV (lista de deberes) a una Landing Page (lista de resultados).
                          </p>
                          <AdviceAccordion title="La regla de las 2 líneas" defaultOpen>
                              LinkedIn oculta tu "About" después de las primeras 2 líneas. Si esas líneas no venden, nadie leerá el resto. Tu objetivo es ganar el clic en "Ver más".
                          </AdviceAccordion>
                          <AdviceAccordion title="¿Por qué métricas?">
                              Decir "Lideré un equipo" es subjetivo. Decir "Lideré un equipo de 15 personas generando $2M" es indiscutible. Los números generan confianza inmediata.
                          </AdviceAccordion>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: PILAR 3 - VISIBILIDAD */}
          {activeTab === 'pilar3' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
                  <SectionCard title="Estrategia de Contenidos" icon={Layout} className="h-full border-t-4 border-t-indigo-500">
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                          {pilares.pilar_3_visibilidad.estrategia_contenido}
                      </p>
                      <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                              <h4 className="text-sm font-bold text-indigo-800">Pro Tip</h4>
                              <p className="text-sm text-indigo-700 mt-1">
                                  No publiques solo por publicar. Cada post debe resolver un problema de tu cliente ideal o demostrar tu autoridad en el sector.
                              </p>
                          </div>
                      </div>
                  </SectionCard>

                  <SectionCard title="Motor de Networking" icon={Users} className="h-full border-t-4 border-t-emerald-500">
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                          {pilares.pilar_3_visibilidad.estrategia_networking}
                      </p>
                      <div className="bg-emerald-50 p-4 rounded-lg flex items-start gap-3">
                          <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                              <h4 className="text-sm font-bold text-emerald-800">La Regla del 15</h4>
                              <p className="text-sm text-emerald-700 mt-1">
                                  Comenta en 5 posts de líderes de tu industria todos los días. Tus comentarios deben tener al menos 15 palabras para ser considerados de valor por el algoritmo y generar visibilidad.
                              </p>
                          </div>
                      </div>
                  </SectionCard>
              </div>
          )}

          {/* TAB: PLAN DE ACCIÓN (CHECKLIST) */}
          {activeTab === 'checklist' && (
              <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-500">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                      <div className="p-8 bg-slate-900 border-b border-slate-700 relative overflow-hidden">
                          {/* Background Glow for High Scores */}
                          {(completedTasks.length / allTasks.length) === 1 && (
                              <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
                          )}
                          
                          <div className="flex items-center justify-between mb-2 relative z-10">
                              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                  <CheckCircle2 className={`w-8 h-8 ${completedTasks.length === allTasks.length ? 'text-yellow-400 animate-bounce' : 'text-emerald-400'}`} />
                                  Tu Plan de Ejecución
                              </h3>
                              <span className={`font-mono font-bold text-xl ${completedTasks.length === allTasks.length ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                  {Math.round((completedTasks.length / allTasks.length) * 100)}% Completado
                              </span>
                          </div>
                          <p className="text-slate-400 relative z-10">Sigue esta lista paso a paso para transformar tu perfil.</p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden relative z-10">
                              <div 
                                  className={`h-full transition-all duration-700 ease-out ${completedTasks.length === allTasks.length ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                                  style={{ width: `${(completedTasks.length / allTasks.length) * 100}%` }}
                              />
                          </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                          {['Fundamento', 'Narrativa', 'Visibilidad', 'Quick Wins'].map((category) => {
                              const categoryTasks = allTasks.filter(t => t.category === category);
                              if (categoryTasks.length === 0) return null;

                              return (
                                  <div key={category} className="p-6">
                                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                          {category === 'Fundamento' && <Layout className="w-4 h-4" />}
                                          {category === 'Narrativa' && <BookOpen className="w-4 h-4" />}
                                          {category === 'Visibilidad' && <Users className="w-4 h-4" />}
                                          {category === 'Quick Wins' && <Sparkles className="w-4 h-4 text-emerald-500" />}
                                          {category}
                                      </h4>
                                      <div className="space-y-3">
                                          {categoryTasks.map((task) => {
                                              const isDone = completedTasks.includes(task.id);
                                              return (
                                                  <label 
                                                      key={task.id} 
                                                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer group select-none ${
                                                          isDone 
                                                              ? 'bg-slate-50 border-slate-100' 
                                                              : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm'
                                                      }`}
                                                  >
                                                      <div className="relative flex items-center shrink-0">
                                                          <input 
                                                              type="checkbox" 
                                                              checked={isDone}
                                                              onChange={() => toggleTask(task.id)}
                                                              className="peer sr-only"
                                                          />
                                                          <div className={`w-6 h-6 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                                                              isDone ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300 group-hover:border-brand-400 group-hover:scale-105'
                                                          }`}>
                                                              {isDone && <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in duration-300" />}
                                                          </div>
                                                      </div>
                                                      
                                                      <div className="flex-1 min-w-0">
                                                          <p className={`font-medium transition-all ${
                                                              isDone ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'
                                                          }`}>
                                                              {task.text}
                                                          </p>
                                                          {task.subtext && (
                                                              <p className={`text-sm mt-1 truncate transition-colors ${
                                                                  isDone ? 'text-slate-300' : 'text-slate-500'
                                                              }`}>
                                                                  {task.subtext}
                                                              </p>
                                                          )}
                                                      </div>

                                                      {/* Smart Actions (Only show if not done) */}
                                                      {!isDone && (
                                                          <div onClick={(e) => e.stopPropagation()}>
                                                              {getTaskAction(task)}
                                                          </div>
                                                      )}
                                                      
                                                      <div className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                                                          task.impact === 'High' 
                                                              ? isDone ? 'bg-slate-100 text-slate-400' : 'bg-rose-100 text-rose-600'
                                                              : isDone ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-500'
                                                      }`}>
                                                          {task.impact}
                                                      </div>
                                                  </label>
                                              );
                                          })}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          )}

      </div>

    </div>
  );
};

export default AuditResults;
