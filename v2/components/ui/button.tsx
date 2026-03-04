"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700",
        danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
        outline: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        default: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
