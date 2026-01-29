import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Slider } from '../../ui/slider';
import { Card } from '../../ui/card';
import { useUser } from '../../../context/UserContext';
import { translations } from '../../../translations';

const ROICalculator = () => {
    const { language } = useUser();
    const t = translations[language].roiCalculator;
    
    const [hourlyRate, setHourlyRate] = useState([50]);
    const [weeklyHours, setWeeklyHours] = useState([5]);
    
    const [savings, setSavings] = useState(0);
    const [annualImpact, setAnnualImpact] = useState(0);
    const [timeSaved, setTimeSaved] = useState(0);

    const KOLINK_PRICE = 15; // Monthly cost
    const EFFICIENCY_MULTIPLIER = 0.8; // Kolink saves 80% of time

    useEffect(() => {
        const rate = hourlyRate[0];
        const hours = weeklyHours[0];
        
        // Manual Cost Calculation
        const monthlyHours = hours * 4;
        const manualCost = monthlyHours * rate;
        
        // Kolink Cost Calculation
        // With Kolink, you spend 20% of the time
        const newHours = monthlyHours * (1 - EFFICIENCY_MULTIPLIER);
        const timeSavings = monthlyHours - newHours;
        
        // Money Saved = (Time Saved * Rate) - Subscription Cost
        // Alternatively: (Manual Cost) - (New Time Cost + Subscription)
        // Let's use: Value Generated = Time Saved * Rate
        // Net Savings = (Manual Cost) - (Kolink Price) --> Assuming you stop doing it manually? 
        // Better: Savings = (Manual Cost) - (New Time Cost + Kolink Price)
        
        const newTimeCost = newHours * rate;
        const totalNewCost = newTimeCost + KOLINK_PRICE;
        
        const monthlySavings = manualCost - totalNewCost;
        
        setSavings(Math.round(monthlySavings));
        setAnnualImpact(Math.round(monthlySavings * 12));
        setTimeSaved(Math.round(timeSavings));

    }, [hourlyRate, weeklyHours]);

    return (
        <section className="py-20 relative overflow-hidden">
             {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-2 bg-brand-100 rounded-full mb-4">
                        <Calculator className="w-6 h-6 text-brand-600" />
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
                    <Card className="p-8 border-slate-200 shadow-xl bg-white/80 backdrop-blur-sm flex flex-col justify-center gap-8">
                        
                        {/* Hourly Rate Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-brand-500" />
                                    {t.hourlyRateLabel}
                                </label>
                                <span className="text-2xl font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-100 min-w-[80px] text-center">
                                    {hourlyRate}€
                                </span>
                            </div>
                            <Slider
                                value={hourlyRate}
                                onValueChange={setHourlyRate}
                                max={300}
                                min={10}
                                step={5}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>10€</span>
                                <span>Benchmark: 50€</span>
                                <span>300€</span>
                            </div>
                        </div>

                        {/* Weekly Hours Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="font-bold text-slate-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-brand-500" />
                                    {t.hoursLabel}
                                </label>
                                <span className="text-2xl font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-100 min-w-[80px] text-center">
                                    {weeklyHours}h
                                </span>
                            </div>
                            <Slider
                                value={weeklyHours}
                                onValueChange={setWeeklyHours}
                                max={40}
                                min={1}
                                step={1}
                                className="py-4"
                            />
                             <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                                <span>1h</span>
                                <span>Avg: 5h</span>
                                <span>40h</span>
                            </div>
                        </div>

                    </Card>

                    {/* Results */}
                    <Card className="p-8 border-none shadow-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />
                        
                        <div className="relative z-10 space-y-8">
                            <div>
                                <p className="text-brand-100 font-medium mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    {t.resultSavings}
                                </p>
                                <motion.div 
                                    key={savings}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-5xl font-bold tracking-tight"
                                >
                                    {savings.toLocaleString()}€
                                </motion.div>
                            </div>

                            <div className="pt-6 border-t border-white/20">
                                <p className="text-brand-100 font-medium mb-1">{t.annualImpact}</p>
                                <motion.div 
                                    key={annualImpact}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-3xl font-bold text-green-300"
                                >
                                    +{annualImpact.toLocaleString()}€ / año
                                </motion.div>
                            </div>

                            <div className="pt-2">
                                <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
                                    <span className="text-sm font-medium text-brand-50">{t.timeSaved}</span>
                                    <span className="text-xl font-bold">{timeSaved}h</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default ROICalculator;
