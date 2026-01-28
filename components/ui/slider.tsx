"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, min = 0, max = 100, step = 1, className }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100;
    
    return (
      <div className={cn("relative flex w-full touch-none select-none items-center py-2", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onValueChange([parseFloat(e.target.value)])}
          className="slider-input w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${percentage}%, rgb(241, 245, 249) ${percentage}%, rgb(241, 245, 249) 100%)`,
          }}
        />

      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
