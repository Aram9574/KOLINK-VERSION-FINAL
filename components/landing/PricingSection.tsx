import React from "react";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PLANS } from "../../constants";
import { translations } from "../../translations";
import { AppLanguage } from "../../types";

interface PricingSectionProps {
    language: AppLanguage;
}

const PricingSection: React.FC<PricingSectionProps> = ({ language }) => {
    const t = translations[language];

    return (
        <section
            id="pricing"
            className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden"
        >
            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
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
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 flex flex-col h-full transition-all duration-300 group
                                ${
                                    plan.highlight
                                        ? "bg-slate-900 text-white shadow-2xl scale-105 z-10 ring-1 ring-white/10"
                                        : "bg-white text-slate-900 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-brand-200 hover:-translate-y-1"
                                }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/25 uppercase tracking-wider flex items-center gap-1.5 ring-4 ring-slate-50">
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
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        {tPlan.name}
                                    </h3>
                                    <p
                                        className={`text-sm font-medium leading-relaxed ${
                                            plan.highlight
                                                ? "text-slate-300"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {tPlan.description}
                                    </p>
                                </div>

                                <div className="mb-8 flex items-baseline gap-1">
                                    <span
                                        className={`text-5xl font-display font-bold tracking-tight ${
                                            plan.highlight
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    >
                                        €{plan.price}
                                    </span>
                                    <span
                                        className={`text-lg font-medium ${
                                            plan.highlight
                                                ? "text-slate-400"
                                                : "text-slate-400"
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
                                                        : "text-slate-600"
                                                }`}
                                            >
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    to="/login"
                                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 block text-center flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]
                                    ${
                                        plan.highlight
                                            ? "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/25"
                                            : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                                    }`}
                                >
                                    {plan.price === 0
                                        ? t.pricing.startFree
                                        : t.pricing.getStarted}
                                </Link>
                            </div>
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
            </div>
        </section>
    );
};

export default PricingSection;
