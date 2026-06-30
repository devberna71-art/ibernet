import React from "react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function PageHeader({
  name,
  subtitle,
  emoji = "👋",
  actions,
  className = "",
}) {
  const firstName = name?.split(" ")[0] || "visitante";

  return (
    <header
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}
    >
      <div>
        <h1 className="text-pageTitle text-text">
          {getGreeting()}, {firstName} {emoji}
        </h1>
        {subtitle && (
          <p className="text-body text-textMuted mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </header>
  );
}
