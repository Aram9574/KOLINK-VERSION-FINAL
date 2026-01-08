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
        className
      )}
    >
      

      
      <div className="relative z-10 max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
