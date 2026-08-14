import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'live' | 'pill';
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center shrink-0 font-display font-semibold tracking-widest uppercase transition-colors leading-none",
        {
          "bg-ink text-accent rounded px-1.5 py-0.5 text-[9.5px]": variant === "default",
          "bg-white border border-hairline-soft text-ash rounded px-2 py-1 text-[10px]": variant === "outline",
          "text-accent-deep text-[11px] gap-2": variant === "live",
          "bg-ink text-accent rounded-full px-2.5 py-1 text-[10px] tabular-nums": variant === "pill",
        },
        className
      )}
      {...props}
    >
      {variant === 'live' && (
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]"></span>
      )}
      {children}
    </div>
  )
}

export { Badge }
