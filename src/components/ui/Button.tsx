"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  ({
    variant = "primary",
    size = "md",
    asChild = false,
    className = "",
    children,
    ...props
  }, ref) => {
    const Component = asChild ? "span" : "button";

    const variants = {
      primary: "bg-gradient-to-r from-[#00d2ff] to-[#0284c7] text-[#02040a] hover:from-[#38bdf8] hover:to-[#0369a1] font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(0,210,255,0.35)] hover:shadow-[0_6px_22px_rgba(0,210,255,0.55)] hover:-translate-y-0.5",
      secondary: "bg-[#2dd4bf] text-[#02040a] hover:bg-[#14b8a6] font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(45,212,191,0.3)]",
      outline: "border border-[#00d2ff] text-[#00d2ff] hover:bg-[#00d2ff] hover:text-[#02040a] transition-all duration-200 shadow-[0_0_12px_rgba(0,210,255,0.2)]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-full",
      md: "px-5 py-2.5 text-sm rounded-full",
      lg: "px-7 py-3 text-base rounded-full",
    };

    return (
      <Component
        ref={ref as any}
        className={`inline-flex items-center justify-center font-body cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;