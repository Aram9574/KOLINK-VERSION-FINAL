import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  withGrid?: boolean;
  id?: string;
}

export default function Section({ children, className, withGrid = false, id }: SectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        "relative w-full py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden",
        withGrid && "bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem]",
        className
      )}
    >
      {/* Difuminado suave para el efecto AI en las esquinas */}
      {withGrid && (
        <div className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
