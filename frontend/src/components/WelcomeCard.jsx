import React from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function WelcomeCard({ membro }) {
  if (!membro) return null;

  return (
    <>
      {/* TIPOGRAFIA EXCLUSIVA E ANIMAÇÕES DE FLUXO DE LUZ */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
          
          @keyframes ambientGlow {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(15px, -10px) scale(1.05); }
          }
        `}
      </style>

      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: 460, md: 720 },
          position: "relative",
          overflow: "hidden",
          
          // Estética Monocromática Premium (Estilo Apple / Linear)
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.85) 100%)",
          backdropFilter: "blur(24px)",
          
          // Borda Cirúrgica de Alta Resolução (Padrão Retina Display)
          border: "1px solid rgba(15, 23, 42, 0.06)",
          borderRadius: "28px",
          
          p: { xs: 3.5, md: 4.5 },
          
          // Arquitetura de Sombras Avançada (Deep Soft Shadows)
          boxShadow: `
            0px 1px 2px rgba(15, 23, 42, 0.01),
            0px 24px 60px -16px rgba(15, 23, 42, 0.05),
            0px 12px 24px -12px rgba(15, 23, 42, 0.02),
            inset 0px 1px 1px rgba(255, 255, 255, 0.9)
          `,
          
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",

          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "rgba(15, 23, 42, 0.12)",
            boxShadow: `
              0px 1px 2px rgba(15, 23, 42, 0.01),
              0px 40px 80px -20px rgba(15, 23, 42, 0.08),
              inset 0px 1px 1px rgba(255, 255, 255, 1)
            `,
            "& .action-trigger-btn": {
              transform: "translateX(4px)",
              background: "#0F172A",
              color: "#FFFFFF",
            },
            "& .metric-indicator": {
              width: "100%",
            }
          },

          // MESH GRADIENTS ATMOSFÉRICOS (Luz ambiente de luxo nos cantos)
          "&::before": {
            content: '""',
            position: "absolute",
            top: -120,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
            filter: "blur(50px)",
            animation: "ambientGlow 8s ease-in-out infinite",
            zIndex: 1,
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -100,
            left: -40,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, rgba(255, 255, 255, 0) 70%)",
            filter: "blur(40px)",
            zIndex: 1,
            pointerEvents: "none",
          },
        }}
      >
        <Stack spacing={4} sx={{ zIndex: 2, position: "relative" }}>
          
          {/* HEADER DA ROW: BADGE + MÉTRICA SAAS */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* BADGE LUXURY */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.6,
                py: 0.6,
                background: "#0F172A",
                borderRadius: "99px",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
              }}
            >
              <BoltRoundedIcon sx={{ fontSize: 13, color: "#F59E0B" }} />
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Enterprise Elite
              </Typography>
            </Box>

            {/* TAXA DE ATIVIDADE DO USUÁRIO */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Score de Produtividade
                </Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#0F172A", fontFamily: "'Space Grotesk', sans-serif" }}>
                  99.4%
                </Typography>
              </Box>
              <Box sx={{ width: 3, height: 24, background: "#E2E8F0", borderRadius: 1 }} />
            </Stack>
          </Stack>

          {/* ÁREA CENTRAL: BOAS-VINDAS E NOME */}
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                fontWeight: 500,
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
                color: "#64748B",
                fontFamily: "inherit",
              }}
            >
              Olá de novo, administrador
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-2.5px",
                // Efeito Metálico Escuro (High-End Tech)
                background: "linear-gradient(180deg, #0F172A 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "inherit",
              }}
            >
              {membro.nome}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                color: "#475569",
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                fontWeight: 450,
                maxWidth: 540,
                lineHeight: 1.7,
                letterSpacing: "-0.1px",
                fontFamily: "inherit",
              }}
            >
              O ecossistema está totalmente atualizado. Analise as métricas de crescimento da sua comunidade, 
              gerencie novas receitas e coordene atividades centralizadas com a infraestrutura SaaS avançada.
            </Typography>
          </Box>

          {/* FOOTER: MICROBARRA DE CARREGAMENTO + BOTÃO INTERATIVO */}
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ 
              pt: 2, 
              borderTop: "1px solid rgba(15, 23, 42, 0.05)" 
            }}
          >
            {/* LINHA DE STATUS DE SINCRONIZAÇÃO */}
            <Stack spacing={0.6} sx={{ width: "60%" }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#334155" }}>
                  Sistemas sincronizados em tempo real
                </Typography>
              </Stack>
              {/* Barra de progresso ultra-fina estética */}
              <Box sx={{ width: "100%", height: 2, bg: "#E2E8F0", borderRadius: 1, overflow: "hidden", background: "#E2E8F0" }}>
                <Box 
                  className="metric-indicator"
                  sx={{ 
                    width: "40%", 
                    height: "100%", 
                    background: "linear-gradient(90deg, #4F46E5, #06B6D4)",
                    borderRadius: 1,
                    transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                  }} 
                />
              </Box>
            </Stack>

            {/* BOTÃO PREMIUM DE DISPARO DE AÇÃO (ESTILO COMPONENTES LINEAR) */}
            <IconButton
              className="action-trigger-btn"
              disableRipple
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: "#FFFFFF",
                color: "#0F172A",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                boxShadow: "0px 4px 12px rgba(15, 23, 42, 0.03)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  background: "#0F172A",
                  color: "#FFFFFF",
                }
              }}
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 14, stroke: "currentColor", strokeWidth: 1.2 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}