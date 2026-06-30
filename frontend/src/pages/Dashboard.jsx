import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import api from "../api/axiosConfig";
import { Topbar } from "../components/ui";
import DashboardCards from "../components/DashboardCards";
import Distribuicoes from "../components/Distribuicoes";
import Graficos from "../components/Graficos";
import TopContribuidores from "../components/topContribuidores";
import NovosMembros from "../components/novosMembros";
import ProximoCultos from "../components/ProximoCultos";

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setDados(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api
      .get("/meu-perfil", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data?.usuario?.membro))
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3">
        <CircularProgress size={36} />
        <p className="text-muted text-textMuted font-medium">Carregando painel...</p>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-body text-danger font-semibold">Erro ao carregar dados do painel.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-10">
      <Topbar
        membro={user}
        userRole="admin"
        subtitle="Acompanhe métricas, finanças e atividades da sua comunidade."
      />

      <div className="px-6 md:px-8 space-y-6 md:space-y-8">
        <DashboardCards dados={dados} />

        <Distribuicoes dados={dados} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 md:gap-6 items-start">
          <div className="space-y-5 md:space-y-6">
            <Graficos dados={dados} />
          </div>
          <div className="space-y-5 md:space-y-6">
            <TopContribuidores />
            <NovosMembros />
            <ProximoCultos />
          </div>
        </div>
      </div>
    </div>
  );
}
