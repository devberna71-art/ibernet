import React from "react";
import { Box, Typography, Grid } from "@mui/material";

import ChildCareIcon from "@mui/icons-material/ChildCare";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import SchoolIcon from "@mui/icons-material/School";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import ElderlyIcon from "@mui/icons-material/Elderly";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";

// --- Arquitetura de Design High-End ---

const cardContainerStyle = (glowColor) => ({
  p: 4,
  borderRadius: "28px",
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "220px",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-12px)",
    border: `1px solid ${glowColor}44`,
    boxShadow: `0 24px 48px -12px ${glowColor}33`,
    background: "rgba(255, 255, 255, 0.95)",
    "& .premium-icon-badge": {
      transform: "scale(1.1) rotate(5deg)",
      background: glowColor,
      color: "#ffffff",
    },
    "& .premium-number": {
      color: glowColor
    }
  }
});

const iconBadgeStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f1f5f9",
  color: "#475569",
  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  mb: 3
};

const numberStyle = {
  fontFamily: '"Inter", sans-serif',
  fontSize: "3rem",
  fontWeight: 800,
  color: "#0f172a",
  lineHeight: 1,
  transition: "all 0.4s ease"
};

const labelStyle = {
  fontFamily: '"Inter", sans-serif',
  fontSize: "0.7rem",
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  mb: 0.5
};

export default function Distribuicoes({ dados }) {
  const grupos = dados?.membros?.classificacaoGrupos || { criancas: 0, adolescentes: 0, jovens: 0, adultos: 0, idosos: 0 };
  const genero = dados?.membros?.distribuicaoGenero || { homens: 0, mulheres: 0 };

  const sections = [
    { label: "Crianças", val: grupos.criancas, color: "#3b82f6", icon: <ChildCareIcon /> },
    { label: "Adolescentes", val: grupos.adolescentes, color: "#8b5cf6", icon: <EscalatorWarningIcon /> },
    { label: "Jovens", val: grupos.jovens, color: "#10b981", icon: <SchoolIcon /> },
    { label: "Adultos", val: grupos.adultos, color: "#f97316", icon: <NaturePeopleIcon /> },
    { label: "Idosos", val: grupos.idosos, color: "#f43f5e", icon: <ElderlyIcon /> },
  ];

  return (
    <Box sx={{ p: { xs: 4, md: 10 }, background: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Header com design de Dashboard Moderno */}
      <Box sx={{ mb: 8, maxWidth: "600px" }}>
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 900, color: "#64748b", mb: 1, letterSpacing: "0.25em" }}>ESTATÍSTICAS EM TEMPO REAL</Typography>
        <Typography sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
          Segmentação Demográfica
        </Typography>
      </Box>

      {/* Grid Grupos */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {sections.map((item, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <Box sx={cardContainerStyle(item.color)}>
              <Box className="premium-icon-badge" sx={iconBadgeStyle}>
                {React.cloneElement(item.icon, { sx: { fontSize: 26 } })}
              </Box>
              <Box>
                <Typography sx={labelStyle}>{item.label}</Typography>
                <Typography className="premium-number" sx={numberStyle}>{item.val}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Gênero (Destaque) */}
      <Grid container spacing={4}>
        {[
          { label: "Homens Registrados", val: genero.homens, color: "#0d9488", icon: <ManIcon /> },
          { label: "Mulheres Registradas", val: genero.mulheres, color: "#db2777", icon: <WomanIcon /> }
        ].map((g, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Box sx={{ ...cardContainerStyle(g.color), p: 5, flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Box className="premium-icon-badge" sx={{ ...iconBadgeStyle, width: 72, height: 72, borderRadius: "20px", mb: 0 }}>
                {React.cloneElement(g.icon, { sx: { fontSize: 40 } })}
              </Box>
              <Box>
                <Typography sx={{ ...labelStyle, fontSize: "0.85rem" }}>{g.label}</Typography>
                <Typography className="premium-number" sx={{ ...numberStyle, fontSize: "4.5rem" }}>{g.val}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}