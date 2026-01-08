import React from "react";
import { Layout } from "lucide-react";

interface TemplatesPanelProps {
    onSelectTemplate: (slides: any[]) => void;
}

const TEMPLATES = [
    {
        id: 1,
        name: "Cyber Modern",
        slides: [
            {
                id: "t1-s1", type: "intro", background: "#0F172A",
                elements: [
                    { id: "t1-e1", type: "text", content: "FUTURE OF SALES", x: 40, y: 120, width: 240, height: 60, style: { fontSize: "28px", fontWeight: "900", textAlign: "left", color: "#38BDF8", fontFamily: "Inter" } },
                    { id: "t1-e2", type: "text", content: "Powered by Nexus AI", x: 40, y: 190, width: 240, height: 30, style: { fontSize: "12px", color: "#94A3B8" } }
                ]
            },
            {
                id: "t1-s2", type: "content", background: "#1E293B",
                elements: [
                    { id: "t1-e3", type: "text", content: "01. Hyper-Personalization", x: 40, y: 60, width: 240, height: 40, style: { fontSize: "20px", fontWeight: "bold", color: "#38BDF8" } },
                    { id: "t1-e4", type: "text", content: "AI understands your brand voice better than you do.", x: 40, y: 110, width: 240, height: 100, style: { fontSize: "16px", lineHeight: "1.6", color: "#F1F5F9" } }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Minimalist Authority",
        slides: [
            {
                id: "t2-s1", type: "intro", background: "#FFFFFF",
                elements: [
                    { id: "t2-e1", type: "text", content: "High Authority Posting", x: 40, y: 140, width: 260, height: 60, style: { fontSize: "26px", fontWeight: "900", textAlign: "center", color: "#111827" } }
                ]
            },
            {
                id: "t2-s2", type: "content", background: "#F8FAFC",
                elements: [
                    { id: "t2-e2", type: "text", content: "Less is More", x: 40, y: 80, width: 240, height: 40, style: { fontSize: "22px", fontWeight: "bold", color: "#2563EB" } },
                     { id: "t2-e3", type: "text", content: "Focus on one high-impact message per slide.", x: 40, y: 130, width: 240, height: 100, style: { fontSize: "16px", color: "#475569" } }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Bold Impact",
        slides: [
            {
                id: "t3-s1", type: "intro", background: "linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)",
                elements: [
                    { id: "t3-e1", type: "text", content: "ATTENTION!", x: 40, y: 130, width: 240, height: 60, style: { fontSize: "32px", fontWeight: "900", textAlign: "center", color: "#FFFFFF" } }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "SaaS Professional",
        slides: [
            {
                id: "t4-s1", type: "intro", background: "#F1F5F9",
                elements: [
                    { id: "t4-e1", type: "text", content: "Scaling Your Workflow", x: 40, y: 110, width: 240, height: 50, style: { fontSize: "24px", fontWeight: "bold", textAlign: "left", color: "#0F172A" } },
                    { id: "t4-e2", type: "text", content: "Efficiency Redefined", x: 40, y: 160, width: 240, height: 40, style: { fontSize: "14px", textAlign: "left", color: "#64748B" } }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Glassmorphism",
        slides: [
            {
                id: "t5-s1", type: "intro", background: "linear-gradient(45deg, #3B82F6, #8B5CF6)",
                elements: [
                    { id: "t5-e1", type: "text", content: "Modern Design", x: 40, y: 130, width: 240, height: 60, style: { fontSize: "24px", fontWeight: "bold", color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px" } }
                ]
            }
        ]
    },
    {
        id: 6,
        name: "Noir Edition",
        slides: [
            {
                id: "t6-s1", type: "intro", background: "#000000",
                elements: [
                    { id: "t6-e1", type: "text", content: "THE EDGE", x: 40, y: 120, width: 240, height: 60, style: { fontSize: "32px", fontWeight: "900", textAlign: "center", color: "#FFFFFF", letterSpacing: "4px" } }
                ]
            }
        ]
    }
];

const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onSelectTemplate }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Platform Format</h4>
                <div className="grid grid-cols-2 gap-3">
                     <button className="flex items-center gap-3 p-3 rounded-xl border-2 border-brand-500 bg-brand-50/50 text-left transition-all">
                        <div className="w-8 h-10 border border-brand-200 bg-white rounded-md shadow-sm"></div>
                        <div>
                            <span className="block text-xs font-bold text-slate-900">LinkedIn</span>
                            <span className="block text-[10px] text-slate-500">4:5 Portrait</span>
                        </div>
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 text-left transition-all">
                        <div className="w-10 h-10 border border-slate-200 bg-white rounded-md shadow-sm"></div>
                        <div>
                            <span className="block text-xs font-bold text-slate-900">Instagram</span>
                            <span className="block text-[10px] text-slate-500">1:1 Square</span>
                        </div>
                    </button>
                </div>
            </div>

             <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Templates</h4>
                <div className="grid grid-cols-2 gap-4">
                    {TEMPLATES.map((template) => (
                        <div 
                            key={template.id} 
                            onClick={() => onSelectTemplate(template.slides)}
                            className="group relative cursor-pointer"
                        >
                            <div className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 transition-all group-hover:scale-[1.02] group-hover:shadow-lg group-hover:border-brand-300">
                                {/* Preview with minimal HTML representation */}
                                <div className="w-full h-full relative" style={{ background: template.slides[0].background }}>
                                    {[...template.slides[0].elements].slice(0, 2).map((el: any) => (
                                        <div 
                                            key={el.id} 
                                            style={{ 
                                                position: 'absolute', 
                                                top: `${el.y * 0.3}px`, // Scale down specific to thumbnail size
                                                left: `${el.x * 0.3}px`, 
                                                width: `${el.width * 0.3}px`,
                                                fontSize: '6px', // Tiny font
                                                color: el.style.color || '#000',
                                                zIndex: 10,
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {/* Simple shape representation for UI preview */}
                                            <div className="h-1 bg-current opacity-20 rounded mb-1 w-full" />
                                            <div className="h-1 bg-current opacity-20 rounded w-2/3" />
                                        </div>
                                    ))}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">Apply</span>
                                    </div>
                                </div>
                            </div>
                            <span className="block mt-2 text-[10px] font-medium text-slate-500 group-hover:text-slate-900 text-center">{template.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatesPanel;
