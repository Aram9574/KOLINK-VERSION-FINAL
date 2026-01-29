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

import { translations } from "../../translations";
import { StickyCTAHeader } from "../marketing/StickyCTAHeader.tsx";
import { SchemaMarkup } from "../seo/SchemaMarkup";


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
                {/* <StickyCTA /> Replaced by Header strategy */}
                <StickyCTAHeader showAfterScrollY={700} />

                <main className="pt-20">
                    <SectionReveal id="hero">
                        <AnimatedHero language={language} />
                    </SectionReveal>

                    {/* Logos - Trust */}
                    <SectionReveal>
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                            <LogoCarousel language={language} />
                        </div>
                    </SectionReveal>

                    {/* Value Prop - What is it? */}
                    <SectionReveal id="tools">
                         <div className="py-16 lg:py-24">
                            <FeaturesBento language={language} />
                         </div>
                    </SectionReveal>


                    {/* Deep Dive - Demo */}
                    <SectionReveal id="demo">
                        <div className="py-16 lg:py-24">
                            <VideoDemoSection language={language} />
                        </div>
                    </SectionReveal>

                    {/* How It Works - Logic */}
                    <SectionReveal id="howitworks">
                        <div className="py-16 lg:py-24">
                            <HowItWorksSection language={language} />
                        </div>
                    </SectionReveal>

                    {/* Comparison - Objection Handling */}
                    <SectionReveal id="comparison">
                        <div className="py-16 lg:py-24">
                            <ComparisonSection
                                language={language}
                                mockContent={mockContent}
                            />
                        </div>
                    </SectionReveal>

                    <SectionReveal>
                        <div className="pb-16 lg:pb-24">
                            <StrategicComparison language={language} />
                        </div>
                    </SectionReveal>

                    {/* Social Proof - Verification */}
                    <SectionReveal id="results">
                         <div className="py-16 lg:py-24">
                            <TestimonialsSection />
                        </div>
                    </SectionReveal>

                    {/* ROI - Rationalization */}
                    <SectionReveal>
                        <div className="py-16 lg:py-24">
                            <RoiSection language={language} />
                        </div>
                    </SectionReveal>

                    {/* Pricing - Conversion */}
                    <SectionReveal id="pricing">
                        <div className="py-16 lg:py-24">
                            <PricingSection language={language} />
                        </div>
                    </SectionReveal>

                    {/* FAQ - Closing */}
                    <SectionReveal id="faq">
                        <div className="py-16 lg:py-24">
                            <FaqSection language={language} />
                        </div>
                    </SectionReveal>
                </main>

                <Footer language={language} scrollToSection={scrollToSection} />
             </div>
            </div>
    );
};

export default LandingPage;
