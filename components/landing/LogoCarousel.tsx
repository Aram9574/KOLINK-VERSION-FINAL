import React from "react";
import { translations } from "../../translations";
import { AppLanguage } from "../../types";

interface LogoCarouselProps {
    language: AppLanguage;
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({ language }) => {
    const t = translations[language];
    const logos = [
        {
            name: "Microsoft",
            url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        },
        {
            name: "SAP",
            url: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
        },
        {
            name: "Canon",
            url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Canon_logo.svg",
        },
        {
            name: "EY",
            url: "https://upload.wikimedia.org/wikipedia/commons/3/34/EY_logo_2019.svg",
        },
        {
            name: "Accenture",
            url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        },
        {
            name: "OMR",
            url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/OMR_Logo.svg",
        },
        {
            name: "EPLAN",
            url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Eplan_Logo.svg",
        },
        {
            name: "WTS",
            url: "https://upload.wikimedia.org/wikipedia/commons/e/e9/WTS_Group_logo.svg",
        },
        {
            name: "FYGI",
            url: "https://fygioslo.no/wp-content/themes/fygi/img/logo.svg",
        },
        {
            name: "Epilot",
            url: "https://logo.clearbit.com/epilot.cloud",
        },
        {
            name: "Notus",
            url: "https://logo.clearbit.com/notus.li",
        },
        {
            name: "Canon",
            url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Canon_logo.svg",
        },
    ];

    // Duplicate the logos to create a seamless infinite loop
    const carouselLogos = [...logos, ...logos, ...logos];
    return (
        <div className="w-full py-8 overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {t.socialProof}
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
