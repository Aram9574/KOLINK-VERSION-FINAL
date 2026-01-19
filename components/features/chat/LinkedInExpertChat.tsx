import React, { useEffect, useRef, useState } from "react";
import { getAvatarUrl } from "../../../utils.ts";
import {
  MessageSquareText,
  SendHorizontal,
  Sparkles,
  UserCircle2,
  Paperclip,
  BrainCircuit,
  Bot,
  Minimize2,
  Maximize2,
  X,
  Fingerprint,
  CornerDownLeft,
  Mic,
} from "lucide-react";
import Skeleton from "../../ui/Skeleton";
import { useUser } from "../../../context/UserContext.tsx";
import { supabase } from "../../../services/supabaseClient.ts";
import { motion, AnimatePresence } from "framer-motion";
import { hapticFeedback } from "../../../lib/animations.ts";
import { toast } from "sonner";
import { ChatInput } from "../../ui/chat-input";
import { Button } from "../../ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string; // Base64 or URL
}

import { useCredits } from "../../../hooks/useCredits.ts";
import PremiumLockOverlay from "../../ui/PremiumLockOverlay";
import BrandVoiceModal from "../../modals/BrandVoiceModal";

const LinkedInExpertChat: React.FC = () => {
  const { user, language } = useUser();
  const { checkCredits } = useCredits(); // Use Hook

  // --- 1. State ---
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        language === "es"
          ? "¡Hola! Soy Nexus, tu estratega personal de LinkedIn. ¿En qué puedo ayudarte hoy?"
          : "Hello! I'm Nexus, your personal LinkedIn strategist. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGhostwriter, setIsGhostwriter] = useState(false);
  const [showContextSidebar, setShowContextSidebar] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- 2. Refs ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 3. Effects ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Check for Brand Voice
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  useEffect(() => {
    if (user.isPremium && !user.brandVoice) {
       const timer = setTimeout(() => setShowVoiceModal(true), 1500);
       return () => clearTimeout(timer);
    }
  }, [user.brandVoice, user.isPremium]);

  // --- 4. Helpers ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getErrorMessage = (error: string, lang: string) => {
    if (error.includes("insufficient_credits")) {
      return lang === "es"
        ? "No tienes suficientes créditos para esta consulta."
        : "You don't have enough credits for this query.";
    }
    return lang === "es"
      ? "Lo siento, hubo un error procesando tu consulta."
      : "I'm sorry, there was an error processing your query.";
  };

  // --- 5. Gatekeeping ---
  if (!user.isPremium) {
    return (
      <PremiumLockOverlay 
        title="Nexus AI Assistant"
        description={language === "es" 
          ? "Tu estratega personal de LinkedIn. Nexus conoce tu estilo, conoce el algoritmo y te ayuda a redactar posts de alta autoridad en segundos." 
          : "Your personal LinkedIn strategist. Nexus knows your style, knows the algorithm, and helps you write high-authority posts in seconds."}
        icon={<BrainCircuit className="w-8 h-8" />}
      />
    );
  }

  const handleSend = async () => {
    if ((!input.trim() && !imageFile) || isLoading) return;
    
    // Credit Check (Block if < 1)
    if (!checkCredits(1)) return;

    const userMessage = input.trim();
    const currentImage = imagePreview;
    
    // Optimistic Update
    const newMessage: Message = { 
        role: "user", 
        content: userMessage, 
        image: currentImage || undefined 
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    clearImage(); // Clear input state immediately
    setIsLoading(true);

    try {
      // Prepare payload
      const payload: any = { 
          query: userMessage,
          mode: isGhostwriter ? 'ghostwriter' : 'advisor'
      };
      if (currentImage) {
          payload.imageBase64 = currentImage; // Send base64 to backend
      }

      // @ts-ignore
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("NO_SESSION");

      const { data, error } = await supabase.functions.invoke(
        "expert-chat",
        { body: payload }
      );

      if (error) throw error;

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: typeof data.response === 'string' ? data.response : JSON.stringify(data),
      }]);
      
      if (data.strategic_insight) {
          toast.info(data.strategic_insight, { 
              duration: 5000,
              icon: "🧠" 
          });
      }
    } catch (error: any) {
      console.error("Error in chat:", error);
      const msg = error.message || "UNKNOWN_ERROR";
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: getErrorMessage(msg, language),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden ring-1 ring-slate-900/5 relative">

      {/* Sidebar: Context Hub */}
      <AnimatePresence>
        {showContextSidebar && (
            <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:flex flex-col border-r border-slate-200/60 bg-white/50 backdrop-blur-md z-10"
            >
                <div className="p-5 border-b border-slate-200/60 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-brand-600" />
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">Active Context</h3>
                </div>
                
                <div className="flex-1 p-5 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand Voice</label>
                        <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100/50 text-xs text-brand-900 leading-relaxed font-medium">
                            {user?.brandVoice || (language === "es" ? "No definido. Nexus usará un tono profesional estándar." : "Not defined. Nexus will use a standard professional tone.")}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Profile</label>
                        <div className="flex items-center gap-3 p-2 bg-white/60 rounded-xl border border-slate-200/50">
                            <img src={getAvatarUrl(user)} className="w-10 h-10 rounded-full border border-white shadow-sm" alt="User" />
                            <div>
                                <p className="text-sm font-bold text-slate-700 leading-none">{user?.name}</p>
                                <p className="text-[10px] text-slate-500 truncate max-w-[140px] pt-1">{user?.headline || "No headline"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</label>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/50">
                            <span className="text-xs font-medium text-slate-600">Ghostwriter</span>
                            <button 
                                onClick={() => setIsGhostwriter(!isGhostwriter)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${isGhostwriter ? "bg-brand-600" : "bg-slate-300"}`}
                            >
                                <motion.div 
                                    animate={{ x: isGhostwriter ? 20 : 2 }}
                                    className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm" 
                                />
                            </button>
                        </div>
                    </div>

                    {user?.behavioral_dna && (
                        <div className="pt-4 border-t border-slate-100">
                             <div className="flex items-center gap-2 mb-2">
                                <Fingerprint className="w-3.5 h-3.5 text-brand-600" />
                                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">DNA Activo</span>
                             </div>
                             <div className="p-3 bg-brand-50/40 rounded-xl border border-brand-100/50">
                                 <p className="text-[10px] text-brand-800 font-bold mb-1">Nexus te conoce:</p>
                                 <p className="text-[10px] text-slate-500 italic leading-relaxed">
                                     "{user.behavioral_dna.archetype}" • Mimetizando tu voz {user.behavioral_dna.dominant_tone.toLowerCase()}.
                                 </p>
                             </div>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-20">
         {/* Toggle Sidebar Button (Mobile/Desktop) */}
         <button 
            onClick={() => setShowContextSidebar(!showContextSidebar)}
            className="absolute top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-slate-200/60 hover:bg-white text-slate-500 hover:text-indigo-600 transition-all hidden md:block"
        >
            {showContextSidebar ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
         </button>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200/50">
            {messages.map((msg, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25, delay: i * 0.05 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <div className={`
                            flex gap-3 p-4 rounded-2xl shadow-sm backdrop-blur-md border 
                            ${msg.role === "user" 
                                ? "bg-brand-600 text-white rounded-tr-sm border-brand-400/20" 
                                : "bg-white/70 text-slate-700 rounded-tl-sm border-white/50 shadow-soft-glow"}
                        `}>
                            <div className="flex-col w-full">
                                {msg.image && (
                                    <div className="mb-3 rounded-xl overflow-hidden shadow-md border border-white/20">
                                        <img src={msg.image} alt="Uploaded content" className="w-full h-auto max-h-[200px] object-cover" />
                                    </div>
                                )}
                                <div className="text-[15px] leading-relaxed whitespace-pre-line">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                        <span className={`text-[10px] mt-1.5 opacity-40 font-medium px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                             {msg.role === "assistant" ? "Nexus AI • Strategic Advisor" : "You"}
                        </span>
                    </div>
                </motion.div>
            ))}
            
             {/* Loading Indicator */}
            {isLoading && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start w-full"
                >
                    <div className="bg-white/70 backdrop-blur-md border border-white/60 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                         <div className="relative w-8 h-8 flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full rounded-full border-2 border-brand-100 border-t-brand-500"
                            />
                            <Bot className="w-4 h-4 text-brand-500 absolute" />
                         </div>
                         <span className="text-xs font-semibold text-slate-500 animate-pulse">
                             {language === "es" ? "Analizando estrategia..." : "Analyzing strategy..."}
                         </span>
                    </div>
                </motion.div>
            )}
        </div>

        {/* Input Dock */}
        <div className="p-4 md:p-6 bg-white/40 backdrop-blur-md border-t border-slate-100 relative z-30">
            {/* Image Preview Area */}
            <AnimatePresence>
                {imagePreview && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }} 
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className="mb-3 relative inline-block"
                    >
                        <div className="relative group rounded-xl overflow-hidden shadow-md border border-indigo-200">
                             <img src={imagePreview} className="h-20 w-auto object-cover" alt="Preview" />
                             <button 
                                onClick={clearImage}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                             >
                                <X className="w-3 h-3" />
                             </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form 
              className="relative rounded-xl border border-slate-200 bg-white focus-within:ring-1 focus-within:ring-slate-300 p-1 transition-all shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={language === "es" ? "Escribe un borrador o pide consejo..." : "Type a draft or ask for advice..."}
              />
              
              <div className="flex items-center p-2.5 pt-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  <Paperclip className="size-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageSelect}
                />

                <Button variant="ghost" size="icon" type="button" className="text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors ml-1">
                  <Mic className="size-5" />
                  <span className="sr-only">Use Microphone</span>
                </Button>

                <Button
                  type="submit"
                  disabled={(!input.trim() && !imageFile) || isLoading}
                  size="sm"
                  className={`ml-auto gap-1.5 rounded-lg py-5 px-5 font-semibold transition-all ${
                    (!input.trim() && !imageFile) || isLoading
                     ? "bg-slate-100 text-slate-300 pointer-events-none"
                     : "bg-slate-900 text-white hover:bg-black"
                  }`}
                >
                  {isLoading ? (language === "es" ? "Enviando..." : "Sending...") : (language === "es" ? "Enviar Mensaje" : "Send Message")}
                  {!isLoading && <CornerDownLeft className="size-3.5" />}
                </Button>
              </div>
            </form>
            
            <div className="text-center mt-4">
                 <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Nexus AI Strategic Engine (Gemini 3 Flash - SOTA)</span>
                 </p>
            </div>
        </div>
      </div>
      {/* Brand Voice Modal */}
      <BrandVoiceModal 
        isOpen={showVoiceModal} 
        onClose={() => setShowVoiceModal(false)} 
        language={language}
      />

    </div>
  );
};

export default LinkedInExpertChat;
