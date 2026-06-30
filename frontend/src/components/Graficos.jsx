import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";

// Importações do Recharts para substituir o ApexCharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

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

const CoresDonut = ["#D97A4D", "#5C8A5C", "#8B8378", "#B5332C", "#C4A882", "#A66B47"];

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
        <CircularProgress size={45} thickness={4} sx={{ color: "#D97A4D" }} />
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

  // Formatação dos dados de faixas etárias de Objeto para Array (exigido pelo Recharts)
  const dadosBarraFormatados = Object.keys(faixasEtarias).map((chave) => ({
    faixa: chave,
    Membros: faixasEtarias[chave],
  }));

  return (
    <Grid container spacing={4}>
      
      {/* CARD 1: GRÁFICO DE ÁREA (RESUMO FINANCEIRO) */}
      <Grid item xs={12} xl={8}>
        <Box sx={cardStyle}>
          <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" spacing={2} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #D97A4D, #A66B47)", boxShadow: "0 8px 16px -4px rgba(79, 70, 229, 0.4)" }}>
                <TrendingUpRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#211D19", fontFamily: '"Inter", sans-serif' }}>
                  Resumo Financeiro
                </Typography>
                <Typography sx={{ color: "#8B8378", fontSize: "0.82rem", fontWeight: 500 }}>
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ultimosMeses} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97A4D" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D97A4D" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="mes" stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} style={{ fontWeight: 600 }} />
                  <YAxis stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => Number(val).toLocaleString()} />
                  <ChartTooltip 
                    formatter={(val) => [`${Number(val).toLocaleString()} Kz`, "Contribuições"]}
                    contentStyle={{ fontFamily: '"Inter", sans-serif', borderRadius: '8px', borderColor: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#D97A4D" strokeWidth={4} fillOpacity={1} fill="url(#colorValor)" />
                </AreaChart>
              </ResponsiveContainer>
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
            <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #5C8A5C, #D97A4D)", boxShadow: "0 8px 16px -4px rgba(6, 182, 212, 0.4)" }}>
              <DonutLargeRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#211D19", fontFamily: '"Inter", sans-serif' }}>
                Contribuições
              </Typography>
              <Typography sx={{ color: "#8B8378", fontSize: "0.82rem", fontWeight: 500 }}>
                Divisão proporcional por categoria
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {temDadosDonut ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tiposContribuicao}
                    dataKey="valor"
                    nameKey="nome"
                    cx="50%"
                    cy="45%"
                    innerRadius="68%"
                    outerRadius="85%"
                    paddingAngle={4}
                  >
                    {tiposContribuicao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CoresDonut[index % CoresDonut.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(val) => `${Number(val).toLocaleString()} Kz`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: '"Inter", sans-serif' }} />
                </PieChart>
              </ResponsiveContainer>
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
            <Box sx={{ width: 40, height: 40, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #C4A882, #D97A4D)", boxShadow: "0 8px 16px -4px rgba(139, 92, 246, 0.4)" }}>
              <Groups2RoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.15rem", fontWeight: 800, color: "#211D19", fontFamily: '"Inter", sans-serif' }}>
                Demografia de Membros
              </Typography>
              <Typography sx={{ color: "#8B8378", fontSize: "0.82rem", fontWeight: 500 }}>
                Distribuição volumétrica por faixas etárias
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ height: 300, width: "100%" }}>
            {temDadosBarra ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarraFormatados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="6 6" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="faixa" stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} style={{ fontWeight: 600 }} />
                  <YAxis stroke="#8B8378" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => Number(val).toLocaleString()} />
                  <ChartTooltip contentStyle={{ fontFamily: '"Inter", sans-serif', borderRadius: '8px', borderColor: '#e2e8f0' }} />
                  <Bar dataKey="Membros" fill="#D97A4D" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
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