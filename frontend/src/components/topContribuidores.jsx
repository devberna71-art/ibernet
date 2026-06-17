import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";

import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

import { useNavigate } from "react-router-dom";

export default function TopContribuidores() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function carregar() {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/top-contribuidores");
      setDados(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // Renderizador de Posições/Medalhas Premium
  const renderBadgePosicao = (posicao) => {
    if (posicao === 2) {
      return (
        <Box sx={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "linear-gradient(135deg, #E2E8F0, #94A3B8)", boxShadow: "0 4px 10px rgba(148,163,184,0.25)" }}>
          <WorkspacePremiumRoundedIcon sx={{ color: "#FFF", fontSize: 18 }} />
        </Box>
      );
    }
    if (posicao === 3) {
      return (
        <Box sx={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "linear-gradient(135deg, #FFEDD5, #D97706)", boxShadow: "0 4px 10px rgba(217,119,6,0.2)" }}>
          <WorkspacePremiumRoundedIcon sx={{ color: "#FFF", fontSize: 18 }} />
        </Box>
      );
    }
    return (
      <Box sx={{ width: 34, textAlign: "center", fontWeight: 700, fontSize: "0.85rem", color: "#64748b", fontFamily: "inherit" }}>
        {String(posicao).padStart(2, "0")}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: 380,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #F1F5F9",
          boxShadow: "0 10px 30px rgba(15,23,42,0.02)",
        }}
      >
        <CircularProgress size={35} thickness={4} sx={{ color: "#10B981" }} />
      </Box>
    );
  }

  // Filtrando a lista para remover o primeiro lugar (que já ganha o card de destaque)
  const restanteLista = dados.slice(1);

  return (
    <Box
      sx={{
        fontFamily: '"Sora", "Inter", system-ui, sans-serif',
        background: "#FFFFFF",
        borderRadius: "24px",
        border: "1px solid #ECEFF3",
        boxShadow: "0 20px 40px -15px rgba(15,23,42,0.05)",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          boxShadow: "0 30px 60px -15px rgba(15,23,42,0.08)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 4,
          py: 3,
          background: "linear-gradient(to bottom, #FFFFFF, #FCFDFE)",
          borderBottom: "1px solid #F1F5F9",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(251,191,36,0.15)",
            }}
          >
            <EmojiEventsRoundedIcon sx={{ fontSize: 22, color: "#D97706" }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.5px",
                fontFamily: "inherit",
              }}
            >
              Líderes de Contribuição
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#64748B",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              Reconhecimento dos membros mais engajados
            </Typography>
          </Box>
        </Stack>

        <Button
          onClick={() => navigate("/gestao/relatorioContribuicoes")}
          endIcon={<ArrowForwardRoundedIcon className="arrow-icon" />}
          sx={{
            textTransform: "none",
            fontSize: "0.8rem",
            fontWeight: 700,
            px: 2.5,
            py: 1.2,
            borderRadius: "12px",
            color: "#FFFFFF",
            background: "linear-gradient(135deg, #059669, #10B981)",
            boxShadow: "0 6px 20px rgba(16,185,129,0.25)",
            fontFamily: "inherit",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            "& .arrow-icon": { transition: "transform 0.2s ease" },
            "&:hover": {
              background: "linear-gradient(135deg, #047857, #059669)",
              boxShadow: "0 10px 24px rgba(16,185,129,0.35)",
              "& .arrow-icon": { transform: "translateX(4px)" },
            },
          }}
        >
          Ver relatório completo
        </Button>
      </Box>

      {/* CAMPEÃO PREMIUM CARD (#1 LUGAR) */}
      {dados[0] && (
        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Box
            sx={{
              p: 3,
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              boxShadow: "0 12px 30px rgba(15,23,42,0.15)",
              border: "1px solid rgba(255,255,255,0.06)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={dados[0].membro?.foto}
                    sx={{
                      width: 68,
                      height: 68,
                      border: "3px solid #10B981",
                      boxShadow: "0 0 20px rgba(16,185,129,0.4)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%) rotate(-10deg)",
                      background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
                      borderRadius: "6px",
                      px: 0.8,
                      py: 0.2,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <Typography sx={{ fontSize: "9px", fontWeight: 900, color: "#0F172A" }}>👑 TOP 1</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#10B981",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      fontFamily: "inherit",
                    }}
                  >
                    Líder do Ranking
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#FFFFFF",
                      fontSize: "1.1rem",
                      mt: 0.2,
                      letterSpacing: "-0.3px",
                      fontFamily: "inherit",
                    }}
                  >
                    {dados[0].membro?.nome}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#94A3B8",
                      fontWeight: 500,
                      fontFamily: "inherit",
                    }}
                  >
                    Contribuidor Ouro
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ textAlign: { xs: "left", sm: "right" }, pl: { xs: 9, sm: 0 } }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.6rem",
                    color: "#10B981",
                    letterSpacing: "-0.5px",
                    fontFamily: "inherit",
                  }}
                >
                  {Number(dados[0].total).toLocaleString()} Kz
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  Volume Total Contribuído
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}

      {/* RESTANTE DA LISTA RANKING */}
      <Box sx={{ p: 3, pt: 1.5 }}>
        <Stack spacing={1}>
          {restanteLista.map((item) => (
            <Box
              key={item.posicao}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.8,
                borderRadius: "16px",
                border: "1px solid transparent",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  background: "#F8FAFC",
                  borderColor: "#E2E8F0",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 20px rgba(15,23,42,0.02)",
                },
              }}
            >
              <Stack direction="row" spacing={2.5} alignItems="center">
                {/* ID da Posição / Medalha */}
                <Box sx={{ width: 34, display: "flex", justifyContent: "center" }}>
                  {renderBadgePosicao(item.posicao)}
                </Box>

                <Avatar 
                  src={item.membro?.foto} 
                  sx={{ 
                    width: 46, 
                    height: 46,
                    border: "2px solid #F1F5F9",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
                  }} 
                />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#0F172A",
                      fontSize: "0.92rem",
                      fontFamily: "inherit",
                      letterSpacing: "-0.2px"
                    }}
                  >
                    {item.membro?.nome}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: 500,
                      fontFamily: "inherit",
                    }}
                  >
                    {item.posicao <= 3 ? "Membro de Elite" : "Contribuidor Ativo"}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                sx={{
                  color: "#0F172A",
                  fontWeight: 800,
                  fontSize: "0.98rem",
                  fontFamily: "inherit",
                }}
              >
                {Number(item.total).toLocaleString()} Kz
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}