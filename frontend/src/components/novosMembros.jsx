import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../api/axiosConfig";
import ListCard from "./ui/ListCard";
import Badge from "./ui/Badge";

export default function NovosMembros() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/novos-membros")
      .then((res) => setDados(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface rounded-md border border-border h-48 flex items-center justify-center">
        <Loader2 size={20} strokeWidth={1.75} className="animate-spin text-primary" />
      </div>
    );
  }

  const membrosExibidos = dados.slice(0, 5);

  return (
    <ListCard
      title="Novos Membros"
      subtitle="Últimos integrantes da comunidade"
      viewAllTo="/gestao/membros"
      items={membrosExibidos}
      emptyMessage="Nenhum membro recente."
      renderItem={(membro) => {
        const date = membro.dataEntrada
          ? new Date(membro.dataEntrada).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "short",
            })
          : "";
        return (
          <div key={membro.id} className="flex items-center gap-3 py-2">
            <img
              src={
                membro.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=EFF6FF&color=2563EB&size=64`
              }
              alt={membro.nome}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text truncate">{membro.nome}</p>
              <p className="text-muted text-textMuted mt-0.5">Adicionado em {date}</p>
            </div>
            <Badge variant="success">Novo</Badge>
          </div>
        );
      }}
    />
  );
}
