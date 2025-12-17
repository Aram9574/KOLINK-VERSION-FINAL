import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { translations } from "../../translations";
import { AppLanguage, UserProfile } from "../../types";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import ComparisonSection from "./ComparisonSection";
import RoiSection from "./RoiSection";
import PricingSection from "./PricingSection";
import FaqSection from "./FaqSection";
import Footer from "./Footer";
import { useUser } from "../../context/UserContext";
import LogoCarousel from "./LogoCarousel";

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
                "features",
                "how-it-works",
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

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-white font-sans selection:bg-brand-200 selection:text-brand-900">
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

            <main className="pt-20">
                <HeroSection
                    language={language}
                    user={user}
                    mockContent={mockContent}
                    scrollToSection={scrollToSection}
                />

                <ComparisonSection
                    language={language}
                    mockContent={mockContent}
                />

                <FeaturesSection
                    language={language}
                    mockContent={mockContent}
                />

                <HowItWorksSection language={language} />

                <RoiSection language={language} />

                <PricingSection language={language} />

                <FaqSection language={language} />
            </main>

            <Footer language={language} />
        </div>
    );
};

export default LandingPage;
