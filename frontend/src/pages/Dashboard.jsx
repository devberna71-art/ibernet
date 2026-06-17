import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Container
} from "@mui/material";

import WelcomeCard from "../components/WelcomeCard";
import DashboardCards from "../components/DashboardCards";
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
        // Espaçamento calculado milimetricamente para não colidir com o topo (Navbar)
        pt: { xs: "100px", md: "120px" },
        pb: { xs: 4, md: 6 },
        
        // Fundo Premium Studio com Gradientes de Iluminação Periférica Avançados
        background: `
          radial-gradient(circle at 10% 15%, rgba(79, 70, 229, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 35%),
          radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.02) 0%, transparent 50%),
          #f8fafc
        `,
        
        px: { xs: 2, sm: 3, md: 5, lg: 6, xl: 8 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Container Máximo de segurança para telas Ultra-Wide não quebrarem o layout */}
      <Container maxWidth="xl" disableGutters>
        
        {/* Bloco de Boas-Vindas */}
        <Box sx={{ mb: 4, width: "100%" }}>
          <WelcomeCard membro={user} />
        </Box>

        {/* Bloco de Indicadores (Membros, Contribuições, Despesas, Balanço) */}
        <Box sx={{ mb: 4, width: "100%" }}>
          <DashboardCards dados={dados} />
        </Box>

        {/* Grelha Organizadora Principal contra Colisões de Componentes */}
        <Box
          sx={{
            display: "grid",
            // minmax(0, x) impede o componente filho de crescer infinitamente e forçar quebra
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
          <Box 
            sx={{ 
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 4
            }}
          >
            <Graficos />
          </Box>

          {/* LADO DIREITO: Painéis Operacionais Relatórios Laterais */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3, // Espaçamento calibrado para os cards empilhados
              width: "100%",
            }}
          >
            <TopContribuidores />
            <NovosMembros />
            <ProximoCultos />
          </Box>
          
        </Box>
      </Container>
    </Box>
  );
}