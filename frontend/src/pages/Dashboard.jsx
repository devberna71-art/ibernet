import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import {
  Box,
  Typography,
  CircularProgress,
  Container
} from "@mui/material";

import WelcomeCard from "../components/WelcomeCard";
import DashboardCards from "../components/DashboardCards";
import Distribuicoes from "../components/Distribuicoes"; // <-- Importação do novo componente
import Graficos from "../components/Graficos";
import TopContribuidores from "../components/topContribuidores";
import NovosMembros from "../components/novosMembros";
import ProximoCultos from "../components/ProximoCultos";

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setDados(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/meu-perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.usuario) {
          setUser(res.data.usuario.membro);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        <CircularProgress size={45} thickness={4} sx={{ color: "#4f46e5" }} />
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", letterSpacing: "1px", fontFamily: '"Inter", sans-serif' }}>
          A AUTENTICAR INFRAESTRUTURA...
        </Typography>
      </Box>
    );
  }

  if (!dados) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <Typography color="error" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
          Erro crítico ao carregar dados da dashboard.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: { xs: "100px", md: "120px" },
        pb: { xs: 4, md: 6 },
        background: `
          radial-gradient(circle at 8% 12%, rgba(79, 70, 229, 0.04) 0%, transparent 35%),
          radial-gradient(circle at 92% 18%, rgba(16, 185, 129, 0.03) 0%, transparent 30%),
          radial-gradient(circle at 50% 85%, rgba(245, 158, 11, 0.01) 0%, transparent 45%),
          #f8fafc
        `,
        px: { xs: 2, sm: 3, md: 5, lg: 6, xl: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl" disableGutters>
        
        {/* Bloco de Boas-vindas */}
        <Box sx={{ mb: 4, width: "100%" }}>
          <WelcomeCard membro={user} />
        </Box>

        {/* Bloco de Indicadores Financeiros Centrais */}
        <Box sx={{ mb: 4, width: "100%" }}>
          <DashboardCards dados={dados} />
        </Box>

        {/* Novo Bloco Isolado das Distribuições Demográficas/Gênero */}
        <Box sx={{ mb: 5, width: "100%" }}>
          <Distribuicoes dados={dados} />
        </Box>

        {/* Grelha de Gráficos e Relatórios Laterais */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "minmax(0, 2fr) minmax(0, 1fr)",
            },
            gap: 4,
            alignItems: "start",
            width: "100%",
          }}
        >
          {/* LADO ESQUERDO: Painel Analítico de Gráficos */}
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
            <Graficos dados={dados} />
          </Box>

          {/* LADO DIREITO: Painéis Operacionais Relatórios Laterais */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
            <TopContribuidores dados={dados?.topContribuidores || []} />
            <NovosMembros dados={dados?.novosMembros || []} />
            <ProximoCultos dados={dados?.proximosCultos || []} />
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
}