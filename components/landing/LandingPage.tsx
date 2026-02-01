import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
import VideoDemoSection from "./VideoDemoSection.tsx";
import { motion } from "framer-motion";
import SmartCursor from "../ui/SmartCursor.tsx";


import { translations } from "../../translations";
import { StickyCTAHeader } from "../marketing/StickyCTAHeader.tsx";
import { SchemaMarkup } from "../seo/SchemaMarkup";
import { LaunchCountdown } from "../marketing/LaunchCountdown";
import MetaTags from "../seo/MetaTags";
import { PageTransition } from "../ui/PageTransition";


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
                <MetaTags 
                    title={t.landing.meta.title}
                    description={t.landing.meta.description}
                    keywords={t.landing.meta.keywords}
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
                        <section aria-label="Trusted By" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                            <LogoCarousel language={language} />
                        </section>
                    </SectionReveal>

                    {/* Value Prop - What is it? */}
                    <SectionReveal id="tools">
                         <section aria-label="Features" className="py-16 lg:py-24">
                            <FeaturesBento language={language} />
                         </section>
                    </SectionReveal>


                    {/* Deep Dive - Demo */}
                    <SectionReveal id="demo">
                        <section aria-label="Product Demo" className="py-16 lg:py-24">
                            <VideoDemoSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* How It Works - Logic */}
                    <SectionReveal id="howitworks">
                        <section aria-label="How It Works" className="py-16 lg:py-24">
                            <HowItWorksSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* Comparison - Objection Handling */}
                    <SectionReveal id="comparison">
                        <section aria-label="Comparison" className="py-16 lg:py-24">
                            <ComparisonSection
                                language={language}
                                mockContent={mockContent}
                            />
                        </section>
                    </SectionReveal>

                    <SectionReveal>
                        <section aria-label="Strategy" className="pb-16 lg:pb-24">
                            <StrategicComparison language={language} />
                        </section>
                    </SectionReveal>

                    {/* Social Proof - Verification */}
                    <SectionReveal id="results">
                         <section aria-label="Testimonials" className="py-16 lg:py-24">
                            <TestimonialsSection />
                        </section>
                    </SectionReveal>

                    {/* ROI - Rationalization */}
                    <SectionReveal>
                        <section aria-label="ROI Analysis" className="py-16 lg:py-24">
                            <RoiSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* Pricing - Conversion */}
                    <SectionReveal id="pricing">
                        <section aria-label="Pricing" className="py-16 lg:py-24">
                            <PricingSection language={language} />
                        </section>
                    </SectionReveal>

                    {/* FAQ - Closing */}
                    <SectionReveal id="faq">
                        <section aria-label="FAQ" className="py-16 lg:py-24">
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
