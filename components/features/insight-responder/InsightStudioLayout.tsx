import React from 'react';

interface InsightStudioLayoutProps {
    editorZone: React.ReactNode;
    previewZone: React.ReactNode;
    hasResults: boolean;
}

export const InsightStudioLayout: React.FC<InsightStudioLayoutProps> = ({
    editorZone,
    previewZone,
    hasResults
}) => {
    return (
        <div className="relative w-full h-full min-h-[calc(100vh-80px)] flex flex-col animate-in fade-in duration-700">
            
            {/* BACKGROUND AMBIANCE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* MAIN SPLIT LAYOUT */}
            <div className={`w-full flex-1 transition-all duration-700 ease-spring ${
                hasResults 
                    ? "flex flex-col lg:flex-row gap-6 items-stretch px-6 lg:px-8 py-6" 
                    : "flex flex-col lg:flex-row gap-6 items-stretch px-6 lg:px-8 py-6"
            }`}>
                
                {/* LEFT: EDITOR ZONE (Controls) */}
                <div className={`transition-all duration-700 flex flex-col ${
                    hasResults 
                        ? "w-full lg:w-1/2 xl:w-5/12" 
                        : "w-full lg:w-1/2 xl:w-5/12"
                }`}>
                    {editorZone}
                </div>

                {/* RIGHT: PREVIEW ZONE (Results) */}
                <div className={`transition-all duration-700 flex flex-col ${
                    hasResults 
                        ? "w-full lg:w-1/2 xl:w-7/12 animate-in slide-in-from-right-10 fade-in duration-700" 
                        : "w-full lg:w-1/2 xl:w-7/12"
                }`}>
                    <div className="h-full min-h-[600px] lg:min-h-[calc(100vh-200px)]">
                        {previewZone}
                    </div>
                </div>

            </div>
        </div>
    );
};
