import React from "react";
import { AppLanguage } from "../../types";

interface LogoCarouselProps {
    language: AppLanguage;
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ language }) => {
    const logos = [
        {
            name: "Google",
            url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        },
        {
            name: "Microsoft",
            url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        },
        {
            name: "Spotify",
            url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
        },
        {
            name: "Amazon",
            url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        },
        {
            name: "OpenAI",
            url: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
        },
        {
            name: "TechCrunch",
            url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/TechCrunch_logo.svg",
        },
        {
            name: "The Verge",
            url: "https://upload.wikimedia.org/wikipedia/commons/a/af/The_Verge_logo.svg",
        },
        {
            name: "Wired",
            url: "https://upload.wikimedia.org/wikipedia/commons/9/95/Wired_logo.svg",
        },
    ];

    // Duplicate the logos to create a seamless infinite loop
    const carouselLogos = [...logos, ...logos, ...logos];
    return (
        <div className="w-full py-8 overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {language === "es"
                        ? "Reconocido por líderes de la industria"
                        : "Trusted by industry leaders"}
                </p>
            </div>

            <div className="relative w-full overflow-hidden group">
                {/* Gradient Masks for smooth fade out at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none">
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none">
                </div>

                {/* Scrolling Container */}
                <div className="flex animate-scroll w-[200%] group-hover:[animation-play-state:paused]">
                    {carouselLogos.map((logo, index) => (
                        <div
                            key={`${logo.name}-${index}`}
                            className="flex items-center justify-center min-w-[160px] h-12 mx-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                        >
                            <img
                                src={logo.url}
                                alt={`${logo.name} logo`}
                                className="h-8 md:h-10 w-auto object-contain select-none pointer-events-none"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoCarousel;
