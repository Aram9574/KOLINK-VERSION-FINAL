import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion";
import { hapticFeedback } from "@/lib/animations";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all duration-200 border border-slate-950",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm border border-red-700",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-200",
        secondary:
          "bg-white/10 backdrop-blur-md text-slate-900 hover:bg-white/20 border border-white/20 shadow-sm",
        ghost: "hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 transition-colors",
        link: "text-brand-600 underline-offset-4 hover:underline font-semibold",
        premium: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 border border-white/20",
        brand: "relative overflow-hidden bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-500/10 border border-white/10 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-10 text-base",
        icon: "h-11 w-11",
      },
      radius: {
        default: "rounded-xl",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onDrag, onDragStart, onDragEnd, ...rest } = props as any;
    const Comp = asChild ? Slot : motion.button
    
    // Shine effect handles
    const showShine = variant === "default" || variant === "premium" || variant === "brand";

    return (
      <Comp
        className={cn(
          "relative overflow-hidden group/btn",
          buttonVariants({ variant, size, radius, className })
        )}
        ref={ref as any}
        whileHover={{ 
          y: -2,
          scale: 1.02,
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ 
          type: "spring", 
          mass: 1,
          tension: 400, 
          friction: 30 
        }}
        {...rest}
      >
        {/* Shine Overlay */}
        {showShine && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[20deg] animate-shine" 
                 style={{ 
                   animationDuration: '3s',
                   animationIterationCount: 'infinite',
                   animationTimingFunction: 'ease-in-out'
                 }} 
            />
          </div>
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {props.children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
