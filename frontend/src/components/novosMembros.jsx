import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import api from "../api/axiosConfig";
import ListCard from "./ui/ListCard";
import Badge from "./ui/Badge";

export default function NovosMembros() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verTodos, setVerTodos] = useState(false);

  useEffect(() => {
    api
      .get("/dashboard/novos-membros")
      .then((res) => setDados(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-soft border border-surfaceMuted/60 h-80 flex items-center justify-center">
        <CircularProgress size={28} />
      </div>
    );
  }

  const membrosExibidos = verTodos ? dados : dados.slice(0, 4);

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
          <div key={membro.id} className="flex items-center gap-4 py-2">
            <img
              src={
                membro.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(membro.nome)}&background=FBE3CF&color=D97A4D`
              }
              alt={membro.nome}
              className="w-11 h-11 rounded-sm object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-text truncate">{membro.nome}</p>
              <p className="text-muted text-textMuted mt-0.5">Adicionado em {date}</p>
            </div>
            <Badge variant="success">Novo</Badge>
          </div>
        );
      }}
    />
  );
}
