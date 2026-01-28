import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Swords, Trophy, Loader2, Target } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

export const HeadlineBattle = () => {
    const [headlineA, setHeadlineA] = useState("");
    const [headlineB, setHeadlineB] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ winner: 'A' | 'B'; reason: string; scoreA: number; scoreB: number } | null>(null);

    const handleBattle = async () => {
        if (!headlineA || !headlineB) {
            toast.error("¡Ingresa ambos titulares para la batalla!");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('generate-viral-post', {
                body: {
                    params: {
                        mode: 'compare_hooks',
                        hook_a: headlineA,
                        hook_b: headlineB
                    }
                }
            });

            if (error) throw error;

            console.log("Battle Result:", data);

            // Assuming response data shape
            if (data.data) {
                setResult(data.data);
            } else {
                throw new Error("Invalid response");
            }

        } catch (err) {
            console.error(err);
            toast.error("The referee is blind! (AI Function Failed)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 border-slate-200/60 bg-white/50 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Swords className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-700">Arena de Titulares</h3>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-md" />
                    <Input 
                        placeholder="Contrincante A (ej. 5 Tips para Ventas)" 
                        value={headlineA}
                        onChange={(e) => setHeadlineA(e.target.value)}
                        className="pl-4 border-slate-200 bg-white"
                    />
                    {result?.winner === 'A' && <Trophy className="absolute right-3 top-2.5 w-5 h-5 text-yellow-500 animate-bounce" />}
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full border border-white">VS</div>
                </div>

                <div className="relative group">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-500 rounded-r-md" />
                    <Input 
                        placeholder="Contrincante B (ej. Deja de Vender, Ayuda)" 
                        value={headlineB}
                        onChange={(e) => setHeadlineB(e.target.value)}
                        className="pl-4 border-slate-200 bg-white"
                    />
                     {result?.winner === 'B' && <Trophy className="absolute right-3 top-2.5 w-5 h-5 text-yellow-500 animate-bounce" />}
                </div>

                <Button 
                    onClick={handleBattle} 
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
                    {loading ? "Peleando..." : "¡PELEAR!"}
                </Button>

                {result && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Declaración del Ganador</span>
                            <span className="text-xs font-mono font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                {result.winner === 'A' ? 'Gana A' : 'Gana B'}
                            </span>
                        </div>
                         <p className="text-sm text-slate-700 leading-relaxed">
                            {result.reason}
                        </p>
                        <div className="flex gap-4 mt-3 pt-3 border-t border-slate-50">
                             <div className="flex-1 text-center">
                                <div className="text-[10px] uppercase text-slate-400 font-bold">Puntaje A</div>
                                <div className="text-xl font-black text-blue-600">{result.scoreA}</div>
                             </div>
                             <div className="w-px bg-slate-100" />
                              <div className="flex-1 text-center">
                                <div className="text-[10px] uppercase text-slate-400 font-bold">Puntaje B</div>
                                <div className="text-xl font-black text-pink-600">{result.scoreB}</div>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};
