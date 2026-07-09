import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getDashboardMetrics } from "../services/dashboardService";
import { getMeuPerfil } from "../services/userService";
import AppPage from "../components/ui/AppPage";
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
    getDashboardMetrics()
      .then((res) => setDados(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getMeuPerfil()
      .then((res) => setUser(res.usuario?.membro))
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} strokeWidth={1.75} className="text-primary animate-spin" />
        <p className="text-body text-textMuted font-medium">Carregando painel...</p>
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
    <AppPage
      membro={user}
      userRole="admin"
      subtitle="Métricas, finanças e atividades da sua comunidade."
    >
      <div className="space-y-4 md:space-y-5">
        <DashboardCards dados={dados} />
        <Distribuicoes dados={dados} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start">
          <div className="space-y-4">
            <Graficos dados={dados} />
          </div>
          <div className="space-y-4">
            <TopContribuidores />
            <NovosMembros />
            <ProximoCultos />
          </div>
        </div>
      </div>
    </AppPage>
  );
}
