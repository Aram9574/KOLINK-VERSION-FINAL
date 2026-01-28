import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';
import { CarouselSlide } from '@/types/carousel';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface RetentionChartProps {
  slides: CarouselSlide[];
}

export const RetentionChart: React.FC<RetentionChartProps> = ({ slides }) => {
  // Mock prediction logic based on slide content
  const data = useMemo(() => {
    if (!slides.length) return [];

    let currentRetention = 100;
    const points = [];

    // Initial point
    points.push({ name: 'Start', retention: 100, label: '100%' });

    slides.forEach((slide, index) => {
      // Logic: 
      // - Slide 1 (Hook): Short hooks (<50 chars) keep 90%, Long hooks (>100) drop to 70%
      // - Slide 2 (Context): Usually good retention if hook worked.
      // - Middle slides: Gradual decay (2-5% per slide)
      // - Last slide (CTA): Big drop off usually, but we track "Reached End".

      let drop = 2; // Base drop
      const textLength = (slide.content.title?.length || 0) + (slide.content.body?.length || 0);

      if (index === 0) { // HOOK
         if (textLength < 40) drop = 5; // Good hook
         else if (textLength > 120) drop = 25; // Too long
         else drop = 10; // Average
      } else {
         // Content density penalty
         if (textLength > 200) drop += 5; 
         // "Wall of text" penalty
      }

      currentRetention = Math.max(10, currentRetention - drop);
      
      points.push({
        name: `Slide ${index + 1}`,
        retention: currentRetention,
        label: `${currentRetention}%`
      });
    });

    return points;
  }, [slides]);

  const score = data.length > 0 ? data[data.length - 1].retention : 0;
  const getScoreColor = (s: number) => {
      if (s > 60) return 'text-green-500';
      if (s > 40) return 'text-amber-500';
      return 'text-red-500';
  };

  return (
    <Card className="p-4 border-slate-200 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-700">Retención Estimada</h3>
            <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    Predicción basada en la longitud y estructura de tus slides.
                </div>
            </div>
        </div>
        <div className={`text-lg font-black ${getScoreColor(score)}`}>
            {score}% <span className="text-[10px] text-slate-400 font-medium uppercase">Finalización</span>
        </div>
      </div>

      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                interval="preserveStartEnd"
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
            />
            <Area 
                type="monotone" 
                dataKey="retention" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRetention)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
