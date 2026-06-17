// src/components/DashboardCards.jsx
import React from "react";
import { Grid, Typography, Box, Stack } from "@mui/material";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import DonutSmallRoundedIcon from "@mui/icons-material/DonutSmallRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

const calculateGrowth = (atual, anterior) => {
  const c = Number(atual || 0);
  const p = Number(anterior || 0);

  if (p <= 0 && c > 0) return { value: 100, positive: true };
  if (p <= 0) return { value: 0, positive: true };

  const growth = ((c - p) / p) * 100;

  return {
    value: Math.abs(Number(growth).toFixed(1)),
    positive: growth >= 0,
  };
};

const StatCard = ({
  icon,
  flareColor,
  title,
  value,
  growth,
  positive,
  valueColor,
  isFullWidth,
}) => (
  <Box
    sx={{
      position: "relative",
      height: isFullWidth ? 140 : 130,
      p: 3,
      borderRadius: "20px",
      background: "linear-gradient(145deg, #ffffff 0%, #fcfdfe 100%)",
      border: "1px solid #eef2f6",
      boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.015), 0 4px 12px -2px rgba(15, 23, 42, 0.005)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      cursor: "default",
      overflow: "hidden",

      // Linha de progresso decorativa e responsiva na base do card
      "&::before": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "30px",
        height: "3px",
        background: flareColor,
        borderRadius: "0 4px 4px 0",
        opacity: 0.7,
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        zIndex: 2,
      },

      // Ambient Aura Glow (Brilho difuso de fundo)
      "&::after": {
        content: '""',
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: "160px",
        height: "160px",
        background: `radial-gradient(circle, ${flareColor}0F 0%, transparent 70%)`,
        opacity: 1,
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: "none",
        zIndex: 1,
      },

      "&:hover": {
        transform: "translateY(-5px)",
        borderColor: "#cbd5e1",
        boxShadow: "0 20px 35px -5px rgba(15, 23, 42, 0.06), 0 10px 20px -5px rgba(15, 23, 42, 0.02)",
        "&::before": {
          width: "100%",
          borderRadius: "0 0 20px 20px",
        },
        "&::after": {
          transform: "scale(1.3) translate(-10px, 10px)",
          background: `radial-gradient(circle, ${flareColor}18 0%, transparent 75%)`,
        },
        "& .premium-icon-wrapper": {
          background: flareColor,
          color: "#ffffff",
          boxShadow: `0 8px 20px -4px ${flareColor}50`,
          transform: "scale(1.05)",
        },
      },
    }}
  >
    {/* Camada de conteúdo isolada do fundo */}
    <Box sx={{ zIndex: 3, position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      
      {/* Topo do Card */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" spacing={1.8} alignItems="center">
          {/* Caixa do Ícone */}
          <Box
            className="premium-icon-wrapper"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: "12px",
              background: `${flareColor}0D`,
              color: flareColor,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              "& svg": { fontSize: 20 }
            }}
          >
            {icon}
          </Box>
          
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            {title}
          </Typography>
        </Stack>

        {/* Micro-badge de Tendência */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.3}
          sx={{
            px: "10px",
            py: "4px",
            borderRadius: "8px",
            background: positive ? "rgba(16, 185, 129, 0.06)" : "rgba(239, 68, 68, 0.06)",
            border: positive ? "1px solid rgba(16, 185, 129, 0.12)" : "1px solid rgba(239, 68, 68, 0.12)",
          }}
        >
          {positive ? (
            <TrendingUpRoundedIcon sx={{ fontSize: 13, color: "#10b981" }} />
          ) : (
            <TrendingDownRoundedIcon sx={{ fontSize: 13, color: "#ef4444" }} />
          )}
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: positive ? "#10b981" : "#ef4444",
              fontFamily: '"JetBrains Mono", system-ui, monospace',
            }}
          >
            {growth}%
          </Typography>
        </Stack>
      </Stack>

      {/* Seção do Valor Numérico Principal */}
      <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
        <Typography
          sx={{
            fontSize: isFullWidth ? { xs: "2.2rem", md: "2.6rem" } : { xs: "1.9rem", md: "2.3rem" },
            fontWeight: 800,
            letterSpacing: "-1.2px",
            color: valueColor || "#0f172a",
            fontFamily: '"Inter", system-ui, sans-serif',
            lineHeight: 1,
            background: !valueColor ? "linear-gradient(180deg, #0f172a 30%, #475569 100%)" : "none",
            WebkitBackgroundClip: !valueColor ? "text" : "none",
            WebkitTextFillColor: !valueColor ? "transparent" : "initial",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  </Box>
);

function DashboardCards({ dados }) {
  const totalMembros = Number(dados?.membros?.total || 0);
  const membrosAnterior = Number(dados?.membros?.mesAnterior || 0);

  const novosMembros = Number(dados?.novosMembrosMes || 0);
  const novosAnterior = Number(dados?.novosMembrosMesAnterior || 0);

  const contrib = Number(dados?.financeiro?.totalContribuicoesMes || 0);
  const contribAnt = Number(dados?.financeiro?.totalContribuicoesMesAnterior || 0);

  const desp = Number(dados?.financeiro?.despesasMes || 0);
  const despAnt = Number(dados?.financeiro?.despesasMesAnterior || 0);

  const saldo = Number(dados?.financeiro?.saldoFinanceiro || 0);
  const saldoAnt = Number(dados?.financeiro?.saldoFinanceiroAnterior || 0);

  const membrosGrowth = calculateGrowth(totalMembros, membrosAnterior);
  const novosGrowth = calculateGrowth(novosMembros, novosAnterior);
  const contribGrowth = calculateGrowth(contrib, contribAnt);
  const despGrowth = calculateGrowth(desp, despAnt);
  const saldoGrowth = calculateGrowth(saldo, saldoAnt);

  return (
    <Grid container spacing={3.5}>
      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          icon={<PeopleAltRoundedIcon />}
          flareColor="#6366f1" // Indigo Realizado
          title="Total de Membros"
          value={totalMembros.toLocaleString()}
          growth={membrosGrowth.value}
          positive={membrosGrowth.positive}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          icon={<PersonAddAltRoundedIcon />}
          flareColor="#10b981" // Esmeralda Pureza
          title="Novos Membros"
          value={novosMembros.toLocaleString()}
          growth={novosGrowth.value}
          positive={novosGrowth.positive}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          icon={<PaidRoundedIcon />}
          flareColor="#f59e0b" // Ouro Dinâmico
          title="Contribuições"
          value={`${contrib.toLocaleString()} Kz`}
          growth={contribGrowth.value}
          positive={contribGrowth.positive}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <StatCard
          icon={<DonutSmallRoundedIcon />}
          flareColor="#ef4444" // Crimson Nobre
          title="Despesas"
          value={`${desp.toLocaleString()} Kz`}
          growth={despGrowth.value}
          positive={!despGrowth.positive} 
        />
      </Grid>

      <Grid item xs={12}>
        <StatCard
          icon={<AccountBalanceRoundedIcon />}
          flareColor={saldo >= 0 ? "#10b981" : "#ef4444"}
          title="Balanço Patrimonial Consolidado"
          value={`${saldo.toLocaleString()} Kz`}
          growth={saldoGrowth.value}
          positive={saldoGrowth.positive}
          valueColor={saldo >= 0 ? null : "#ef4444"} 
          isFullWidth={true}
        />
      </Grid>
    </Grid>
  );
}

export default DashboardCards;