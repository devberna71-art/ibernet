import React from "react";
import { Link } from "react-router-dom";

function Card({
  children,
  className = "",
  padding = "p-6 md:p-8",
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={[
        "bg-surface rounded-lg shadow-soft border border-surfaceMuted/60",
        padding,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 ${className}`}>
      <div>
        {title && <h2 className="text-cardTitle text-text">{title}</h2>}
        {subtitle && <p className="text-muted text-textMuted mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`text-body font-semibold text-primary hover:text-[#C56A3F] transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

export default Card;
