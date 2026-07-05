import React from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function WelcomeCard({ membro }) {
  if (!membro) return null;

  const firstName = membro.nome?.split(" ")[0] || "Usuário";

  return (
    <Card padding="p-6 md:p-8" className="max-w-2xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <Badge variant="primary">Painel Administrativo</Badge>
        <div className="text-right">
          <p className="text-2xs font-semibold uppercase tracking-wide text-textMuted">
            Status
          </p>
          <p className="text-body font-semibold text-success">Sincronizado</p>
        </div>
      </div>

      <div>
        <p className="text-body text-textSecondary">{getGreeting()}, administrador</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text mt-1 tracking-tight">
          {firstName}
        </h2>
        <p className="text-body text-textSecondary mt-3 max-w-lg leading-relaxed">
          O ecossistema está atualizado. Analise métricas de crescimento, gerencie receitas
          e coordene atividades da sua comunidade.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success" />
        <p className="text-muted font-medium text-textSecondary">
          Sistemas sincronizados em tempo real
        </p>
      </div>
    </Card>
  );
}
