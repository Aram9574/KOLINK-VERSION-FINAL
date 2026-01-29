import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Slider } from '../../ui/slider';
import { Card } from '../../ui/card';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

const CommissionCalculator = () => {
    const { language } = useUser();
    const t = translations[language].affiliatePage.calculator;
    
    const [referrals, setReferrals] = useState([10]);
    // 0 = Starter (0€), 1 = Pro (15€), 2 = Viral (49€)
    // Let's simplify: Average Revenue Per User (ARPU).
    // Let's say user selects avg plan price.
    const [avgPlanPrice, setAvgPlanPrice] = useState([29]); // Blended ARPU

    const [monthlyCommission, setMonthlyCommission] = useState(0);
    const [annualProjection, setAnnualProjection] = useState(0);

    const COMMISSION_RATE = 0.30;

    useEffect(() => {
        const activeRefs = referrals[0];
        const price = avgPlanPrice[0];
        
        const mrr = activeRefs * price * COMMISSION_RATE;
        
        setMonthlyCommission(Math.round(mrr));
        setAnnualProjection(Math.round(mrr * 12));

    }, [referrals, avgPlanPrice]);

    return (
        <section className="py-20 relative overflow-hidden bg-slate-50">
             {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
                        <Calculator className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                        {t.title}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Inputs */}
                    <Card className="p-8 border-slate-200 shadow-xl bg-white flex flex-col justify-center gap-8">
                        
                        {/* Referrals Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-indigo-500" />
                                    {t.referralsLabel}
                                </label>
                                <span className="text-2xl font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 min-w-[60px] text-center">
                                    {referrals}
                                </span>
                            </div>
                            <Slider
                                value={referrals}
                                onValueChange={setReferrals}
                                max={500}
                                min={1}
                                step={1}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>1</span>
                                <span>100</span>
                                <span>500</span>
                            </div>
                        </div>

                        {/* Avg Plan Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-indigo-500" />
                                    {t.planLabel} (Avg)
                                </label>
                                <span className="text-2xl font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 min-w-[60px] text-center">
                                    {avgPlanPrice}€
                                </span>
                            </div>
                            <Slider
                                value={avgPlanPrice}
                                onValueChange={setAvgPlanPrice}
                                max={49}
                                min={15}
                                step={1}
                                className="py-4"
                            />
                             <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>15€ (Pro)</span>
                                <span>49€ (Viral)</span>
                            </div>
                        </div>

                    </Card>

                    {/* Results */}
                    <Card className="p-8 border-none shadow-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden group">
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-all duration-700" />
                        
                        <div className="relative z-10 space-y-8">
                            <div>
                                <p className="text-indigo-200 font-medium mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    {t.resultMonthly} (30%)
                                </p>
                                <motion.div 
                                    key={monthlyCommission}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-5xl font-bold tracking-tight text-white"
                                >
                                    {monthlyCommission.toLocaleString()}€
                                </motion.div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <p className="text-indigo-200 font-medium mb-1">{t.resultYearly}</p>
                                <motion.div 
                                    key={annualProjection}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-3xl font-bold text-green-400"
                                >
                                    {annualProjection.toLocaleString()}€
                                </motion.div>
                            </div>

                            <p className="text-xs text-slate-400 italic pt-4 opacity-70">
                                * {t.disclaimer}
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default CommissionCalculator;
