import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import Card, { CardHeader } from "./ui/Card";
import Badge from "./ui/Badge";

export default function TopContribuidores() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/dashboard/top-contribuidores")
      .then((res) => setDados(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-soft border border-surfaceMuted/60 h-96 flex items-center justify-center">
        <CircularProgress size={28} />
      </div>
    );
  }

  const [top, ...rest] = dados;

  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <CardHeader
          title="Maiores contribuidores"
          subtitle="Reconhecimento dos membros mais engajados"
          action={
            <button
              type="button"
              onClick={() => navigate("/gestao/relatorioContribuicoes")}
              className="text-body font-semibold text-primary hover:text-[#C56A3F]"
            >
              Ver relatório
            </button>
          }
        />
      </div>

      {top && (
        <div className="mx-6 md:mx-8 mb-4 p-5 rounded-md bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="relative flex items-center gap-4">
            <img
              src={
                top.membro?.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(top.membro?.nome || "?")}&background=ffffff&color=D97A4D`
              }
              alt={top.membro?.nome}
              className="w-16 h-16 rounded-sm object-cover border-2 border-white/30"
            />
            <div className="flex-1">
              <Badge variant="soft" className="!bg-white/20 !text-white mb-2">
                Top 1
              </Badge>
              <p className="text-lg font-bold">{top.membro?.nome}</p>
              <p className="text-sm text-white/80">Líder do ranking</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{Number(top.total).toLocaleString()} Kz</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-2">
        {rest.map((item) => (
          <div
            key={item.posicao}
            className="flex items-center gap-4 py-3 px-3 rounded-sm hover:bg-primarySoft/40 transition-colors"
          >
            <span className="w-8 text-center text-muted font-bold text-textMuted">
              {String(item.posicao).padStart(2, "0")}
            </span>
            <img
              src={
                item.membro?.foto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(item.membro?.nome || "?")}&background=FBE3CF&color=D97A4D`
              }
              alt={item.membro?.nome}
              className="w-10 h-10 rounded-sm object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-body font-semibold text-text truncate">{item.membro?.nome}</p>
              <p className="text-muted text-textMuted">Contribuidor ativo</p>
            </div>
            <p className="text-body font-bold text-text shrink-0">
              {Number(item.total).toLocaleString()} Kz
            </p>
          </div>
        ))}

        {dados.length === 0 && (
          <p className="text-muted text-textMuted py-4">Nenhum contribuidor registrado.</p>
        )}
      </div>
    </Card>
  );
}
