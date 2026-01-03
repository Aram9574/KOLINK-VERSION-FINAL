import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar.tsx";
import { Hero as AnimatedHero } from "../ui/animated-hero.tsx";
import { FeaturesBento } from './FeaturesBento.tsx';
import HowItWorksSection from "./HowItWorksSection.tsx";
import ComparisonSection from "./ComparisonSection.tsx";
import StrategicComparison from "./StrategicComparison.tsx";
import RoiSection from "./RoiSection.tsx";
import PricingSection from "./PricingSection.tsx";
import FaqSection from "./FaqSection.tsx";
import Footer from "./Footer.tsx";
import { useUser } from "../../context/UserContext.tsx";
import LogoCarousel from "./LogoCarousel.tsx";
import TestimonialsSection from "../ui/testimonial-v2.tsx";
import { InfiniteGrid } from "../ui/infinite-grid-integration.tsx";
import VideoDemoSection from "./VideoDemoSection.tsx";
import { motion } from "framer-motion";
import SmartCursor from "../ui/SmartCursor.tsx";

const SectionReveal = ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <motion.div
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

const LandingPage: React.FC = () => {
    const { user, language, setLanguage } = useUser();
    const [activeSection, setActiveSection] = useState<string>("hero");
    const isEs = language === "es";

    // Redirect to dashboard if user is already logged in
    if (user && user.id && !user.id.startsWith("mock-")) {
        return <Navigate to="/dashboard" replace />;
    }

    // Mock Content Localization
    const mockContent = isEs
        ? {
            level: "NIVEL 1",
            creator: "Creador",
            studio: "Estudio",
            ideas: "Ideas",
            autopilot: "AutoPilot",
            history: "Historial",
            settings: "Ajustes",
            credits: "20 créditos",
            topicLabel: "Tema o Idea",
            topicValue:
                "Cómo la consistencia vence a la intensidad en LinkedIn...",
            audienceLabel: "Audiencia",
            audienceValue: "Fundadores SaaS, Creadores",
            toneLabel: "Tono",
            toneValue: "Controvertido",
            structureLabel: "Estructura",
            creativityLabel: "Creatividad",
            creativityValue: "Alta",
            generate: "Generar",
            postHeader: "Founder @ Kolink",
            postContent:
                "Deja de mirar una página en blanco. 🛑\n\nLa mayoría pierde 10 horas/semana pensando qué escribir.\n\nMientras tanto, el top 1% usa frameworks.\n\nAquí está el secreto: No necesitas más creatividad. Necesitas mejor arquitectura.\n\nEl Framework PAS para viralidad:\n❌ Problema: El bloqueo mata el impulso.\n🔥 Agitación: La inconsistencia mata el alcance.\n✅ Solución: Usa estructuras probadas.",
            postTags: "#GrowthHacking #LinkedInTips #AI",
            voiceCardTitle: "ADN de Marca",
            voiceCardVal: "Clonación: 99%",
            viralCardTitle: "Alcance Viral",
            viralCardVal: "Potencial: Alto",
            // NEW
            badPost:
                "Me complace anunciar que hoy he reflexionado sobre la importancia de la consistencia. La consistencia es clave porque nos permite desarrollar hábitos duraderos. Además, es fundamental mantenerse motivado incluso cuando los resultados no son inmediatos para poder alcanzar el éxito a largo plazo en nuestras carreras profesionales...",
            goodPostHook: "La consistencia vence a la intensidad.",
            goodPostBody:
                "La mayoría falla porque corre un sprint.\nEl 1% gana porque camina cada día.\n\nAquí mi sistema de 3 pasos: 👇",
        }
        : {
            level: "LEVEL 1",
            creator: "Creator",
            studio: "Studio",
            ideas: "Ideas",
            autopilot: "AutoPilot",
            history: "History",
            settings: "Settings",
            credits: "20 credits",
            topicLabel: "Topic or Idea",
            topicValue: "How consistency beats intensity on LinkedIn...",
            audienceLabel: "Audience",
            audienceValue: "SaaS Founders, Creators",
            toneLabel: "Tone",
            toneValue: "Controversial",
            structureLabel: "Structure",
            creativityLabel: "Creativity",
            creativityValue: "High",
            generate: "Generate",
            postHeader: "Founder @ Kolink",
            postContent:
                "Stop staring at a blank page. 🛑\n\nMost people waste 10 hours/week thinking what to write.\n\nMeanwhile, the top 1% use frameworks.\n\nHere is the secret: You don't need more creativity. You need better architecture.\n\nThe PAS Framework for virality:\n❌ Problem: Writer's block kills momentum.\n🔥 Agitate: Inconsistency kills reach.\n✅ Solution: Use proven structures.",
            postTags: "#GrowthHacking #LinkedInTips #AI",
            voiceCardTitle: "Brand DNA",
            voiceCardVal: "Voice Match: 99%",
            viralCardTitle: "Viral Reach",
            viralCardVal: "Potential: High",
            // NEW
            badPost:
                "I am thrilled to announce that today I have been reflecting on the importance of consistency. Consistency is key because it allows us to build lasting habits. Furthermore, it is fundamental to stay motivated even when results are not immediate in order to achieve long-term success in our professional careers...",
            goodPostHook: "Consistency > Intensity.",
            goodPostBody:
                "Most people fail because they sprint.\nThe top 1% win because they walk everyday.\n\nHere is my 3-step system: 👇",
        };

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
                "tools",
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
            <InfiniteGrid className="font-sans selection:bg-brand-200 selection:text-brand-900">
             <div className="relative z-10">
                <Helmet>
                    <title>Kolink - Viral LinkedIn Studio</title>
                    <meta
                        name="description"
                        content="Crea posts virales en segundos con IA. La herramienta definitiva para crecer en LinkedIn."
                    />
                </Helmet>

                <Navbar
                    language={language}
                    setLanguage={setLanguage}
                    user={user}
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />

                <SmartCursor />

                <main className="pt-20">
                    <SectionReveal id="hero">
                        <AnimatedHero language={language} />
                    </SectionReveal>
                    
                    <SectionReveal>
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-10 relative z-10">
                            <LogoCarousel language={language} />
                        </div>
                    </SectionReveal>

                    <SectionReveal id="demo">
                        <VideoDemoSection language={language} />
                    </SectionReveal>

                    <SectionReveal id="tools">
                         <FeaturesBento language={language} />
                    </SectionReveal>

                    <SectionReveal id="howitworks">
                        <HowItWorksSection language={language} />
                    </SectionReveal>

                    <SectionReveal id="comparison">
                        <ComparisonSection
                            language={language}
                            mockContent={mockContent}
                        />
                    </SectionReveal>

                    <SectionReveal>
                        <StrategicComparison language={language} />
                    </SectionReveal>

                    <SectionReveal>
                        <RoiSection language={language} />
                    </SectionReveal>

                    <SectionReveal id="results">
                        <TestimonialsSection />
                    </SectionReveal>

                    <SectionReveal id="pricing">
                        <PricingSection language={language} />
                    </SectionReveal>

                    <SectionReveal id="faq">
                        <FaqSection language={language} />
                    </SectionReveal>
                </main>

                <Footer language={language} scrollToSection={scrollToSection} />
             </div>
            </InfiniteGrid>

    );
};

export default LandingPage;
