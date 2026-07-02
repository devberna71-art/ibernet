import React from "react";

const variants = {
  primary:
    "bg-primary text-white hover:bg-[#3B4AE8] focus-visible:ring-2 focus-visible:ring-primary/30",
  secondary:
    "bg-surface border border-border text-text hover:bg-bgSection focus-visible:ring-2 focus-visible:ring-border",
  ghost:
    "bg-transparent border border-border text-text hover:bg-bgSection",
  danger:
    "bg-danger text-white hover:bg-[#DC2626] focus-visible:ring-2 focus-visible:ring-danger/30",
  onImage:
    "bg-surface text-text hover:bg-white/90",
};

const sizes = {
  sm: "px-3 py-1.5 text-muted",
  md: "px-4 py-2 text-body",
  lg: "px-5 py-2.5 text-body",
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
        "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
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
