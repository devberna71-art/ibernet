import React from "react";

const variants = {
  live: "bg-danger text-white",
  soft: "bg-primarySoft text-primary",
  muted: "bg-surfaceMuted text-textMuted",
  success: "bg-success/10 text-success",
};

export default function Badge({
  children,
  variant = "soft",
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wide",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function TicketDateBadge({ month, day, className = "" }) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center w-12 h-12 rounded-sm bg-primarySoft shrink-0",
        className,
      ].join(" ")}
    >
      <span className="text-[10px] font-bold uppercase text-primary leading-none">
        {month}
      </span>
      <span className="text-lg font-bold text-text leading-tight">{day}</span>
    </div>
  );
}
