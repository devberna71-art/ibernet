import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Chart from "react-apexcharts";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

const cardStyle = {
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
  padding: {
    xs: "20px",
    sm: "24px",
    md: "32px",
  },
  display: "flex",
  flexDirection: "column",
  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "#cbd5e1",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
  }
};

const emptyStateStyle = {
  height: 350,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
  gap: 1.5,
  fontFamily: '"Inter", sans-serif'
};

export default function Graficos() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("6m");

  async function carregarGraficos(periodoSelecionado = periodo) {
    try {
      setLoading(true);
      const response = await api.get(`/graficos?periodo=${periodoSelecionado}`);
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados dos gráficos:", error);
      setDados(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarGraficos();
  }, []);

  const handlePeriodo = async (e) => {
    const novoPeriodo = e.target.value;
    setPeriodo(novoPeriodo);
    carregarGraficos(novoPeriodo);
  };

  if (loading) {
    return (
      <Box sx={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress size={45} thickness={4} sx={{ color: "#4f46e5" }} />
      </Box>
    );
  }

  const ultimosMeses = dados?.financeiro?.ultimosMeses || [];
  const tiposContribuicao = dados?.financeiro?.tiposContribuicao || [];
  const faixasEtarias = dados?.faixasEtarias || {};

  const totalContribuicoes = tiposContribuicao.reduce(
    (acc, item) => acc + Number(item.valor || 0),
    0
  );

  const temDadosLinha = ultimosMeses.length > 0;
  const temDadosDonut = tiposContribuicao.length > 0 && totalContribuicoes > 0;
  const temDadosBarra = Object.keys(faixasEtarias).length > 0;

  // ======================================================
  // CONFIGURAÇÃO CONFIG: LINEAR / AREA GRAPH
  // ======================================================
  const lineOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: "#64748b",
      dropShadow: {
        enabled: true,
        top: 12,
        left: 0,
        blur: 8,
        color: "#4f46e5",
        opacity: 0.18
      },
      animations: { enabled: true, easing: "easeout", speed: 800 }
    },
    colors: ["#4f46e5"],
    stroke: { curve: "smooth", width: 4, lineCap: "round" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.01,
        stops: [0, 95, 100],
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 3,
      hover: { size: 6 }
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 6,
      padding: { left: 10, right: 10, bottom: 0, top: 0 }
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `${Number(val).toLocaleString()} Kz` },
      style: { fontSize: "13px", fontFamily: '"Inter", sans-serif' }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ultimosMeses.map((item) => item.mes || ""),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontWeight: 600, fontSize: "11px" } }
    },
    yaxis: {
      labels: {
        formatter: (val) => `${Number(val).toLocaleString()}`,
        style: { fontSize: "11px", fontWeight: 500 }
      }
    },
    legend: { show: false }
  };

  const lineSeries = [{
    name: "Contribuições",
    data: ultimosMeses.map((item) => item.valor || 0)
  }];

  // ======================================================
  // CONFIGURAÇÃO CONFIG: DONUT GRAPH
  // ======================================================
  const donutOptions = {
    labels: tiposContribuicao.map((item) => item.nome || "Outros"),
    colors: ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    chart: { 
      background: "transparent",
      dropShadow: {
        enabled: true,
        top: 8,
        left: 0,
        blur: 10,
        color: "#0f172a",
        opacity: 0.04
      }
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      labels: { colors: "#64748b" },
      markers: { radius: 12, width: 10, height: 10 },
      itemMargin: { horizontal: 10, vertical: 5 }
    },
    stroke: { width: 3, colors: ["#ffffff"] },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Volume Total",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: '"Inter", sans-serif',
              formatter: () => `${Number(totalContribuicoes).toLocaleString()} Kz`
            },
            value: {
              color: "#0f172a",
              fontWeight: 800,
              fontSize: "20px",
              fontFamily: '"Inter", sans-serif',
              formatter: (val) => `${Number(val).toLocaleString()}`
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: { position: "top" }
      }
    }],
    dataLabels: { enabled: false }
  };

  const donutSeries = tiposContribuicao.map((item) => item.valor || 0);

  // ======================================================
  // CONFIGURAÇÃO CONFIG: BAR GRAPH
  // ======================================================
  const barOptions = {
    chart: {
      toolbar: { show: false },
      foreColor: "#64748b",
      background: "transparent",
      dropShadow: {
        enabled: true,
        top: 6,
        left: 0,
        blur: 6,
        color: "#4f46e5",
        opacity: 0.12
      }
    },
    colors: ["#4f46e5"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "32%",
        distributed: false,
      }
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 6,
      padding: { bottom: 0, top: 0 }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: Object.keys(faixasEtarias),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontWeight: 600, fontSize: "11px" } }
    },
    yaxis: {
      labels: {
        formatter: (val) => Number(val).toLocaleString(),
        style: { fontSize: "11px" }
      }
    },
    tooltip: {
      theme: "light",
      style: { fontSize: "12px", fontFamily: '"Inter", sans-serif' }
    },
    legend: { show: false }
  };

  const barSeries = [{
    name: "Membros",
    data: Object.values(faixasEtarias)
  }];

  return (
    <Grid container spacing={4}>
      
      {/* CARD 1: GRÁFICO DE LINHA (RESUMO FINANCEIRO) */}
      <Grid item xs={12} xl={8}>
        <Box sx={cardStyle}>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #4f46e5, #8b5cf6)", boxShadow: "0 8px 16px -4px rgba(79, 70, 229, 0.4)" }}>
                <TrendingUpRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: '"Inter", sans-serif' }}>
                  Resumo Financeiro
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 500 }}>
                  Evolução das contribuições ao longo do tempo
                </Typography>
              </Box>
            </Stack>

            <Select
              value={periodo}
              onChange={handlePeriodo}
              size="small"
              sx={{
                width: { xs: "100%", sm: 160 },
                height: 40,
                borderRadius: "10px",
                background: "#f8fafc",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#334155",
                "& fieldset": { border: "1px solid #e2e8f0" },
              }}
            >
              <MenuItem value="30d">Últimos 30 dias</MenuItem>
              <MenuItem value="3m">Últimos 3 meses</MenuItem>
              <MenuItem value="6m">Últimos 6 meses</MenuItem>
              <MenuItem value="1a">Último 1 ano</MenuItem>
            </Select>
          </Stack>

          <Box sx={{ height: 350, width: "100%" }}>
            {temDadosLinha ? (
              <Chart options={lineOptions} series={lineSeries} type="area" height="100%" width="100%" />
            ) : (
              <Box sx={emptyStateStyle}>
                <TrendingUpRoundedIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Nenhum fluxo financeiro registrado.</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>

      {/* CARD 2: GRÁFICO DONUT (CATEGORIAS) */}
      <Grid item xs={12} xl={4}>
        <Box sx={cardStyle}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #06b6d4, #4f46e5)", boxShadow: "0 8px 16px -4px rgba(6, 182, 212, 0.4)" }}>
              <DonutLargeRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: '"Inter", sans-serif' }}>
                Contribuições
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 500 }}>
                Divisão proporcional por categoria
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {temDadosDonut ? (
              <Chart options={donutOptions} series={donutSeries} type="donut" height="100%" width="100%" />
            ) : (
              <Box sx={emptyStateStyle}>
                <DonutLargeRoundedIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Sem dados disponíveis.</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>

      {/* CARD 3: GRÁFICO DE BARRAS (FAIXA ETÁRIA) */}
      <Grid item xs={12}>
        <Box sx={cardStyle}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8b5cf6, #4f46e5)", boxShadow: "0 8px 16px -4px rgba(139, 92, 246, 0.4)" }}>
              <Groups2RoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", fontFamily: '"Inter", sans-serif' }}>
                Demografia de Membros
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 500 }}>
                Distribuição volumétrica por faixas etárias
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ height: 300, width: "100%" }}>
            {temDadosBarra ? (
              <Chart options={barOptions} series={barSeries} type="bar" height="100%" width="100%" />
            ) : (
              <Box sx={emptyStateStyle}>
                <BarChartRoundedIcon sx={{ fontSize: 40, opacity: 0.4 }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>Nenhum dado demográfico indexado.</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>

    </Grid>
  );
}