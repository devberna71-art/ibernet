import React from "react";
import { Link } from "react-router-dom";

/**
 * Card padrão: fundo surface branco, borda 1px border, radius-md, sem sombra como separador.
 * padding prop aceita classes Tailwind ex: "p-5" ou "p-6"
 */
function Card({
  children,
  className = "",
  padding = "p-5",
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={[
        "bg-surface rounded-md border border-border",
        padding,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Header de card: título semibold + ação opcional no canto direito.
 */
export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        {title && <h2 className="text-cardTitle text-text">{title}</h2>}
        {subtitle && <p className="text-muted text-textMuted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/**
 * Link estilizado dentro de cards (ex: "Ver tudo").
 */
export function CardLink({ to, onClick, children, className = "" }) {
  if (to) {
    return (
      <Link
        to={to}
        className={`text-muted font-semibold text-primary hover:text-[#3B4AE8] transition-colors ${className}`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-muted font-semibold text-primary hover:text-[#3B4AE8] transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export default Card;
