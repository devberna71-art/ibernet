// src/pages/Testemunhos.jsx
import React from "react";
import { Box, Typography, Grid, Avatar, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

/* ---------- ESTILOS ---------- */
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "#fff",
  textAlign: "center",
  padding: "100px 20px 80px",
  position: "relative",
  overflow: "hidden",
}));

const HeroGlow = styled(Box)(() => ({
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
  filter: "blur(120px)",
  top: "25%",
  left: "30%",
  zIndex: 0,
}));

const TestimonialCard = styled(Paper)(() => ({
  padding: "40px 30px",
  textAlign: "center",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const AvatarWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
}));

const Name = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.15rem",
  marginTop: "10px",
  color: theme.palette.text.primary,
}));

const Role = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  marginBottom: "20px",
  lineHeight: 1.4,
}));

const Comment = styled(Typography)(({ theme }) => ({
  fontStyle: "italic",
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  fontSize: "0.95rem",
  position: "relative",
  padding: "0 10px",
}));

const QuoteIcon = styled(FormatQuoteIcon)(({ theme }) => ({
  fontSize: "2rem",
  color: theme.palette.primary.main,
  opacity: 0.15,
  position: "absolute",
  top: -10,
  left: -10,
}));

/* ---------- COMPONENTE ---------- */
export default function Testemunhos() {
  const testemunhos = [
    {
      nome: "Pr. Mateus Chimbinda",
      cargo: "Pastor Sênior – Igreja Luz do Evangelho (Luanda, Angola)",
      foto: "https://randomuser.me/api/portraits/men/83.jpg",
      comentario:
        "A Bernet-Eclesia revolucionou a forma como gerimos nossa comunidade. Hoje temos uma visão completa dos membros, finanças e eventos. É uma bênção tecnológica para o ministério.",
    },
    {
      nome: "Bispa Nádia Mucavele",
      cargo: "Líder – Centro de Adoração Emanuel (Maputo, Moçambique)",
      foto: "https://randomuser.me/api/portraits/women/81.jpg",
      comentario:
        "Nunca imaginei que uma plataforma pudesse facilitar tanto o trabalho pastoral. A Bernet-Eclesia trouxe eficiência e modernidade à nossa gestão ministerial.",
    },
    {
      nome: "Pr. Edson Tavares",
      cargo: "Pastor – Igreja Pentecostal Maná (Cabo Verde)",
      foto: "https://randomuser.me/api/portraits/men/79.jpg",
      comentario:
        "A Bernet-Eclesia é mais do que um sistema; é uma ferramenta de unidade. O suporte é excelente, e a interface é intuitiva. Sinto que cada detalhe foi feito com amor e propósito.",
    },
    {
      nome: "Ap. Verónica Kiala",
      cargo: "Apóstola – Ministério Nova Aliança (Benguela, Angola)",
      foto: "https://randomuser.me/api/portraits/women/78.jpg",
      comentario:
        "Depois que começámos a usar a Bernet-Eclesia, a administração da igreja ficou clara e profissional. Cada relatório é preciso e automático. É o futuro das igrejas africanas.",
    },
  ];

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #f8faff, #ffffff)", minHeight: "100vh" }}>
      {/* HERO */}
      <HeroSection>
        <HeroGlow />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
            position: "relative",
            zIndex: 2,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Testemunhos de Transformação
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.9)",
            maxWidth: "720px",
            mx: "auto",
            lineHeight: 1.6,
            position: "relative",
            zIndex: 2,
            fontWeight: 400,
          }}
        >
          Pastores e líderes africanos compartilham como a Bernet-Eclesia está a
          fortalecer a gestão, a fé e a excelência ministerial nas suas igrejas.
        </Typography>
      </HeroSection>

      {/* TESTEMUNHOS */}
      <Box sx={{ py: 10, px: { xs: 3, md: 10 } }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {testemunhos.map((t, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
              <TestimonialCard
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ flex: 1 }}
              >
                <AvatarWrapper>
                  <Avatar
                    src={t.foto}
                    alt={t.nome}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "3px solid",
                      borderColor: "primary.light",
                    }}
                  />
                </AvatarWrapper>
                <Name variant="h6">{t.nome}</Name>
                <Role variant="body2">{t.cargo}</Role>
                <Box sx={{ position: "relative", mt: "auto" }}>
                  <QuoteIcon />
                  <Comment variant="body1">“{t.comentario}”</Comment>
                </Box>
              </TestimonialCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
