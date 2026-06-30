import React from "react";

const variants = {
  primary:
    "bg-primary text-white hover:bg-[#C56A3F] focus-visible:ring-2 focus-visible:ring-primary/40",
  secondary:
    "bg-surface border border-primary text-primary hover:bg-primarySoft focus-visible:ring-2 focus-visible:ring-primary/40",
  ghost:
    "bg-transparent text-textMuted hover:bg-primarySoft hover:text-primary",
  onImage:
    "bg-surface text-text hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/40",
};

const sizes = {
  sm: "px-3 py-1.5 text-muted",
  md: "px-5 py-2.5 text-body",
  lg: "px-6 py-3 text-body",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
