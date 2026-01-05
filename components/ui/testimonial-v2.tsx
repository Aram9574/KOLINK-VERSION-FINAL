import React from 'react';
import { motion } from "framer-motion";
import { LinkedInPost } from "./linkedin-post";
import Section from "@/components/ui/Section";

// --- Types ---
interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  likes: number;
  comments: number;
  metrics?: {
    value: string;
    label: string;
  };
}

// --- Data (Spanish & Metrics Focused) ---
const testimonials: Testimonial[] = [
  {
    text: "Kolink cambió mi estrategia por completo. Pasé de publicar una vez a la semana a diario sin esfuerzo. La 'Clonación de Voz' es indistinguible de lo que yo escribiría.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Carlos Rodríguez",
    role: "Fundador SaaS B2B",
    likes: 342,
    comments: 49
  },
  {
    text: "Al principio era escéptica con la IA, pero el análisis de voz de Kolink es otro nivel. Captó mi tono irónico a la perfección. Ahora ahorro horas de escritura.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sofía Martínez",
    role: "Marketing Consultant",
    likes: 512,
    comments: 74
  },
  {
    text: "La consistencia era mi mayor problema. Con el calendario y el generador, he duplicado mis seguidores en tiempo récord. Es una herramienta imprescindible.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Javier López",
    role: "Ghostwriter LinkedIn",
    likes: 215,
    comments: 31
  },
  {
    text: "He probado todas las herramientas de IA para LinkedIn. Ninguna se acerca a la precisión de Kolink. Es como tener un equipo de redactores expertos en viralidad.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ana García",
    role: "Coach de Estrategia",
    likes: 604,
    comments: 86
  },
  {
    text: "Lo que antes me tomaba 3 horas, ahora me toma 15 minutos. La función de 'Ideas Virales' nunca falla cuando tengo bloqueo creativo.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Miguel Ángel",
    role: "CEO Tech Startup",
    likes: 89,
    comments: 12
  },
  {
    text: "La calidad de los carruseles que genera es absurda. Mis impresiones se dispararon desde que empecé a usar Kolink para contenido visual.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Lucía Fernández",
    role: "Content Manager",
    likes: 478,
    comments: 68
  },
];

const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role, likes, comments, metrics }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  className="max-w-xs w-full p-0 bg-transparent shadow-none" 
                >
                  <LinkedInPost 
                    name={name}
                    role={role}
                    avatar={image}
                    content={text}
                    likes={likes}
                    comments={comments}
                    metrics={metrics}
                    className="w-full shadow-lg shadow-brand-500/5 hover:shadow-brand-500/10 transition-shadow duration-300"
                  />
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <Section 
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50/50 via-white to-white pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-20">
          <div className="flex justify-center mb-6">
            <div className="border border-brand-200 py-1.5 px-5 rounded-full text-xs font-bold tracking-widest uppercase text-brand-700 bg-brand-50 shadow-sm">
              Testimonios Reales
            </div>
          </div>

          <h2 id="testimonials-heading" className="text-4xl md:text-6xl font-display font-bold tracking-tight text-center text-slate-900 leading-[0.95] mb-6">
            Resultados que hablan<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">por sí mismos</span>
          </h2>
          <p className="text-center text-slate-500 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
            Únete a más de 2,000 creadores y fundadores que ya están escalando su presencia en LinkedIn con Kolink.
          </p>
        </div>

        <div 
          className="flex justify-center gap-6 md:gap-8 max-h-[700px] overflow-hidden relative"
          role="region"
          aria-label="Testimonios de usuarios"
        >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white z-20 pointer-events-none" />

          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
        </div>
      </motion.div>
    </Section>
  );
};

export default TestimonialsSection;
