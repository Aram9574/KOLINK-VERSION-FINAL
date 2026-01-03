import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { hoverClick } from "@/lib/animations";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  cta = "Explorar",
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  cta?: string;
}) => {
  return (
    <motion.div
      {...hoverClick}
      className={cn(
        "row-span-1 rounded-xl group/bento transition duration-200 justify-between flex flex-col space-y-4 card-ai p-8",
        className
      )}
    >
      <div className="flex flex-1 flex-col justify-between">
            <div>
                {header}
                <div className="group-hover/bento:translate-x-2 transition duration-200">
                    <div className="font-display font-bold text-foreground mb-2 mt-2 text-xl">
                    {title}
                    </div>
                    <div className="font-sans font-normal text-muted-foreground text-sm leading-relaxed">
                    {description}
                    </div>
                </div>
            </div>
            
             <div className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover/bento:opacity-100 transition-all -translate-x-2 group-hover/bento:translate-x-0 duration-300 mt-4">
                <span>{cta}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            </div>
      </div>
    </motion.div>
  );
};
