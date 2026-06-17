import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

export default function NovosMembros() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verTodos, setVerTodos] = useState(false);

  async function carregar() {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/novos-membros");
      setDados(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const membrosExibidos = verTodos ? dados : dados.slice(0, 4);

  // LOADING ULTRA-PREMIUM COM SKELETON ANIME EFFECT
  if (loading) {
    return (
      <Box
        sx={{
          height: 440,
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid rgba(15, 23, 42, 0.06)",
          boxShadow: "0px 16px 40px -10px rgba(15, 23, 42, 0.04), 0px 1px 2px rgba(15, 23, 42, 0.02)",
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          animation: "pulse 1.8s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.95 },
            "50%": { opacity: 0.6 },
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box><Box sx={{ width: 140, height: 16, bg: "#E2E8F0", borderRadius: 4, mb: 1, background: "#F1F5F9" }} /><Box sx={{ width: 200, height: 10, bg: "#F1F5F9", borderRadius: 4, background: "#F8FAFC" }} /></Box>
          <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: "#F1F5F9" }} />
        </Stack>
        <Stack spacing={2} sx={{ my: 3 }}>
          {[1, 2, 3].map((i) => (
            <Stack key={i} direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: "50%", background: "#F1F5F9" }} />
              <Box sx={{ flex: 1 }}><Box sx={{ width: "40%", height: 12, background: "#F1F5F9", borderRadius: 4, mb: 1 }} /><Box sx={{ width: "20%", height: 8, background: "#F8FAFC", borderRadius: 4 }} /></Box>
            </Stack>
          ))}
        </Stack>
        <Box sx={{ width: "100%", height: 40, borderRadius: "12px", background: "#F1F5F9" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        fontFamily: '"Inter", "Sora", system-ui, sans-serif',
        background: "#FFFFFF",
        borderRadius: "24px",
        // Borda dupla simulada via shadow para profundidade realista (Estilo Stripe)
        border: "1px solid rgba(15, 23, 42, 0.06)",
        boxShadow: `
          0px 1px 2px rgba(15, 23, 42, 0.02),
          0px 16px 40px -10px rgba(15, 23, 42, 0.04),
          inset 0px -1px 0px rgba(15, 23, 42, 0.04)
        `,
        overflow: "hidden",
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `
            0px 1px 2px rgba(15, 23, 42, 0.02),
            0px 24px 60px -12px rgba(15, 23, 42, 0.08),
            inset 0px -1px 0px rgba(15, 23, 42, 0.04)
          `,
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 4,
          pt: 4,
          pb: 2.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.4px",
              fontFamily: "inherit",
            }}
          >
            Novos Membros
          </Typography>

          <Typography
            sx={{
              fontSize: "0.82rem",
              color: "#64748B",
              fontWeight: 400,
              mt: 0.5,
              fontFamily: "inherit",
            }}
          >
            Acompanhe a atividade e entrada dos últimos integrantes.
          </Typography>
        </Box>

        {/* CONTADOR DISCRETO PREMIUM */}
        <Box
          sx={{
            px: 1.8,
            py: 0.6,
            borderRadius: "99px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569" }}>
            {dados.length} Total
          </Typography>
        </Box>
      </Box>

      {/* LISTA DE MEMBROS */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Stack spacing={0.5}>
          {membrosExibidos.map((membro) => (
            <Box
              key={membro.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.8,
                borderRadius: "16px",
                background: "transparent",
                border: "1px solid transparent",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
                  borderColor: "rgba(15, 23, 42, 0.05)",
                  boxShadow: "0px 6px 20px -6px rgba(15, 23, 42, 0.03)",
                  "& .avatar-container": {
                    transform: "scale(1.04)",
                    boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.08)",
                  },
                  "& .action-arrow": {
                    opacity: 1,
                    transform: "translateX(0px)",
                  },
                  "& .member-badge": {
                    background: "#FFFFFF",
                    borderColor: "#10B981",
                  }
                },
              }}
            >
              {/* LADO ESQUERDO: AVATAR E INFO */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  className="avatar-container"
                  sx={{
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <Avatar
                    src={membro.foto}
                    sx={{
                      width: 44,
                      height: 44,
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      background: "#F1F5F9",
                      color: "#0F172A",
                    }}
                  >
                    {membro.nome ? membro.nome.charAt(0) : "M"}
                  </Avatar>
                  {/* Ponto de atividade real na foto */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#10B981",
                      border: "2px solid #FFFFFF",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#0F172A",
                      fontSize: "0.9rem",
                      fontFamily: "inherit",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {membro.nome}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B",
                      fontSize: "0.78rem",
                      fontWeight: 400,
                      fontFamily: "inherit",
                      mt: 0.1,
                    }}
                  >
                    Adicionado em{" "}
                    {new Date(membro.dataEntrada).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Typography>
                </Box>
              </Stack>

              {/* LADO DIREITO: BADGE OU SETA INTERATIVAS */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  className="member-badge"
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#10B981",
                    background: "rgba(16, 185, 129, 0.06)",
                    border: "1px solid rgba(16, 185, 129, 0.15)",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "6px",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  Novo
                </Box>

                {/* Seta secreta minimalista que aparece no hover */}
                <ArrowForwardIcon
                  className="action-arrow"
                  sx={{
                    fontSize: 16,
                    color: "#0F172A",
                    opacity: 0,
                    transform: "translateX(-8px)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: { xs: "none", sm: "block" }
                  }}
                />
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* BOTÃO EXPANSÍVEL ESTILO INTERFACE APPLE */}
        {dados.length > 4 && (
          <Button
            onClick={() => setVerTodos(!verTodos)}
            disableRipple
            endIcon={
              verTodos ? (
                <KeyboardArrowUpRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              mt: 2,
              width: "100%",
              py: 1.6,
              borderRadius: "14px",
              textTransform: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#475569",
              border: "1px solid rgba(15, 23, 42, 0.06)",
              background: "#FFFFFF",
              boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.02)",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "#F8FAFC",
                borderColor: "rgba(15, 23, 42, 0.12)",
                color: "#0F172A",
                boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.03)",
              },
              "&:active": {
                transform: "scale(0.99)",
              }
            }}
          >
            {verTodos ? "Recolher visualização" : `Mostrar mais ${dados.length - 4} membros`}
          </Button>
        )}
      </Box>
    </Box>
  );
}