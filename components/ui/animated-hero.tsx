import Section from "@/components/ui/Section.tsx";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { translations } from "../../translations.ts";
import { AppLanguage } from "../../types.ts";

interface HeroProps {
  language: AppLanguage;
}

function Hero({ language }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const t = translations[language as AppLanguage];
  const titles = t.hero.rotatingWords;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <Section withGrid className="pt-32 pb-20">
      <div className="flex gap-8 items-center justify-center flex-col">
        <div className="flex gap-4 flex-col items-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-6xl tracking-tighter text-center font-regular leading-[1.1]">
            <span className="text-foreground">{t.hero.titleLine1}</span>
            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-6 md:pt-2 min-h-[1.3em]">
              &nbsp;
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={titleNumber}
                  className="absolute font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-accent to-brand-500 whitespace-nowrap px-4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40, position: "absolute" }}
                  transition={{ 
                    y: { type: "spring", stiffness: 100, damping: 20 },
                    opacity: { duration: 0.2 } // Faster fade for crispness
                  }}
                >
                  {titles[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="text-xl md:text-2xl leading-relaxed tracking-tight text-muted-foreground max-w-3xl text-center">
            {t.hero.subtitle}
          </p>
        </div>
        <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4 rounded-full" variant="outline">
            {t.hero.ctaSecondary} <PhoneCall className="w-4 h-4" />
          </Button>
          <Button size="lg" className="gap-4 rounded-full shadow-ai hover:shadow-ai-hover">
            {t.hero.ctaPrimary} <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Section>
  );
}

export { Hero };
