import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display text-base font-medium tracking-wide transition-colors cursor-pointer",
          {
            "bg-ink text-on-primary hover:bg-ink/90 border-none": variant === "default",
            "bg-accent text-ink hover:bg-accent-deep": variant === "primary",
            "bg-canvas text-ink border border-hairline hover:border-ink": variant === "outline",
            "bg-transparent text-ink hover:bg-canvas": variant === "ghost",
            "h-12 px-6": size === "default",
            "h-10 px-5 text-[15px]": size === "sm",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
