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
import { lazy, Suspense } from "react";

import { NicheLinks } from "./NicheLinks.tsx";
import { translations } from "../../translations";
import ExitIntentModal from "../ui/ExitIntentModal.tsx";
import StickyCTA from "../ui/StickyCTA.tsx";
import FomoToast from "../ui/FomoToast.tsx";

const ViralCalculator = lazy(() => import("../marketing/ViralCalculator.tsx"));

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
    const t = translations[language];
    const isEs = language === "es";

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
            <div className="font-sans selection:bg-brand-200 selection:text-brand-900 pb-20">
             <div className="relative z-10">
                <Helmet>
                    <title>{t.landing.meta.title}</title>
                    <meta
                        name="description"
                        content={t.landing.meta.description}
                    />
                    <meta name="keywords" content={t.landing.meta.keywords} />
                </Helmet>

                <Navbar
                    language={language}
                    setLanguage={setLanguage}
                    user={user}
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />

                <SmartCursor />
                <ExitIntentModal />
                <StickyCTA />
                <FomoToast />

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

                    <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>}>
                        <SectionReveal id="viral-calc">
                            <ViralCalculator />
                        </SectionReveal>
                    </Suspense>

                    <SectionReveal id="tools">
                         <FeaturesBento language={language} />
                    </SectionReveal>

                    <SectionReveal id="solutions">
                        <NicheLinks language={language} />
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
            </div>
    );
};

export default LandingPage;
