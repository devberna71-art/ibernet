// src/pages/Planos.jsx
import React from "react";
import { Box, Typography, Button, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

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
  width: "400px",
  height: "400px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
  filter: "blur(100px)",
  top: "20%",
  left: "30%",
  zIndex: 0,
}));

const PlanCard = styled(Paper)(({ theme, highlight, premium }) => ({
  padding: "40px 30px",
  borderRadius: "14px",
  background: premium
    ? `linear-gradient(145deg, #ffffff, ${theme.palette.warning.light})`
    : highlight
    ? `linear-gradient(145deg, #ffffff, ${theme.palette.primary.light})`
    : "#ffffff",
  border: premium
    ? `2px solid ${theme.palette.warning.main}`
    : highlight
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  boxShadow: highlight || premium
    ? "0 10px 30px rgba(37,99,235,0.1)"
    : "0 1px 3px rgba(0,0,0,0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: highlight || premium
      ? "0 15px 40px rgba(37,99,235,0.15)"
      : "0 4px 16px rgba(0,0,0,0.08)",
  },
  textAlign: "center",
  position: "relative",
  zIndex: 2,
}));

const Price = styled("div")(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 800,
  color: theme.palette.primary.main,
  marginBottom: "8px",
}));

const OldPrice = styled("span")(({ theme }) => ({
  textDecoration: "line-through",
  textDecorationColor: theme.palette.error.main,
  color: theme.palette.text.disabled,
  fontWeight: 600,
  fontSize: "1.1rem",
  marginLeft: "8px",
}));

/* ---------- COMPONENTE ---------- */
export default function Planos() {
  return (
    <Box sx={{ backgroundColor: "#f8faff", minHeight: "100vh" }}>
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
          Escolha o Plano Ideal para a Sua Igreja
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.9)",
            maxWidth: "700px",
            mx: "auto",
            lineHeight: 1.6,
            fontWeight: 400,
            position: "relative",
            zIndex: 2,
          }}
        >
          Planos flexíveis e acessíveis para diferentes tamanhos de igrejas — todos com as funcionalidades completas da plataforma Bernet-Eclesia.
        </Typography>
      </HeroSection>

      {/* PLANOS */}
      <Box sx={{ py: 10, px: { xs: 3, md: 10 } }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          {/* PLANO 1 - GRÁTIS */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
            <PlanCard component={motion.div} highlight={false} premium={false} sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Plano Grátis 💎
              </Typography>
              <Price>0 Kz</Price>
              <Typography sx={{ color: "text.secondary", mb: 3, flexGrow: 1, lineHeight: 1.8 }}>
                <b>Duração:</b> 7 dias <br />
                <b>Membros:</b> até 30 <br />
                <b>Usuários:</b> até 3 <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: "auto" }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>

          {/* PLANO 2 - INTERMÉDIO */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
            <PlanCard component={motion.div} highlight sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "primary.main",
                }}
              >
                Plano Intermédio
              </Typography>
              <Price>
                10.000 Kz<span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}>/mês</span>
                <OldPrice>25.000 Kz</OldPrice>
              </Price>
              <Typography sx={{ color: "text.secondary", mb: 3, flexGrow: 1, lineHeight: 1.8 }}>
                <b>Membros:</b> até 150 <br />
                <b>Usuários:</b> até 10 <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: "auto" }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>

          {/* PLANO 3 - AVANÇADO */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
            <PlanCard component={motion.div} highlight={false} premium={false} sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Plano Avançado
              </Typography>
              <Price>
                20.000 Kz<span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}>/mês</span>
                <OldPrice>50.000 Kz</OldPrice>
              </Price>
              <Typography sx={{ color: "text.secondary", mb: 3, flexGrow: 1, lineHeight: 1.8 }}>
                <b>Membros:</b> até 300 <br />
                <b>Usuários:</b> até 25 <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: "auto" }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>

          {/* PLANO 4 - ILIMITADO */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
            <PlanCard component={motion.div} premium sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "warning.main",
                }}
              >
                Plano Ilimitado ⭐
              </Typography>
              <Price sx={{ color: "warning.main" }}>
                35.000 Kz<span style={{ fontSize: "14px", fontWeight: 500, color: "#64748b" }}>/mês</span>
                <OldPrice>80.000 Kz</OldPrice>
              </Price>
              <Typography sx={{ color: "text.secondary", mb: 3, flexGrow: 1, lineHeight: 1.8 }}>
                <b>Membros:</b> ilimitados <br />
                <b>Usuários:</b> ilimitados <br />
                <b>Funcionalidades:</b> todas ativas
              </Typography>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                sx={{ mt: "auto" }}
              >
                Aderir Agora
              </Button>
            </PlanCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
