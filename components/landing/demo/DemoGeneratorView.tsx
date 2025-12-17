import React from "react";
import { AppLanguage } from "../../../types";
import DemoSidebar from "./DemoSidebar";
import DemoGeneratorForm from "./DemoGeneratorForm";
import DemoLinkedInPreview from "./DemoLinkedInPreview";
import { toast } from "sonner";

interface DemoGeneratorViewProps {
    language: AppLanguage;
}

const DemoGeneratorView: React.FC<DemoGeneratorViewProps> = ({ language }) => {
    const [activeTab, setActiveTab] = React.useState("create");
    const [isGenerating, setIsGenerating] = React.useState(false);

    const onGenerate = () => {
        setIsGenerating(true);
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false);
            toast.message(
                language === "es" ? "¡Esto es una demo!" : "This is a demo!",
                {
                    description: language === "es"
                        ? "Regístrate para generar posts reales con IA."
                        : "Sign up to generate real posts with AI.",
                    action: {
                        label: language === "es"
                            ? "Empezar Gratis"
                            : "Start Free",
                        onClick: () =>
                            window.scrollTo({ top: 0, behavior: "smooth" }),
                    },
                },
            );
        }, 2000);
    };

    return (
        <div className="relative bg-slate-900/5 rounded-3xl p-2 ring-1 ring-slate-900/10 shadow-2xl transform hover:scale-[1.01] transition-transform duration-500 ease-out backdrop-blur-sm group">
            {/* App Window Frame */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] relative flex border border-slate-200 shadow-inner">
                {/* Demo Sidebar (Hidden on mobile same as real app) */}
                <div className="hidden md:flex flex-shrink-0">
                    <DemoSidebar
                        language={language}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-slate-50 p-4 md:p-6 lg:p-8 overflow-hidden flex flex-col md:flex-row gap-6 lg:gap-8 h-full">
                    {/* Form Column */}
                    <div className="flex-1 max-w-lg flex flex-col h-full overflow-hidden">
                        <DemoGeneratorForm
                            language={language}
                            onGenerate={onGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>

                    {/* Preview Column */}
                    <div className="hidden lg:flex flex-1 max-w-md pt-0 md:pt-8 flex-col h-full overflow-hidden">
                        <div className="overflow-y-auto no-scrollbar pb-10">
                            <DemoLinkedInPreview
                                language={language}
                                isLoading={isGenerating}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-lg text-xs font-bold text-slate-500 animate-bounce z-10">
                {language === "es"
                    ? "Probar Demo Interactiva"
                    : "Try Interactive Demo"} 👇
            </div>
        </div>
    );
};

export default DemoGeneratorView;
