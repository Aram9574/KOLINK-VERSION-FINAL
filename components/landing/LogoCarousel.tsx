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
            name: "Reddit",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Reddit</title>
                    <path fill="#FF4500" d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
                </svg>
            )
        },
        {
            name: "Facebook",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Facebook</title>
                    <path fill="#0866FF" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
                </svg>
            )
        },
        {
            name: "LinkedIn",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>LinkedIn</title>
                    <path fill="#0a66c2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.063.926 2.063 2.063 0 1.139-.92 2.065-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            )
        },
        {
            name: "X",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>X</title>
                    <path fill="#000000" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                </svg>
            )
        },
        {
            name: "Trustpilot",
            svg: (
                 <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Trustpilot</title>
                    <path fill="#00B67A" d="M12 17.964l5.214-1.321 2.179 6.714L12 17.964zM24 9.286h-9.179L12 .643 9.179 9.286H0l7.429 5.357-2.821 8.643L12 17.929l7.429-5.357 4.571-3.286z"/>
                 </svg>
            )
        }
    ];

    // Duplicate logic specifically for 5 items to ensure smoothness
    // 5 items * 6 = 30 items
    const carouselLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];
    
    return (
        <div id="carousel" className="w-full py-6 sm:py-8 overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] font-display">
                    {language === 'es' ? 'Con la confianza de creadores en' : 'Trusted by creators on'}
                </p>
            </div>

            <div className="relative w-full overflow-hidden group">
                {/* Gradient Masks - matched to bg-white */}
                <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none">
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none">
                </div>

                {/* Scrolling Container */}
                <div className="flex animate-scroll w-[300%] group-hover:[animation-play-state:paused]">
                    {carouselLogos.map((logo, index) => (
                        <div
                            key={`${logo.name}-${index}`}
                            className="flex items-center justify-center min-w-[160px] sm:min-w-[200px] h-20 mx-6 sm:mx-8 transition-all duration-300 cursor-default"
                        >
                            <div className="h-10 sm:h-12 w-auto aspect-square flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                                {logo.svg}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoCarousel;
