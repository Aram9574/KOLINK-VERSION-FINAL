import React, { useEffect, useState, lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar.tsx";
import { Hero as AnimatedHero } from "../ui/animated-hero.tsx";
import { motion } from "framer-motion";
import SmartCursor from "../ui/SmartCursor.tsx";
import { translations } from "../../translations";
import { StickyCTAHeader } from "../marketing/StickyCTAHeader.tsx";
import { SchemaMarkup } from "../seo/SchemaMarkup";
import { LaunchCountdown } from "../marketing/LaunchCountdown";
import MetaTags from "../seo/MetaTags";
import { PageTransition } from "../ui/PageTransition";
import Skeleton from "../ui/Skeleton";
import { useUser } from "../../context/UserContext.tsx";

// Lazy loaded sections
const FeaturesBento = React.lazy(() => import('./FeaturesBento.tsx').then(m => ({ default: m.FeaturesBento })));
const HowItWorksSection = React.lazy(() => import("./HowItWorksSection.tsx"));
const ComparisonSection = React.lazy(() => import("./ComparisonSection.tsx"));
const StrategicComparison = React.lazy(() => import("./StrategicComparison.tsx"));
const RoiSection = React.lazy(() => import("./RoiSection.tsx"));
const PricingSection = React.lazy(() => import("./PricingSection.tsx"));
const FaqSection = React.lazy(() => import("./FaqSection.tsx"));
const Footer = React.lazy(() => import("./Footer.tsx"));
const LogoCarousel = React.lazy(() => import("./LogoCarousel.tsx"));
const TestimonialsSection = React.lazy(() => import("../ui/testimonial-v2.tsx"));
const VideoDemoSection = React.lazy(() => import("./VideoDemoSection.tsx"));


const SectionReveal = ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <motion.div
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
        <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><Skeleton className="w-full h-full max-w-7xl rounded-3xl" /></div>}>
            {children}
        </Suspense>
    </motion.div>
);

const LandingPage: React.FC = () => {
    const { user, language, setLanguage } = useUser();
    const [activeSection, setActiveSection] = useState<string>("hero");
    const t = translations[language];

    // Redirect to dashboard if user is already logged in
    if (user && user.id && !user.id.startsWith("mock-")) {
        return <Navigate to="/dashboard" replace />;
    }

    // Use Centralized Mock Content from translations
    const mockContent = t.landing.mock;

    // Handle smooth scrolling with offset for fixed header
    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string,
    ) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Adjust based on navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY -
                headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
            // Manually set active section immediately for better UX
            setActiveSection(sectionId);
        }
    };

    // Update active section on scroll with Intersection Observer
    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                "hero",
                "demo",
                "viral-calc",
                "tools",
                "solutions",
                "how-it-works",
                "comparison",
                "testimonials",
                "pricing",
                "faq",
            ];
            const scrollPosition = window.scrollY + 100; // Offset

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        globalThis.addEventListener("scroll", handleScroll);
        return () => globalThis.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <PageTransition>
            <div className="font-sans selection:bg-brand-200 selection:text-brand-900 pb-20">
             <div className="relative z-10">
                <SchemaMarkup 
                    type="SoftwareApplication"
                    data={{
                        "name": "Kolink AI",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "The AI partner for LinkedIn creators. Generate viral carousels, audit profiles, and schedule posts."
                    }}
                />
                <SchemaMarkup 
                    type="FAQPage"
                    data={{
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": t.faq.q1,
                                "acceptedAnswer": { "@type": "Answer", "text": t.faq.a1 }
                            },
                            {
                                "@type": "Question",
                                "name": t.faq.q2,
                                "acceptedAnswer": { "@type": "Answer", "text": t.faq.a2 }
                            },
                            {
                                "@type": "Question",
                                "name": t.faq.q3,
                                "acceptedAnswer": { "@type": "Answer", "text": t.faq.a3 }
                            },
                            {
                                "@type": "Question",
                                "name": t.faq.q4,
                                "acceptedAnswer": { "@type": "Answer", "text": t.faq.a4 }
                            }
                        ]
                    }}
                />
                <SchemaMarkup 
                    type="HowTo"
                    data={{
                        "name": t.howItWorks.title,
                        "description": t.howItWorks.subtitle,
                        "step": [
                            {
                                "@type": "HowToStep",
                                "name": language === 'es' ? "Semilla de Idea" : "Idea Seed",
                                "text": language === 'es' 
                                    ? "Nunca más te quedes mirando la página en blanco. Genera 50 ideas de alto impacto en segundos."
                                    : "Never stare at a blank page again. Generate 50 high-impact ideas in seconds."
                            },
                            {
                                "@type": "HowToStep",
                                "name": language === 'es' ? "Arquitectura Viral" : "Viral Architecture",
                                "text": language === 'es'
                                    ? "Estructuras probadas por el Top 1% (AIDA, PAS, Storytelling). Escribe como un experto, al instante."
                                    : "Frameworks proven by the Top 1%. Write like an expert, instantly."
                            },
                            {
                                "@type": "HowToStep",
                                "name": language === 'es' ? "Lanzamiento y Escala" : "Launch & Scale",
                                "text": language === 'es'
                                    ? "Publica con absoluta confianza. Convierte los likes en leads y los leads en ingresos."
                                    : "Publish with total confidence. Turn likes into leads and leads into revenue."
                            }
                        ]
                    }}
                />
                <MetaTags 
                    title={t.landing.meta.title}
                    description={t.landing.meta.description}
                    keywords={t.landing.meta.keywords}
                    language={language}
                />

                <LaunchCountdown language={language} />

                <Navbar
                    language={language}
                    setLanguage={setLanguage}
                    user={user}
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />

                <SmartCursor />
                {/* <StickyCTA /> Replaced by Header strategy */}
                <StickyCTAHeader showAfterScrollY={700} />

                <main className="pt-8">
                    <SectionReveal id="hero">
                        <section aria-label="Hero">
                            <AnimatedHero language={language} />
                        </section>
                    </SectionReveal>

                    {/* Logos - Trust */}
                    <SectionReveal>
                        <section aria-label="Trusted By" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                            <LogoCarousel language={language} />
                        </section>
                    </SectionReveal>

                    {/* Value Prop - What is it? */}
                    <SectionReveal id="tools">
                         <section aria-label="Features" className="py-8 lg:py-12">
                            <FeaturesBento language={language} />
                         </section>
                    </SectionReveal>


                    {/* Deep Dive - Demo */}
                    <SectionReveal id="demo">
                        <section aria-label="Product Demo" className="py-8 lg:py-12">
                            <VideoDemoSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* How It Works - Logic */}
                    <SectionReveal id="howitworks">
                        <section aria-label="How It Works" className="py-8 lg:py-12">
                            <HowItWorksSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* Comparison - Objection Handling */}
                    <SectionReveal id="comparison">
                        <section aria-label="Comparison" className="py-8 lg:py-12">
                            <ComparisonSection
                                language={language}
                                mockContent={mockContent}
                            />
                        </section>
                    </SectionReveal>

                    <SectionReveal>
                        <section aria-label="Strategy" className="pb-8 lg:pb-12">
                            <StrategicComparison language={language} />
                        </section>
                    </SectionReveal>

                    {/* Social Proof - Verification */}
                    <SectionReveal id="results">
                         <section aria-label="Testimonials" className="py-8 lg:py-12">
                            <TestimonialsSection />
                        </section>
                    </SectionReveal>

                    {/* ROI - Rationalization */}
                    <SectionReveal>
                        <section aria-label="ROI Analysis" className="py-8 lg:py-12">
                            <RoiSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* Pricing - Conversion */}
                    <SectionReveal id="pricing">
                        <section aria-label="Pricing" className="py-8 lg:py-12">
                            <PricingSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* FAQ - Closing */}
                    <SectionReveal id="faq">
                        <section aria-label="FAQ" className="py-8 lg:py-12">
                            <FaqSection language={language} />
                        </section>
                    </SectionReveal>
                </main>
                
                <footer role="contentinfo">
                    <Footer language={language} scrollToSection={scrollToSection} />
                </footer>
             </div>
            </div>
        </PageTransition>
    );
};

export default LandingPage;
