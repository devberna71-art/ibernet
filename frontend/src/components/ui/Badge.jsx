import React from "react";

/**
 * Badge pill — formato pill pequena, fundo claro da cor semântica + texto escuro.
 * variants: "success" | "danger" | "primary" | "muted"
 */
const variants = {
  success: "bg-successSoft text-success",
  danger: "bg-danger/10 text-danger",
  primary: "bg-primarySoft text-primary",
  muted: "bg-bgSection text-textMuted",
};

export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/**
 * Badge de data para tickets/cultos.
 */
export function TicketDateBadge({ month, day, className = "" }) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center w-11 h-11 rounded-sm bg-primarySoft shrink-0",
        className,
      ].join(" ")}
    >
      <span className="text-[10px] font-bold uppercase text-primary leading-none">
        {month}
      </span>
      <span className="text-base font-bold text-text leading-tight">{day}</span>
    </div>
  );
}
