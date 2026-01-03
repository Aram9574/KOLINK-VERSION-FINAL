import React from "react";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PLANS } from "../../constants";
import { translations } from "../../translations";
import { AppLanguage } from "../../types";

import Section from "@/components/ui/Section";
import { motion } from "framer-motion";
import { hoverClick } from "@/lib/animations";

interface PricingSectionProps {
    language: AppLanguage;
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
    const t = translations[language];

    return (
        <Section id="pricing" withGrid>
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
                    {t.pricing.title}
                </h2>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    {t.pricing.subtitle}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {PLANS.map((plan) => {
                    const planKey = plan.id as "free" | "pro" | "viral";
                    // Fallback to Spanish if key missing (safety) but types ensure it exists
                    const tPlan = t.pricing.plans[planKey] ||
                        t.pricing.plans.free;

                    return (
                        <motion.div
                            key={plan.id}
                            {...hoverClick}
                            className={`relative rounded-3xl p-8 flex flex-col h-full group transition-all duration-300
                            ${
                                plan.highlight
                                    ? "bg-foreground text-background shadow-2xl z-10 ring-1 ring-white/10 scale-[1.02]"
                                    : "card-premium hover:-translate-y-1"
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/25 uppercase tracking-wider flex items-center gap-1.5 ring-4 ring-background">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        {" "}
                                        {t.pricing.mostPopular}
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3
                                    className={`text-2xl font-bold mb-2 font-display ${
                                        plan.highlight
                                            ? "text-primary-foreground"
                                            : "text-foreground"
                                    }`}
                                >
                                    {tPlan.name}
                                </h3>
                                <p
                                    className={`text-sm font-medium leading-relaxed ${
                                        plan.highlight
                                            ? "text-slate-300"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {tPlan.description}
                                </p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span
                                    className={`text-5xl font-display font-bold tracking-tight ${
                                        plan.highlight
                                            ? "text-primary-foreground"
                                            : "text-foreground"
                                    }`}
                                >
                                    €{plan.price}
                                </span>
                                <span
                                    className={`text-lg font-medium ${
                                        plan.highlight
                                            ? "text-slate-400"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    /mo
                                </span>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {tPlan.features.map((feature, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className={`mt-1 p-0.5 rounded-full flex-shrink-0 
                                        ${
                                                plan.highlight
                                                    ? "bg-brand-500/20 text-brand-400"
                                                    : "bg-brand-50 text-brand-600"
                                            }`}
                                        >
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${
                                                plan.highlight
                                                    ? "text-slate-300"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/login"
                                className={`w-full py-4 rounded-full font-bold text-base transition-all duration-200 block text-center flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]
                                ${
                                    plan.highlight
                                        ? "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-ai-hover"
                                        : "bg-secondary hover:bg-slate-200 text-foreground"
                                }`}
                            >
                                {plan.price === 0
                                    ? t.pricing.startFree
                                    : t.pricing.getStarted}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-16 text-center">
                <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500">
                    </span>
                    {t.pricing.footer}
                </p>
            </div>
        </Section>
    );
};

export default PricingSection;
