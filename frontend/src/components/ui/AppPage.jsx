import React from "react";
import Topbar from "./Topbar";

/**
 * Wrapper padrão para páginas autenticadas.
 * Fundo bg branco, padding lateral e topbar opcional.
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
    <div className={`min-h-screen bg-bg pb-12 ${className}`}>
      {showTopbar && (
        <Topbar
          membro={membro}
          userRole={userRole}
          subtitle={subtitle || title}
          showNotifications={showNotifications}
          actions={actions}
        />
      )}
      <div className="px-6 md:px-8 pt-6">{children}</div>
    </div>
  );
}
