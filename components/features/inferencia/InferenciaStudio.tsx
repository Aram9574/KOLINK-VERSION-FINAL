import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../../../context/UserContext";
import EditorSidebar from "./EditorSidebar";
import GeneratorPanel from "./panels/GeneratorPanel";
import PalettePanel from "./panels/PalettePanel";
import ElementsPanel from "./panels/ElementsPanel";
import TemplatesPanel from "./panels/TemplatesPanel";
import TextPanel from "./panels/TextPanel";
import ImagesPanel from "./panels/ImagesPanel";
import SettingsPanel from "./panels/SettingsPanel";
import CarouselSlide from "./CarouselSlide";
import PropertiesPanel from "./PropertiesPanel";
import type { CarouselSlide as CarouselSlideType, CarouselTheme } from "../../../types/inferencia";
import { supabase } from "../../../services/supabaseClient";
import { useCredits } from "../../../hooks/useCredits";

const InferenciaStudio: React.FC = () => {
    const { user } = useUser();
    const { checkCredits } = useCredits();
    const [activeSlideId, setActiveSlideId] = useState<string | null>("slide-1");
    const [activeTab, setActiveTab] = useState<string>("generate");
    const [activeElementId, setActiveElementId] = useState<string | null>(null);

    const handleSelectSlide = (id: string) => {
        setActiveSlideId(id);
        setActiveElementId(null);
    };

    const handleSelectElement = (elementId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveElementId(elementId);
        // Also ensure the slide containing this element is active if not already
        // This logic can be expanded if needed
    };

    const handleUpdateActiveElement = (field: string, value: any) => {
        if (!activeSlideId || !activeElementId) return;

        setSlides(slides.map(s => {
            if (s.id === activeSlideId) {
                return {
                    ...s,
                    elements: s.elements.map(el => {
                        if (el.id === activeElementId) {
                            if (field === 'style') {
                                return { ...el, style: { ...el.style, ...value } };
                            }
                            // Handle top-level vs style properties more robustly in real app
                            // For now, check if field exists in styles
                            if (['fontSize', 'fontFamily', 'color', 'backgroundColor', 'fontWeight', 'borderRadius', 'textAlign'].includes(field)) {
                                 return { ...el, style: { ...el.style, [field]: value } };
                            }
                            return { ...el, [field]: value };
                        }
                        return el;
                    })
                };
            }
            return s;
        }));
    };

    const defaultTheme: CarouselTheme = {
        id: "theme-1",
        name: "Modern Blue",
        colors: {
            primary: "#2563EB",
            secondary: "#1E40AF",
            background: "#FFFFFF",
            text: "#1E293B",
            accent: "#3B82F6"
        },
        fonts: {
            heading: "Inter",
            body: "Inter"
        }
    };

    const [theme, setTheme] = useState<CarouselTheme>(defaultTheme);

    const [slides, setSlides] = useState<CarouselSlideType[]>([
        { 
            id: "slide-1", 
            type: "intro", 
            background: "#FFFFFF",
            elements: [
                { id: "el-1", type: "text", content: "5 Ways to Boost Productivity", x: 40, y: 120, width: 240, height: 80, style: { fontSize: "24px", fontWeight: "bold", textAlign: "center" } },
                { id: "el-2", type: "text", content: "@aramzakzuk", x: 40, y: 350, width: 240, height: 20, style: { fontSize: "12px", color: "#94A3B8", textAlign: "center" } }
            ] 
        },
        { 
            id: "slide-2", 
            type: "content", 
            background: "#FFFFFF",
            elements: [
                { id: "el-3", type: "text", content: "1. Focus on one task", x: 40, y: 60, width: 240, height: 40, style: { fontSize: "20px", fontWeight: "bold" } },
                { id: "el-4", type: "text", content: "Multitasking is a myth. Focus on one thing at a time to get better results.", x: 40, y: 110, width: 240, height: 120, style: { fontSize: "14px", lineHeight: "1.5" } }
            ] 
        },
        { 
            id: "slide-3", 
            type: "outro", 
            background: "#FFFFFF",
            elements: [
                { id: "el-5", type: "text", content: "Was this helpful?", x: 40, y: 150, width: 240, height: 40, style: { fontSize: "20px", fontWeight: "bold", textAlign: "center" } },
                { id: "el-6", type: "text", content: "Save for later!", x: 40, y: 190, width: 240, height: 20, style: { fontSize: "14px", textAlign: "center" } }
            ] 
        },
    ]);

    const activeElement = activeSlideId && activeElementId 
        ? slides.find(s => s.id === activeSlideId)?.elements.find(e => e.id === activeElementId) 
        : null;

    const handleAddSlide = () => {
        const newId = `slide-${Date.now()}`;
        setSlides([...slides, { 
            id: newId, 
            type: "content", 
            background: "#FFFFFF",
            elements: [
                { id: `el-${Date.now()}`, type: "text", content: "New Slide", x: 40, y: 150, width: 240, height: 40, style: { fontSize: "20px", fontWeight: "bold", textAlign: "center" } }
            ] 
        }]);
        setActiveSlideId(newId);
    };

    const handleDeleteSlide = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (slides.length <= 1) return;
        const newSlides = slides.filter(s => s.id !== id);
        setSlides(newSlides);
        if (activeSlideId === id) {
            setActiveSlideId(newSlides[0].id);
        }
    };

    const handleUpdateSlide = (field: string, value: string) => {
        // Simple update implementation for now
        // Ideally we would update specific elements
        if (!activeSlideId) return;
        setSlides(slides.map(s => {
            if (s.id === activeSlideId) {
                // If updating 'content', we assume updating the first text element for simplicity in this MVP step
                if (field === 'content') {
                    const newElements = s.elements.map((el, i) => i === 0 ? { ...el, content: value } : el);
                    return { ...s, elements: newElements };
                }
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const handleMoveSlide = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
        e.stopPropagation();
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === slides.length - 1) return;

        const newSlides = [...slides];
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        
        // Swap
        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
        setSlides(newSlides);
    };

    const handleAddElement = (type: 'text' | 'image' | 'shape', content?: string) => {
        if (!activeSlideId) return;
        
        const newElement = {
            id: `${type}-${Date.now()}`,
            type,
            content: content || (type === 'text' ? 'New Text' : ''),
            x: 100, y: 100, width: 200, height: type === 'text' ? 40 : 100,
            style: type === 'text' ? { fontSize: "16px", color: "#000000" } : { backgroundColor: "#CBD5E1" }
        };

        setSlides(slides.map(s => {
            if (s.id === activeSlideId) {
                return { ...s, elements: [...s.elements, newElement] };
            }
            return s;
        }));
        
        setActiveElementId(newElement.id); // Auto-select new element
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeSlideId) return;

        const imageUrl = URL.createObjectURL(file);
        const newElement = {
            id: `img-${Date.now()}`,
            type: "image" as const,
            content: imageUrl,
            x: 50, y: 100, width: 200, height: 200,
            style: { borderRadius: "8px" }
        };

        setSlides(slides.map(s => {
            if (s.id === activeSlideId) {
                return { ...s, elements: [...s.elements, newElement] };
            }
            return s;
        }));
    };

    const activeSlide = slides.find(s => s.id === activeSlideId);

    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateCarousel = async (topic: string) => {
        if (!checkCredits(1)) return; // Validate credits before generating
        setIsGenerating(true);
        try {
            // Call Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('generate-carousel', {
                body: { topic, type: 'topic', count: 5 } // Default to 5 slides from topic
            });

            if (error) throw error;

            if (data && data.slides) {
                // Map API response to our CarouselSlideType
                // Assuming data.slides is array of { title, content } or similar
                // We need to robustly map this. For now, let's assume it returns a compatible structure 
                // or map it to a simple text/title layout.
                
                const newSlides: CarouselSlideType[] = data.slides.map((s: any, i: number) => ({
                    id: `slide-${Date.now()}-${i}`,
                    type: i === 0 ? 'intro' : (i === data.slides.length - 1 ? 'outro' : 'content'),
                    background: theme.colors.background,
                    elements: [
                         // Title
                        { 
                            id: `el-title-${i}`, 
                            type: "text", 
                            content: s.title || s.heading || "Slide Title", 
                            x: 40, y: 60, width: 240, height: 40, 
                            style: { fontSize: "20px", fontWeight: "bold", textAlign: "left", color: theme.colors.text } 
                        },
                        // Body
                        { 
                            id: `el-body-${i}`, 
                            type: "text", 
                            content: s.content || s.body || "", 
                            x: 40, y: 110, width: 240, height: 160, 
                            style: { fontSize: "14px", lineHeight: "1.5", textAlign: "left", color: theme.colors.text } 
                        }
                    ]
                }));
                
                setSlides(newSlides);
                setActiveSlideId(newSlides[0].id);
            }
        } catch (error) {
            console.error("Failed to generate carousel:", error);
            alert("Failed to generate carousel. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        // Dynamically import to avoid SSR issues if any, though likely client side always
        const { exportCarouselToPDF } = await import("./utils/export");
        // We set active slide to null to remove selection rings/UI from capture if needed, 
        // but our export helper targets a class. 
        // We might want to show a loading state here.
        await exportCarouselToPDF([], "my-carousel");
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50 overflow-hidden font-sans">
            {/* Left Sidebar (Icons) */}
            <EditorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Expandable Panel (Contextual based on activeTab) */}
            <motion.div 
                initial={false}
                animate={{ 
                    width: activeTab ? (window.innerWidth < 768 ? "100%" : 320) : 0, 
                    opacity: activeTab ? 1 : 0,
                    x: activeTab ? 0 : (window.innerWidth < 768 ? "100%" : 0)
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed md:relative top-0 right-0 md:top-auto md:right-auto bottom-16 md:bottom-auto w-full md:w-auto h-[calc(100vh-64px)] md:h-full bg-white border-l md:border-l-0 md:border-r border-slate-200 z-20 flex flex-col overflow-hidden shadow-xl"
                style={{ position: activeTab && window.innerWidth < 768 ? "fixed" : undefined }}
            >
                <div className="min-w-[320px] w-full h-full p-6 overflow-y-auto pb-24 md:pb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-display font-bold text-2xl text-slate-900 capitalize px-1">{activeTab}</h2>
                        <button onClick={() => setActiveTab("")} className="md:hidden p-2 bg-slate-100 rounded-full">
                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="px-1">
                        {activeTab === "generate" && <GeneratorPanel onGenerate={handleGenerateCarousel} isLoading={isGenerating} />}
                        {activeTab === "templates" && <TemplatesPanel onSelectTemplate={(newSlides) => {
                            // Map over newSlides to assign unique IDs to ensure React re-renders correctly
                            const slidesWithUniqueIds = newSlides.map((s, i) => ({
                                ...s,
                                id: `slide-${Date.now()}-${i}`,
                                elements: s.elements.map((el: any) => ({ ...el, id: `el-${Date.now()}-${Math.random()}` }))
                            }));
                            setSlides(slidesWithUniqueIds);
                            setActiveSlideId(slidesWithUniqueIds[0].id);
                        }} />}
                        {activeTab === "palette" && <PalettePanel theme={theme} setTheme={setTheme} />}
                        {activeTab === "text" && <TextPanel theme={theme} setTheme={setTheme} onAddText={() => handleAddElement('text', 'New Text Layer')} />}
                        {activeTab === "elements" && <ElementsPanel onAddElement={handleAddElement} />}
                        {activeTab === "images" && <ImagesPanel onUpload={handleImageUpload} />}
                        {activeTab === "settings" && <SettingsPanel />}
                        
                        {/* Fallback for other tabs */}
                        {!["generate", "templates", "palette", "text", "elements", "images", "settings"].includes(activeTab) && (
                             <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p>Coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
 
            {/* Main Area: Column containing TopBar and Row(Canvas + RightPanel) */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-100/50">
                {/* Top Navigation Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shadow-sm relative shrink-0">
                     {/* Left: Back & Title */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => window.location.href = '/dashboard'} 
                            className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-200 hover:shadow-md transition-all shadow-sm group"
                            title="Volver al Inicio"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </button>
                        
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        
                         <div className="flex flex-col group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm md:text-base group-hover:text-brand-600 transition-colors">Untitlted Carousel</span>
                                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </div>
                            <span className="text-[10px] text-slate-400">Autosaved</span>
                         </div>
                    </div>

                    {/* Center: View Controls (Desktop) */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <button className="p-1.5 px-3 rounded-md bg-white shadow-sm text-xs font-semibold text-slate-700">Editor</button>
                        <button className="p-1.5 px-3 rounded-md hover:bg-slate-200/50 text-xs font-medium text-slate-500">Preview</button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1 mr-2">
                             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Undo">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                             </button>
                             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Redo">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                             </button>
                        </div>

                        <button className="hidden md:flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-slate-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            Preview
                        </button>
                        
                        <button 
                            onClick={handleDownloadPDF}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 md:px-5 md:py-2 rounded-lg text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export PDF
                        </button>
                    </div>
                </header>

                {/* Workspace Row: Canvas + Right Panel */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Canvas Workspace */}
                    <main 
                        className="flex-1 flex items-center justify-center overflow-auto p-4 md:p-12 relative cursor-grab active:cursor-grabbing bg-slate-50/50"
                        onClick={() => setActiveSlideId(null)}
                    >
                        {/* Format Frame */}
                        <div className="flex gap-4 md:gap-6 items-center perspective-1000 min-w-max px-8 md:px-0" onClick={(e) => e.stopPropagation()}>
                            {slides.map((slide, index) => (
                                <CarouselSlide 
                                    key={slide.id}
                                    slide={slide}
                                    theme={theme}
                                    index={index}
                                    isActive={activeSlideId === slide.id}
                                    activeElementId={activeElementId}
                                    onClick={() => handleSelectSlide(slide.id)}
                                    onSelectElement={handleSelectElement}
                                    onDelete={(e) => handleDeleteSlide(slide.id, e)}
                                    onMoveLeft={(e) => handleMoveSlide(index, 'left', e)}
                                    onMoveRight={(e) => handleMoveSlide(index, 'right', e)}
                                />
                            ))}
                            
                            {/* Add Slide Button */}
                            <motion.button 
                                onClick={handleAddSlide}
                                className="w-[320px] h-[400px] rounded-3xl border-2 border-dashed border-slate-300 hover:border-brand-400 bg-slate-50/50 hover:bg-brand-50/30 flex flex-col items-center justify-center text-slate-400 hover:text-brand-600 transition-all duration-300 gap-3 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-16 h-16 rounded-full bg-white border border-slate-200 group-hover:border-brand-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <span className="font-medium text-sm">Add New Slide</span>
                            </motion.button>
                        </div>
                    </main>

                    {/* Right Properties Panel */}
                    <div className="w-[300px] bg-white border-l border-slate-200 h-full flex flex-col shrink-0 z-30 shadow-xl overflow-y-auto">
                         <PropertiesPanel 
                            slide={activeSlide} 
                            activeElement={activeElement}
                            onChange={handleUpdateActiveElement}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InferenciaStudio;
