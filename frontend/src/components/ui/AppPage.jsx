import React from "react";
import Topbar from "./Topbar";

/**
 * Wrapper padrão para páginas autenticadas.
 * Aplica fundo, padding e header opcional com saudação.
 */
export default function AppPage({
  children,
  membro,
  userRole,
  title,
  subtitle,
  showTopbar = true,
  showNotifications = true,
  actions,
  className = "",
}) {
  return (
    <div className={`min-h-screen bg-bg pb-10 ${className}`}>
      {showTopbar && (
        <Topbar
          membro={membro}
          userRole={userRole}
          subtitle={subtitle || title}
          showNotifications={showNotifications}
          actions={actions}
        />
      )}
      <div className="px-6 md:px-8">{children}</div>
    </div>
  );
}
