"use client";

interface EyebrowBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export const EyebrowBadge = ({
  children,
  variant = "primary",
  className = "",
}: EyebrowBadgeProps) => {
  const variants = {
    primary: "bg-[rgba(0,210,255,0.12)] text-[#00d2ff] border border-[rgba(0,210,255,0.3)]",
    secondary: "bg-[rgba(45,212,191,0.12)] text-[#2dd4bf] border border-[rgba(45,212,191,0.3)]",
    outline: "border border-[#00d2ff] text-[#00d2ff] bg-transparent",
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 text-xs font-medium
        rounded-full
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};