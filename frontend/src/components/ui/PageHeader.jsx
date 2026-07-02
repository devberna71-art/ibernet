import React from "react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

/**
 * Header padrão de página autenticada.
 * Usa tipografia pageTitle (20px semibold) e textMuted para subtitle.
 */
export default function PageHeader({
  name,
  subtitle,
  actions,
  className = "",
}) {
  const firstName = name?.split(" ")[0] || "Usuário";

  return (
    <header
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 ${className}`}
    >
      <div>
        <h1 className="text-pageTitle text-text">
          {getGreeting()}, {firstName}
        </h1>
        {subtitle && (
          <p className="text-body text-textMuted mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
