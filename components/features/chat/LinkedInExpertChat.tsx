import React, { useEffect, useRef, useState } from "react";
import {
    Loader2,
    MessageSquareText,
    SendHorizontal,
    Sparkles,
    UserCircle2,
} from "lucide-react";
import { useUser } from "../../../context/UserContext";
import { supabase } from "../../../services/supabaseClient";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const LinkedInExpertChat: React.FC = () => {
    const { user, language } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: language === "es"
                ? "¡Hola! Soy Nexus. Estoy aquí para potenciar tu presencia en LinkedIn. ¿En qué estrategia trabajamos hoy?"
                : "Hello! I'm Nexus. I'm here to boost your LinkedIn presence. What strategy shall we work on today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(
            (prev) => [...prev, { role: "user", content: userMessage }],
        );
        setIsLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke(
                "expert-chat",
                {
                    body: { query: userMessage },
                },
            );

            if (error) throw error;

            setMessages(
                (prev) => [...prev, {
                    role: "assistant",
                    content: data.response,
                }],
            );
        } catch (error: any) {
            console.error("Error in chat:", error);
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: language === "es"
                    ? "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo."
                    : "Sorry, there was an error processing your query. Please try again.",
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ring-1 ring-slate-900/5">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light">
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles
                        size={120}
                        className="text-white transform rotate-12"
                    />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                        <MessageSquareText size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-xl text-white tracking-tight">
                            Nexus
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse">
                            </div>
                            <p className="text-xs text-brand-50 font-medium">
                                {language === "es"
                                    ? "Online • Experto en LinkedIn"
                                    : "Online • LinkedIn Expert"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        } animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards`}
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <div
                            className={`flex gap-4 max-w-[85%] ${
                                msg.role === "user"
                                    ? "flex-row-reverse"
                                    : "flex-row"
                            }`}
                        >
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                                    msg.role === "user"
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                                        : "bg-white text-brand-600 border border-slate-100"
                                }`}
                            >
                                {msg.role === "user"
                                    ? <UserCircle2 size={24} />
                                    : <MessageSquareText size={20} />}
                            </div>

                            <div
                                className={`flex flex-col ${
                                    msg.role === "user"
                                        ? "items-end"
                                        : "items-start"
                                }`}
                            >
                                <div
                                    className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                        msg.role === "user"
                                            ? "bg-gradient-to-br from-indigo-600 to-brand-600 text-white rounded-tr-sm"
                                            : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm ring-1 ring-slate-900/5"
                                    }`}
                                >
                                    {msg.content.split("\n").map((line, j) => (
                                        <React.Fragment key={j}>
                                            {line}
                                            {j <
                                                    msg.content.split("\n")
                                                            .length - 1 && (
                                                <br />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1.5 px-1 opacity-70">
                                    {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                                <MessageSquareText
                                    size={20}
                                    className="text-brand-400 animate-pulse"
                                />
                            </div>
                            <div className="bg-white px-6 py-5 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:-0.3s]">
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:-0.15s]">
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce">
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-400 animate-pulse">
                                    {language === "es"
                                        ? "Pensando..."
                                        : "Thinking..."}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white border-t border-slate-100/80 backdrop-blur-sm relative z-20">
                <div className="relative flex items-center gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-200 to-indigo-200 rounded-2xl opacity-0 group-focus-within:opacity-50 transition-opacity -m-0.5 blur-sm">
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder={language === "es"
                                ? "Pregúntame sobre estrategias, posts virales..."
                                : "Ask me about strategies, viral posts..."}
                            className="w-full relative bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all shadow-sm"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`p-4 rounded-xl transition-all duration-300 transform ${
                            !input.trim() || isLoading
                                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                                : "bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:scale-95 hover:rotate-2"
                        }`}
                    >
                        {isLoading
                            ? <Loader2 size={24} className="animate-spin" />
                            : <SendHorizontal size={24} />}
                    </button>
                </div>
                <div className="text-center mt-3 flex items-center justify-center gap-1.5 opacity-60">
                    <Sparkles size={10} className="text-brand-500" />
                    <p className="text-[10px] text-slate-400 font-medium">
                        {language === "es"
                            ? "Potenciado por Kolink AI"
                            : "Powered by Kolink AI"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LinkedInExpertChat;
