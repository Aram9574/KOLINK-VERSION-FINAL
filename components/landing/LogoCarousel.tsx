import React from "react";
import { translations } from "../../translations";
import { AppLanguage } from "../../types";
import { motion } from "framer-motion";

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
                    <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
                </svg>
            ),
            color: "#FF4500"
        },
        {
            name: "Facebook",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Facebook</title>
                    <path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
                </svg>
            ),
            color: "#0866FF"
        },
        {
            name: "LinkedIn",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>LinkedIn</title>
                    <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.063.926 2.063 2.063 0 1.139-.92 2.065-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            ),
            color: "#0a66c2"
        },
        {
            name: "X",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>X</title>
                    <path fill="currentColor" d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                </svg>
            ),
            color: "#000000"
        },
        {
            name: "Trustpilot",
            svg: (
                 <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Trustpilot</title>
                    <path fill="currentColor" d="M12 17.964l5.214-1.321 2.179 6.714L12 17.964zM24 9.286h-9.179L12 .643 9.179 9.286H0l7.429 5.357-2.821 8.643L12 17.929l7.429-5.357 4.571-3.286z"/>
                 </svg>
            ),
            color: "#00B67A"
        },
        {
            name: "Instagram",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Instagram</title>
                    <path fill="currentColor" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36.105.415 1.227.058 1.265.074 1.647.074 4.85s-.016 3.585-.074 4.85c-.055 1.17-.249 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.05.36-2.227.415-1.266.058-1.648.074-4.85.074s-3.585-.016-4.85-.074c-1.17-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.05-.415-1.227-.058-1.265-.074-1.647-.074-4.85s.016-3.585.074-4.85c.055-1.17.249-1.805.415-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.05-.36 2.227-.415 1.265-.058 1.647-.074 4.85-.074zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.645-1.439 1.44-1.439.794 0 1.44.645 1.44 1.439z"/>
                </svg>
            ),
            color: "#E4405F"
        },
        {
            name: "TikTok",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>TikTok</title>
                    <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.05.34-.05.69-.02 1.04.14.93.71 1.74 1.44 2.3.8.63 1.84.9 2.85.73.9-.1 1.75-.61 2.32-1.32.4-.52.64-1.14.69-1.79.05-.18.06-.36.06-.55V.02h.01z"/>
                </svg>
            ),
            color: "#000000"
        },
        {
            name: "YouTube",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>YouTube</title>
                    <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            ),
            color: "#FF0000"
        },
        {
            name: "Threads",
            svg: (
                <svg role="img" viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <title>Threads</title>
                    <path fill="currentColor" d="M12.554 0c-3.11 0-5.836 1.428-7.564 3.633a10.957 10.957 0 0 0-3.155 7.644c0 1.543.323 3.018.91 4.356C4.168 18.667 7.025 24 12.554 24c4.357 0 7.49-3.235 7.49-7.49v-1.636a2.727 2.727 0 0 0 5.454 0V11.27c0-6.223-5.048-11.27-11.273-11.27h-.671zM12 4.364c3.812 0 6.909 3.097 6.909 6.909v3.272a2.727 2.727 0 0 1-5.454 0v-.545c0-1.206-.978-2.182-2.182-2.182h-.546c-1.204 0-2.182.976-2.182 2.182v3.273c0 1.204.978 2.182 2.182 2.182h3.273v1.636c0 2.709-2.112 4.909-4.717 4.909-3.045 0-5.227-2.613-6.505-5.495-.494-1.115-.767-2.355-.767-3.64 0-3.812 3.097-6.909 6.909-6.909h2.182z"/>
                </svg>
            ),
            color: "#000000"
        }
    ];

    // Duplicate logic to ensure smooth loop
    const carouselLogos = [...logos, ...logos, ...logos, ...logos];
    
    return (
        <section id="logos" className="w-full py-16 sm:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] font-display"
                >
                    {language === 'es' ? 'Con la confianza de creadores en' : 'Trusted by creators on'}
                </motion.p>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-64 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

                {/* Animated Loop */}
                <motion.div 
                    className="flex gap-8 sm:gap-12 w-max px-6 sm:px-12"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        duration: 50, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                >
                    {carouselLogos.map((logo, index) => (
                        <motion.div
                            key={`${logo.name}-${index}`}
                            whileHover={{ 
                                y: -8, 
                                transition: { type: "spring", stiffness: 300, damping: 15 } 
                            }}
                            className="flex-shrink-0"
                        >
                            <div className="group relative">
                                {/* Glow Effect Background */}
                                <div 
                                    className="absolute -inset-2 bg-gradient-to-r from-transparent via-slate-200/30 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" 
                                    style={{ color: logo.color }}
                                />
                                
                                <div className="card-nexus relative flex items-center justify-center w-36 h-28 sm:w-44 sm:h-32 p-8 transition-colors duration-500 hover:border-slate-300 shadow-sm hover:shadow-xl">
                                    <div 
                                        className="h-full w-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 drop-shadow-sm"
                                        style={{ color: logo.color }}
                                    >
                                        {logo.svg}
                                    </div>
                                    
                                    {/* Subtitle Name */}
                                    <span className="absolute bottom-3 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {logo.name}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            
            {/* Soft Ambient Glow Underneath */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-2/3 h-48 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
};

export default LogoCarousel;
