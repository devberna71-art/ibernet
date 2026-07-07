import React from "react";
import PageHeader from "./PageHeader";
import NotificationBell from "../Contador";

/**
 * Topbar padrão: sticky, fundo bg branco, borda inferior 1px border.
 * Separação visual via borda fina, não sombra.
 */
export default function Topbar({
  membro,
  userRole,
  subtitle,
  actions,
  showNotifications = true,
}) {
  return (
    <div className="sticky top-0 z-[1100] bg-bg border-b border-border px-4 sm:px-6 md:px-8 pt-4 md:pt-5 pb-3 md:pb-4">
      <PageHeader
        name={membro?.nome}
        subtitle={subtitle}
        actions={
          <>
            {showNotifications && userRole === "admin" && (
              <NotificationBell userRole={userRole} />
            )}
            {actions}
          </>
        }
      />
    </div>
  );
}
