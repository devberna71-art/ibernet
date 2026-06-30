import React from "react";
import PageHeader from "./PageHeader";
import NotificationBell from "../Contador";

export default function Topbar({
  membro,
  userRole,
  subtitle,
  actions,
  showNotifications = true,
}) {
  return (
    <div className="sticky top-0 z-[1100] bg-bg px-6 md:px-8 pt-6 pb-4">
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
